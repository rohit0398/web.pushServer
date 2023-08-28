self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("push", (e) => {
  console.log("push e", e);
  let payload = e.data.text(); // Extract payload from event data

  try {
    payload = JSON.parse(payload); // Parse the payload as JSON
    console.log("payload", payload);
    const { previewImage, bodyImage, url, buttonTitle, buttonUrl } = payload ?? {}
    const options = {...payload, requireInterations: true };
    if (buttonTitle && buttonUrl)
      options.actions = [{ action: "buttonClick", title: buttonTitle }];
    if (previewImage) options.icon = payload?.previewImage;
    if (bodyImage) options.image = payload?.bodyImage;
    options.data = { url, buttonUrl };

    console.log("optid", options);
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
