// Browser notifications (need permission, and a secure context: https or localhost).
export const notificationsSupported = () => typeof Notification !== 'undefined';

export const notificationPermission = () => (notificationsSupported() ? Notification.permission : 'unsupported');

export async function requestNotificationPermission() {
  if (!notificationsSupported()) return 'unsupported';
  return Notification.requestPermission();
}

export function notifySevere(city, hazards) {
  try {
    if (notificationsSupported() && Notification.permission === 'granted') {
      new Notification(`Severe weather warning – ${city}`, {
        body: `${hazards.map((h) => h.title).join(', ')}. Open WeatherSafe for safety actions.`,
      });
    }
  } catch {
    /* notifications are best-effort */
  }
}
