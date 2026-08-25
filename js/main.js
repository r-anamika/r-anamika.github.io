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
