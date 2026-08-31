export interface HttpErrorLog {
  status?: number;
  url?: string;
  durationMs: number;
}

export function logHttpError(log: HttpErrorLog): void {
  console.error('[http-error]', JSON.stringify(log));
}
