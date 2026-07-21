export const formatDate = (
  date: string | null
): string => {
  if (!date) {
    return "No due date";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export const isTodoOverdue = (
  dueDate: string | null,
  status: string
): boolean => {
  if (!dueDate || status === "COMPLETED") {
    return false;
  }

  return new Date(dueDate).getTime() < Date.now();
};