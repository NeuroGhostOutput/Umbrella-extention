document.addEventListener("DOMContentLoaded", function () {
  const blockTrackersCheckbox = document.getElementById("blockTrackers");
  const obfuscateDataCheckbox = document.getElementById("obfuscateData");
  const sendDNTCheckbox = document.getElementById("sendDNT");
  const blockThirdPartyCookiesCheckbox = document.getElementById(
    "blockThirdPartyCookies"
  );

  const updateCheckboxes = (result) => {
    blockTrackersCheckbox.checked =
      result.blockTrackers !== undefined ? result.blockTrackers : true;
    obfuscateDataCheckbox.checked =
      result.obfuscateData !== undefined ? result.obfuscateData : true;
    sendDNTCheckbox.checked =
      result.sendDNT !== undefined ? result.sendDNT : true;
    blockThirdPartyCookiesCheckbox.checked =
      result.blockThirdPartyCookies !== undefined
        ? result.blockThirdPartyCookies
        : true;
  };

  const updateStatistics = (result) => {
    document.getElementById("cookieReadAttempts").innerText =
      result.cookieReadAttempts || 0;
    document.getElementById("portScanAttempts").innerText =
      result.portScanAttempts || 0;
    document.getElementById("trackingAttempts").innerText =
      result.trackingAttempts || 0;
    document.getElementById("ipAddress").innerText =
      result.ipAddress || "Loading...";
    document.getElementById("ipInfo").innerText = result.ipInfo
      ? JSON.stringify(result.ipInfo, null, 2)
      : "Loading...";
  };

  const onCheckboxChange = (key, checkbox) => {
    chrome.storage.local.set({ [key]: checkbox.checked });
  };

  blockTrackersCheckbox.addEventListener("change", () =>
    onCheckboxChange("blockTrackers", blockTrackersCheckbox)
  );
  obfuscateDataCheckbox.addEventListener("change", () =>
    onCheckboxChange("obfuscateData", obfuscateDataCheckbox)
  );
  sendDNTCheckbox.addEventListener("change", () =>
    onCheckboxChange("sendDNT", sendDNTCheckbox)
  );
  blockThirdPartyCookiesCheckbox.addEventListener("change", () =>
    onCheckboxChange("blockThirdPartyCookies", blockThirdPartyCookiesCheckbox)
  );

  chrome.storage.local.get(
    ["blockTrackers", "obfuscateData", "sendDNT", "blockThirdPartyCookies"],
    updateCheckboxes
  );

  chrome.storage.local.get(
    [
      "cookieReadAttempts",
      "portScanAttempts",
      "trackingAttempts",
      "ipAddress",
      "ipInfo",
    ],
    updateStatistics
  );

  chrome.runtime.sendMessage({ type: "popupOpened" });

  window.addEventListener("beforeunload", function () {
    chrome.runtime.sendMessage({ type: "popupClosed" });
  });

  chrome.runtime.onMessage.addListener(function (message) {
    if (message.type === "updateIpInfo") {
      const ipAddressElement = document.getElementById("ipAddress");
      const ipInfoElement = document.getElementById("ipInfo");

      if (ipAddressElement) {
        ipAddressElement.innerText = message.ipAddress;
      } else {
        console.error("Element with ID 'ipAddress' not found.");
      }

      if (ipInfoElement) {
        ipInfoElement.innerText = JSON.stringify(message.ipInfo, null, 2);
      } else {
        console.error("Element with ID 'ipInfo' not found.");
      }
    }
  });
});
// 