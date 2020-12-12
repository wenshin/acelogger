import {
  LoggerEventExporter,
  LoggerEvent,
  ExportResult,
  LogLevel
} from '../api';
import { adaptToJSConsole, formatSection, LogLevelTitleMap } from './console';

export function adaptToNodeConsole(evt: LoggerEvent): void {
  const debugConfig = (process.env.DEBUG || '').split(',');
  const isAllowDebug =
    debugConfig.includes(evt.attributes.spanName) || debugConfig.includes('*');
  if (isAllowDebug || evt.level >= LogLevel.Warn) {
    adaptToJSConsole(evt, formatNodeConsole);
  }
}

/**
 * format evt to be a colorful output in node console
 * @param evt
 */
export function formatNodeConsole(evt: LoggerEvent): any[] {
  const statusColor = evt.level < LogLevel.Warn ? '32' : '31';
  return [
    `\x1b[${statusColor}m${LogLevelTitleMap[evt.level]}\x1b[0m`,
    formatSection(evt),
    `"${evt.message || 'no message'}"`,
    evt
  ];
}

export default class ConsoleExporterNode implements LoggerEventExporter {
  private stoped: boolean = false;
  public export(evts: LoggerEvent[], cb: (stats: ExportResult) => void): void {
    if (this.stoped) {
      return;
    }
    evts.forEach(adaptToNodeConsole);
    if (cb) {
      cb(ExportResult.SUCCESS);
    }
  }

  public shutdown(): void {
    this.stoped = true;
  }
}
