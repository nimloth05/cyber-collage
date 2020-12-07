export function asDisposable(f: () => void): Disposable {
  return {
    dispose(): void {
      f();
    },
  };
}

export const EmptyDisposable: Disposable = asDisposable(() => undefined);

export interface Disposable {
  dispose(): void;
}

export class Disposables implements Disposable {
  private disposables: Array<Disposable> = [];

  add(disposable: Disposable): void {
    this.disposables.push(disposable);
  }

  dispose(): void {
    this.disposables.forEach(d => d.dispose());
    this.disposables = [];
  }
}
