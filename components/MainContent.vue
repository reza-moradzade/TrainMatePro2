<template>
  <div class="main-content" :class="{ 'mobile-mode': isMobile }">
    <!-- Back Button for Mobile (when not on home) -->
    <div v-if="isMobile && props.activeMenu !== 'home'" class="mobile-nav">
      <button class="back-button" @click="goBack">
        <span class="back-icon">←</span>
        <span class="back-text">بازگشت</span>
      </button>
      <h2 class="page-title">{{ getPageTitle(props.activeMenu) }}</h2>
    </div>

    <!-- Page Content -->
    <div class="content-area" :class="{ 'with-mobile-nav': isMobile && props.activeMenu !== 'home' }">
      <component 
        :is="currentComponent" 
        @menu-changed="handleMenuChange"
        @back="goBack"
      />
    </div>

    <!-- Loading Indicator -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>در حال بارگذاری...</p>
    </div>
  </div>
</template>

<script setup>
// Import page components
import HomePage from './HomePage.vue'
import StudentsList from './StudentsList.vue'
import AddStudent from './AddStudent.vue'
import WorkoutPrograms from './WorkoutPrograms.vue'
import CreateWorkout from './CreateWorkout.vue'

// Define available page components
const components = {
  home: HomePage,
  students: StudentsList,
  'add-student': AddStudent,
  'workouts': WorkoutPrograms,
  'create-workout': CreateWorkout,
}

// Props from parent component
const props = defineProps({
  activeMenu: {
    type: String,
    default: 'home'
  }
})

// Emit for parent component
const emit = defineEmits(['menu-changed'])

// State
const isMobile = ref(false)
const loading = ref(false)

// Page titles mapping
const pageTitles = {
  'home': 'داشبورد',
  'students': 'لیست شاگردان',
  'add-student': 'افزودن شاگرد',
  'workouts': 'برنامه‌های تمرینی',
  'create-workout': 'ایجاد برنامه جدید'
}

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// Get page title
const getPageTitle = (menuId) => {
  return pageTitles[menuId] || 'پنل مربی'
}

// Go back to previous page
const goBack = () => {
  // Emit home menu change
  emit('menu-changed', 'home')
}

// Current component based on selected menu
const currentComponent = computed(() => {
  return components[props.activeMenu] || HomePage
})

// Handle menu change from child components
const handleMenuChange = (menuId) => {
  emit('menu-changed', menuId)
}

// Lifecycle hooks
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.main-content {
  flex: 1;
  background: #f8f9fa;
  height: 100vh;
  overflow-y: auto;
  position: relative;
  transition: all 0.3s ease;
}

/* Content Area */
.content-area {
  padding: 2rem;
  height: 100%;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  transition: padding 0.3s ease;
}

/* Mobile Navigation */
.mobile-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  direction: rtl;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
  min-width: 44px;
}

.back-button:hover,
.back-button:active {
  background: #f5f5f5;
}

.back-icon {
  font-size: 1.2rem;
}

.back-text {
  font-size: 0.95rem;
}

.page-title {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  font-weight: 600;
  flex: 1;
  text-align: center;
}

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Desktop Styles */
@media (min-width: 1025px) {
  .content-area {
    padding: 2.5rem;
  }
}

/* Tablet Styles */
@media (min-width: 769px) and (max-width: 1024px) {
  .content-area {
    padding: 2rem;
  }
}

/* Mobile Styles */
@media (max-width: 768px) {
  .main-content.mobile-mode {
    height: calc(100vh - 60px); /* Adjust for mobile header */
  }

  .content-area {
    padding: 1.5rem;
  }

  .content-area.with-mobile-nav {
    padding-top: 1rem;
  }

  .mobile-nav {
    padding: 0.75rem 1rem;
  }

  .back-button {
    padding: 0.5rem;
  }

  .back-text {
    display: none; /* Hide text on very small screens */
  }

  .page-title {
    font-size: 1rem;
  }
}

/* Small Mobile Styles */
@media (max-width: 480px) {
  .content-area {
    padding: 1rem;
  }

  .mobile-nav {
    padding: 0.5rem 0.75rem;
  }

  .back-button {
    min-width: 40px;
    min-height: 40px;
  }

  .back-icon {
    font-size: 1.1rem;
  }
}

/* Landscape Mode */
@media (max-width: 768px) and (orientation: landscape) {
  .main-content.mobile-mode {
    height: calc(100vh - 50px);
  }

  .content-area {
    padding: 1rem;
  }

  .mobile-nav {
    padding: 0.5rem 1rem;
  }
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  .back-button {
    min-height: 48px;
    min-width: 48px;
  }

  .back-button:active {
    background: #f0f0f0;
    transform: scale(0.98);
  }
}

/* RTL Support */
[dir="rtl"] .back-icon {
  transform: rotate(180deg);
}

[dir="rtl"] .mobile-nav {
  flex-direction: row-reverse;
}

/* Smooth Scrolling */
.main-content {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* Custom Scrollbar */
.main-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.main-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.main-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
  transition: background 0.3s ease;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Mobile Scrollbar */
@media (max-width: 768px) {
  .main-content::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
}

/* Fade Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide Transitions for Mobile */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

/* Content Animations */
.content-area {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Safe Area Support */
@supports (padding: max(0px)) {
  .content-area {
    padding-bottom: max(2rem, env(safe-area-inset-bottom));
  }

  .mobile-nav {
    padding-top: max(0.75rem, env(safe-area-inset-top));
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .main-content,
  .content-area,
  .back-button,
  .loading-spinner {
    animation: none;
    transition: none;
    scroll-behavior: auto;
  }
}

/* Print Styles */
@media print {
  .mobile-nav,
  .loading-overlay {
    display: none !important;
  }

  .content-area {
    padding: 0;
  }
}
</style>