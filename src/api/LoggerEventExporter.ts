import { ExportResult } from './ExportResult';
import { LoggerEvent } from './LoggerEvent';

export interface LoggerEventExporter {
  /**
   * @param events the list of sampled events or spans to be exported.
   */
  export(
    events: LoggerEvent[],
    resultCallback: (result: ExportResult) => void
  ): void;

  /** Stops the exporter. */
  shutdown(): void;
}
