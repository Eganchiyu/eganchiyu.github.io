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
      });
    },

    apply(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.content = theme === this.DARK ? '#0f172a' : '#f0f8ff';
      }
      this.updateGiscusTheme(theme);
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
  });

})();
