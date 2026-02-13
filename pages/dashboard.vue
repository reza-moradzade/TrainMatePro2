<template>
  <div class="dashboard-layout">
    <!-- Mobile Header - فقط در موبایل نمایش داده میشه -->
    <div class="mobile-header" v-if="isMobile">
      <button class="menu-toggle" @click="toggleSidebar">
        <span class="menu-icon" :class="{ 'active': sidebarOpen }">☰</span>
      </button>
      <div class="mobile-logo">
        <span class="logo-icon">💪</span>
        <span class="logo-text">پنل مربی</span>
      </div>
      <div class="mobile-actions">
        <button class="action-btn" @click="showProfile">
          <span class="avatar-small">{{ userInitials }}</span>
        </button>
      </div>
    </div>

    <!-- Overlay برای موبایل وقتی سایدبار بازه -->
    <div 
      class="sidebar-overlay" 
      v-if="isMobile && sidebarOpen" 
      @click="closeSidebar"
    ></div>

    <!-- سایدبار - ریسپانسیو -->
    <Sidebar 
      ref="sidebarRef"
      :class="{ 
        'mobile-open': sidebarOpen,
        'mobile-closed': isMobile && !sidebarOpen
      }" 
      @menu-changed="handleMobileMenuChange"
    />
    
    <!-- محتوای اصلی - ریسپانسیو -->
    <MainContent 
      :active-menu="activeMenu" 
      :class="{ 'mobile-mode': isMobile }"
    />
  </div>
</template>

<script setup>
// Active menu state
const activeMenu = ref('home')
const isMobile = ref(false)
const sidebarOpen = ref(false)
const sidebarRef = ref(null)
const userInitials = ref('CO')

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  // Auto close sidebar on mobile
  if (isMobile.value) {
    sidebarOpen.value = false
  } else {
    sidebarOpen.value = true
  }
}

// Toggle sidebar on mobile
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// Close sidebar
const closeSidebar = () => {
  sidebarOpen.value = false
}

// Handle menu change in mobile
const handleMobileMenuChange = (menuId) => {
  activeMenu.value = menuId
  if (isMobile.value) {
    sidebarOpen.value = false // Auto close sidebar after selection
  }
}

// Show profile (for mobile)
const showProfile = () => {
  // اینجا میتونی پروفایل رو نشون بدی
  console.log('Show profile')
}

// Fetch user data for avatar
const fetchUserData = async () => {
  try {
    const response = await $fetch('/api/auth/me')
    if (response.user) {
      const user = response.user
      if (user.fullName) {
        userInitials.value = user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
      }
    }
  } catch (error) {
    console.error('Failed to fetch user data:', error)
  }
}

// Menu change handler function
const handleMenuChange = (menuId) => {
  activeMenu.value = menuId
}

// Lifecycle hooks
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  fetchUserData()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
  background: #f8f9fa;
}

/* Mobile Header */
.mobile-header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  padding: 0 1rem;
  align-items: center;
  justify-content: space-between;
  direction: rtl;
}

.menu-toggle {
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
}

.menu-icon {
  font-size: 1.5rem;
  color: #333;
  transition: transform 0.3s ease;
}

.menu-icon.active {
  transform: rotate(90deg);
}

.mobile-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  font-size: 1.25rem;
}

.logo-text {
  font-weight: 600;
  color: #667eea;
  font-size: 1rem;
}

.mobile-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  padding: 0.25rem;
  border-radius: 50%;
  cursor: pointer;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-small {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Sidebar Overlay */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1002;
  animation: fadeIn 0.3s ease;
}

/* Responsive Sidebar */
.sidebar {
  width: 280px;
  height: 100vh;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .dashboard-layout {
    flex-direction: column;
    padding-top: 60px; /* Space for mobile header */
  }

  .mobile-header {
    display: flex;
  }

  .sidebar {
    position: fixed;
    top: 60px;
    right: 0;
    bottom: 0;
    width: 280px;
    height: calc(100vh - 60px);
    transform: translateX(100%);
    z-index: 1002;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .sidebar.mobile-closed {
    transform: translateX(100%);
  }

  .main-content {
    width: 100%;
    height: calc(100vh - 60px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .main-content.mobile-mode {
    padding: 1rem;
  }
}

/* Tablet Styles */
@media (min-width: 769px) and (max-width: 1024px) {
  .sidebar {
    width: 240px;
  }
}

/* Desktop Styles */
@media (min-width: 1025px) {
  .sidebar {
    width: 280px;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

/* RTL Support */
[dir="rtl"] .sidebar {
  right: auto;
  left: 0;
  transform: translateX(-100%);
}

[dir="rtl"] .sidebar.mobile-open {
  transform: translateX(0);
}

[dir="rtl"] .sidebar.mobile-closed {
  transform: translateX(-100%);
}

[dir="rtl"] .mobile-header {
  direction: rtl;
}

/* Touch-friendly improvements */
@media (hover: none) and (pointer: coarse) {
  .menu-toggle,
  .action-btn,
  .nav-link {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Prevent body scroll when sidebar is open */
body.sidebar-open {
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
}

/* Safe area for notched devices */
@supports (padding: max(0px)) {
  .mobile-header {
    padding-left: max(1rem, env(safe-area-inset-left));
    padding-right: max(1rem, env(safe-area-inset-right));
    padding-top: env(safe-area-inset-top);
  }

  .sidebar {
    padding-bottom: env(safe-area-inset-bottom);
  }

  .main-content {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* Loading state */
.dashboard-layout.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Performance optimizations */
.sidebar,
.main-content,
.mobile-header {
  will-change: transform;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .sidebar,
  .sidebar-overlay,
  .menu-icon {
    transition: none;
    animation: none;
  }
}

/* Landscape mode on mobile */
@media (max-width: 768px) and (orientation: landscape) {
  .mobile-header {
    height: 50px;
  }

  .sidebar {
    width: 240px;
  }

  .avatar-small {
    width: 32px;
    height: 32px;
  }
}

/* Print styles */
@media print {
  .mobile-header,
  .sidebar-overlay {
    display: none !important;
  }

  .sidebar {
    position: static;
    width: 280px;
    transform: none !important;
  }

  .dashboard-layout {
    padding-top: 0;
  }
}
</style>