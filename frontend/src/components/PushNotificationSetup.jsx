import React, { useEffect } from "react";

const VAPID_PUBLIC_KEY="BL24djCiCc7q9mznFcx92OeLQ3g0UId2lGJp-Y3LeImWZd0NrlX2WuLinS73J7CKo74D1C5ccvpPIS8gg38wpEE"

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

const PushNotificationSetup = ({ userId }) => {
  useEffect(() => {
    async function registerPush() {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        const registration = await navigator.serviceWorker.register("/serviceWorker.js");

        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });

        await fetch("http://localhost:5000/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, subscription })
        });
      }
    }
    registerPush();
  }, [userId]);

  return null;
};

export default PushNotificationSetup;
