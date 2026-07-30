// Lightweight heuristic match between a job's requirements and a candidate's
// skill matrix — purely a client-side display aid, not stored or authoritative.
export function computeMatchScore(job, candidateSkills = []) {
  if (!job) return null;

  const requiredSkills = job.requiredSkills || [];
  const skillNames = candidateSkills.map((skill) => skill.skillName.toLowerCase());
  const categoryMatch = candidateSkills.some((skill) => skill.category === job.category);

  if (requiredSkills.length === 0) {
    return categoryMatch ? 100 : 0;
  }

  const matched = requiredSkills.filter((required) => {
    const needle = required.toLowerCase();
    return skillNames.some((name) => name.includes(needle) || needle.includes(name));
  }).length;

  return Math.round((matched / requiredSkills.length) * 100);
}
