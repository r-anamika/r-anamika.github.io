(() => {
  const nav = document.getElementById("site-nav");
  const toggle = document.getElementById("nav-toggle");
  const backdrop = document.getElementById("nav-backdrop");
  const links = [...document.querySelectorAll(".nav-link")];
  const sections = links
    .map((link) => {
      const id = link.getAttribute("href");
      return id && id.startsWith("#") ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  const setOpen = (open) => {
    document.body.classList.toggle("nav-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    if (open) {
      const first = nav?.querySelector(".nav-link");
      first?.focus();
    } else {
      toggle?.focus();
    }
  };

  toggle?.addEventListener("click", () => {
    setOpen(!document.body.classList.contains("nav-open"));
  });

  backdrop?.addEventListener("click", () => setOpen(false));

  links.forEach((link) => {
    link.addEventListener("click", () => {
      if (document.body.classList.contains("nav-open")) setOpen(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
      setOpen(false);
    }
  });

  const setCurrent = (id) => {
    links.forEach((link) => {
      const match = link.getAttribute("href") === `#${id}`;
      if (match) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };

  if ("IntersectionObserver" in window && sections.length) {
    const observed = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          observed.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        let bestId = sections[0].id;
        let bestRatio = 0;
        observed.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        setCurrent(bestId);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.15, 0.35, 0.6, 1] }
    );
    sections.forEach((section) => io.observe(section));
  }
})();

/* ---------- motion ----------
   Everything below is progressive enhancement: the page is complete without it.
   `html.js` is what un-hides the reveal targets, so a JS failure leaves the
   content visible rather than blank. */
(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduced.matches) return;

  // Reveal on scroll, staggered within each group of siblings.
  // Driven by the scroll handler below rather than IntersectionObserver: if an
  // observer never fires, every tagged element stays at opacity 0 and the page
  // reads as blank. A position check has no such failure mode.
  const targets = [...document.querySelectorAll("[data-reveal]")];
  const groups = new Map();
  targets.forEach((el) => {
    const parent = el.parentElement;
    const index = groups.get(parent) ?? 0;
    groups.set(parent, index + 1);
    el.style.setProperty("--reveal-delay", `${Math.min(index, 6) * 70}ms`);
  });

  // Only now hide them — everything above this line is guaranteed to have run.
  root.classList.add("js");

  let pending = targets;
  const revealVisible = () => {
    if (!pending.length) return;
    const line = innerHeight * 0.88;
    pending = pending.filter((el) => {
      if (el.getBoundingClientRect().top > line) return true;
      el.classList.add("is-in");
      return false;
    });
  };

  // Scroll progress.
  const progress = document.createElement("div");
  progress.className = "progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  let ticking = false;
  const drawProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
    revealVisible();
    ticking = false;
  };
  addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(drawProgress);
    },
    { passive: true }
  );
  addEventListener("resize", drawProgress, { passive: true });
  // A fragment jump (landing on /#about) moves the page without firing scroll,
  // and late-loading images shift everything, so re-check on both.
  addEventListener("hashchange", drawProgress);
  addEventListener("load", drawProgress);
  drawProgress();

  const fine = window.matchMedia("(pointer: fine)");
  if (!fine.matches) return;

  // Buttons lean toward the pointer.
  document.querySelectorAll(".btn, .socials a").forEach((el) => {
    el.addEventListener("pointermove", (event) => {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.28;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  });

  // The sticker tilts in 3D toward the pointer and carries a gloss with it.
  const sticker = document.querySelector(".sticker");
  if (sticker) {
    const REST = "rotate(-2.5deg)";
    sticker.addEventListener("pointermove", (event) => {
      const rect = sticker.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      sticker.classList.add("is-tilting");
      sticker.style.setProperty("--mx", `${px * 100}%`);
      sticker.style.setProperty("--my", `${py * 100}%`);
      sticker.style.transform =
        `perspective(900px) rotateX(${(0.5 - py) * 12}deg) ` +
        `rotateY(${(px - 0.5) * 14}deg) rotate(-1deg) scale(1.03)`;
    });
    sticker.addEventListener("pointerleave", () => {
      sticker.classList.remove("is-tilting");
      sticker.style.transform = REST;
    });
  }

  // Inspector cursor: a dot that tracks the pointer and a bracket frame that
  // snaps onto whatever is under it, the way a design tool selects an element.
  const SNAP = "a, button, .card, .tool, .stat, .do-item, .sticker, .timeline li";
  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  dot.setAttribute("aria-hidden", "true");
  const box = document.createElement("div");
  box.className = "cursor-box";
  box.setAttribute("aria-hidden", "true");
  box.innerHTML = "<i></i><i></i><i></i><i></i>";
  document.body.append(dot, box);
  document.body.classList.add("cursor-active");


  const pointer = { x: innerWidth / 2, y: innerHeight / 2 };
  const frame = { x: pointer.x, y: pointer.y };
  let snapped = null;
  let live = false;

  addEventListener(
    "pointermove",
    (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!live) {
        live = true;
        frame.x = pointer.x;
        frame.y = pointer.y;
        document.body.classList.add("cursor-live");
      }
      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;

      const hit = event.target instanceof Element ? event.target.closest(SNAP) : null;
      if (hit !== snapped) {
        snapped = hit;
        document.body.classList.toggle("cursor-snapped", Boolean(hit));
        if (!hit) {
          box.style.width = "";
          box.style.height = "";
          box.style.margin = "";
        }
      }
      if (hit) {
        const rect = hit.getBoundingClientRect();
        const w = rect.width + 14;
        const h = rect.height + 14;
        box.style.width = `${w}px`;
        box.style.height = `${h}px`;
        box.style.margin = `${-h / 2}px 0 0 ${-w / 2}px`;
      }
    },
    { passive: true }
  );

  // The frame eases toward its mark; when snapped it parks on the element.
  const tick = () => {
    let tx = pointer.x;
    let ty = pointer.y;
    if (snapped) {
      const rect = snapped.getBoundingClientRect();
      tx = rect.left + rect.width / 2;
      ty = rect.top + rect.height / 2;
    }
    frame.x += (tx - frame.x) * (snapped ? 0.22 : 0.16);
    frame.y += (ty - frame.y) * (snapped ? 0.22 : 0.16);
    box.style.transform = `translate3d(${frame.x}px, ${frame.y}px, 0)`;
    requestAnimationFrame(tick);
  };
  tick();

  addEventListener("pointerdown", () => box.style.setProperty("opacity", "0.55"));
  addEventListener("pointerup", () => box.style.removeProperty("opacity"));
  document.addEventListener("pointerleave", () => box.style.setProperty("opacity", "0"));
  document.addEventListener("pointerenter", () => box.style.removeProperty("opacity"));
})();
