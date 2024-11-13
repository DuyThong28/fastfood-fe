import { default as dayjs } from "dayjs";

export const formatDate = (date: number) => dayjs(date).format("DD/MM/YYYY");

export function stringToDate(dateString: string): Date | null {
    const date = new Date(dateString);
    
    return isNaN(date.getTime()) ? null : date;
  }

  export function dateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

  export function dateToVNString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${day}-${month}-${year}`;
  }