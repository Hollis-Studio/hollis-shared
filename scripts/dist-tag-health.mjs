#!/usr/bin/env node
/**
 * Read-only dist-tag health report for the four published @hollis-studio packages.
 *
 * Every prerelease in this repo is published with `--tag alpha`; `latest` is
 * never meant to move. It did once: `@hollis-studio/contracts` has a `latest`
 * pointing at 0.2.0-alpha.54 (old studio address, superseded legal-document
 * text). Any consumer with a floating range — `*`, `latest`, or an npx/CI
 * install with no pin — silently resolves off `latest`, so a stale `latest` is
 * a correctness bug, not cosmetics.
 *
 * Reports per package: the workspace version, the `alpha` tag, and every other
 * dist-tag. Flags a non-alpha tag that points at a version OLDER than `alpha`.
 *
 * Usage:  node scripts/dist-tag-health.mjs [--json]
 * Only issues `npm view` (read-only). Exits 1 when a stale tag is found.
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REGISTRY = "https://npm.pkg.github.com";

/** Workspace directory name -> published package name. */
const PACKAGES = [
  "contracts",
  "design-tokens",
  "utils",
  "auth-client",
].map((dir) => ({
  dir,
  name: `@hollis-studio/${dir}`,
  manifest: join(REPO_ROOT, "packages", dir, "package.json"),
}));

/**
 * Compares two semver strings including numeric prerelease identifiers, so
 * 0.2.0-alpha.87 sorts above 0.2.0-alpha.54 (a plain string compare does not).
 * Returns <0, 0 or >0.
 */
function compareVersions(a, b) {
  const split = (v) => {
    const [core, pre = ""] = String(v).split("-", 2);
    return {
      core: core.split(".").map((n) => Number(n) || 0),
      pre: pre ? pre.split(".") : [],
    };
  };
  const left = split(a);
  const right = split(b);
  for (let i = 0; i < 3; i += 1) {
    const diff = (left.core[i] ?? 0) - (right.core[i] ?? 0);
    if (diff !== 0) return diff;
  }
  // A release outranks any prerelease of the same core version.
  if (!left.pre.length && right.pre.length) return 1;
  if (left.pre.length && !right.pre.length) return -1;
  const length = Math.max(left.pre.length, right.pre.length);
  for (let i = 0; i < length; i += 1) {
    const l = left.pre[i];
    const r = right.pre[i];
    if (l === undefined) return -1;
    if (r === undefined) return 1;
    const lNum = /^\d+$/.test(l);
    const rNum = /^\d+$/.test(r);
    if (lNum && rNum) {
      const diff = Number(l) - Number(r);
      if (diff !== 0) return diff;
    } else if (l !== r) {
      return l < r ? -1 : 1;
    }
  }
  return 0;
}

/**
 * Reads a package's dist-tags. `npm view <pkg> dist-tags` resolves the spec via
 * the `latest` tag first and prints NOTHING for a package that has no `latest`
 * (three of the four never had one), so the spec has to name a tag that exists.
 */
function distTags(name) {
  for (const spec of [`${name}@alpha`, `${name}@latest`, name]) {
    const result = spawnSync(
      "npm",
      ["view", spec, "dist-tags", "--json", `--registry=${REGISTRY}`],
      { encoding: "utf8" },
    );
    const stdout = (result.stdout || "").trim();
    if (result.status === 0 && stdout) {
      try {
        const parsed = JSON.parse(stdout);
        if (parsed && typeof parsed === "object") return parsed;
      } catch {
        /* try the next spec */
      }
    }
  }
  return undefined;
}

const asJson = process.argv.includes("--json");
const rows = [];
const problems = [];

for (const pkg of PACKAGES) {
  const local = JSON.parse(readFileSync(pkg.manifest, "utf8")).version;
  const tags = distTags(pkg.name);

  if (!tags) {
    rows.push({ package: pkg.name, local, alpha: null, otherTags: {} });
    problems.push(
      `${pkg.name}: no dist-tags readable from ${REGISTRY} (never published, ` +
        `or the token cannot read this package)`,
    );
    continue;
  }

  const alpha = tags.alpha ?? null;
  const otherTags = Object.fromEntries(
    Object.entries(tags).filter(([tag]) => tag !== "alpha"),
  );
  rows.push({ package: pkg.name, local, alpha, otherTags });

  if (!alpha) {
    problems.push(
      `${pkg.name}: no 'alpha' dist-tag — prereleases must publish with --tag alpha`,
    );
  }
  for (const [tag, version] of Object.entries(otherTags)) {
    if (alpha && compareVersions(version, alpha) < 0) {
      problems.push(
        `${pkg.name}: '${tag}' -> ${version} is OLDER than 'alpha' -> ${alpha}; ` +
          `floating ranges resolve off ${tag === "latest" ? "'latest'" : `'${tag}'`}`,
      );
    }
  }
  if (alpha && compareVersions(local, alpha) > 0) {
    // Not a tag fault: source is ahead of the registry and awaiting a publish.
    rows[rows.length - 1].note = `workspace ${local} is not published yet`;
  }
}

if (asJson) {
  console.log(JSON.stringify({ rows, problems }, null, 2));
} else {
  console.log(
    `${"package".padEnd(32)}${"workspace".padEnd(18)}${"alpha".padEnd(18)}other tags`,
  );
  for (const row of rows) {
    const other = Object.entries(row.otherTags)
      .map(([tag, version]) => `${tag}=${version}`)
      .join(" ");
    console.log(
      `${row.package.padEnd(32)}${String(row.local).padEnd(18)}${String(
        row.alpha ?? "-",
      ).padEnd(18)}${other || "-"}${row.note ? `  (${row.note})` : ""}`,
    );
  }
  if (problems.length) {
    console.error(`\n${problems.length} dist-tag problem(s):`);
    for (const problem of problems) console.error(`  - ${problem}`);
    console.error(
      "\nMoving a tag is a deliberate, separately authorized action: " +
        "npm dist-tag add <pkg>@<version> <tag>",
    );
  } else {
    console.log("\nAll four packages: alpha is the newest tag. No stale tags.");
  }
}

if (problems.length) process.exitCode = 1;
