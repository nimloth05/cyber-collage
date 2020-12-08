import {asDisposable, Disposable} from "@/model/util/Disposable";

export class ListenerList<T> {
  private listeners: Array<T> = [];

  register(listener: T): Disposable {
    this.listeners.push(listener);
    return asDisposable((): void => {
      this.listeners.splice(this.listeners.indexOf(listener), 1);
    });
  }

  notify(...args: unknown[]) {
    this.listeners.forEach((listener: any) => listener(...args));
  }
}
