import { getLogLevelByStatus } from '.';
import { LogLevel, CanonicalCode } from './api';

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
