(function () {
  var navItems = [
    { href: "index.html", label: "Home" },
    { href: "services.html", label: "Services" },
    { href: "speaking.html", label: "Speaking" },
    { href: "career.html", label: "Career" },
    { href: "posts.html", label: "Posts" },
    { href: "awards.html", label: "Awards" },
    { href: "contact.html", label: "Contact" }
  ];

  function normalisePath(pathname) {
    var out = pathname.split("/").pop() || "index.html";
    return out.toLowerCase();
  }

  function injectShell() {
    var headerNode = document.getElementById("site-header");
    var footerNode = document.getElementById("site-footer");
    var current = normalisePath(window.location.pathname);

    if (headerNode) {
      var links = navItems
        .map(function (item) {
          var isActive = current === item.href.toLowerCase();
          return (
            '<a href="' +
            item.href +
            '"' +
            (isActive ? ' class="active"' : "") +
            ">" +
            item.label +
            "</a>"
          );
        })
        .join("");

      headerNode.innerHTML =
        '<a class="skip-link" href="#main-content">Skip to content</a>' +
        '<header class="site-header">' +
        '<div class="site-header-inner">' +
        '<a class="brand" href="index.html">Sebastian Coles</a>' +
        '<div class="header-tools">' +
        '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Toggle menu">Menu</button>' +
        '<nav id="site-nav" class="nav-links" aria-label="Main navigation">' +
        links +
        "</nav>" +
        "</div>" +
        "</div>" +
        "</header>";
    }

    if (footerNode) {
      footerNode.innerHTML =
        '<footer class="site-footer">' +
        '<div class="site-footer-inner">' +
        '<div>Secure engineering leadership, with people at the center. <span id="footer-year"></span><br>SCOLES ADVISORY LIMITED | Company number 15937113</div>' +
        '<div class="social">' +
        '<a href="https://github.com/sebcoles" target="_blank" rel="noopener noreferrer">GitHub</a>' +
        '<a href="https://www.linkedin.com/in/sebastiancoles" target="_blank" rel="noopener noreferrer">LinkedIn</a>' +
        '<a href="mailto:sebastian@scoles-advisory.com">Email</a>' +
        "</div>" +
        "</div>" +
        "</footer>";
    }

    var menuToggle = document.querySelector(".menu-toggle");
    var nav = document.querySelector(".nav-links");
    if (menuToggle && nav) {
      var toggleMenu = function (open) {
        nav.classList.toggle("open", open);
        menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      };

      menuToggle.addEventListener("click", function () {
        toggleMenu(!nav.classList.contains("open"));
      });

      nav.addEventListener("click", function (event) {
        if (event.target.tagName === "A") {
          toggleMenu(false);
        }
      });

      document.addEventListener("click", function (event) {
        var inHeader = event.target.closest(".site-header-inner");
        if (!inHeader) {
          toggleMenu(false);
        }
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          toggleMenu(false);
        }
      });
    }

    var yearNode = document.getElementById("footer-year");
    if (yearNode) {
      yearNode.textContent = String(new Date().getFullYear());
    }
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function renderInline(raw) {
    var text = raw;

    function normaliseContentHref(href) {
      if (!href || !href.startsWith("/") || href.startsWith("//")) {
        return href;
      }
      var cleaned = href.replace(/\/+$/, "");
      if (cleaned === "") {
        return "index.html";
      }
      var lookup = {
        "/services": "services.html",
        "/speaking": "speaking.html",
        "/career": "career.html",
        "/posts": "posts.html",
        "/awards": "awards.html",
        "/contact": "contact.html"
      };
      return lookup[cleaned] || href;
    }

    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function (_, alt, src) {
      return '<img src="' + src + '" alt="' + alt + '">';
    });

    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, label, href) {
      return '<a href="' + normaliseContentHref(href) + '">' + label + "</a>";
    });

    text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
    return text;
  }

  function stripFrontMatter(text) {
    if (!text.startsWith("---")) {
      return text;
    }
    var parts = text.split(/\r?\n/);
    var close = -1;
    for (var i = 1; i < parts.length; i += 1) {
      if (parts[i].trim() === "---") {
        close = i;
        break;
      }
    }
    return close === -1 ? text : parts.slice(close + 1).join("\n");
  }

  function markdownToHtml(rawText) {
    var text = stripFrontMatter(rawText).trim();
    var lines = text.split(/\r?\n/);
    var html = [];
    var i = 0;
    var inList = false;

    function closeList() {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
    }

    while (i < lines.length) {
      var line = lines[i];
      var trimmed = line.trim();

      if (!trimmed) {
        closeList();
        i += 1;
        continue;
      }

      if (/^<[^>]+>/.test(trimmed)) {
        closeList();
        if (!/^<meta\s/i.test(trimmed)) {
          html.push(line);
        }
        i += 1;
        continue;
      }

      var tableHeaderMatch = /^\|(.+)\|$/.test(trimmed);
      var next = lines[i + 1] ? lines[i + 1].trim() : "";
      if (tableHeaderMatch && /^\|(?:\s*:?-+:?\s*\|)+$/.test(next)) {
        closeList();
        var headers = trimmed
          .slice(1, -1)
          .split("|")
          .map(function (cell) {
            return cell.trim();
          });
        html.push("<table><thead><tr>");
        headers.forEach(function (head) {
          html.push("<th>" + renderInline(head) + "</th>");
        });
        html.push("</tr></thead><tbody>");
        i += 2;
        while (i < lines.length && /^\|(.+)\|$/.test(lines[i].trim())) {
          var row = lines[i]
            .trim()
            .slice(1, -1)
            .split("|")
            .map(function (cell) {
              return cell.trim();
            });
          html.push("<tr>");
          row.forEach(function (cell) {
            html.push("<td>" + renderInline(cell) + "</td>");
          });
          html.push("</tr>");
          i += 1;
        }
        html.push("</tbody></table>");
        continue;
      }

      var heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (heading) {
        closeList();
        var depth = heading[1].length;
        html.push("<h" + depth + ">" + renderInline(heading[2]) + "</h" + depth + ">");
        i += 1;
        continue;
      }

      if (/^---+$/.test(trimmed)) {
        closeList();
        html.push("<hr>");
        i += 1;
        continue;
      }

      var quote = trimmed.match(/^>\s?(.*)$/);
      if (quote) {
        closeList();
        html.push("<blockquote>" + renderInline(quote[1]) + "</blockquote>");
        i += 1;
        continue;
      }

      var item = trimmed.match(/^[-*]\s+(.+)$/);
      if (item) {
        if (!inList) {
          html.push("<ul>");
          inList = true;
        }
        html.push("<li>" + renderInline(item[1]) + "</li>");
        i += 1;
        continue;
      }

      closeList();
      var paragraph = [trimmed];
      i += 1;
      while (i < lines.length) {
        var nextLine = lines[i].trim();
        if (!nextLine) {
          break;
        }
        if (/^(#{1,6})\s+/.test(nextLine)) {
          break;
        }
        if (/^[-*]\s+/.test(nextLine)) {
          break;
        }
        if (/^>\s?/.test(nextLine)) {
          break;
        }
        if (/^\|(.+)\|$/.test(nextLine)) {
          break;
        }
        if (/^---+$/.test(nextLine)) {
          break;
        }
        if (/^<[^>]+>/.test(nextLine)) {
          break;
        }
        paragraph.push(nextLine);
        i += 1;
      }
      html.push("<p>" + renderInline(paragraph.join(" ")) + "</p>");
    }

    closeList();
    return html.join("\n");
  }

  function readQueryParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function slugify(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[\s]+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function decorateContent(host) {
    var headings = host.querySelectorAll("h2, h3");
    var toc = [];
    headings.forEach(function (heading) {
      var text = heading.textContent ? heading.textContent.trim() : "";
      if (!text) {
        return;
      }
      var id = heading.id || slugify(text);
      if (!id) {
        return;
      }
      heading.id = id;
      toc.push({
        id: id,
        text: text,
        level: heading.tagName.toLowerCase()
      });
    });

    var tocHost = document.getElementById("post-toc");
    if (tocHost) {
      if (!toc.length) {
        tocHost.innerHTML = "<p class=\"post-empty\">No section headings available.</p>";
      } else {
        tocHost.innerHTML =
          '<ul class="toc-list">' +
          toc
            .map(function (item) {
              var indent = item.level === "h3" ? " style=\"padding-left:0.75rem\"" : "";
              return '<li' + indent + '><a href="#' + item.id + '">' + escapeHtml(item.text) + "</a></li>";
            })
            .join("") +
          "</ul>";
      }
    }
  }

  function setReadingProgress() {
    var target = document.getElementById("post-detail");
    var bar = document.getElementById("reading-progress");
    if (!target || !bar) {
      return;
    }

    var rect = target.getBoundingClientRect();
    var top = rect.top + window.scrollY;
    var total = Math.max(1, target.offsetHeight - window.innerHeight * 0.55);
    var progress = ((window.scrollY - top) / total) * 100;
    var clamped = Math.max(0, Math.min(100, progress));
    bar.style.width = clamped + "%";
  }

  function formatDate(value) {
    var d = new Date(value + "T00:00:00");
    if (Number.isNaN(d.getTime())) {
      return value;
    }
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  function revealOnScroll() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!nodes.length || !("IntersectionObserver" in window)) {
      nodes.forEach(function (n) {
        n.classList.add("in");
      });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    nodes.forEach(function (node) {
      observer.observe(node);
    });
  }

  async function loadMarkdownInto(node, source) {
    try {
      var res = await fetch(source, { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to fetch markdown");
      }
      var text = await res.text();
      if (source.toLowerCase().endsWith(".html")) {
        node.innerHTML = text;
      } else {
        node.innerHTML = markdownToHtml(text);
      }
      decorateContent(node);
    } catch (error) {
      node.innerHTML =
        "<p>Sorry, this content could not be loaded right now.</p>" +
        "<p><a href=\"contact.html\">Please contact me if this persists.</a></p>";
    }
  }

  async function hydrateMarkdownPage() {
    var node = document.getElementById("markdown-root");
    if (!node) {
      return;
    }
    var source = node.getAttribute("data-source");
    if (!source) {
      return;
    }
    await loadMarkdownInto(node, source);
  }

  async function hydratePostsList() {
    var host = document.getElementById("posts-list");
    if (!host || !Array.isArray(window.POSTS)) {
      return;
    }

    var sorted = window.POSTS.slice().sort(function (a, b) {
      return a.date > b.date ? -1 : 1;
    });

    var searchInput = document.getElementById("post-search");
    var categorySelect = document.getElementById("post-category");
    var emptyNode = document.getElementById("post-empty");

    if (categorySelect) {
      var seen = {};
      sorted.forEach(function (post) {
        seen[post.category] = true;
      });
      var categories = Object.keys(seen).sort();
      categorySelect.innerHTML =
        '<option value="">All categories</option>' +
        categories
          .map(function (category) {
            return '<option value="' + escapeHtml(category) + '">' + escapeHtml(category) + "</option>";
          })
          .join("");
    }

    function renderPosts(items) {
      host.innerHTML = items
        .map(function (post) {
        return (
          '<a class="post-card reveal" href="post.html?slug=' +
          encodeURIComponent(post.slug) +
          '">' +
          '<div class="post-meta">' +
          formatDate(post.date) +
          " | " +
          escapeHtml(post.category) +
          "</div>" +
          "<h3>" +
          escapeHtml(post.title) +
          "</h3>" +
          "<p>" +
          escapeHtml(post.summary) +
          "</p>" +
          "</a>"
        );
      })
      .join("");

      if (emptyNode) {
        emptyNode.hidden = items.length > 0;
      }
      revealOnScroll();
    }

    function applyFilters() {
      var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
      var category = categorySelect ? categorySelect.value : "";
      var filtered = sorted.filter(function (post) {
        var matchText =
          !query ||
          post.title.toLowerCase().includes(query) ||
          post.summary.toLowerCase().includes(query);
        var matchCategory = !category || post.category === category;
        return matchText && matchCategory;
      });
      renderPosts(filtered);
    }

    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }
    if (categorySelect) {
      categorySelect.addEventListener("change", applyFilters);
    }

    applyFilters();
  }

  async function hydratePostDetail() {
    var host = document.getElementById("post-detail");
    if (!host || !Array.isArray(window.POSTS)) {
      return;
    }

    var slug = readQueryParam("slug");
    var post = window.POSTS.find(function (item) {
      return item.slug === slug;
    });

    if (!post) {
      window.location.href = "404.html";
      return;
    }

    var title = document.getElementById("post-title");
    var meta = document.getElementById("post-meta");
    if (title) {
      title.textContent = post.title;
      document.title = post.title + " | Sebastian Coles";
    }
    if (meta) {
      meta.textContent = formatDate(post.date) + " | " + post.category;
    }

    await loadMarkdownInto(host, post.source);

    setReadingProgress();
    window.addEventListener("scroll", setReadingProgress, { passive: true });
    window.addEventListener("resize", setReadingProgress);
  }

  async function boot() {
    injectShell();
    await hydratePostsList();
    await hydratePostDetail();
    await hydrateMarkdownPage();
    revealOnScroll();
  }

  document.addEventListener("DOMContentLoaded", boot);
})();