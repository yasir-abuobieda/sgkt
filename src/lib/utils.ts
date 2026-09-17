import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isEventPast(dateString: string) {
  if (!dateString) return false;
  
  let datePart = dateString;
  let timePart = '23:59'; // Default to end of day if no time specified
  
  if (dateString.includes(' | ')) {
    const parts = dateString.split(' | ');
    datePart = parts[0];
    timePart = parts[1];
  }
  
  try {
    const eventDate = new Date(`${datePart}T${timePart}:00`);
    const now = new Date();
    return eventDate < now;
  } catch (e) {
    return false;
  }
}
