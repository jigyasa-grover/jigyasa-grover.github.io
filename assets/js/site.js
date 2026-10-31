(function () {
  "use strict";

  var formLoadedAt = Date.now();

  // 1. Dark / Light Reading Theme Toggle
  var themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var root = document.documentElement;
      var current = root.getAttribute("data-theme");
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
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
  var activeCategory = "all";

  function applyBlogFilter() {
    if (!postRows.length) return;
    var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var visibleCount = 0;

    postRows.forEach(function (row) {
      var cat = (row.getAttribute("data-category") || "").toLowerCase();
      var hay = (row.getAttribute("data-search") || "").toLowerCase();
      var catMatch = activeCategory === "all" || cat === activeCategory;
      var queryMatch = !query || hay.indexOf(query) !== -1;
      var show = catMatch && queryMatch;
      row.style.display = show ? "" : "none";
      if (show) visibleCount++;
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? "block" : "none";
    }
  }

  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) {
          b.classList.remove("is-active");
        });
        btn.classList.add("is-active");
        activeCategory = (btn.getAttribute("data-blog-filter") || "all").toLowerCase();
        applyBlogFilter();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyBlogFilter);
  }

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
        return;
      }

      // Anti-bot honeypot & sub-second automated submission check
      if ((gotcha && gotcha.value) || Date.now() - formLoadedAt < 800) {
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

        fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        })
          .then(function (res) {
            if (!res.ok) throw new Error("Submission failed");
            statusEl.className = "form-status is-visible is-success";
            statusEl.textContent = "Thank you, " + nameVal + ". Your inquiry regarding " + topicVal + " has been received.";
            contactForm.reset();
          })
          .catch(function () {
            statusEl.className = "form-status is-visible is-error";
            statusEl.textContent = "Network delivery encountered an issue. Please use Intro/Passionfroot/Naano above or retry shortly.";
          })
          .finally(function () {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Inquiry →";
          });
      } else if (fallbackEmail) {
        var subject = encodeURIComponent("[" + topicVal + "] Inquiry from " + nameVal + (orgVal ? " (" + orgVal + ")" : ""));
        var body = encodeURIComponent(
          "Name: " + nameVal + "\n" +
          "Email: " + emailVal + "\n" +
          "Organization: " + (orgVal || "—") + "\n" +
          "Category: " + topicVal + "\n\n" +
          msgVal
        );
        statusEl.className = "form-status is-visible is-success";
        statusEl.innerHTML =
          "<strong>Inquiry validated and formatted.</strong> Opening your email client to send directly to Jigyasa — or <a href=\"mailto:" +
          fallbackEmail +
          "?subject=" +
          subject +
          "&body=" +
          body +
          "\">click here if your mail client did not open automatically</a>.";
        window.location.href = "mailto:" + fallbackEmail + "?subject=" + subject + "&body=" + body;
      }
    });
  }
})();
