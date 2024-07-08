// Obfuscation Canvas
const fakeCanvasData = "data:image/png;base64,..."; // fake canvas data
const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
HTMLCanvasElement.prototype.toDataURL = function () {
  return fakeCanvasData;
};

// Obfuscation WebGL
const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
WebGLRenderingContext.prototype.getParameter = function (param) {
  if (param === 37445 || param === 37446) {
    // MAX_TEXTURE_SIZE and MAX_VIEWPORT_DIMS
    return 4096;
  }
  return originalGetParameter(param);
};

// Obfuscation WebRTC
const fakeRTCIceCandidate =
  "a=candidate:0 1 UDP 2122260223 192.0.2.1 54400 typ host";
const originalCreateDataChannel = RTCDataChannel.prototype.createDataChannel;
RTCDataChannel.prototype.createDataChannel = function () {
  return fakeRTCIceCandidate;
};

// Obfuscation geolocation
navigator.geolocation.getCurrentPosition = function (success, error, options) {
  success({
    coords: {
      latitude: 37.7749,
      longitude: -122.4194,
      accuracy: 100,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: Date.now(),
  });
};

// Obfuscation cookies access
Object.defineProperty(document, "cookie", {
  get: function () {
    console.log("Cookie read attempt detected");
    chrome.runtime.sendMessage({ type: "cookieReadAttempt" });
    return ""; // response with empty string cookie
  },
  set: function (cookie) {
    // set cookie with the current domain
    const domain = document.domain;
    const newCookie = cookie.replace(
      /;\s*domain\s*=[^;]+/,
      `; domain=${domain}`
    );
    document.__defineGetter__("cookie", () => newCookie);
  },
});
