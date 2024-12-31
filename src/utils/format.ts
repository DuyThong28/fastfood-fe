import { default as dayjs } from "dayjs";

export const formatDate = (date: number) => dayjs(date).format("DD/MM/YYYY");

export function stringToDate(dateString: string): Date | null {
  const date = new Date(dateString);

  // Check if the date is valid
  return isNaN(date.getTime()) ? null : date;
}

export function dateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function dateToVNString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${day}-${month}-${year}`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("de-DE").format(num);
}

export function trimObjectAttributes<T extends object>(obj: T): T {
  const trimmedObj: Partial<T> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (typeof value === "string") {
        trimmedObj[key] = value.trim() as T[Extract<keyof T, string>];
      } else {
        trimmedObj[key] = value;
      }
    }
  }

  return trimmedObj as T;
}
