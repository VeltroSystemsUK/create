// FB.bindings — widget binding wiring engine
//
// Widgets register runtime setters via FB.bindings.registerSetter().
// Block data stores bindings: [{ sourceId, sourceEvent, targetProp, inputRange, outputRange }]
// FB.bindings.wire() subscribes source events to target setters with value mapping.
// Called at the end of every _VeltroInitAll() run.

window.FB = window.FB || {};

FB.bindings = {
  _setters: {}, // { blockId: { propName: fn } }

  registerSetter: function (blockId, propName, fn) {
    if (!this._setters[blockId]) this._setters[blockId] = {};
    this._setters[blockId][propName] = fn;
  },

  _map: function (value, inMin, inMax, outMin, outMax) {
    var range = inMax - inMin || 1;
    var t = Math.max(0, Math.min(1, (value - inMin) / range));
    return outMin + t * (outMax - outMin);
  },

  // Wires all block bindings to their setters.
  // Clears previous binding subscriptions then re-registers fresh.
  // Safe to call on every _VeltroInitAll (idempotent).
  wire: function () {
    var self = this;
    FB.events._subs = {};
    if (!FB.state || !FB.state.blocks) return;
    FB.state.blocks.forEach(function (block) {
      if (!block.bindings || !block.bindings.length) return;
      var targetId = block.id;
      block.bindings.forEach(function (b) {
        var inR = b.inputRange || [0, 1];
        var outR = b.outputRange || [0, 1];
        FB.events.on(b.sourceId, b.sourceEvent, function (value) {
          var mapped = self._map(value, inR[0], inR[1], outR[0], outR[1]);
          var s = self._setters[targetId];
          if (s && s[b.targetProp]) s[b.targetProp](mapped);
        });
      });
    });
  },
};
