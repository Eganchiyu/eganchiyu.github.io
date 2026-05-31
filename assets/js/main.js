/**
 * Eganchiyu's Blog - 主交互逻辑
 * 功能：主题切换、移动端菜单、导航栏滚动效果、代码块复制
 */

(function() {
  'use strict';

  // ========== 主题切换 ==========
  const ThemeManager = {
    STORAGE_KEY: 'theme',
    DARK: 'dark',
    LIGHT: 'light',

    init() {
      this.toggle = document.getElementById('themeToggle');
      if (!this.toggle) return;

      const saved = localStorage.getItem(this.STORAGE_KEY);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = saved || (prefersDark ? this.DARK : this.LIGHT);
      this.apply(theme);

      this.toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === this.DARK ? this.LIGHT : this.DARK;
        this.apply(next);
        localStorage.setItem(this.STORAGE_KEY, next);
        if (next === this.DARK) {
          AchievementManager.unlock('dark_mode');
        }
      });
    },

    apply(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.content = theme === this.DARK ? '#0f172a' : '#f0f8ff';
      }
      this.updateGiscusTheme(theme);
      this.updatePlaygroundTheme(theme);
      this.applySeasonalTheme();
    },

    applySeasonalTheme() {
      const season = this.getSeason();
      const root = document.documentElement;

      const seasonalColors = {
        spring: { accent: '#f9a8d4', hover: '#f472b6' },
        summer: { accent: '#5eead4', hover: '#2dd4bf' },
        autumn: { accent: '#fdba74', hover: '#fb923c' },
        winter: { accent: '#c4b5fd', hover: '#a78bfa' }
      };

      const colors = seasonalColors[season];
      if (colors) {
        root.style.setProperty('--season-accent', colors.accent);
        root.style.setProperty('--season-hover', colors.hover);
      }
    },

    getSeason() {
      const month = new Date().getMonth() + 1;
      if (month >= 3 && month <= 5) return 'spring';
      if (month >= 6 && month <= 8) return 'summer';
      if (month >= 9 && month <= 11) return 'autumn';
      return 'winter';
    },

    updateGiscusTheme(theme) {
      const giscusTheme = theme === this.DARK ? 'dark' : 'light';
      const iframe = document.querySelector('iframe.giscus-frame');
      if (iframe) {
        iframe.contentWindow.postMessage({
          giscus: {
            setConfig: {
              theme: giscusTheme
            }
          }
        }, 'https://giscus.app');
      }
    },

    updatePlaygroundTheme(theme) {
      if (typeof PlaygroundManager !== 'undefined' && PlaygroundManager.monacoLoaded) {
        PlaygroundManager.updateTheme();
      }
    }
  };

  // ========== 移动端菜单 ==========
  const MobileMenu = {
    init() {
      this.toggle = document.getElementById('menuToggle');
      this.menu = document.getElementById('mobileMenu');
      this.overlay = document.getElementById('mobileOverlay');
      if (!this.toggle || !this.menu) return;

      this.toggle.addEventListener('click', () => {
        this.toggleMenu();
      });

      if (this.overlay) {
        this.overlay.addEventListener('click', () => {
          this.closeMenu();
        });
      }

      this.menu.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
          this.closeMenu();
        });
      });

      document.addEventListener('click', (e) => {
        if (!this.toggle.contains(e.target) && !this.menu.contains(e.target)) {
          this.closeMenu();
        }
      });
    },

    toggleMenu() {
      const isActive = this.menu.classList.contains('active');
      if (isActive) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    },

    openMenu() {
      this.menu.classList.add('active');
      if (this.overlay) this.overlay.classList.add('active');
      this.toggle.textContent = '✕';
    },

    closeMenu() {
      this.menu.classList.remove('active');
      if (this.overlay) this.overlay.classList.remove('active');
      this.toggle.textContent = '☰';
    }
  };

  // ========== 导航栏滚动效果 ==========
  const NavbarScroll = {
    init() {
      this.navbar = document.querySelector('.navbar');
      if (!this.navbar) return;

      let lastScroll = 0;
      let ticking = false;

      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
              this.navbar.style.boxShadow = 'var(--shadow-soft)';
            } else {
              this.navbar.style.boxShadow = 'none';
            }
            
            lastScroll = currentScroll;
            ticking = false;
          });
          ticking = true;
        }
      });
    }
  };

  // ========== 平滑滚动 ==========
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const targetId = anchor.getAttribute('href');
          if (targetId === '#') return;
          
          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
    }
  };

  // ========== 代码块功能 ==========
  const CodeBlockManager = {
    SVG_COPY: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>',
    SVG_CHECK: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',

    init() {
      this.processCodeBlocks();
    },

    processCodeBlocks() {
      document.querySelectorAll('pre.highlight, .highlight').forEach(block => {
        if (block.closest('.code-block-wrapper')) return;
        this.wrapCodeBlock(block);
      });
    },

    wrapCodeBlock(block) {
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';

      const lang = this.detectLanguage(block);
      const header = this.createHeader(lang);
      const copyBtn = this.createCopyButton();

      block.parentNode.insertBefore(wrapper, block);
      wrapper.appendChild(header);
      wrapper.appendChild(block);
      header.appendChild(copyBtn);

      copyBtn.addEventListener('click', () => this.copyCode(block, copyBtn));
    },

    detectLanguage(block) {
      const classes = block.className + ' ' + (block.querySelector('code')?.className || '');
      const langMatch = classes.match(/(?:language-|highlight-|lang-)(\w+)/);
      return langMatch ? langMatch[1] : 'code';
    },

    createHeader(lang) {
      const header = document.createElement('div');
      header.className = 'code-block-header';

      const dots = document.createElement('div');
      dots.className = 'code-block-dots';
      dots.innerHTML = '<span class="code-block-dot"></span><span class="code-block-dot"></span><span class="code-block-dot"></span>';

      const langLabel = document.createElement('span');
      langLabel.className = 'code-block-lang';
      langLabel.textContent = lang;

      header.appendChild(dots);
      header.appendChild(langLabel);
      return header;
    },

    createCopyButton() {
      const btn = document.createElement('button');
      btn.className = 'code-copy-btn';
      btn.setAttribute('aria-label', '复制代码');
      btn.innerHTML = `${this.SVG_COPY}<span class="copy-text btn-label">复制</span><span class="success-text">已复制!</span>`;
      return btn;
    },

    async copyCode(block, btn) {
      const code = block.querySelector('code') || block;
      const text = code.textContent;

      try {
        await navigator.clipboard.writeText(text);
        this.showSuccess(btn);
      } catch (err) {
        this.fallbackCopy(text, btn);
      }
    },

    fallbackCopy(text, btn) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0';
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        document.execCommand('copy');
        this.showSuccess(btn);
      } catch (err) {
        console.error('复制失败:', err);
      }
      
      document.body.removeChild(textarea);
    },

    showSuccess(btn) {
      btn.classList.add('copied');
      btn.innerHTML = `<span class="success-text">已复制!</span>`;
      AchievementManager.incrementStat('codeCopies');

      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = `${this.SVG_COPY}<span class="copy-text btn-label">复制</span>`;
      }, 2000);
    }
  };

  // ========== 返回顶部 ==========
  const BackToTop = {
    init() {
      this.btn = document.getElementById('backToTop');
      if (!this.btn) return;

      this.ticking = false;

      window.addEventListener('scroll', () => {
        if (!this.ticking) {
          window.requestAnimationFrame(() => {
            if (window.pageYOffset > 300) {
              this.btn.classList.add('visible');
            } else {
              this.btn.classList.remove('visible');
            }
            this.ticking = false;
          });
          this.ticking = true;
        }
      });

      this.btn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  };

  // ========== 阅读进度条 ==========
  const ReadingProgress = {
    init() {
      this.progressBar = document.getElementById('readingProgress');
      if (!this.progressBar) return;

      this.ticking = false;
      this.hasCelebrated = false;

      window.addEventListener('scroll', () => {
        if (!this.ticking) {
          window.requestAnimationFrame(() => {
            this.updateProgress();
            this.ticking = false;
          });
          this.ticking = true;
        }
      });
    },

    updateProgress() {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      this.progressBar.style.width = `${Math.min(progress, 100)}%`;

      if (progress >= 100 && !this.hasCelebrated) {
        this.hasCelebrated = true;
        this.celebrateCompletion();
      }
    },

    celebrateCompletion() {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        ToastManager.success('🎉 恭喜你读完了这篇文章！');
        return;
      }

      const pageTitle = document.querySelector('.post-title')?.textContent?.trim();
      if (pageTitle) {
        const readPosts = JSON.parse(localStorage.getItem('read_posts') || '[]');
        if (!readPosts.includes(pageTitle)) {
          readPosts.push(pageTitle);
          localStorage.setItem('read_posts', JSON.stringify(readPosts));
        }
      }

      this.showConfetti();
      ToastManager.success('🎉 恭喜你读完了这篇文章！');
      AchievementManager.unlock('read_complete');
    },

    showConfetti() {
      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
      document.body.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const confetti = [];
      const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#fee140'];

      for (let i = 0; i < 100; i++) {
        confetti.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          w: Math.random() * 10 + 5,
          h: Math.random() * 6 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: Math.random() * 3 + 2,
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.2,
          drift: (Math.random() - 0.5) * 2
        });
      }

      let frame = 0;
      const maxFrames = 180;

      function animate() {
        frame++;
        if (frame > maxFrames) {
          canvas.remove();
          return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confetti.forEach(c => {
          c.y += c.speed;
          c.x += c.drift;
          c.angle += c.spin;

          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate(c.angle);
          ctx.fillStyle = c.color;
          ctx.globalAlpha = 1 - (frame / maxFrames);
          ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
          ctx.restore();
        });

        requestAnimationFrame(animate);
      }

      animate();
    }
  };

  // ========== 文章目录 (TOC) ==========
  const TOCManager = {
    init() {
      this.postContent = document.querySelector('.post-content');
      if (!this.postContent) return;

      this.tocNav = document.getElementById('tocNav');
      this.tocMobileNav = document.getElementById('tocMobileNav');
      this.tocMobileToggle = document.getElementById('tocMobileToggle');

      if (!this.tocNav && !this.tocMobileNav) return;

      this.headings = this.postContent.querySelectorAll('h2, h3, h4');
      if (this.headings.length === 0) {
        const sidebar = document.getElementById('tocSidebar');
        const mobile = document.getElementById('tocMobile');
        if (sidebar) sidebar.style.display = 'none';
        if (mobile) mobile.style.display = 'none';
        return;
      }

      this.buildTOC();
      this.setupIntersectionObserver();
      this.setupMobileToggle();
    },

    buildTOC() {
      const fragment = document.createDocumentFragment();

      this.headings.forEach((heading, index) => {
        if (!heading.id) {
          heading.id = `heading-${index}`;
        }

        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.className = `toc-link toc-${heading.tagName.toLowerCase()}`;
        link.textContent = heading.textContent;
        link.dataset.target = heading.id;

        link.addEventListener('click', (e) => {
          e.preventDefault();
          heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        fragment.appendChild(link.cloneNode(true));

        if (this.tocMobileNav) {
          const mobileLink = link.cloneNode(true);
          mobileLink.addEventListener('click', (e) => {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
            this.tocMobileNav.classList.remove('active');
            this.tocMobileToggle.classList.remove('active');
          });
          this.tocMobileNav.appendChild(mobileLink);
        }
      });

      if (this.tocNav) {
        this.tocNav.appendChild(fragment);
      }
    },

    setupIntersectionObserver() {
      const options = {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const id = entry.target.id;
          const links = document.querySelectorAll(`.toc-link[data-target="${id}"]`);

          if (entry.isIntersecting) {
            document.querySelectorAll('.toc-link.active').forEach(l => l.classList.remove('active'));
            links.forEach(l => l.classList.add('active'));
          }
        });
      }, options);

      this.headings.forEach(heading => observer.observe(heading));
    },

    setupMobileToggle() {
      if (!this.tocMobileToggle || !this.tocMobileNav) return;

      this.tocMobileToggle.addEventListener('click', () => {
        this.tocMobileToggle.classList.toggle('active');
        this.tocMobileNav.classList.toggle('active');
      });
    }
  };

  // ========== 搜索功能 ==========
  const SearchManager = {
    searchData: null,

    init() {
      this.searchToggle = document.getElementById('searchToggle');
      this.searchModal = document.getElementById('searchModal');
      this.searchOverlay = document.getElementById('searchOverlay');
      this.searchInput = document.getElementById('searchInput');
      this.searchClose = document.getElementById('searchClose');
      this.searchResults = document.getElementById('searchResults');

      if (!this.searchToggle || !this.searchModal) return;

      this.loadSearchData();
      this.bindEvents();
    },

    async loadSearchData() {
      try {
        const response = await fetch('/search.json');
        this.searchData = await response.json();
      } catch (err) {
        console.error('加载搜索数据失败:', err);
      }
    },

    bindEvents() {
      this.searchToggle.addEventListener('click', () => this.openSearch());
      this.searchClose.addEventListener('click', () => this.closeSearch());
      this.searchOverlay.addEventListener('click', () => this.closeSearch());

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.searchModal.classList.contains('active')) {
          this.closeSearch();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          this.openSearch();
        }
      });

      let debounceTimer;
      this.searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.performSearch(e.target.value);
        }, 300);
      });
    },

    openSearch() {
      this.searchModal.classList.add('active');
      this.searchInput.focus();
      document.body.style.overflow = 'hidden';
    },

    closeSearch() {
      this.searchModal.classList.remove('active');
      this.searchInput.value = '';
      this.searchResults.innerHTML = '<div class="search-hint">输入关键词开始搜索</div>';
      document.body.style.overflow = '';
    },

    performSearch(query) {
      if (!query.trim()) {
        this.searchResults.innerHTML = '<div class="search-hint">输入关键词开始搜索</div>';
        return;
      }

      if (!this.searchData) {
        this.searchResults.innerHTML = '<div class="search-hint">搜索数据加载中...</div>';
        return;
      }

      AchievementManager.unlock('search');

      const lowerQuery = query.toLowerCase();
      const results = this.searchData.filter(post => {
        return post.title.toLowerCase().includes(lowerQuery) ||
               post.excerpt.toLowerCase().includes(lowerQuery) ||
               post.categories.some(cat => cat.toLowerCase().includes(lowerQuery)) ||
               post.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
      });

      this.displayResults(results, query);
    },

    displayResults(results, query) {
      if (results.length === 0) {
        this.searchResults.innerHTML = '<div class="search-no-results">未找到相关文章</div>';
        return;
      }

      const html = results.map(post => `
        <a href="${post.url}" class="search-result-item">
          <div class="search-result-title">${this.highlightText(post.title, query)}</div>
          <div class="search-result-excerpt">${this.highlightText(post.excerpt, query)}</div>
          <div class="search-result-meta">
            <span>${post.date}</span>
            ${post.categories.length > 0 ? `<span>${post.categories[0]}</span>` : ''}
          </div>
        </a>
      `).join('');

      this.searchResults.innerHTML = html;
    },

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },

    highlightText(text, query) {
      const escaped = this.escapeHtml(text);
      if (!query.trim()) return escaped;
      const escapedQuery = this.escapeHtml(query);
      const regex = new RegExp(`(${escapedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return escaped.replace(regex, '<mark>$1</mark>');
    }
  };

  // ========== 图片灯箱（缩略图 + 按需加载原图） ==========
  const LightboxManager = {
    init() {
      this.createOverlay();
      this.prepareThumbs();
      this.bindEvents();
    },

    createOverlay() {
      this.overlay = document.createElement('div');
      this.overlay.className = 'lightbox-overlay';
      this.overlay.innerHTML = `
        <button class="lightbox-close" aria-label="关闭">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
        <div class="lightbox-spinner"></div>
        <img class="lightbox-image" src="" alt="">
      `;
      document.body.appendChild(this.overlay);

      this.lightboxImage = this.overlay.querySelector('.lightbox-image');
      this.lightboxClose = this.overlay.querySelector('.lightbox-close');
      this.lightboxSpinner = this.overlay.querySelector('.lightbox-spinner');
    },

    prepareThumbs() {
      document.querySelectorAll('.post-content img').forEach(img => {
        const src = img.getAttribute('src') || img.src;
        if (src && !src.includes('/thumbs/')) {
          const thumbSrc = src.replace(/\/([^\/]+)$/, '/thumbs/$1').replace(/\.\w+$/, '.jpg');
          img.dataset.original = src;
          img.dataset.thumb = thumbSrc;

          const thumbImg = new Image();
          thumbImg.onload = () => {
            img.src = thumbSrc;
          };
          thumbImg.onerror = () => {
            img.dataset.thumb = src;
          };
          thumbImg.src = thumbSrc;
        }
      });
    },

    bindEvents() {
      document.querySelectorAll('.post-content img').forEach(img => {
        img.addEventListener('click', () => {
          const original = img.dataset.original || img.src;
          this.open(original, img.alt, img.dataset.thumb);
        });
      });

      this.lightboxClose.addEventListener('click', () => this.close());
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay || e.target === this.lightboxSpinner) this.close();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
          this.close();
        }
      });
    },

    open(src, alt, thumbSrc) {
      this.overlay.classList.add('active');
      this.lightboxSpinner.classList.add('active');
      this.lightboxImage.classList.remove('loaded');
      this.lightboxImage.src = '';
      this.lightboxImage.alt = alt || '';
      document.body.style.overflow = 'hidden';

      const fullImg = new Image();
      fullImg.onload = () => {
        this.lightboxImage.src = src;
        this.lightboxImage.alt = alt || '';
        this.lightboxImage.classList.add('loaded');
        this.lightboxSpinner.classList.remove('active');
      };
      fullImg.onerror = () => {
        this.lightboxSpinner.classList.remove('active');
        this.lightboxImage.src = thumbSrc || src;
        this.lightboxImage.alt = alt || '';
        this.lightboxImage.classList.add('loaded');
      };
      fullImg.src = src;
    },

    close() {
      this.overlay.classList.remove('active');
      this.lightboxImage.classList.remove('loaded');
      this.lightboxSpinner.classList.remove('active');
      this.lightboxImage.src = '';
      document.body.style.overflow = '';
    }
  };

  // ========== 涟漪效果 ==========
  const RippleManager = {
    init() {
      this.bindRippleEvents();
    },

    bindRippleEvents() {
      document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-ripple]');
        if (target) {
          this.createRipple(e, target);
        }
      });
    },

    createRipple(event, element) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      element.appendChild(ripple);

      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      setTimeout(() => ripple.remove(), 600);
    }
  };

  // ========== 滚动显示动画 ==========
  const ScrollReveal = {
    init() {
      this.elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger');
      if (this.elements.length === 0) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            this.observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      this.elements.forEach(el => this.observer.observe(el));
    }
  };

  // ========== Toast 通知 ==========
  const ToastManager = {
    container: null,

    init() {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    },

    show(message, type = 'info', duration = 3000) {
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.textContent = message;
      this.container.appendChild(toast);

      requestAnimationFrame(() => {
        toast.classList.add('show');
      });

      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, duration);
    },

    success(message, duration) { this.show(message, 'success', duration); },
    error(message, duration) { this.show(message, 'error', duration); },
    info(message, duration) { this.show(message, 'info', duration); }
  };

  // ========== 评论系统管理器 ==========
  const CommentManager = {
    init() {
      this.setupCommentGuide();
    },

    setupCommentGuide() {
      const commentsSection = document.querySelector('.comments-section');
      if (!commentsSection) return;

      const guideDismissed = localStorage.getItem('comment_guide_dismissed');
      if (guideDismissed) return;

      const guide = document.createElement('div');
      guide.className = 'comment-guide';
      guide.innerHTML = `
        <div class="comment-guide-icon">💬</div>
        <div class="comment-guide-content">
          <div class="comment-guide-title">欢迎参与讨论！</div>
          <div class="comment-guide-text">登录 GitHub 账号即可评论，分享你的想法和建议</div>
        </div>
        <button class="comment-guide-close" aria-label="关闭引导">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
      `;

      const giscusContainer = commentsSection.querySelector('.giscus-comments');
      if (giscusContainer) {
        commentsSection.insertBefore(guide, giscusContainer);
      } else {
        commentsSection.appendChild(guide);
      }

      const closeBtn = guide.querySelector('.comment-guide-close');
      closeBtn.addEventListener('click', () => {
        guide.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
          guide.remove();
          localStorage.setItem('comment_guide_dismissed', 'true');
        }, 300);
      });
    }
  };

  // ========== 分享管理器 ==========
  const ShareManager = {
    init() {
      this.bindEvents();
    },

    bindEvents() {
      document.querySelectorAll('[data-share]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const type = btn.dataset.share;
          this.handleShare(type);
        });
      });

      const panel = document.getElementById('sharePanel');
      if (panel) {
        const closeBtn = panel.querySelector('.share-panel-close');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => this.closeSharePanel());
        }
        panel.addEventListener('click', (e) => {
          if (e.target === panel) this.closeSharePanel();
        });
      }
    },

    handleShare(type) {
      const url = window.location.href;
      const title = document.title;

      switch (type) {
        case 'wechat':
          this.shareToWechat(url);
          break;
        case 'copy':
          this.copyLink(url);
          break;
        case 'native':
          this.nativeShare(url, title);
          break;
      }

      this.trackShare(type);
    },

    shareToWechat(url) {
      const panel = document.getElementById('sharePanel');
      const canvas = document.getElementById('qrcodeCanvas');
      if (!panel || !canvas) return;

      this.generateQRCode(canvas, url);
      panel.classList.add('active');
    },

    generateQRCode(canvas, url) {
      const ctx = canvas.getContext('2d');
      const size = canvas.width;
      ctx.clearRect(0, 0, size, size);

      const moduleCount = 25;
      const cellSize = size / moduleCount;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      const pattern = this.createQRPattern(url);
      ctx.fillStyle = '#000000';

      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (pattern[row][col]) {
            ctx.fillRect(
              col * cellSize,
              row * cellSize,
              cellSize,
              cellSize
            );
          }
        }
      }
    },

    createQRPattern(url) {
      const size = 25;
      const pattern = Array.from({ length: size }, () => Array(size).fill(false));

      for (let i = 0; i < 7; i++) {
        pattern[i][0] = true;
        pattern[i][6] = true;
        pattern[0][i] = true;
        pattern[6][i] = true;
      }
      for (let i = 2; i < 5; i++) {
        for (let j = 2; j < 5; j++) {
          pattern[i][j] = true;
        }
      }

      for (let i = 0; i < 7; i++) {
        pattern[i][size - 7] = true;
        pattern[i][size - 1] = true;
        pattern[0][size - 7 + i] = true;
        pattern[6][size - 7 + i] = true;
      }
      for (let i = 2; i < 5; i++) {
        for (let j = size - 5; j < size - 2; j++) {
          pattern[i][j] = true;
        }
      }

      for (let i = size - 7; i < size; i++) {
        pattern[i][0] = true;
        pattern[i][6] = true;
        pattern[size - 7][i - (size - 7)] = true;
        pattern[size - 1][i - (size - 7)] = true;
      }
      for (let i = size - 5; i < size - 2; i++) {
        for (let j = 2; j < 5; j++) {
          pattern[i][j] = true;
        }
      }

      let hash = 0;
      for (let i = 0; i < url.length; i++) {
        hash = ((hash << 5) - hash) + url.charCodeAt(i);
        hash |= 0;
      }

      for (let row = 8; row < size - 8; row++) {
        for (let col = 8; col < size - 8; col++) {
          if (!pattern[row][col]) {
            pattern[row][col] = ((hash + row * size + col) % 3) === 0;
          }
        }
      }

      return pattern;
    },

    closeSharePanel() {
      const panel = document.getElementById('sharePanel');
      if (panel) {
        panel.classList.remove('active');
      }
    },

    async copyLink(url) {
      try {
        await navigator.clipboard.writeText(url);
        ToastManager.success('链接已复制到剪贴板');
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        ToastManager.success('链接已复制到剪贴板');
      }
    },

    async nativeShare(url, title) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: title,
            url: url
          });
        } catch (err) {
          if (err.name !== 'AbortError') {
            this.copyLink(url);
          }
        }
      } else {
        this.copyLink(url);
      }
    },

    trackShare(type) {
      const stats = JSON.parse(localStorage.getItem('share_stats') || '{}');
      stats[type] = (stats[type] || 0) + 1;
      stats.total = (stats.total || 0) + 1;
      localStorage.setItem('share_stats', JSON.stringify(stats));
      AchievementManager.incrementStat('shares');
      AchievementManager.unlock('first_share');
    }
  };

  // ========== 点赞管理器 ==========
  const LikeManager = {
    init() {
      this.button = document.getElementById('likeButton');
      this.countEl = document.getElementById('likeCount');
      this.canvas = document.getElementById('likeCanvas');

      if (!this.button) return;

      this.postId = this.button.dataset.postId;
      this.loadLikeState();
      this.bindEvents();
    },

    loadLikeState() {
      const likes = JSON.parse(localStorage.getItem('post_likes') || '{}');
      const data = likes[this.postId] || { count: 0, liked: false };

      this.count = data.count;
      this.liked = data.liked;

      this.updateUI();
    },

    saveLikeState() {
      const likes = JSON.parse(localStorage.getItem('post_likes') || '{}');
      likes[this.postId] = {
        count: this.count,
        liked: this.liked
      };
      localStorage.setItem('post_likes', JSON.stringify(likes));
    },

    bindEvents() {
      this.button.addEventListener('click', () => this.toggleLike());
    },

    toggleLike() {
      if (this.liked) {
        this.count--;
        this.liked = false;
      } else {
        this.count++;
        this.liked = true;
        this.createParticles();
      }

      this.saveLikeState();
      this.updateUI();
      this.animateCount();
    },

    updateUI() {
      this.countEl.textContent = this.count;
      if (this.liked) {
        this.button.classList.add('liked');
      } else {
        this.button.classList.remove('liked');
      }
    },

    animateCount() {
      this.countEl.classList.remove('like-count-animate');
      void this.countEl.offsetWidth;
      this.countEl.classList.add('like-count-animate');
    },

    createParticles() {
      if (!this.canvas) return;

      const ctx = this.canvas.getContext('2d');
      const particles = [];
      const colors = ['#e74c3c', '#ff6b6b', '#ff8e8e', '#ffb3b3', '#ffd8d8'];

      for (let i = 0; i < 20; i++) {
        particles.push({
          x: this.canvas.width / 2,
          y: this.canvas.height / 2,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          size: Math.random() * 6 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.02 + 0.02
        });
      }

      const animate = () => {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let alive = false;
        particles.forEach(p => {
          if (p.alpha <= 0) return;

          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.1;
          p.alpha -= p.decay;

          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });

        if (alive) {
          requestAnimationFrame(animate);
        } else {
          ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
      };

      animate();
    }
  };

  // ========== 投票管理器 ==========
  const PollManager = {
    init() {
      this.polls = document.querySelectorAll('.poll-container');
      this.polls.forEach(poll => this.setupPoll(poll));
    },

    setupPoll(pollEl) {
      const pollId = pollEl.id;
      const options = pollEl.querySelectorAll('.poll-option');
      const submitBtn = pollEl.querySelector('.poll-submit');
      const totalEl = pollEl.querySelector('.poll-total');
      const isMultiple = options[0]?.dataset.multiple === 'true';

      const storageKey = `poll_${pollId}`;
      const votesKey = `poll_votes_${pollId}`;

      const savedVotes = JSON.parse(localStorage.getItem(votesKey) || '{}');
      const hasVoted = localStorage.getItem(storageKey);

      if (hasVoted) {
        this.showResults(pollEl, savedVotes);
        return;
      }

      let selectedIndices = [];

      options.forEach((option, index) => {
        option.addEventListener('click', () => {
          if (hasVoted) return;

          if (isMultiple) {
            if (option.classList.contains('selected')) {
              option.classList.remove('selected');
              selectedIndices = selectedIndices.filter(i => i !== index);
            } else {
              option.classList.add('selected');
              selectedIndices.push(index);
            }
          } else {
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedIndices = [index];
          }

          submitBtn.disabled = selectedIndices.length === 0;
        });
      });

      submitBtn.addEventListener('click', () => {
        if (selectedIndices.length === 0) return;

        selectedIndices.forEach(index => {
          savedVotes[index] = (savedVotes[index] || 0) + 1;
        });

        localStorage.setItem(votesKey, JSON.stringify(savedVotes));
        localStorage.setItem(storageKey, JSON.stringify(selectedIndices));

        this.showResults(pollEl, savedVotes);
        ToastManager.success('投票成功！');
        AchievementManager.incrementStat('votes');
      });
    },

    showResults(pollEl, votes) {
      const options = pollEl.querySelectorAll('.poll-option');
      const submitBtn = pollEl.querySelector('.poll-submit');
      const totalEl = pollEl.querySelector('.poll-total');

      const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);
      totalEl.textContent = `${totalVotes} 票`;

      submitBtn.disabled = true;
      submitBtn.textContent = '已投票';

      options.forEach((option, index) => {
        const count = votes[index] || 0;
        const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
        const fill = option.querySelector('.poll-option-fill');
        const percentEl = option.querySelector('.poll-option-percent');

        option.classList.add('voted');
        percentEl.textContent = `${percent}%`;

        setTimeout(() => {
          fill.style.width = `${percent}%`;
        }, 100);
      });
    }
  };

  // ========== 成就管理器 ==========
  const AchievementManager = {
    ACHIEVEMENTS: {
      first_visit: { icon: '👋', name: '初来乍到', desc: '首次访问博客', max: 1 },
      dark_mode: { icon: '🌙', name: '暗夜精灵', desc: '首次切换暗色模式', max: 1 },
      read_5: { icon: '📖', name: '求知若渴', desc: '阅读 5 篇文章', max: 5 },
      code_copy: { icon: '💻', name: '代码达人', desc: '复制代码块 10 次', max: 10 },
      first_comment: { icon: '💬', name: '互动先锋', desc: '首次发表评论', max: 1 },
      first_share: { icon: '🔗', name: '分享达人', desc: '首次分享文章', max: 1 },
      search: { icon: '🔍', name: '探索者', desc: '使用搜索功能', max: 1 },
      read_15: { icon: '🎓', name: '学富五车', desc: '阅读 15 篇文章', max: 15 },
      full_read: { icon: '🏆', name: '全文通读', desc: '阅读进度达到 100%', max: 1 },
      vote_5: { icon: '🗳️', name: '投票达人', desc: '参与 5 次投票', max: 5 },
      quiz_perfect: { icon: '🧠', name: '测验满分', desc: '测验获得满分', max: 1 },
      loyal: { icon: '⭐', name: '忠实读者', desc: '连续 7 天访问', max: 7 },
      master: { icon: '👑', name: '博学多才', desc: '解锁 10 个徽章', max: 10 }
    },

    init() {
      this.loadState();
      this.setupUI();
      this.checkFirstVisit();
      this.trackVisit();
    },

    loadState() {
      const saved = localStorage.getItem('achievements');
      this.state = saved ? JSON.parse(saved) : { unlocked: {}, stats: {} };
    },

    saveState() {
      localStorage.setItem('achievements', JSON.stringify(this.state));
    },

    unlock(id) {
      if (this.state.unlocked[id]) return false;

      this.state.unlocked[id] = { date: new Date().toISOString() };
      this.saveState();

      const achievement = this.ACHIEVEMENTS[id];
      if (achievement) {
        this.showToast(achievement);
      }

      this.updateBadge();
      return true;
    },

    showToast(achievement) {
      const toast = document.getElementById('achievementToast');
      if (!toast) return;

      const icon = toast.querySelector('.achievement-toast-icon');
      const name = toast.querySelector('.achievement-toast-name');

      icon.textContent = achievement.icon;
      name.textContent = achievement.name;

      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);

      const closeBtn = toast.querySelector('.achievement-toast-close');
      closeBtn.onclick = () => toast.classList.remove('show');
    },

    setupUI() {
      const btn = document.createElement('button');
      btn.className = 'achievements-btn';
      btn.innerHTML = '🏆<span class="badge-count" style="display:none">0</span>';
      btn.onclick = () => this.showModal();
      document.body.appendChild(btn);

      const modal = document.createElement('div');
      modal.className = 'achievements-modal';
      modal.innerHTML = `
        <div class="achievements-panel">
          <div class="achievements-header">
            <h3 class="achievements-title">🏆 成就墙</h3>
            <button class="achievements-close">✕</button>
          </div>
          <div class="achievements-grid"></div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('.achievements-close').onclick = () => modal.classList.remove('active');
      modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };

      this.updateBadge();
    },

    showModal() {
      const modal = document.querySelector('.achievements-modal');
      const grid = modal.querySelector('.achievements-grid');
      grid.innerHTML = '';

      Object.entries(this.ACHIEVEMENTS).forEach(([id, achievement]) => {
        const unlocked = !!this.state.unlocked[id];
        const item = document.createElement('div');
        item.className = `achievement-item ${unlocked ? 'unlocked' : 'locked'}`;
        item.innerHTML = `
          <span class="achievement-icon">${achievement.icon}</span>
          <span class="achievement-name">${achievement.name}</span>
          <span class="achievement-desc">${achievement.desc}</span>
        `;
        grid.appendChild(item);
      });

      modal.classList.add('active');
    },

    updateBadge() {
      const badge = document.querySelector('.achievements-btn .badge-count');
      if (!badge) return;

      const count = Object.keys(this.state.unlocked).length;
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    },

    checkFirstVisit() {
      this.unlock('first_visit');
    },

    trackVisit() {
      const today = new Date().toISOString().split('T')[0];
      if (!this.state.stats.visitDays) this.state.stats.visitDays = [];
      
      if (!this.state.stats.visitDays.includes(today)) {
        this.state.stats.visitDays.push(today);
        if (this.state.stats.visitDays.length >= 7) {
          this.unlock('loyal');
        }
        this.saveState();
      }
    },

    incrementStat(stat, amount = 1) {
      if (!this.state.stats[stat]) this.state.stats[stat] = 0;
      this.state.stats[stat] += amount;
      this.saveState();
      this.checkStatAchievements(stat);
    },

    checkStatAchievements(stat) {
      const value = this.state.stats[stat];
      if (stat === 'postsRead' && value >= 5) this.unlock('read_5');
      if (stat === 'postsRead' && value >= 15) this.unlock('read_15');
      if (stat === 'codeCopies' && value >= 10) this.unlock('code_copy');
      if (stat === 'votes' && value >= 5) this.unlock('vote_5');

      const totalUnlocked = Object.keys(this.state.unlocked).length;
      if (totalUnlocked >= 10) this.unlock('master');
    }
  };

  // ========== 测验管理器 ==========
  const QuizManager = {
    init() {
      this.quizzes = document.querySelectorAll('.quiz-container');
      this.quizzes.forEach(quiz => this.setupQuiz(quiz));
    },

    setupQuiz(quizEl) {
      const quizId = quizEl.id;
      const questions = quizEl.querySelectorAll('.quiz-question');
      const nextBtn = quizEl.querySelector('.quiz-next');
      const resultDiv = quizEl.querySelector('.quiz-result');
      const restartBtn = quizEl.querySelector('.quiz-restart');
      const progressEl = quizEl.querySelector('.quiz-progress');
      const scoreNumber = quizEl.querySelector('.quiz-score-number');
      const resultText = quizEl.querySelector('.quiz-result-text');

      let currentQuestion = 0;
      let score = 0;
      const totalQuestions = questions.length;

      const answers = [];
      questions.forEach(q => {
        const type = q.dataset.type;
        const answerAttr = q.dataset.answer;
        let answer;
        if (type === 'multi') {
          answer = JSON.parse(answerAttr || '[]');
        } else {
          answer = parseInt(answerAttr);
        }
        answers.push({ type, answer });
      });

      const storageKey = `quiz_${quizId}`;
      const hasCompleted = localStorage.getItem(storageKey);

      if (hasCompleted) {
        try {
          const savedResult = JSON.parse(hasCompleted);
          if (savedResult && typeof savedResult.score === 'number') {
            this.showFinalResult(quizEl, savedResult.score, totalQuestions);
            return;
          }
        } catch (e) {
          // 数据无效，清除它
          localStorage.removeItem(storageKey);
        }
      }

      questions.forEach((question, qIndex) => {
        const options = question.querySelectorAll('.quiz-option');
        options.forEach((option, oIndex) => {
          option.addEventListener('click', () => {
            if (option.classList.contains('correct') || option.classList.contains('wrong')) {
              return;
            }

            const isCorrect = this.checkAnswer(qIndex, oIndex, answers);

            options.forEach(opt => {
              const optIndex = parseInt(opt.dataset.index);
              if (optIndex === answers[qIndex].answer || 
                  (Array.isArray(answers[qIndex].answer) && answers[qIndex].answer.includes(optIndex))) {
                opt.classList.add('correct');
              }
            });

            if (!isCorrect) {
              option.classList.add('wrong');
            } else {
              score++;
            }

            const explanation = question.querySelector('.quiz-explanation');
            if (explanation) {
              explanation.style.display = 'block';
              explanation.classList.add(isCorrect ? 'correct' : 'wrong');
            }

            options.forEach(opt => {
              opt.style.cursor = 'default';
              opt.style.pointerEvents = 'none';
            });

            if (currentQuestion < totalQuestions - 1) {
              nextBtn.style.display = 'block';
            } else {
              setTimeout(() => {
                this.showFinalResult(quizEl, score, totalQuestions);
                localStorage.setItem(storageKey, JSON.stringify({ score, total: totalQuestions }));
                AchievementManager.incrementStat('quizzes');
                if (score === totalQuestions) {
                  AchievementManager.unlock('quiz_perfect');
                }
              }, 1000);
            }
          });
        });
      });

      nextBtn.addEventListener('click', () => {
        questions[currentQuestion].style.display = 'none';
        currentQuestion++;
        questions[currentQuestion].style.display = 'block';
        progressEl.textContent = `${currentQuestion + 1}/${totalQuestions}`;
        nextBtn.style.display = 'none';
      });

      restartBtn.addEventListener('click', () => {
        localStorage.removeItem(storageKey);
        currentQuestion = 0;
        score = 0;

        questions.forEach(q => {
          q.style.display = 'none';
          q.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('correct', 'wrong', 'selected');
            opt.style.cursor = 'pointer';
            opt.style.pointerEvents = 'auto';
          });
          const explanation = q.querySelector('.quiz-explanation');
          if (explanation) {
            explanation.style.display = 'none';
            explanation.classList.remove('correct', 'wrong');
          }
        });

        questions[0].style.display = 'block';
        progressEl.textContent = `1/${totalQuestions}`;
        nextBtn.style.display = 'none';
        resultDiv.style.display = 'none';
        quizEl.querySelector('.quiz-header').style.display = 'flex';
        quizEl.querySelector('.quiz-questions').style.display = 'block';
      });
    },

    checkAnswer(questionIndex, selectedOption, answers) {
      const answer = answers[questionIndex];
      if (answer.type === 'multi') {
        return answer.answer.includes(selectedOption);
      }
      return answer.answer === selectedOption;
    },

    showFinalResult(quizEl, score, total) {
      const questions = quizEl.querySelector('.quiz-questions');
      const nextBtn = quizEl.querySelector('.quiz-next');
      const resultDiv = quizEl.querySelector('.quiz-result');
      const scoreNumber = quizEl.querySelector('.quiz-score-number');
      const resultText = quizEl.querySelector('.quiz-result-text');
      const progressEl = quizEl.querySelector('.quiz-progress');

      questions.style.display = 'none';
      nextBtn.style.display = 'none';
      resultDiv.style.display = 'block';
      progressEl.style.display = 'none';

      scoreNumber.textContent = score;

      const percent = Math.round((score / total) * 100);
      if (percent === 100) {
        resultText.textContent = '🎉 满分！你真是太棒了！';
      } else if (percent >= 80) {
        resultText.textContent = '👏 优秀！你对这个主题很熟悉！';
      } else if (percent >= 60) {
        resultText.textContent = '👍 不错！继续加油！';
      } else if (percent >= 40) {
        resultText.textContent = '📖 还需要多学习哦！';
      } else {
        resultText.textContent = '💪 别灰心，再试一次吧！';
      }
    }
  };

  // ========== 代码 Playground 管理器 ==========
  const PlaygroundManager = {
    editors: {},
    monacoLoaded: false,
    monacoLoading: false,

    init() {
      this.containers = document.querySelectorAll('.playground-container');
      if (this.containers.length === 0) return;
      this.loadMonaco();
    },

    loadMonaco() {
      if (this.monacoLoaded || this.monacoLoading) return;
      this.monacoLoading = true;

      const configScript = document.createElement('script');
      configScript.textContent = `
        var require = { paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } };
      `;
      document.head.appendChild(configScript);

      const loaderScript = document.createElement('script');
      loaderScript.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js';
      loaderScript.onload = () => {
        window.require(['vs/editor/editor.main'], () => {
          this.monacoLoaded = true;
          this.monacoLoading = false;
          this.initEditors();
        });
      };
      document.head.appendChild(loaderScript);
    },

    initEditors() {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const monacoTheme = currentTheme === 'dark' ? 'playground-dark' : 'playground-light';
      this.defineThemes();

      this.containers.forEach(container => {
        const id = container.id.replace('playground-', '');
        const editorEl = container.querySelector('.playground-editor');
        const defaultCode = editorEl.dataset.defaultCode || this.getDefaultCode(container.dataset.language);

        const editor = monaco.editor.create(editorEl, {
          value: defaultCode,
          language: container.dataset.language || 'html',
          theme: monacoTheme,
          minimap: { enabled: false },
          fontSize: 14,
          lineHeight: 22,
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8
          }
        });

        this.editors[id] = editor;
        this.setupContainer(container, id, editor);
      });
    },

    defineThemes() {
      monaco.editor.defineTheme('playground-light', {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
          { token: 'keyword', foreground: 'd73a49' },
          { token: 'string', foreground: '032f62' },
          { token: 'number', foreground: '005cc5' },
          { token: 'tag', foreground: '22863a' },
          { token: 'attribute.name', foreground: '6f42c1' },
          { token: 'attribute.value', foreground: '032f62' }
        ],
        colors: {
          'editor.background': '#f6f8fa',
          'editor.foreground': '#24292e',
          'editor.lineHighlightBackground': '#f0f4f8',
          'editorCursor.foreground': '#0969da',
          'editor.selectionBackground': '#0969da20',
          'editorLineNumber.foreground': '#8b949e',
          'editorGutter.background': '#f6f8fa'
        }
      });

      monaco.editor.defineTheme('playground-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '8b949e', fontStyle: 'italic' },
          { token: 'keyword', foreground: 'ff7b72' },
          { token: 'string', foreground: 'a5d6ff' },
          { token: 'number', foreground: '79c0ff' },
          { token: 'tag', foreground: '7ee787' },
          { token: 'attribute.name', foreground: 'd2a8ff' },
          { token: 'attribute.value', foreground: 'a5d6ff' }
        ],
        colors: {
          'editor.background': '#0d1117',
          'editor.foreground': '#c9d1d9',
          'editor.lineHighlightBackground': '#161b22',
          'editorCursor.foreground': '#58a6ff',
          'editor.selectionBackground': '#58a6ff20',
          'editorLineNumber.foreground': '#484f58',
          'editorGutter.background': '#0d1117'
        }
      });
    },

    getDefaultCode(language) {
      const defaults = {
        html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>示例</title>
  <style>
    body {
      font-family: sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .card {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      padding: 2rem;
      border-radius: 1rem;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello World! 👋</h1>
    <p>修改代码试试看！</p>
  </div>
</body>
</html>`,
        css: `.container {
  display: flex;
  gap: 1rem;
  padding: 2rem;
}

.box {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.box:nth-child(1) { background: #667eea; }
.box:nth-child(2) { background: #764ba2; }
.box:nth-child(3) { background: #f093fb; }

.box:hover {
  transform: scale(1.1) rotate(5deg);
}`,
        javascript: `// 一个简单的动画示例
const canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 300;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
let x = 0;

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.beginPath();
  ctx.arc(x, 150, 30, 0, Math.PI * 2);
  ctx.fillStyle = '#667eea';
  ctx.fill();
  
  x = (x + 2) % canvas.width;
  requestAnimationFrame(animate);
}

animate();`
      };
      return defaults[language] || defaults.html;
    },

    setupContainer(container, id, editor) {
      const tabs = container.querySelectorAll('.playground-tab');
      const runBtn = container.querySelector('.playground-run');
      const resetBtn = container.querySelector('.playground-reset');
      const copyBtn = container.querySelector('.playground-copy');
      const preview = container.querySelector('.playground-preview');
      const statusEl = container.querySelector('.playground-status');

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          this.switchView(container, tab.dataset.tab);
        });
      });

      runBtn.addEventListener('click', () => this.runCode(id));

      resetBtn.addEventListener('click', () => {
        const defaultCode = container.querySelector('.playground-editor').dataset.defaultCode;
        editor.setValue(defaultCode || this.getDefaultCode(container.dataset.language));
        this.runCode(id);
      });

      copyBtn.addEventListener('click', () => {
        const code = editor.getValue();
        navigator.clipboard.writeText(code).then(() => {
          ToastManager.success('代码已复制！');
        });
      });

      this.runCode(id);
    },

    switchView(container, view) {
      const editorWrapper = container.querySelector('.playground-editor-wrapper');
      const previewWrapper = container.querySelector('.playground-preview-wrapper');

      container.classList.remove('view-editor', 'view-preview', 'view-split');
      container.classList.add(`view-${view}`);
    },

    runCode(id) {
      const editor = this.editors[id];
      if (!editor) return;

      const container = document.getElementById(`playground-${id}`);
      const preview = container.querySelector('.playground-preview');
      const statusEl = container.querySelector('.playground-status');
      const language = container.dataset.language;
      const code = editor.getValue();

      statusEl.textContent = '运行中...';
      statusEl.classList.add('running');

      if (language === 'html') {
        this.runHTML(preview, code);
      } else if (language === 'css') {
        this.runCSS(preview, code);
      } else if (language === 'javascript') {
        this.runJavaScript(preview, code);
      }

      setTimeout(() => {
        statusEl.textContent = '已运行';
        statusEl.classList.remove('running');
      }, 300);
    },

    runHTML(preview, code) {
      const doc = preview.contentDocument || preview.contentWindow.document;
      doc.open();
      doc.write(code);
      doc.close();
    },

    runCSS(preview, cssCode) {
      const html = `<!DOCTYPE html>
<html>
<head>
<style>
${cssCode}
</style>
</head>
<body>
<div class="container">
  <div class="box"></div>
  <div class="box"></div>
  <div class="box"></div>
</div>
</body>
</html>`;
      this.runHTML(preview, html);
    },

    runJavaScript(preview, jsCode) {
      const html = `<!DOCTYPE html>
<html>
<head>
<style>
body { margin: 0; font-family: sans-serif; }
canvas { display: block; }
</style>
</head>
<body>
<script>
try {
  ${jsCode}
} catch(e) {
  document.body.innerHTML = '<div style="padding:20px;color:red;">' + e.message + '</div>';
}
</script>
</body>
</html>`;
      this.runHTML(preview, html);
    },

    updateTheme() {
      if (!this.monacoLoaded) return;
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const monacoTheme = currentTheme === 'dark' ? 'playground-dark' : 'playground-light';
      Object.values(this.editors).forEach(editor => {
        monaco.editor.setTheme(monacoTheme);
      });
    }
  };

  // ========== 游戏管理器 ==========
  const GameManager = {
    STORAGE_KEY: 'game_scores',

    init() {
      this.container = document.querySelector('.game-container');
      if (!this.container) return;

      this.type = this.container.dataset.type;
      this.scoreEl = document.getElementById('gameScore');
      this.highScoreEl = document.getElementById('highScore');
      this.restartBtn = document.getElementById('gameRestart');

      this.loadHighScore();
      this.restartBtn?.addEventListener('click', () => this.restart());

      switch (this.type) {
        case 'css-selector':
          this.initCssSelector();
          break;
        case 'typing-race':
          this.initTypingRace();
          break;
        case 'terminal-guess':
          this.initTerminalGuess();
          break;
      }
    },

    loadHighScore() {
      const scores = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
      this.highScore = scores[this.type] || 0;
      if (this.highScoreEl) {
        this.highScoreEl.textContent = this.highScore;
      }
    },

    saveHighScore(score) {
      if (score > this.highScore) {
        this.highScore = score;
        const scores = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
        scores[this.type] = score;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(scores));
        if (this.highScoreEl) {
          this.highScoreEl.textContent = score;
        }
        ToastManager.success('新纪录！');
      }
    },

    updateScore(score) {
      if (this.scoreEl) {
        this.scoreEl.textContent = score;
      }
    },

    restart() {
      switch (this.type) {
        case 'css-selector':
          this.cssSelector.reset();
          break;
        case 'typing-race':
          this.typingRace.reset();
          break;
        case 'terminal-guess':
          this.terminalGuess.reset();
          break;
      }
    },

    // CSS 选择器挑战
    initCssSelector() {
      this.cssSelector = {
        levels: [
          { html: '<div class="box"><p>选中我</p></div>', target: 'p', hint: '选中段落元素' },
          { html: '<div id="special">选中我</div>', target: '#special', hint: '选中 ID 为 special 的元素' },
          { html: '<ul><li class="first">1</li><li>2</li><li>3</li></ul>', target: '.first', hint: '选中第一个列表项' },
          { html: '<div><span>不要选我</span></div><p class="target">选中我</p>', target: '.target', hint: '选中 class 为 target 的元素' },
          { html: '<article><h2>标题</h2><p>段落1</p><p>段落2</p></article>', target: 'article p', hint: '选中文章内的所有段落' },
          { html: '<nav><a href="#">链接1</a><a href="#" class="active">链接2</a></nav>', target: 'a.active', hint: '选中激活状态的链接' },
          { html: '<div class="parent"><div class="child">选中我</div></div>', target: '.parent > .child', hint: '选中直接子元素' },
          { html: '<input type="text" placeholder="输入"><input type="password" placeholder="密码">', target: 'input[type="password"]', hint: '选中密码输入框' },
          { html: '<ul><li>1</li><li>2</li><li>3</li></ul>', target: 'li:first-child', hint: '选中第一个 li 元素' },
          { html: '<div><p>段落1</p><p>段落2</p><span>行内</span></div>', target: 'p + span', hint: '选中紧跟段落后的 span' }
        ],
        currentLevel: 0,
        score: 0,
        container: this.container,

        init() {
          this.previewEl = document.getElementById('htmlPreview');
          this.targetEl = document.getElementById('targetElements');
          this.inputEl = document.getElementById('cssInput');
          this.submitBtn = document.getElementById('cssSubmit');
          this.feedbackEl = document.getElementById('gameFeedback');
          this.levelEl = document.getElementById('currentLevel');
          this.totalEl = document.getElementById('totalLevels');

          if (this.totalEl) this.totalEl.textContent = this.levels.length;

          this.submitBtn?.addEventListener('click', () => this.checkAnswer());
          this.inputEl?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer();
          });

          this.loadLevel();
        },

        loadLevel() {
          const level = this.levels[this.currentLevel];
          if (!level) {
            this.complete();
            return;
          }

          if (this.previewEl) this.previewEl.innerHTML = level.html;
          if (this.targetEl) this.targetEl.innerHTML = `<code>${level.target}</code><span>${level.hint}</span>`;
          if (this.levelEl) this.levelEl.textContent = this.currentLevel + 1;
          if (this.inputEl) {
            this.inputEl.value = '';
            this.inputEl.focus();
          }
          if (this.feedbackEl) {
            this.feedbackEl.textContent = '';
            this.feedbackEl.className = 'game-feedback';
          }

          this.previewEl?.querySelectorAll('*').forEach(el => {
            el.classList.remove('highlighted');
          });
        },

        checkAnswer() {
          const answer = this.inputEl?.value?.trim();
          if (!answer) return;

          const level = this.levels[this.currentLevel];
          try {
            const previewDoc = this.previewEl;
            const selected = previewDoc.querySelectorAll(answer);
            const target = previewDoc.querySelectorAll(level.target);

            const isCorrect = selected.length === target.length &&
              Array.from(selected).every(el => Array.from(target).includes(el));

            if (isCorrect) {
              this.score += 10;
              this.updateScore(this.score);
              if (this.feedbackEl) {
                this.feedbackEl.textContent = '✅ 正确！';
                this.feedbackEl.className = 'game-feedback success';
              }
              selected.forEach(el => el.classList.add('highlighted'));
              setTimeout(() => {
                this.currentLevel++;
                this.loadLevel();
              }, 1000);
            } else {
              if (this.feedbackEl) {
                this.feedbackEl.textContent = `❌ 不正确，选中了 ${selected.length} 个元素，需要 ${target.length} 个`;
                this.feedbackEl.className = 'game-feedback error';
              }
            }
          } catch (e) {
            if (this.feedbackEl) {
              this.feedbackEl.textContent = '⚠️ 无效的选择器语法';
              this.feedbackEl.className = 'game-feedback error';
            }
          }
        },

        complete() {
          this.saveHighScore(this.score);
          ToastManager.success(`游戏完成！得分：${this.score}`);
        },

        reset() {
          this.currentLevel = 0;
          this.score = 0;
          this.updateScore(0);
          this.loadLevel();
        }
      };

      this.cssSelector.init();
    },

    // 代码打字练习
    initTypingRace() {
      this.typingRace = {
        codeSnippets: [
          'function hello() {\n  console.log("Hello World!");\n}',
          'const sum = (a, b) => a + b;\nconsole.log(sum(1, 2));',
          'for (let i = 0; i < 10; i++) {\n  console.log(i);\n}',
          'const arr = [1, 2, 3];\narr.map(x => x * 2);',
          'if (condition) {\n  return true;\n} else {\n  return false;\n}'
        ],
        currentSnippet: '',
        isRunning: false,
        startTime: null,
        timerInterval: null,
        correctChars: 0,
        errorChars: 0,
        currentIndex: 0,
        timeLeft: 60,
        container: this.container,

        init() {
          this.displayEl = document.getElementById('codeDisplay');
          this.inputEl = document.getElementById('typingInput');
          this.timerEl = document.getElementById('gameTimer');
          this.correctEl = document.getElementById('correctChars');
          this.errorEl = document.getElementById('errorChars');
          this.accuracyEl = document.getElementById('accuracy');
          this.wpmEl = document.getElementById('wpm');
          this.startBtn = document.getElementById('typingStart');

          this.startBtn?.addEventListener('click', () => this.start());
          this.inputEl?.addEventListener('input', () => this.onInput());
        },

        start() {
          this.currentSnippet = this.codeSnippets[Math.floor(Math.random() * this.codeSnippets.length)];
          this.isRunning = true;
          this.startTime = Date.now();
          this.correctChars = 0;
          this.errorChars = 0;
          this.currentIndex = 0;
          this.timeLeft = 60;

          if (this.displayEl) this.displayEl.textContent = this.currentSnippet;
          if (this.inputEl) {
            this.inputEl.value = '';
            this.inputEl.disabled = false;
            this.inputEl.focus();
          }
          if (this.startBtn) this.startBtn.style.display = 'none';

          this.updateStats();
          this.startTimer();
        },

        startTimer() {
          this.timerInterval = setInterval(() => {
            this.timeLeft--;
            if (this.timerEl) this.timerEl.textContent = this.timeLeft;

            if (this.timeLeft <= 0) {
              this.end();
            }
          }, 1000);
        },

        onInput() {
          if (!this.isRunning) return;

          const input = this.inputEl?.value || '';
          this.currentIndex = input.length;

          this.correctChars = 0;
          this.errorChars = 0;

          for (let i = 0; i < input.length; i++) {
            if (input[i] === this.currentSnippet[i]) {
              this.correctChars++;
            } else {
              this.errorChars++;
            }
          }

          this.updateStats();

          if (input === this.currentSnippet) {
            this.end();
          }
        },

        updateStats() {
          if (this.correctEl) this.correctEl.textContent = this.correctChars;
          if (this.errorEl) this.errorEl.textContent = this.errorChars;

          const total = this.correctChars + this.errorChars;
          const accuracy = total > 0 ? Math.round((this.correctChars / total) * 100) : 100;
          if (this.accuracyEl) this.accuracyEl.textContent = `${accuracy}%`;

          const timeElapsed = (Date.now() - this.startTime) / 1000 / 60;
          const wpm = timeElapsed > 0 ? Math.round((this.correctChars / 5) / timeElapsed) : 0;
          if (this.wpmEl) this.wpmEl.textContent = wpm;
        },

        end() {
          this.isRunning = false;
          clearInterval(this.timerInterval);

          if (this.inputEl) this.inputEl.disabled = true;
          if (this.startBtn) {
            this.startBtn.style.display = 'block';
            this.startBtn.textContent = '再来一次';
          }

          const score = this.correctChars * 10 - this.errorChars * 5;
          this.saveHighScore(Math.max(0, score));
          ToastManager.success(`练习完成！得分：${Math.max(0, score)}`);
        },

        reset() {
          this.isRunning = false;
          clearInterval(this.timerInterval);
          this.correctChars = 0;
          this.errorChars = 0;
          this.currentIndex = 0;
          this.timeLeft = 60;

          if (this.displayEl) this.displayEl.textContent = '点击"开始练习"开始';
          if (this.inputEl) {
            this.inputEl.value = '';
            this.inputEl.disabled = true;
          }
          if (this.timerEl) this.timerEl.textContent = '60';
          if (this.startBtn) {
            this.startBtn.style.display = 'block';
            this.startBtn.textContent = '开始练习';
          }
          this.updateStats();
        }
      };

      this.typingRace.init();
    },

    // 终端猜数字
    initTerminalGuess() {
      this.terminalGuess = {
        target: 0,
        guessCount: 0,
        bestRecord: parseInt(localStorage.getItem('terminal_guess_best') || '999'),
        container: this.container,

        init() {
          this.bodyEl = document.getElementById('terminalBody');
          this.inputEl = document.getElementById('terminalInput');
          this.submitBtn = document.getElementById('terminalSubmit');
          this.restartBtn = document.getElementById('terminalRestart');
          this.guessCountEl = document.getElementById('guessCount');
          this.bestRecordEl = document.getElementById('bestRecord');

          if (this.bestRecordEl) {
            this.bestRecordEl.textContent = this.bestRecord < 999 ? this.bestRecord : '-';
          }

          this.submitBtn?.addEventListener('click', () => this.guess());
          this.inputEl?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.guess();
          });
          this.restartBtn?.addEventListener('click', () => this.reset());

          this.reset();
        },

        reset() {
          this.target = Math.floor(Math.random() * 100) + 1;
          this.guessCount = 0;

          if (this.bodyEl) {
            this.bodyEl.innerHTML = `
              <div class="terminal-line system">欢迎来到猜数字游戏！</div>
              <div class="terminal-line system">我想了一个 1-100 之间的数字，你能猜到吗？</div>
              <div class="terminal-line system">输入你的猜测，然后按回车或点击"猜"按钮。</div>
            `;
          }
          if (this.inputEl) {
            this.inputEl.value = '';
            this.inputEl.focus();
          }
          if (this.guessCountEl) this.guessCountEl.textContent = '0';
        },

        guess() {
          const input = this.inputEl?.value?.trim();
          if (!input) return;

          const num = parseInt(input);
          if (isNaN(num) || num < 1 || num > 100) {
            this.addLine('请输入 1-100 之间的数字', 'error');
            return;
          }

          this.guessCount++;
          if (this.guessCountEl) this.guessCountEl.textContent = this.guessCount;

          if (num === this.target) {
            this.addLine(`🎉 恭喜你猜对了！答案就是 ${this.target}`, 'success');
            this.addLine(`你总共猜了 ${this.guessCount} 次`, 'system');

            if (this.guessCount < this.bestRecord) {
              this.bestRecord = this.guessCount;
              localStorage.setItem('terminal_guess_best', this.bestRecord);
              if (this.bestRecordEl) this.bestRecordEl.textContent = this.bestRecord;
              this.addLine('🏆 新纪录！', 'success');
            }

            const score = Math.max(0, 100 - this.guessCount * 5);
            this.saveHighScore(score);
            ToastManager.success(`游戏完成！得分：${score}`);
          } else if (num < this.target) {
            this.addLine(`⬆️ ${num} 太小了，再大一点`, 'user');
          } else {
            this.addLine(`⬇️ ${num} 太大了，再小一点`, 'user');
          }

          if (this.inputEl) {
            this.inputEl.value = '';
            this.inputEl.focus();
          }
        },

        addLine(text, type = 'system') {
          if (!this.bodyEl) return;

          const line = document.createElement('div');
          line.className = `terminal-line ${type}`;
          line.textContent = text;
          this.bodyEl.appendChild(line);
          this.bodyEl.scrollTop = this.bodyEl.scrollHeight;
        }
      };

      this.terminalGuess.init();
    },

    updateScore(score) {
      if (this.scoreEl) {
        this.scoreEl.textContent = score;
      }
    }
  };

  // ========== 骨架屏管理器 ==========
  const SkeletonManager = {
    init() {
      this.skeletonGrid = document.getElementById('skeletonGrid');
      this.postsGrid = document.getElementById('postsGrid');

      if (!this.skeletonGrid || !this.postsGrid) return;

      setTimeout(() => this.showContent(), 500);
    },

    showContent() {
      this.skeletonGrid.style.opacity = '0';
      this.skeletonGrid.style.transition = 'opacity 0.3s ease';

      setTimeout(() => {
        this.skeletonGrid.style.display = 'none';
        this.postsGrid.style.display = 'grid';
        this.postsGrid.style.opacity = '0';
        this.postsGrid.style.transition = 'opacity 0.3s ease';

        setTimeout(() => {
          this.postsGrid.style.opacity = '1';
          ScrollReveal.init();
        }, 50);
      }, 300);
    }
  };

  // ========== 打字机效果管理器 ==========
  const TypewriterManager = {
    STORAGE_KEY: 'typewriter_shown',

    init() {
      this.titleEl = document.getElementById('postTitle');
      if (!this.titleEl) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const postId = window.location.pathname;
      const shownPosts = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
      if (shownPosts.includes(postId)) return;

      shownPosts.push(postId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(shownPosts));

      this.originalText = this.titleEl.dataset.original || this.titleEl.textContent;
      this.titleEl.textContent = '';
      this.titleEl.classList.add('typewriter-active');

      this.currentIndex = 0;
      this.type();
    },

    type() {
      if (this.currentIndex < this.originalText.length) {
        this.titleEl.textContent = this.originalText.substring(0, this.currentIndex + 1);
        this.currentIndex++;
        setTimeout(() => this.type(), 50);
      } else {
        this.blinkCursor();
      }
    },

    blinkCursor() {
      let blinks = 0;
      const blinkInterval = setInterval(() => {
        this.titleEl.classList.toggle('typewriter-cursor');
        blinks++;
        if (blinks >= 6) {
          clearInterval(blinkInterval);
          this.titleEl.classList.remove('typewriter-active', 'typewriter-cursor');
        }
      }, 500);
    }
  };

  // ========== 3D 卡片效果管理器 ==========
  const Card3DManager = {
    init() {
      if ('ontouchstart' in window) return;

      this.cards = document.querySelectorAll('.post-card, .featured-card');
      this.cards.forEach(card => this.setupCard(card));
    },

    setupCard(card) {
      let ticking = false;

      card.addEventListener('mousemove', (e) => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * 3;
          const rotateY = ((centerX - x) / centerX) * 3;

          card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

          ticking = false;
        });
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    }
  };

  // ========== 统计数据管理器 ==========
  const StatsManager = {
    stats: null,

    async init() {
      try {
        const response = await fetch('/assets/data/stats.json');
        if (response.ok) {
          this.stats = await response.json();
          if (this.stats && this.stats.lastUpdated) {
            this.updateGlobalStats();
            this.updatePostStats();
          }
        }
      } catch (error) {
        // 静默处理，统计数据不可用时不显示错误
      }
    },

    updateGlobalStats() {
      if (!this.stats) return;

      const footerStats = document.querySelector('.footer-stats');
      if (!footerStats) return;

      const totalComments = this.stats.global.totalComments;
      const totalReactions = this.stats.global.totalReactions;

      if (totalComments > 0 || totalReactions > 0) {
        const statsText = footerStats.querySelector('p:first-child');
        if (statsText) {
          statsText.textContent += ` · ${totalComments} 条评论 · ${totalReactions} 次互动`;
        }
      }
    },

    updatePostStats() {
      if (!this.stats) return;

      const pageTitle = document.querySelector('.post-title')?.textContent?.trim();
      if (!pageTitle) return;

      const postStats = this.stats.posts[pageTitle];
      if (!postStats) return;

      // 更新点赞按钮显示全局数据
      const likeCount = document.getElementById('likeCount');
      if (likeCount && postStats.reactions) {
        const globalLikes = postStats.reactions['THUMBSUP'] || 0;
        const localLikes = LikeManager.count || 0;
        likeCount.textContent = Math.max(globalLikes, localLikes);
      }

      // 更新评论数显示
      const commentCount = document.querySelector('.comment-count');
      if (commentCount && postStats.comments) {
        commentCount.textContent = `${postStats.comments} 条评论`;
      }
    },

    getPostStats(title) {
      return this.stats?.posts[title] || null;
    }
  };

  // ========== 初始化 ==========
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    MobileMenu.init();
    NavbarScroll.init();
    SmoothScroll.init();
    CodeBlockManager.init();
    BackToTop.init();
    ReadingProgress.init();
    TOCManager.init();
    SearchManager.init();
    LightboxManager.init();
    RippleManager.init();
    ScrollReveal.init();
    ToastManager.init();
    CommentManager.init();
    ShareManager.init();
    LikeManager.init();
    PollManager.init();
    QuizManager.init();
    AchievementManager.init();
    PlaygroundManager.init();
    GameManager.init();
    SkeletonManager.init();
    TypewriterManager.init();
    Card3DManager.init();
    StatsManager.init();
  });

})();
