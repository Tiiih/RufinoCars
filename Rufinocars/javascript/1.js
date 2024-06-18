window.HUB_EVENTS = {
    
}, "object" != typeof window.CP && (window.CP = {}), window.CP.PenTimer = {
  programNoLongerBeingMonitored: !1,
  timeOfFirstCallToShouldStopLoop: 0,
  _loopExits: {},
  _loopTimers: {},
  START_MONITORING_AFTER: 2e3,
  STOP_ALL_MONITORING_TIMEOUT: 5e3,
  MAX_TIME_IN_LOOP_WO_EXIT: 2200,
  exitedLoop: function (E) {
    this._loopExits[E] = !0
  },
  shouldStopLoop: function (E) {
    if (this.programKilledSoStopMonitoring) return !0;
    if (this.programNoLongerBeingMonitored) return !1;
    if (this._loopExits[E]) return !1;
    var _ = this._getTime();
    if (0 === this.timeOfFirstCallToShouldStopLoop) return this.timeOfFirstCallToShouldStopLoop = _, !1;
    var o = _ - this.timeOfFirstCallToShouldStopLoop;
    if (o < this.START_MONITORING_AFTER) return !1;
    if (o > this.STOP_ALL_MONITORING_TIMEOUT) return this.programNoLongerBeingMonitored = !0, !1;
    try {
      this._checkOnInfiniteLoop(E, _)
    } catch (N) {
      return this._sendErrorMessageToEditor(), this.programKilledSoStopMonitoring = !0, !0
    }
    return !1
  },
  _sendErrorMessageToEditor: function () {
    try {
      if (this._shouldPostMessage()) {
        var E = {
          topic: HUB_EVENTS.PEN_ERROR_INFINITE_LOOP,
          data: {
            line: this._findAroundLineNumber()
          }
        };
        parent.postMessage(E, "*")
      } else this._throwAnErrorToStopPen()
    } catch (_) {
      this._throwAnErrorToStopPen()
    }
  },
  _shouldPostMessage: function () {
    return document.location.href.match(/boomboom/)
  },
  _throwAnErrorToStopPen: function () {
    throw "We found an infinite loop in your Pen. We've stopped the Pen from running. More details and workarounds at https://blog.codepen.io/2016/06/08/can-adjust-infinite-loop-protection-timing/"
  },
  _findAroundLineNumber: function () {
    var E = new Error,
      _ = 0;
    if (E.stack) {
      var o = E.stack.match(/boomboom\S+:(\d+):\d+/);
      o && (_ = o[1])
    }
    return _
  },
  _checkOnInfiniteLoop: function (E, _) {
    if (!this._loopTimers[E]) return this._loopTimers[E] = _, !1;
    var o;
    if (_ - this._loopTimers[E] > this.MAX_TIME_IN_LOOP_WO_EXIT) throw "Infinite Loop found on loop: " + E
  },
  _getTime: function () {
    return +new Date
  }
}, window.CP.shouldStopExecution = function (E) {
  var _ = window.CP.PenTimer.shouldStopLoop(E);
  return !0 === _ && console.warn("[CodePen]: An infinite loop (or a loop taking too long) was detected, so we stopped its execution. More details at https://blog.codepen.io/2016/06/08/can-adjust-infinite-loop-protection-timing/"), _
}, window.CP.exitedLoop = function (E) {
  window.CP.PenTimer.exitedLoop(E)
};