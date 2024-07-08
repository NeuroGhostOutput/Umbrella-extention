let cookieReadAttempts = 0;
let portScanAttempts = 0;
let trackingAttempts = 0;
let ipAddress = "";
let ipInfo = {};
let isPopupOpen = false;

chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    ],
    addRules: [
      {
        id: 1,
        priority: 1,
        action: {
          type: "block",
        },
        condition: {
          urlFilter: "*://www.google-analytics.com/*",
          resourceTypes: ["script"],
        },
      },
      {
        id: 2,
        priority: 1,
        action: {
          type: "block",
        },
        condition: {
          urlFilter: "*://ssl.google-analytics.com/*",
          resourceTypes: ["script"],
        },
      },
      {
        id: 3,
        priority: 1,
        action: {
          type: "block",
        },
        condition: {
          urlFilter: "*://analytics.google.com/*",
          resourceTypes: ["script"],
        },
      },
      {
        id: 4,
        priority: 1,
        action: {
          type: "block",
        },
        condition: {
          urlFilter: "*://www.googletagmanager.com/*",
          resourceTypes: ["script"],
        },
      },
      {
        id: 5,
        priority: 1,
        action: {
          type: "block",
        },
        condition: {
          urlFilter: "*://*.doubleclick.net/*",
          resourceTypes: ["script"],
        },
      },
      {
        id: 6,
        priority: 1,
        action: {
          type: "block",
        },
        condition: {
          urlFilter: "*://*.facebook.com/*",
          resourceTypes: ["script"],
        },
      },
      {
        id: 7,
        priority: 1,
        action: {
          type: "block",
        },
        condition: {
          urlFilter: "*://*.facebook.net/*",
          resourceTypes: ["script"],
        },
      },
      {
        id: 8,
        priority: 1,
        action: {
          type: "block",
        },
        condition: {
          urlFilter: "*://*.twitter.com/*",
          resourceTypes: ["script"],
        },
      },
      {
        id: 9,
        priority: 1,
        action: {
          type: "block",
        },
        condition: {
          urlFilter: "*://*.adsrvr.org/*",
          resourceTypes: ["script"],
        },
      },
      {
        id: 10,
        priority: 1,
        action: {
          type: "block",
        },
        condition: {
          urlFilter: "*://*.adnxs.com/*",
          resourceTypes: ["script"],
        },
      },
      {
        id: 11,
        priority: 1,
        action: {
          type: "block",
        },
        condition: {
          urlFilter: "*://*.scorecardresearch.com/*",
          resourceTypes: ["script"],
        },
      },
      {
        id: 12,
        priority: 1,
        action: {
          type: "block",
        },
        condition: {
          urlFilter: "*://*.quantserve.com/*",
          resourceTypes: ["script"],
        },
      },
      {
        id: 13,
        priority: 1,
        action: {
          type: "block",
        },
        condition: {
          urlFilter: "*://*.googleadservices.com/*",
          resourceTypes: ["script"],
        },
      },
      {
        id: 14,
        priority: 1,
        action: {
          type: "block",
        },
        condition: {
          urlFilter: "*://*.google-analytics.com/*",
          resourceTypes: ["script"],
        },
      },
      {
        id: 15,
        priority: 1,
        action: {
          type: "block",
        },
        condition: {
          urlFilter: "*://*.googletagservices.com/*",
          resourceTypes: ["script"],
        },
      },
      {
        id: 16,
        priority: 1,
        action: {
          type: "block",
        },
        condition: {
          urlFilter: "*://*.googlesyndication.com/*",
          resourceTypes: ["script"],
        },
      },
      {
        id: 17,
        priority: 1,
        action: {
          type: "block",
        },
        condition: {
          urlFilter: "*://*.doubleclick.net/*",
          resourceTypes: ["script"],
        },
      },
      {
        id: 18,
        priority: 1,
        action: {
          type: "block",
        },
        condition: {
          urlFilter: "*://*.moatads.com/*",
          resourceTypes: ["script"],
        },
      },
      {
        id: 19,
        priority: 1,
        action: {
          type: "block",
        },
        condition: {
          urlFilter: "*://*.crwdcntrl.net/*",
          resourceTypes: ["script"],
        },
      },
      {
        id: 20,
        priority: 1,
        action: {
          type: "block",
        },
        condition: {
          urlFilter: "*://*.adsrvr.org/*",
          resourceTypes: ["script"],
        },
      },
      {
        id: 21,
        priority: 1,
        action: {
          type: "block",
        },
        condition: {
          urlFilter: "*://*.g.doubleclick.net/*",
          resourceTypes: ["script"],
        },
      },
    ],
  });

  try {
    chrome.storage.local.set({
      blockTrackers: true,
      obfuscateData: true,
      sendDNT: true,
      blockThirdPartyCookies: true,
    });
  } catch (error) {
    console.error("Error setting default settings:", error);
  }

  chrome.storage.local.set({
    cookieReadAttempts,
    portScanAttempts,
    trackingAttempts,
  });
  updateBadge();

  checkIPInfo();
});

async function checkIPInfo() {
  try {
    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipResponse.json();
    ipAddress = ipData.ip;
    console.log("IP Address:", ipAddress);

    const ipInfoResponse = await fetch(
      `https://ipinfo.io/${ipAddress}/json?token=SET_YOUR_TOKEN_HERE`
    );
    const ipInfoResult = await ipInfoResponse.json();
    ipInfo = ipInfoResult;
    console.log("IP Info:", ipInfo);

    chrome.storage.local.set({ ipAddress, ipInfo });

    // Проверяем, открыто ли всплывающее окно
    if (isPopupOpen) {
      chrome.runtime.sendMessage({
        type: "updateIpInfo",
        ipAddress,
        ipInfo,
      });
    }
  } catch (error) {
    console.error("Error fetching IP address or IP info:", error);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "cookieReadAttempt") {
    cookieReadAttempts++;
    updateBadge();
  } else if (message.type === "popupOpened") {
    isPopupOpen = true;
    // Отправляем данные, если они уже получены
    chrome.runtime.sendMessage({
      type: "updateIpInfo",
      ipAddress,
      ipInfo,
    });
  } else if (message.type === "popupClosed") {
    isPopupOpen = false;
  }
});

function updateBadge() {
  const text = `${cookieReadAttempts}/${portScanAttempts}/${trackingAttempts}`;
  chrome.action.setBadgeText({ text });
}
