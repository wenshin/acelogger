import { isMetricEvent } from '.';
import { EventType } from './api';

test('utils::isMetricEvent', () => {
  expect(isMetricEvent({ type: EventType.Log })).toBeFalsy();
  expect(isMetricEvent({ type: EventType.Start })).toBeFalsy();
  expect(isMetricEvent({ type: EventType.End })).toBeFalsy();
  expect(isMetricEvent({ type: EventType.Store })).toBeTruthy();
  expect(isMetricEvent({ type: EventType.Count })).toBeTruthy();
  expect(isMetricEvent({ type: EventType.Timing })).toBeTruthy();
});
