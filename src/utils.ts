import { TimeInput, CanonicalCode, LogLevel } from './api';

export function isTimeInputHrTime(time: TimeInput): boolean {
  return Array.isArray(time) && time.length === 2;
}

export function getMillisecondsTime(time: TimeInput): number {
  return time && isTimeInputHrTime(time)
    ? time[0] * 1e3 + time[1] / 1e6
    : (time as number);
}

export function getLogLevelByStatus(status: CanonicalCode): LogLevel {
  switch (status) {
    case CanonicalCode.OK:
      // success status use debug level
      return LogLevel.Debug;
    case CanonicalCode.INTERNAL:
    case CanonicalCode.RESOURCE_EXHAUSTED:
    case CanonicalCode.UNAVAILABLE:
      return LogLevel.Error;
    default:
      return LogLevel.Warn;
  }
}
