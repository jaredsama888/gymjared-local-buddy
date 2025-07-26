self.addEventListener('install', function (e) {
  console.log('GymJARED Service Worker: Installed');
});

self.addEventListener('fetch', function (e) {
  console.log('GymJARED Service Worker: Fetching', e.request.url);
});
