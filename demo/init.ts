import ace, { LogLevel, ConsoleExporterWeb } from '../src';

ace.setTimer({
  now(): number {
    return performance.timeOrigin + performance.now();
  }
});

ace.logger.setAttributes({
  app: 'my-app',
  appVersion: '0.0.1',
  os: 'macOS'
});

// init logger exporter
ace.logger.setExporter(LogLevel.Debug, new ConsoleExporterWeb());
ace.logger.setBufferSize(0);
