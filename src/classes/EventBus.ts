export class EventBus<
  E extends Record<string, unknown>,
  K extends keyof E = keyof E,
> {
  private _events: { [K in keyof E]?: Set<(params: E[K]) => void> } = {};

  on(name: K, callback: (params: E[K]) => void) {
    if (!this._events[name]) this._events[name] = new Set();

    this._events[name]?.add(callback);
  }

  off(name: K, callback: (params: E[K]) => void) {
    const callbacks = this._events[name];

    if (!this._events[name]) {
      console.warn(`Event with name "${String(name)}" is not registered`);
      return;
    }

    callbacks?.delete(callback);
  }

  emit(name: K, params: E[K]) {
    const callbacks = this._events[name];

    if (!callbacks)
      return console.warn(
        `Event with name "${String(name)}" has no registered subscribers`,
      );

    callbacks.forEach((callback) => callback(params));
  }
}
