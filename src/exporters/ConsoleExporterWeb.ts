import { ExportResult } from '@opentelemetry/core';
import { LoggerEventExporter, LoggerEvent } from '../api';
import { adaptToBrowserConsole } from './console';

export default class ConsoleExporterNode implements LoggerEventExporter {
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
