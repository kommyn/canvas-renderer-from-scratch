export class StateMachine<T extends string> {
  private _state: T;
  private _transitions: Record<T, Record<T, T>>;

  constructor(initialState: T, transitions: Record<T, Record<T, T>>) {
    this._state = initialState;
    this._transitions = transitions;
  }

  dispatch(nextState: string) {
    const next = this._transitions[this._state][nextState as T] as
      T | undefined;

    if (next) this._state = next;
  }
}
