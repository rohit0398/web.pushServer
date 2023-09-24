self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("push", (e) => {
  try {
    let payload = e.data.text(); // Extract payload from event data

    payload = JSON.parse(payload); // Parse the payload as JSON
    const { url, buttonTitle, buttonUrl } = payload ?? {};
    const options = { ...payload, requireInterations: true };
    if (buttonTitle && buttonUrl)
      options.actions = [{ action: "buttonClick", title: buttonTitle }];
    options.data = { url, buttonUrl, ...payload };

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

  if (payload?.campaignId)
    fetch("https://api.vibesender.com/api/v1/analytics/campaign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ campaignId: payload.campaignId, type: "CLICKED" }),
    }).catch(() => console.log("Click Analytics failed"));
});

self.addEventListener("notificationdisplay", (event) => {
  console.log("notificationdisplay", event);
  if (event?.notification?.data?.campaignId)
    fetch("https://api.vibesender.com/api/v1/analytics/campaign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        campaignId: event?.notification?.data?.campaignId,
        type: "SHOWN",
      }),
    }).catch(() => console.log("Click Analytics failed"));
  // Log the event or send data to your server
});

self.addEventListener("notificationclose", (event) => {
  console.log("notificationclose", event);
  if (event?.notification?.data?.campaignId)
    fetch("https://api.vibesender.com/api/v1/analytics/campaign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        campaignId: event?.notification?.data?.campaignId,
        type: "CLOSED",
      }),
    }).catch(() => console.log("Closed Analytics failed"));
  // Handle notification close event, e.g., log the event
});
