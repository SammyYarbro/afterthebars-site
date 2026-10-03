export async function onRequestGet({ env, request, waitUntil }) {
    const cache = caches.default;
    const cacheKey = new Request(new URL(request.url).origin + "/api/videos");
    const hit = await cache.match(cacheKey);
    if (hit) return hit;

    const API = "https://www.googleapis.com/youtube/v3";
    const key = env.YOUTUBE_API_KEY;
    const uploads = "UU" + env.YT_CHANNEL_ID.slice(2);

    const pl = await (await fetch(
        `${API}/playlistItems?part=contentDetails&playlistId=${uploads}&maxResults=20&key=${key}`
    )).json();
    const ids = (pl.items || []).map(i => i.contentDetails.videoId).join(",");
    if (!ids) return json({ videos: [], upcoming: [] }, 60);

    const vd = await (await fetch(
        `${API}/videos?part=snippet,liveStreamingDetails&id=${ids}&key=${key}`
    )).json();

    const videos = [], upcoming = [];
    for (const v of vd.items || []) {
        const s = v.snippet, t = s.thumbnails;
        const state = s.liveBroadcastContent;
        if (state === "upcoming" || state === "live") {
            upcoming.push({
                id: v.id,
                title: s.title,
                desc: state === "live" ? "LIVE NOW" : "Premiere / live stream",
                start: v.liveStreamingDetails?.scheduledStartTime || s.publishedAt
            });
        } else {
            videos.push({
                id: v.id,
                title: s.title,
                date: new Date(s.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                thumb: (t.maxres || t.standard || t.high || t.medium).url,
                ts: s.publishedAt
            });
        }
    }
    videos.sort((a, b) => b.ts.localeCompare(a.ts));
    upcoming.sort((a, b) => a.start.localeCompare(b.start));

    const res = json({ videos, upcoming }, 600);
    waitUntil(cache.put(cacheKey, res.clone()));
    return res;
}

function json(data, maxAge) {
    return new Response(JSON.stringify(data), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": `public, max-age=${maxAge}`
        }
    });
}