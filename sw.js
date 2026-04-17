self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => clients.claim());

// Cache the page for offline use
self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/index.html'))
    );
  }
});

// Show notification when a push comes in
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : { title: 'Family Chat', body: 'New message' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '',
      tag: 'familychat',
      renotify: true,
      vibrate: [200, 100, 200]
    })
  );
});

// When notification is tapped, open/focus the app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes('familychat') || client.url.includes(self.location.origin)) {
          return client.focus();
        }
      }
      return clients.openWindow(self.registration.scope);
    })
  );
});
