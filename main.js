/**
 * ==========================================================================
 * PORTFOLIO JAVASCRIPT APPLICATION
 * Student: Ankith naik | MCA (2026 - 2028)
 * Institution: Poornaprajna Institute of Management (PIM), Udupi
 * Pure Vanilla JavaScript (Zero Bloat, Maximum Performance & Accessibility)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Theme Management (Light Theme Default with Dark Mode Switch)
  // --------------------------------------------------------------------------
  const THEME_STORAGE_KEY = 'ankith_portfolio_theme';
  const themeToggleBtn = document.getElementById('theme-toggle');
  const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle');

  const getSavedTheme = () => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    // Respect default requirement: "Default Appearance Mode: Light Theme"
    return saved ? saved : 'light';
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    const isDark = theme === 'dark';
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', label);
      themeToggleBtn.setAttribute('title', label);
    }
    if (mobileThemeToggleBtn) {
      mobileThemeToggleBtn.setAttribute('aria-label', label);
      mobileThemeToggleBtn.setAttribute('title', label);
    }
  };

  // Initialize theme
  applyTheme(getSavedTheme());

  const handleToggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    showToast(`Switched to ${nextTheme} theme`);
  };

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', handleToggleTheme);
  }
  if (mobileThemeToggleBtn) {
    mobileThemeToggleBtn.addEventListener('click', handleToggleTheme);
  }

  // --------------------------------------------------------------------------
  // 2. Mobile Drawer Navigation
  // --------------------------------------------------------------------------
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileCloseBtn = document.getElementById('mobile-menu-close');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const openDrawer = () => {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    mobileToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    mobileToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', openDrawer);
  }
  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeDrawer);
  }
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  // Close drawer when clicking any link
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close drawer on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // --------------------------------------------------------------------------
  // 3. Active Navigation Link on Scroll
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-link');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        desktopNavLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // --------------------------------------------------------------------------
  // 4. Learning Journey & Active Explorations Filter Tabs
  // --------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const explorationCards = document.querySelectorAll('.exploration-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons
      filterButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      // Activate current button
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      explorationCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        const categoryList = categories.split(' ');

        if (filterValue === 'all' || categoryList.includes(filterValue)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 5. Toast Feedback Notification System
  // --------------------------------------------------------------------------
  let toastTimeout;
  const showToast = (message) => {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    // Clear existing
    container.innerHTML = '';
    if (toastTimeout) clearTimeout(toastTimeout);

    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6L9 17l-5-5"></path>
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3200);
  };

  // --------------------------------------------------------------------------
  // 6. Copy to Clipboard Utility
  // --------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-copy-label') || 'Copied';

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback method
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        showToast(`${label} copied to clipboard!`);
      } catch (err) {
        showToast(`Failed to copy. Please manually copy: ${textToCopy}`);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 7. Interactive Resume Modal
  // --------------------------------------------------------------------------
  const resumeModalOverlay = document.getElementById('resume-modal-overlay');
  const openResumeBtns = document.querySelectorAll('[data-action="open-resume"]');
  const closeResumeBtn = document.getElementById('close-resume-modal');
  const printResumeBtn = document.getElementById('print-resume-btn');

  const openResumeModal = () => {
    if (resumeModalOverlay) {
      resumeModalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeResumeModal = () => {
    if (resumeModalOverlay) {
      resumeModalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  openResumeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openResumeModal();
    });
  });

  if (closeResumeBtn) {
    closeResumeBtn.addEventListener('click', closeResumeModal);
  }

  if (resumeModalOverlay) {
    resumeModalOverlay.addEventListener('click', (e) => {
      if (e.target === resumeModalOverlay) {
        closeResumeModal();
      }
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModalOverlay && resumeModalOverlay.classList.contains('active')) {
      closeResumeModal();
    }
  });

  // --------------------------------------------------------------------------
  // 8. Contact Form Mailto Handler
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.');
        return;
      }

      const emailSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject || 'Contact from Developer Portfolio'}`);
      const emailBody = encodeURIComponent(
        `Hi Ankith,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n-- Sent via Portfolio Contact Form`
      );

      const mailtoUrl = `mailto:ankithanku988@gmail.com?subject=${emailSubject}&body=${emailBody}`;

      showToast('Opening your default email application...');
      window.location.href = mailtoUrl;

      // Optional reset
      contactForm.reset();
    });
  }

  // --------------------------------------------------------------------------
  // 9. Back to Top Button
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
