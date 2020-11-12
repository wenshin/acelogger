import { isCountEvent, getLogLevelByStatus } from '.';
import { LogLevel, CanonicalCode, EventType } from './api';

test('utils::isCountEvent', () => {
  expect(isCountEvent({ type: EventType.Log })).toBeFalsy();
  expect(isCountEvent({ type: EventType.Event })).toBeTruthy();
  expect(isCountEvent({ type: EventType.Tracing })).toBeTruthy();
  expect(isCountEvent({ type: EventType.Metric })).toBeFalsy();
});

test('utils::getLogLevelByStatus', () => {
  expect(getLogLevelByStatus(CanonicalCode.OK)).toBe(LogLevel.Debug);
  expect(getLogLevelByStatus(CanonicalCode.INTERNAL)).toBe(LogLevel.Error);
  expect(getLogLevelByStatus(CanonicalCode.UNAVAILABLE)).toBe(LogLevel.Error);
  expect(getLogLevelByStatus(CanonicalCode.RESOURCE_EXHAUSTED)).toBe(
    LogLevel.Error
  );
  expect(getLogLevelByStatus(CanonicalCode.UNAUTHENTICATED)).toBe(
    LogLevel.Warn
  );
});
