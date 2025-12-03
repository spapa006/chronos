export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  nextBirthday: {
    days: number;
    months: number;
    dayOfWeek: string;
  };
}

export interface HistoricalInsight {
  title: string;
  content: string;
}

export enum LegalPage {
  None,
  Privacy,
  Terms,
  About
}