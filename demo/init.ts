import ace, { LogLevel, ConsoleExporterWeb } from '../src';

(window as any).__debug = 'unknown,first.span,first_child.span';

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
ace.setExporter(LogLevel.Debug, new ConsoleExporterWeb());
