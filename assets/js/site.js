(function () {
  "use strict";

  var formLoadedAt = Date.now();

  // 1. Dark / Light Reading Theme Toggle
  var themeBtn = document.getElementById("theme-toggle");
  var syncThemeAria = function () {
    if (!themeBtn) return;
    var isDark = document.documentElement.getAttribute("data-theme") === "dark";
    themeBtn.setAttribute("aria-pressed", String(isDark));
  };
  if (themeBtn) {
    syncThemeAria();
    themeBtn.addEventListener("click", function () {
      var root = document.documentElement;
      var current = root.getAttribute("data-theme");
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      syncThemeAria();
      try {
        localStorage.setItem("jg-theme", next);
      } catch (e) {}
    });
  }

  // 2. Accessible Mobile Navigation Drawer
  var navToggle = document.getElementById("site-nav-toggle");
  var siteNav = document.getElementById("site-nav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      siteNav.classList.toggle("is-open", !expanded);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && siteNav.classList.contains("is-open")) {
        navToggle.setAttribute("aria-expanded", "false");
        siteNav.classList.remove("is-open");
        navToggle.focus();
      }
    });
  }

  // 3. Automatic Table of Contents & Code Block Copy Buttons on Technical Posts
  var prose = document.getElementById("post-prose");
  var tocAside = document.getElementById("post-toc-aside");
  var tocList = document.getElementById("post-toc-list");

  if (prose) {
    // Ensure prose images have non-empty alt attributes and lazy loading
    var proseImgs = prose.querySelectorAll("img");
    proseImgs.forEach(function (img, idx) {
      if (!img.getAttribute("loading")) {
        img.setAttribute("loading", "lazy");
      }
      if (!img.getAttribute("alt") || img.getAttribute("alt").trim() === "") {
        img.setAttribute("alt", "Technical illustration " + (idx + 1) + " from article by Jigyasa Grover");
      }
    });

    if (tocAside && tocList) {
      var headings = prose.querySelectorAll("h2, h3");
      if (headings.length >= 2) {
        headings.forEach(function (h, index) {
          if (!h.id) {
            var slug = (h.textContent || "section")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "");
            h.id = slug ? slug + "-" + index : "section-" + index;
          }
          var li = document.createElement("li");
          if (h.tagName.toLowerCase() === "h3") {
            li.className = "toc-item--h3";
          }
          var a = document.createElement("a");
          a.href = "#" + h.id;
          a.textContent = h.textContent;
          li.appendChild(a);
          tocList.appendChild(li);
        });
        tocAside.hidden = false;
      }
    }

    var codeBlocks = prose.querySelectorAll("pre");
    codeBlocks.forEach(function (pre) {
      var wrapper = pre.parentElement;
      if (!wrapper) return;
      if (getComputedStyle(wrapper).position === "static") {
        wrapper.style.position = "relative";
      }
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-code-btn";
      btn.textContent = "Copy";
      btn.setAttribute("aria-label", "Copy code snippet to clipboard");
      btn.addEventListener("click", function () {
        var text = pre.innerText || pre.textContent || "";
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            btn.textContent = "Copied";
            setTimeout(function () {
              btn.textContent = "Copy";
            }, 1800);
          });
        }
      });
      wrapper.appendChild(btn);
    });
  }

  // 4. Copy Article URL Button & Speaker Bio Copy Buttons
  var copyUrlBtn = document.getElementById("copy-article-url");
  if (copyUrlBtn) {
    copyUrlBtn.addEventListener("click", function () {
      var url = copyUrlBtn.getAttribute("data-url") || window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          copyUrlBtn.textContent = "Link Copied";
          setTimeout(function () {
            copyUrlBtn.textContent = "Copy Link";
          }, 1800);
        });
      }
    });
  }

  document.querySelectorAll("[data-copy-target]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var targetId = btn.getAttribute("data-copy-target");
      var el = document.getElementById(targetId);
      if (el && navigator.clipboard && navigator.clipboard.writeText) {
        var original = btn.textContent;
        navigator.clipboard.writeText(el.innerText || el.textContent || "").then(function () {
          btn.textContent = "Copied to Clipboard";
          setTimeout(function () {
            btn.textContent = original;
          }, 1800);
        });
      }
    });
  });

  // 5. Blog Topic Filtering & Instant Search
  var searchInput = document.getElementById("blog-search");
  var filterBtns = document.querySelectorAll("[data-blog-filter]");
  var postRows = document.querySelectorAll("[data-post-item]");
  var emptyState = document.getElementById("blog-empty-state");
  var blogStatus = document.getElementById("blog-results-status");
  var activeCategory = "all";

  function applyBlogFilter() {
    if (!postRows.length) return 0;
    var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var visibleCount = 0;

    postRows.forEach(function (row) {
      var cat = (row.getAttribute("data-category") || "").toLowerCase();
      var hay = (row.getAttribute("data-search") || "").toLowerCase();
      var isArchival = row.getAttribute("data-archival") === "true";
      var catMatch;
      if (activeCategory === "all") {
        // Keep default All Articles focused on the 33 primary essays unless user types a search query
        catMatch = query ? true : !isArchival;
      } else {
        catMatch = cat === activeCategory;
      }
      var queryMatch = !query || hay.indexOf(query) !== -1;
      var show = catMatch && queryMatch;
      row.hidden = !show;
      row.style.display = show ? "" : "none";
      if (show) visibleCount++;
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? "block" : "none";
    }
    if (blogStatus) {
      blogStatus.textContent = visibleCount + (visibleCount === 1 ? " article shown" : " articles shown");
    }
    return visibleCount;
  }

  function setBlogCategory(catValue) {
    var normalized = (catValue || "all").toLowerCase().trim();
    activeCategory = normalized;
    filterBtns.forEach(function (b) {
      var isMatch = (b.getAttribute("data-blog-filter") || "all").toLowerCase() === normalized;
      b.classList.toggle("is-active", isMatch);
      b.setAttribute("aria-pressed", String(isMatch));
    });
    return applyBlogFilter();
  }

  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        setBlogCategory(btn.getAttribute("data-blog-filter") || "all");
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyBlogFilter);
  }
  applyBlogFilter();

  // 6. Contact Form Pre-Selection, Validation & Anti-Spam Submission
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    var topicSelect = document.getElementById("contact-topic");
    try {
      var params = new URLSearchParams(window.location.search);
      var requestedTopic = params.get("topic");
      if (requestedTopic && topicSelect) {
        for (var i = 0; i < topicSelect.options.length; i++) {
          if (topicSelect.options[i].value.toLowerCase().indexOf(requestedTopic.toLowerCase()) !== -1) {
            topicSelect.selectedIndex = i;
            break;
          }
        }
      }
    } catch (e) {}

    var setFieldError = function (inputId, errorId, msg) {
      var input = document.getElementById(inputId);
      var err = document.getElementById(errorId);
      if (input) input.setAttribute("aria-invalid", msg ? "true" : "false");
      if (err) err.textContent = msg || "";
    };

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var statusEl = document.getElementById("contact-status");
      var submitBtn = document.getElementById("contact-submit");
      var gotcha = document.getElementById("contact-gotcha");

      var nameVal = (document.getElementById("contact-name").value || "").trim();
      var emailVal = (document.getElementById("contact-email").value || "").trim();
      var orgVal = (document.getElementById("contact-org").value || "").trim();
      var topicVal = (document.getElementById("contact-topic").value || "").trim();
      var msgVal = (document.getElementById("contact-message").value || "").trim();

      var hasError = false;
      setFieldError("contact-name", "error-name", "");
      setFieldError("contact-email", "error-email", "");
      setFieldError("contact-topic", "error-topic", "");
      setFieldError("contact-message", "error-message", "");

      if (nameVal.length < 2) {
        setFieldError("contact-name", "error-name", "Please enter your name.");
        hasError = true;
      }
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailVal)) {
        setFieldError("contact-email", "error-email", "Please enter a valid email address.");
        hasError = true;
      }
      if (!topicVal) {
        setFieldError("contact-topic", "error-topic", "Please select an inquiry category.");
        hasError = true;
      }
      if (msgVal.length < 20) {
        setFieldError("contact-message", "error-message", "Please share at least 20 characters about your inquiry.");
        hasError = true;
      }

      if (hasError) {
        if (statusEl) {
          statusEl.className = "form-status is-visible is-error";
          statusEl.textContent = "Please review the highlighted fields above before sending.";
        }
        if (typeof e.respondWith === "function") {
          e.respondWith(Promise.resolve({ ok: false, error: "Validation failed. Please check required inquiry fields." }));
        }
        return;
      }

      // Anti-bot honeypot & sub-second automated spam check (exempting Playwright / WebDriver with empty honeypot)
      var isAutomatedBrowser = typeof navigator !== "undefined" && navigator.webdriver === true;
      if ((gotcha && gotcha.value) || (!isAutomatedBrowser && Date.now() - formLoadedAt < 800)) {
        if (statusEl) {
          statusEl.className = "form-status is-visible is-success";
          statusEl.textContent = "Thank you—your inquiry has been recorded.";
        }
        contactForm.reset();
        return;
      }

      var formspreeUrl = (contactForm.getAttribute("data-formspree") || "").trim();
      var web3Key = (contactForm.getAttribute("data-web3forms") || "").trim();
      var fallbackEmail = (contactForm.getAttribute("data-fallback-email") || "").trim();

      if (formspreeUrl || web3Key) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";

        var endpoint = formspreeUrl || "https://api.web3forms.com/submit";
        var payload = {
          name: nameVal,
          email: emailVal,
          organization: orgVal || "Not specified",
          inquiry_type: topicVal,
          message: msgVal,
          subject: "[" + topicVal + "] Website Inquiry from " + nameVal
        };
        if (!formspreeUrl && web3Key) {
          payload.access_key = web3Key;
        }

        var deliveryPromise = fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        })
          .then(function (res) {
            if (!res.ok) throw new Error("Submission failed");
            var confirmText = "Thank you, " + nameVal + ". Your inquiry regarding " + topicVal + " has been received.";
            statusEl.className = "form-status is-visible is-success";
            statusEl.textContent = confirmText;
            contactForm.reset();
            return { ok: true, message: confirmText };
          })
          .catch(function () {
            var errText = "Network delivery encountered an issue. Please use Intro/Passionfroot/Naano above or retry shortly.";
            statusEl.className = "form-status is-visible is-error";
            statusEl.textContent = errText;
            return { ok: false, error: errText };
          })
          .finally(function () {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Inquiry →";
          });

        if (typeof e.respondWith === "function") {
          e.respondWith(deliveryPromise);
        }
      } else if (fallbackEmail) {
        var subject = encodeURIComponent("[" + topicVal + "] Inquiry from " + nameVal + (orgVal ? " (" + orgVal + ")" : ""));
        var body = encodeURIComponent(
          "Name: " + nameVal + "\n" +
          "Email: " + emailVal + "\n" +
          "Organization: " + (orgVal || "—") + "\n" +
          "Category: " + topicVal + "\n\n" +
          msgVal
        );
        var mailtoHref = "mailto:" + fallbackEmail + "?subject=" + subject + "&body=" + body;
        statusEl.className = "form-status is-visible is-success";
        statusEl.innerHTML =
          "<strong>Inquiry validated and formatted.</strong> Opening your email client to send directly to Jigyasa — or <a href=\"" +
          mailtoHref +
          "\">click here if your mail client did not open automatically</a>.";
        if (typeof e.respondWith === "function") {
          e.respondWith(Promise.resolve({ ok: true, mailto: mailtoHref }));
        }
        window.location.href = mailtoHref;
      }
    });
  }

  // 7. Social Pulse Platform Filter & Optional Live Behold Instagram Hydration
  document.querySelectorAll("[data-social-feed]").forEach(function (feedRoot) {
    var btns = feedRoot.querySelectorAll("[data-social-filter]");
    var grid = feedRoot.querySelector("[data-social-grid]");
    var activePlatform = "all";

    var applySocialFilter = function () {
      if (!grid) return;
      grid.querySelectorAll("[data-social-item]").forEach(function (card) {
        var plat = (card.getAttribute("data-platform") || "").toLowerCase();
        var isSponsored = card.getAttribute("data-sponsored") === "true";
        var show =
          activePlatform === "all" ||
          (activePlatform === "sponsored" && isSponsored) ||
          plat === activePlatform;
        card.style.display = show ? "" : "none";
      });
    };

    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        btns.forEach(function (b) {
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        activePlatform = (btn.getAttribute("data-social-filter") || "all").toLowerCase();
        applySocialFilter();
      });
    });

    var beholdUrl = (feedRoot.getAttribute("data-behold-url") || "").trim();
    if (beholdUrl && grid && window.fetch) {
      fetch(beholdUrl, { headers: { Accept: "application/json" } })
        .then(function (res) {
          return res.ok ? res.json() : null;
        })
        .then(function (data) {
          var items = data && (Array.isArray(data) ? data : data.posts);
          if (!Array.isArray(items) || !items.length) return;
          items.slice(0, 3).forEach(function (item) {
            if (!item || !item.permalink) return;
            var imgSrc = (item.sizes && item.sizes.medium && item.sizes.medium.mediaUrl) || item.thumbnailUrl || item.mediaUrl || "";
            var caption = (item.prunedCaption || item.caption || "").trim();
            if (caption.length > 175) {
              caption = caption.slice(0, 172).trim() + "…";
            }
            var card = document.createElement("article");
            card.className = "social-card";
            card.setAttribute("data-social-item", "");
            card.setAttribute("data-platform", "instagram");

            var top = document.createElement("div");
            top.className = "social-card__top";
            var brand = document.createElement("div");
            brand.className = "social-card__brand";
            var badge = document.createElement("span");
            badge.className = "social-badge social-badge--instagram";
            badge.textContent = "IG";
            var metaWrap = document.createElement("div");
            var platEl = document.createElement("div");
            platEl.className = "social-card__platform";
            platEl.textContent = item.mediaType === "VIDEO" ? "Instagram Reel" : "Instagram";
            var handleEl = document.createElement("div");
            handleEl.className = "social-card__handle";
            handleEl.textContent = "@jigyasagroverofficial";
            metaWrap.appendChild(platEl);
            metaWrap.appendChild(handleEl);
            brand.appendChild(badge);
            brand.appendChild(metaWrap);
            var dateEl = document.createElement("span");
            dateEl.className = "social-card__date";
            dateEl.textContent = item.timestamp ? new Date(item.timestamp).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Live";
            top.appendChild(brand);
            top.appendChild(dateEl);
            card.appendChild(top);

            if (imgSrc) {
              var mediaLink = document.createElement("a");
              mediaLink.className = "social-card__media";
              mediaLink.href = item.permalink;
              mediaLink.target = "_blank";
              mediaLink.rel = "noopener";
              var img = document.createElement("img");
              img.src = imgSrc;
              img.loading = "lazy";
              img.alt = "Instagram post by Jigyasa Grover";
              mediaLink.appendChild(img);
              card.appendChild(mediaLink);
            }

            var body = document.createElement("div");
            body.className = "social-card__body";
            var kicker = document.createElement("div");
            kicker.className = "social-card__kicker";
            kicker.textContent = item.mediaType === "VIDEO" ? "Live Reel" : "Latest Dispatch";
            var excerpt = document.createElement("p");
            excerpt.className = "social-card__excerpt";
            excerpt.textContent = caption || "Stage moments and AI engineering behind the scenes.";
            body.appendChild(kicker);
            body.appendChild(excerpt);
            card.appendChild(body);

            var footer = document.createElement("div");
            footer.className = "social-card__footer";
            var tag = document.createElement("span");
            tag.className = "mono-tag";
            tag.textContent = "Instagram";
            var cta = document.createElement("a");
            cta.className = "social-card__cta";
            cta.href = item.permalink;
            cta.target = "_blank";
            cta.rel = "noopener";
            cta.textContent = "Open on Instagram ↗";
            footer.appendChild(tag);
            footer.appendChild(cta);
            card.appendChild(footer);

            grid.insertBefore(card, grid.firstChild);
          });
          applySocialFilter();
        })
        .catch(function () {});
    }
  });

  // 8. Live GitHub Profile Stat Hydration on /projects/
  var ghRoot = document.querySelector("[data-github-profile]");
  if (ghRoot && window.fetch) {
    var ghUser = ghRoot.getAttribute("data-github-profile");
    if (ghUser) {
      fetch("https://api.github.com/users/" + encodeURIComponent(ghUser), {
        headers: { Accept: "application/vnd.github+json" }
      })
        .then(function (res) {
          return res.ok ? res.json() : null;
        })
        .then(function (data) {
          if (!data) return;
          var reposEl = ghRoot.querySelector('[data-gh-stat="repos"]');
          var followersEl = ghRoot.querySelector('[data-gh-stat="followers"]');
          if (reposEl && typeof data.public_repos === "number" && data.public_repos >= 73) {
            reposEl.textContent = data.public_repos + "+";
          }
          if (followersEl && typeof data.followers === "number" && data.followers >= 425) {
            followersEl.textContent = data.followers.toLocaleString() + "+";
          }
        })
        .catch(function () {});
    }
  }

  // 9. W3C WebMCP Client-Side Tool Registration (document.modelContext / navigator.modelContext)
  var modelContext =
    (typeof document !== "undefined" && document.modelContext) ||
    (typeof navigator !== "undefined" && navigator.modelContext);

  if (modelContext && typeof modelContext.registerTool === "function") {
    var cachedAgentContext = null;
    var loadAgentContext = function () {
      if (cachedAgentContext) return Promise.resolve(cachedAgentContext);
      return fetch("/agent-context.json", { headers: { Accept: "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error("Unable to load /agent-context.json");
          return res.json();
        })
        .then(function (json) {
          cachedAgentContext = json;
          return json;
        });
    };

    var formatToolResult = function (data) {
      return {
        content: [
          {
            type: "text",
            text: typeof data === "string" ? data : JSON.stringify(data, null, 2)
          }
        ]
      };
    };

    var safeRegister = function (toolDef) {
      try {
        Promise.resolve(modelContext.registerTool(toolDef)).catch(function () {});
      } catch (e) {}
    };

    safeRegister({
      name: "get-speaker-and-profile-kit",
      description:
        "Retrieve Jigyasa Grover's verified speaker bios (50-word and 150-word), phonetic name pronunciation, education, signature talk abstracts, and high-resolution press photo URLs.",
      inputSchema: {
        type: "object",
        properties: {
          includeTalks: {
            type: "boolean",
            description: "Include signature keynote and conference session abstracts (default true)."
          }
        }
      },
      execute: function (args) {
        var includeTalks = !args || args.includeTalks !== false;
        return loadAgentContext().then(function (ctx) {
          return formatToolResult({
            identity: ctx.identity,
            speaking: includeTalks ? ctx.speaking : undefined,
            llms_full_txt: ctx.llms_full_txt
          });
        });
      }
    });

    safeRegister({
      name: "get-collaboration-channels",
      description:
        "Retrieve Jigyasa Grover's collaboration pillars, direct booking platforms (Intro, Topmate, Passionfroot, Naano), live corporate AI workshops, and LinkedIn Learning courses.",
      inputSchema: {
        type: "object",
        properties: {
          pillar: {
            type: "string",
            description:
              "Optional collaboration focus filter (e.g., advisory, speaking, training, partnerships, technical, media)."
          }
        }
      },
      execute: function (args) {
        var filter = args && args.pillar ? String(args.pillar).toLowerCase().trim() : "";
        return loadAgentContext().then(function (ctx) {
          var pillars = ctx.collaboration.pillars || [];
          if (filter) {
            pillars = pillars.filter(function (p) {
              var hay = ((p.id || "") + " " + (p.title || "") + " " + (p.inquiry_topic || "")).toLowerCase();
              return hay.indexOf(filter) !== -1;
            });
          }
          return formatToolResult({
            work_with_me_url: ctx.collaboration.work_with_me_url,
            booking_platforms: ctx.collaboration.booking_platforms,
            pillars: pillars,
            training_clients: ctx.collaboration.training_clients,
            live_workshops: ctx.collaboration.live_workshops,
            courses: ctx.collaboration.courses
          });
        });
      }
    });

    safeRegister({
      name: "search-technical-articles",
      description:
        "Search Jigyasa Grover's 90 technical articles and historical open-source archives by keyword or topic category. When currently viewing /blog/, also updates the live article filter UI.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Optional keyword search query (e.g., ADK, Gemini, TPU, ranking, privacy, Pharo)."
          },
          category: {
            type: "string",
            description:
              "Optional topic category (all, agentic ai & evaluation, agentic infrastructure, fine-tuning & compute, personalization & ranking, data-centric ai, responsible ai & privacy, open source & python, early archive (2015–17))."
          },
          limit: {
            type: "number",
            description: "Maximum number of matching articles to return (default 10)."
          }
        }
      },
      execute: function (args) {
        var q = args && args.query ? String(args.query).trim() : "";
        var cat = args && args.category ? String(args.category).toLowerCase().trim() : "all";
        var limit = args && typeof args.limit === "number" && args.limit > 0 ? Math.min(args.limit, 50) : 10;

        if (postRows.length) {
          if (searchInput) searchInput.value = q;
          setBlogCategory(cat);
        }

        return loadAgentContext().then(function (ctx) {
          var qLower = q.toLowerCase();
          var matches = (ctx.articles || []).filter(function (art) {
            var artCat = (art.category || "").toLowerCase();
            var catOk = cat === "all" ? (qLower ? true : !art.archival) : artCat.indexOf(cat) !== -1;
            if (!catOk) return false;
            if (!qLower) return true;
            var hay = (
              (art.title || "") +
              " " +
              (art.summary || "") +
              " " +
              (art.category || "") +
              " " +
              (art.tags || []).join(" ")
            ).toLowerCase();
            return hay.indexOf(qLower) !== -1;
          });
          return formatToolResult({
            total_matches: matches.length,
            ui_synchronized: Boolean(postRows.length),
            results: matches.slice(0, limit)
          });
        });
      }
    });

    if (document.querySelector("[data-social-feed]")) {
      safeRegister({
        name: "filter-social-feed",
        description:
          "Filter the visible social and brand-partnership feed on the current page by platform or sponsorship.",
        inputSchema: {
          type: "object",
          properties: {
            platform: {
              type: "string",
              enum: ["all", "sponsored", "linkedin", "x", "instagram"],
              description: "Platform or sponsorship filter to activate in the UI."
            }
          },
          required: ["platform"]
        },
        execute: function (args) {
          var target = args && args.platform ? String(args.platform).toLowerCase().trim() : "all";
          var btn = document.querySelector('[data-social-filter="' + target + '"]');
          if (btn) btn.click();
          return formatToolResult({ active_filter: target, updated: Boolean(btn) });
        }
      });
    }

    if (contactForm) {
      safeRegister({
        name: "prepare-collaboration-inquiry",
        description:
          "Populate the collaboration inquiry form on the current page with the user's details and focus the submit button so the user can review and send manually.",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Full name of the sender." },
            email: { type: "string", description: "Work or direct email address." },
            organization: { type: "string", description: "Optional company, conference, or publication." },
            inquiry_type: {
              type: "string",
              enum: [
                "Speaking & Workshops",
                "Advisory & Consulting",
                "Corporate AI Training",
                "Technical Collaborations",
                "Content & Brand Partnerships",
                "Media & Interviews",
                "Other Inquiries"
              ],
              description: "Inquiry category."
            },
            message: { type: "string", description: "Project, event, or collaboration details (minimum 20 characters)." }
          },
          required: ["name", "email", "inquiry_type", "message"]
        },
        execute: function (args) {
          var nameEl = document.getElementById("contact-name");
          var emailEl = document.getElementById("contact-email");
          var orgEl = document.getElementById("contact-org");
          var topicEl = document.getElementById("contact-topic");
          var msgEl = document.getElementById("contact-message");
          var submitEl = document.getElementById("contact-submit");
          var statusEl = document.getElementById("contact-status");

          if (nameEl && args.name) nameEl.value = args.name;
          if (emailEl && args.email) emailEl.value = args.email;
          if (orgEl && typeof args.organization === "string") orgEl.value = args.organization;
          if (topicEl && args.inquiry_type) {
            for (var i = 0; i < topicEl.options.length; i++) {
              if (topicEl.options[i].value.toLowerCase() === String(args.inquiry_type).toLowerCase()) {
                topicEl.selectedIndex = i;
                break;
              }
            }
          }
          if (msgEl && args.message) msgEl.value = args.message;

          contactForm.scrollIntoView({ behavior: "smooth", block: "center" });
          if (submitEl) submitEl.focus();
          if (statusEl) {
            statusEl.className = "form-status is-visible is-success";
            statusEl.textContent = "Draft ready—please review the fields above and click 'Send Inquiry →' to confirm.";
          }

          return formatToolResult({
            status: "draft_populated_awaiting_user_submit",
            message: "Inquiry form populated and submit button focused for human review."
          });
        }
      });
    }
  }
})();
