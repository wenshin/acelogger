import { TimeInput, CanonicalCode, LogLevel, ErrorStackFrame } from './api';

export function isTimeInputHrTime(time: TimeInput): boolean {
  return Array.isArray(time) && time.length === 2;
}

export function getMillisecondsTime(time: TimeInput): number {
  return time && isTimeInputHrTime(time)
    ? time[0] * 1e3 + time[1] / 1e6
    : (time as number);
}

export function getStatusFromHTTPStatus(status: number) {
  if (status < 300) {
    return CanonicalCode.OK;
  }
  switch (status) {
    case 401:
      return CanonicalCode.UNAUTHENTICATED;
    case 403:
      return CanonicalCode.PERMISSION_DENIED;
    case 404:
      return CanonicalCode.NOT_FOUND;
    case 500:
      return CanonicalCode.INTERNAL;
    case 501:
      return CanonicalCode.UNIMPLEMENTED;
    case 503:
      return CanonicalCode.UNAVAILABLE;
    case 504:
      return CanonicalCode.DEADLINE_EXCEEDED;
    default:
      return status;
  }
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

/**
 *
 * @param spanName
 * @param event
 * fmp: First Meaningful Paint, the meaningful content paint
 * lcp: Largest Contentful Paint, the largest area content paint
 * shown: all elements paint in view area
 * tti: Time to interactive
 * @returns
 */
export function getSpanEventName(
  spanName: string,
  event: 'start' | 'end' | 'fmp' | 'lcp' | 'shown' | 'tti'
): string {
  return `${spanName}.${event}`;
}

export function getLatencyMetric(eventName: string): string {
  return `${eventName}.latency`;
}

export function getDurationMetric(spanName: string): string {
  return `${spanName}.duration`;
}

export function stackToFrame(stack: string): ErrorStackFrame[] {
  return stack
    .split('\n')
    .slice(1)
    .map((line) => {
      const elems = line.trim().split(/\s+/);
      const func = elems[1] || 'unknown';
      const file = elems[2];
      const fileRE = /\(?(.+?):(\d+):?(\d+)?\)?$/;
      let [, filename, lineno, colno] = func.match(fileRE) || [];
      if (!filename && file) {
        [, filename, lineno, colno] = file.match(fileRE) || [];
      }
      return {
        lineno: Number(lineno) || 0,
        colno: Number(colno) || 0,
        filename,
        function: func,
        in_app: true,
      };
    });
}
