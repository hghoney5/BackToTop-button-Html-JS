(function () {
  const STOP_DELAY = 700;
  const TOP_TOLERANCE = 2;
  const AUTO_SCROLL_TIMEOUT = 3000;
  const BLUR_DELAY = 160;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  function init() {
    injectStyles();
    const btn = injectButton();

    let stopTimer = null;
    let ticking = false;
    let isAutoScrolling = false;
    let pointerOver = false;
    let hasFocus = false;
    let lastInteraction = null;

    const getY = () => window.scrollY || document.documentElement.scrollTop || 0;

    function evaluateScroll() {
      const y = getY();

      if (y <= TOP_TOLERANCE) {
        isAutoScrolling = false;
        clearStopTimer();
        btn.classList.remove('visible', 'faded');
        btn.classList.add('hidden-top');
        return;
      }

      btn.classList.remove('hidden-top');
      btn.classList.add('visible');

      if (pointerOver || hasFocus || isAutoScrolling) {
        clearStopTimer();
        btn.classList.remove('faded');
        return;
      }

      btn.classList.remove('faded');
      restartStopTimer();
    }

    function startFadedState() {
      if (pointerOver || hasFocus || isAutoScrolling) return;
      btn.classList.add('faded');
    }

    function restartStopTimer() {
      clearStopTimer();
      stopTimer = setTimeout(startFadedState, STOP_DELAY);
    }

    function clearStopTimer() {
      if (stopTimer) {
        clearTimeout(stopTimer);
        stopTimer = null;
      }
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          evaluateScroll();
          ticking = false;
        });
        ticking = true;
      }
    }

    function watchAutoScrollUntilTop() {
      let done = false;
      const start = Date.now();

      function check() {
        if (done) return;

        const y = getY();
        if (y <= TOP_TOLERANCE) {
          done = true;
          isAutoScrolling = false;
          evaluateScroll();
          return;
        }

        if (Date.now() - start > AUTO_SCROLL_TIMEOUT) {
          done = true;
          isAutoScrolling = false;
          if (!pointerOver && !hasFocus) restartStopTimer();
          return;
        }

        requestAnimationFrame(check);
      }

      requestAnimationFrame(check);
    }

    // Interaction detection
    window.addEventListener('pointerdown', () => (lastInteraction = 'pointer'), { passive: true });
    window.addEventListener('touchstart', () => (lastInteraction = 'pointer'), { passive: true });
    window.addEventListener('mousedown', () => (lastInteraction = 'pointer'), { passive: true });
    window.addEventListener('keydown', () => (lastInteraction = 'keyboard'), { passive: true });

    // CLICK
    btn.addEventListener('click', () => {
      if (getY() <= TOP_TOLERANCE) return;

      isAutoScrolling = true;
      clearStopTimer();
      btn.classList.add('visible');
      btn.classList.remove('faded');

      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (_) {
        window.scrollTo(0, 0);
        isAutoScrolling = false;
      }

      // Blur for pointer users only
      if (lastInteraction === 'pointer') {
        setTimeout(() => {
          try {
            if (document.activeElement === btn) btn.blur();
            if (document.activeElement && document.activeElement !== document.body) {
              document.activeElement.blur();
            }
          } catch (_) {}
          hasFocus = false;
        }, BLUR_DELAY);
      }

      watchAutoScrollUntilTop();
    });

    // Pointer / hover
    btn.addEventListener('pointerenter', () => {
      pointerOver = true;
      clearStopTimer();
      btn.classList.add('visible');
      btn.classList.remove('faded');
    });

    btn.addEventListener('pointerleave', () => {
      pointerOver = false;
      if (!isAutoScrolling && getY() > TOP_TOLERANCE) restartStopTimer();
    });

    // Touch fallback
    btn.addEventListener('touchstart', () => {
      pointerOver = true;
      clearStopTimer();
      btn.classList.add('visible');
      btn.classList.remove('faded');
    }, { passive: true });

    btn.addEventListener('touchend', () => {
      pointerOver = false;
      if (!isAutoScrolling && getY() > TOP_TOLERANCE) restartStopTimer();
    }, { passive: true });

    btn.addEventListener('touchcancel', () => {
      pointerOver = false;
      if (!isAutoScrolling && getY() > TOP_TOLERANCE) restartStopTimer();
    });

    // focus / blur
    btn.addEventListener('focus', () => {
      hasFocus = true;
      clearStopTimer();
      btn.classList.add('visible');
      btn.classList.remove('faded');
    });

    btn.addEventListener('blur', () => {
      hasFocus = false;
      if (!isAutoScrolling && getY() > TOP_TOLERANCE) restartStopTimer();
    });

    // Global listeners
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onScroll, { passive: true });
    window.addEventListener('touchmove', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    evaluateScroll();
  }

  function injectStyles() {
    const css = `
    :root{
      --bttop-size: 52px;
      --bttop-gap: 20px;
      --bttop-bg: rgba(50,50,60,0.95);
      --bttop-fg: #fff;
      --bttop-shadow: 0 6px 18px rgba(0,0,0,0.28);
      --bttop-fade-opacity: 0.4;
      --bttop-transition: 220ms cubic-bezier(.2,.9,.3,1);
      --bttop-z: 9999;
    }

    #backToTopAuto {
      position: fixed;
      right: var(--bttop-gap);
      bottom: var(--bttop-gap);
      width: var(--bttop-size);
      height: var(--bttop-size);
      border-radius: 999px;
      display: grid;
      place-items: center;
      background: var(--bttop-bg);
      color: var(--bttop-fg);
      box-shadow: var(--bttop-shadow);
      border: none;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;

      opacity: 0;
      transform: translateY(12px) scale(.96);
      pointer-events: none;
      transition:
        opacity var(--bttop-transition),
        transform var(--bttop-transition),
        background var(--bttop-transition);
      z-index: var(--bttop-z);
    }

    #backToTopAuto.visible {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    #backToTopAuto.faded {
      background: rgba(50,50,60,var(--bttop-fade-opacity));
      opacity: 0.75;
      transform: translateY(0) scale(.98);
      pointer-events: auto;
    }

    #backToTopAuto.hidden-top {
      opacity: 0 !important;
      transform: translateY(12px) scale(.96);
      pointer-events: none !important;
    }

    #backToTopAuto svg {
      width: 20px;
      height: 20px;
      transform: translateY(-1px);
    }

    #backToTopAuto:focus-visible{
      box-shadow: 0 0 0 4px rgba(120,170,255,0.22), var(--bttop-shadow);
      outline: none;
    }

    @media (max-width:420px){
      :root { --bttop-gap: 14px; --bttop-size: 48px; }
    }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function injectButton() {
    const btn = document.createElement('button');
    btn.id = 'backToTopAuto';
    btn.setAttribute('aria-label', 'Back to top');
    btn.setAttribute('title', 'Back to top');
    btn.type = 'button';

    btn.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M12 8.3l4.95 4.95 1.4-1.4L12 5.5 5.65 11.85l1.4 1.4z"/>
      </svg>`;

    document.body.appendChild(btn);
    return btn;
  }
})();