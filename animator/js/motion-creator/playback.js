// Motion Creator — Playback Controller
var MS = window.MS = window.MS || {};

// ══════════════════════════════════════════════════════════
// PLAYBACK
// ══════════════════════════════════════════════════════════
MS.playback = {};

MS.playback.toggle = function () {
  var s = MS.project;
  s.playing = !s.playing;
  var btn = document.getElementById("ms-play-btn");
  if (btn) btn.textContent = s.playing ? "⏸" : "▶";
  if (s.playing) {
    if (s.time >= s.duration) s.time = 0;
    MS.playback._loop();
  }
};

MS.playback.stop = function () {
  var s = MS.project;
  s.playing = false;
  s.time = 0;
  document.getElementById("ms-play-btn").textContent = "▶";
  var ph = document.getElementById("ms-playhead");
  if (ph) ph.style.left = "0%";
  document.getElementById("ms-time").textContent =
    "0.0s / " + (s.duration / 1000).toFixed(1) + "s";
  MS.stage.draw();
};

MS.playback._loop = function () {
  if (!MS.project.playing) return;
  var s = MS.project;
  var dt = 16;
  s.time += dt;
  if (s.time > s.duration) {
    if (document.getElementById("ms-loop").checked) {
      s.time = 0;
    } else {
      s.time = s.duration;
      s.playing = false;
      document.getElementById("ms-play-btn").textContent = "▶";
    }
  }
  var pct = (s.time / s.duration) * 100;
  var ph = document.getElementById("ms-playhead");
  if (ph) ph.style.left = pct + "%";
  document.getElementById("ms-time").textContent =
    (s.time / 1000).toFixed(1) + "s / " + (s.duration / 1000).toFixed(1) + "s";
  MS.stage.draw();
  requestAnimationFrame(MS.playback._loop);
};
