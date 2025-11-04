import { parse, format } from "date-fns";

export const formatTo12Hour = (time: string) => {
  const parsed = parse(time, "HH:mm", new Date());
  return format(parsed, "hh:mm a"); 
};
