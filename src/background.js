// background.js

function base64urlEncode(bytes) {
    return btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  
  function generateRandomString(length = 16) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return base64urlEncode(array);
  }
  
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'START_GOOGLE_OAUTH') {
      const clientId = chrome.runtime.getManifest().oauth2.client_id;
      const redirectUri = chrome.identity.getRedirectURL();
      const state = generateRandomString();
      const nonce = generateRandomString();
  
      const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      url.searchParams.set('client_id', clientId);
      url.searchParams.set('redirect_uri', redirectUri);
      url.searchParams.set('response_type', 'id_token');
      url.searchParams.set('scope', 'openid email profile');
      url.searchParams.set('state', state);
      url.searchParams.set('nonce', nonce);
      url.searchParams.set('prompt', 'select_account');
  
      chrome.identity.launchWebAuthFlow(
        { url: url.toString(), interactive: true },
        (redirectUrl) => {
          if (chrome.runtime.lastError) {
            sendResponse({ error: chrome.runtime.lastError.message });
            return;
          }
          const fragment = redirectUrl.split('#')[1];
          const params = new URLSearchParams(fragment);
          const returnedState = params.get('state');
          const id_token = params.get('id_token');
  
          if (state !== returnedState) {
            sendResponse({ error: 'State mismatch' });
          } else if (!id_token) {
            sendResponse({ error: 'No id_token received' });
          } else {
            sendResponse({ id_token });
          }
        }
      );
  
      return true;
    }
  });
  