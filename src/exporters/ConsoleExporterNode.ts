import {
  LoggerEventExporter,
  LoggerEvent,
  ExportResult,
  LogLevel,
  ExporterEvents,
  LoggerAttributes,
} from '../api';
import { adaptToJSConsole, formatSection, LogLevelTitleMap } from './console';

export function adaptToNodeConsole(
  attrs: LoggerAttributes,
  evt: LoggerEvent
): void {
  const debugConfig = (process.env.DEBUG || '').split(',');
  const isAllowDebug =
    debugConfig.includes(attrs.logger || attrs.spanName) ||
    debugConfig.includes('*');
  if (isAllowDebug || evt.level >= LogLevel.Warn) {
    adaptToJSConsole(evt, formatNodeConsole);
  }
}

/**
 * format evt to be a colorful output in node console
 * @param evt
 */
export function formatNodeConsole(evt: LoggerEvent): unknown[] {
  const statusColor = evt.level < LogLevel.Warn ? '32' : '31';
  return [
    `\x1b[${statusColor}m${LogLevelTitleMap[evt.level]}\x1b[0m`,
    formatSection(evt),
    `"${evt.message}"`,
    evt,
  ];
}

export default class ConsoleExporterNode implements LoggerEventExporter {
  private stoped = false;
  public export(evts: ExporterEvents, cb: (stats: ExportResult) => void): void {
    if (this.stoped) {
      return;
    }
    evts.events.forEach(({ attributes, events }) => {
      events.forEach((evt) => adaptToNodeConsole(attributes, evt));
    });
    if (cb) {
      cb(ExportResult.SUCCESS);
    }
  }

  public shutdown(): void {
    this.stoped = true;
  }
}
