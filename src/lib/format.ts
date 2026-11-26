export function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function formatMonthYear(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function playbookTemplate(playbook: {
  title: string;
  requirements: string[];
  checklist: string[];
}): string {
  const requirements = playbook.requirements.map((item) => `- ${item}`).join("\n");
  const checklist = playbook.checklist.map((item) => `- [ ] ${item}`).join("\n");
  return `${playbook.title}\n\nRequirements:\n${requirements}\n\nChecklist:\n${checklist}`;
}

export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
