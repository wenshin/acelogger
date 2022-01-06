import { ExportResult } from './ExportResult';
import { ManagerAttributes, CacheEvents } from './Manager';

export interface ExporterEvents {
  attributes: ManagerAttributes;
  events: CacheEvents[];
}

export interface LoggerEventExporter {
  /**
   * @param events the list of sampled events or spans to be exported.
   */
  export(
    events: ExporterEvents,
    resultCallback?: (result: ExportResult) => void
  ): void;

  /** Stops the exporter. */
  shutdown(): void;
}
