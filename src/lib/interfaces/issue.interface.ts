import { Severity } from "./severity.interface";

export interface Issue {
  title: string;
  details: string;
  severity: Severity;
  lineNumber?: number;
}
