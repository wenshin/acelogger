import ace, { AlertLevel, ConsoleExporterWeb, SimpleManager } from '../src';
const manager = new SimpleManager();

manager.logger.setAttributes({
  app: ace.logger.getAttributes().app,
  appVersion: ace.logger.getAttributes().appVersion,
  name: 'my-module'
});

// init logger exporter
manager.logger.setExporter(AlertLevel.Debug, new ConsoleExporterWeb());
manager.logger.setBufferSize(0);

export { manager as myModuleAce };
