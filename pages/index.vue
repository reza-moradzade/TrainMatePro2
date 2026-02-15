<template>
  <div class="login-page">
    <!-- پس‌زمینه متحرک برای موبایل -->
    <div class="background-animation">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
    <!-- کانتینر فرم لاگین -->
    <div class="login-container" :class="{ 'mobile': isMobile }">
      <!-- کامپوننت فرم لاگین -->
      <LoginForm />
      <!-- فوتر برای موبایل -->
      <div class="mobile-footer" v-if="isMobile">
        <p class="copyright">© ۲۰۲۶ TrainMate Pro</p>
        <p class="version">نسخه ۱.۰.۰</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// بررسی موبایل بودن دستگاه
const isMobile = ref(false)

// تابع بررسی سایز صفحه
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// هوک‌های چرخه حیات
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  direction: rtl;
}

/* انیمیشن پس‌زمینه */
.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 20s infinite;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -150px;
  animation-delay: 0s;
}

.circle-2 {
  width: 400px;
  height: 400px;
  bottom: -200px;
  left: -200px;
  animation-delay: 5s;
}

.circle-3 {
  width: 200px;
  height: 200px;
  bottom: 50%;
  right: 10%;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

/* برند موبایل */
.mobile-brand {
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  z-index: 10;
  animation: fadeInDown 0.8s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.brand-icon {
  font-size: 3.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.brand-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0.5rem 0 0.25rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.brand-subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
  margin: 0;
  font-weight: 300;
}

/* کانتینر اصلی */
.login-container {
  width: 100%;
  max-width: 450px;
  position: relative;
  z-index: 20;
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* لوگوی دسکتاپ */
.desktop-logo {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  animation: glow 2s infinite alternate;
}

@keyframes glow {
  from {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  }
  to {
    box-shadow: 0 0 40px rgba(255, 255, 255, 0.4);
  }
}

.logo-icon {
  font-size: 2.5rem;
}

.logo-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.logo-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
  font-weight: 300;
}

/* فوتر موبایل */
.mobile-footer {
  text-align: center;
  margin-top: 2rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
}

.mobile-footer p {
  margin: 0.25rem 0;
}

.copyright {
  font-weight: 500;
}

.version {
  opacity: 0.8;
}

/* استایل‌های ریسپانسیو */
@media (max-width: 768px) {
  .login-page {
    padding: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .login-container.mobile {
    max-width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 80px 20px 20px;
  }

  .circle-1 {
    width: 200px;
    height: 200px;
    top: -100px;
    right: -100px;
  }

  .circle-2 {
    width: 300px;
    height: 300px;
    bottom: -150px;
    left: -150px;
  }

  .circle-3 {
    width: 150px;
    height: 150px;
    bottom: 30%;
    right: 5%;
  }

  .brand-icon {
    font-size: 3rem;
  }

  .brand-title {
    font-size: 1.6rem;
  }

  .brand-subtitle {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .login-container.mobile {
    padding: 70px 16px 16px;
  }

  .mobile-brand {
    top: 30px;
  }

  .brand-icon {
    font-size: 2.8rem;
  }

  .brand-title {
    font-size: 1.5rem;
  }

  .brand-subtitle {
    font-size: 0.8rem;
  }

  .circle-1 {
    width: 150px;
    height: 150px;
    top: -75px;
    right: -75px;
  }

  .circle-2 {
    width: 250px;
    height: 250px;
    bottom: -125px;
    left: -125px;
  }

  .circle-3 {
    width: 100px;
    height: 100px;
  }
}

/* حالت افقی در موبایل */
@media (max-width: 768px) and (orientation: landscape) {
  .login-container.mobile {
    padding: 20px;
    justify-content: flex-start;
  }

  .mobile-brand {
    position: relative;
    top: 0;
    margin-bottom: 20px;
  }

  .brand-icon {
    font-size: 2.2rem;
  }

  .brand-title {
    font-size: 1.3rem;
  }

  .brand-subtitle {
    font-size: 0.75rem;
  }
}

/* دستگاه‌های با ارتفاع کم */
@media (max-height: 600px) {
  .login-container.mobile {
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .mobile-brand {
    position: relative;
    top: 0;
    margin-bottom: 20px;
  }

  .brand-icon {
    font-size: 2.2rem;
  }

  .brand-title {
    font-size: 1.3rem;
  }
}

/* تاچ بهینه‌سازی */
@media (hover: none) and (pointer: coarse) {
  .login-container {
    -webkit-tap-highlight-color: transparent;
  }
}

/* RTL کامل */
[dir="rtl"] .login-page {
  direction: rtl;
}

[dir="rtl"] .circle-1 {
  right: auto;
  left: -150px;
}

[dir="rtl"] .circle-2 {
  left: auto;
  right: -200px;
}

@media (max-width: 768px) {
  [dir="rtl"] .circle-1 {
    right: auto;
    left: -100px;
  }

  [dir="rtl"] .circle-2 {
    left: auto;
    right: -150px;
  }
}

@media (max-width: 480px) {
  [dir="rtl"] .circle-1 {
    right: auto;
    left: -75px;
  }

  [dir="rtl"] .circle-2 {
    left: auto;
    right: -125px;
  }
}

/* Safe Area Support */
@supports (padding: max(0px)) {
  .login-container.mobile {
    padding-top: max(80px, env(safe-area-inset-top));
    padding-bottom: max(20px, env(safe-area-inset-bottom));
    padding-left: max(20px, env(safe-area-inset-left));
    padding-right: max(20px, env(safe-area-inset-right));
  }

  .mobile-brand {
    top: max(40px, env(safe-area-inset-top));
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .circle,
  .brand-icon,
  .logo-circle,
  .login-container {
    animation: none;
    transition: none;
  }
}

/* Print Styles */
@media print {
  .login-page {
    background: white;
    min-height: auto;
  }

  .background-animation,
  .mobile-brand,
  .mobile-footer {
    display: none !important;
  }

  .login-container {
    box-shadow: none;
    border: 1px solid #ddd;
  }
}
</style>