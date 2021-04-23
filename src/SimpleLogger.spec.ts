import { SimpleManager } from '.';
import {
  LogLevel,
  LoggerEvent,
  LoggerEventExporter,
  EventType,
  TraceFlags,
  SpanKind,
  CanonicalCode,
  ExportResult,
  Manager
} from './api';
import { performance } from 'perf_hooks';
// @ts-ignore
import pkg from '../package.json';

function createMockLib(): { ace: Manager; mockExport: jest.Mock<any, any> } {
  const mockExport = jest.fn();
  const ace = new SimpleManager();
  class Exporter implements LoggerEventExporter {
    public export(
      evts: LoggerEvent[],
      cb: (result: ExportResult) => void
    ): void {
      mockExport(evts, cb);
      cb(ExportResult.SUCCESS);
    }

    public shutdown(): void {
      return;
    }
  }
  ace.setExporter(LogLevel.Debug, new Exporter());
  ace.setTimer({
    now(): number {
      return performance.timeOrigin + performance.now();
    }
  });
  ace.logger.setAttributes({
    app: 'test-app',
    appVersion: '0.0.1'
  });
  return { ace, mockExport };
}

test('SimpleLogger::startSpan without remote context', done => {
  const { ace, mockExport } = createMockLib();
  const logger = ace.logger.startSpan('test.span1', {
    logStart: true
  });
  const span = logger.span;
  expect(span).toBeTruthy();
  expect(span.startTime).toBeTruthy();
  expect(span.context.spanId).toBe(`${span.context.traceId}-1`);
  expect(span.context.traceId).toBeTruthy();
  expect(span.context.traceFlags).toBe(TraceFlags.NONE);

  // event is in buffer
  expect(mockExport.mock.calls.length).toBe(0);
  logger.flush(() => {
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
    expect(logger2.span.context.spanId).toBe(
      `${logger2.span.context.traceId}-2`
    );
    expect(
      logger2.span.context.traceId !== logger.span.context.traceId
    ).toBeTruthy();
    done();
  });
});

test('SimpleLogger::startSpan with remote context', done => {
  const { ace, mockExport } = createMockLib();
  const startTime = ace.timer.now() - 1000;
  const logger = ace.logger.startSpan('test.span', {
    logStart: true,
    kind: SpanKind.SERVER,
    parent: {
      spanId: '1.1',
      traceFlags: TraceFlags.SAMPLED,
      traceId: '123'
    },
    data: { samplingRatio: 1 },
    startTime
  });
  const spanmetrics = logger.span;
  expect(spanmetrics.context.spanId).toBe('1.1.1');
  expect(spanmetrics.userStartTime).toBe(startTime);
  expect(spanmetrics.kind).toBe(SpanKind.SERVER);

  logger.flush(() => {
    try {
      const args = mockExport.mock.calls[0];
      expect(args[0][0].traceFlags).toBe(TraceFlags.SAMPLED);
      expect(args[0][0].metrics).toEqual({
        'test.span.start.latency':
          spanmetrics.startTime - spanmetrics.userStartTime
      });
      expect(args[0][0].data).toEqual({
        samplingRatio: 1,
        spanId: spanmetrics.context.spanId,
        traceId: spanmetrics.context.traceId
      });
      done();
    } catch (err) {
      done(err);
    }
  });
});

test('SimpleLogger::startSpan start sub span', () => {
  const { ace } = createMockLib();
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

test('SimpleLogger::startSpan logStart is false', done => {
  const { ace, mockExport } = createMockLib();
  const logger1 = ace.logger.startSpan('test.span1', {
    logStart: true
  });
  logger1.flush(() => {
    expect(mockExport.mock.calls.length).toBe(1);
    done();
  });
});

test('SimpleLogger::endSpan without event argument', done => {
  const { ace, mockExport } = createMockLib();
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
  logger.flush(() => {
    try {
      expect(mockExport.mock.calls.length).toBe(1);

      const evts = mockExport.mock.calls[0][0];
      const span = logger.span;
      expect(evts.length).toBe(1);
      // timing end span
      expect(evts[0].attributes).toEqual({
        app: 'test-app',
        appVersion: '0.0.1',
        logger: 'acelogger',
        lib: `${pkg.name}@${pkg.version}`,
        spanKind: SpanKind.INTERNAL,
        spanName: span.name,
        tag1: 'tag1',
        tag2: 'tag2'
      });
      expect(evts[0].data).toEqual({
        spanId: span.context.spanId,
        traceId: span.context.traceId
      });
      expect(evts[0].name).toBe('test.span.end');
      expect(evts[0].message).toBe(
        `test.span end with ${logger.span.endTime - logger.span.startTime}ms`
      );
      expect(evts[0].level).toBe(LogLevel.Info);
      expect(span.startTime).toEqual(span.userStartTime);
      expect(evts[0].metrics).toEqual({
        'test.span.duration': span.endTime - span.startTime
      });
      expect(evts[0].status).toBe(CanonicalCode.OK);
      expect(evts[0].type).toBe(EventType.Tracing);
      done();
    } catch (err) {
      done(err);
    }
  });
});

test('SimpleLogger::endSpan with event argument', done => {
  const { ace, mockExport } = createMockLib();
  const endTime = Date.now() + 1000;
  const logger = ace.logger.startSpan('test.span');
  logger.endSpan({
    level: LogLevel.Error,
    message: 'endSpan message',
    status: CanonicalCode.NOT_FOUND,
    time: endTime,
    traceFlags: TraceFlags.SAMPLED
  });
  ace.flush(() => {
    try {
      expect(mockExport.mock.calls.length).toBe(1);
      const endEvent = mockExport.mock.calls[0][0][0];
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
      done();
    } catch (error) {
      done(error);
    }
  });
});

test('SimpleLogger::endSpan with error status', done => {
  const { ace, mockExport } = createMockLib();
  // @ts-ignore
  const logger = ace.logger.startSpan('test.span');
  logger.endSpan({
    level: LogLevel.Warn,
    status: CanonicalCode.INTERNAL
  });
  ace.flush(() => {
    try {
      expect(mockExport.mock.calls.length).toBe(1);
      const infoevts = mockExport.mock.calls[0][0];
      expect(infoevts.length).toBe(1);
      expect(infoevts[0].status).toBe(CanonicalCode.INTERNAL);
      expect(infoevts[0].level).toBe(LogLevel.Error);
      done();
    } catch (err) {
      done(err);
    }
  });
});

test('SimpleLogger::endSpan whitout span', done => {
  const { ace, mockExport } = createMockLib();
  ace.logger.endSpan();
  ace.logger.flush(() => {
    try {
      const evts = mockExport.mock.calls[0][0];
      expect(evts[0].message).toBe(
        'logger.endSpan must call after logger.startSpan'
      );
      expect(evts[0].level).toBe(LogLevel.Error);
      done();
    } catch (err) {
      done(err);
    }
  });
});

test('SimpleLogger log message whitout span', done => {
  const { ace, mockExport } = createMockLib();
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

  ace.logger.flush(() => {
    try {
      expect(mockExport.mock.calls.length).toBe(5);

      const levels = ['debug', 'info', 'warn', 'error', 'fatal'];
      for (let i = 0; i < 5; i++) {
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
      done();
    } catch (err) {
      done(err);
    }
  });
});

test('SimpleLogger log error with string', done => {
  const { ace, mockExport } = createMockLib();
  ace.logger.error('test error', {
    data: { test: 'error' }
  });
  ace.logger.fatal('test fatal', {
    data: { test: 'fatal' }
  });

  ace.logger.flush(() => {
    try {
      expect(mockExport.mock.calls.length).toBe(2);

      const levels = ['error', 'fatal'];
      for (let i = 0; i < 2; i++) {
        const evts = mockExport.mock.calls[i][0];
        expect(evts[0].name).toBe(`log.${levels[i]}`);
        expect(evts[0].message).toBe('test ' + levels[i]);
        expect(evts[0].traceFlags).toBe(TraceFlags.NONE);
        expect(evts[0].data).toEqual({
          spanId: '0',
          traceId: '0',
          test: levels[i]
        });
        expect(evts[0].stack).toBeFalsy();
      }
      done();
    } catch (err) {
      done(err);
    }
  });
});

test('SimpleLogger log with traceFlag', done => {
  const { ace, mockExport } = createMockLib();
  ace.logger.info('test set buffer size', {
    traceFlags: TraceFlags.SAMPLED
  });
  ace.logger.flush(() => {
    try {
      const evts = mockExport.mock.calls[0][0];
      expect(evts[0].traceFlags).toBe(TraceFlags.SAMPLED);
      done();
    } catch (err) {
      done(err);
    }
  });
});

test('SimpleLogger::setBufferSize set buffer size to 0', () => {
  const { ace, mockExport } = createMockLib();
  ace.setBufferSize(0);
  ace.logger.info('test set buffer size');
  // async flush
  expect(mockExport.mock.calls.length).toBe(0);
});

test('SimpleLogger buffer is full', () => {
  const { ace } = createMockLib();
  ace.setBufferSize(2);
  ace.logger.info('test set buffer size');
  ace.logger.info('test set buffer size');
  expect(ace.flushing).toBeTruthy();
});

test('SimpleLogger::storeMetrics', done => {
  const { ace, mockExport } = createMockLib();
  ace.logger.storeMetrics({
    status: CanonicalCode.INTERNAL,
    message: 'test-store-message',
    samplingRate: 0.3,
    metrics: {
      cpuUsage: 0.1
    }
  });
  ace.logger.flush(() => {
    try {
      const evts = mockExport.mock.calls[0][0];
      expect(evts[0].name).toBe('metric.store');
      expect(evts[0].status).toBe(CanonicalCode.INTERNAL);
      expect(evts[0].message).toBe(
        'store {"cpuUsage":0.1}, test-store-message'
      );
      expect(evts[0].level).toBe(LogLevel.Error);
      expect(evts[0].samplingRate).toBe(0.3);
      expect(evts[0].metrics).toEqual({
        cpuUsage: 0.1
      });
      done();
    } catch (err) {
      done(err);
    }
  });
});

test('SimpleLogger::storeMetrics without message', done => {
  const { ace, mockExport } = createMockLib();
  ace.logger.storeMetrics({
    metrics: {
      cpuUsage: 0.1
    }
  });
  ace.logger.flush(() => {
    try {
      const evts = mockExport.mock.calls[0][0];
      expect(evts[0].message).toBe('store {"cpuUsage":0.1}');
      expect(evts[0].status).toBe(CanonicalCode.OK);
      expect(evts[0].level).toBe(LogLevel.Debug);
      expect(evts[0].samplingRate).toBe(1);
      done();
    } catch (err) {
      done(err);
    }
  });
});

test('SimpleLogger::event without message', done => {
  const { ace, mockExport } = createMockLib();
  ace.logger.event('test-event', {
    attributes: {
      'my-attr': 'attr'
    }
  });
  ace.logger.flush(() => {
    try {
      const evts = mockExport.mock.calls[0][0];
      expect(evts[0].level).toBe(LogLevel.Info);
      expect(evts[0].attributes['my-attr']).toBe('attr');
      expect(evts[0].message).toBe(`log event: test-event`);
      done();
    } catch (err) {
      done(err);
    }
  });
});

test('SimpleLogger::event with message', done => {
  const { ace, mockExport } = createMockLib();
  ace.logger.event('test-event', {
    message: 'my test-event'
  });
  ace.logger.flush(() => {
    try {
      const evts = mockExport.mock.calls[0][0];
      expect(evts[0].message).toBe(`my test-event`);
      done();
    } catch (err) {
      done(err);
    }
  });
});

test('SimpleLogger::setAttributes update logger name and version', done => {
  const { ace, mockExport } = createMockLib();
  ace.logger.debug('test debug', {
    data: { test: 'debug' }
  });
  ace.logger.flush(() => {
    try {
      const evts = mockExport.mock.calls[0][0];
      expect(evts[0].attributes).toEqual({
        app: 'test-app',
        appVersion: '0.0.1',
        logger: 'acelogger',
        lib: `${pkg.name}@${pkg.version}`,
        spanKind: 0,
        spanName: 'unknown'
      });
      done();
    } catch (err) {
      done(err);
    }
  });
});

test('SimpleLogger::getAttributes', () => {
  const { ace } = createMockLib();
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
