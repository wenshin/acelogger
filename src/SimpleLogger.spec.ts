import { SimpleManager } from '.';
import {
  LogLevel,
  ExporterEvents,
  LoggerEventExporter,
  EventType,
  TraceFlags,
  SpanKind,
  CanonicalCode,
  ExportResult,
  Manager,
} from './api';
import { performance } from 'perf_hooks';
// 本来可以设置 resolveJsonModule 为 true 的，但是这样会导致最终构建的时候，输出目录会包含 src 目录
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pkg from '../package.json';

function createMockLib(): {
  ace: Manager;
  mockExport: jest.Mock<undefined, ExporterEvents[]>;
} {
  const mockExport = jest.fn();
  const ace = new SimpleManager();
  class Exporter implements LoggerEventExporter {
    public export(
      evts: ExporterEvents,
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
    },
  });
  ace.setAttributes({
    app: 'test-app',
    appVersion: '0.0.1',
    os: 'mac',
    osVersion: '1.0',
    env: 'test',
  });
  ace.setFlushReady();
  return { ace, mockExport };
}

function getEvents(args: ExporterEvents[]) {
  const exEvts = args[0];
  const loggerEvts = exEvts.events[0];
  const evt = loggerEvts.events[0];
  return { exEvts, loggerEvts, evt };
}

test('SimpleLogger::startSpan without remote context', (done) => {
  const { ace, mockExport } = createMockLib();
  const logger = ace.logger.startSpan('test.span1');
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

    const { exEvts, loggerEvts, evt } = getEvents(mockExport.mock.calls[0]);
    expect(exEvts.events.length).toBe(1);
    expect(exEvts.attributes).toEqual({
      app: 'test-app',
      appVersion: '0.0.1',
      lib: pkg.name,
      libVersion: pkg.version,
      env: 'test',
      os: 'mac',
      osVersion: '1.0',
    });
    expect(loggerEvts.attributes).toEqual({
      logger: 'unknown',
      spanKind: SpanKind.INTERNAL,
      spanName: span.name,
    });
    expect(loggerEvts.events.length).toBe(1);
    expect(evt.spanId).toEqual(span.context.spanId);
    expect(evt.traceId).toEqual(span.context.traceId);
    expect(evt.name).toBe('test.span1.start');
    expect(evt.message).toBe(undefined);
    expect(evt.level).toBe(LogLevel.Info);
    expect(evt.metrics).toEqual({ 'test.span1.start.latency': 0 });
    expect(evt.traceFlags).toBe(TraceFlags.NONE);
    expect(evt.status).toBe(CanonicalCode.OK);
    expect(evt.type).toBe(EventType.Tracing);
    const logger2 = ace.logger.startSpan('test.span2', {
      logStart: false,
    });
    expect(logger2.span.context.spanId).toBe(
      `${logger2.span.context.traceId}-2`
    );
    expect(
      logger2.span.context.traceId === logger.span.context.traceId
    ).toBeTruthy();
    done();
  });
});

test('SimpleLogger::startSpan with remote context', (done) => {
  const { ace, mockExport } = createMockLib();
  const startTime = ace.timer.now() - 1000;
  const logger = ace.logger.startSpan('test.span', {
    kind: SpanKind.SERVER,
    parent: {
      spanId: '1.1',
      traceFlags: TraceFlags.SAMPLED,
      traceId: '123',
    },
    data: { test: 1 },
    startTime,
  });
  const spanmetrics = logger.span;
  expect(spanmetrics.context.spanId).toBe('1.1.1');
  expect(spanmetrics.userStartTime).toBe(startTime);
  expect(spanmetrics.kind).toBe(SpanKind.SERVER);

  logger.flush(() => {
    try {
      const { evt } = getEvents(mockExport.mock.calls[0]);
      expect(evt.traceFlags).toBe(TraceFlags.SAMPLED);
      expect(evt.metrics).toEqual({
        'test.span.start.latency':
          spanmetrics.startTime - spanmetrics.userStartTime,
      });
      expect(evt.spanId).toEqual(spanmetrics.context.spanId);
      expect(evt.traceId).toEqual(spanmetrics.context.traceId);
      expect(evt.data).toEqual({ test: 1, userStartTime: startTime });
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
    spanName: 'test.span1',
  });
  expect(logger2.span.context.spanId).toBe(`${logger1.span.context.spanId}.1`);
  expect(logger2.getAttributes().spanName).toBe('test.span2');
  expect(logger3.span.context.spanId).toBe(`${logger1.span.context.spanId}.2`);

  const span2 = logger2.span;
  expect(span2.context.spanId).toBe(`${logger1.span.context.spanId}.1`);
  expect(span2.context.traceId).toBe(logger1.span.context.traceId);
});

test('SimpleLogger::startSpan logStart is false', (done) => {
  const { ace, mockExport } = createMockLib();
  const logger1 = ace.logger.startSpan('test.span1', {
    logStart: false,
  });
  logger1.flush(() => {
    expect(mockExport.mock.calls.length).toBe(0);
    done();
  });
});

test('SimpleLogger::endSpan without event argument', (done) => {
  const { ace, mockExport } = createMockLib();
  ace.logger.setAttributes({
    logger: 'end-span-test',
    parent: 'test',
  });
  const logger = ace.logger.startSpan('test.span', {
    logStart: false,
  });
  logger.setAttributes({
    tag1: 'tag1',
    tag2: 'tag1',
  });
  logger.setAttributes({
    tag2: 'tag2',
  });
  logger.endSpan();
  expect(mockExport.mock.calls.length).toBe(0);
  logger.flush(() => {
    try {
      expect(mockExport.mock.calls.length).toBe(1);
      const { exEvts, evt, loggerEvts } = getEvents(mockExport.mock.calls[0]);
      const span = logger.span;
      expect(exEvts.events.length).toBe(1);
      // timing end span
      expect(exEvts.attributes).toEqual({
        app: 'test-app',
        appVersion: '0.0.1',
        lib: pkg.name,
        libVersion: pkg.version,
        env: 'test',
        os: 'mac',
        osVersion: '1.0',
      });
      expect(loggerEvts.attributes).toEqual({
        spanKind: SpanKind.INTERNAL,
        spanName: 'test.span',
        logger: 'end-span-test',
        parent: 'test',
        tag1: 'tag1',
        tag2: 'tag2',
      });
      expect(evt.name).toBe('test.span.end');
      expect(evt.message).toBe(
        `test.span end with ${logger.span.endTime - logger.span.startTime}ms`
      );
      expect(evt.level).toBe(LogLevel.Info);
      expect(span.startTime).toEqual(span.userStartTime);
      expect(evt.metrics).toEqual({
        'test.span.duration': span.endTime - span.startTime,
      });
      expect(evt.status).toBe(CanonicalCode.OK);
      expect(evt.type).toBe(EventType.Tracing);
      done();
    } catch (err) {
      done(err);
    }
  });
});

test('SimpleLogger::endSpan with event argument', (done) => {
  const { ace, mockExport } = createMockLib();
  const endTime = Date.now() + 1000;
  const logger = ace.logger.startSpan('test.span');
  logger.endSpan({
    level: LogLevel.Error,
    message: 'endSpan message',
    status: CanonicalCode.NOT_FOUND,
    time: endTime,
    traceFlags: TraceFlags.SAMPLED,
  });
  ace.flush(() => {
    try {
      expect(mockExport.mock.calls.length).toBe(2);
      const { evt } = getEvents(mockExport.mock.calls[1]);
      expect(evt.message).toBe(
        `test.span end with ${
          logger.span.endTime - logger.span.startTime
        }ms, endSpan message`
      );
      expect(evt.level).toBe(LogLevel.Error);
      expect(evt.traceFlags).toBe(TraceFlags.SAMPLED);
      expect(evt.status).toBe(CanonicalCode.NOT_FOUND);
      expect(evt.metrics).toEqual({
        'test.span.duration': endTime - logger.span.startTime,
      });
      done();
    } catch (error) {
      done(error);
    }
  });
});

test('SimpleLogger::endSpan with error status', (done) => {
  const { ace, mockExport } = createMockLib();
  const logger = ace.logger.startSpan('test.span');
  logger.endSpan({
    level: LogLevel.Warn,
    status: CanonicalCode.INTERNAL,
  });
  ace.flush(() => {
    try {
      expect(mockExport.mock.calls.length).toBe(2);
      const { loggerEvts } = getEvents(mockExport.mock.calls[1]);
      const infoevts = loggerEvts.events;
      expect(infoevts.length).toBe(1);
      expect(infoevts[0].status).toBe(CanonicalCode.INTERNAL);
      expect(infoevts[0].level).toBe(LogLevel.Error);
      done();
    } catch (err) {
      done(err);
    }
  });
});

test('SimpleLogger::endSpan whitout span', (done) => {
  const { ace, mockExport } = createMockLib();
  ace.logger.endSpan();
  ace.logger.flush(() => {
    try {
      const { evt } = getEvents(mockExport.mock.calls[0]);
      expect(evt.message).toBe(
        'logger.endSpan must call after logger.startSpan'
      );
      expect(evt.level).toBe(LogLevel.Error);
      done();
    } catch (err) {
      done(err);
    }
  });
});

test('SimpleLogger log message whitout span', (done) => {
  const { ace, mockExport } = createMockLib();
  ace.logger.debug('test debug', {
    data: { test: 'debug' },
  });
  ace.logger.info('test info', {
    data: { test: 'info' },
  });
  ace.logger.warn('test warn', {
    data: { test: 'warn' },
  });
  ace.logger.error(new Error('test error'), {
    data: { test: 'error' },
  });
  ace.logger.fatal(new Error('test fatal'), {
    data: { test: 'fatal' },
  });

  ace.logger.flush(() => {
    try {
      expect(mockExport.mock.calls.length).toBe(5);

      const levels = ['debug', 'info', 'warn', 'error', 'fatal'];
      for (let i = 0; i < 5; i++) {
        const { evt } = getEvents(mockExport.mock.calls[i]);
        expect(evt.name).toBe(`log.${levels[i]}`);
        expect(evt.message).toBe('test ' + levels[i]);
        expect(evt.level).toBe(i);
        expect(evt.traceFlags).toBe(TraceFlags.NONE);
        expect(evt.spanId).toBe(`${ace.idCreator.defaultTraceId}-0`);
        expect(evt.traceId).toBe(ace.idCreator.defaultTraceId);
        expect(evt.data).toEqual({
          test: levels[i],
        });
        if (levels[i] === 'error' || levels[i] === 'fatal') {
          expect(evt.stack).toBeTruthy();
        }
      }
      done();
    } catch (err) {
      done(err);
    }
  });
});

test('SimpleLogger log error with string', (done) => {
  const { ace, mockExport } = createMockLib();
  ace.logger.error('test error', {
    data: { test: 'error' },
  });
  ace.logger.fatal('test fatal', {
    data: { test: 'fatal' },
  });

  ace.logger.flush(() => {
    try {
      expect(mockExport.mock.calls.length).toBe(2);

      const levels = ['error', 'fatal'];
      for (let i = 0; i < 2; i++) {
        const { evt } = getEvents(mockExport.mock.calls[i]);
        expect(evt.name).toBe(`log.${levels[i]}`);
        expect(evt.message).toBe('test ' + levels[i]);
        expect(evt.traceFlags).toBe(TraceFlags.NONE);
        expect(evt.spanId).toBe(ace.idCreator.defaultSpanId);
        expect(evt.traceId).toBe(ace.idCreator.defaultTraceId);
        expect(evt.data).toEqual({
          test: levels[i],
        });
        expect(evt.stack).toEqual(undefined);
      }
      done();
    } catch (err) {
      done(err);
    }
  });
});

test('SimpleLogger log with traceFlag', (done) => {
  const { ace, mockExport } = createMockLib();
  ace.logger.info('test set buffer size', {
    traceFlags: TraceFlags.SAMPLED,
  });
  ace.logger.flush(() => {
    try {
      const { evt } = getEvents(mockExport.mock.calls[0]);
      expect(evt.traceFlags).toBe(TraceFlags.SAMPLED);
      done();
    } catch (err) {
      done(err);
    }
  });
});

test('SimpleLogger::setBufferSize set buffer size to 0, from 0.10.0 only for compatible with old versions', () => {
  const { ace, mockExport } = createMockLib();
  ace.setBufferSize(0);
  ace.logger.info('test set buffer size');
  // async flush
  expect(mockExport.mock.calls.length).toBe(0);
});

test('SimpleLogger buffer is full, from 0.10.0 only for compatible with old versions', () => {
  const { ace } = createMockLib();
  ace.setBufferSize(2);
  ace.logger.info('test set buffer size');
  ace.logger.info('test set buffer size');
  expect(ace.flushing).toBeTruthy();
});

test('SimpleLogger::storeMetrics', (done) => {
  const { ace, mockExport } = createMockLib();
  ace.logger.storeMetrics({
    status: CanonicalCode.INTERNAL,
    message: 'test-store-message',
    samplingRate: 0.3,
    metrics: {
      cpuUsage: 0.1,
    },
  });
  ace.logger.flush(() => {
    try {
      const { evt } = getEvents(mockExport.mock.calls[0]);
      expect(evt.name).toBe('metric.store');
      expect(evt.status).toBe(CanonicalCode.INTERNAL);
      expect(evt.message).toBe('store {"cpuUsage":0.1}, test-store-message');
      expect(evt.level).toBe(LogLevel.Error);
      expect(evt.samplingRate).toBe(0.3);
      expect(evt.metrics).toEqual({
        cpuUsage: 0.1,
      });
      done();
    } catch (err) {
      done(err);
    }
  });
});

test('SimpleLogger::storeMetrics without message', (done) => {
  const { ace, mockExport } = createMockLib();
  ace.logger.storeMetrics({
    metrics: {
      cpuUsage: 0.1,
    },
  });
  ace.logger.flush(() => {
    try {
      const { evt } = getEvents(mockExport.mock.calls[0]);
      expect(evt.message).toBe('store {"cpuUsage":0.1}');
      expect(evt.status).toBe(CanonicalCode.OK);
      expect(evt.level).toBe(LogLevel.Debug);
      expect(evt.samplingRate).toBe(1);
      done();
    } catch (err) {
      done(err);
    }
  });
});

test('SimpleLogger::event without message', (done) => {
  const { ace, mockExport } = createMockLib();
  ace.logger.event('test-event', {
    attributes: {
      'my-attr': 'attr',
    },
  });
  ace.logger.flush(() => {
    try {
      const { evt } = getEvents(mockExport.mock.calls[0]);
      expect(evt.level).toBe(LogLevel.Info);
      expect(evt.attributes['my-attr']).toBe('attr');
      expect(evt.message).toBe(`log event: test-event`);
      done();
    } catch (err) {
      done(err);
    }
  });
});

test('SimpleLogger::event with message', (done) => {
  const { ace, mockExport } = createMockLib();
  ace.logger.event('test-event', {
    message: 'my test-event',
  });
  ace.logger.flush(() => {
    try {
      const { evt } = getEvents(mockExport.mock.calls[0]);
      expect(evt.message).toBe(`my test-event`);
      done();
    } catch (err) {
      done(err);
    }
  });
});

test('SimpleLogger::setAttributes update logger name and version', (done) => {
  const { ace, mockExport } = createMockLib();
  ace.logger.debug('test debug', {
    data: { test: 'debug' },
  });
  ace.logger.flush(() => {
    try {
      const { evt, loggerEvts } = getEvents(mockExport.mock.calls[0]);
      expect(loggerEvts.attributes).toEqual({
        logger: 'unknown',
        spanKind: 0,
        spanName: 'unknown',
      });
      expect(evt.attributes).toEqual(undefined);
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
    logger: 'unknown',
    spanKind: 0,
    spanName: 'unknown',
  });
});
