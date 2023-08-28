self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('push', (e) => {
  console.log('push e', e, self.registration.showNotification);
  self.registration.showNotification('Hello world!');
});
