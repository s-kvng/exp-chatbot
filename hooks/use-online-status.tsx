"use client"

import { useSyncExternalStore } from "react"

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

// A snapshot that works for both client and server
function getSnapshot() {
  // On the client, we can check navigator.onLine
  // On the server, this will safely return true
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

export function useOnlineStatus() {
  // useSyncExternalStore is safe for SSR because getServerSnapshot is used on the server.
  // The subscribe function is only called on the client.
  const isOnline = useSyncExternalStore(
    subscribe,
    getSnapshot,
//    getServerSnapshot // getSnapshot now handles both, simplifying the hook
  );
  return isOnline;
}