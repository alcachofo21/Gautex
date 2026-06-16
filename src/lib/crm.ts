export async function notifyCrm(event: string, payload: Record<string, unknown>): Promise<void> {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        source: "gautex-web",
        timestamp: new Date().toISOString(),
        ...payload,
      }),
    });
  } catch (e) {
    console.error("[GAUTEX CRM]", e);
  }
}
