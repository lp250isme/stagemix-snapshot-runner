// Starts the snapshot workflow on time: GitHub's own schedule for this repo ran 7-10 h late (2026-11-26).
// One cron trigger (the free account has 5); the UTC hour picks the Data API budget, as the old schedule did.
const BUDGET = { 6: "2500", 12: "6400" }; // 14:37 / 20:37 Taipei full runs; the rest: new uploads only

export default {
  async scheduled(event, env) {
    const hour = new Date(event.scheduledTime).getUTCHours();
    const r = await fetch("https://api.github.com/repos/lp250isme/stagemix-snapshot-runner/actions/workflows/snapshot.yml/dispatches", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.GH_TOKEN}`,
        accept: "application/vnd.github+json",
        "user-agent": "stagemix-cron",
      },
      body: JSON.stringify({ ref: "main", inputs: { budget: BUDGET[hour] ?? "200" } }),
    });
    if (r.status !== 204) throw new Error(`dispatch ${r.status}: ${(await r.text()).slice(0, 200)}`);
  },
};
