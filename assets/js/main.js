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
        const response = await fetch('{{ "/search.json" | relative_url }}');
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

    highlightText(text, query) {
      if (!query.trim()) return text;
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
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
          img.src = thumbSrc;
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
  });

})();
