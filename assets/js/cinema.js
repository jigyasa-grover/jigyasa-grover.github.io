(function () {
  "use strict";

  var trackEvent = function (name, params) {
    if (typeof window !== "undefined" && typeof window.jgTrack === "function") {
      window.jgTrack(name, params);
    }
  };

  // Lazy-loaded Video Catalog (avoids embedding 39 KB of JSON into every HTML page)
  var cinemaCatalog = [];
  var cinemaById = {};
  var catalogPromise = null;

  var loadCinemaCatalog = function () {
    if (cinemaCatalog.length) return Promise.resolve(cinemaCatalog);
    if (catalogPromise) return catalogPromise;
    if (typeof window.fetch !== "function") return Promise.resolve([]);

    catalogPromise = window
      .fetch("/assets/data/cinema-catalog.json", { headers: { Accept: "application/json" } })
      .then(function (res) {
        return res.ok ? res.json() : [];
      })
      .then(function (data) {
        if (Array.isArray(data)) {
          cinemaCatalog = data;
          cinemaCatalog.forEach(function (entry) {
            if (entry && entry.video_id && !cinemaById[entry.video_id]) {
              cinemaById[entry.video_id] = entry;
            }
          });
        }
        return cinemaCatalog;
      })
      .catch(function () {
        catalogPromise = null;
        return [];
      });
    return catalogPromise;
  };

  // /highlights/ Screening Room Filtering, Instant Search & Progressive Expand
  var watchHub = document.querySelector("[data-watch-hub]");
  if (watchHub) {
    var watchFilterBtns = Array.prototype.slice.call(watchHub.querySelectorAll("[data-watch-filter]"));
    var watchSearchInput = watchHub.querySelector("[data-watch-search]");
    var watchItems = Array.prototype.slice.call(watchHub.querySelectorAll("[data-watch-item]"));
    var watchEmpty = watchHub.querySelector("[data-watch-empty]");
    var watchExpandWrap = watchHub.querySelector("[data-watch-expand-wrap]");
    var watchExpandBtn = watchHub.querySelector("[data-watch-expand]");
    var watchStatus = document.getElementById("watch-results-status");
    var activeWatchFilter = "all";
    var watchExpanded = false;

    var applyWatchFilter = function () {
      var q = watchSearchInput ? watchSearchInput.value.trim().toLowerCase() : "";
      var isFiltered = activeWatchFilter !== "all" || Boolean(q);
      var visible = 0;

      watchItems.forEach(function (card) {
        var role = (card.getAttribute("data-role") || "").toLowerCase();
        var cat = (card.getAttribute("data-category") || "").toLowerCase();
        var isInitial = card.getAttribute("data-initial") === "true";
        var hay = (card.getAttribute("data-search") || "").toLowerCase();

        var filterOk = true;
        if (activeWatchFilter.indexOf("role:") === 0) {
          filterOk = role === activeWatchFilter.slice(5);
        } else if (activeWatchFilter.indexOf("cat:") === 0) {
          filterOk = cat === activeWatchFilter.slice(4);
        }
        var queryOk = !q || hay.indexOf(q) !== -1;
        var match = filterOk && queryOk;

        if (!isFiltered && !watchExpanded && !isInitial) {
          card.classList.add("is-collapsed-initial");
          card.hidden = false;
          card.style.display = "";
        } else {
          card.classList.remove("is-collapsed-initial");
          card.hidden = !match;
          card.style.display = match ? "" : "none";
          if (match) visible++;
        }
        if (!isFiltered && !watchExpanded && isInitial) {
          visible++;
        }
      });

      if (watchExpandWrap) {
        watchExpandWrap.style.display = !isFiltered && !watchExpanded ? "" : "none";
      }
      if (watchEmpty) {
        watchEmpty.style.display = visible === 0 ? "block" : "none";
      }
      if (watchStatus) {
        watchStatus.textContent = visible + (visible === 1 ? " video shown" : " videos shown");
      }
    };

    watchFilterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeWatchFilter = (btn.getAttribute("data-watch-filter") || "all").toLowerCase();
        watchFilterBtns.forEach(function (b) {
          var isMatch = (b.getAttribute("data-watch-filter") || "all").toLowerCase() === activeWatchFilter;
          b.classList.toggle("is-active", isMatch);
          b.setAttribute("aria-pressed", String(isMatch));
        });
        applyWatchFilter();
      });
    });

    if (watchSearchInput) {
      watchSearchInput.addEventListener("input", applyWatchFilter);
    }

    if (watchExpandBtn) {
      watchExpandBtn.addEventListener("click", function () {
        watchExpanded = true;
        applyWatchFilter();
      });
    }
  }

  // /highlights/ 9:16 Vertical Reels Strip Filter & Smooth Paddles
  var reelsDeck = document.querySelector("[data-reels-deck]");
  if (reelsDeck) {
    var reelStrip = reelsDeck.querySelector("[data-reel-strip]");
    var reelBtns = Array.prototype.slice.call(reelsDeck.querySelectorAll("[data-reel-filter]"));
    var reelItems = Array.prototype.slice.call(reelsDeck.querySelectorAll("[data-reel-item]"));

    reelBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = (btn.getAttribute("data-reel-filter") || "all").toLowerCase();
        reelBtns.forEach(function (b) {
          var isMatch = (b.getAttribute("data-reel-filter") || "all").toLowerCase() === target;
          b.classList.toggle("is-active", isMatch);
          b.setAttribute("aria-pressed", String(isMatch));
        });
        reelItems.forEach(function (card) {
          var cat = (card.getAttribute("data-reel-cat") || "").toLowerCase();
          var role = (card.getAttribute("data-reel-role") || "").toLowerCase();
          var show = target === "all" || (target === "featured" ? role === "featured" : cat === target);
          card.style.display = show ? "" : "none";
        });
        if (reelStrip) reelStrip.scrollLeft = 0;
      });
    });

    reelsDeck.querySelectorAll("[data-reel-scroll]").forEach(function (paddle) {
      paddle.addEventListener("click", function () {
        if (!reelStrip) return;
        var dir = parseInt(paddle.getAttribute("data-reel-scroll") || "1", 10);
        reelStrip.scrollBy({ left: dir * 460, behavior: "smooth" });
      });
    });
  }

  // Instant Cinema Lightbox (Click-to-Play Privacy-Enhanced Facade)
  var lightbox = document.getElementById("cinema-lightbox");
  var lightboxMount = document.getElementById("cinema-lightbox-mount");
  var lightboxBadge = document.getElementById("cinema-lightbox-badge");
  var lightboxChannel = document.getElementById("cinema-lightbox-channel");
  var lightboxTitle = document.getElementById("cinema-lightbox-title");
  var lightboxSummary = document.getElementById("cinema-lightbox-summary");
  var lightboxYt = document.getElementById("cinema-lightbox-yt");
  var lightboxIg = document.getElementById("cinema-lightbox-ig");
  var prevCinemaBtn = document.getElementById("cinema-prev-btn");
  var nextCinemaBtn = document.getElementById("cinema-next-btn");
  var shuffleCinemaBtn = document.getElementById("cinema-shuffle-btn");
  var closeCinemaBtn = document.getElementById("cinema-close-btn");
  var activeCinemaIndex = -1;
  var lastCinemaTrigger = null;
  var blockedEmbedIds = { hAnCiTpxXPg: true, "2iRG_jpOL54": true };

  var parseYouTubeLink = function (href) {
    if (!href || typeof href !== "string") return null;
    if (href.indexOf("youtube.com") === -1 && href.indexOf("youtu.be") === -1) return null;
    var vid = "";
    var mode = "wide";
    var start = 0;

    var shortMatch = href.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/);
    var liveMatch = href.match(/youtube\.com\/live\/([A-Za-z0-9_-]{11})/);
    var watchMatch = href.match(/[?&]v=([A-Za-z0-9_-]{11})/);
    var shortDomainMatch = href.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);

    if (shortMatch) {
      vid = shortMatch[1];
      mode = "vertical";
    } else if (liveMatch) {
      vid = liveMatch[1];
    } else if (watchMatch) {
      vid = watchMatch[1];
    } else if (shortDomainMatch) {
      vid = shortDomainMatch[1];
    }
    if (!vid || blockedEmbedIds[vid]) return null;

    var tMatch = href.match(/[?&](?:t|start)=(\d+)/);
    if (tMatch) start = parseInt(tMatch[1], 10) || 0;

    return { video_id: vid, mode: mode, start: start, url: href };
  };

  var openCinemaItem = function (item, triggerEl) {
    if (!lightbox || !lightboxMount || !item || !item.video_id) return;
    if (triggerEl) lastCinemaTrigger = triggerEl;

    var render = function () {
      var catalogEntry = cinemaById[item.video_id] || {};
      var mode = item.mode || catalogEntry.mode || "wide";
      var start = typeof item.start === "number" && item.start > 0 ? item.start : catalogEntry.start || 0;
      var title = item.title || catalogEntry.title || "Featured Video — Jigyasa Grover";
      var channel = item.channel || catalogEntry.channel || "@JigyasaGrover";
      var badge =
        item.badge ||
        catalogEntry.badge ||
        (mode === "vertical" ? "9:16 Vertical Reel" : "Screening Room");
      var summary = item.summary || catalogEntry.summary || "";
      var ytUrl =
        catalogEntry.url ||
        item.url ||
        (mode === "vertical"
          ? "https://www.youtube.com/shorts/" + item.video_id
          : "https://www.youtube.com/watch?v=" + item.video_id + (start ? "&t=" + start : ""));
      var igUrl = item.external_ig || catalogEntry.ig_url || "";

      for (var i = 0; i < cinemaCatalog.length; i++) {
        if (cinemaCatalog[i].video_id === item.video_id) {
          activeCinemaIndex = i;
          break;
        }
      }

      lightbox.classList.toggle("is-vertical", mode === "vertical");
      if (lightboxBadge) lightboxBadge.textContent = badge;
      if (lightboxChannel) lightboxChannel.textContent = channel;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxSummary) {
        lightboxSummary.textContent = summary;
        lightboxSummary.style.display = summary ? "" : "none";
      }
      if (lightboxYt) {
        lightboxYt.href = ytUrl.indexOf("instagram.com") !== -1 ? "https://www.youtube.com/shorts/" + item.video_id : ytUrl;
      }
      if (lightboxIg) {
        if (igUrl || ytUrl.indexOf("instagram.com") !== -1) {
          lightboxIg.href = ytUrl.indexOf("instagram.com") !== -1 ? ytUrl : igUrl;
          lightboxIg.hidden = false;
        } else {
          lightboxIg.hidden = true;
        }
      }

      var embedSrc =
        "https://www.youtube-nocookie.com/embed/" +
        encodeURIComponent(item.video_id) +
        "?autoplay=1&rel=0&playsinline=1" +
        (start > 0 ? "&start=" + start : "");

      lightboxMount.innerHTML = "";
      var iframe = document.createElement("iframe");
      iframe.src = embedSrc;
      iframe.title = title;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      lightboxMount.appendChild(iframe);

      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      trackEvent("video_play", {
        video_id: item.video_id,
        video_title: title,
        video_mode: mode,
        source_path: window.location.pathname
      });
      if (closeCinemaBtn) closeCinemaBtn.focus();
    };

    render();
    if (!cinemaCatalog.length) {
      loadCinemaCatalog().then(function () {
        if (!lightbox.hidden && cinemaById[item.video_id]) {
          var ce = cinemaById[item.video_id];
          if (lightboxSummary && !lightboxSummary.textContent && ce.summary) {
            lightboxSummary.textContent = ce.summary;
            lightboxSummary.style.display = "";
          }
          for (var j = 0; j < cinemaCatalog.length; j++) {
            if (cinemaCatalog[j].video_id === item.video_id) {
              activeCinemaIndex = j;
              break;
            }
          }
        }
      });
    }
  };

  var closeCinema = function () {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    if (lightboxMount) lightboxMount.innerHTML = "";
    document.body.style.overflow = "";
    if (lastCinemaTrigger && typeof lastCinemaTrigger.focus === "function") {
      lastCinemaTrigger.focus();
    }
  };

  var stepCinema = function (delta) {
    loadCinemaCatalog().then(function (list) {
      if (!list.length) return;
      var nextIdx =
        activeCinemaIndex === -1
          ? 0
          : (activeCinemaIndex + delta + list.length) % list.length;
      activeCinemaIndex = nextIdx;
      openCinemaItem(list[nextIdx], null);
    });
  };

  var shuffleCinema = function (triggerEl) {
    loadCinemaCatalog().then(function (list) {
      if (!list.length) return;
      var randIdx = Math.floor(Math.random() * list.length);
      if (list.length > 1 && randIdx === activeCinemaIndex) {
        randIdx = (randIdx + 1) % list.length;
      }
      activeCinemaIndex = randIdx;
      openCinemaItem(list[randIdx], triggerEl || null);
    });
  };

  if (lightbox) {
    lightbox.querySelectorAll("[data-cinema-close]").forEach(function (el) {
      el.addEventListener("click", closeCinema);
    });
    if (prevCinemaBtn) prevCinemaBtn.addEventListener("click", function () { stepCinema(-1); });
    if (nextCinemaBtn) nextCinemaBtn.addEventListener("click", function () { stepCinema(1); });
    if (shuffleCinemaBtn) shuffleCinemaBtn.addEventListener("click", function () { shuffleCinema(null); });

    document.querySelectorAll("[data-cinema-shuffle]").forEach(function (btn) {
      btn.addEventListener("click", function () { shuffleCinema(btn); });
    });

    document.addEventListener("click", function (e) {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
        return;
      }
      var target = e.target;
      if (!target || typeof target.closest !== "function") return;
      if (target.closest("#cinema-lightbox") || target.closest("#press-preview-dialog") || target.closest("[data-open-clip-link]")) {
        return;
      }

      var explicit = target.closest("[data-cinema]");
      if (explicit) {
        var vid = explicit.getAttribute("data-cinema");
        if (vid && !blockedEmbedIds[vid]) {
          e.preventDefault();
          openCinemaItem(
            {
              video_id: vid,
              start: parseInt(explicit.getAttribute("data-cinema-start") || "0", 10) || 0,
              mode: explicit.getAttribute("data-cinema-mode") || "",
              title: explicit.getAttribute("data-cinema-title") || "",
              channel: explicit.getAttribute("data-cinema-channel") || "",
              badge: explicit.getAttribute("data-cinema-badge") || "",
              summary: explicit.getAttribute("data-cinema-summary") || "",
              url: explicit.getAttribute("href") || "",
              external_ig: explicit.getAttribute("data-cinema-external") || ""
            },
            explicit
          );
          return;
        }
      }

      var anchor = target.closest("main a[href]");
      if (anchor) {
        var parsed = parseYouTubeLink(anchor.getAttribute("href"));
        if (parsed) {
          e.preventDefault();
          var fallbackTitle = (anchor.textContent || "").replace(/[↗▶]/g, "").trim();
          openCinemaItem(
            {
              video_id: parsed.video_id,
              start: parsed.start,
              mode: parsed.mode,
              title: (cinemaById[parsed.video_id] && cinemaById[parsed.video_id].title) || fallbackTitle,
              url: parsed.url
            },
            anchor
          );
        }
      }
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox || lightbox.hidden) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeCinema();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepCinema(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        stepCinema(1);
      }
    });
  }

  var modelContext =
    (typeof document !== "undefined" && document.modelContext) ||
    (typeof navigator !== "undefined" && navigator.modelContext) ||
    null;

  if (modelContext && typeof modelContext.registerTool === "function") {
    try {
      Promise.resolve(
        modelContext.registerTool({
          name: "search-and-play-videos",
          description:
            "Search Jigyasa Grover's keynotes, official Google developer films, podcasts, YouTube Shorts, and cross-posted Instagram Reels, and optionally play the top match inline in the Cinema Lightbox.",
          annotations: { readOnlyHint: true },
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Optional topic or channel query (e.g., Antigravity, Racing Coach, ADK, Gemini, Linux Foundation, PyCon)."
              },
              mode: {
                type: "string",
                enum: ["all", "wide", "vertical"],
                description: "Filter by widescreen films/talks ('wide') or 9:16 Shorts/Reels ('vertical')."
              },
              playFirstMatch: {
                type: "boolean",
                description: "Open the top matching video inline in the Cinema Lightbox (default false)."
              }
            }
          },
          execute: function (args) {
            return loadCinemaCatalog().then(function (list) {
              var q = args && args.query ? String(args.query).toLowerCase().trim() : "";
              var m = args && args.mode ? String(args.mode).toLowerCase().trim() : "all";
              var matches = list.filter(function (v) {
                if (m !== "all" && v.mode !== m) return false;
                if (!q) return true;
                var hay = ((v.title || "") + " " + (v.channel || "") + " " + (v.badge || "") + " " + (v.summary || "")).toLowerCase();
                return hay.indexOf(q) !== -1;
              });
              if (args && args.playFirstMatch && matches.length) {
                openCinemaItem(matches[0], null);
              }
              return {
                content: [
                  {
                    type: "text",
                    text: JSON.stringify(
                      {
                        total_matches: matches.length,
                        playing: Boolean(args && args.playFirstMatch && matches.length),
                        results: matches.slice(0, 12)
                      },
                      null,
                      2
                    )
                  }
                ]
              };
            });
          }
        })
      ).catch(function () { });
    } catch (e) { }
  }
})();

