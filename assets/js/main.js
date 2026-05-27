/**
 * Eganchiyu's Blog - 主交互逻辑
 * 功能：主题切换、移动端菜单、导航栏滚动效果
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

      // 初始化主题
      const saved = localStorage.getItem(this.STORAGE_KEY);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = saved || (prefersDark ? this.DARK : this.LIGHT);
      this.apply(theme);

      // 绑定点击事件
      this.toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === this.DARK ? this.LIGHT : this.DARK;
        this.apply(next);
        localStorage.setItem(this.STORAGE_KEY, next);
      });
    },

    apply(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      // 更新 meta theme-color
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.content = theme === this.DARK ? '#0f172a' : '#f0f8ff';
      }
    }
  };

  // ========== 移动端菜单 ==========
  const MobileMenu = {
    init() {
      this.toggle = document.getElementById('menuToggle');
      this.menu = document.getElementById('mobileMenu');
      if (!this.toggle || !this.menu) return;

      this.toggle.addEventListener('click', () => {
        this.menu.classList.toggle('active');
        this.toggle.textContent = this.menu.classList.contains('active') ? '✕' : '☰';
      });

      // 点击链接后关闭菜单
      this.menu.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
          this.menu.classList.remove('active');
          this.toggle.textContent = '☰';
        });
      });

      // 点击页面其他区域关闭菜单
      document.addEventListener('click', (e) => {
        if (!this.toggle.contains(e.target) && !this.menu.contains(e.target)) {
          this.menu.classList.remove('active');
          this.toggle.textContent = '☰';
        }
      });
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

  // ========== 初始化 ==========
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    MobileMenu.init();
    NavbarScroll.init();
    SmoothScroll.init();
  });

})();
