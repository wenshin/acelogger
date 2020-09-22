# Acelogger

Acelogger is a light and powerful logger with tracing and metrics logging. It is inspired by opentelemetry-js.

# Design

## Why make a new one?

opentelemetry, opentracing and other libraries, are hard to understand and use.

1. too many concepts. TracerProvider, Tracer, SpanProcessor, Span, Logger, Event, Metric, MetricProvider etc.
2. large code size

   1. @opentelemetry/tracing Minimized 39.9kb
   2. @opentelemetry/api Minimized 13.8kb
   3. @opentelemetry/web Minimized 46.1kb
   4. acelogger minimized 22kb

3. bad design

   1. circulation dependencies
   2. do not support tree shaking

## Core Concepts

The logging, tracing and metrics will generate events which logged by logger,
event have different alert level and event type.

1. tracer is just the factory class for span.
2. logger use tracer to create span and span context.
3. logger can create, record and export events.
4. define exporter with alert level, includes: debug, info, warn, error
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
  AlertLevel,
  CanonicalCode,
  isMetricEvent
} from 'acelogger';

ace.logger.setAttributes({
  os: 'MacOS',
  osVersion: '13.0'
});

class MetricExporterWeb implements LoggerEventExporter {
  export(evts: LoggerEvent[]) {
    const metricEvents = evts.filter(isMetricEvent);
    console.log(metricEvents);
  }
}

// set event exporter, for mesage logging
ace.logger.setExporter(AlertLevel.Debug, new ConsoleExporterWeb());
// set event exporter, for metric reportings
ace.logger.setExporter(AlertLevel.Debug, new MetricExporterWeb());
// export events immediately
ace.logger.setBufferSize(0);

// log info level message
ace.logger.info('test info');
ace.logger.store({
  data: {
    memoryUsage: 0.1,
    cpuUsage: 0.5
  }
});
ace.logger.count('button_click');
ace.logger.timming('fetch', 500, {
  attributes: {
    url: 'https://demo.com'
  }
});

// creat a span logger
const spanLogger = ace.logger.startSpan('first.span', {
  parent: ace.tracer.createSpanContext()
});

spanLogger.setAttributes({
  path: '/path/to'
});

spanLogger.info('test info');
spanLogger.count('http_request');

spanLogger.endSpan({
  status: CanonicalCode.OK
});
```

## Customize Logger

when logging in module, you can customize a scoped logger.

```typescript
import globaleAce, {
  Manager,
  SimpleTracer,
  SimpleLogger,
  AlertLevel,
  ConsoleExporterWeb
} from '../src';
const manager = new Manager();

manager.setLogger(new SimpleLogger());
manager.setTracer(new SimpleTracer());
manager.logger.setAttributes({
  app: globaleAce.logger.getAttributes().app,
  appVersion: globaleAce.logger.getAttributes().appVersion,
  name: 'my-module'
});

// init logger exporter
manager.logger.setExporter(AlertLevel.Debug, new ConsoleExporterWeb());
manager.logger.setBufferSize(0);

export { manager as ace };
```

## API

[See Details](./src/api)

# ChangeLog

## 2020-08-27 0.0.6

- fix: build with no files

## 2020-08-27 0.0.5

- fix: console logger name is undefined

## 2020-08-12 0.0.4

- remove span methods

## 2020-08-10 0.0.3

- new singleton api

## 2020-08-02 0.0.2

- fix opentelemetry-api do not support tree shaking problem

## 2020-08-02 0.0.1

- first version with logger and tracer
