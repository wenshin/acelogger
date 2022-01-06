import { getLogLevelByStatus, getStatusFromHTTPStatus, stackToFrame } from '.';
import { LogLevel, CanonicalCode, ErrorStackFrame } from './api';

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

test('utils::getStatusFromHTTPStatus', () => {
  expect(getStatusFromHTTPStatus(100)).toBe(CanonicalCode.OK);
  expect(getStatusFromHTTPStatus(200)).toBe(CanonicalCode.OK);
  expect(getStatusFromHTTPStatus(401)).toBe(CanonicalCode.UNAUTHENTICATED);
  expect(getStatusFromHTTPStatus(403)).toBe(CanonicalCode.PERMISSION_DENIED);
  expect(getStatusFromHTTPStatus(404)).toBe(CanonicalCode.NOT_FOUND);
  expect(getStatusFromHTTPStatus(500)).toBe(CanonicalCode.INTERNAL);
  expect(getStatusFromHTTPStatus(501)).toBe(CanonicalCode.UNIMPLEMENTED);
  expect(getStatusFromHTTPStatus(503)).toBe(CanonicalCode.UNAVAILABLE);
  expect(getStatusFromHTTPStatus(504)).toBe(CanonicalCode.DEADLINE_EXCEEDED);
  expect(getStatusFromHTTPStatus(600)).toBe(600);
});

test('utils::stackToFrame no colno', () => {
  const frames: ErrorStackFrame[] = [
    {
      lineno: 10,
      colno: 0,
      filename: 'gpt.js',
      function: 'Bg',
      in_app: true,
    },
    {
      lineno: 10,
      colno: 0,
      filename: 'gpt.js',
      function: 'HTMLDocument.<anonymous>',
      in_app: true,
    },
    {
      lineno: 10,
      colno: 0,
      filename: 'gpt.js',
      function: 'HTMLDocument.<anonymous>',
      in_app: true,
    },
  ];
  const expectFrames =
    stackToFrame(`Uncaught (in promise) TypeError: Failed to fetch
  at Bg (gpt.js:10)
  at HTMLDocument.<anonymous> (gpt.js:10)
  at HTMLDocument.<anonymous> (gpt.js:10)`);
  expect(JSON.stringify(expectFrames)).toBe(JSON.stringify(frames));
});

test('utils::stackToFrame normal', () => {
  const frames: ErrorStackFrame[] = [
    {
      lineno: 10,
      colno: 1,
      filename: 'gpt.js',
      function: 'Bg',
      in_app: true,
    },
    {
      lineno: 10,
      colno: 1,
      filename: 'gpt.js',
      function: 'HTMLDocument.<anonymous>',
      in_app: true,
    },
    {
      lineno: 10,
      colno: 1,
      filename: 'gpt.js',
      function: 'HTMLDocument.<anonymous>',
      in_app: true,
    },
  ];
  const expectFrames =
    stackToFrame(`Uncaught (in promise) TypeError: Failed to fetch
  at Bg (gpt.js:10:1)
  at HTMLDocument.<anonymous> (gpt.js:10:1)
  at HTMLDocument.<anonymous> (gpt.js:10:1)`);
  expect(JSON.stringify(expectFrames)).toBe(JSON.stringify(frames));
});
