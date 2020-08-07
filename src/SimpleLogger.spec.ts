import ace from '.';
import {
  AlertLevel,
  LoggerEvent,
  LoggerEventExporter,
  EventType,
  TraceFlags,
  SpanKind,
  CanonicalCode,
  ExportResult
} from './api';
import { performance } from 'perf_hooks';
// @ts-ignore
import pkg from '../package.json';

const mockExport = jest.fn();
class Exporter implements LoggerEventExporter {
  public export(evts: LoggerEvent[], cb: (result: ExportResult) => void): void {
    mockExport(evts, cb);
    cb(ExportResult.SUCCESS);
  }

  public shutdown(): void {
    return;
  }
}

ace.logger.setExporter(AlertLevel.Debug, new Exporter());

beforeAll(() => {
  ace.setTimer({
    now(): number {
      return performance.timeOrigin + performance.now();
    }
  });
  ace.logger.setAttributes({
    app: 'test-logger',
    appVersion: '0.0.1'
  });
});

afterAll(() => {
  ace.setTracer(null);
});

beforeEach(() => {
  ace.logger.flush();
  mockExport.mockReset();
});

test('SimpleLogger::startSpan without remote context', () => {
  const tracer = ace.tracer.toJSON();
  const logger = ace.logger.startSpan('test.span1');
  const span = logger.span.toJSON();
  expect(span).toBeTruthy();
  expect(span.startTime).toBeTruthy();
  expect(span.context.spanId).toBe('1');
  expect(span.context.traceId).toBeTruthy();

  // event is in buffer
  expect(mockExport.mock.calls.length).toBe(0);
  logger.flush();
  expect(mockExport.mock.calls.length).toBe(1);

  const args = mockExport.mock.calls[0];
  expect(args[0].length).toBe(1);
  expect(args[0][0].attributes).toEqual({
    app: 'test-logger',
    appVersion: '0.0.1',
    loggerLib: `${pkg.name}@${pkg.version}`,
    loggerName: 'test-logger',
    loggerVersion: '0.0.1',
    spanId: span.context.spanId,
    spanKind: SpanKind.INTERNAL,
    spanName: span.name,
    traceId: span.context.traceId,
    tracerLib: tracer.lib
  });
  expect(args[0][0].name).toBe('test.span1.start');
  expect(args[0][0].message).toBe('count test.span1.start 1 times');
  expect(args[0][0].level).toBe(AlertLevel.Info);
  expect(args[0][0].data).toBe(1);
  expect(args[0][0].status).toBe(CanonicalCode.OK);
  expect(args[0][0].type).toBe(EventType.Count);
});

test('SimpleLogger::startSpan with remote context', () => {
  const startTime = ace.timer.now() - 1000;
  const logger = ace.logger.startSpan('test.span', {
    kind: SpanKind.SERVER,
    parent: {
      spanId: '1.1',
      traceFlags: TraceFlags.NONE,
      traceId: '123'
    },
    startTime
  });
  const spanData = logger.span.toJSON();
  expect(spanData.startTime).toBe(startTime);
  expect(spanData.kind).toBe(SpanKind.SERVER);
});

test('SimpleLogger::startSpan start sub span', () => {
  const logger1 = ace.logger.startSpan('test.span1');
  const logger2 = logger1.startSpan('test.span2');
  expect((logger2 as any).attributes).toBe((logger1 as any).attributes);
  const span2 = logger2.span.toJSON();
  expect(span2.context.spanId).toBe('1.1');
  expect(span2.context.traceId).toBe(logger1.span.toJSON().context.traceId);
});

test('SimpleLogger::endSpan without time option', () => {
  const tracer = ace.tracer.toJSON();
  const logger = ace.logger.startSpan('test.span');
  logger.span.setAttributes({
    tag1: 'tag1',
    tag2: 'tag1'
  });
  logger.span.setAttributes({
    tag2: 'tag2'
  });
  logger.endSpan();
  expect(mockExport.mock.calls.length).toBe(0);
  logger.flush();
  expect(mockExport.mock.calls.length).toBe(1);

  const evts = mockExport.mock.calls[0][0];
  const span = logger.span.toJSON();
  expect(evts.length).toBe(3);
  // timing end span
  expect(evts[1].attributes).toEqual({
    app: 'test-logger',
    appVersion: '0.0.1',
    loggerLib: `${pkg.name}@${pkg.version}`,
    loggerName: 'test-logger',
    loggerVersion: '0.0.1',
    spanId: span.context.spanId,
    spanKind: SpanKind.INTERNAL,
    spanName: span.name,
    tag1: 'tag1',
    tag2: 'tag2',
    traceId: span.context.traceId,
    tracerLib: tracer.lib
  });
  expect(evts[1].name).toBe('test.span.end');
  expect(evts[1].message).toBe(
    `timing test.span.end ${span.endTime - span.startTime}ms`
  );
  expect(evts[1].level).toBe(AlertLevel.Info);
  expect(evts[1].data).toBe(span.endTime - span.startTime);
  expect(evts[1].status).toBe(CanonicalCode.OK);
  expect(evts[1].type).toBe(EventType.Timing);

  // count end span
  expect(evts[2].name).toBe('test.span.end');
  expect(evts[2].level).toBe(AlertLevel.Info);
  expect(evts[2].data).toBe(1);
  expect(evts[2].type).toBe(EventType.Count);
});

test('SimpleLogger::endSpan with time option', () => {
  const endTime = Date.now() + 1000;
  const logger = ace.logger.startSpan('test.span');
  logger.endSpan({
    time: endTime
  });
  logger.flush();

  const evts = mockExport.mock.calls[0][0];
  expect(evts.length).toBe(3);
  expect(evts[1].data).toBe(endTime - logger.span.toJSON().startTime);
});

test('SimpleLogger::endSpan with error status', () => {
  const logger = ace.logger.startSpan('test.span');
  logger.endSpan({
    status: CanonicalCode.INTERNAL
  });
  logger.flush();

  expect(mockExport.mock.calls.length).toBe(2);
  const infoevts = mockExport.mock.calls[0][0];
  const errorevts = mockExport.mock.calls[1][0];
  expect(infoevts.length).toBe(3);
  expect(errorevts.length).toBe(1);
  const evt = errorevts[0];
  expect(evt.level).toBe(AlertLevel.Error);
});

test('SimpleLogger::endSpan whitout span', () => {
  ace.logger.endSpan();
  ace.logger.flush();
  const evts = mockExport.mock.calls[0][0];
  expect(evts[0].message).toBe(
    'logger.endSpan must call after logger.startSpan'
  );
  expect(evts[0].level).toBe(AlertLevel.Error);
});

test('SimpleLogger log message whitout span', () => {
  ace.logger.debug('test debug', {
    data: { test: 'debug' }
  });
  ace.logger.info('test info', {
    data: { test: 'info' }
  });
  ace.logger.warn('test warn', {
    data: { test: 'warn' }
  });
  ace.logger.error(new Error('test error'), {
    data: { test: 'error' }
  });
  ace.logger.flush();

  expect(mockExport.mock.calls.length).toBe(4);

  const levels = ['debug', 'info', 'warn', 'error'];
  for (let i = 0; i < 4; i++) {
    const evts = mockExport.mock.calls[i][0];
    expect(evts[0].name).toBeFalsy();
    expect(evts[0].message).toBe('test ' + levels[i]);
    expect(evts[0].level).toBe(i);
    expect(evts[0].data).toEqual({
      test: levels[i]
    });
    if (levels[i] === 'error') {
      expect(evts[0].stack).toBeTruthy();
    }
  }
});

test('SimpleLogger::setBufferSize set buffer size to 0', () => {
  ace.logger.setBufferSize(0);
  ace.logger.info('test set buffer size');
  expect(mockExport.mock.calls.length).toBe(1);
  ace.logger.setBufferSize(10);
});

test('SimpleLogger buffer is full', () => {
  ace.logger.setBufferSize(2);
  ace.logger.info('test set buffer size');
  ace.logger.info('test set buffer size');
  expect(mockExport.mock.calls.length).toBe(1);
  ace.logger.setBufferSize(10);
});

test('SimpleLogger::store', () => {
  ace.logger.store({
    data: {
      cpuUsage: 0.1
    },
    name: 'performance'
  });
  ace.logger.flush();
  const evts = mockExport.mock.calls[0][0];
  expect(evts[0].name).toBe('performance');
  expect(evts[0].message).toBe('store cpuUsage metrics');
  expect(evts[0].level).toBe(AlertLevel.Info);
  expect(evts[0].data).toEqual({
    cpuUsage: 0.1
  });
});

test('SimpleLogger::setAttributes update logger name and version', () => {
  ace.logger.debug('test debug', {
    data: { test: 'debug' }
  });
  ace.logger.flush();
  const evts = mockExport.mock.calls[0][0];
  expect(evts[0].attributes).toEqual({
    app: 'test-logger',
    appVersion: '0.0.1',
    loggerLib: `${pkg.name}@${pkg.version}`,
    loggerName: 'test-logger',
    loggerVersion: '0.0.1',
    spanId: undefined,
    spanKind: undefined,
    spanName: undefined,
    traceId: undefined,
    tracerLib: `${pkg.name}@${pkg.version}`
  });
});

test('SimpleLogger::getAttributes', () => {
  const attrs = ace.logger.getAttributes();
  expect(attrs).toEqual({
    app: 'test-logger',
    appVersion: '0.0.1',
    lib: `${pkg.name}@${pkg.version}`,
    name: '',
    version: ''
  });
});
