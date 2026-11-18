(function () {
  "use strict";

  var formLoadedAt = Date.now();
  var trackEvent = function (name, params) {
    if (typeof window !== "undefined" && typeof window.jgTrack === "function") {
      window.jgTrack(name, params);
    }
  };

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
      } catch (e) { }
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
      if (pre.classList.contains("wp-block-preformatted")) return;
      var rawText = pre.innerText || pre.textContent || "";
      if (/[┌┐└┘├┤┬┴┼─│]/.test(rawText)) return;

      var wrapper = pre.parentElement;
      if (!wrapper) return;
      if (wrapper === prose || (!wrapper.classList.contains("highlight") && wrapper.tagName.toLowerCase() !== "figure")) {
        var customWrap = document.createElement("div");
        customWrap.className = "code-block-wrap";
        wrapper.insertBefore(customWrap, pre);
        customWrap.appendChild(pre);
        wrapper = customWrap;
      } else if (getComputedStyle(wrapper).position === "static") {
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
            trackEvent("copy_code_snippet", { page_path: window.location.pathname });
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

  document.querySelectorAll("[data-copy-email]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var email = btn.getAttribute("data-copy-email") || "";
      if (email && navigator.clipboard && navigator.clipboard.writeText) {
        var original = btn.textContent;
        navigator.clipboard.writeText(email).then(function () {
          btn.textContent = "Copied: " + email;
          trackEvent("copy_contact_email", { source_path: window.location.pathname });
          setTimeout(function () {
            btn.textContent = original;
          }, 2200);
        });
      }
    });
  });

  document.querySelectorAll("[data-copy-url]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var targetUrl = btn.getAttribute("data-copy-url") || window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        var original = btn.textContent;
        navigator.clipboard.writeText(targetUrl).then(function () {
          btn.textContent = "Copied URL";
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
        // Keep default All Articles focused on the 34 primary essays unless user types a search query
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
    try {
      var blogParams = new URLSearchParams(window.location.search);
      var initialQuery = blogParams.get("q");
      if (initialQuery) {
        searchInput.value = initialQuery;
      }
    } catch (e) { }
    searchInput.addEventListener("input", applyBlogFilter);
    var blogSearchForm = document.getElementById("blog-search-form");
    if (blogSearchForm) {
      blogSearchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var count = applyBlogFilter();
        if (typeof e.respondWith === "function") {
          e.respondWith(Promise.resolve({ ok: true, visible_articles: count, query: searchInput.value }));
        }
      });
    }
  }
  applyBlogFilter();

  // 6. Contact Form Pre-Selection, Topic Scoping Prompts, Validation & Anti-Spam Submission
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    var topicSelect = document.getElementById("contact-topic");
    var messageInput = document.getElementById("contact-message");
    var scopingHint = document.getElementById("contact-scoping-hint");

    var scopingByTopic = {
      "Speaking & Workshops": {
        hint: "event dates & city (or virtual), expected audience profile/size, keynote vs. panel/workshop format, and travel/honorarium details.",
        placeholder: "Share event dates, location (SFO departure or virtual), audience profile, session format, and timeline…"
      },
      "Advisory & Consulting": {
        hint: "your product & current stage, core ML/agentic architecture challenge (ranking, evals, MCP, cost SLAs), and whether you want a 1:1 review or ongoing Afterdays retainer.",
        placeholder: "Share your product/stage, architecture or roadmap questions, target timeline, and preferred advisory cadence…"
      },
      "Corporate AI Training": {
        hint: "team size & engineering roles, target capability domain (Agentic AI/ADK, Evals, Ranking, Data-Centric ML, TPUs, or AI Workflows), format (90m / half-day / full-day), and dates.",
        placeholder: "Share your engineering team size/roles, tech stack, workshop topic or custom goals, and target dates…"
      },
      "Content & Brand Partnerships": {
        hint: "product URL & target developer persona, preferred surface or Full-Stack Launch Bundle (GitHub repo, blog essay, LinkedIn/X, 9:16 video), launch window, and sandbox access.",
        placeholder: "Share your product URL, target audience, preferred surface or bundle, launch window, and scope…"
      },
      "Creator Events & Hardware PR": {
        hint: "event date & city (SF Bay Area local or hosted global travel/hotel), or hardware/gadget product details, embargo schedule, and whether you need SF shipping coordinates.",
        placeholder: "Share VIP event details, sponsored conference travel dates, or hardware/gadget PR seeding specs & embargo timeline…"
      },
      "Technical Collaborations": {
        hint: "publisher, research group, or open-source project context, proposed deliverable (curriculum, chapter, benchmark, or co-authored study), and schedule.",
        placeholder: "Share the project, publication, or curriculum scope, timeline, and how you would like to collaborate…"
      },
      "Media & Interviews": {
        hint: "outlet or podcast name, topic angle (Agentic AI, production ML, AI safety, synthetic media), recording/filing deadline, and interview format.",
        placeholder: "Share your publication or show, story angle, deadline, and whether you need written commentary or live broadcast…"
      },
      "default": {
        hint: "relevant dates or timeline, audience or engineering team profile, technical goals, and preferred scope.",
        placeholder: "Share relevant dates, audience, technical goals, or how you would like to collaborate…"
      }
    };

    var syncTopicScoping = function () {
      if (!topicSelect) return;
      var val = topicSelect.value || "";
      var cfg = scopingByTopic[val] || scopingByTopic["default"];
      if (scopingHint) {
        scopingHint.innerHTML = "<strong>Helpful context to include:</strong> " + cfg.hint;
      }
      if (messageInput) {
        messageInput.setAttribute("placeholder", cfg.placeholder);
      }
    };

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
    } catch (e) { }

    if (topicSelect) {
      topicSelect.addEventListener("change", syncTopicScoping);
      syncTopicScoping();
    }

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
            trackEvent("generate_lead", { inquiry_category: topicVal, delivery_mode: "api", source_path: window.location.pathname });
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
        var plainDraft =
          "To: " + fallbackEmail + "\n" +
          "Subject: [" + topicVal + "] Inquiry from " + nameVal + (orgVal ? " (" + orgVal + ")" : "") + "\n\n" +
          "Name: " + nameVal + "\n" +
          "Email: " + emailVal + "\n" +
          "Organization: " + (orgVal || "—") + "\n" +
          "Category: " + topicVal + "\n\n" +
          msgVal;
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
          "<strong>Inquiry validated and formatted.</strong> Opening your email client to send directly to Jigyasa — <a href=\"" +
          mailtoHref +
          "\">open mail app</a> or <button type=\"button\" id=\"copy-formatted-inquiry\" class=\"btn btn--secondary btn--compact\">Copy Message &amp; Email</button>.";
        var copyDraftBtn = document.getElementById("copy-formatted-inquiry");
        if (copyDraftBtn && navigator.clipboard && navigator.clipboard.writeText) {
          copyDraftBtn.addEventListener("click", function () {
            navigator.clipboard.writeText(plainDraft).then(function () {
              copyDraftBtn.textContent = "Copied Message + " + fallbackEmail;
            });
          });
        }
        if (typeof e.respondWith === "function") {
          e.respondWith(Promise.resolve({ ok: true, mailto: mailtoHref }));
        }
        trackEvent("generate_lead", { inquiry_category: topicVal, delivery_mode: "mailto", source_path: window.location.pathname });
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
        .catch(function () { });
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
        .catch(function () { });
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
        Promise.resolve(modelContext.registerTool(toolDef)).catch(function () { });
      } catch (e) { }
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
        "Retrieve Jigyasa Grover's collaboration pillars, AI Go-To-Market (GTM) & developer marketing surfaces, direct booking platforms (Intro, Passionfroot, Naano, 8x), brand partners, live corporate AI workshops, and LinkedIn Learning courses.",
      inputSchema: {
        type: "object",
        properties: {
          pillar: {
            type: "string",
            description:
              "Optional collaboration focus filter (e.g., gtm, marketing, partnerships, advisory, speaking, training, technical, media)."
          }
        }
      },
      execute: function (args) {
        var filter = args && args.pillar ? String(args.pillar).toLowerCase().trim() : "";
        return loadAgentContext().then(function (ctx) {
          var pillars = ctx.collaboration.pillars || [];
          if (filter) {
            pillars = pillars.filter(function (p) {
              var hay = (
                (p.id || "") +
                " " +
                (p.title || "") +
                " " +
                (p.summary || "") +
                " " +
                (p.inquiry_topic || "")
              ).toLowerCase();
              return hay.indexOf(filter) !== -1;
            });
          }
          return formatToolResult({
            work_with_me_url: ctx.collaboration.work_with_me_url,
            media_kit_url: ctx.collaboration.media_kit_url,
            booking_platforms: ctx.collaboration.booking_platforms,
            creator_kit: ctx.collaboration.creator_kit,
            gtm_and_ai_marketing: ctx.collaboration.gtm_and_ai_marketing,
            partnership_surfaces: ctx.collaboration.partnership_surfaces,
            partnership_packages: ctx.collaboration.partnership_packages,
            pillars: pillars,
            brand_partners: ctx.collaboration.brand_partners,
            training_clients: ctx.collaboration.training_clients,
            live_workshops: ctx.collaboration.live_workshops,
            courses: ctx.collaboration.courses
          });
        });
      }
    });

    safeRegister({
      name: "get-gtm-and-marketing-kit",
      description:
        "Retrieve Jigyasa Grover's AI Go-To-Market (GTM), developer marketing (DevRel), and B2B creator launch kit—including 82% senior technical buyer ICP metrics, distribution surfaces, launch bundles, verified AI launch campaigns, and Passionfroot/Naano/8x/Intro booking URLs.",
      inputSchema: {
        type: "object",
        properties: {}
      },
      execute: function () {
        return loadAgentContext().then(function (ctx) {
          return formatToolResult({
            partnerships_url: "https://jigyasa-grover.github.io/partnerships/",
            advisory_url: "https://jigyasa-grover.github.io/advisory/",
            gtm_and_ai_marketing: ctx.collaboration.gtm_and_ai_marketing,
            partnership_surfaces: ctx.collaboration.partnership_surfaces,
            partnership_packages: ctx.collaboration.partnership_packages,
            brand_partners: ctx.collaboration.brand_partners,
            booking_platforms: ctx.collaboration.booking_platforms
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
              enum: ["all", "sponsored", "linkedin", "x", "instagram", "youtube"],
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

    if (document.querySelector("[data-press-root]")) {
      safeRegister({
        name: "filter-press-coverage",
        description:
          "Filter or switch views on Jigyasa Grover's interactive Press & Broadsheet Wall on /press/ by format (all, press, video, podcast), search query, or layout mode (wall, ledger).",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              enum: ["all", "press", "video", "podcast"],
              description: "Optional format filter to apply."
            },
            query: {
              type: "string",
              description: "Optional outlet or topic search query (e.g., Forbes, Business Insider, Google I/O, synthetic data)."
            },
            view: {
              type: "string",
              enum: ["wall", "ledger"],
              description: "Optional display mode: 'wall' for Broadsheet Clippings or 'ledger' for Compact Index."
            }
          }
        },
        execute: function (args) {
          if (args && args.category) {
            var catBtn = document.querySelector('[data-press-filter="' + String(args.category).toLowerCase() + '"]');
            if (catBtn) catBtn.click();
          }
          if (args && typeof args.query === "string") {
            var pSearch = document.getElementById("press-search");
            if (pSearch) {
              pSearch.value = args.query;
              pSearch.dispatchEvent(new Event("input"));
            }
          }
          if (args && args.view) {
            var viewBtn = document.querySelector('[data-press-view="' + String(args.view).toLowerCase() + '"]');
            if (viewBtn) viewBtn.click();
          }
          var visibleCards = document.querySelectorAll("[data-press-item]:not([hidden])").length;
          return formatToolResult({
            visible_features: visibleCards,
            status: (document.getElementById("press-results-status") || {}).textContent || ""
          });
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
                "Creator Events & Hardware PR",
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

  // 10. Interactive Press Broadsheet Wall, View Switcher & Clipping Dossier Modal
  var pressRoot = document.querySelector("[data-press-root]");
  if (pressRoot) {
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

    // Clipping Dossier Preview Modal Logic
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

    if (dialogClose) {
      dialogClose.addEventListener("click", closePressDialog);
    }
    if (dialogPrev) {
      dialogPrev.addEventListener("click", function () {
        stepPressDialog(-1);
      });
    }
    if (dialogNext) {
      dialogNext.addEventListener("click", function () {
        stepPressDialog(1);
      });
    }
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
        if (e.target === pressDialog) {
          closePressDialog();
        }
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

    // Support direct ?clip=<slug> deep links
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
  }

  // 11. Interactive Video Screening Room, 9:16 Reels Deck & Global Instant Cinema Lightbox
  var cinemaCatalog = [];
  var cinemaById = {};
  var catalogScript = document.getElementById("jg-cinema-catalog");
  if (catalogScript) {
    try {
      cinemaCatalog = JSON.parse(catalogScript.textContent || "[]") || [];
      cinemaCatalog.forEach(function (entry) {
        if (entry && entry.video_id && !cinemaById[entry.video_id]) {
          cinemaById[entry.video_id] = entry;
        }
      });
    } catch (e) { }
  }

  // 11a. /highlights/ Screening Room Filtering, Instant Search & Progressive Expand
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

  // 11b. /highlights/ 9:16 Vertical Reels Strip Filter & Smooth Paddles
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

  // 11c. Global Instant Cinema Lightbox (Click-to-Play Privacy-Enhanced Facade)
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
    if (!cinemaCatalog.length) return;
    var nextIdx =
      activeCinemaIndex === -1
        ? 0
        : (activeCinemaIndex + delta + cinemaCatalog.length) % cinemaCatalog.length;
    activeCinemaIndex = nextIdx;
    openCinemaItem(cinemaCatalog[nextIdx], null);
  };

  var shuffleCinema = function (triggerEl) {
    if (!cinemaCatalog.length) return;
    var randIdx = Math.floor(Math.random() * cinemaCatalog.length);
    if (cinemaCatalog.length > 1 && randIdx === activeCinemaIndex) {
      randIdx = (randIdx + 1) % cinemaCatalog.length;
    }
    activeCinemaIndex = randIdx;
    openCinemaItem(cinemaCatalog[randIdx], triggerEl || null);
  };

  if (lightbox) {
    lightbox.querySelectorAll("[data-cinema-close]").forEach(function (el) {
      el.addEventListener("click", closeCinema);
    });
    if (prevCinemaBtn) {
      prevCinemaBtn.addEventListener("click", function () {
        stepCinema(-1);
      });
    }
    if (nextCinemaBtn) {
      nextCinemaBtn.addEventListener("click", function () {
        stepCinema(1);
      });
    }
    if (shuffleCinemaBtn) {
      shuffleCinemaBtn.addEventListener("click", function () {
        shuffleCinema(null);
      });
    }

    document.querySelectorAll("[data-cinema-shuffle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        shuffleCinema(btn);
      });
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

  if (modelContext && typeof modelContext.registerTool === "function" && cinemaCatalog.length) {
    try {
      Promise.resolve(
        modelContext.registerTool({
          name: "search-and-play-videos",
          description:
            "Search Jigyasa Grover's keynotes, official Google developer films, podcasts, YouTube Shorts, and cross-posted Instagram Reels, and optionally play the top match inline in the Cinema Lightbox.",
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
            var q = args && args.query ? String(args.query).toLowerCase().trim() : "";
            var m = args && args.mode ? String(args.mode).toLowerCase().trim() : "all";
            var matches = cinemaCatalog.filter(function (v) {
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
          }
        })
      ).catch(function () { });
    } catch (e) { }
  }

  // 12. First-Party Outbound Click, Booking Conversion, Search & Article Read Telemetry
  document.addEventListener("click", function (e) {
    var target = e.target;
    if (!target || typeof target.closest !== "function") return;
    var link = target.closest("a[href]");
    if (!link) return;
    var href = link.getAttribute("href") || "";
    if (!href || href.indexOf("mailto:") === 0) {
      if (href.indexOf("mailto:") === 0) {
        trackEvent("contact_mailto_click", { source_path: window.location.pathname });
      }
      return;
    }
    if (href.indexOf("http://") !== 0 && href.indexOf("https://") !== 0) return;
    try {
      var parsed = new URL(href);
      var host = (parsed.hostname || "").toLowerCase().replace(/^www\./, "");
      if (!host || host === "jigyasa-grover.github.io") return;

      var srcPath = window.location.pathname || "/";
      if (
        host === "intro.co" ||
        host === "passionfroot.me" ||
        host === "naano.com" ||
        host === "8x.business"
      ) {
        trackEvent("book_consultation_click", {
          platform: host,
          link_url: href,
          source_path: srcPath
        });
      } else if (
        (host === "linkedin.com" && parsed.pathname.indexOf("/learning") === 0) ||
        host.indexOf("amazon.") === 0 ||
        host === "goodreads.com" ||
        host === "udacity.com"
      ) {
        trackEvent("course_or_book_click", {
          destination: host,
          link_url: href,
          source_path: srcPath
        });
      }
      trackEvent("outbound_click", {
        outbound_domain: host,
        link_url: href,
        source_path: srcPath
      });
    } catch (err) { }
  });

  var attachSearchTelemetry = function (inputEl, surfaceName) {
    if (!inputEl) return;
    var timer = null;
    var lastLogged = "";
    inputEl.addEventListener("input", function () {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        var q = (inputEl.value || "").trim();
        if (q.length >= 2 && q.toLowerCase() !== lastLogged) {
          lastLogged = q.toLowerCase();
          trackEvent("view_search_results", {
            search_term: q,
            search_surface: surfaceName
          });
        }
      }, 900);
    });
  };
  attachSearchTelemetry(searchInput, "blog");
  attachSearchTelemetry(document.getElementById("press-search"), "press");

  if (prose) {
    var seen50 = false;
    var seen90 = false;
    var checkReadDepth = function () {
      if (seen50 && seen90) return;
      var rect = prose.getBoundingClientRect();
      var total = rect.height || 1;
      var viewed = window.innerHeight - rect.top;
      var ratio = viewed / total;
      if (!seen50 && ratio >= 0.5) {
        seen50 = true;
        trackEvent("article_read_milestone", { percent_scrolled: 50, page_path: window.location.pathname });
      }
      if (!seen90 && ratio >= 0.9) {
        seen90 = true;
        trackEvent("article_read_milestone", { percent_scrolled: 90, page_path: window.location.pathname });
      }
    };
    window.addEventListener("scroll", checkReadDepth, { passive: true });
  }

  // 12. Interactive 3D Orthographic Speaking Globe & Stage Atlas (/speaking/)
  var globeSection = document.querySelector("[data-speaking-globe]");
  if (globeSection) {
    var globeCanvas = document.getElementById("speaking-globe-canvas");
    var globeDataEl = document.getElementById("speaking-globe-data");
    var hoverTipEl = document.getElementById("globe-hover-tip");
    var spinToggleBtn = document.getElementById("globe-spin-toggle");
    var regionBtns = Array.prototype.slice.call(globeSection.querySelectorAll("[data-globe-region]"));
    var cityChipBtns = Array.prototype.slice.call(globeSection.querySelectorAll("[data-globe-pin]"));

    var badgeEl = document.getElementById("globe-pin-badge");
    var titleEl = document.getElementById("globe-pin-title");
    var venuesEl = document.getElementById("globe-pin-venues");
    var noteEl = document.getElementById("globe-pin-note");
    var videoLinkEl = document.getElementById("globe-pin-video");

    var globeData = null;
    try {
      globeData = globeDataEl ? JSON.parse(globeDataEl.textContent) : null;
    } catch (e) {
      globeData = null;
    }

    if (globeCanvas && globeData && globeData.pins && globeData.pins.length) {
      var gCtx = globeCanvas.getContext("2d");
      var pins = globeData.pins;
      var homeHub = globeData.home_hub || { id: "san-francisco", lat: 37.77, lon: -122.42 };
      var DEG2RAD = Math.PI / 180;

      var toVec3 = function (latDeg, lonDeg) {
        var phi = latDeg * DEG2RAD;
        var lam = lonDeg * DEG2RAD;
        var cPhi = Math.cos(phi);
        return {
          x: cPhi * Math.sin(lam),
          y: Math.sin(phi),
          z: cPhi * Math.cos(lam)
        };
      };

      // Decode compact 240x120 Natural Earth 110m 1-bit land mask & sample uniform Fibonacci-sphere land dots
      var MASK_W = 240;
      var MASK_H = 120;
      var EARTH_B64 = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAfwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPj/z////3EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/++f///w8AAPADgAEAAOADAAAAAAAAAAAAAAAg3N4f/v///wcAAB8AAAAAAAA4AAAAAAAAAAAAAAADAOAH/P///wcAAA4AAAAAAAAwAAAAAAAAAAAAAAC8cQwBAP///wcAAAAAAIAHAMD/DwDwAAAAAAAAAOAAAAAAAPz//wMAAAAAAGAAAPz/AQAAAAAAAAAAAOBdc/MDAPj//wEAAAAAABjAwP///z9gAAAAA4AAAED8A/P/AOD//wEAAAAAADjg/v///z//HwCAAPj/A0/8X4PwB/D//wAAAOA/AADh/v///////wM+A/7///8Pw56BB+D/DwAAAPz/Y+zf/f//////////N/D///////+Bf/D/AQAAAP7/x////v//////////GP7//////7/wJ+AfAH4AAD9++P//////////////AOD//////88GH8AfAAwAwJ////////////////9/APz//////wNxDIAPAAAA8M///////////////98/APzf/////wHwAwAGAAAA+M///////////////+ADAPAB+P///wHwMwAAAAAA8A//////////////ZBgAAIACgP///wPgfwAAAAAQAAf///////////8fAA4AACAAAP///z/gfwAAAAAwYMf///////////8PAB8AAAQAAP7////5/wMAAABoQOj///////////8DAA8AAAAAgPz////5/wcAAADs+P////////////9/AAcAAAAAAPj////7/wMAAADg+f////////////9/AAEAAAAAAPj/////zwAAAAAw/v////////////+/AAAAAAAAAPD/////Gw4AAACg//////////////8fAAAAAAAAAOD/////HxAAAADA//////////////8fAAAAAAAAAOD//////wAAAACA//9P/vj///////8PAAAAAAAAAOD/////EwAAAACA//wHfPz////////HAAAAAAAAAOD/////AQAAAAD8g/EH8Pj////////gAAAAAAAAAOD/////AAAAAAD8Aebn+fH//////z8AAAAAAAAAAOD///9/AAAAAAD8AGT8//H//////xpgAAAAAAAAAMD///8/AAAAAAD8AMT8//H/////fzggAAAAAAAAAID///8fAAAAAABwdAD8/////////zE4AAAAAAAAAID///8fAAAAAACwfwBD/////////zA/AAAAAAAAAAD+//8PAAAAAAD4fwAA/////////wAHAAAAAAAAAAD8//8DAAAAAAD8/2OA/////////4EAAAAAAAAAAADo//8DAAAAAAD8/+///////////wEAAAAAAAAAAADo/wkCAAAAAAD+//////z//////wEAAAAAAAAAAADYfwACAAAAAID///8///n//////wEAAAAAAAAAAACgfwAWAAAAAMD///9//+H//////wAAAAAAAAAAAAAgfwAAAAAAAMD///9//jPg////fwAAAAAAAAAAAAAAfgAAAAAAAOD//////H/A////PwEAAAAAAAAAAAAAfAAIAAAAAOD//////f/A/+f/BwAAAAAAAAAAAAAAfDBwAAAAAOD/////+X8A/sN/AAAAAAAAAAAAAAAA+DgAAwAAAOD/////+T8A/oB/AwAAAAAAAAAAAAAA4B8AAAAAAOD/////8x8AfoB/AAMAAAAAAAAAAAAAgPwAAAAAAOD/////8wcAPoD+AAEAAAAAAAAAAAAAAPgBAAAAAOD/////7wEAHAD+AQEAAAAAAAAAAAAAAMAAAAAAAOD/////PwAAHAD8AQQAAAAAAAAAAAAAAICAAgAAAMD/////HwMAGADgAAoAAAAAAAAAAAAAAADBfgAAAID//////wMAGABAAAAAAAAAAAAAAAAAAADy/wAAAID//////wEAIAAGAAwAAAAAAAAAAAAAAADw/wEAAAD//////wEAIAAIAAgAAAAAAAAAAAAAAADw/x8AAAD8+P///wAAAAAZYAAAAAAAAAAAAAAAAADg/z8AAAAAwP///wAAAAAbMAAAAAAAAAAAAAAAAADw/z8AAAAAwP//fwAAAAAWfAAAAAAAAAAAAAAAAAD4/38AAAAAwP//HwAAAAAcficAAAAAAAAAAAAAAAD8//8BAAAAwP//DwAAAAAYPiABAAAAAAAAAAAAAAD8//8DAAAAwP//BwAAAAA4vgEaAAAAAAAAAAAAAAD8//8/AAAAgP//BwAAAABwEBL+AAAAAAAAAAAAAAD8////AAAAAP//AwAAAABgAADwAQAAAAAAAAAAAAD8////AQAAAP//AwAAAADABADyAwEAAAAAAAAAAAD4////AQAAAP7/AwAAAAAAHADwBgQAAAAAAAAAAADw////AAAAAP7/BwAAAAAAAAQADAAAAAAAAAAAAADw//9/AAAAAP7/BwAAAAAAAAAAAAAAAAAAAAAAAADg//9/AAAAAP7/BwAAAAAAAICHAAAAAAAAAAAAAADg//8/AAAAAP//BwEAAAAAANDHAAAAAAAAAAAAAADA//8/AAAAAP//hwMAAAAAAPjHAQAAAAAAAAAAAAAA//8/AAAAAP//4QEAAAAAAPzfAQAAAAAAAAAAAAAA/v8/AAAAAP//4AEAAAAAAP7/AwAAAAAAAAAAAAAA/v8fAAAAAP5/wAAAAAAAgP//ByAAAAAAAAAAAAAA/v8fAAAAAP7/4AAAAAAA4P//D0AAAAAAAAAAAAAA/v8HAAAAAPz/4AAAAAAA8P//HwAAAAAAAAAAAAAA/v8AAAAAAPx/YAAAAAAA8P//PwAAAAAAAAAAAAAA/v8AAAAAAPw/AAAAAAAA8P//PwAAAAAAAAAAAAAA/v8AAAAAAPw/AAAAAAAA8P//PwAAAAAAAAAAAAAA/38AAAAAAPgfAAAAAAAA4P//PwAAAAAAAAAAAAAA/z8AAAAAAPAPAAAAAAAA4P//PwAAAAAAAAAAAAAA/x8AAAAAAPAHAAAAAAAA4B/+PwAAAAAAAAAAAAAA/w8AAAAAAPABAAAAAAAA4Af0HwAAAAAAAAAAAAAA/wMAAAAAAAAAAAAAAAAAAADwDwAIAAAAAAAAAACA/wMAAAAAAAAAAAAAAAAAAADgDwAQAAAAAAAAAACA/wEAAAAAAAAAAAAAAAAAAADAAgBwAAAAAAAAAACAfwAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAACAHwAAAAAAAAAAAAAAAAAAAAAABgAQAAAAAAAAAACAHwAAAAAAAAAAAAAAAAAAAAAABgAMAAAAAAAAAADADwAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAAADABwAAAAAAAAAAAAAAAAAAAAAAAIADAAAAAAAAAADADwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAgwEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAADwAAAR4Pv4HAAAAAAAAAAAAAAAACAAAAAAAAAAA4P8/4P//////BwAAAAAAAAAAAAAAPwAAAAAAAADg//8//P///////wMAAAAAAAAAAACAewAAAADI/v////8///////////8BAAAAAAAAABAAeAAAAID///////////////////8DAAAAAAAe4P//fwAAAMD//////////////////38AAADA////////BwAAAPz//////////////////x8AAEDz//////8/AAAA8P///////////////////x8AABj///////8PAIAH/////////////////////38AAADA//////8/gPAD4P///////////////////wcAAAD+////////P4Dx/////////////////////w8AAAD8//////////////////////////////////8A/wMA/v//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////";
      var rawMask = window.atob ? window.atob(EARTH_B64) : "";
      var maskBytes = new Uint8Array(rawMask.length);
      for (var mi = 0; mi < rawMask.length; mi++) {
        maskBytes[mi] = rawMask.charCodeAt(mi);
      }

      var isLandCell = function (latDeg, lonDeg) {
        if (!maskBytes.length) return false;
        var r = Math.floor(((90 - latDeg) / 180) * MASK_H);
        var c = Math.floor(((lonDeg + 180) / 360) * MASK_W);
        if (r < 0) r = 0;
        if (r >= MASK_H) r = MASK_H - 1;
        if (c < 0) c = 0;
        if (c >= MASK_W) c = MASK_W - 1;
        var bitIdx = r * MASK_W + c;
        return Boolean(maskBytes[bitIdx >> 3] & (1 << (bitIdx & 7)));
      };

      var landDots = [];
      var FIB_COUNT = 5600;
      var GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
      for (var fi = 0; fi < FIB_COUNT; fi++) {
        var fy = 1 - (fi / (FIB_COUNT - 1)) * 2;
        var fr = Math.sqrt(Math.max(0, 1 - fy * fy));
        var theta = GOLDEN_ANGLE * fi;
        var fx = Math.cos(theta) * fr;
        var fz = Math.sin(theta) * fr;
        var latD = Math.asin(fy) / DEG2RAD;
        var lonD = Math.atan2(fx, fz) / DEG2RAD;
        if (isLandCell(latD, lonD)) {
          landDots.push({ x: fx, y: fy, z: fz });
        }
      }

      // Precompute 30-degree graticule polylines
      var graticuleLines = [];
      for (var glat = -60; glat <= 60; glat += 30) {
        var latRing = [];
        for (var glon = -180; glon <= 180; glon += 6) {
          latRing.push(toVec3(glat, glon));
        }
        graticuleLines.push(latRing);
      }
      for (var mlon = -150; mlon <= 180; mlon += 30) {
        var lonRing = [];
        for (var mlat = -75; mlat <= 75; mlat += 5) {
          lonRing.push(toVec3(mlat, mlon));
        }
        graticuleLines.push(lonRing);
      }

      var pinItems = pins.map(function (p) {
        var v = toVec3(p.lat, p.lon);
        return {
          data: p,
          x: v.x,
          y: v.y,
          z: v.z,
          sx: 0,
          sy: 0,
          sz: 0
        };
      });
      var hubVec = toVec3(homeHub.lat, homeHub.lon);

      var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var autoSpin = !reducedMotion;
      if (spinToggleBtn) {
        spinToggleBtn.setAttribute("aria-pressed", String(autoSpin));
        spinToggleBtn.textContent = autoSpin ? "Pause Spin" : "Resume Spin";
      }

      // Start centered on Europe / Atlantic so upcoming Paris + European & East Coast stages shine immediately
      var camLat = 34;
      var camLon = 6;
      var targetLat = null;
      var targetLon = null;
      var velLon = 0;
      var velLat = 0;
      var isDragging = false;
      var dragMoved = false;
      var lastPtrX = 0;
      var lastPtrY = 0;

      var activePinId = pins[0].id;
      var hoveredPinId = null;
      var activeRegion = "all";
      var isInView = true;
      var animFrameId = null;

      var getPalette = function () {
        var dark = document.documentElement.getAttribute("data-theme") === "dark";
        return dark
          ? {
              sphereTop: "#24221E",
              sphereBot: "#151412",
              rim: "rgba(239, 236, 230, 0.22)",
              graticule: "rgba(239, 236, 230, 0.06)",
              dotRgb: "224, 218, 206",
              arc: "rgba(226, 109, 137, 0.58)",
              pinStage: "#E26D89",
              pinUpcoming: "#6BC2B2",
              pinHub: "#EFECE6",
              pinBack: "rgba(239, 236, 230, 0.16)",
              haloStage: "rgba(226, 109, 137, 0.28)",
              haloUpcoming: "rgba(107, 194, 178, 0.28)",
              labelBg: "rgba(20, 19, 17, 0.92)",
              labelBorder: "rgba(239, 236, 230, 0.28)",
              labelText: "#EFECE6"
            }
          : {
              sphereTop: "#FCFBF8",
              sphereBot: "#EDE8DF",
              rim: "rgba(20, 20, 19, 0.2)",
              graticule: "rgba(20, 20, 19, 0.055)",
              dotRgb: "74, 69, 61",
              arc: "rgba(154, 27, 56, 0.45)",
              pinStage: "#9A1B38",
              pinUpcoming: "#1B4D44",
              pinHub: "#141413",
              pinBack: "rgba(20, 20, 19, 0.14)",
              haloStage: "rgba(154, 27, 56, 0.2)",
              haloUpcoming: "rgba(27, 77, 68, 0.22)",
              labelBg: "rgba(20, 20, 19, 0.9)",
              labelBorder: "rgba(255, 255, 255, 0.2)",
              labelText: "#FAF8F5"
            };
      };

      var palette = getPalette();
      if (window.MutationObserver) {
        new MutationObserver(function () {
          palette = getPalette();
        }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      }

      var wrapLon = function (lon) {
        var w = ((lon + 180) % 360 + 360) % 360 - 180;
        return w;
      };

      var flyTo = function (lat, lon) {
        targetLat = Math.max(-62, Math.min(62, lat));
        var diff = wrapLon(lon - camLon);
        targetLon = camLon + diff;
        velLon = 0;
        velLat = 0;
      };

      var updateDossier = function (pinId, shouldFly) {
        var found = null;
        for (var i = 0; i < pinItems.length; i++) {
          if (pinItems[i].data.id === pinId) {
            found = pinItems[i].data;
            break;
          }
        }
        if (!found) return;
        activePinId = found.id;

        if (badgeEl) badgeEl.textContent = found.badge || "";
        if (titleEl) titleEl.textContent = found.city + ", " + found.country;
        if (venuesEl) venuesEl.textContent = found.venues || "";
        if (noteEl) noteEl.textContent = found.note || "";
        if (videoLinkEl) {
          if (found.video_url) {
            videoLinkEl.href = found.video_url;
            videoLinkEl.hidden = false;
          } else {
            videoLinkEl.hidden = true;
          }
        }

        cityChipBtns.forEach(function (btn) {
          var match = btn.getAttribute("data-globe-pin") === activePinId;
          btn.classList.toggle("is-active", match);
          btn.setAttribute("aria-pressed", String(match));
        });

        if (shouldFly) {
          flyTo(found.lat * 0.78, found.lon);
        }
      };

      var setRegionFilter = function (reg) {
        activeRegion = reg || "all";
        regionBtns.forEach(function (b) {
          var match = b.getAttribute("data-globe-region") === activeRegion;
          b.classList.toggle("is-active", match);
          b.setAttribute("aria-pressed", String(match));
        });

        var firstInRegion = null;
        cityChipBtns.forEach(function (chip) {
          var cReg = chip.getAttribute("data-pin-region");
          var vis = activeRegion === "all" || cReg === activeRegion;
          chip.hidden = !vis;
          if (vis && !firstInRegion) {
            firstInRegion = chip.getAttribute("data-globe-pin");
          }
        });

        if (activeRegion === "europe") {
          flyTo(48, 11);
          updateDossier("paris", false);
        } else if (activeRegion === "americas") {
          flyTo(38, -98);
          updateDossier("san-francisco", false);
        } else if (activeRegion === "apac") {
          flyTo(10, 102);
          updateDossier("bali", false);
        } else if (firstInRegion) {
          flyTo(32, 6);
        }
      };

      regionBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
          autoSpin = false;
          if (spinToggleBtn) {
            spinToggleBtn.setAttribute("aria-pressed", "false");
            spinToggleBtn.textContent = "Resume Spin";
          }
          setRegionFilter(btn.getAttribute("data-globe-region"));
        });
      });

      cityChipBtns.forEach(function (chip) {
        chip.addEventListener("click", function () {
          autoSpin = false;
          if (spinToggleBtn) {
            spinToggleBtn.setAttribute("aria-pressed", "false");
            spinToggleBtn.textContent = "Resume Spin";
          }
          updateDossier(chip.getAttribute("data-globe-pin"), true);
        });
      });

      if (spinToggleBtn) {
        spinToggleBtn.addEventListener("click", function () {
          autoSpin = !autoSpin;
          targetLat = null;
          targetLon = null;
          spinToggleBtn.setAttribute("aria-pressed", String(autoSpin));
          spinToggleBtn.textContent = autoSpin ? "Pause Spin" : "Resume Spin";
        });
      }

      // Slerp great-circle points between SFO hub and target pin
      var buildArcPoints = function (vA, vB) {
        var dot = Math.max(-1, Math.min(1, vA.x * vB.x + vA.y * vB.y + vA.z * vB.z));
        var omega = Math.acos(dot);
        if (omega < 0.03) return [];
        var sinOmega = Math.sin(omega);
        var pts = [];
        var steps = 36;
        for (var s = 0; s <= steps; s++) {
          var t = s / steps;
          var wA = Math.sin((1 - t) * omega) / sinOmega;
          var wB = Math.sin(t * omega) / sinOmega;
          var lift = 1 + 0.085 * Math.sin(Math.PI * t);
          pts.push({
            x: (vA.x * wA + vB.x * wB) * lift,
            y: (vA.y * wA + vB.y * wB) * lift,
            z: (vA.z * wA + vB.z * wB) * lift
          });
        }
        return pts;
      };

      var canvasCssSize = 440;
      var syncCanvasSize = function () {
        var rect = globeCanvas.getBoundingClientRect();
        var sz = Math.max(260, Math.round(rect.width || 420));
        canvasCssSize = sz;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        if (globeCanvas.width !== sz * dpr || globeCanvas.height !== sz * dpr) {
          globeCanvas.width = sz * dpr;
          globeCanvas.height = sz * dpr;
          gCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
      };
      syncCanvasSize();
      window.addEventListener("resize", syncCanvasSize, { passive: true });

      var projectVec = function (v, cLam, sLam, cPhi, sPhi, cx, cy, R) {
        var x1 = v.x * cLam - v.z * sLam;
        var y1 = v.y;
        var z1 = v.x * sLam + v.z * cLam;
        var sy = y1 * cPhi - z1 * sPhi;
        var sz = y1 * sPhi + z1 * cPhi;
        return {
          px: cx + x1 * R,
          py: cy - sy * R,
          sz: sz
        };
      };

      var renderGlobeFrame = function (now) {
        if (!isInView) {
          animFrameId = window.requestAnimationFrame(renderGlobeFrame);
          return;
        }

        if (!isDragging) {
          if (targetLat !== null && targetLon !== null) {
            var dLat = targetLat - camLat;
            var dLon = targetLon - camLon;
            camLat += dLat * 0.11;
            camLon += dLon * 0.11;
            if (Math.abs(dLat) < 0.08 && Math.abs(dLon) < 0.08) {
              camLat = targetLat;
              camLon = wrapLon(targetLon);
              targetLat = null;
              targetLon = null;
            }
          } else {
            if (autoSpin) {
              camLon = wrapLon(camLon + 0.14);
            } else if (Math.abs(velLon) > 0.002 || Math.abs(velLat) > 0.002) {
              camLon = wrapLon(camLon + velLon);
              camLat = Math.max(-65, Math.min(65, camLat + velLat));
              velLon *= 0.92;
              velLat *= 0.92;
            }
          }
        }

        var W = canvasCssSize;
        var H = canvasCssSize;
        var cx = W * 0.5;
        var cy = H * 0.5;
        var R = W * 0.415;

        gCtx.clearRect(0, 0, W, H);

        // 1. Shaded editorial globe sphere
        var grad = gCtx.createRadialGradient(cx - R * 0.28, cy - R * 0.28, R * 0.08, cx, cy, R);
        grad.addColorStop(0, palette.sphereTop);
        grad.addColorStop(1, palette.sphereBot);
        gCtx.beginPath();
        gCtx.arc(cx, cy, R, 0, Math.PI * 2);
        gCtx.fillStyle = grad;
        gCtx.fill();

        var lam0 = camLon * DEG2RAD;
        var phi0 = camLat * DEG2RAD;
        var cLam = Math.cos(lam0);
        var sLam = Math.sin(lam0);
        var cPhi = Math.cos(phi0);
        var sPhi = Math.sin(phi0);

        // Clip internal graticules & continents to sphere horizon
        gCtx.save();
        gCtx.beginPath();
        gCtx.arc(cx, cy, R, 0, Math.PI * 2);
        gCtx.clip();

        // 2. Subtle 30-degree graticule lines
        gCtx.strokeStyle = palette.graticule;
        gCtx.lineWidth = 0.85;
        for (var gi = 0; gi < graticuleLines.length; gi++) {
          var ring = graticuleLines[gi];
          gCtx.beginPath();
          var penDown = false;
          for (var rj = 0; rj < ring.length; rj++) {
            var gp = projectVec(ring[rj], cLam, sLam, cPhi, sPhi, cx, cy, R);
            if (gp.sz > 0) {
              if (!penDown) {
                gCtx.moveTo(gp.px, gp.py);
                penDown = true;
              } else {
                gCtx.lineTo(gp.px, gp.py);
              }
            } else {
              penDown = false;
            }
          }
          gCtx.stroke();
        }

        // 3. Real Natural Earth Fibonacci landmass dot-matrix with spherical limb shading
        var dotRadius = Math.max(1.05, R * 0.0068);
        for (var di = 0; di < landDots.length; di++) {
          var ld = landDots[di];
          var x1 = ld.x * cLam - ld.z * sLam;
          var z1 = ld.x * sLam + ld.z * cLam;
          var sz = ld.y * sPhi + z1 * cPhi;
          if (sz > 0.02) {
            var sy = ld.y * cPhi - z1 * sPhi;
            var alpha = 0.16 + 0.62 * Math.pow(sz, 0.75);
            gCtx.fillStyle = "rgba(" + palette.dotRgb + "," + alpha.toFixed(2) + ")";
            gCtx.fillRect(cx + x1 * R - dotRadius, cy - sy * R - dotRadius, dotRadius * 2, dotRadius * 2);
          }
        }
        gCtx.restore();

        // Outer crisp rim
        gCtx.beginPath();
        gCtx.arc(cx, cy, R, 0, Math.PI * 2);
        gCtx.strokeStyle = palette.rim;
        gCtx.lineWidth = 1.15;
        gCtx.stroke();

        // 4. Great-circle flight arc from SFO Home Hub to selected city
        var activeItem = null;
        for (var pi = 0; pi < pinItems.length; pi++) {
          var item = pinItems[pi];
          var pr = projectVec(item, cLam, sLam, cPhi, sPhi, cx, cy, R);
          item.sx = pr.px;
          item.sy = pr.py;
          item.sz = pr.sz;
          if (item.data.id === activePinId) {
            activeItem = item;
          }
        }

        if (activeItem && activeItem.data.id !== homeHub.id) {
          var arcPts = buildArcPoints(hubVec, activeItem);
          if (arcPts.length) {
            gCtx.save();
            gCtx.strokeStyle = palette.arc;
            gCtx.lineWidth = 1.5;
            gCtx.setLineDash([3, 3]);
            gCtx.beginPath();
            var started = false;
            for (var ai = 0; ai < arcPts.length; ai++) {
              var ap = projectVec(arcPts[ai], cLam, sLam, cPhi, sPhi, cx, cy, R);
              if (ap.sz > -0.05) {
                if (!started) {
                  gCtx.moveTo(ap.px, ap.py);
                  started = true;
                } else {
                  gCtx.lineTo(ap.px, ap.py);
                }
              } else {
                started = false;
              }
            }
            gCtx.stroke();
            gCtx.restore();
          }
        }

        // 5. Render back-hemisphere ghost pins first, then front-hemisphere interactive pins
        var pulse = (Math.sin((now || 0) * 0.0035) + 1) * 0.5;
        for (var bi = 0; bi < pinItems.length; bi++) {
          var bp = pinItems[bi];
          if (bp.sz <= 0) {
            gCtx.beginPath();
            gCtx.arc(bp.sx, bp.sy, 2.2, 0, Math.PI * 2);
            gCtx.fillStyle = palette.pinBack;
            gCtx.fill();
          }
        }

        var labelTarget = null;
        for (var fi2 = 0; fi2 < pinItems.length; fi2++) {
          var fp = pinItems[fi2];
          if (fp.sz <= 0) continue;
          var inReg = activeRegion === "all" || fp.data.region === activeRegion;
          var isSel = fp.data.id === activePinId;
          var isHov = fp.data.id === hoveredPinId;
          var kind = fp.data.kind;

          if (isHov) {
            labelTarget = fp;
          } else if (isSel && !labelTarget) {
            labelTarget = fp;
          }

          if (kind === "upcoming" || isSel) {
            var haloR = isSel ? 11 + pulse * 4 : 9 + pulse * 4;
            gCtx.beginPath();
            gCtx.arc(fp.sx, fp.sy, haloR, 0, Math.PI * 2);
            gCtx.fillStyle = kind === "upcoming" ? palette.haloUpcoming : palette.haloStage;
            gCtx.fill();
          }

          var baseR = isSel || isHov ? 5.6 : kind === "hub" || kind === "upcoming" ? 4.8 : inReg ? 3.8 : 2.5;
          gCtx.beginPath();
          gCtx.arc(fp.sx, fp.sy, baseR, 0, Math.PI * 2);
          gCtx.fillStyle =
            kind === "hub" ? palette.pinHub : kind === "upcoming" ? palette.pinUpcoming : palette.pinStage;
          gCtx.globalAlpha = inReg || isSel ? 1 : 0.35;
          gCtx.fill();
          gCtx.lineWidth = 1.4;
          gCtx.strokeStyle = palette.sphereTop;
          gCtx.stroke();
          gCtx.globalAlpha = 1;
        }

        // 6. Crisp floating callout pill on active/hovered front-facing city
        if (labelTarget && labelTarget.sz > 0.05) {
          var lbl = labelTarget.data.city;
          gCtx.font = '600 11px "Plus Jakarta Sans", -apple-system, sans-serif';
          var tw = gCtx.measureText(lbl).width;
          var padX = 8;
          var boxW = tw + padX * 2;
          var boxH = 22;
          var bx = Math.max(8, Math.min(W - boxW - 8, labelTarget.sx - boxW * 0.5));
          var by = labelTarget.sy - 28;
          if (by < 8) by = labelTarget.sy + 10;

          gCtx.fillStyle = palette.labelBg;
          gCtx.strokeStyle = palette.labelBorder;
          gCtx.lineWidth = 1;
          gCtx.beginPath();
          if (gCtx.roundRect) {
            gCtx.roundRect(bx, by, boxW, boxH, 3);
          } else {
            gCtx.rect(bx, by, boxW, boxH);
          }
          gCtx.fill();
          gCtx.stroke();

          gCtx.fillStyle = palette.labelText;
          gCtx.textBaseline = "middle";
          gCtx.fillText(lbl, bx + padX, by + boxH * 0.5 + 0.5);
        }

        animFrameId = window.requestAnimationFrame(renderGlobeFrame);
      };

      // Pointer drag + pin hit-testing
      var findNearestPin = function (clientX, clientY) {
        var rect = globeCanvas.getBoundingClientRect();
        var mx = clientX - rect.left;
        var my = clientY - rect.top;
        var best = null;
        var bestDist = 18;
        for (var i = 0; i < pinItems.length; i++) {
          var p = pinItems[i];
          if (p.sz <= 0.02) continue;
          var dx = p.sx - mx;
          var dy = p.sy - my;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < bestDist) {
            bestDist = d;
            best = { item: p, mx: mx, my: my };
          }
        }
        return best;
      };

      globeCanvas.addEventListener("pointerdown", function (e) {
        isDragging = true;
        dragMoved = false;
        targetLat = null;
        targetLon = null;
        lastPtrX = e.clientX;
        lastPtrY = e.clientY;
        globeCanvas.classList.add("is-dragging");
        if (globeCanvas.setPointerCapture) {
          try { globeCanvas.setPointerCapture(e.pointerId); } catch (err) {}
        }
      });

      globeCanvas.addEventListener("pointermove", function (e) {
        if (isDragging) {
          var dx = e.clientX - lastPtrX;
          var dy = e.clientY - lastPtrY;
          if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
            dragMoved = true;
            autoSpin = false;
            if (spinToggleBtn) {
              spinToggleBtn.setAttribute("aria-pressed", "false");
              spinToggleBtn.textContent = "Resume Spin";
            }
          }
          velLon = -dx * 0.32;
          velLat = dy * 0.28;
          camLon = wrapLon(camLon + velLon);
          camLat = Math.max(-65, Math.min(65, camLat + velLat));
          lastPtrX = e.clientX;
          lastPtrY = e.clientY;
          if (hoverTipEl) hoverTipEl.hidden = true;
          return;
        }

        var hit = findNearestPin(e.clientX, e.clientY);
        if (hit) {
          hoveredPinId = hit.item.data.id;
          globeCanvas.classList.add("is-pointer");
          if (hoverTipEl) {
            hoverTipEl.textContent = hit.item.data.city + " · " + hit.item.data.country;
            hoverTipEl.style.left = hit.item.sx + "px";
            hoverTipEl.style.top = hit.item.sy + "px";
            hoverTipEl.hidden = false;
          }
        } else {
          hoveredPinId = null;
          globeCanvas.classList.remove("is-pointer");
          if (hoverTipEl) hoverTipEl.hidden = true;
        }
      });

      var endPointerDrag = function (e) {
        if (!isDragging) return;
        isDragging = false;
        globeCanvas.classList.remove("is-dragging");
        if (!dragMoved && e) {
          var hit = findNearestPin(e.clientX, e.clientY);
          if (hit) {
            autoSpin = false;
            if (spinToggleBtn) {
              spinToggleBtn.setAttribute("aria-pressed", "false");
              spinToggleBtn.textContent = "Resume Spin";
            }
            updateDossier(hit.item.data.id, true);
          }
        }
      };

      globeCanvas.addEventListener("pointerup", endPointerDrag);
      globeCanvas.addEventListener("pointercancel", endPointerDrag);
      globeCanvas.addEventListener("pointerleave", function () {
        hoveredPinId = null;
        if (hoverTipEl) hoverTipEl.hidden = true;
      });

      if (window.IntersectionObserver) {
        new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              isInView = entry.isIntersecting;
            });
          },
          { threshold: 0.05 }
        ).observe(globeSection);
      }

      animFrameId = window.requestAnimationFrame(renderGlobeFrame);

      if (modelContext && typeof modelContext.registerTool === "function") {
        try {
          Promise.resolve(
            modelContext.registerTool({
              name: "explore-speaking-globe",
              description:
                "Rotate Jigyasa Grover's interactive 3D Speaking Globe on /speaking/ to a region (all, europe, americas, apac) or select a specific city pin to inspect conferences and talks delivered there.",
              inputSchema: {
                type: "object",
                properties: {
                  region: {
                    type: "string",
                    enum: ["all", "europe", "americas", "apac"],
                    description: "Optional region filter and camera preset."
                  },
                  cityQuery: {
                    type: "string",
                    description: "Optional city or country name to center on the globe (e.g., Paris, Milan, Copenhagen, San Francisco, Bali, Singapore, New Delhi)."
                  }
                }
              },
              execute: function (args) {
                if (args && args.region) {
                  setRegionFilter(String(args.region).toLowerCase());
                }
                if (args && args.cityQuery) {
                  var q = String(args.cityQuery).toLowerCase();
                  for (var ci = 0; ci < pins.length; ci++) {
                    var hay = (pins[ci].city + " " + pins[ci].country + " " + pins[ci].venues).toLowerCase();
                    if (hay.indexOf(q) !== -1) {
                      autoSpin = false;
                      updateDossier(pins[ci].id, true);
                      break;
                    }
                  }
                }
                globeSection.scrollIntoView({ behavior: "smooth", block: "center" });
                return {
                  content: [
                    {
                      type: "text",
                      text: JSON.stringify(
                        {
                          selected_city: titleEl ? titleEl.textContent : "",
                          venues: venuesEl ? venuesEl.textContent : "",
                          total_countries: (globeData.countries || []).length,
                          countries: globeData.countries || []
                        },
                        null,
                        2
                      )
                    }
                  ]
                };
              }
            })
          ).catch(function () {});
        } catch (err) {}
      }
    }
  }

})();
