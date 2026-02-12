
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Railway部署配置
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
    }
  },
  
  runtimeConfig: {
    sessionSecret: process.env.SESSION_SECRET || 'dev-secret',
    databasePath: process.env.DATABASE_PATH || './database.sqlite',
    
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  }
})