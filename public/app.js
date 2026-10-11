const videos = [
  {
    id: "featured",
    title: "After the Bars: Featured Case Breakdown",
    category: "case",
    series: "Case Files",
    collection: "Featured",
    duration: "38:12",
    date: "Featured",
    youtubeId: "M7lc1UVf-VE",
    description: "A featured long-form case breakdown presented inside the custom After the Bars player."
  },
  {
    id: "kr1",
    title: "Karen Read: Key Testimony & Courtroom Breakdown",
    category: "case",
    series: "Karen Read",
    collection: "Karen Read",
    duration: "1:12:44",
    date: "Archive",
    youtubeId: "M7lc1UVf-VE",
    description: "Replace this demo YouTube ID with your actual Karen Read video."
  },
  {
    id: "kr2",
    title: "Karen Read: Timeline, Evidence & What Happened Next",
    category: "case",
    series: "Karen Read",
    collection: "Karen Read",
    duration: "46:18",
    date: "Archive",
    youtubeId: "M7lc1UVf-VE",
    description: "A dedicated case shelf lets visitors binge one case without digging through YouTube."
  },
  {
    id: "ka1",
    title: "Karmelo Anthony: Case Update & Legal Questions",
    category: "case",
    series: "Karmelo Anthony",
    collection: "Karmelo Anthony",
    duration: "54:03",
    date: "Archive",
    youtubeId: "M7lc1UVf-VE",
    description: "Demo placeholder for your Karmelo Anthony archive."
  },
  {
    id: "rec1",
    title: "Recovery: What Rebuilding Actually Looks Like",
    category: "recovery",
    series: "Recovery",
    collection: "Recovery",
    duration: "22:41",
    date: "Story",
    youtubeId: "M7lc1UVf-VE",
    description: "Recovery content gets a completely separate home instead of being buried beneath case videos."
  },
  {
    id: "rec2",
    title: "Second Chances, Structure & Starting Over",
    category: "recovery",
    series: "Recovery",
    collection: "Recovery",
    duration: "31:07",
    date: "Story",
    youtubeId: "M7lc1UVf-VE",
    description: "A recovery-focused piece inside the After the Bars library."
  },
  {
    id: "faith1",
    title: "Faith, Redemption & Finding Purpose",
    category: "faith",
    series: "Faith",
    collection: "Faith",
    duration: "18:55",
    date: "Faith",
    youtubeId: "M7lc1UVf-VE",
    description: "A dedicated faith collection for testimony and redemption-centered videos."
  },
  {
    id: "story1",
    title: "My Story: Before After the Bars",
    category: "story",
    series: "My Story",
    collection: "Personal Story",
    duration: "27:33",
    date: "Story",
    youtubeId: "M7lc1UVf-VE",
    description: "Personal-history content can live here: prison, tattooing, family, turning points, and rebuilding."
  },
  {
    id: "int1",
    title: "Inside the Mind: A Conversation About Change",
    category: "interview",
    series: "Interview",
    collection: "Interviews",
    duration: "42:16",
    date: "Interview",
    youtubeId: "M7lc1UVf-VE",
    description: "Long-form interviews and redemption stories."
  }
];

let activeFilter = "all";
let currentPlayer = null;
let currentVideo = null;
let updateTimer = null;

const grid = document.getElementById("videoGrid");
const search = document.getElementById("searchInput");
const empty = document.getElementById("emptyState");
const modal = document.getElementById("playerModal");
const stagePoster = document.querySelector(".stage-poster");

function renderVideos() {
  const term = search.value.trim().toLowerCase();
  const filtered = videos.filter(v => {
    const matchesFilter = activeFilter === "all" || v.category === activeFilter;
    const haystack = [v.title, v.series, v.collection, v.category, v.description].join(" ").toLowerCase();
    return matchesFilter && (!term || haystack.includes(term));
  });

  grid.innerHTML = filtered.map(v => `
    <article class="video-card" data-id="${v.id}">
      <div class="thumb">
        <div class="thumb-case">${v.series.toUpperCase()}</div>
        <div class="thumb-title">${v.collection.toUpperCase()}</div>
        <button class="thumb-play" aria-label="Play ${v.title}" data-play="${v.id}">▶</button>
      </div>
      <div class="video-body">
        <div class="video-kicker">${v.category}</div>
        <div class="video-title">${v.title}</div>
        <div class="video-meta">${v.duration} • ${v.date}</div>
      </div>
    </article>`).join("");

  empty.hidden = filtered.length !== 0;
}

function setFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll(".filter").forEach(btn =>
    btn.classList.toggle("active", btn.dataset.filter === filter)
  );
  renderVideos();
  document.getElementById("latest").scrollIntoView({behavior:"smooth", block:"start"});
}

document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => setFilter(btn.dataset.filter));
});
document.querySelectorAll(".filter-link").forEach(btn => {
  btn.addEventListener("click", () => setFilter(btn.dataset.filter));
});
document.querySelectorAll("[data-filter-jump]").forEach(btn => {
  btn.addEventListener("click", () => setFilter(btn.dataset.filterJump));
});
document.querySelectorAll(".collection-open").forEach(btn => {
  btn.addEventListener("click", () => {
    activeFilter = "all";
    document.querySelectorAll(".filter").forEach(x => x.classList.remove("active"));
    document.querySelector('.filter[data-filter="all"]').classList.add("active");
    search.value = btn.dataset.query;
    renderVideos();
    document.getElementById("latest").scrollIntoView({behavior:"smooth"});
  });
});
document.querySelectorAll("[data-featured]").forEach(btn => {
  btn.addEventListener("click", () => openPlayer(videos[0]));
});
search.addEventListener("input", renderVideos);

grid.addEventListener("click", (e) => {
  const button = e.target.closest("[data-play]");
  if (!button) return;
  const video = videos.find(v => v.id === button.dataset.play);
  if (video) openPlayer(video);
});

function formatTime(seconds) {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function openPlayer(video) {
  currentVideo = video;
  document.getElementById("playerTitle").textContent = video.title;
  document.getElementById("playerDescription").textContent = video.description;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  stagePoster.style.display = "grid";

  if (currentPlayer && currentPlayer.destroy) {
    currentPlayer.destroy();
    currentPlayer = null;
  }
  document.getElementById("youtubeMount").innerHTML = "";

  currentPlayer = new YT.Player("youtubeMount", {
    videoId: video.youtubeId,
    playerVars: { controls: 0, rel: 0, modestbranding: 1, playsinline: 1 },
    events: {
      onReady: () => {
        document.getElementById("timeDisplay").textContent =
          `0:00 / ${formatTime(currentPlayer.getDuration())}`;
      },
      onStateChange: (event) => {
        document.getElementById("playPause").textContent = event.data === YT.PlayerState.PLAYING ? "❚❚" : "▶";
      }
    }
  });

  clearInterval(updateTimer);
  updateTimer = setInterval(updateProgress, 500);
}

function closePlayer() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  clearInterval(updateTimer);
  if (currentPlayer && currentPlayer.pauseVideo) currentPlayer.pauseVideo();
}

function startPlayback() {
  stagePoster.style.display = "none";
  if (currentPlayer && currentPlayer.playVideo) currentPlayer.playVideo();
}

function updateProgress() {
  if (!currentPlayer || !currentPlayer.getDuration) return;
  const duration = currentPlayer.getDuration() || 0;
  const current = currentPlayer.getCurrentTime ? currentPlayer.getCurrentTime() : 0;
  document.getElementById("progressFill").style.width = duration ? `${(current/duration)*100}%` : "0%";
  document.getElementById("timeDisplay").textContent = `${formatTime(current)} / ${formatTime(duration)}`;
}

document.querySelectorAll("[data-close-player]").forEach(el => el.addEventListener("click", closePlayer));
document.getElementById("bigPlay").addEventListener("click", startPlayback);

document.getElementById("playPause").addEventListener("click", () => {
  if (!currentPlayer || !currentPlayer.getPlayerState) return;
  stagePoster.style.display = "none";
  const playing = currentPlayer.getPlayerState() === YT.PlayerState.PLAYING;
  playing ? currentPlayer.pauseVideo() : currentPlayer.playVideo();
});
document.getElementById("rewindBtn").addEventListener("click", () => {
  if (currentPlayer && currentPlayer.getCurrentTime) currentPlayer.seekTo(Math.max(0, currentPlayer.getCurrentTime()-10), true);
});
document.getElementById("forwardBtn").addEventListener("click", () => {
  if (currentPlayer && currentPlayer.getCurrentTime) currentPlayer.seekTo(currentPlayer.getCurrentTime()+10, true);
});
document.getElementById("muteBtn").addEventListener("click", (e) => {
  if (!currentPlayer || !currentPlayer.isMuted) return;
  if (currentPlayer.isMuted()) { currentPlayer.unMute(); e.currentTarget.textContent = "🔊"; }
  else { currentPlayer.mute(); e.currentTarget.textContent = "🔇"; }
});
document.getElementById("fullscreenBtn").addEventListener("click", () => {
  const el = document.getElementById("videoStage");
  if (el.requestFullscreen) el.requestFullscreen();
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closePlayer(); });

renderVideos();
