export class ResponseMessage {
  private message: string;

  constructor(message: string) {
    this.message = message;
  }

  getMessage(): string {
    return this.message;
  }
}
