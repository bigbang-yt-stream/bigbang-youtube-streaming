// YouTube Charts test
// South Korea · Weekly Top Music Videos

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
