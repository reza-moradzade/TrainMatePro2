export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  
  // DevTools
  devtools: { 
    enabled: process.env.NODE_ENV === 'development',
    timeline: {
      enabled: true
    }
  },
  
  // تنظیمات اپلیکیشن
  app: {
    head: {
      title: 'TrainMate Pro',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
        { name: 'description', content: 'سیستم مدیریت تمرین مربی و شاگرد' },
        { name: 'theme-color', content: '#667eea' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'TrainMate' },
        { name: 'application-name', content: 'TrainMate Pro' },
        { name: 'msapplication-TileColor', content: '#667eea' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'format-detection', content: 'email=no' },
        { name: 'og:title', content: 'TrainMate Pro' },
        { name: 'og:description', content: 'سیستم مدیریت تمرین مربی و شاگرد' },
        { name: 'og:type', content: 'website' },
        { name: 'og:site_name', content: 'TrainMate Pro' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/icons/apple-icon-180.png' },
        { rel: 'manifest', href: '/manifest.json' }
      ],
      style: [
        { 
          children: `
            @font-face {
              font-family: 'Vazir';
              src: url('/fonts/Vazir.woff2') format('woff2');
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
            body {
              font-family: 'Vazir', 'Segoe UI', Tahoma, sans-serif;
            }
          `
        }
      ]
    },
    
    pageTransition: {
      name: 'fade',
      mode: 'out-in'
    },
    
    layoutTransition: {
      name: 'slide',
      mode: 'out-in'
    }
  },
  
  // ✅ CSS - فقط main.css رو لود کن (tailwind از طریق ماژول)
  css: [
    '~/assets/css/main.css'
  ],
  
  // ✅ ماژول‌ها - ماژول i18n رو کامنت کردم چون نصب نیست
  modules: [
    '@nuxtjs/tailwindcss',
    // '@vite-pwa/nuxt', // فعلاً کامنت - بعداً فعال کن
    // '@nuxtjs/i18n' // فعلاً کامنت - نیاز به نصب داره
  ],
  
  // ✅ Tailwind CSS - مسیر درست
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.ts',
    exposeConfig: false,
    viewer: false
  },
  
  // ✅ PWA - ساده‌سازی شده
  pwa: {
    manifest: {
      name: 'TrainMate Pro',
      short_name: 'TrainMate',
      description: 'سیستم مدیریت تمرین مربی و شاگرد',
      theme_color: '#667eea',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/'
    },
    registerType: 'autoUpdate',
    devOptions: {
      enabled: false
    }
  },
  
  // ✅ Nitro - بدون تغییر
  nitro: {
    preset: 'node-server',
    output: {
      dir: '.output',
      serverDir: '.output/server',
      publicDir: '.output/public'
    },
    storage: {
      db: {
        driver: 'fs',
        base: './.data'
      }
    },
    compressPublicAssets: true,
    minify: true,
    esbuild: {
      options: {
        target: 'es2020'
      }
    }
  },
  
  // ✅ Runtime Config - بدون تغییر
  runtimeConfig: {
    sessionSecret: process.env.SESSION_SECRET || 'dev-secret',
    databasePath: process.env.DATABASE_PATH || './database.sqlite',
    
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3000/api',
      appName: 'TrainMate Pro',
      appVersion: '1.0.0',
      supportEmail: 'support@trainmate.com',
      mobileBreakpoint: 768,
      tabletBreakpoint: 1024,
      enablePullToRefresh: true,
      enableSwipeGestures: true,
      enableOfflineMode: true,
      enablePushNotifications: false,
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY || ''
    }
  },
  
  // ✅ Vite - حذف SCSS چون فایلش نیست
  vite: {
    build: {
      target: 'es2020',
      cssTarget: 'es2020',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'vue-router']
          }
        }
      }
    },
    server: {
      fs: {
        strict: false
      }
    }
  },
  
  // ✅ SSR و Sourcemap
  ssr: true,
  sourcemap: process.env.NODE_ENV !== 'production',
  
  telemetry: false,
  
  // ✅ Route Rules
  routeRules: {
    '/': { prerender: true },
    '/dashboard': { ssr: false },
    '/student-dashboard': { ssr: false },
    '/api/**': { cors: true }
  },
  
  // ✅ Components - مسیرها درست ولی پوشه‌ها وجود نداره (Warning می‌دهد ولی ایراد نداره)
  components: {
    dirs: [
      '~/components',
      '~/components/coach',
      '~/components/student',
      '~/components/shared'
    ],
    deep: true,
    global: true
  },
  
  // ✅ Imports
  imports: {
    autoImport: true,
    dirs: [
      'composables',
      'composables/**'
    ]
  },
  
  // ✅ i18n - کامنت شده چون نصب نیست
  // i18n: {
  //   locales: [
  //     { code: 'fa', iso: 'fa-IR', name: 'فارسی', file: 'fa.json', dir: 'rtl' }
  //   ],
  //   defaultLocale: 'fa',
  //   strategy: 'prefix_except_default',
  //   detectBrowserLanguage: false,
  //   vueI18n: './i18n.config.ts'
  // },
  
  // ✅ Performance
  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
    viewTransition: true
  },
  
  // ❌ Security - کامنت شده چون ماژول نصب نیست
  // security: {
  //   headers: {
  //     contentSecurityPolicy: {
  //       'base-uri': ["'self'"],
  //       'font-src': ["'self'", 'https:', 'data:'],
  //       'form-action': ["'self'"],
  //       'frame-ancestors': ["'self'"],
  //       'img-src': ["'self'", 'data:', 'https:'],
  //       'object-src': ["'none'"],
  //       'script-src-attr': ["'none'"],
  //       'style-src': ["'self'", 'https:', "'unsafe-inline'"],
  //       'upgrade-insecure-requests': true
  //     },
  //     crossOriginEmbedderPolicy: false,
  //     crossOriginResourcePolicy: 'cross-origin',
  //     xContentTypeOptions: 'nosniff',
  //     xDownloadOptions: 'noopen',
  //     xFrameOptions: 'SAMEORIGIN',
  //     xPermittedCrossDomainPolicies: 'none',
  //     xXSSProtection: '0'
  //   },
  //   rateLimiter: {
  //     headers: true,
  //     interval: 60000,
  //     tokensPerInterval: 100
  //   }
  // }
})