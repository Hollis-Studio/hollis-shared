#!/usr/bin/env node
/**
 * Verifies the six consent legal documents inside a PACKED contracts tarball.
 *
 * Why the tarball and not the local build: `npm pack` and `npm publish` ship
 * whatever is already in `packages/contracts/dist`. They do NOT run
 * `prepublishOnly` (only `prepack`/`prepare` run on pack), so a dist built
 * before the last legal text edit publishes silently. Consumers then render
 * document text whose `contentHash` no longer matches what the admin signing
 * flow stores in ConsentRecord, and consent becomes unprovable.
 *
 * Checks, for every document in the packed DOCUMENT_REGISTRY:
 *   1. the registry contains exactly the six expected consent documents;
 *   2. the packed `meta.contentHash` is the first 8 hex chars of sha256 over
 *      the packed `content` (catches a hand-edited hash);
 *   3. the packed `meta.version` / `meta.contentHash` equal the values declared
 *      in the source `.ts` module (catches a stale dist inside the tarball).
 *
 * Usage:  node scripts/verify-packed-legal-docs.mjs <path-to-contracts-tgz>
 * Read-only apart from a self-cleaning temp extraction directory.
 */
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  unlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIR = join(
  REPO_ROOT,
  "packages/contracts/admin/legal-documents",
);

/**
 * The six consent documents the signing flow requires. Hardcoded on purpose:
 * adding a seventh signed document must be a deliberate edit here, so it cannot
 * reach the registry without a hash check.
 */
const EXPECTED_DOCS = [
  { type: "MEMBERSHIP_AGREEMENT", module: "membershipAgreement" },
  { type: "LIABILITY_WAIVER", module: "liabilityWaiver" },
  { type: "INFORMED_CONSENT", module: "informedConsent" },
  { type: "ELECTRONIC_COMMS_CONSENT", module: "electronicCommsConsent" },
  { type: "PHOTO_VIDEO_RELEASE", module: "photoVideoRelease" },
  { type: "HIPAA_NPP", module: "hipaaNpp" },
];

/** Modules in the legal-documents directory that are not signed documents. */
const NON_DOCUMENT_MODULES = new Set([
  "index",
  "rendering",
  "enrollmentSummary",
]);

const contentHashOf = (content) =>
  createHash("sha256").update(content).digest("hex").slice(0, 8);

const failures = [];
const fail = (message) => failures.push(message);

const lstatSafe = (path) => {
  try {
    return lstatSync(path);
  } catch {
    return undefined;
  }
};

/** Reads `version` / `contentHash` out of a source module's `export const meta`. */
function sourceMeta(moduleName) {
  const file = join(SOURCE_DIR, `${moduleName}.ts`);
  const text = readFileSync(file, "utf8");
  // Some modules close the meta object with `} as const;`, others with `};`.
  const block = text.match(
    /export const meta = \{([\s\S]*?)\n\}(?: as const)?;/,
  );
  if (!block) throw new Error(`Cannot find 'export const meta' in ${file}`);
  // Strip comments so a documented field name inside a doc comment cannot be
  // mistaken for the field itself.
  const body = block[1]
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
  const field = (name) => {
    const match = body.match(new RegExp(`\\n\\s*${name}:\\s*"([^"]*)"`));
    if (!match) throw new Error(`${moduleName}.meta is missing '${name}'`);
    return match[1];
  };
  return { version: field("version"), contentHash: field("contentHash") };
}

async function main() {
  const tarball = process.argv[2];
  if (!tarball) {
    console.error(
      "Usage: node scripts/verify-packed-legal-docs.mjs <path-to-contracts-tgz>",
    );
    process.exit(1);
  }
  const tarballPath = resolve(tarball);
  if (!existsSync(tarballPath)) {
    console.error(`Tarball not found: ${tarballPath}`);
    process.exit(1);
  }

  // Source directory must hold exactly the six expected document modules, so a
  // new document cannot be added to the registry without updating this script.
  const sourceModules = readdirSync(SOURCE_DIR)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => f.replace(/\.ts$/, ""))
    .filter((name) => !NON_DOCUMENT_MODULES.has(name))
    .sort();
  const expectedModules = EXPECTED_DOCS.map((d) => d.module).sort();
  if (sourceModules.join(",") !== expectedModules.join(",")) {
    fail(
      `source legal-documents modules ${JSON.stringify(sourceModules)} do not ` +
        `match the six this script verifies ${JSON.stringify(expectedModules)}`,
    );
  }

  const workDir = mkdtempSync(join(tmpdir(), "hollis-packed-legal-"));
  try {
    const extract = spawnSync("tar", ["-xzf", tarballPath, "-C", workDir], {
      stdio: "inherit",
    });
    if (extract.status !== 0) {
      throw new Error(`tar failed to extract ${tarballPath}`);
    }

    // The packed membership agreement imports the offer sheet, which imports
    // zod. Point the extracted package at the repo's installed modules instead
    // of installing anything.
    const repoModules = join(REPO_ROOT, "node_modules");
    if (!existsSync(repoModules)) {
      throw new Error(
        `${repoModules} is missing — run the install step before verifying`,
      );
    }
    symlinkSync(repoModules, join(workDir, "package", "node_modules"), "dir");

    const entry = join(
      workDir,
      "package/dist/admin/legal-documents/index.js",
    );
    if (!existsSync(entry)) {
      throw new Error(
        `Packed tarball has no dist/admin/legal-documents/index.js — the ` +
          `contracts build did not run before packing`,
      );
    }
    const packed = await import(pathToFileURL(entry).href);
    const registry = packed.DOCUMENT_REGISTRY;
    const packedTypes = Object.keys(registry).sort();
    const expectedTypes = EXPECTED_DOCS.map((d) => d.type).sort();
    if (packedTypes.join(",") !== expectedTypes.join(",")) {
      fail(
        `packed DOCUMENT_REGISTRY has ${JSON.stringify(packedTypes)}, ` +
          `expected ${JSON.stringify(expectedTypes)}`,
      );
    }

    for (const { type, module } of EXPECTED_DOCS) {
      const doc = registry[type];
      if (!doc) {
        fail(`${type}: missing from the packed registry`);
        continue;
      }
      const source = sourceMeta(module);
      const computed = contentHashOf(doc.content);
      const ok =
        doc.meta.contentHash === computed &&
        doc.meta.version === source.version &&
        doc.meta.contentHash === source.contentHash;

      console.log(
        `${ok ? "ok  " : "FAIL"} ${type.padEnd(26)} v${String(
          doc.meta.version,
        ).padEnd(8)} packed=${doc.meta.contentHash} computed=${computed} source=v${
          source.version
        }/${source.contentHash}`,
      );

      if (doc.meta.contentHash !== computed) {
        fail(
          `${type}: declared contentHash ${doc.meta.contentHash} does not ` +
            `match sha256 of the packed text (${computed})`,
        );
      }
      if (doc.meta.version !== source.version) {
        fail(
          `${type}: packed version ${doc.meta.version} != source version ` +
            `${source.version} — the tarball holds a stale dist`,
        );
      }
      if (doc.meta.contentHash !== source.contentHash) {
        fail(
          `${type}: packed contentHash ${doc.meta.contentHash} != source ` +
            `contentHash ${source.contentHash} — the tarball holds a stale dist`,
        );
      }
    }
  } finally {
    // Unlink the node_modules symlink explicitly before the recursive remove,
    // so no recursive-delete implementation can ever walk into the real
    // repository node_modules.
    const linkPath = join(workDir, "package", "node_modules");
    if (lstatSafe(linkPath)?.isSymbolicLink()) unlinkSync(linkPath);
    rmSync(workDir, { recursive: true, force: true });
  }

  if (failures.length) {
    console.error(
      `\nPacked legal document verification FAILED (${failures.length}):`,
    );
    for (const message of failures) console.error(`  - ${message}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `\nAll ${EXPECTED_DOCS.length} legal documents in the packed tarball ` +
      `match their source version and hash.`,
  );
}

await main();
