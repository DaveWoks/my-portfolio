(function () {
    "use strict";

    const links = {
        connect: "https://me.deets.digital/dav.w",
        message: "https://me.deets.digital/dav.w",
        dribbble: "https://dribbble.com/NitinBhatnagar",
        instagram: "https://instagram.com/nitin_explains",
        twitter: "https://x.com/nitin_much",
        linkedin: "https://www.linkedin.com/in/david-w-269194163"
    };

    const projectLinks = {
        "paytm for business": "https://nitinbhatnagar.framer.website/works/paytm-for-business",
        "airtel thanks app": "https://nitinbhatnagar.framer.website/works/airtel-thanks-app",
        "cricplay": "https://nitinbhatnagar.framer.website/works/cricplay-app",
        "peek": "https://nitinbhatnagar.framer.website/works/visual-inventory-app"
    };

    const projectImages = {
        "paytm for business": "Images/Image 1.png",
        "airtel thanks app": "Images/Image 2.png",
        "cricplay": "Images/Image 3.png",
        "peek": "Images/Image 4.png"
    };

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function setExternalLink(element, href, label) {
        if (!element || !href) return;

        element.href = href;
        element.target = "_blank";
        element.rel = "noopener noreferrer";

        if (label) {
            element.setAttribute("aria-label", label);
        }
    }

    function addBaseInteractions() {
        const body = document.body;
        const header = document.querySelector(".header");
        const nav = document.querySelector(".nav");
        const logo = document.querySelector(".logo");
        const hero = document.querySelector(".hero");
        const projects = document.querySelector(".projects");
        const footer = document.querySelector(".footer");
        const connectButton = document.querySelector(".connect-btn");
        const callButton = document.querySelector(".cta");

        if (hero) hero.id = "about";
        if (projects) projects.id = "projects";
        if (footer) footer.id = "connect";

        document.documentElement.style.scrollBehavior = prefersReducedMotion ? "auto" : "smooth";

        if (logo) {
            logo.tabIndex = 0;
            logo.setAttribute("role", "button");
            logo.setAttribute("aria-label", "Scroll to top");
            logo.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" }));
            logo.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    logo.click();
                }
            });
        }

        document.querySelectorAll(".nav-links a").forEach((link) => {
            const sectionName = link.textContent.trim().toLowerCase();
            const target = {
                "about me": "about",
                project: "projects",
                projects: "projects"
            }[sectionName] || sectionName;
            link.href = `#${target}`;
            link.addEventListener("click", () => body.classList.remove("nav-open"));
        });

        setExternalLink(connectButton, links.connect, "Connect with Wokoma, David Chinweuba");

        setExternalLink(callButton, links.message, "Send Wokoma, David Chinweuba a message");

        const socialLinks = Array.from(document.querySelectorAll(".socials a"));
        socialLinks.forEach((link) => {
            const key = link.textContent.trim().replace("↗", "").trim().toLowerCase();
            const href = key.includes("linkedin.com") ? links.linkedin : links[key];
            setExternalLink(link, href, `Open Wokoma, David Chinweuba on ${key}`);
        });

        if (header) {
            const onScroll = () => {
                header.classList.toggle("is-scrolled", window.scrollY > 12);
            };

            onScroll();
            window.addEventListener("scroll", onScroll, { passive: true });
        }

        if (nav) {
            const toggle = document.createElement("button");
            toggle.className = "mobile-menu-toggle";
            toggle.type = "button";
            toggle.setAttribute("aria-label", "Toggle navigation menu");
            toggle.setAttribute("aria-expanded", "false");
            toggle.innerHTML = "<span></span><span></span>";

            toggle.addEventListener("click", () => {
                const isOpen = body.classList.toggle("nav-open");
                toggle.setAttribute("aria-expanded", String(isOpen));
            });

            nav.insertBefore(toggle, connectButton ? connectButton.nextSibling : null);
        }
    }

    function enhanceProjects() {
        const cards = document.querySelectorAll(".project");

        cards.forEach((card, index) => {
            const title = card.querySelector("h3")?.textContent.trim().toLowerCase();
            const href = title ? projectLinks[title] : "";
            const imageSrc = title ? projectImages[title] : "";
            const image = card.querySelector("img");

            card.tabIndex = 0;
            card.setAttribute("role", href ? "link" : "article");

            if (href) {
                card.setAttribute("aria-label", `Open ${card.querySelector("h3").textContent.trim()} project`);
            }

            if (image) {
                image.alt = card.querySelector("h3")?.textContent.trim() || `Project ${index + 1}`;
                if (imageSrc) image.src = imageSrc;
                image.addEventListener("error", () => {
                    card.classList.add("has-image-fallback");
                    image.remove();
                }, { once: true });
            }

            card.addEventListener("click", () => {
                if (href) window.open(href, "_blank", "noopener,noreferrer");
            });

            card.addEventListener("keydown", (event) => {
                if ((event.key === "Enter" || event.key === " ") && href) {
                    event.preventDefault();
                    card.click();
                }
            });

            if (!prefersReducedMotion) {
                card.addEventListener("pointermove", (event) => {
                    const rect = card.getBoundingClientRect();
                    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
                    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
                    card.style.transform = `translateY(-4px) rotateX(${y}deg) rotateY(${x}deg)`;
                });

                card.addEventListener("pointerleave", () => {
                    card.style.transform = "";
                });
            }
        });
    }

    function revealOnScroll() {
        const revealItems = document.querySelectorAll(".intro, .hero-title, .subtext, .cta, .project, .footer");

        if (prefersReducedMotion || !("IntersectionObserver" in window)) {
            revealItems.forEach((item) => item.classList.add("is-visible"));
            return;
        }

        revealItems.forEach((item, index) => {
            item.classList.add("reveal");
            item.style.setProperty("--reveal-delay", `${Math.min(index * 60, 240)}ms`);
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.16,
            rootMargin: "0px 0px -8% 0px"
        });

        revealItems.forEach((item) => observer.observe(item));
    }

    function markActiveSection() {
        const navLinks = document.querySelectorAll(".nav-links a");
        const sections = Array.from(navLinks)
            .map((link) => document.querySelector(link.getAttribute("href")))
            .filter(Boolean);

        if (!sections.length || !("IntersectionObserver" in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                navLinks.forEach((link) => {
                    const isActive = link.getAttribute("href") === `#${entry.target.id}`;
                    link.classList.toggle("is-active", isActive);
                });
            });
        }, {
            threshold: 0.4,
            rootMargin: "-20% 0px -50% 0px"
        });

        sections.forEach((section) => observer.observe(section));
    }

    function injectInteractionStyles() {
        const style = document.createElement("style");
        style.textContent = `
            .header {
                position: sticky;
                top: 0;
                z-index: 10;
                background: rgba(255, 255, 255, 0.82);
                backdrop-filter: blur(18px);
                transition: box-shadow 180ms ease, background 180ms ease;
            }

            .header.is-scrolled {
                box-shadow: 0 1px 0 rgba(17, 17, 17, 0.08);
                background: rgba(255, 255, 255, 0.94);
            }

            .logo,
            .project {
                cursor: pointer;
            }

            .nav-links a {
                position: relative;
            }

            .nav-links a::after {
                content: "";
                position: absolute;
                left: 0;
                right: 0;
                bottom: -6px;
                height: 1px;
                background: currentColor;
                transform: scaleX(0);
                transform-origin: left;
                transition: transform 180ms ease;
            }

            .nav-links a.is-active::after,
            .nav-links a:hover::after {
                transform: scaleX(1);
            }

            .mobile-menu-toggle {
                display: none;
                width: 42px;
                height: 42px;
                border: 1px solid #111;
                border-radius: 999px;
                background: #fff;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                gap: 5px;
                cursor: pointer;
            }

            .mobile-menu-toggle span {
                width: 16px;
                height: 1.5px;
                background: #111;
                transition: transform 180ms ease;
            }

            .nav-open .mobile-menu-toggle span:first-child {
                transform: translateY(3.25px) rotate(45deg);
            }

            .nav-open .mobile-menu-toggle span:last-child {
                transform: translateY(-3.25px) rotate(-45deg);
            }

            .reveal {
                opacity: 0;
                transform: translateY(18px);
                transition: opacity 520ms ease, transform 520ms ease;
                transition-delay: var(--reveal-delay, 0ms);
            }

            .reveal.is-visible {
                opacity: 1;
                transform: translateY(0);
            }

            .project {
                transform-style: preserve-3d;
                will-change: transform;
            }

            .project.has-image-fallback::before {
                content: "";
                display: block;
                width: 100%;
                aspect-ratio: 16 / 11;
                border-radius: 16px;
                margin-bottom: 12px;
                background:
                    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.75), transparent 24%),
                    linear-gradient(135deg, #e9ecef 0%, #cfd8dc 45%, #f7f7f2 100%);
                border: 1px solid rgba(17, 17, 17, 0.08);
            }

            @media (max-width: 768px) {
                .mobile-menu-toggle {
                    display: flex;
                }

                .nav {
                    position: relative;
                    gap: 14px;
                }

                .nav-links {
                    display: flex;
                    position: absolute;
                    top: calc(100% + 16px);
                    left: 20px;
                    right: 20px;
                    flex-direction: column;
                    gap: 0;
                    padding: 12px;
                    border: 1px solid rgba(17, 17, 17, 0.1);
                    border-radius: 16px;
                    background: rgba(255, 255, 255, 0.96);
                    box-shadow: 0 16px 50px rgba(17, 17, 17, 0.12);
                    opacity: 0;
                    pointer-events: none;
                    transform: translateY(-8px);
                    transition: opacity 180ms ease, transform 180ms ease;
                }

                .nav-open .nav-links {
                    opacity: 1;
                    pointer-events: auto;
                    transform: translateY(0);
                }

                .nav-links a {
                    display: block;
                    padding: 14px 12px;
                    font-size: 16px;
                }

                .nav-links a::after {
                    display: none;
                }

                .connect-btn {
                    margin-left: auto;
                }
            }
        `;

        document.head.appendChild(style);
    }

    document.addEventListener("DOMContentLoaded", () => {
        injectInteractionStyles();
        addBaseInteractions();
        enhanceProjects();
        revealOnScroll();
        markActiveSection();
    });
}());
