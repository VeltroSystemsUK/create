FB.ai = FB.ai || {};

FB.ai.getApiKey = function () {
  // sessionStorage is preferred — key does not persist after the tab closes.
  // Also check an optional build-time config object as a fallback.
  var stored = sessionStorage.getItem("fb-gemini-key");
  if (stored) return stored;
  if (typeof FB_AI_CONFIG !== "undefined" && FB_AI_CONFIG.geminiKey) {
    return FB_AI_CONFIG.geminiKey;
  }
  return null;
};

FB.ai.setApiKey = function (key) {
  // Use sessionStorage so the key is not persisted to disk and is cleared
  // automatically when the browser tab/window is closed.
  sessionStorage.setItem("fb-gemini-key", key);
};

FB.ai.clearApiKey = function () {
  sessionStorage.removeItem("fb-gemini-key");
};

FB.ai._extractJSON = function (text) {
  var start = text.indexOf("{");
  var end = text.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  var json = text.slice(start, end + 1);
  try {
    return JSON.parse(json);
  } catch (_) {
    return null;
  }
};

FB.ai.generateTemplate = function (userPrompt, onChunk, onDone, onError) {
  var apiKey = FB.ai.getApiKey();
  if (!apiKey) {
    if (onError) onError("No Gemini API key configured. Add one in settings.");
    return null;
  }

  var systemPrompt = FB.ai.getSystemPrompt();
  var requestBody = {
    contents: [
      {
        role: "user",
        parts: [
          { text: systemPrompt + "\n\n---\n\nUser request: " + userPrompt },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.95,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    },
  };

  var xhr = new XMLHttpRequest();
  var url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
    encodeURIComponent(apiKey);

  xhr.open("POST", url);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        var data = JSON.parse(xhr.responseText);
        var text = "";
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          var parts = data.candidates[0].content.parts || [];
          text = parts
            .map(function (p) {
              return p.text || "";
            })
            .join("");
        }
        if (onChunk) onChunk(text);
        var parsed = FB.ai._extractJSON(text);
        if (parsed) {
          if (onDone) onDone(parsed);
        } else {
          if (onError)
            onError("AI returned invalid JSON. Try rephrasing your prompt.");
        }
      } catch (e) {
        if (onError) onError("Failed to parse API response: " + e.message);
      }
    } else {
      var errMsg = "API error: " + xhr.status;
      try {
        var errData = JSON.parse(xhr.responseText);
        if (errData.error && errData.error.message)
          errMsg = errData.error.message;
      } catch (_) {}
      if (onError) onError(errMsg);
    }
  };

  xhr.onerror = function () {
    if (onError) onError("Network error — check your connection and API key.");
  };

  xhr.send(JSON.stringify(requestBody));
  return {
    abort: function () {
      xhr.abort();
    },
  };
};
