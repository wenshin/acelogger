# Acelogger

Acelogger is a light and powerful logger with tracing and metrics logging. It is inspired by opentelemetry-js.

# Design

## Why make a new one?

opentelemetry, opentracing and other libraries, are hard to understand and use.

1. too many concepts. TracerProvider, Tracer, SpanProcessor, Span, Logger, Event, Metric, MetricProvider etc.
2. large code size

   1. @opentelemetry/tracing minimized 39.9kb
   2. @opentelemetry/api minimized 13.8kb
   3. @opentelemetry/web minimized 46.1kb
   4. acelogger minimized < 10kb

3. bad design

   1. circulation dependencies
   2. do not support tree shaking

## Core Concepts

The logging, tracing and metrics will generate events which logged by logger,
event have different alert level and event type.

1. tracer is just the factory class for span.
2. logger use tracer to create span and span context.
3. logger can create, record and export events.
4. define exporter with alert level, includes: debug, info, warn, error, fatal
5. exporter will sample the events
6. event type includes:
   1. log event, for message logging
   2. store, count and timing events, for metric reporting
   3. span start and span end events, for tracing

# Usage

## Install

```
$ npm install --save acelogger
```

## Example

```typescript
import ace, {
  ConsoleExporterWeb,
  LogLevel,
  CanonicalCode,
  isMetricEvent,
} from 'acelogger';

ace.logger.setAttributes({
  os: 'MacOS',
  osVersion: '13.0',
});

class MetricExporterWeb implements LoggerEventExporter {
  export(evts: LoggerEvent[]) {
    const metricEvents = evts.filter(isMetricEvent);
    console.log(metricEvents);
  }
}

// set event exporter, for mesage logging
ace.setExporter(LogLevel.Debug, new ConsoleExporterWeb());
// set event exporter, for metric reportings
ace.setExporter(LogLevel.Debug, new MetricExporterWeb());

// log info level message
ace.logger.info('test info');
ace.logger.storeMetrics({
  metrics: {
    memoryUsage: 0.1,
    cpuUsage: 0.5,
  },
});
ace.logger.event('button_click');

// creat a span logger
const spanLogger = ace.logger.startSpan('first.span', {
  parent: ace.tracer.createSpanContext(),
});

spanLogger.setAttributes({
  path: '/path/to',
});

spanLogger.info('test info');
spanLogger.event('button_click');

spanLogger.endSpan({
  status: CanonicalCode.OK,
});
```

## Customize Logger

when logging in module, you can customize a scoped logger.

```typescript
import globaleAce, {
  SimpleManager,
  LogLevel,
  ConsoleExporterWeb,
} from 'acelogger';
const manager = new SimpleManager();

manager.logger.setAttributes({
  app: globaleAce.logger.getAttributes().app,
  appVersion: globaleAce.logger.getAttributes().appVersion,
  lib: 'my-module@0.0.1',
});

// init logger exporter
manager.setExporter(LogLevel.Debug, new ConsoleExporterWeb());
manager.setBufferSize(0);

export { manager as ace };
```

## Customize Exporter

you can customize a exporter

```typescript
import ace, { TraceFlags, SimpleManager, LogLevel, ConsoleExporterWeb, isCountEvent } from 'acelogger';

// init logger exporter
manager.setExporter(LogLevel.Debug, {
  export(
    events: LoggerEvent[],
    resultCallback: (result: ExportResult) => void
  ): void {
    for (const evt of events) {
      if (evt.traceFlags === TraceFlags.SAMPLED && !isSimpled(evt)) {
        return;
      }
      if (evt.metrics) {
        logMetric(evt);
      } else if (isCountEvent(evt)) {
        logCount(evt)
      }
      logToFile(evt);
    }
  };
});
```

## API

[See Details](./src/api)

# ChangeLog

#### 2022-01-24 0.13.5

- feat: remove duration infomation in endSpan message

#### 2022-01-14 0.13.4

- feat: set logStart default is true
- feat: add IDGenerator api

#### 2022-01-13 0.13.3

- fix: default span id start with 0
- feat: add userStartTime to span start event

#### 2021-10-18 0.13.2

- refactor: new exporter api (break change)

#### 2021-10-18 0.12.1

- refactor: add some util for event name and metric name

#### 2021-10-11 0.12.0

- feat: enhancement default traceId and spanId

#### 2021-10-08 0.11.0

- feat: support set flush ready flag

#### 2021-10-08 0.10.0

- feat: remove setBufferSize

#### 2021-04-23 0.9.2

- feat: chage samplingRatio to samplingRate

#### 2021-04-20 0.9.0

- feat: SimpleManager support customize flush delay time

#### 2021-04-20 0.8.1

- feat: add samplingRatio for event and disable log start event by default

#### 2021-04-19 0.8.0

- feat: startSpan add logStart param to disable start span event

#### 2021-03-02 0.7.5

- fix: change \_\_debug to \_\_ace_debug

#### 2021-01-03 0.7.4

- feat: support data option for Logger.startSpan
- fix: logger.error and fatal not support string as message

#### 2020-12-12 0.7.3

- optimize: async flush events
- optimize: console expoter default only print warn, error, fatal logs

#### 2020-11-18 0.7.2

- fix: use strict rule for function type

#### 2020-11-18 0.7.1

- fix: storeMetrics support status

#### 2020-11-18 0.7.0 Breaking Change

- refactor: LoggerEvent structure changed
- refactor: remove isCountEvent

#### 2020-11-17 0.6.0 Breaking Change

- refactor: move setExporter & setBufferSize to Manager

#### 2020-11-17 0.5.2

- feat: move spanId and traceId to LoggerEvent.data

#### 2020-11-13 0.5.1

- update README.md

#### 2020-11-12 0.5.0 Breaking Change

- remove api count, timing, store
- add storeMetrics, event api

#### 2020-11-08 0.4.0

- remove some default attributes of LoggerEvent

#### 2020-11-07 0.3.0

- add fatal for Logger
- Logger.count only record 1 time
- LoggerEvent add metrics property and data property will without metrics

#### 2020-10-11 0.2.2

- add traceFlags for LoggerEvent, which can get sampled flag
- change endSpan message format, now have duration and customized message

#### 2020-09-25 0.2.1

- refactor isMetricEvent

#### 2020-09-24 0.2.0

- break change SimpleLogger api, to reduce duplicate logs

#### 2020-09-24 0.1.1

- remove unsafe dependencies

#### 2020-09-23 0.1.0

- refactor: new Manager api

#### 2020-08-27 0.0.6

- fix: build with no files

#### 2020-08-27 0.0.5

- fix: console logger name is undefined

#### 2020-08-12 0.0.4

- remove span methods

#### 2020-08-10 0.0.3

- new singleton api

#### 2020-08-02 0.0.2

- fix opentelemetry-api do not support tree shaking problem

#### 2020-08-02 0.0.1

- first version with logger and tracer
