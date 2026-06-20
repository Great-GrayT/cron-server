import { ProgressUpdate } from "@/types/progress";

type ProgressCallback = (update: ProgressUpdate) => void;

export class ProgressEmitter {
  private callbacks: ProgressCallback[] = [];
  public logs: string[] = []; // Store all log messages

  subscribe(callback: ProgressCallback): () => void {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  emit(update: ProgressUpdate) {
    this.callbacks.forEach(callback => {
      try {
        callback(update);
      } catch (error) {
        console.error('Error in progress callback:', error);
      }
    });
  }

  progress(stage: string, message: string, current?: number, total?: number) {
    const percentage = current !== undefined && total !== undefined
      ? Math.round((current / total) * 100)
      : undefined;

    // Store the message in logs array
    this.logs.push(message);

    this.emit({
      type: 'progress',
      stage,
      message,
      current,
      total,
      percentage,
    });
  }

  complete(stage: string, message: string, data?: any) {
    // Store the message in logs array
    this.logs.push(message);

    this.emit({
      type: 'complete',
      stage,
      message,
      percentage: 100,
      data,
    });
  }

  error(stage: string, message: string) {
    // Store the message in logs array
    this.logs.push(`ERROR: ${message}`);

    this.emit({
      type: 'error',
      stage,
      message,
    });
  }

  getLogs(): string[] {
    return this.logs;
  }
}
