import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { parse } from "yaml";

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const lockfile = parse(await readFile("pnpm-lock.yaml", "utf8"));

function versionParts(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  assert.ok(match, `expected a numeric release version, received ${version}`);
  return match.slice(1).map(Number);
}

function isAtLeast(version, minimum) {
  const actualParts = versionParts(version);
  const minimumParts = versionParts(minimum);
  for (let index = 0; index < actualParts.length; index += 1) {
    if (actualParts[index] !== minimumParts[index]) {
      return actualParts[index] > minimumParts[index];
    }
  }
  return true;
}

function lockedVersions(packageName) {
  assert.ok(lockfile.packages && typeof lockfile.packages === "object");
  const prefix = `${packageName}@`;
  return Object.keys(lockfile.packages)
    .filter((record) => record.startsWith(prefix))
    .map((record) => record.slice(prefix.length).split("(", 1)[0]);
}

function isSecureBraceExpansion(version) {
  const branchFloors = new Map([
    ["1", "1.1.18"],
    ["2", "2.1.4"],
    ["3", "3.0.6"],
    ["5", "5.0.9"],
  ]);
  const floor = branchFloors.get(versionParts(version)[0].toString());
  return floor !== undefined && isAtLeast(version, floor);
}

test("direct framework and security overrides use reviewed floors", () => {
  assert.equal(packageJson.dependencies.next, "16.3.3");
  assert.equal(packageJson.devDependencies["eslint-config-next"], "16.3.3");
  assert.deepEqual(packageJson.pnpm.overrides, {
    "brace-expansion@>=4.0.0": "^5.0.9",
    "js-yaml@>=4.0.0 <5.0.0": "^4.3.2",
    "fast-uri@>=3.0.0 <4.0.0": "^3.1.6",
    "fflate@>=0.6.0 <0.7.0": "^0.6.11",
    "fflate@>=0.8.0 <0.9.0": "^0.8.3",
    mysql2: "^3.23.1",
    sharp: "^0.35.4",
    "@swc/helpers": "^0.5.23",
    "deepmerge-ts": "^8.0.1",
  });
});

test("the lock contains no package below a reviewed security floor", () => {
  const floors = new Map([
    ["next", "16.3.3"],
    ["js-yaml", "4.3.2"],
    ["sharp", "0.35.4"],
    ["fast-uri", "3.1.6"],
    ["mysql2", "3.23.1"],
    ["@swc/helpers", "0.5.23"],
    ["deepmerge-ts", "8.0.1"],
  ]);
  for (const [packageName, floor] of floors) {
    const versions = lockedVersions(packageName);
    assert.ok(versions.length > 0, `${packageName} is absent from the lock`);
    for (const version of versions) {
      assert.ok(isAtLeast(version, floor), `${packageName}@${version} is below ${floor}`);
    }
  }

  const braceExpansionVersions = lockedVersions("brace-expansion");
  assert.ok(braceExpansionVersions.length > 0, "brace-expansion is absent from the lock");
  for (const version of braceExpansionVersions) {
    assert.ok(
      isSecureBraceExpansion(version),
      `brace-expansion@${version} is below its supported security floor`,
    );
  }

  const fflateVersions = lockedVersions("fflate");
  assert.ok(fflateVersions.length > 0, "fflate is absent from the lock");
  for (const version of fflateVersions) {
    const secure = isAtLeast(version, "0.8.3") ||
      (version.startsWith("0.6.") && isAtLeast(version, "0.6.11"));
    assert.ok(secure, `fflate@${version} is below its supported security floor`);
  }
});

test("brace-expansion advisory floors reject each vulnerable branch boundary", () => {
  const boundaries = [
    ["1.1.17", false],
    ["1.1.18", true],
    ["2.1.3", false],
    ["2.1.4", true],
    ["3.0.5", false],
    ["3.0.6", true],
    ["4.0.2", false],
    ["5.0.8", false],
    ["5.0.9", true],
  ];
  for (const [version, secure] of boundaries) {
    assert.equal(isSecureBraceExpansion(version), secure, version);
  }
});
