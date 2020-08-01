import { api, Tracer } from '.';
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

api.logger.setExporter(AlertLevel.Debug, new Exporter());

beforeAll(() => {
  api.setTracer(
    new Tracer({
      name: 'test.app',
      version: '0.0.1'
    })
  );

  api.setTimer({
    now(): number {
      return performance.timeOrigin + performance.now();
    }
  });
});

afterAll(() => {
  api.setTracer(null);
});

beforeEach(() => {
  api.logger.flush();
  mockExport.mockReset();
});

test('SimpleLogger::startSpan without remote context', () => {
  const tracer = api.tracer.toJSON();
  const logger = api.logger.startSpan('test.span1');
  expect(logger.span).toBeTruthy();
  expect(logger.span.startTime).toBeTruthy();
  expect(logger.span.context.spanId).toBe('1');
  expect(logger.span.context.traceId).toBeTruthy();

  // event is in buffer
  expect(mockExport.mock.calls.length).toBe(0);
  logger.flush();
  expect(mockExport.mock.calls.length).toBe(1);

  const args = mockExport.mock.calls[0];
  expect(args[0].length).toBe(1);
  expect(args[0][0].attributes).toEqual({
    spanId: logger.span.context.spanId,
    spanKind: SpanKind.INTERNAL,
    spanName: logger.span.name,
    traceId: logger.span.context.traceId,
    tracerModule: tracer.module,
    tracerModuleVersion: tracer.moduleVersion,
    tracerName: tracer.name,
    tracerVersion: tracer.version
  });
  expect(args[0][0].name).toBe('test.span1.start');
  expect(args[0][0].message).toBe('count test.span1.start 1 times');
  expect(args[0][0].level).toBe(AlertLevel.Info);
  expect(args[0][0].data).toBe(1);
  expect(args[0][0].status).toBe(CanonicalCode.OK);
  expect(args[0][0].type).toBe(EventType.Count);
});

test('SimpleLogger::startSpan with remote context', () => {
  const startTime = api.timer.now() - 1000;
  const logger = api.logger.startSpan('test.span', {
    kind: SpanKind.SERVER,
    parent: {
      spanId: '1.1',
      traceFlags: TraceFlags.NONE,
      traceId: '123'
    },
    startTime
  });
  expect(logger.span.startTime).toBe(startTime);
  expect(logger.span.kind).toBe(SpanKind.SERVER);
});

test('SimpleLogger::startSpan start sub span', () => {
  const logger1 = api.logger.startSpan('test.span1');
  const logger2 = logger1.startSpan('test.span2');
  expect(logger2.span).toBeTruthy();
  expect(logger2.span.context.spanId).toBe('1.1');
  expect(logger2.span.context.traceId).toBe(logger1.span.context.traceId);
});

test('SimpleLogger::endSpan without time option', () => {
  const tracer = api.tracer.toJSON();
  const logger = api.logger.startSpan('test.span');
  logger.endSpan();
  expect(mockExport.mock.calls.length).toBe(0);
  logger.flush();
  expect(mockExport.mock.calls.length).toBe(1);

  const evts = mockExport.mock.calls[0][0];
  expect(evts.length).toBe(3);
  // timing end span
  expect(evts[1].attributes).toEqual({
    spanId: logger.span.context.spanId,
    spanKind: SpanKind.INTERNAL,
    spanName: logger.span.name,
    traceId: logger.span.context.traceId,
    tracerModule: tracer.module,
    tracerModuleVersion: tracer.moduleVersion,
    tracerName: tracer.name,
    tracerVersion: tracer.version
  });
  expect(evts[1].name).toBe('test.span.end');
  expect(evts[1].message).toBe(
    `timing test.span.end ${logger.span.endTime - logger.span.startTime}ms`
  );
  expect(evts[1].level).toBe(AlertLevel.Info);
  expect(evts[1].data).toBe(logger.span.endTime - logger.span.startTime);
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
  const logger = api.logger.startSpan('test.span');
  logger.endSpan({
    time: endTime
  });
  logger.flush();

  const evts = mockExport.mock.calls[0][0];
  expect(evts.length).toBe(3);
  expect(evts[1].data).toBe(endTime - logger.span.startTime);
});

test('SimpleLogger::endSpan with error status', () => {
  const logger = api.logger.startSpan('test.span');
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
  api.logger.endSpan();
  api.logger.flush();
  const evts = mockExport.mock.calls[0][0];
  expect(evts[0].message).toBe(
    'logger.endSpan must call after logger.startSpan'
  );
  expect(evts[0].level).toBe(AlertLevel.Error);
});

test('SimpleLogger log message whitout span', () => {
  api.logger.debug('test debug', {
    data: { test: 'debug' }
  });
  api.logger.info('test info', {
    data: { test: 'info' }
  });
  api.logger.warn('test warn', {
    data: { test: 'warn' }
  });
  api.logger.error(new Error('test error'), {
    data: { test: 'error' }
  });
  api.logger.flush();

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
      expect(evts[0].error).toBeTruthy();
    }
  }
});

test('SimpleLogger::setBufferSize set buffer size to 0', () => {
  api.logger.setBufferSize(0);
  api.logger.info('test set buffer size');
  expect(mockExport.mock.calls.length).toBe(1);
  api.logger.setBufferSize(10);
});

test('SimpleLogger buffer is full', () => {
  api.logger.setBufferSize(2);
  api.logger.info('test set buffer size');
  api.logger.info('test set buffer size');
  expect(mockExport.mock.calls.length).toBe(1);
  api.logger.setBufferSize(10);
});

test('SimpleLogger sampler return false', () => {
  api.logger.setSampler(AlertLevel.Info, {
    shouldSample(): boolean {
      return false;
    }
  });
  api.logger.info('test set buffer size');
  api.logger.info('test set buffer size');
  api.logger.flush();
  expect(mockExport.mock.calls.length).toBe(0);
  api.logger.setSampler(AlertLevel.Info, null);
});

test('SimpleLogger sampler throw error and logger will not failed', () => {
  api.logger.setSampler(AlertLevel.Info, {
    shouldSample(): boolean {
      throw new Error('sampler error');
    }
  });
  api.logger.info('test set buffer size');
  api.logger.setSampler(AlertLevel.Info, null);
});

test('SimpleLogger::store', () => {
  api.logger.store({
    data: {
      cpuUsage: 0.1
    },
    name: 'performance'
  });
  api.logger.flush();
  const evts = mockExport.mock.calls[0][0];
  expect(evts[0].name).toBe('performance');
  expect(evts[0].message).toBe('store cpuUsage metrics');
  expect(evts[0].level).toBe(AlertLevel.Info);
  expect(evts[0].data).toEqual({
    cpuUsage: 0.1
  });
});
