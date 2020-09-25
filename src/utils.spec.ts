import { isMetricEvent, getAlertLevelByStatus } from '.';
import { AlertLevel, CanonicalCode, EventType } from './api';

test('utils::isMetricEvent', () => {
  expect(isMetricEvent({ type: EventType.Log })).toBeFalsy();
  expect(isMetricEvent({ type: EventType.Start })).toBeTruthy();
  expect(isMetricEvent({ type: EventType.End })).toBeTruthy();
  expect(isMetricEvent({ type: EventType.Store })).toBeTruthy();
  expect(isMetricEvent({ type: EventType.Count })).toBeTruthy();
  expect(isMetricEvent({ type: EventType.Timing })).toBeTruthy();
});

test('utils::getAlertLevelByStatus', () => {
  expect(getAlertLevelByStatus(CanonicalCode.OK)).toBe(AlertLevel.Debug);
  expect(getAlertLevelByStatus(CanonicalCode.INTERNAL)).toBe(AlertLevel.Error);
  expect(getAlertLevelByStatus(CanonicalCode.UNAVAILABLE)).toBe(
    AlertLevel.Error
  );
  expect(getAlertLevelByStatus(CanonicalCode.RESOURCE_EXHAUSTED)).toBe(
    AlertLevel.Error
  );
  expect(getAlertLevelByStatus(CanonicalCode.UNAUTHENTICATED)).toBe(
    AlertLevel.Warn
  );
});
