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
  
  // ✅ CSS
  css: [
    '~/assets/css/main.css'
  ],
  
  // ✅ ماژول‌ها
  modules: [
    '@nuxtjs/tailwindcss',
    // '@vite-pwa/nuxt',
  ],
  
  // ✅ Tailwind CSS
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.ts',
    exposeConfig: false,
    viewer: false
  },
  
  // ✅ PWA
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
  
  // ✅ Nitro - بهینه برای Railway
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
        base: '/tmp/data' // Railway از /tmp استفاده کن برای ذخیره موقت
      }
    },
    compressPublicAssets: true,
    minify: true,
    esbuild: {
      options: {
        target: 'es2020'
      }
    },
    // Railway port
    serveStatic: true,
    timing: process.env.NODE_ENV === 'development'
  },
  
  // ✅ Runtime Config - با متغیر محیطی Railway
  runtimeConfig: {
    // سمت سرور
    sessionSecret: process.env.SESSION_SECRET || 'dev-secret',
    databasePath: process.env.DATABASE_PATH || '/tmp/database.sqlite', // Railway path
    exerciseApiUrl: process.env.EXERCISE_API_URL || 'https://exercise-api-production-1e19.up.railway.app/api/v1',
    
    // سمت کلاینت
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://trainmate-pro.up.railway.app',
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'https://trainmate-pro.up.railway.app/api',
      exerciseApiUrl: process.env.EXERCISE_API_URL || 'https://exercise-api-production-1e19.up.railway.app/api/v1',
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
  
  // ✅ Vite
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
  
  // ✅ Components
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
  
  // ✅ Performance
  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
    viewTransition: true
  },
  
  // ✅ Hooks برای Railway
  hooks: {
    'nitro:config': (config) => {
      // Railway port
      config.devServer = config.devServer || {}
      config.devServer.port = process.env.PORT || 3000
    }
  }
})
