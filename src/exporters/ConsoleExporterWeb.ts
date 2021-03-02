import {
  LoggerEventExporter,
  LoggerEvent,
  ExportResult,
  LogLevel
} from '../api';
import { adaptToJSConsole, formatSection, LogLevelTitleMap } from './console';

export function adaptToBrowserConsole(evt: LoggerEvent): void {
  const debugConfig = (((window as any).__ace_debug as string) || '').split(
    ','
  );
  const isAllowDebug =
    debugConfig.includes(evt.attributes.spanName) || debugConfig.includes('*');
  if (isAllowDebug || evt.level >= LogLevel.Warn) {
    adaptToJSConsole(evt, formatBrowserConsole);
  }
}

/**
 * format evt to be a colorful output in browser console
 * @param evt
 */
export function formatBrowserConsole(evt: LoggerEvent): any[] {
  const statusColor = evt.level < LogLevel.Warn ? '#bbbbbb' : '#FF7043';
  return [
    `%c${LogLevelTitleMap[evt.level]} ${formatSection(evt)}`,
    `font-weight: bold; color: ${statusColor};`,
    `"${evt.message || 'no message'}"`,
    evt
  ];
}

export default class ConsoleExporterWeb implements LoggerEventExporter {
  private stoped: boolean = false;
  public export(evts: LoggerEvent[], cb: (stats: ExportResult) => void): void {
    if (this.stoped) {
      return;
    }
    evts.forEach(adaptToBrowserConsole);
    if (cb) {
      cb(ExportResult.SUCCESS);
    }
  }

  public shutdown(): void {
    this.stoped = true;
  }
}
