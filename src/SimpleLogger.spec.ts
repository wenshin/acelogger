import ace from '.';
import {
  LogLevel,
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

ace.setExporter(LogLevel.Debug, new Exporter());

beforeAll(() => {
  ace.setTimer({
    now(): number {
      return performance.timeOrigin + performance.now();
    }
  });
  ace.logger.setAttributes({
    app: 'test-app',
    appVersion: '0.0.1'
  });
});

afterAll(() => {
  ace.setTracer(null);
});

beforeEach(() => {
  ace.logger.flush();
  ace.setBufferSize(10);
  mockExport.mockReset();
});

test('SimpleLogger::startSpan without remote context', () => {
  const logger = ace.logger.startSpan('test.span1');
  const span = logger.span;
  expect(span).toBeTruthy();
  expect(span.startTime).toBeTruthy();
  expect(span.context.spanId).toBe(`${span.context.traceId}-1`);
  expect(span.context.traceId).toBeTruthy();
  expect(span.context.traceFlags).toBe(TraceFlags.NONE);

  // event is in buffer
  expect(mockExport.mock.calls.length).toBe(0);
  logger.flush();
  expect(mockExport.mock.calls.length).toBe(1);

  const args = mockExport.mock.calls[0];
  expect(args[0].length).toBe(1);
  expect(args[0][0].attributes).toEqual({
    app: 'test-app',
    appVersion: '0.0.1',
    logger: 'acelogger',
    lib: `${pkg.name}@${pkg.version}`,
    spanKind: SpanKind.INTERNAL,
    spanName: span.name
  });
  expect(args[0][0].data).toEqual({
    spanId: span.context.spanId,
    traceId: span.context.traceId
  });
  expect(args[0][0].name).toBe('test.span1.start');
  expect(args[0][0].message).toBe('test.span1.start');
  expect(args[0][0].level).toBe(LogLevel.Info);
  expect(args[0][0].metrics).toEqual({ 'test.span1.start.latency': 0 });
  expect(args[0][0].traceFlags).toBe(TraceFlags.NONE);
  expect(args[0][0].status).toBe(CanonicalCode.OK);
  expect(args[0][0].type).toBe(EventType.Tracing);

  const logger2 = ace.logger.startSpan('test.span2');
  expect(logger2.span.context.spanId).toBe(`${logger2.span.context.traceId}-2`);
  expect(
    logger2.span.context.traceId !== logger.span.context.traceId
  ).toBeTruthy();
});

test('SimpleLogger::startSpan with remote context', () => {
  const startTime = ace.timer.now() - 1000;
  const logger = ace.logger.startSpan('test.span', {
    kind: SpanKind.SERVER,
    parent: {
      spanId: '1.1',
      traceFlags: TraceFlags.SAMPLED,
      traceId: '123'
    },
    startTime
  });
  const spanmetrics = logger.span;
  expect(spanmetrics.context.spanId).toBe('1.1.1');
  expect(spanmetrics.userStartTime).toBe(startTime);
  expect(spanmetrics.kind).toBe(SpanKind.SERVER);

  logger.flush();
  const args = mockExport.mock.calls[0];
  expect(args[0][0].traceFlags).toBe(TraceFlags.SAMPLED);
  expect(args[0][0].metrics).toEqual({
    'test.span.start.latency': spanmetrics.startTime - spanmetrics.userStartTime
  });
  expect(args[0][0].data).toEqual({
    spanId: spanmetrics.context.spanId,
    traceId: spanmetrics.context.traceId
  });
});

test('SimpleLogger::startSpan start sub span', () => {
  const logger1 = ace.logger.startSpan('test.span1');
  const logger2 = logger1.startSpan('test.span2');
  const logger3 = logger1.startSpan('test.span3');
  expect(logger1.getAttributes()).toEqual({
    ...logger2.getAttributes(),
    spanName: 'test.span1'
  });
  expect(logger2.span.context.spanId).toBe(`${logger1.span.context.spanId}.1`);
  expect(logger2.getAttributes().spanName).toBe('test.span2');
  expect(logger3.span.context.spanId).toBe(`${logger1.span.context.spanId}.2`);

  const span2 = logger2.span;
  expect(span2.context.spanId).toBe(`${logger1.span.context.spanId}.1`);
  expect(span2.context.traceId).toBe(logger1.span.context.traceId);
});

test('SimpleLogger::endSpan without event argument', () => {
  const logger = ace.logger.startSpan('test.span');
  logger.setAttributes({
    tag1: 'tag1',
    tag2: 'tag1'
  });
  logger.setAttributes({
    tag2: 'tag2'
  });
  logger.endSpan();
  expect(mockExport.mock.calls.length).toBe(0);
  logger.flush();
  expect(mockExport.mock.calls.length).toBe(1);

  const evts = mockExport.mock.calls[0][0];
  const span = logger.span;
  expect(evts.length).toBe(2);
  // timing end span
  expect(evts[1].attributes).toEqual({
    app: 'test-app',
    appVersion: '0.0.1',
    logger: 'acelogger',
    lib: `${pkg.name}@${pkg.version}`,
    spanKind: SpanKind.INTERNAL,
    spanName: span.name,
    tag1: 'tag1',
    tag2: 'tag2'
  });
  expect(evts[1].data).toEqual({
    spanId: span.context.spanId,
    traceId: span.context.traceId
  });
  expect(evts[1].name).toBe('test.span.end');
  expect(evts[1].message).toBe(
    `test.span end with ${logger.span.endTime - logger.span.startTime}ms`
  );
  expect(evts[1].level).toBe(LogLevel.Info);
  expect(span.startTime).toEqual(span.userStartTime);
  expect(evts[1].metrics).toEqual({
    'test.span.duration': span.endTime - span.startTime
  });
  expect(evts[1].status).toBe(CanonicalCode.OK);
  expect(evts[1].type).toBe(EventType.Tracing);
});

test('SimpleLogger::endSpan with event argument', () => {
  const endTime = Date.now() + 1000;
  const logger = ace.logger.startSpan('test.span');
  logger.endSpan({
    level: LogLevel.Error,
    message: 'endSpan message',
    status: CanonicalCode.NOT_FOUND,
    time: endTime,
    traceFlags: TraceFlags.SAMPLED
  });
  logger.flush();

  expect(mockExport.mock.calls.length).toBe(2);

  const endEvent = mockExport.mock.calls[1][0][0];
  expect(endEvent.message).toBe(
    `test.span end with ${logger.span.endTime -
      logger.span.startTime}ms, endSpan message`
  );
  expect(endEvent.level).toBe(LogLevel.Error);
  expect(endEvent.traceFlags).toBe(TraceFlags.SAMPLED);
  expect(endEvent.status).toBe(CanonicalCode.NOT_FOUND);
  expect(endEvent.metrics).toEqual({
    'test.span.duration': endTime - logger.span.startTime
  });
});

test('SimpleLogger::endSpan with error status', () => {
  // @ts-ignore
  const logger = ace.logger.startSpan('test.span');
  logger.endSpan({
    level: LogLevel.Warn,
    status: CanonicalCode.INTERNAL
  });
  logger.flush();

  expect(mockExport.mock.calls.length).toBe(2);
  const infoevts = mockExport.mock.calls[1][0];
  expect(infoevts.length).toBe(1);
  expect(infoevts[0].status).toBe(CanonicalCode.INTERNAL);
  expect(infoevts[0].level).toBe(LogLevel.Error);
});

test('SimpleLogger::endSpan whitout span', () => {
  ace.logger.endSpan();
  ace.logger.flush();
  const evts = mockExport.mock.calls[0][0];
  expect(evts[0].message).toBe(
    'logger.endSpan must call after logger.startSpan'
  );
  expect(evts[0].level).toBe(LogLevel.Error);
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
  ace.logger.fatal(new Error('test fatal'), {
    data: { test: 'fatal' }
  });
  ace.logger.flush();

  expect(mockExport.mock.calls.length).toBe(5);

  const levels = ['debug', 'info', 'warn', 'error', 'fatal'];
  for (let i = 0; i < 4; i++) {
    const evts = mockExport.mock.calls[i][0];
    expect(evts[0].name).toBe(`log.${levels[i]}`);
    expect(evts[0].message).toBe('test ' + levels[i]);
    expect(evts[0].level).toBe(i);
    expect(evts[0].traceFlags).toBe(TraceFlags.NONE);
    expect(evts[0].data).toEqual({
      spanId: '0',
      traceId: '0',
      test: levels[i]
    });
    if (levels[i] === 'error' || levels[i] === 'fatal') {
      expect(evts[0].stack).toBeTruthy();
    }
  }
});

test('SimpleLogger log with traceFlag', () => {
  ace.logger.info('test set buffer size', {
    traceFlags: TraceFlags.SAMPLED
  });
  ace.logger.flush();
  const evts = mockExport.mock.calls[0][0];
  expect(evts[0].traceFlags).toBe(TraceFlags.SAMPLED);
});

test('SimpleLogger::setBufferSize set buffer size to 0', () => {
  ace.setBufferSize(0);
  ace.logger.info('test set buffer size');
  expect(mockExport.mock.calls.length).toBe(1);
});

test('SimpleLogger buffer is full', () => {
  ace.setBufferSize(2);
  ace.logger.info('test set buffer size');
  ace.logger.info('test set buffer size');
  expect(mockExport.mock.calls.length).toBe(1);
});

test('SimpleLogger::storeMetrics', () => {
  ace.logger.storeMetrics({
    message: 'test-store-message',
    metrics: {
      cpuUsage: 0.1
    }
  });
  ace.logger.flush();
  const evts = mockExport.mock.calls[0][0];
  expect(evts[0].name).toBe('metric.store');
  expect(evts[0].message).toBe('store {"cpuUsage":0.1}, test-store-message');
  expect(evts[0].level).toBe(LogLevel.Debug);
  expect(evts[0].metrics).toEqual({
    cpuUsage: 0.1
  });
});

test('SimpleLogger::storeMetrics without message', () => {
  ace.logger.storeMetrics({
    metrics: {
      cpuUsage: 0.1
    }
  });
  ace.logger.flush();
  const evts = mockExport.mock.calls[0][0];
  expect(evts[0].message).toBe('store {"cpuUsage":0.1}');
});

test('SimpleLogger::event without message', () => {
  ace.logger.event('test-event', {
    attributes: {
      'my-attr': 'attr'
    }
  });
  ace.logger.flush();
  const evts = mockExport.mock.calls[0][0];
  expect(evts[0].level).toBe(LogLevel.Info);
  expect(evts[0].attributes['my-attr']).toBe('attr');
  expect(evts[0].message).toBe(`log event: test-event`);
});

test('SimpleLogger::event with message', () => {
  ace.logger.event('test-event', {
    message: 'my test-event'
  });
  ace.logger.flush();
  const evts = mockExport.mock.calls[0][0];
  expect(evts[0].message).toBe(`my test-event`);
});

test('SimpleLogger::setAttributes update logger name and version', () => {
  ace.logger.debug('test debug', {
    data: { test: 'debug' }
  });
  ace.logger.flush();
  const evts = mockExport.mock.calls[0][0];
  expect(evts[0].attributes).toEqual({
    app: 'test-app',
    appVersion: '0.0.1',
    logger: 'acelogger',
    lib: `${pkg.name}@${pkg.version}`,
    spanKind: 0,
    spanName: 'unknown'
  });
});

test('SimpleLogger::getAttributes', () => {
  const attrs = ace.logger.getAttributes();
  expect(attrs).toEqual({
    app: 'test-app',
    appVersion: '0.0.1',
    logger: 'acelogger',
    lib: `${pkg.name}@${pkg.version}`,
    spanKind: 0,
    spanName: 'unknown'
  });
});
