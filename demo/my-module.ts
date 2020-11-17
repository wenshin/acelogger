import ace, { LogLevel, ConsoleExporterWeb, SimpleManager } from '../src';
const manager = new SimpleManager();

manager.logger.setAttributes({
  app: ace.logger.getAttributes().app,
  appVersion: ace.logger.getAttributes().appVersion,
  lib: 'my-module@0.1.1'
});

// init logger exporter
manager.setExporter(LogLevel.Debug, new ConsoleExporterWeb());
manager.setBufferSize(0);

export { manager as myModuleAce };
