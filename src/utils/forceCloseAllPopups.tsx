// Event name for closing all popups
const CLOSE_ALL_POPUPS_EVENT = 'closeAllPopups';

// Function to force close all popups
export const forceCloseAllPopups = () => {
  // Use postMessage to notify all windows/frames
  window.postMessage({ type: CLOSE_ALL_POPUPS_EVENT }, '*');
};

// Subscriber function to listen for the close all popups event
export const subscribeToCloseAllPopups = (callback: () => void) => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data && event.data.type === CLOSE_ALL_POPUPS_EVENT) {
      callback();
    }
  };

  window.addEventListener('message', handleMessage);

  // Return a function to unsubscribe
  return () => {
    window.removeEventListener('message', handleMessage);
  };
};
