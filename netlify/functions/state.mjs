import { getStore } from "@netlify/blobs";

// Shared state for the trip.
// done/todo: {key:{v:boolean,t}}   data: {key:{v:object|null,t}}  (null = deleted)
const empty = () => ({ done: {}, todo: {}, data: {} });

function merge(state, ops) {
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
  return state;
}

export default async (req) => {
  const store = getStore({ name: "nyc-trip", consistency: "strong" });
  const read = async () => {
    const r = await store.getWithMetadata("state", { type: "json" });
    const s = (r && r.data) || empty();
    s.done ||= {}; s.todo ||= {}; s.data ||= {};
    return { state: s, etag: r ? r.etag : undefined };
  };

  let { state, etag } = await read();

  if (req.method === "POST") {
    let ops = [];
    try { ops = await req.json(); } catch {}
    if (!Array.isArray(ops)) ops = [];
    // Conditional write: if someone else wrote in between, read again and retry
    for (let attempt = 0; attempt < 6; attempt++) {
      merge(state, ops);
      const res = await store.setJSON("state", state, etag ? { onlyIfMatch: etag } : { onlyIfNew: true });
      if (!res || res.modified !== false) break;
      ({ state, etag } = await read());
    }
  }
  return new Response(JSON.stringify(state), {
    headers: { "content-type": "application/json", "cache-control": "no-store" }
  });
};

export const config = { path: "/api/state" };
