self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("push", (e) => {
  try {
    let payload = e.data.text(); // Extract payload from event data
    console.log("test payload", payload);

    payload = JSON.parse(payload); // Parse the payload as JSON
    const { url, buttonTitle, buttonUrl } = payload ?? {};
    const options = { ...payload, requireInterations: true };
    if (buttonTitle && buttonUrl)
      options.actions = [{ action: "buttonClick", title: buttonTitle }];
    options.data = { url, buttonUrl };

    e.waitUntil(
      self.registration.showNotification(payload?.title ?? "", options)
    );
  } catch (error) {
    console.error("Error parsing payload:", error);
    return;
  }
});

self.addEventListener("notificationclick", (e) => {
  let payload = e?.notification?.data ?? {};
  if (e.action === "buttonClick") clients.openWindow(payload?.buttonUrl);
  else clients.openWindow(payload?.url);
});
