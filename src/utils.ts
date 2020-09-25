import {
  TimeInput,
  LoggerEvent,
  EventType,
  CanonicalCode,
  AlertLevel
} from './api';

export function isTimeInputHrTime(time: TimeInput): boolean {
  return Array.isArray(time) && time.length === 2;
}

export function getMillisecondsTime(time: TimeInput): number {
  return time && isTimeInputHrTime(time)
    ? time[0] * 1e3 + time[1] / 1e6
    : (time as number);
}

export function isMetricEvent(evt: LoggerEvent): boolean {
  return (
    evt &&
    (evt.type === EventType.Start ||
      evt.type === EventType.End ||
      evt.type === EventType.Count ||
      evt.type === EventType.Store ||
      evt.type === EventType.Timing)
  );
}

export function getAlertLevelByStatus(status: CanonicalCode): AlertLevel {
  switch (status) {
    case CanonicalCode.OK:
      return AlertLevel.Debug;
    case CanonicalCode.INTERNAL:
    case CanonicalCode.RESOURCE_EXHAUSTED:
    case CanonicalCode.UNAVAILABLE:
      return AlertLevel.Error;
    default:
      return AlertLevel.Warn;
  }
}
