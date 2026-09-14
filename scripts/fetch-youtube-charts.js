
// South Korea · Weekly Top Music Videos
const fs = require("node:fs");
const COUNTRY = "kr";

async function fetchYouTubeCharts() {
  const url =
    "https://charts.youtube.com/youtubei/v1/browse" +
    "?alt=json" +
    "&key=AIzaSyCzEW7JUJdSql0-2V4tHUb6laYm4iAE_dM";

  const body = {
    browseId: "FEmusic_analytics_charts_home",
    context: {
      capabilities: {},
      client: {
        clientName: "WEB_MUSIC_ANALYTICS",
        clientVersion: "0.2",
        experimentIds: [],
        experimentsToken: "",
        gl: "US",
        hl: "en",
        theme: "MUSIC"
      },
      request: {
        internalExperimentFlags: []
      }
    },
    query:
      `chart_params_type=WEEK&perspective=CHART&flags=viral_video_chart&selected_chart=TRACKS&chart_params_id=weekly:0:0:${COUNTRY}`
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(
      `YouTube Charts request failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  console.log("TOP LEVEL KEYS:", Object.keys(data));
  console.log("CONTENTS KEYS:", Object.keys(data.contents || {}));
  console.log(
  "SECTION KEYS:",
  Object.keys(data.contents?.sectionListRenderer || {})
);
  console.log(
  "SECTION CONTENT COUNT:",
  data.contents?.sectionListRenderer?.contents?.length
);
  console.log(
  "FIRST SECTION KEYS:",
  Object.keys(data.contents?.sectionListRenderer?.contents?.[0] || {})
);
  console.log(
  "MUSIC ANALYTICS KEYS:",
  Object.keys(
    data.contents?.sectionListRenderer?.contents?.[0]
      ?.musicAnalyticsSectionRenderer || {}
  )
);
  console.log(
  "ANALYTICS CONTENT KEYS:",
  Object.keys(
    data.contents?.sectionListRenderer?.contents?.[0]
      ?.musicAnalyticsSectionRenderer?.content || {}
  )
);
  const trackTypes =
  data.contents?.sectionListRenderer?.contents?.[0]
    ?.musicAnalyticsSectionRenderer?.content?.trackTypes || [];

console.log(
  "LIST TYPES:",
  trackTypes.map((item) => item.listType)
);
  const songEntries =
  trackTypes.flatMap((item) => item.trackViews || []);

const bigbangSongs = songEntries.filter((song) =>
  song.artists?.some((artist) => artist.name === "BIGBANG")
);

console.log("\n🎧 KOREA · WEEKLY TOP SONGS");
console.log(`Found ${songEntries.length} song entries`);

bigbangSongs.forEach((song) => {
  console.log(
    `#${song.chartEntryMetadata?.currentPosition ?? "?"} ` +
    `${song.artists?.map((artist) => artist.name).join(", ") || ""} - ` +
    `${song.name || "Untitled"}`
  );
  console.log(
    `   Previous: #${song.chartEntryMetadata?.previousPosition ?? "?"}`
  );
  console.log(
    `   Video ID: ${song.encryptedVideoId || "?"}`
  );
});
  function findVideoViews(obj) {
  if (!obj || typeof obj !== "object") return null;

  if (Array.isArray(obj.videoViews)) {
    return obj.videoViews;
  }

  for (const value of Object.values(obj)) {
    const found = findVideoViews(value);
    if (found) return found;
  }

  return null;
}

const videos = findVideoViews(data);
  if (!Array.isArray(videos)) {
    console.log(JSON.stringify(data, null, 2));
    throw new Error("Top Music Videos data was not found.");
  }

  console.log("🇰🇷 KOREA · WEEKLY TOP MUSIC VIDEOS");
  console.log(`Found ${videos.length} chart entries\n`);

 const bigbangVideos = videos.filter((video) =>
  video.artists?.some(
    (artist) => artist.name?.toUpperCase() === "BIGBANG"
  )
);
const chartData = {
  generatedAt: new Date().toISOString(),
  country: "KR",
  chart: "weekly-top-music-videos",
  entries: bigbangVideos.map((video) => ({
    rank: video.chartEntryMetadata?.currentPosition ?? null,
    previousRank: video.chartEntryMetadata?.previousPosition ?? null,
    title: video.title || video.name || "Untitled",
    videoId: video.id || "",
    artists:
      video.artists?.map((artist) => artist.name).filter(Boolean) || [],
    viewCount: video.viewCount || null,
    thumbnail:
      video.thumbnail?.thumbnails?.at(-1)?.url || null
    })),

  weeklyTopSongs: bigbangSongs.map((song) => ({
    rank: song.chartEntryMetadata?.currentPosition ?? null,
    previousRank: song.chartEntryMetadata?.previousPosition ?? null,
    title: song.name || "Untitled",
    videoId: song.encryptedVideoId || "",
    artists:
      song.artists?.map((artist) => artist.name).filter(Boolean) || [],
    viewCount: song.viewCount || null,
    thumbnail:
      song.thumbnail?.thumbnails?.at(-1)?.url || null
  }))
};
fs.mkdirSync("data", { recursive: true });
fs.writeFileSync(
  "data/youtube-charts.json",
  JSON.stringify(chartData, null, 2)
);

console.log("✅ Saved data/youtube-charts.json");
console.log(`💛 Found ${bigbangVideos.length} BIGBANG chart entries\n`);

bigbangVideos.forEach((video) => {
  const rank =
    video.chartEntryMetadata?.currentPosition ?? "?";

  const previous =
    video.chartEntryMetadata?.previousPosition ?? "?";

  console.log(
    `#${rank} ${video.title || video.name || "Untitled"}`
  );

  console.log(`   Previous: #${previous}`);
  console.log(`   Video ID: ${video.id || ""}`);
}); 
}

fetchYouTubeCharts().catch((error) => {
  console.error("❌ TEST FAILED");
  console.error(error);
  process.exit(1);
});
