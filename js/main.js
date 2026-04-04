// AgentSocialBench - Main JavaScript
(function () {
  // ---- Theme Toggle ----
  var toggle = document.getElementById('theme-toggle');
  var html = document.documentElement;
  var saved = localStorage.getItem('asb-theme') || 'dark';
  html.dataset.theme = saved;
  updateToggleIcon(saved);

  toggle.addEventListener('click', function () {
    var next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    html.dataset.theme = next;
    localStorage.setItem('asb-theme', next);
    updateToggleIcon(next);
  });

  function updateToggleIcon(theme) {
    toggle.textContent = theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
  }

  // ---- Intersection Observer for Scroll Animations ----
  var animObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          animObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.animate-in').forEach(function (el) {
    animObserver.observe(el);
  });

  // ---- Smooth Scroll for Nav Links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---- Active Nav Highlighting on Scroll ----
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', function () {
    var current = '';
    sections.forEach(function (s) {
      if (window.scrollY >= s.offsetTop - 140) {
        current = s.id;
      }
    });
    navLinks.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });

  // ---- Animated Stat Counters ----
  var counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounters();
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  var statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    counterObserver.observe(statsSection);
  }

  function animateCounters() {
    var counters = document.querySelectorAll('.stat-num[data-target]');
    counters.forEach(function (counter) {
      var target = parseInt(counter.getAttribute('data-target'), 10);
      var duration = 1200;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(eased * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(step);
    });
  }

  // ---- Demo Tab Switching ----
  var demoTabs = document.querySelectorAll('.demo-tab');
  var demoPanels = document.querySelectorAll('.demo-panel');

  demoTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-tab');

      // Update active tab
      demoTabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');

      // Update active panel
      demoPanels.forEach(function (p) { p.classList.remove('active'); });
      var targetPanel = document.querySelector('.demo-panel[data-panel="' + target + '"]');
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // ---- BibTeX Copy Button ----
  var copyBtn = document.getElementById('copy-bibtex');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var code = document.getElementById('bibtex');
      if (code) {
        navigator.clipboard
          .writeText(code.textContent)
          .then(function () {
            copyBtn.textContent = 'Copied!';
            setTimeout(function () {
              copyBtn.textContent = 'Copy BibTeX';
            }, 2000);
          })
          .catch(function () {
            // Fallback for older browsers
            var range = document.createRange();
            range.selectNodeContents(code);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            document.execCommand('copy');
            sel.removeAllRanges();
            copyBtn.textContent = 'Copied!';
            setTimeout(function () {
              copyBtn.textContent = 'Copy BibTeX';
            }, 2000);
          });
      }
    });
  }
})();
