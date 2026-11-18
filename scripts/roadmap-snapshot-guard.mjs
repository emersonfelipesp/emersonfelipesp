export function assertRoadmapNotErased(issueCount, previous) {
  if (issueCount !== 0) return;
  if (!previous || typeof previous !== "object") return;
  if (!Array.isArray(previous.nodes) || previous.nodes.length === 0) return;
  throw new Error("Refusing to replace a populated roadmap with an empty issue response; verify the reader's issue permissions.");
}
