import {
  LoggerEventExporter,
  LoggerEvent,
  ExportResult,
  LogLevel,
  ExporterEvents,
  LoggerAttributes,
} from '../api';
import { adaptToJSConsole, formatSection, LogLevelTitleMap } from './console';

export function adaptToBrowserConsole(
  attrs: LoggerAttributes,
  evt: LoggerEvent
): void {
  const debugConfig = (
    (window as unknown as { __ace_debug: string }).__ace_debug || ''
  ).split(',');
  const isAllowDebug =
    debugConfig.includes(attrs.logger || attrs.spanName) ||
    debugConfig.includes('*');
  if (isAllowDebug || evt.level >= LogLevel.Warn) {
    adaptToJSConsole(evt, formatBrowserConsole);
  }
}

/**
 * format evt to be a colorful output in browser console
 * @param evt
 */
export function formatBrowserConsole(evt: LoggerEvent): unknown[] {
  const statusColor = evt.level < LogLevel.Warn ? '#bbbbbb' : '#FF7043';
  return [
    `%c${LogLevelTitleMap[evt.level]} ${formatSection(evt)}`,
    `font-weight: bold; color: ${statusColor};`,
    `"${evt.message}"`,
    evt,
  ];
}

export default class ConsoleExporterWeb implements LoggerEventExporter {
  private stoped = false;
  public export(evts: ExporterEvents, cb: (stats: ExportResult) => void): void {
    if (this.stoped) {
      return;
    }
    evts.events.forEach(({ attributes, events }) => {
      events.forEach((evt) => adaptToBrowserConsole(attributes, evt));
    });
    if (cb) {
      cb(ExportResult.SUCCESS);
    }
  }

  public shutdown(): void {
    this.stoped = true;
  }
}
