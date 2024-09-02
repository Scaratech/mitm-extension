const SERVER_URL = 'http://DOMAIN:PORT/create';
const TOKEN = '';

function sendLogToServer(log) {
  fetch(SERVER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authentication': TOKEN
    },
    body: JSON.stringify(log)
  }).catch(error => console.error('Error sending log:', error));
}

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    let requestBody = null;
    if (details.requestBody && details.requestBody.raw) {
      requestBody = String.fromCharCode.apply(null, new Uint8Array(details.requestBody.raw[0].bytes));
    }
    
    const logEntry = {
      method: details.method,
      date: new Date().toISOString(),
      url: details.url,
      requestBody: requestBody
    };

    chrome.webRequest.onCompleted.addListener(
      function(completedDetails) {
        logEntry.statusCode = completedDetails.statusCode;
        logEntry.requestId = completedDetails.requestId;
        logEntry.responseHeaders = completedDetails.responseHeaders || {};

        sendLogToServer(logEntry);
      },
      { urls: ["<all_urls>"] },
      ["responseHeaders"]
    );
  },
  { urls: ["<all_urls>"] },
  ["requestBody"]
);
