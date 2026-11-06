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
    MAX_ROTATE: 2,
    SCALE: 1.02,
    PERSPECTIVE: 1000,

    init() {
      if ('ontouchstart' in window || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      document.querySelectorAll('.post-card, .featured-card').forEach(card => this.setupCard(card));
    },

    setupCard(card) {
      let rafId = null;
      let isHovering = false;

      const animate = (mouseX, mouseY) => {
        const rect = card.getBoundingClientRect();
        const x = (mouseX - rect.left) / rect.width;
        const y = (mouseY - rect.top) / rect.height;
        const rotateX = (0.5 - y) * this.MAX_ROTATE * 2;
        const rotateY = (x - 0.5) * this.MAX_ROTATE * 2;

        card.style.transform = `perspective(${this.PERSPECTIVE}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${this.SCALE},${this.SCALE},${this.SCALE})`;
        card.style.setProperty('--glare-x', `${x * 100}%`);
        card.style.setProperty('--glare-y', `${y * 100}%`);
        card.style.boxShadow = `${-rotateY * 1.5}px ${rotateX * 1.5}px 30px rgba(0,0,0,0.12)`;
        rafId = null;
      };

      card.addEventListener('mouseenter', () => {
        isHovering = true;
        card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
        card.classList.add('card-3d-active');
      });

      card.addEventListener('mousemove', (e) => {
        if (!isHovering || rafId) return;
        rafId = requestAnimationFrame(() => animate(e.clientX, e.clientY));
      });

      card.addEventListener('mouseleave', () => {
        isHovering = false;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
        card.style.transform = '';
        card.style.boxShadow = '';
        card.classList.remove('card-3d-active');
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

  // ========== Cyber Swarm Intro 多智能体/人生记忆协同构建启动动效 ==========
  const SwarmIntroManager = {
    STORAGE_KEY: 'cyber_swarm_intro_seen_v1',
    isRunning: false,
    speedMultiplier: 1,
    rafId: null,
    timers: [],
    activeCleanups: [],

    // 12 个抽象人生羁绊与精神世界 Agent 词库
    AGENTS_DATA: [
      { name: '亲情', color: '#f43f5e' },
      { name: '友情', color: '#0c8ce9' },
      { name: '同学', color: '#10b981' },
      { name: '网络', color: '#8b5cf6' },
      { name: '热爱', color: '#f59e0b' },
      { name: '理想', color: '#06b6d4' },
      { name: '好奇心', color: '#ec4899' },
      { name: '初心', color: '#3b82f6' },
      { name: '青春', color: '#14b8a6' },
      { name: '灵感', color: '#a855f7' },
      { name: '代码', color: '#22c55e' },
      { name: '回忆', color: '#fb7185' }
    ],

    // 四次方缓动函数 (Quartic Easing)
    easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    },

    easeInOutQuart(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    },

    // 4 种 Figma 协作光标工具 SVG
    ICONS: {
      arrow: (color) => `
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path d="M4.5 3.5L11.5 20L14.2 13.8L20.5 11.2L4.5 3.5Z" fill="${color}" stroke="#ffffff" stroke-width="1.8" stroke-linejoin="round"/>
        </svg>`,
      crosshair: (color) => `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
          <path d="M12 3V21M3 12H21" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
          <path d="M12 3V21M3 12H21" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
          <rect x="9.5" y="9.5" width="5" height="5" fill="none" stroke="${color}" stroke-width="1.5"/>
        </svg>`,
      ibeam: (color) => `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
          <path d="M8 4H16M8 20H16M12 4V20" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
          <path d="M8 4H16M8 20H16M12 4V20" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
        </svg>`,
      hand: (color) => `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
          <path d="M9 11V6a1.5 1.5 0 0 1 3 0v4m0-3a1.5 1.5 0 0 1 3 0v3m0-2a1.5 1.5 0 0 1 3 0v5a6 6 0 0 1-6 6h-2a6 6 0 0 1-5-2.7L4.2 13.8a1.5 1.5 0 0 1 2.3-1.9L9 14V11Z" fill="${color}" stroke="#ffffff" stroke-width="1.6" stroke-linejoin="round"/>
        </svg>`
    },

    init() {
      const replayBtn = document.getElementById('swarmReplayBtn');
      const isHome = document.querySelector('.hero') !== null;

      if (replayBtn) {
        replayBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (!isHome) {
            window.location.href = '/?intro=1';
            return;
          }
          this.start(true);
        });
      }

      if (!isHome) {
        document.documentElement.classList.remove('swarm-intro-preparing');
        return;
      }

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const urlParams = new URLSearchParams(window.location.search);
      const forceIntro = urlParams.get('intro') === '1';
      const seen = localStorage.getItem(this.STORAGE_KEY);

      if (!prefersReducedMotion && (!seen || forceIntro)) {
        if (forceIntro && window.history.replaceState) {
          urlParams.delete('intro');
          const newSearch = urlParams.toString();
          window.history.replaceState({}, '', window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash);
        }
        this.start(false);
      } else {
        document.documentElement.classList.remove('swarm-intro-preparing');
      }
    },

    collectTargets() {
      const tasks = [];
      const vh = window.innerHeight;

      const addIfVisible = (el, type, metaLabel) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.width < 4 || rect.height < 4) return;
        // 仅收集首屏视口范围内可见的元素（不跑完整张页面、不自动滚屏）
        if (rect.top > vh - 20 || rect.bottom < 0) return;
        tasks.push({ el, type, metaLabel });
      };

      // 1. 导航栏核心元素
      addIfVisible(document.querySelector('.navbar .logo'), 'place', 'Logo');
      document.querySelectorAll('.navbar .nav-link').forEach((link, idx) => {
        addIfVisible(link, 'place', `Nav-${idx + 1}`);
      });
      addIfVisible(document.getElementById('swarmReplayBtn'), 'place', 'Action');
      addIfVisible(document.getElementById('searchToggle'), 'place', 'Search');
      addIfVisible(document.getElementById('themeToggle'), 'place', 'Theme');
      addIfVisible(document.getElementById('menuToggle'), 'place', 'Menu');

      // 2. Hero 左侧个人介绍区域
      addIfVisible(document.querySelector('.hero-badge'), 'box', 'Badge');
      addIfVisible(document.querySelector('.hero-greeting'), 'type', 'Greeting');
      addIfVisible(document.querySelector('.hero-name'), 'type', 'Heading');
      addIfVisible(document.querySelector('.hero-description'), 'type', 'Bio');
      addIfVisible(document.querySelector('.hero-location'), 'place', 'Location');
      document.querySelectorAll('.hero-links .hero-link').forEach((btn, idx) => {
        addIfVisible(btn, 'box', `Button-${idx + 1}`);
      });

      // 3. Hero 右侧头像名片区域
      addIfVisible(document.querySelector('.avatar-card'), 'box', 'Card');
      addIfVisible(document.querySelector('.avatar-wrapper'), 'box', 'Avatar');
      addIfVisible(document.querySelector('.avatar-name'), 'type', 'Title');
      addIfVisible(document.querySelector('.avatar-role'), 'type', 'Role');
      document.querySelectorAll('.avatar-stats .stat').forEach((stat, idx) => {
        addIfVisible(stat, 'place', `Stat-${idx + 1}`);
      });

      // 4. 首屏下部露出的精选文章或最新文章标题与卡片
      addIfVisible(document.querySelector('.featured-section .section-header'), 'type', 'Section');
      document.querySelectorAll('.featured-card').forEach((card, idx) => {
        addIfVisible(card, 'box', `Featured-${idx + 1}`);
      });
      addIfVisible(document.querySelector('.posts-section .section-header'), 'type', 'Section');
      document.querySelectorAll('#postsGrid .post-card').forEach((card, idx) => {
        if (idx < 2) addIfVisible(card, 'box', `Post-${idx + 1}`);
      });

      return tasks;
    },

    prepareAllPostsGridImmediately() {
      const skeletonGrid = document.getElementById('skeletonGrid');
      const postsGrid = document.getElementById('postsGrid');
      if (skeletonGrid && postsGrid) {
        skeletonGrid.style.display = 'none';
        postsGrid.style.display = 'grid';
        postsGrid.style.opacity = '1';
      }
      // 消除 reveal 类的初始 translateY 偏移，确保所有卡片边界坐标 100% 处于最终位置
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger').forEach((el) => {
        el.classList.add('revealed');
      });
    },

    start(isReplay = false) {
      if (this.isRunning) {
        this.cleanup(true);
      }
      this.isRunning = true;
      this.speedMultiplier = 1;
      localStorage.setItem(this.STORAGE_KEY, '1');

      document.documentElement.classList.add('swarm-running');

      // 确保骨架屏直接替换为真实文章网格且消除 reveal 偏移以便精准测量坐标
      this.prepareAllPostsGridImmediately();

      // 先移除 preparing 类以便测量真实 DOM 尺寸，紧接着给目标节点挂上受控隐藏类
      const tasks = this.collectTargets();
      tasks.forEach((task) => {
        if (task.type === 'type') {
          if (!task.el.dataset.swarmOrigText) {
            task.el.dataset.swarmOrigText = task.el.textContent.trim();
          }
          task.origText = task.el.dataset.swarmOrigText;
          // 保持原有高度占位，避免打字过程中布局跳动
          const rect = task.el.getBoundingClientRect();
          task.el.style.minHeight = `${Math.round(rect.height)}px`;
          task.el.textContent = '';
          task.el.classList.add('swarm-target-hidden');
        } else {
          task.el.classList.add('swarm-target-hidden');
        }
      });

      document.documentElement.classList.remove('swarm-intro-preparing');

      // 创建全屏舞台与 HUD
      this.buildStage(tasks.length);

      // 创建 12 个 Agent 实例
      this.createAgents();

      // 绑定 ESC 键跳过
      this.escHandler = (e) => {
        if (e.key === 'Escape') {
          this.skip();
        }
      };
      window.addEventListener('keydown', this.escHandler);

      // 启动主编排时间线
      this.runTimeline(tasks);
    },

    buildStage(totalLayers) {
      this.stage = document.createElement('div');
      this.stage.className = 'swarm-stage';

      // 深邃网格背景（阶段1展示，阶段2渐隐）
      this.backdrop = document.createElement('div');
      this.backdrop.className = 'swarm-backdrop';
      this.stage.appendChild(this.backdrop);

      // 阶段1中心小头像徽章
      this.centerBadge = document.createElement('div');
      this.centerBadge.className = 'swarm-center-badge';
      const avatarImg = document.querySelector('.avatar-wrapper img');
      const avatarSrc = avatarImg ? avatarImg.src : '/assets/images/avatar.png';
      this.centerBadge.innerHTML = `<img src="${avatarSrc}" alt="Center Avatar">`;
      this.stage.appendChild(this.centerBadge);

      // 贯穿全屏的对齐辅助标尺线（1条红竖线 + 2条青蓝横线）
      this.guideV = document.createElement('div');
      this.guideV.className = 'swarm-guide-line guide-v';
      this.guideH1 = document.createElement('div');
      this.guideH1.className = 'swarm-guide-line guide-h';
      this.guideH2 = document.createElement('div');
      this.guideH2.className = 'swarm-guide-line guide-h';
      this.stage.appendChild(this.guideV);
      this.stage.appendChild(this.guideH1);
      this.stage.appendChild(this.guideH2);

      document.body.appendChild(this.stage);

      // 底部悬浮胶囊 HUD（复刻视频底部控制栏）
      this.hud = document.createElement('div');
      this.hud.className = 'swarm-hud';
      const dotColors = ['#38bdf8', '#34d399', '#fbbf24', '#f43f5e', '#a855f7'];
      const dotsHtml = dotColors
        .map((c) => `<span class="swarm-hud-dot" style="background:${c}"></span>`)
        .join('');

      this.hud.innerHTML = `
        <div class="swarm-hud-dots">${dotsHtml}</div>
        <div class="swarm-hud-status" id="swarmHudStatus">Scanning memories...</div>
        <div class="swarm-hud-progress" id="swarmHudProgressWrap">
          <div class="swarm-hud-progress-bar" id="swarmHudBar"></div>
        </div>
        <div class="swarm-hud-actions">
          <button type="button" class="swarm-hud-btn" id="swarmSpeedBtn" title="切换构建倍速">1x</button>
          <button type="button" class="swarm-hud-btn is-primary" id="swarmHudReplayBtn" style="display:none;">↻ Replay</button>
          <button type="button" class="swarm-hud-btn btn-close" id="swarmSkipBtn" title="跳过动画 (Esc)">✕</button>
        </div>
      `;
      document.body.appendChild(this.hud);

      this.hudStatus = this.hud.querySelector('#swarmHudStatus');
      this.hudBar = this.hud.querySelector('#swarmHudBar');
      this.hudProgressWrap = this.hud.querySelector('#swarmHudProgressWrap');
      this.speedBtn = this.hud.querySelector('#swarmSpeedBtn');
      this.hudReplayBtn = this.hud.querySelector('#swarmHudReplayBtn');
      this.skipBtn = this.hud.querySelector('#swarmSkipBtn');

      this.speedBtn.addEventListener('click', () => {
        this.speedMultiplier = this.speedMultiplier === 1 ? 2 : 1;
        this.speedBtn.textContent = `${this.speedMultiplier}x`;
      });

      this.hudReplayBtn.addEventListener('click', () => {
        this.start(true);
      });

      this.skipBtn.addEventListener('click', () => {
        this.skip();
      });

      requestAnimationFrame(() => {
        if (this.hud) this.hud.classList.add('is-visible');
        if (this.centerBadge) this.centerBadge.classList.add('is-visible');
      });
    },

    createAgents() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cx = vw * 0.5;
      const cy = vh * 0.46;

      this.agents = this.AGENTS_DATA.map((item, index) => {
        const angle = (index / this.AGENTS_DATA.length) * Math.PI * 2;
        const startDist = Math.max(vw, vh) * (0.42 + (index % 3) * 0.12);
        const startX = cx + Math.cos(angle) * startDist;
        const startY = cy + Math.sin(angle) * startDist;

        // 创建 2 个半透明残影节点（复刻视频第1帧环绕幻影）
        const ghosts = [0.38, 0.18].map((alpha, gIdx) => {
          const g = document.createElement('div');
          g.className = 'swarm-cursor-ghost';
          g.style.opacity = String(alpha);
          g.innerHTML = `<div class="swarm-cursor-icon" style="transform:scale(${0.92 - gIdx * 0.08})">${this.ICONS.arrow(item.color)}</div>`;
          this.stage.appendChild(g);
          return { el: g, x: startX, y: startY };
        });

        const el = document.createElement('div');
        el.className = 'swarm-cursor';
        el.style.setProperty('--agent-color', item.color);
        el.innerHTML = `
          <div class="swarm-cursor-icon">${this.ICONS.arrow(item.color)}</div>
          <div class="swarm-cursor-tag">
            <span>${item.name}</span>
            <span class="swarm-cursor-tag-meta" style="display:none;"></span>
          </div>
        `;
        this.stage.appendChild(el);

        const agent = {
          id: index,
          name: item.name,
          color: item.color,
          el,
          iconEl: el.querySelector('.swarm-cursor-icon'),
          metaEl: el.querySelector('.swarm-cursor-tag-meta'),
          ghosts,
          x: startX,
          y: startY,
          prevX: startX,
          prevY: startY,
          angle,
          orbitRadius: 44 + (index % 4) * 22,
          orbitSpeed: (index % 2 === 0 ? 1 : -1) * (2.5 + (index % 3) * 0.45),
          speedFactor: 0.88 + (index % 4) * 0.1,
          tool: 'arrow',
          busy: false,
          retired: false
        };

        this.setAgentPos(agent, startX, startY);
        return agent;
      });
    },

    setAgentPos(agent, x, y) {
      if (agent.retired) return;
      // 更新残影坐标（滞后跟随）
      if (agent.ghosts && agent.ghosts.length) {
        for (let i = agent.ghosts.length - 1; i > 0; i--) {
          agent.ghosts[i].x += (agent.ghosts[i - 1].x - agent.ghosts[i].x) * 0.42;
          agent.ghosts[i].y += (agent.ghosts[i - 1].y - agent.ghosts[i].y) * 0.42;
          agent.ghosts[i].el.style.transform = `translate3d(${agent.ghosts[i].x.toFixed(1)}px, ${agent.ghosts[i].y.toFixed(1)}px, 0)`;
        }
        agent.ghosts[0].x += (agent.x - agent.ghosts[0].x) * 0.48;
        agent.ghosts[0].y += (agent.y - agent.ghosts[0].y) * 0.48;
        agent.ghosts[0].el.style.transform = `translate3d(${agent.ghosts[0].x.toFixed(1)}px, ${agent.ghosts[0].y.toFixed(1)}px, 0)`;
      }

      agent.prevX = agent.x;
      agent.prevY = agent.y;
      agent.x = x;
      agent.y = y;
      agent.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    },

    setAgentTool(agent, tool, metaText = '') {
      if (agent.retired) return;
      if (agent.tool !== tool) {
        agent.tool = tool;
        const renderer = this.ICONS[tool] || this.ICONS.arrow;
        agent.iconEl.innerHTML = renderer(agent.color);
      }
      if (metaText) {
        agent.metaEl.textContent = metaText;
        agent.metaEl.style.display = 'inline';
      } else {
        agent.metaEl.style.display = 'none';
      }
    },

    spawnRipple(x, y, color) {
      if (!this.stage) return;
      const r = document.createElement('div');
      r.className = 'swarm-ripple';
      r.style.left = `${x}px`;
      r.style.top = `${y}px`;
      r.style.setProperty('--ripple-color', color);
      this.stage.appendChild(r);
      setTimeout(() => r.remove(), 600);
    },

    // 使用四次方缓动 (Quartic Easing) + 贝塞尔曲线平滑移动 Agent 到指定坐标
    moveAgentTo(agent, targetX, targetY, durationMs, onUpdate, easingType = 'outQuart') {
      return new Promise((resolve) => {
        if (agent.retired) return resolve();
        const startX = agent.x;
        const startY = agent.y;
        const dx = targetX - startX;
        const dy = targetY - startY;
        const ctrlX = startX + dx * 0.46 - dy * 0.14;
        const ctrlY = startY + dy * 0.46 + dx * 0.14;

        let elapsed = 0;
        let lastTime = performance.now();
        const actualDuration = Math.max(20, durationMs / (agent.speedFactor || 1));

        const step = (now) => {
          if (!this.isRunning || agent.retired) return resolve();
          const dt = (now - lastTime) * this.speedMultiplier;
          lastTime = now;
          elapsed += dt;

          const t = Math.min(1, elapsed / actualDuration);
          // 采用四次方缓动曲线（默认 outQuart，初速度充沛零停滞，落点细腻减速）
          const ease =
            easingType === 'linear'
              ? t
              : easingType === 'inOutQuart'
              ? this.easeInOutQuart(t)
              : this.easeOutQuart(t);

          const inv = 1 - ease;
          const curX = inv * inv * startX + 2 * inv * ease * ctrlX + ease * ease * targetX;
          const curY = inv * inv * startY + 2 * inv * ease * ctrlY + ease * ease * targetY;

          this.setAgentPos(agent, curX, curY);
          if (onUpdate) onUpdate(ease, curX, curY, t);

          if (t < 1) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        };

        requestAnimationFrame(step);
      });
    },

    // 单个 Agent 完成所有分配的任务后，独自飞向右下角移出屏幕并走消失流程
    async retireAgent(agent) {
      if (!this.isRunning || agent.retired) return;
      this.setAgentTool(agent, 'arrow');

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // 目标点在右下角屏幕外侧，每个 Agent 带一点扇形偏移避免重叠
      const exitX = vw + 75 + (agent.id % 4) * 32;
      const exitY = vh + 65 + Math.floor(agent.id / 4) * 28;
      if (agent.y > vh + 120) {
        agent.y = vh + 40;
      }

      await this.moveAgentTo(
        agent,
        exitX,
        exitY,
        560 + (agent.id % 3) * 70,
        (ease) => {
          const alpha = Math.max(0, 1 - Math.pow(ease, 2));
          agent.el.style.opacity = alpha.toFixed(2);
          agent.ghosts.forEach((g, idx) => {
            g.el.style.opacity = (alpha * (0.35 - idx * 0.15)).toFixed(2);
          });
        },
        'outQuart'
      );

      agent.retired = true;
      if (agent.el) agent.el.remove();
      if (agent.ghosts) agent.ghosts.forEach((g) => g.el.remove());
    },

    wait(ms) {
      return new Promise((resolve) => {
        let elapsed = 0;
        let last = performance.now();
        const tick = (now) => {
          if (!this.isRunning) return resolve();
          elapsed += (now - last) * this.speedMultiplier;
          last = now;
          if (elapsed >= ms) return resolve();
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    },

    async runTimeline(tasks) {
      const startTime = performance.now();
      const totalLayers = Math.max(1, tasks.length);
      let completedLayers = 0;

      const updateHudProgress = () => {
        if (!this.hudStatus || !this.hudBar) return;
        const pct = Math.min(100, Math.round((completedLayers / totalLayers) * 100));
        this.hudStatus.innerHTML = `<strong>${this.agents.length} 羁绊</strong> · ${completedLayers} / ${totalLayers} layers`;
        this.hudBar.style.width = `${pct}%`;
      };

      // ==========================================
      // 阶段 1：中心风暴螺旋集结 (0 ~ 680ms，紧凑旋入不减速停滞)
      // ==========================================
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cx = vw * 0.5;
      const cy = vh * 0.46;

      await new Promise((resolve) => {
        let elapsed = 0;
        let last = performance.now();
        const duration = 680;

        const vortexStep = (now) => {
          if (!this.isRunning) return resolve();
          const dt = (now - last) * this.speedMultiplier;
          last = now;
          elapsed += dt;
          const progress = Math.min(1, elapsed / duration);
          const ease = this.easeOutQuart(progress);

          this.agents.forEach((agent) => {
            const currentAngle = agent.angle + progress * agent.orbitSpeed * 2.1;
            const startR = Math.max(vw, vh) * 0.44;
            const r = startR * (1 - ease) + agent.orbitRadius * ease;
            const x = cx + Math.cos(currentAngle) * r;
            const y = cy + Math.sin(currentAngle) * r * 0.78;
            this.setAgentPos(agent, x, y);
          });

          if (this.hudBar) {
            this.hudBar.style.width = `${Math.round(progress * 10)}%`;
          }

          if (progress < 1) {
            requestAnimationFrame(vortexStep);
          } else {
            resolve();
          }
        };
        requestAnimationFrame(vortexStep);
      });

      if (!this.isRunning) return;

      // ==========================================
      // 阶段 2 & 3 无缝并发：中心徽章散开瞬间，12 个鼠标 0 停顿同时冲向各自首个任务！
      // ==========================================
      this.centerBadge.classList.remove('is-visible');
      this.centerBadge.classList.add('is-dispersing');
      this.backdrop.classList.add('is-fading');
      updateHudProgress();

      // 直接取真实内容网格 .hero-grid（不含 .container 的 24px 左右内边距），确保垂直红线与左列内容 100% 像素级对齐！
      const contentGridEl =
        document.querySelector('.hero-grid') ||
        document.querySelector('.hero .container') ||
        document.body;
      const navbarEl = document.querySelector('.navbar');
      const gridRect = contentGridEl.getBoundingClientRect();
      const navBottom = navbarEl ? Math.round(navbarEl.getBoundingClientRect().bottom) : 56;

      const abLeft = Math.round(gridRect.left);
      const abTop = Math.round(gridRect.top);
      const abWidth = Math.round(gridRect.width);
      const abHeight = Math.round(gridRect.height);

      // 红色垂直标尺线精准锁定内容区左边界，水平标尺线精准锁定导航栏底边与 Hero 底边
      this.guideV.style.left = `${abLeft}px`;
      this.guideH1.style.top = `${navBottom}px`;
      this.guideH2.style.top = `${abTop + abHeight}px`;
      this.guideV.classList.add('is-active');
      this.guideH1.classList.add('is-active');
      this.guideH2.classList.add('is-active');

      // 主画板外框贴合 .hero-grid 真实边界
      const artboard = document.createElement('div');
      artboard.className = 'swarm-wireframe';
      artboard.style.setProperty('--wf-color', '#0c8ce9');
      artboard.innerHTML = `
        <span class="swarm-wf-handle-bl"></span>
        <span class="swarm-wf-handle-br"></span>
        <span class="swarm-wf-size" id="artboardSizeTag">0 × 0</span>
      `;
      this.stage.appendChild(artboard);
      const artboardTag = artboard.querySelector('#artboardSizeTag');

      const syncArtboardOnScroll = () => {
        if (!this.isRunning || !artboard.isConnected) return;
        const r = contentGridEl.getBoundingClientRect();
        artboard.style.left = `${Math.round(r.left)}px`;
        artboard.style.top = `${Math.round(r.top)}px`;
        artboard.style.width = `${Math.round(r.width)}px`;
        artboard.style.height = `${Math.round(r.height)}px`;
      };

      // 1 号 Agent (友情) 负责拉主画板框的任务函数（与其他 11 个 Agent 并发执行，绝不阻塞全员！）
      const buildArtboardTask = async (leadAgent) => {
        leadAgent.busy = true;
        this.setAgentTool(leadAgent, 'crosshair', 'Artboard');
        await this.moveAgentTo(leadAgent, abLeft, abTop, 240);
        if (!this.isRunning) return;
        await this.moveAgentTo(leadAgent, abLeft + abWidth, abTop + abHeight, 360, (ease) => {
          const curRect = contentGridEl.getBoundingClientRect();
          const curL = Math.round(curRect.left);
          const curT = Math.round(curRect.top);
          const curW = Math.max(20, Math.round(curRect.width * ease));
          const curH = Math.max(20, Math.round(curRect.height * ease));
          artboard.style.left = `${curL}px`;
          artboard.style.top = `${curT}px`;
          artboard.style.width = `${curW}px`;
          artboard.style.height = `${curH}px`;
          if (artboardTag) artboardTag.textContent = `${curW} × ${curH}`;
        });
        this.spawnRipple(abLeft + abWidth, abTop + abHeight, leadAgent.color);
        leadAgent.busy = false;
        this.setAgentTool(leadAgent, 'arrow');
        artboard.style.background = 'transparent';
        artboard.style.borderColor = 'rgba(12, 140, 233, 0.28)';
        window.addEventListener('scroll', syncArtboardOnScroll, { passive: true });
        this.scrollSyncCleanup = () => window.removeEventListener('scroll', syncArtboardOnScroll);
      };

      const executeTask = async (agent, task, isFirstTask = false) => {
        if (!this.isRunning) return;
        agent.busy = true;

        // 首个任务直接在空中通过不同的飞行时长形成错落感，不在原地停顿等待！
        const extraFlight = isFirstTask ? (agent.id % 6) * 42 : 0;

        const initRect = task.el.getBoundingClientRect();
        if (initRect.top >= 0 && initRect.top <= window.innerHeight && this.guideV && this.guideH2) {
          this.guideV.style.left = `${Math.round(initRect.left)}px`;
          this.guideH2.style.top = `${Math.round(initRect.bottom)}px`;
        }

        if (task.type === 'box') {
          // 【拉框生成模式】：采用 clip-path 揭开元素，不缩放元素盒子本身，保证选区框与真实边缘 100% 重合
          this.setAgentTool(agent, 'crosshair', task.metaLabel);
          await this.moveAgentTo(agent, Math.round(initRect.left), Math.round(initRect.top), 290 + extraFlight);
          if (!this.isRunning) return;

          const wf = document.createElement('div');
          wf.className = 'swarm-wireframe';
          wf.style.setProperty('--wf-color', agent.color);
          wf.innerHTML = `
            <span class="swarm-wf-handle-bl"></span>
            <span class="swarm-wf-handle-br"></span>
            <span class="swarm-wf-size">0 × 0</span>
          `;
          this.stage.appendChild(wf);
          const sizeLabel = wf.querySelector('.swarm-wf-size');

          task.el.classList.add('swarm-target-building');
          task.el.classList.remove('swarm-target-hidden');

          const targetRect = task.el.getBoundingClientRect();
          await this.moveAgentTo(
            agent,
            Math.round(targetRect.right),
            Math.round(targetRect.bottom),
            400,
            (ease) => {
              // 每帧实时读取最新位置（兼容用户手动滚动），与真实卡片边界零误差贴合
              const curRect = task.el.getBoundingClientRect();
              const l = Math.round(curRect.left);
              const t = Math.round(curRect.top);
              const w = Math.max(6, Math.round(curRect.width * ease));
              const h = Math.max(6, Math.round(curRect.height * ease));
              wf.style.left = `${l}px`;
              wf.style.top = `${t}px`;
              wf.style.width = `${w}px`;
              wf.style.height = `${h}px`;
              sizeLabel.textContent = `${w} × ${h}`;

              const clipRight = Math.max(0, 100 - ease * 100).toFixed(1);
              const clipBottom = Math.max(0, 100 - ease * 100).toFixed(1);
              task.el.style.clipPath = `inset(0 ${clipRight}% ${clipBottom}% 0)`;
              task.el.style.opacity = String(Math.min(1, ease * 1.2));

              if (curRect.top >= 0 && curRect.top <= window.innerHeight && this.guideH2) {
                this.guideV.style.left = `${l}px`;
                this.guideH2.style.top = `${t + h}px`;
              }
            },
            'outQuart'
          );

          task.el.style.clipPath = '';
          task.el.style.opacity = '';
          const endRect = task.el.getBoundingClientRect();
          this.spawnRipple(Math.round(endRect.right), Math.round(endRect.bottom), agent.color);

          wf.style.opacity = '0';
          setTimeout(() => wf.remove(), 240);
        } else if (task.type === 'type') {
          // 【打字机生成模式】：调慢打字速度，让人眼清晰看到逐字敲击与蓝色高亮选区
          this.setAgentTool(agent, 'ibeam', 'Typing');
          await this.moveAgentTo(
            agent,
            Math.round(initRect.left + 4),
            Math.round(initRect.top + initRect.height * 0.5),
            280 + extraFlight
          );
          if (!this.isRunning) return;

          task.el.classList.remove('swarm-target-hidden');
          task.el.classList.add('swarm-text-highlight');
          const fullText = task.origText || '';
          const len = fullText.length;
          // 调慢打字速度：单字 58ms，最短 520ms，最长 1850ms
          const typeDuration = Math.min(1850, Math.max(520, len * 58));

          const curRect = task.el.getBoundingClientRect();
          await this.moveAgentTo(
            agent,
            Math.round(curRect.left + Math.min(curRect.width, Math.max(48, len * 13))),
            Math.round(curRect.top + curRect.height * 0.5),
            typeDuration,
            (_ease, _cx, _cy, rawT) => {
              const charCount = Math.max(1, Math.round(len * rawT));
              task.el.textContent = fullText.slice(0, charCount);
            },
            'outQuart'
          );

          task.el.textContent = fullText;
          task.el.style.minHeight = '';
          setTimeout(() => {
            task.el.classList.remove('swarm-text-highlight');
          }, 260);
        } else {
          // 【快速安放组件模式】
          this.setAgentTool(agent, 'hand', task.metaLabel);
          const targetX = Math.round(initRect.left + initRect.width * 0.5);
          const targetY = Math.round(initRect.top + initRect.height * 0.5);
          await this.moveAgentTo(agent, targetX, targetY, 270 + extraFlight);
          if (!this.isRunning) return;

          const curRect = task.el.getBoundingClientRect();
          const wf = document.createElement('div');
          wf.className = 'swarm-wireframe';
          wf.style.setProperty('--wf-color', agent.color);
          wf.style.left = `${Math.round(curRect.left)}px`;
          wf.style.top = `${Math.round(curRect.top)}px`;
          wf.style.width = `${Math.round(curRect.width)}px`;
          wf.style.height = `${Math.round(curRect.height)}px`;
          wf.innerHTML = `<span class="swarm-wf-size">${Math.round(curRect.width)} × ${Math.round(curRect.height)}</span>`;
          this.stage.appendChild(wf);

          agent.el.classList.add('is-clicking');
          this.spawnRipple(Math.round(curRect.left + curRect.width * 0.5), Math.round(curRect.top + curRect.height * 0.5), agent.color);
          task.el.classList.add('swarm-target-building');
          task.el.classList.remove('swarm-target-hidden');

          await this.wait(150);
          agent.el.classList.remove('is-clicking');
          wf.style.opacity = '0';
          setTimeout(() => wf.remove(), 220);
        }

        this.setAgentTool(agent, 'arrow');
        agent.busy = false;
        completedLayers++;
        updateHudProgress();
      };

      // 建立共享任务队列：旋涡散开的同一毫秒，12 个 Agent 0 等待同时出发，谁干完谁独自从右下角退场！
      const taskQueue = [...tasks];
      const workerPromises = this.agents.map(async (agent, idx) => {
        let isFirst = true;
        if (idx === 1) {
          // 1号 Agent 先并发拉开主画板外框，拉完无缝继续从队列取任务
          await buildArtboardTask(agent);
          isFirst = false;
        }
        while (this.isRunning && taskQueue.length > 0) {
          const nextTask = taskQueue.shift();
          if (!nextTask) break;
          await executeTask(agent, nextTask, isFirst);
          isFirst = false;
        }
        // 该 Agent 已无新任务可领，立即独自飞向右下角移出屏幕并走消失流程
        await this.retireAgent(agent);
      });

      await Promise.all(workerPromises);

      if (!this.isRunning) return;

      // ==========================================
      // 阶段 4：全部 Agent 已陆续退场，收起辅助线并更新 HUD
      // ==========================================
      if (this.scrollSyncCleanup) {
        this.scrollSyncCleanup();
        this.scrollSyncCleanup = null;
      }
      artboard.style.opacity = '0';
      this.guideV.classList.remove('is-active');
      this.guideH1.classList.remove('is-active');
      this.guideH2.classList.remove('is-active');

      const totalSeconds = ((performance.now() - startTime) / 1000).toFixed(1);
      if (this.hudStatus) {
        this.hudStatus.innerHTML = `Built by <strong>${this.agents.length} 羁绊</strong> in ${totalSeconds}s`;
      }
      if (this.hudProgressWrap) {
        this.hudProgressWrap.style.display = 'none';
      }
      if (this.speedBtn) {
        this.speedBtn.style.display = 'none';
      }
      if (this.hudReplayBtn) {
        this.hudReplayBtn.style.display = 'inline-flex';
      }

      await this.wait(300);
      if (!this.isRunning) return;

      if (this.stage) {
        this.stage.remove();
        this.stage = null;
      }
      document.documentElement.classList.remove('swarm-running');

      this.autoHideTimer = setTimeout(() => {
        this.cleanup(false);
      }, 3800);
    },

    skip() {
      this.cleanup(true);
    },

    cleanup(immediate = true) {
      this.isRunning = false;
      if (this.scrollSyncCleanup) {
        this.scrollSyncCleanup();
        this.scrollSyncCleanup = null;
      }
      if (this.autoHideTimer) {
        clearTimeout(this.autoHideTimer);
        this.autoHideTimer = null;
      }
      if (this.escHandler) {
        window.removeEventListener('keydown', this.escHandler);
        this.escHandler = null;
      }

      document.documentElement.classList.remove('swarm-intro-preparing', 'swarm-running');

      // 立即恢复所有受控 DOM 元素的原始文本与可见性
      document.querySelectorAll('.swarm-target-hidden, .swarm-target-building, .swarm-text-highlight').forEach((el) => {
        el.classList.remove('swarm-target-hidden', 'swarm-target-building', 'swarm-text-highlight');
        el.style.opacity = '';
        el.style.transform = '';
        el.style.transformOrigin = '';
        el.style.clipPath = '';
        el.style.minHeight = '';
        if (el.dataset.swarmOrigText) {
          el.textContent = el.dataset.swarmOrigText;
        }
      });

      this.prepareAllPostsGridImmediately();

      if (this.stage) {
        this.stage.remove();
        this.stage = null;
      }

      if (this.hud) {
        if (immediate) {
          this.hud.remove();
          this.hud = null;
        } else {
          const hudRef = this.hud;
          this.hud = null;
          hudRef.classList.remove('is-visible');
          setTimeout(() => hudRef.remove(), 380);
        }
      }
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
    SwarmIntroManager.init();
  });

})();
