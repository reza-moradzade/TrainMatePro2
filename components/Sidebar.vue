
<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h2>پنل مربی</h2>
      <div class="role-badge">مربی</div>
    </div>
    
    <nav class="sidebar-nav">
      <ul>
        <li v-for="item in menuItems" :key="item.id">
          <a
            href="#"
            :class="{ active: activeMenu === item.id }"
            @click.prevent="setActiveMenu(item.id)"
            class="nav-link"
          >
            <span class="icon">{{ item.icon }}</span>
            <span class="text">{{ item.text }}</span>
          </a>
        </li>
      </ul>
    </nav>
    
    <div class="sidebar-footer">
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
const emit = defineEmits(['menu-changed'])

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
}

.sidebar-header {
  padding: 2rem 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.role-badge {
  position: absolute;
  top: 1rem;
  left: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

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
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  border-right: 3px solid transparent;
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

.icon {
  font-size: 1.2rem;
  margin-left: 0.75rem;
}

.text {
  font-size: 1rem;
  font-weight: 500;
}

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
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.user-email {
  font-size: 0.8rem;
  opacity: 0.8;
}

.user-role {
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.1rem 0.5rem;
  border-radius: 10px;
  margin-top: 0.25rem;
  align-self: flex-start;
}
</style>