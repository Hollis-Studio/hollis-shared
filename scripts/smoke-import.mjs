import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = fileURLToPath(new URL("..", import.meta.url));

const packageDirs = [
  "packages/contracts",
  "packages/design-tokens",
  "packages/utils",
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function runtimeTarget(exportValue) {
  if (typeof exportValue === "string") return exportValue;
  if (!exportValue || typeof exportValue !== "object") return null;
  return exportValue.import ?? exportValue.default ?? null;
}

function expandWildcardSubpath(packageDir, subpath, exportValue) {
  const target = runtimeTarget(exportValue);
  if (!target || !target.includes("*")) {
    throw new Error(`${packageDir} export ${subpath} has no wildcard runtime target`);
  }

  const normalizedTarget = target.replace(/^\.\//, "");
  const [prefix, suffix = ""] = normalizedTarget.split("*");
  const searchDir = path.join(packageDir, prefix);

  if (!fs.existsSync(searchDir)) {
    throw new Error(`${packageDir} export ${subpath} points at missing directory ${searchDir}`);
  }

  return fs
    .readdirSync(searchDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name.endsWith(suffix))
    .map((name) => name.slice(0, name.length - suffix.length))
    .map((replacement) => subpath.replace("*", replacement));
}

function expandSubpaths(packageDir, subpath, exportValue) {
  return subpath.includes("*")
    ? expandWildcardSubpath(packageDir, subpath, exportValue)
    : [subpath];
}

function specifierFor(packageName, subpath) {
  return subpath === "." ? packageName : `${packageName}/${subpath.replace(/^\.\//, "")}`;
}

const importedSpecifiers = [];

for (const packageDirRelative of packageDirs) {
  const packageDir = path.join(ROOT_DIR, packageDirRelative);
  const packageJson = readJson(path.join(packageDir, "package.json"));
  const entries = Object.entries(packageJson.exports ?? { ".": packageJson.main });

  for (const [subpath, exportValue] of entries) {
    for (const expandedSubpath of expandSubpaths(packageDir, subpath, exportValue)) {
      const specifier = specifierFor(packageJson.name, expandedSubpath);
      await import(specifier);
      importedSpecifiers.push(specifier);
    }
  }
}

process.stdout.write(
  `hollis-shared dist ESM smoke import passed (${importedSpecifiers.length} public entrypoints)\n`,
);
