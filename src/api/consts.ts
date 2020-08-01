export enum EventType {
  Log = 'log',
  Store = 'store',
  Count = 'count',
  Timing = 'timing',
  Start = 'start',
  End = 'end'
}

export enum AlertLevel {
  Debug,
  Info,
  Warn,
  Error
}

export enum ExportResult {
  SUCCESS,
  FAILED_NOT_RETRYABLE,
  FAILED_RETRYABLE
}
