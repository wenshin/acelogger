import { Span, SpanStruct, Attributes } from './api';

export default class SimpleSpan implements Span {
  private data: SpanStruct;

  constructor(options: SpanStruct) {
    this.data = options;
  }

  public toJSON(): SpanStruct {
    return this.data;
  }

  public setAttributes(attrs: Attributes): void {
    if (!this.data.attributes) {
      this.data.attributes = attrs;
    } else {
      Object.assign(this.data.attributes, attrs);
    }
  }
}
