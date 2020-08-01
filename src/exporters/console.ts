import { LoggerEvent, EventLevel } from '../api';

function formatSection(evt: LoggerEvent): string {
  const attrs = evt.attributes || {} as any;
  const spanName = attrs.spanName ? '|' + attrs.spanName : '';
  const spanId = attrs.spanId ? '|' + attrs.spanId : '';
  return `[${attrs.tracerName}${spanId}${spanName}]`
}

export const EventLevelTitleMap = {
  [EventLevel.Debug]: 'DEBUG',
  [EventLevel.Info]: 'INFO',
  [EventLevel.Warn]: 'WARN',
  [EventLevel.Error]: 'ERROR',
};

/**
 * format evt to be a colorful output in browser console
 * @param evt
 */
export function formatBrowserConsole(evt: LoggerEvent): any[] {
  const statusColor = evt.level < EventLevel.Warn ? '#00E676' : '#FF7043';
  return [
    `%c${formatSection(evt)} ${EventLevelTitleMap[evt.level]}`,
    `font-weight: bold; color: ${statusColor};`,
    `"${evt.message || 'no message'}"`,
    evt
  ];
}

/**
 * format evt to be a colorful output in node console
 * @param evt
 */
export function formatNodeConsole(evt: LoggerEvent): any[] {
  const statusColor = evt.level < EventLevel.Warn ? '32' : '31';
  return [
    formatSection(evt),
    `\x1b[${statusColor}m${EventLevelTitleMap[evt.level]}\x1b[0m`,
    `"${evt.message || 'no message'}"`,
    evt
  ];
}

/* tslint:disable: no-console */
export function adaptToJSConsole(
  evt: LoggerEvent,
  format: (evt: LoggerEvent) => any[]
): void {
  if (evt.level >= EventLevel.Error) {
    // 这里不使用 console.error() 是因为像 sentry
    // 等工具会拦截该方法，从而导致重复上报
    console.warn(...format(evt));
    return;
  }

  switch (evt.level) {
    case EventLevel.Debug:
      console.debug(...format(evt));
      break;
    case EventLevel.Info:
      console.info(...format(evt));
      break;
    case EventLevel.Warn:
      console.warn(...format(evt));
      break;
    default:
      console.info(...format(evt));
      break;
  }
}
/* tslint:enable */

export function adaptToBrowserConsole(evt: LoggerEvent): void {
  adaptToJSConsole(evt, formatBrowserConsole);
}

export function adaptToNodeConsole(evt: LoggerEvent): void {
  adaptToJSConsole(evt, formatNodeConsole);
}
