/* ==========================================================================
   Sumit Songara — Portfolio
   Small, optional enhancements. The site still works if this file fails.

   1. Mobile menu (hamburger)
   2. Dark / light theme toggle
   3. Navbar shadow on scroll
   4. Highlight the current section in the navbar
   5. Reveal sections when they scroll into view
   6. Contact form (sends email via FormSubmit)
   7. Footer year
   ========================================================================== */


// Tell the CSS that JavaScript is running (enables the scroll reveal effect)
document.documentElement.classList.add("js");


/* ---------- 1. Mobile menu ---------- */
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

navToggle.addEventListener("click", function () {
    navLinks.classList.toggle("is-open");
    navToggle.classList.toggle("is-open");

    const isOpen = navLinks.classList.contains("is-open");
    navToggle.setAttribute("aria-expanded", isOpen);
});

// Close the menu after tapping a link
document.querySelectorAll(".navbar__link").forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", false);
    });
});


/* ---------- 2. Dark / light theme ---------- */
// The choice is saved in localStorage so it is remembered next visit.
const themeToggle = document.getElementById("theme-toggle");

function getSavedTheme() {
    try {
        return localStorage.getItem("theme");
    } catch (error) {
        return null;
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem("theme", theme);
    } catch (error) {
        // Storage can be blocked (e.g. private mode). Nothing to do.
    }
}

const savedTheme = getSavedTheme();
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (savedTheme === "dark" || (savedTheme === null && prefersDark)) {
    document.body.classList.add("dark");
}

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    saveTheme(isDark ? "dark" : "light");
});


/* ---------- 3. Navbar shadow on scroll ---------- */
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", function () {
    if (window.scrollY > 20) {
        navbar.classList.add("navbar--scrolled");
    } else {
        navbar.classList.remove("navbar--scrolled");
    }
});


/* ---------- 4. Active navbar link ---------- */
// IntersectionObserver tells us when an element enters the screen.
const sections = document.querySelectorAll("main section[id]");
const navItems = document.querySelectorAll(".navbar__link");

const activeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            navItems.forEach(function (link) {
                const target = link.getAttribute("href").substring(1);
                link.classList.toggle("navbar__link--active", target === entry.target.id);
            });
        }
    });
}, { rootMargin: "-45% 0px -50% 0px" });   // "active" = section is in the middle of the screen

sections.forEach(function (section) {
    activeObserver.observe(section);
});


/* ---------- 5. Reveal on scroll ---------- */
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);   // animate only once
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(function (element) {
    revealObserver.observe(element);
});


/* ---------- 6. Contact form ---------- */
// Sends the form to FormSubmit's AJAX endpoint with fetch(),
// so the visitor stays on the page and sees a status message.
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const formButton = document.getElementById("form-button");

// Same address as the form's action, but the "/ajax/" version returns JSON
const formEndpoint = contactForm.action.replace("formsubmit.co/", "formsubmit.co/ajax/");

function showStatus(message, isError) {
    formStatus.textContent = message;
    formStatus.classList.toggle("form-status--error", isError);
}

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();   // stop the normal page reload

    formButton.disabled = true;
    formButton.textContent = "Sending...";
    showStatus("", false);

    fetch(formEndpoint, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(contactForm)
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.success === "true" || data.success === true) {
                showStatus("Thanks! Your message has been sent. I'll get back to you soon.", false);
                contactForm.reset();
            } else {
                showStatus(data.message || "Something went wrong. Please try again.", true);
            }
        })
        .catch(function () {
            showStatus("Couldn't send the message. Check your connection or reach me on LinkedIn.", true);
        })
        .finally(function () {
            formButton.disabled = false;
            formButton.textContent = "Send message";
        });
});


/* ---------- 7. Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
