# Acelogger

Acelogger is a light and powerful logger with tracing and metrics logging. It is inspired by opentelemetry-js api.

# Design

## Why make a new one?

opentelemetry, opentracing and other libraries, are hard to understand and use.

## Core Concept

The logging, tracing and metrics are all just the events logged by logger, event have different alert level and event type.

1. tracer is just the factory class for span
2. span is just struct without methods
3. logger use tracer to create span and span context
4. logger create, record, sample and export events
5. alert level includes: debug, info, warn, error
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
import {
  api,
  Tracer,
  ConsoleExporterWeb,
  AlertLevel,
  CanonicalCode,
  isMetricEvent
} from 'acelogger';

api.setTracer(
  new Tracer({
    name: 'demo.app',
    version: '0.0.1'
  })
);
api.tracer.setAttributes({
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
api.logger.setExporter(AlertLevel.Debug, new ConsoleExporterWeb());
// set event exporter, for metric reportings
api.logger.setExporter(AlertLevel.Debug, new MetricExporterWeb());
// export events immediately
api.logger.setBufferSize(0);

// log info level message
api.logger.info('test info');
api.logger.store({
  data: {
    memoryUsage: 0.1,
    cpuUsage: 0.5
  }
});
api.logger.count('button_click');
api.logger.timming('fetch', 500, {
  attributes: {
    url: 'https://demo.com'
  }
});

// creat a span logger
const spanLogger = api.logger.startSpan('first.span', {
  parent: api.tracer.createSpanContext()
});

spanLogger.endSpan({
  status: CanonicalCode.OK
});
```

## API

### LoggerEvent

- logging message: debug, info, warn, error
- logging tracing: startSpan, endSpan
- logging metrics: store, count, timing
- custom exporter: setExporter
- custom sampler: setSampler
- custom buffer size: setBufferSize

[See Details](./src/api)

# ChangeLog
