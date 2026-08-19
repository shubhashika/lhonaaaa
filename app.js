document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector(".theme-toggle");

  function applyTheme(theme) {
    const isLight = theme === "light";
    document.body.dataset.theme = theme;
    localStorage.setItem("theme", theme);

    if (themeToggle) {
      themeToggle.innerHTML = isLight ? "<span aria-hidden=\"true\">☀️</span>" : "<span aria-hidden=\"true\">🌙</span>";
      themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
      themeToggle.setAttribute("title", isLight ? "Switch to dark mode" : "Switch to light mode");
    }
  }

  const storedTheme = localStorage.getItem("theme");
  const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  applyTheme(storedTheme || preferredTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = document.body.dataset.theme === "light" ? "dark" : "light";
      applyTheme(nextTheme);
    });
  }

  // Mobile nav toggle
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#primary-nav");
  const navLinks = document.querySelectorAll(".nav-list a");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Smooth scroll for nav links
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const target = link.getAttribute("href");
      if (target?.startsWith("#")) {
        const el = document.querySelector(target);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  // Advanced scroll animations with stagger
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 50);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(".section, .skill-card, .project-card, .timeline__item, .activity-list > li").forEach((el, index) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = `opacity 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 50}ms, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 50}ms`;
      observer.observe(el);
    });
  }

  // Mouse glow effect on cards
  const cards = document.querySelectorAll(".skill-card, .project-card");
  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  // Contact form with enhanced animations
  const contactForm = document.querySelector("#contact-form");
  const contactStatus = document.querySelector("#contact-status");

  if (contactForm && contactStatus) {
    const submitBtn = contactForm.querySelector(".contact-submit");
    
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.querySelector("#contact-name").value.trim();
      const email = document.querySelector("#contact-email").value.trim();
      const message = document.querySelector("#contact-message").value.trim();

      // Validation
      if (!name || !email || !message) {
        showStatus("Please fill in all fields.", "error");
        return;
      }

      if (!document.querySelector("#contact-email").validity.valid) {
        showStatus("Please enter a valid email.", "error");
        return;
      }

      if (message.length < 10) {
        showStatus("Message must be at least 10 characters.", "error");
        return;
      }

      // Disable submit and show loading state
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.6";
      submitBtn.style.pointerEvents = "none";
      
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 800));

      // Save to localStorage
      const messages = JSON.parse(localStorage.getItem("portfolioMessages") || "[]");
      messages.push({ name, email, message, date: new Date().toISOString() });
      localStorage.setItem("portfolioMessages", JSON.stringify(messages));

      // Success
      showStatus(`Thanks ${name}! Message saved. ✨`, "success");
      contactForm.reset();
      
      // Re-enable submit
      submitBtn.disabled = false;
      submitBtn.style.opacity = "1";
      submitBtn.style.pointerEvents = "auto";

      // Clear after 5 seconds
      setTimeout(() => {
        contactStatus.textContent = "";
      }, 5000);
    });

    function showStatus(text, type) {
      contactStatus.textContent = text;
      contactStatus.style.color = type === "success" ? "#00d9ff" : "#ffd60a";
      contactStatus.style.animation = "none";
      setTimeout(() => {
        contactStatus.style.animation = "slide-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
      }, 10);
    }
  }

  // Parallax effect removed - was causing about section deformation
  // Hero section animates on scroll naturally now
});