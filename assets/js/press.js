(function () {
  "use strict";

  // Interactive Press Broadsheet Wall, View Switcher & Clipping Dossier Modal (/press/)
  var pressRoot = document.querySelector("[data-press-root]");
  if (!pressRoot) return;

  var pressWall = document.getElementById("press-wall");
  var pressLedger = document.getElementById("press-ledger");
  var pressCards = Array.prototype.slice.call(pressRoot.querySelectorAll("[data-press-item]"));
  var pressLedgerRows = Array.prototype.slice.call(pressRoot.querySelectorAll("[data-press-ledger-item]"));
  var pressCatBtns = Array.prototype.slice.call(pressRoot.querySelectorAll("[data-press-filter]"));
  var pressMastheadBtns = Array.prototype.slice.call(pressRoot.querySelectorAll("[data-press-masthead]"));
  var pressViewBtns = Array.prototype.slice.call(pressRoot.querySelectorAll("[data-press-view]"));
  var pressSearchInput = document.getElementById("press-search");
  var pressStatusBar = document.getElementById("press-status-bar");
  var pressStatusEl = document.getElementById("press-results-status");
  var pressResetBtn = document.getElementById("press-reset-btn");
  var pressEmptyEl = document.getElementById("press-empty-state");

  var activePressCat = "all";
  var activePressView = "wall";
  var totalPressCount = pressCards.length;

  var syncMastheadChips = function (queryVal) {
    var qLower = (queryVal || "").trim().toLowerCase();
    pressMastheadBtns.forEach(function (chip) {
      var chipQuery = (chip.getAttribute("data-press-masthead") || "").trim().toLowerCase();
      var active = Boolean(qLower && chipQuery === qLower);
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", String(active));
    });
  };

  var applyPressFilters = function () {
    var query = pressSearchInput ? pressSearchInput.value.trim().toLowerCase() : "";
    var visibleCount = 0;

    syncMastheadChips(query);

    pressCards.forEach(function (card, idx) {
      var cat = (card.getAttribute("data-category") || "").toLowerCase();
      var hay = (card.getAttribute("data-search") || "").toLowerCase();
      var catOk = activePressCat === "all" || cat === activePressCat;
      var queryOk = !query || hay.indexOf(query) !== -1;
      var show = catOk && queryOk;

      card.hidden = !show;
      if (pressLedgerRows[idx]) {
        pressLedgerRows[idx].hidden = !show;
      }
      if (show) visibleCount++;
    });

    var isFiltered = activePressCat !== "all" || Boolean(query);
    if (pressWall) {
      pressWall.classList.toggle("is-filtered", isFiltered);
    }
    if (pressStatusBar) {
      pressStatusBar.hidden = !isFiltered;
    }
    if (pressEmptyEl) {
      pressEmptyEl.style.display = visibleCount === 0 ? "block" : "none";
    }
    if (pressStatusEl) {
      pressStatusEl.textContent = isFiltered
        ? "Showing " +
          visibleCount +
          " of " +
          totalPressCount +
          " features" +
          (query ? ' matching "' + pressSearchInput.value.trim() + '"' : "") +
          "."
        : "";
    }
  };

  pressCatBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      activePressCat = (btn.getAttribute("data-press-filter") || "all").toLowerCase();
      pressCatBtns.forEach(function (b) {
        var match = (b.getAttribute("data-press-filter") || "all").toLowerCase() === activePressCat;
        b.classList.toggle("is-active", match);
        b.setAttribute("aria-pressed", String(match));
      });
      applyPressFilters();
    });
  });

  pressMastheadBtns.forEach(function (chip) {
    chip.addEventListener("click", function () {
      if (!pressSearchInput) return;
      var targetQuery = chip.getAttribute("data-press-masthead") || "";
      var currentQuery = pressSearchInput.value.trim().toLowerCase();
      if (currentQuery === targetQuery.toLowerCase()) {
        pressSearchInput.value = "";
      } else {
        pressSearchInput.value = targetQuery;
        activePressCat = "all";
        pressCatBtns.forEach(function (b) {
          var isAll = b.getAttribute("data-press-filter") === "all";
          b.classList.toggle("is-active", isAll);
          b.setAttribute("aria-pressed", String(isAll));
        });
      }
      applyPressFilters();
    });
  });

  if (pressSearchInput) {
    try {
      var pressInitParams = new URLSearchParams(window.location.search);
      var pressInitQ = pressInitParams.get("q");
      if (pressInitQ) {
        pressSearchInput.value = pressInitQ;
        applyPressFilters();
      }
    } catch (e) { }
    pressSearchInput.addEventListener("input", applyPressFilters);
    var pressSearchForm = document.getElementById("press-search-form");
    if (pressSearchForm) {
      pressSearchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        applyPressFilters();
        var visibleNow = pressCards.filter(function (c) { return !c.hidden; }).length;
        if (typeof e.respondWith === "function") {
          e.respondWith(Promise.resolve({ ok: true, visible_features: visibleNow, query: pressSearchInput.value }));
        }
      });
    }
  }

  if (pressResetBtn) {
    pressResetBtn.addEventListener("click", function () {
      activePressCat = "all";
      if (pressSearchInput) pressSearchInput.value = "";
      pressCatBtns.forEach(function (b) {
        var isAll = b.getAttribute("data-press-filter") === "all";
        b.classList.toggle("is-active", isAll);
        b.setAttribute("aria-pressed", String(isAll));
      });
      applyPressFilters();
    });
  }

  pressViewBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      activePressView = (btn.getAttribute("data-press-view") || "wall").toLowerCase();
      pressViewBtns.forEach(function (b) {
        var match = (b.getAttribute("data-press-view") || "wall").toLowerCase() === activePressView;
        b.classList.toggle("is-active", match);
        b.setAttribute("aria-pressed", String(match));
      });
      if (pressWall) pressWall.hidden = activePressView !== "wall";
      if (pressLedger) pressLedger.hidden = activePressView !== "ledger";
    });
  });

  var pressDialog = document.getElementById("press-preview-dialog");
  var dialogClose = document.getElementById("press-dialog-close");
  var dialogPrev = document.getElementById("press-dialog-prev");
  var dialogNext = document.getElementById("press-dialog-next");
  var dialogCopy = document.getElementById("press-dialog-copy");
  var activeClipIndex = 0;
  var lastPressTrigger = null;

  var getVisibleClipIndices = function () {
    var list = [];
    pressCards.forEach(function (c, i) {
      if (!c.hidden) list.push(i);
    });
    return list.length ? list : pressCards.map(function (_, i) { return i; });
  };

  var renderPressDialog = function (idx) {
    var card = pressCards[idx];
    if (!card || !pressDialog) return;
    activeClipIndex = idx;

    var outlet = card.getAttribute("data-outlet") || "";
    var date = card.getAttribute("data-date") || "";
    var type = card.getAttribute("data-type") || "";
    var title = card.getAttribute("data-title") || "";
    var vMode = card.getAttribute("data-visual-mode") || "snapshot";
    var imgSrc = card.getAttribute("data-image") || "";
    var focal = card.getAttribute("data-focal") || "center center";
    var quote = card.getAttribute("data-quote") || "";
    var takeaway = card.getAttribute("data-takeaway") || "";
    var summary = card.getAttribute("data-summary") || "";
    var rawTags = card.getAttribute("data-tags") || "";
    var url = card.getAttribute("data-url") || "";
    var ctaLabel = card.getAttribute("data-cta") || "Open Original Feature";

    var visibleIndices = getVisibleClipIndices();
    var pos = visibleIndices.indexOf(idx);
    var counterText = (pos !== -1 ? pos + 1 : idx + 1) + " / " + visibleIndices.length;

    var counterEl = document.getElementById("press-dialog-counter");
    if (counterEl) counterEl.textContent = counterText;

    var outletLineEl = document.getElementById("press-dialog-outlet-line");
    if (outletLineEl) {
      var metaParts = [outlet, date, type].filter(Boolean);
      outletLineEl.textContent = metaParts.join(" · ");
    }
    var titleEl = document.getElementById("press-dialog-title");
    if (titleEl) titleEl.textContent = title;

    var calloutLabel = document.getElementById("press-dialog-callout-label");
    var calloutText = document.getElementById("press-dialog-callout-text");
    if (calloutLabel && calloutText) {
      if (quote) {
        calloutLabel.textContent = "Verified Excerpt";
        calloutText.textContent = "“" + quote + "”";
      } else {
        calloutLabel.textContent = "Key Takeaway";
        calloutText.textContent = takeaway;
      }
    }

    var summaryEl = document.getElementById("press-dialog-summary");
    if (summaryEl) summaryEl.textContent = summary;

    var tagsEl = document.getElementById("press-dialog-tags");
    if (tagsEl) {
      tagsEl.innerHTML = "";
      if (rawTags) {
        rawTags.split("|").forEach(function (t) {
          var trimmed = t.trim();
          if (!trimmed) return;
          var span = document.createElement("span");
          span.className = "mono-tag";
          span.textContent = trimmed;
          tagsEl.appendChild(span);
        });
      }
    }

    var snapBox = document.getElementById("press-dialog-snapshot-box");
    var snapImg = document.getElementById("press-dialog-img");
    if (snapBox) {
      snapBox.classList.toggle("is-brand", vMode === "brand");
    }
    if (snapImg && imgSrc) {
      snapImg.src = imgSrc;
      snapImg.style.objectPosition = vMode === "brand" ? "center center" : focal;
      snapImg.alt = outlet + " — " + title;
    }

    var ctaEl = document.getElementById("press-dialog-cta");
    if (ctaEl) {
      if (url) {
        ctaEl.href = url;
        ctaEl.target = "_blank";
        ctaEl.rel = "noopener";
        ctaEl.textContent = ctaLabel + " ↗";
      } else {
        ctaEl.href = "/work-with-me/?topic=Media%20%26%20Interviews#contact";
        ctaEl.removeAttribute("target");
        ctaEl.removeAttribute("rel");
        ctaEl.textContent = "Request Press / Study Details →";
      }
    }

    if (dialogCopy) {
      dialogCopy.textContent = "Copy Citation";
      dialogCopy.setAttribute(
        "data-citation",
        "Jigyasa Grover featured in " +
          outlet +
          " (" +
          date +
          '): "' +
          title +
          '"' +
          (url ? " — " + url : "")
      );
    }
  };

  var isDialogOpen = function () {
    if (!pressDialog) return false;
    return Boolean(pressDialog.open || pressDialog.classList.contains("is-fallback-open"));
  };

  var openPressDialog = function (idx, triggerEl) {
    if (!pressDialog) return;
    lastPressTrigger = triggerEl || document.activeElement;
    renderPressDialog(idx);
    if (!isDialogOpen()) {
      if (typeof pressDialog.showModal === "function") {
        pressDialog.showModal();
      } else {
        pressDialog.classList.add("is-fallback-open");
      }
    }
  };

  var closePressDialog = function () {
    if (!pressDialog) return;
    if (pressDialog.open && typeof pressDialog.close === "function") {
      pressDialog.close();
    }
    pressDialog.classList.remove("is-fallback-open");
    if (lastPressTrigger && typeof lastPressTrigger.focus === "function") {
      lastPressTrigger.focus();
    }
  };

  var stepPressDialog = function (delta) {
    var visible = getVisibleClipIndices();
    if (!visible.length) return;
    var curPos = visible.indexOf(activeClipIndex);
    var nextPos = curPos === -1 ? 0 : (curPos + delta + visible.length) % visible.length;
    renderPressDialog(visible[nextPos]);
  };

  pressRoot.querySelectorAll("[data-open-clip]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var idx = parseInt(btn.getAttribute("data-open-clip") || "0", 10);
      openPressDialog(idx, btn);
    });
  });

  pressRoot.querySelectorAll("[data-open-clip-link]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
        return;
      }
      e.preventDefault();
      var idx = parseInt(link.getAttribute("data-open-clip-link") || "0", 10);
      openPressDialog(idx, link);
    });
  });

  if (dialogClose) dialogClose.addEventListener("click", closePressDialog);
  if (dialogPrev) dialogPrev.addEventListener("click", function () { stepPressDialog(-1); });
  if (dialogNext) dialogNext.addEventListener("click", function () { stepPressDialog(1); });
  if (dialogCopy) {
    dialogCopy.addEventListener("click", function () {
      var citation = dialogCopy.getAttribute("data-citation") || "";
      if (citation && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(citation).then(function () {
          dialogCopy.textContent = "Citation Copied";
          setTimeout(function () {
            dialogCopy.textContent = "Copy Citation";
          }, 1800);
        });
      }
    });
  }

  if (pressDialog) {
    pressDialog.addEventListener("click", function (e) {
      if (e.target === pressDialog) closePressDialog();
    });

    document.addEventListener("keydown", function (e) {
      if (!isDialogOpen()) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepPressDialog(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        stepPressDialog(1);
      } else if (e.key === "Escape" && pressDialog.classList.contains("is-fallback-open")) {
        closePressDialog();
      }
    });
  }

  try {
    var pressParams = new URLSearchParams(window.location.search);
    var clipParam = pressParams.get("clip");
    if (clipParam) {
      for (var ci = 0; ci < pressCards.length; ci++) {
        if (pressCards[ci].getAttribute("data-clip-id") === clipParam) {
          openPressDialog(ci, null);
          break;
        }
      }
    }
  } catch (e) { }
})();

