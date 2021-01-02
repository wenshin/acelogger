import ace, { SimpleLogger, SimpleManager, SimpleTracer } from '.';

test('SimpleManager::singleton', () => {
  expect(ace instanceof SimpleManager).toBe(true);
});

test('SimpleManager::new', () => {
  const manager = new SimpleManager();
  expect(ace.timer).toBe(manager.timer);
});

test('SimpleManager::setTracer', () => {
  const manager = new SimpleManager();
  const oldTracer = manager.tracer;
  manager.setTracer(new SimpleTracer());
  expect(oldTracer === manager.tracer).toBeFalsy();
});

test('SimpleManager::setTimer', () => {
  const manager = new SimpleManager();
  const oldTimer = manager.timer;
  manager.setTimer({
    now(): number {
      return Date.now();
    }
  });
  expect(oldTimer === manager.timer).toBeFalsy();
});

test('SimpleManager::setLogger', () => {
  const manager = new SimpleManager();
  const oldLogger = manager.logger;
  manager.setLogger(new SimpleLogger());
  expect(oldLogger === manager.logger).toBeFalsy();
});

test('SimpleManager::flush latency', done => {
  const manager = new SimpleManager();
  const start = Date.now();
  manager.flush(() => {
    expect(Date.now() - start < 50).toBeTruthy();
    done();
  });
});
