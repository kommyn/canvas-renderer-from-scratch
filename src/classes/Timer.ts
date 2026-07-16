export class Timer {
  private _time: number = performance.now();

  start() {
    this._time = performance.now();
  }

  getElapsedTime() {
    const timeNow = performance.now();
    const elapsedTime = timeNow - this._time;
    this._time = timeNow;

    return elapsedTime;
  }
}
