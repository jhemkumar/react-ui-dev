// Utility to get token in iframe context
export const getIframeToken = (): Promise<string | null> => {
  return new Promise((resolve) => {
    // Request token from parent window
    window.parent.postMessage({ type: 'GET_TOKEN' }, window.location.origin);

    // Listen for token response
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === window.location.origin) {
        if (event.data.type === 'TOKEN_RESPONSE') {
          window.removeEventListener('message', handleMessage);
          resolve(event.data.token);
        } else if (event.data.type === 'INIT_TOKEN') {
          window.removeEventListener('message', handleMessage);
          resolve(event.data.token);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // Timeout after 5 seconds
    setTimeout(() => {
      window.removeEventListener('message', handleMessage);
      resolve(null);
    }, 5000);
  });
};

// Utility to check if we're in an iframe
export const isInIframe = (): boolean => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

// Utility to get token (works in both main window and iframe)
export const getToken = async (): Promise<string | null> => {
  if (isInIframe()) {
    return getIframeToken();
  } else {
    return sessionStorage.getItem('token');
  }
}; 