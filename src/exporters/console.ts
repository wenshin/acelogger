import { LoggerEvent, LogLevel, Attributes } from '../api';

export function formatSection(evt: LoggerEvent): string {
  const attrs = evt.attributes || ({} as Attributes);
  const spanName = attrs.spanName ? '|' + attrs.spanName : '';
  const spanId = attrs.spanId ? '|' + attrs.spanId : '';
  return `${attrs.logger || ''}${spanName}${spanId}`;
}

export const LogLevelTitleMap = {
  [LogLevel.Debug]: 'DEBUG',
  [LogLevel.Info]: 'INFO',
  [LogLevel.Warn]: 'WARN',
  [LogLevel.Error]: 'ERROR',
};

/* tslint:disable: no-console */
export function adaptToJSConsole(
  evt: LoggerEvent,
  format: (evt: LoggerEvent) => unknown[]
): void {
  if (evt.level >= LogLevel.Error) {
    // 这里不使用 console.error() 是因为像 sentry
    // 等工具会拦截该方法，从而导致重复上报
    console.warn(...format(evt));
    return;
  }

  switch (evt.level) {
    case LogLevel.Debug:
      console.debug(...format(evt));
      break;
    case LogLevel.Info:
      console.info(...format(evt));
      break;
    case LogLevel.Warn:
      console.warn(...format(evt));
      break;
    default:
      console.info(...format(evt));
      break;
  }
}
/* tslint:enable */
