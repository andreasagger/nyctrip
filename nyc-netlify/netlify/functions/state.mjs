import { getStore } from "@netlify/blobs";

// Shared checklist for the trip. Stores {done:{key:{v,t}}, todo:{key:{v,t}}}
export default async (req) => {
  const store = getStore("nyc-trip");
  let state = (await store.get("state", { type: "json" })) || { done: {}, todo: {} };

  if (req.method === "POST") {
    let ops = [];
    try { ops = await req.json(); } catch {}
    if (!Array.isArray(ops)) ops = [];
    for (const o of ops.slice(0, 200)) {
      if (!o || !["done", "todo"].includes(o.s) || typeof o.k !== "string" || o.k.length > 200) continue;
      const cur = state[o.s][o.k];
      if (!cur || cur.t <= o.t) state[o.s][o.k] = { v: !!o.v, t: Number(o.t) || Date.now() };
    }
    await store.setJSON("state", state);
  }
  return new Response(JSON.stringify(state), {
    headers: { "content-type": "application/json", "cache-control": "no-store" }
  });
};

export const config = { path: "/api/state" };
