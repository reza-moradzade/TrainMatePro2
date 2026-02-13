<template>
  <div class="sidebar" :class="{ 'mobile': isMobile }">
    <!-- Close Button for Mobile -->
    <button v-if="isMobile" class="sidebar-close-btn" @click="closeSidebar">
      <span class="close-icon">✕</span>
    </button>

    <div class="sidebar-header">
      <div class="header-content">
        <div class="logo-container">
          <span class="logo-icon">💪</span>
          <h2>پنل مربی</h2>
        </div>
        <div class="role-badge">مربی</div>
      </div>
      
      <!-- Coach Profile Summary for Mobile -->
      <div v-if="isMobile" class="mobile-profile-summary">
        <div class="profile-avatar">{{ userInitials }}</div>
        <div class="profile-info">
          <span class="profile-name">{{ userName }}</span>
          <span class="profile-email">{{ userEmail }}</span>
        </div>
      </div>
    </div>
    
    <nav class="sidebar-nav">
      <ul>
        <li v-for="item in menuItems" :key="item.id">
          <a
            href="#"
            :class="{ 
              active: activeMenu === item.id,
              'logout-item': item.id === 'logout'
            }"
            @click.prevent="setActiveMenu(item.id)"
            class="nav-link"
          >
            <span class="icon">{{ item.icon }}</span>
            <span class="text">{{ item.text }}</span>
            
            <!-- Active Indicator -->
            <span v-if="activeMenu === item.id" class="active-indicator"></span>
          </a>
        </li>
      </ul>
    </nav>
    
    <!-- Desktop Footer -->
    <div class="sidebar-footer" v-if="!isMobile">
      <div class="user-info">
        <div class="avatar">{{ userInitials }}</div>
        <div class="user-details">
          <span class="user-name">{{ userName }}</span>
          <span class="user-email">{{ userEmail }}</span>
          <span class="user-role">مربی</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  isMobile: {
    type: Boolean,
    default: false
  }
})

// Define navigation menu items FOR COACH ONLY
const menuItems = [
  { id: 'home', text: 'داشبورد', icon: '🏠' },
  { id: 'students', text: 'شاگردان', icon: '👥' },
  { id: 'add-student', text: 'افزودن شاگرد', icon: '➕' },
  { id: 'workouts', text: 'برنامه تمرینی', icon: '📅' },
  { id: 'create-workout', text: 'ایجاد برنامه', icon: '🏋️‍♂️' },
  { id: 'logout', text: 'خروج', icon: '🚪' }
]

// Active menu state
const activeMenu = ref('home')

// User information
const userName = ref('در حال بارگذاری...')
const userEmail = ref('')
const userInitials = ref('')

// Emit for parent component communication
const emit = defineEmits(['menu-changed', 'close'])

// Fetch user data on component mount
onMounted(async () => {
  await fetchUserData()
})

// Fetch user data from API
const fetchUserData = async () => {
  try {
    const response = await $fetch('/api/auth/me')
    
    console.log('User data response:', response)
    
    if (response.user) {
      const user = response.user
      userName.value = user.fullName
      userEmail.value = user.email
      // Generate initials from full name
      if (user.fullName && typeof user.fullName === 'string') {
        userInitials.value = user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
      } else {
        userInitials.value = 'CO'
      }
      console.log('Coach data loaded:', user.fullName)
    }
  } catch (error) {
    console.error('Failed to fetch user data:', error)
    // Redirect to login if not authenticated
    await navigateTo('/')
  }
}

// Function to change active menu
const setActiveMenu = async (menuId) => {
  if (menuId === 'logout') {
    await handleLogout()
    return
  }
  
  activeMenu.value = menuId
  emit('menu-changed', menuId)
  
  // Close sidebar on mobile after selection
  if (props.isMobile) {
    emit('close')
  }
}

// Logout function
const handleLogout = async () => {
  if (confirm('آیا مطمئنید که می‌خواهید خارج شوید؟')) {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      console.log('Logged out successfully')
      
      // Redirect to login page
      await navigateTo('/')
    } catch (error) {
      console.error('Logout error:', error)
      // Still redirect even if API call fails
      await navigateTo('/')
    }
  }
}

// Close sidebar
const closeSidebar = () => {
  emit('close')
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  height: 100vh;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  flex-direction: column;
  direction: rtl;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  transition: all 0.3s ease;
}

/* Mobile Styles */
.sidebar.mobile {
  width: 100%;
  max-width: 320px;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
}

/* Close Button for Mobile */
.sidebar-close-btn {
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.sidebar-close-btn:hover,
.sidebar-close-btn:active {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(0.95);
}

.close-icon {
  font-size: 1.2rem;
}

/* Header */
.sidebar-header {
  padding: 2rem 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  font-size: 1.5rem;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.role-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

/* Mobile Profile Summary */
.mobile-profile-summary {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.profile-avatar {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.profile-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.profile-name {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.profile-email {
  font-size: 0.85rem;
  opacity: 0.9;
  direction: ltr;
  text-align: right;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  margin-bottom: 0.5rem;
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  border-right: 3px solid transparent;
  position: relative;
  min-height: 44px; /* Touch target size */
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border-right-color: white;
}

/* Active Indicator */
.active-indicator {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 70%;
  background: white;
  border-radius: 0 3px 3px 0;
}

/* Logout Item */
.logout-item {
  margin-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
}

.icon {
  font-size: 1.2rem;
  margin-left: 0.75rem;
  width: 24px;
  text-align: center;
}

.text {
  font-size: 1rem;
  font-weight: 500;
  flex: 1;
}

/* Desktop Footer */
.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 45px;
  height: 45px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.user-details {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.user-name {
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.2rem;
}

.user-email {
  font-size: 0.8rem;
  opacity: 0.8;
  direction: ltr;
  text-align: right;
  margin-bottom: 0.2rem;
}

.user-role {
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  align-self: flex-start;
}

/* Tablet Styles */
@media (min-width: 769px) and (max-width: 1024px) {
  .sidebar {
    width: 240px;
  }
  
  .nav-link {
    padding: 0.875rem 1.25rem;
  }
  
  .icon {
    font-size: 1.1rem;
    margin-left: 0.6rem;
  }
  
  .text {
    font-size: 0.95rem;
  }
  
  .avatar {
    width: 40px;
    height: 40px;
  }
}

/* Mobile Styles */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    max-width: 300px;
  }
  
  .sidebar-header {
    padding: 1.5rem 1.25rem 1rem;
  }
  
  .logo-icon {
    font-size: 1.3rem;
  }
  
  .sidebar-header h2 {
    font-size: 1.2rem;
  }
  
  .nav-link {
    padding: 0.875rem 1.25rem;
  }
  
  .icon {
    font-size: 1.1rem;
  }
  
  .text {
    font-size: 0.95rem;
  }
}

/* Small Mobile Styles */
@media (max-width: 480px) {
  .sidebar {
    max-width: 100%;
  }
  
  .sidebar-header {
    padding: 1.25rem 1rem;
  }
  
  .nav-link {
    padding: 0.75rem 1rem;
  }
  
  .profile-avatar {
    width: 45px;
    height: 45px;
  }
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  .nav-link {
    padding: 1rem 1.25rem;
  }
  
  .nav-link:active {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .sidebar-close-btn {
    width: 44px;
    height: 44px;
  }
}

/* RTL Support */
[dir="rtl"] .sidebar {
  direction: rtl;
}

[dir="rtl"] .active-indicator {
  right: 0;
  left: auto;
}

[dir="rtl"] .sidebar-close-btn {
  left: auto;
  right: 1rem;
}

[dir="rtl"] .icon {
  margin-left: 0;
  margin-right: 0.75rem;
}

[dir="rtl"] .user-email {
  direction: ltr;
  text-align: left;
}

/* Safe Area Support */
@supports (padding: max(0px)) {
  .sidebar.mobile {
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  .sidebar-header {
    padding-top: max(1rem, env(safe-area-inset-top));
  }
}

/* Scrollbar Styling */
.sidebar::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}

/* Animations */
@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.sidebar.mobile {
  animation: slideIn 0.3s ease;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .sidebar,
  .sidebar-close-btn,
  .nav-link {
    transition: none;
    animation: none;
  }
}
</style>