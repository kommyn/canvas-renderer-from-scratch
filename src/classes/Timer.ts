export class Timer {
  private _time: number = Date.now();

  start() {
    this._time = Date.now();
  }

  getElapsedTime() {
    const timeNow = Date.now();
    const elapsedTime = timeNow - this._time;
    this._time = timeNow;

    return elapsedTime;
  }
}
