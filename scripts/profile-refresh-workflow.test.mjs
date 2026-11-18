import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { parse } from "yaml";

const workflow = parse(readFileSync(".github/workflows/sync-github-data.yml", "utf8"));
const script = workflow.jobs.sync.steps.find(
  (step) => step.name === "Propose checked snapshot refresh",
).run;
const oldSha = "a".repeat(40);
const newSha = "b".repeat(40);
const ownedPull = {
  number: 12,
  headRefName: "automation/github-data-100-1",
  headRefOid: oldSha,
  author: { login: "app/github-actions", is_bot: true },
  isCrossRepository: false,
  mergeStateStatus: "CLEAN",
};

const mock = `#!${process.execPath}
const fs = require("node:fs");
const path = require("node:path");
const tool = path.basename(process.argv[1]);
const args = process.argv.slice(2);
fs.appendFileSync(process.env.CALL_LOG, JSON.stringify([tool, ...args]) + "\\n");
if (tool === "git" && args[0] === "status") {
  if (process.env.HAS_CHANGES === "true") console.log(" M public/github-data/manifest.json");
} else if (tool === "git" && args[0] === "rev-parse") {
  console.log(process.env.NEW_SHA);
} else if (tool === "gh" && args[0] === "pr" && args[1] === "list") {
  console.log(process.env.PULLS);
} else if (tool === "jq") {
  process.exit(127);
} else if (tool === "gh" && args[0] === "api") {
  process.exit(Number(process.env.UPDATE_EXIT));
} else if (tool === "gh" && args[0] === "pr" && args[1] === "view") {
  console.log(process.env.OBSERVED_SHA);
} else if (tool === "gh" && args[0] === "pr" && args[1] === "create") {
  console.log("https://github.com/example/profile/pull/13");
}
`;

function runScenario({ pulls = [], changes = true, updateExit = 0, observedSha = newSha } = {}) {
  const directory = mkdtempSync(path.join(tmpdir(), "profile-refresh-contract-"));
  const callsFile = path.join(directory, "calls.jsonl");
  try {
    for (const tool of ["gh", "git", "sleep", "jq"]) {
      writeFileSync(path.join(directory, tool), mock, { mode: 0o700 });
    }
    writeFileSync(callsFile, "");
    const result = spawnSync("bash", ["-c", script], {
      cwd: directory,
      encoding: "utf8",
      env: {
        ...process.env,
        FORCE_COLOR: "1",
        PATH: `${directory}:${process.env.PATH}`,
        CALL_LOG: callsFile,
        HAS_CHANGES: String(changes),
        PULLS: JSON.stringify(pulls),
        UPDATE_EXIT: String(updateExit),
        NEW_SHA: newSha,
        OBSERVED_SHA: observedSha,
        GH_REPO: "example/profile",
        GITHUB_RUN_ID: "200",
        GITHUB_RUN_ATTEMPT: "1",
      },
    });
    assert.equal(result.error, undefined);
    const lines = readFileSync(callsFile, "utf8").trim();
    const calls = lines ? lines.split("\n").map(JSON.parse) : [];
    assert.equal(calls.some((call) => call[0] === "jq"), false, "The workflow must use the installed Node runtime for JSON parsing");
    return { ...result, calls };
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function matchingCalls(result, prefix) {
  return result.calls.filter((call) => prefix.every((value, index) => call[index] === value));
}

test("unchanged snapshots do not invoke the pull-request API or push", () => {
  const result = runScenario({ changes: false });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(matchingCalls(result, ["gh"]).length, 0);
  assert.equal(matchingCalls(result, ["git", "push"]).length, 0);
});

test("new snapshots require a normal branch push, real CI dispatch, and SHA-bound squash auto-merge", () => {
  const result = runScenario();
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(matchingCalls(result, ["git", "push"]), [
    ["git", "push", "origin", "HEAD:refs/heads/automation/github-data-200-1"],
  ]);
  assert.deepEqual(matchingCalls(result, ["gh", "workflow"]), [
    ["gh", "workflow", "run", "ci.yml", "--ref", "automation/github-data-200-1"],
  ]);
  assert.deepEqual(matchingCalls(result, ["gh", "pr", "merge"]), [
    ["gh", "pr", "merge", "https://github.com/example/profile/pull/13", "--auto", "--squash", "--match-head-commit", newSha],
  ]);
});

test("a current owned pull request prevents duplicate writes and dispatches", () => {
  const result = runScenario({ pulls: [ownedPull] });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(matchingCalls(result, ["gh", "api"]).length, 0);
  assert.equal(matchingCalls(result, ["gh", "workflow"]).length, 0);
  assert.equal(matchingCalls(result, ["git", "push"]).length, 0);
});

test("the legacy GitHub Actions bot login retains the same ownership boundary", () => {
  const result = runScenario({ pulls: [{ ...ownedPull, author: { login: "github-actions[bot]", is_bot: true } }] });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(matchingCalls(result, ["gh", "api"]).length, 0);
  assert.equal(matchingCalls(result, ["gh", "workflow"]).length, 0);
  assert.equal(matchingCalls(result, ["git", "push"]).length, 0);
});

test("a stale owned pull request uses the expected head and dispatches CI only after a new head is observed", () => {
  const result = runScenario({ pulls: [{ ...ownedPull, mergeStateStatus: "BEHIND" }] });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(matchingCalls(result, ["gh", "api"]), [
    ["gh", "api", "--method", "PUT", "repos/example/profile/pulls/12/update-branch", "-f", `expected_head_sha=${oldSha}`],
  ]);
  assert.deepEqual(matchingCalls(result, ["gh", "workflow"]), [
    ["gh", "workflow", "run", "ci.yml", "--ref", ownedPull.headRefName],
  ]);
  assert.equal(matchingCalls(result, ["git", "push"]).length, 0);
  assert.equal(matchingCalls(result, ["gh", "pr", "create"]).length, 0);
});

test("a rejected expected-head update cannot dispatch CI or fall back to another pull request", () => {
  const result = runScenario({ pulls: [{ ...ownedPull, mergeStateStatus: "BEHIND" }], updateExit: 1 });
  assert.notEqual(result.status, 0);
  assert.equal(matchingCalls(result, ["gh", "workflow"]).length, 0);
  assert.equal(matchingCalls(result, ["gh", "pr", "create"]).length, 0);
});

test("an unchanged head times out after twelve observations without dispatch or force push", () => {
  const result = runScenario({ pulls: [{ ...ownedPull, mergeStateStatus: "BEHIND" }], observedSha: oldSha });
  assert.notEqual(result.status, 0);
  assert.equal(matchingCalls(result, ["gh", "pr", "view"]).length, 12);
  assert.equal(matchingCalls(result, ["gh", "workflow"]).length, 0);
  assert.equal(matchingCalls(result, ["git", "push"]).length, 0);
});

test("multiple owned pull requests fail closed", () => {
  const result = runScenario({ pulls: [ownedPull, { ...ownedPull, number: 13 }] });
  assert.notEqual(result.status, 0);
  assert.equal(matchingCalls(result, ["gh", "api"]).length, 0);
  assert.equal(matchingCalls(result, ["git", "push"]).length, 0);
});

test("an invalid owned branch name cannot reach a write operation", () => {
  const result = runScenario({ pulls: [{ ...ownedPull, headRefName: "automation/github-data-unexpected", mergeStateStatus: "BEHIND" }] });
  assert.notEqual(result.status, 0);
  assert.equal(matchingCalls(result, ["gh", "api"]).length, 0);
  assert.equal(matchingCalls(result, ["gh", "workflow"]).length, 0);
});

for (const [name, pull] of [
  ["a human pull request", { ...ownedPull, author: { login: "maintainer" } }],
  ["a pull request from a fork", { ...ownedPull, isCrossRepository: true }],
  ["another bot's pull request", { ...ownedPull, author: { login: "app/dependabot", is_bot: true } }],
  ["a non-bot actor with a matching label", { ...ownedPull, author: { login: "app/github-actions", is_bot: false } }],
]) {
  test(`${name} is never updated by snapshot automation`, () => {
    const result = runScenario({ pulls: [{ ...pull, mergeStateStatus: "BEHIND" }] });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(matchingCalls(result, ["gh", "api"]).length, 0);
    assert.equal(matchingCalls(result, ["gh", "pr", "create"]).length, 1);
  });
}
