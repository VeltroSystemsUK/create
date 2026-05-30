// FB.events — inter-widget event bus
// Emitters call emit(); receivers subscribe via on().
// Keys are "blockId:eventName" so each block's events are namespaced.

window.FB = window.FB || {};

FB.events = {
  _subs: {},

  on: function (blockId, event, cb) {
    var key = blockId + ":" + event;
    if (!this._subs[key]) this._subs[key] = [];
    this._subs[key].push(cb);
  },

  off: function (blockId, event, cb) {
    var key = blockId + ":" + event;
    if (!this._subs[key]) return;
    this._subs[key] = this._subs[key].filter(function (f) {
      return f !== cb;
    });
  },

  emit: function (blockId, event, value) {
    var key = blockId + ":" + event;
    var subs = this._subs[key];
    if (subs)
      subs.forEach(function (cb) {
        cb(value);
      });
  },

  // Remove all subscriptions whose source is blockId
  clearBlock: function (blockId) {
    var self = this;
    Object.keys(this._subs).forEach(function (key) {
      if (key.indexOf(blockId + ":") === 0) delete self._subs[key];
    });
  },
};
