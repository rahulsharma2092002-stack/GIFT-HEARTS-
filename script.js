/* =========================================================
   GiftHeart — script.js
   Handles: nav scroll, toast, cart, message link generator,
   copy-to-clipboard, scroll reveal, auth buttons, preview sync
   ========================================================= */

// ─── DOM REFERENCES ───────────────────────────────────────
const navbar       = document.getElementById('navbar');
const toast        = document.getElementById('toast');
const copyBtn      = document.getElementById('copyBtn');
const generateBtn  = document.getElementById('generateBtn');
const googleSignIn = document.getElementById('googleSignIn');
const appleSignIn  = document.getElementById('appleSignIn');
const emailSignIn  = document.getElementById('emailSignIn');
const hamburger    = document.getElementById('hamburger');

// Message form fields
const senderInput    = document.getElementById('senderName');
const recipientInput = document.getElementById('recipientName');
const feelingSelect  = document.getElementById('feelingSelect');
const messageInput   = document.getElementById('messageText');

// Preview elements
const previewFrom = document.getElementById('previewFrom');
const previewText = document.getElementById('previewText');
const previewSeal = document.getElementById('previewSeal');
const demoLink    = document.getElementById('demoLink');

// ─── FEELING CONFIG ───────────────────────────────────────
const feelingConfig = {
  sorry: { emoji: '🕊️', label: 'with sincerity' },
  love:  { emoji: '❤️', label: 'with love' },
  miss:  { emoji: '💛', label: 'missing you' },
};

// ─── TOAST UTILITY ───────────────────────────────────────
let toastTimeout;

function showToast(message, duration = 2500) {
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimeout = setTimeout(() => toast.classList.remove('show'), duration);
}

// ─── NAVBAR: shadow on scroll ─────────────────────────────
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ─── HAMBURGER (mobile nav) ───────────────────────────────
hamburger.addEventListener('click', () => {
  const navUl = navbar.querySelector('ul');
  const isOpen = navUl.style.display === 'flex';

  if (isOpen) {
    navUl.style.display = 'none';
  } else {
    navUl.style.cssText = `
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      background: rgba(250,250,247,0.97);
      padding: 20px 24px;
      gap: 18px;
      border-bottom: 1px solid rgba(0,0,0,0.08);
      backdrop-filter: blur(12px);
    `;
  }
});

// Close mobile nav on link click
document.querySelectorAll('nav ul a').forEach(link => {
  link.addEventListener('click', () => {
    const navUl = navbar.querySelector('ul');
    navUl.style.display = 'none';
  });
});

// ─── CART: Add to cart ────────────────────────────────────
document.querySelectorAll('.add-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const name    = btn.dataset.name;
    const feeling = btn.dataset.feeling;

    // Animate button
    const original = btn.textContent;
    btn.textContent = 'Added ✓';
    btn.style.opacity = '0.7';

    setTimeout(() => {
      btn.textContent = original;
      btn.style.opacity = '';
    }, 1200);

    showToast(`"${name}" added to your bag 🛍️`);
  });
});

// ─── LIVE MESSAGE PREVIEW ────────────────────────────────
function updatePreview() {
  const sender    = senderInput.value.trim() || 'Aditya';
  const recipient = recipientInput.value.trim() || 'Priya';
  const feeling   = feelingSelect.value;
  const config    = feelingConfig[feeling] || feelingConfig.love;
  const message   = messageInput.value.trim() ||
    'Every time you open this, know that somewhere, I am thinking of you and smiling.';

  previewFrom.textContent = `From ${sender}, ${config.label}`;
  previewText.textContent = `"${message}"`;
  previewSeal.textContent = config.emoji;

  // Update link slug
  const slug = `${toSlug(sender)}-to-${toSlug(recipient)}-${randomCode()}`;
  demoLink.textContent = `giftheart.in/m/${slug}`;
}

function toSlug(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 20) || 'user';
}

function randomCode() {
  return Math.random().toString(36).slice(2, 6);
}

// Attach live preview listeners
[senderInput, recipientInput, feelingSelect, messageInput].forEach(el => {
  el.addEventListener('input', updatePreview);
});

// ─── GENERATE LINK ────────────────────────────────────────
generateBtn.addEventListener('click', () => {
  const sender    = senderInput.value.trim();
  const recipient = recipientInput.value.trim();
  const message   = messageInput.value.trim();

  if (!sender || !recipient || !message) {
    showToast('Please fill in all fields ✏️');
    return;
  }

  updatePreview();
  showToast('Your personal link is ready! 🔗 Copy it below.');

  // Scroll to preview card
  document.getElementById('message').scrollIntoView({ behavior: 'smooth' });
});

// ─── COPY LINK ────────────────────────────────────────────
copyBtn.addEventListener('click', () => {
  const url = demoLink.textContent;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(url)
      .then(() => showToast('Link copied to clipboard! 📋'))
      .catch(() => fallbackCopy(url));
  } else {
    fallbackCopy(url);
  }
});

function fallbackCopy(text) {
  const el = document.createElement('textarea');
  el.value = text;
  el.style.position = 'fixed';
  el.style.opacity  = '0';
  document.body.appendChild(el);
  el.focus();
  el.select();
  try {
    document.execCommand('copy');
    showToast('Link copied! 📋');
  } catch {
    showToast('Copy failed — please copy manually.');
  }
  document.body.removeChild(el);
}

// ─── GOOGLE SIGN IN ───────────────────────────────────────
googleSignIn.addEventListener('click', () => {
  // In production: integrate Google OAuth / Firebase Auth
  showToast('Redirecting to Google Sign-In... 🔐');
  setTimeout(() => {
    console.log('[Auth] Google Sign-In initiated');
    // window.location.href = '/auth/google';
  }, 800);
});

// ─── APPLE SIGN IN ────────────────────────────────────────
appleSignIn.addEventListener('click', () => {
  // In production: integrate Apple Sign-In / Firebase Auth
  showToast('Redirecting to Apple Sign-In... 🍎');
  setTimeout(() => {
    console.log('[Auth] Apple Sign-In initiated');
    // window.location.href = '/auth/apple';
  }, 800);
});

// ─── EMAIL SIGN IN ────────────────────────────────────────
emailSignIn.addEventListener('click', () => {
  const email = document.getElementById('emailInput').value.trim();

  if (!email || !isValidEmail(email)) {
    showToast('Please enter a valid email address 📧');
    return;
  }

  showToast(`Magic link sent to ${email} ✉️`);
  console.log('[Auth] Email sign-in:', email);
  // In production: POST to /auth/email
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── SCROLL REVEAL ────────────────────────────────────────
function initScrollReveal() {
  // Mark elements for reveal
  const targets = document.querySelectorAll(
    '.product-card, .payment-card, .message-card, .auth-card, .feeling-visual, .split-content'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  targets.forEach(el => observer.observe(el));
}

// ─── SMOOTH ANCHOR SCROLL ─────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── PERSONALISED MESSAGE ON LOAD ─────────────────────────
// Simulates what happens when a recipient opens a shared link
// e.g. giftheart.in/m/aditya-to-priya-4x8k?msg=...
function checkPersonalisedLink() {
  const params = new URLSearchParams(window.location.search);
  const msgId  = params.get('msg') || params.get('m');

  if (msgId) {
    // In production: fetch message from backend using msgId
    // For demo: show a welcome overlay
    showPersonalMessage({
      from:    params.get('from') || 'Someone special',
      to:      params.get('to')   || 'You',
      feeling: params.get('feel') || 'love',
      text:    params.get('text') || 'You are thought of, always.',
    });
  }
}

function showPersonalMessage({ from, to, feeling, text }) {
  const config  = feelingConfig[feeling] || feelingConfig.love;
  const overlay = document.createElement('div');

  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(10,10,10,0.92);
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    animation: fadeOverlay 0.6s ease forwards;
  `;

  overlay.innerHTML = `
    <div style="
      background: #fff;
      border-radius: 8px;
      padding: 56px 48px;
      max-width: 480px;
      width: 100%;
      text-align: center;
      position: relative;
    ">
      <div style="font-size: 48px; margin-bottom: 20px;">${config.emoji}</div>
      <p style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #C9A84C; margin-bottom: 12px;">
        For ${to}
      </p>
      <p style="
        font-family: 'Cormorant Garamond', serif;
        font-size: 26px;
        font-style: italic;
        font-weight: 300;
        color: #1a1a1a;
        line-height: 1.55;
        margin-bottom: 24px;
      ">"${text}"</p>
      <p style="font-size: 13px; color: #888; margin-bottom: 32px;">— ${from}, ${config.label}</p>
      <button id="closeOverlay" style="
        padding: 12px 32px;
        background: #1a1a1a;
        color: #fff;
        border: none;
        border-radius: 3px;
        font-size: 12px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        cursor: pointer;
        font-family: 'Jost', sans-serif;
      ">Open GiftHeart →</button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  document.getElementById('closeOverlay').addEventListener('click', () => {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.4s';
    setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = '';
    }, 400);
  });
}

// ─── INIT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  updatePreview();       // Populate preview with defaults
  checkPersonalisedLink(); // Check for shared message link
});
