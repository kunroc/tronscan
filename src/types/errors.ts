export enum ErrorType {
  CONFIG_ERROR = 'CONFIG_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  DATA_ERROR = 'DATA_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}

export class AppError extends Error {
  type: ErrorType;
  timestamp: number;

  constructor(message: string, type: ErrorType) {
    super(message);
    this.type = type;
    this.timestamp = Date.now();
    this.name = 'AppError';
  }
}