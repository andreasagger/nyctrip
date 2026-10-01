import { getStore } from "@netlify/blobs";

// Shared state for the trip.
// done/todo: {key:{v:boolean,t}}   data: {key:{v:object|null,t}}  (null = deleted)
export default async (req) => {
  const store = getStore("nyc-trip");
  let state = (await store.get("state", { type: "json" })) || {};
  state.done ||= {}; state.todo ||= {}; state.data ||= {};

  if (req.method === "POST") {
    let ops = [];
    try { ops = await req.json(); } catch {}
    if (!Array.isArray(ops)) ops = [];
    for (const o of ops.slice(0, 200)) {
      if (!o || !["done", "todo", "data"].includes(o.s) || typeof o.k !== "string" || o.k.length > 200) continue;
      let v;
      if (o.s === "data") {
        if (o.v !== null && (typeof o.v !== "object" || JSON.stringify(o.v).length > 5000)) continue;
        v = o.v;
      } else v = !!o.v;
      const t = Number(o.t) || Date.now();
      const cur = state[o.s][o.k];
      if (!cur || cur.t <= t) state[o.s][o.k] = { v, t };
    }
    await store.setJSON("state", state);
  }
  return new Response(JSON.stringify(state), {
    headers: { "content-type": "application/json", "cache-control": "no-store" }
  });
};

export const config = { path: "/api/state" };
