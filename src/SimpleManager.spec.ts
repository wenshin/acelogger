import ace, { SimpleLogger, SimpleManager, SimpleTracer } from '.';

test('SimpleManager::singleton', () => {
  expect(ace instanceof SimpleManager).toBe(true);
});

test('SimpleManager::new', () => {
  const manager = new SimpleManager();
  expect(ace.timer).toBe(manager.timer);
});

test('SimpleManager::new with options', () => {
  const manager = new SimpleManager({ flushDelay: 300 });
  expect((manager as unknown as { flushDelay: number }).flushDelay).toBe(300);
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
    },
  });
  expect(oldTimer === manager.timer).toBeFalsy();
});

test('SimpleManager::setLogger', () => {
  const manager = new SimpleManager();
  const oldLogger = manager.logger;
  manager.setLogger(new SimpleLogger());
  expect(oldLogger === manager.logger).toBeFalsy();
});

test('SimpleManager::flush latency', (done) => {
  const manager = new SimpleManager();
  const start = Date.now();
  manager.setFlushReady();
  manager.setFlushDelay(50);
  manager.flush(() => {
    expect(Date.now() - start >= 45).toBeTruthy();
    done();
  });

  const oldTimer = manager.flushTimer;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  manager.flush(() => {});
  expect(oldTimer).toEqual(manager.flushTimer);
});

test('SimpleManager::setFlushReady ready', (done) => {
  const manager = new SimpleManager();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  manager.flush(() => {});
  expect(manager.flushTimer).toBeFalsy();
  manager.setFlushReady();

  manager.flush(() => {
    done();
  });
  expect(manager.flushTimer).toBeTruthy();
});
