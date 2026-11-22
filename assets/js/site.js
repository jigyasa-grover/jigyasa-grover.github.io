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

  document.querySelectorAll("[data-print-page]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      trackEvent("print_media_kit_pdf", { source_path: window.location.pathname });
      window.print();
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

      // Anti-bot honeypot & sub-second automated spam check (exempting WebMCP agentInvoked & WebDriver)
      var isAgentOrAutomation = Boolean(e.agentInvoked) || (typeof navigator !== "undefined" && navigator.webdriver === true);
      if ((gotcha && gotcha.value) || (!isAgentOrAutomation && Date.now() - formLoadedAt < 800)) {
        if (statusEl) {
          statusEl.className = "form-status is-visible is-success";
          statusEl.textContent = "Thank you. Your inquiry has been recorded.";
        }
        contactForm.reset();
        if (typeof e.respondWith === "function") {
          e.respondWith(Promise.resolve({ ok: false, error: "Submission blocked by anti-spam check." }));
        }
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
        var gmailHref =
          "https://mail.google.com/mail/?view=cm&fs=1&to=" +
          encodeURIComponent(fallbackEmail) +
          "&su=" +
          subject +
          "&body=" +
          body;
        statusEl.className = "form-status is-visible is-success";
        statusEl.innerHTML =
          "<strong>Inquiry ready to send.</strong> Choose how you prefer to send it to Jigyasa (" +
          fallbackEmail +
          "): <span class=\"btn-group mt-xs\">" +
          "<a href=\"" + gmailHref + "\" target=\"_blank\" rel=\"noopener\" class=\"btn btn--primary btn--compact\">Open in Gmail Web ↗</a> " +
          "<a href=\"" + mailtoHref + "\" class=\"btn btn--secondary btn--compact\">Open Mail App</a> " +
          "<button type=\"button\" id=\"copy-formatted-inquiry\" class=\"btn btn--secondary btn--compact\">Copy Message &amp; Email</button>" +
          "</span>";
        var copyDraftBtn = document.getElementById("copy-formatted-inquiry");
        if (copyDraftBtn && navigator.clipboard && navigator.clipboard.writeText) {
          copyDraftBtn.addEventListener("click", function () {
            navigator.clipboard.writeText(plainDraft).then(function () {
              copyDraftBtn.textContent = "Copied Message + " + fallbackEmail;
            });
          });
        }
        if (typeof e.respondWith === "function") {
          e.respondWith(Promise.resolve({ ok: true, mailto: mailtoHref, gmail: gmailHref }));
        }
        trackEvent("draft_inquiry_mailto", { inquiry_category: topicVal, source_path: window.location.pathname });
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
      annotations: { readOnlyHint: true },
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
      annotations: { readOnlyHint: true },
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
        "Retrieve Jigyasa Grover's AI Go-To-Market (GTM), developer marketing (DevRel), and B2B creator launch kit, including 80%+ senior technical buyer ICP metrics, distribution surfaces, launch bundles, verified AI launch campaigns, and Passionfroot/Naano/8x/LinkedIn Creator Marketplace/Intro booking URLs.",
      annotations: { readOnlyHint: true },
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
        "Search Jigyasa Grover's 34 indexed technical AI, ML, Cloud TPU, and open-source articles (with full Markdown twin URLs) by keyword or topic category. When viewing /blog/, also updates the live filter across all 91 essays and archives.",
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Optional keyword search query (e.g., TorchTPU, ADK, Gemini, TPU, ranking, privacy, Pharo)."
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
            var catOk = cat === "all" ? true : artCat.indexOf(cat) !== -1;
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
            archive_index_url: ctx.archive_index_url,
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
        annotations: { readOnlyHint: true },
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
        name: "search-press-features",
        description:
          "Filter and retrieve Jigyasa Grover's press clippings, broadcast segments, and podcast interviews on /press/ by format (all, press, video, podcast), search query, or layout mode (wall, ledger).",
        annotations: { readOnlyHint: true },
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
          var visibleEls = Array.prototype.slice.call(document.querySelectorAll("[data-press-item]:not([hidden])"));
          var items = visibleEls.slice(0, 15).map(function (el) {
            return {
              outlet: el.getAttribute("data-outlet") || "",
              date: el.getAttribute("data-date") || "",
              category: el.getAttribute("data-category") || "",
              title: el.getAttribute("data-title") || "",
              summary: el.getAttribute("data-summary") || "",
              url: el.getAttribute("data-url") || ""
            };
          });
          return formatToolResult({
            visible_features: visibleEls.length,
            status: (document.getElementById("press-results-status") || {}).textContent || "",
            results: items
          });
        }
      });
    }
    // Note: draft-collaboration-inquiry is exposed declaratively on <form id="contact-form" toolname="draft-collaboration-inquiry">
    // without toolautosubmit (human-in-the-loop review) to prevent duplicate tool-name InvalidStateError collisions.
  }

  // 10. Outbound Click, Booking Conversion, Search & Article Read Telemetry
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

})();
