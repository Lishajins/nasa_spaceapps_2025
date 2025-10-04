import { format } from "date-fns";

export function formatISO(date) {
  if (!date) return null;
  return format(new Date(date), "yyyy-MM-dd");
}
