export class DataBaseError extends Error {
  constructor(public readonly message: string, public readonly code: string) {
    super();
  }
}
