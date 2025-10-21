// main.js | Sure Heaven Ministries
// Lightweight client-side behavior: welcome banner, smooth scroll, simple contact handling.
// Drop this file into your project and include it from your HTML.

"use strict";

console.log("Welcome to Sure Heaven Ministries Website");

(function () {
    // Utilities
    const qs = (s, ctx = document) => ctx.querySelector(s);
    const qsa = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
    const isValidEmail = (e) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e).trim());

    // Create or update a simple welcome banner
    function createOrUpdateBanner() {
        let banner = qs("#shm-welcome");
        const now = new Date();
        const hour = now.getHours();
        const day = now.toLocaleDateString(undefined, { weekday: "long" });
        const time = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

        const greeting =
            hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

        if (!banner) {
            banner = document.createElement("div");
            banner.id = "shm-welcome";
            banner.setAttribute("role", "status");
            banner.style.cssText =
                "background:#f5f7fa;color:#0b3d91;padding:12px 16px;border-radius:6px;margin:12px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;";
            document.body.prepend(banner);
        }

        banner.textContent = `${greeting} — Welcome to Sure Heaven Ministries. Today is ${day}, ${time}.`;
    }

    // Smooth scroll for internal anchor links (including '#' -> top)
    function initSmoothScroll() {
        qsa('a[href^="#"]').forEach((a) => {
            a.addEventListener("click", (e) => {
                const href = a.getAttribute("href") || "";
                const id = href.slice(1);
                if (id === "") {
                    // href="#" => scroll to top
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    return;
                }
                const target = document.getElementById(id);
                if (target) {
                    e.preventDefault();
                    // If target doesn't already have tabindex, add temporarily so focus() works
                    const addedTabindex = !target.hasAttribute("tabindex");
                    if (addedTabindex) target.setAttribute("tabindex", "-1");
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                    target.focus({ preventScroll: true });
                    // remove temporary tabindex shortly after focus
                    if (addedTabindex) {
                        setTimeout(() => {
                            // only remove if it is the temporary value we set
                            if (target.getAttribute("tabindex") === "-1") {
                                target.removeAttribute("tabindex");
                            }
                        }, 1000);
                    }
                }
            });
        });
    }

    // Simple contact form handling: expects form#contact with inputs name,email,message and a .status element
    function initContactForm() {
        const form = qs("form#contact");
        if (!form) return;

        let statusEl = form.querySelector(".status");
        if (!statusEl) {
            statusEl = document.createElement("div");
            statusEl.className = "status";
            statusEl.style.marginTop = "8px";
            form.appendChild(statusEl);
        }

        form.addEventListener("submit", async (ev) => {
            ev.preventDefault();
            statusEl.textContent = "";
            const nameEl = form.elements["name"];
            const emailEl = form.elements["email"];
            const messageEl = form.elements["message"];
            const data = {
                name: nameEl ? String(nameEl.value || "") : "",
                email: emailEl ? String(emailEl.value || "") : "",
                message: messageEl ? String(messageEl.value || "") : "",
            };

            if (!data.name.trim()) {
                statusEl.textContent = "Please enter your name.";
                if (nameEl) nameEl.focus();
                return;
            }
            if (!isValidEmail(data.email)) {
                statusEl.textContent = "Please enter a valid email address.";
                if (emailEl) emailEl.focus();
                return;
            }
            if (!data.message.trim()) {
                statusEl.textContent = "Please enter a message.";
                if (messageEl) messageEl.focus();
                return;
            }

            statusEl.textContent = "Sending…";
            try {
                // Replace this endpoint with your real backend route.
                const res = await fetch("/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                if (!res.ok) throw new Error("Network response was not ok");
                statusEl.textContent = "Message sent. Thank you!";
                form.reset();
            } catch (err) {
                console.error("Contact submit error:", err);
                statusEl.textContent = "Unable to send message. Please try again later.";
            }
        });
    }

    // Initialize on DOM ready
    document.addEventListener("DOMContentLoaded", () => {
        createOrUpdateBanner();
        initSmoothScroll();
        initContactForm();

        // Keep welcome time reasonably fresh (update every 60s)
        setInterval(createOrUpdateBanner, 60 * 1000);
    });
})();