<template>
  <div class="student-dashboard">
    <!-- Mobile Header -->
    <div class="mobile-header" v-if="isMobile">
      <div class="header-top">
        <button @click="showSidebar = true" class="menu-button">
          <span class="menu-icon">☰</span>
        </button>
        <h1>🎯 پنل شاگرد</h1>
        <button @click="handleLogout" class="logout-icon-btn">
          <span class="logout-icon">🚪</span>
        </button>
      </div>
      
      <!-- User Profile Summary -->
      <div class="user-profile-summary">
        <div class="profile-avatar">{{ userInitials }}</div>
        <div class="profile-info">
          <span class="profile-name">{{ userName }}</span>
          <span class="profile-email">{{ userEmail }}</span>
        </div>
      </div>
    </div>

    <!-- Desktop Header -->
    <div class="dashboard-header" v-else>
      <div class="header-content">
        <h1>🎯 پنل شاگرد</h1>
        <div class="user-info">
          <div class="avatar">{{ userInitials }}</div>
          <div class="user-details">
            <span class="user-name">{{ userName }}</span>
            <span class="user-email">{{ userEmail }}</span>
            <span class="user-role">شاگرد</span>
          </div>
        </div>
      </div>
      
      <button @click="handleLogout" class="logout-btn">
        🚪 خروج
      </button>
    </div>

    <!-- Mobile Sidebar Menu -->
    <div v-if="isMobile && showSidebar" class="mobile-sidebar-overlay" @click="showSidebar = false">
      <div class="mobile-sidebar" @click.stop>
        <div class="sidebar-header">
          <div class="sidebar-user">
            <div class="sidebar-avatar">{{ userInitials }}</div>
            <div class="sidebar-user-info">
              <span class="sidebar-user-name">{{ userName }}</span>
              <span class="sidebar-user-email">{{ userEmail }}</span>
            </div>
          </div>
          <button @click="showSidebar = false" class="close-sidebar">
            ✕
          </button>
        </div>
        
        <div class="sidebar-menu">
          <div class="menu-item active">
            <span class="menu-icon">🏠</span>
            <span class="menu-text">داشبورد</span>
          </div>
          <div class="menu-item" @click="refreshPrograms">
            <span class="menu-icon">🔄</span>
            <span class="menu-text">بروزرسانی</span>
          </div>
          <div class="menu-item" @click="handleLogout">
            <span class="menu-icon">🚪</span>
            <span class="menu-text">خروج</span>
          </div>
        </div>
        
        <div class="sidebar-footer">
          <span class="app-version">TrainMate Pro v1.0</span>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <!-- Welcome Card - Responsive -->
      <div class="welcome-card">
        <div class="welcome-icon">💪</div>
        <div class="welcome-content">
          <h3>سلام، {{ userName }} عزیز!</h3>
          <p>به پنل شاگرد سیستم مدیریت تمرین خوش آمدید.</p>
          <p class="welcome-subtitle" v-if="isMobile">{{ getTodayDate() }}</p>
        </div>
      </div>

      <!-- Stats Cards - Responsive Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-info">
            <h3>{{ stats.activePrograms }}</h3>
            <p>برنامه‌های فعال</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <h3>{{ stats.completedWorkouts }}</h3>
            <p>تمرینات انجام شده</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-info">
            <h3>{{ stats.remainingWorkouts }}</h3>
            <p>تمرینات باقی‌مانده</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⏱️</div>
          <div class="stat-info">
            <h3>{{ stats.avgDuration }}</h3>
            <p>میانگین مدت</p>
          </div>
        </div>
      </div>

      <!-- Today's Workout - Highlight Card -->
      <div class="today-highlight" v-if="todayWorkout">
        <div class="highlight-header">
          <span class="highlight-icon">🏋️‍♂️</span>
          <h2>تمرین امروز</h2>
          <span class="today-badge">{{ getDayName() }}</span>
        </div>
        
        <div class="today-preview" @click="showTodayWorkout = true">
          <div class="preview-info">
            <span class="preview-title">{{ todayWorkout.day.title }}</span>
            <span class="preview-count">{{ todayWorkout.exercises.length }} حرکت</span>
          </div>
          <span class="preview-arrow">←</span>
        </div>
      </div>

      <!-- Active Programs Section -->
      <div class="section-card">
        <div class="section-header">
          <h2>📋 برنامه‌های فعال</h2>
          <button @click="refreshPrograms" class="refresh-btn" :disabled="loading">
            <span class="refresh-icon">🔄</span>
            <span v-if="!isMobile">{{ loading ? 'در حال بارگذاری...' : 'بروزرسانی' }}</span>
          </button>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>در حال بارگذاری برنامه‌ها...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="programs.length === 0" class="empty-state">
          <div class="empty-icon">📅</div>
          <h3>هنوز برنامه تمرینی ندارید</h3>
          <p>مربی شما هنوز برنامه‌ای برای شما ایجاد نکرده است.</p>
        </div>

        <!-- Programs List - Mobile Optimized -->
        <div v-else class="programs-list">
          <div 
            class="program-card" 
            v-for="program in programs" 
            :key="program.id"
            @click="viewProgramDetails(program)"
          >
            <div class="program-header">
              <div class="program-title">
                <h3>{{ program.title }}</h3>
                <span class="program-status" :class="program.status">
                  {{ getStatusText(program.status) }}
                </span>
              </div>
              <div class="program-coach">
                <span class="coach-icon">👨‍🏫</span>
                <span class="coach-name">{{ program.coach.fullName }}</span>
              </div>
            </div>
            
            <div class="program-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: getProgramProgress(program) + '%' }"></div>
              </div>
              <span class="progress-text">{{ getProgramProgress(program) }}% تکمیل</span>
            </div>
            
            <div class="program-meta">
              <span class="meta-item">
                <span class="meta-icon">📅</span>
                {{ formatDate(program.startDate) }}
              </span>
              <span class="meta-item">
                <span class="meta-icon">⏱️</span>
                {{ program.durationWeeks }} هفته
              </span>
              <span class="meta-item">
                <span class="meta-icon">🏋️</span>
                {{ getTotalExercises(program) }} حرکت
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Today's Workout Modal - Mobile Optimized -->
    <div v-if="showTodayWorkout" class="modal-overlay" @click="showTodayWorkout = false">
      <div class="modal-content workout-modal" @click.stop>
        <div class="modal-header">
          <h2>🏋️‍♂️ تمرین امروز</h2>
          <button @click="showTodayWorkout = false" class="btn-close">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="workout-detail" v-if="todayWorkout">
            <div class="workout-info-card">
              <div class="workout-title">
                <h3>{{ todayWorkout.day.title }}</h3>
                <span class="workout-date">{{ getTodayDate() }}</span>
              </div>
              
              <div class="workout-focus" v-if="todayWorkout.day.focus">
                <span class="focus-label">تمرکز:</span>
                <span class="focus-value">{{ todayWorkout.day.focus }}</span>
              </div>
              
              <div class="workout-duration" v-if="todayWorkout.day.duration">
                <span class="duration-icon">⏱️</span>
                <span class="duration-value">{{ todayWorkout.day.duration }} دقیقه</span>
              </div>
            </div>
            
            <div class="exercises-section">
              <h4>حرکات امروز ({{ todayWorkout.exercises.length }})</h4>
              
              <div class="exercises-list">
                <div 
                  class="exercise-card" 
                  v-for="(exercise, index) in todayWorkout.exercises" 
                  :key="index"
                >
                  <div class="exercise-header">
                    <span class="exercise-number">{{ index + 1 }}</span>
                    <span class="exercise-name">{{ exercise.name }}</span>
                  </div>
                  
                  <div class="exercise-specs">
                    <span class="spec-item">
                      <span class="spec-label">ست:</span>
                      {{ exercise.sets }}
                    </span>
                    <span class="spec-item">
                      <span class="spec-label">تکرار:</span>
                      {{ exercise.reps }}
                    </span>
                    <span class="spec-item">
                      <span class="spec-label">استراحت:</span>
                      {{ exercise.restTime }}
                    </span>
                  </div>
                  
                  <div class="exercise-actions">
                    <label class="checkbox-container">
                      <input type="checkbox" v-model="exercise.completed" @change="toggleExercise(exercise)">
                      <span class="checkmark"></span>
                      <span class="checkbox-label">انجام شد</span>
                    </label>
                  </div>
                  
                  <div class="exercise-description" v-if="exercise.description">
                    {{ exercise.description }}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="workout-notes" v-if="todayWorkout.day.notes">
              <span class="notes-icon">📝</span>
              <div class="notes-content">
                <strong>یادداشت مربی:</strong>
                <p>{{ todayWorkout.day.notes }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="showTodayWorkout = false" class="btn-secondary">
            بستن
          </button>
          <button @click="completeWorkout" class="btn-primary" :disabled="!allExercisesCompleted">
            ✅ تکمیل تمرین
          </button>
        </div>
      </div>
    </div>

    <!-- Program Details Modal - Mobile Optimized -->
    <div v-if="selectedProgram" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedProgram.title }}</h2>
          <button @click="closeModal" class="btn-close">✕</button>
        </div>
        
        <div class="modal-body">
          <StudentProgramView :program="selectedProgram" />
        </div>
        
        <div class="modal-footer">
          <button @click="closeModal" class="btn-secondary">بستن</button>
          <button @click="printProgram(selectedProgram)" class="btn-primary">
            🖨️ چاپ برنامه
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Action FAB for Mobile -->
    <div v-if="isMobile && todayWorkout" class="fab-container">
      <button @click="showTodayWorkout = true" class="fab-button">
        <span class="fab-icon">🏋️</span>
      </button>
    </div>
  </div>
</template>

<script setup>
// Import components
import StudentProgramView from '../components/StudentProgramView.vue'

// Reactive state
const userName = ref('در حال بارگذاری...')
const userEmail = ref('')
const userInitials = ref('')
const programs = ref([])
const loading = ref(false)
const selectedProgram = ref(null)
const todayWorkout = ref(null)
const showTodayWorkout = ref(false)
const showSidebar = ref(false)
const isMobile = ref(false)

const stats = reactive({
  activePrograms: 0,
  completedWorkouts: 0,
  remainingWorkouts: 0,
  avgDuration: 0
})

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// Get day name in Persian
const getDayName = () => {
  const days = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه']
  const today = new Date().getDay()
  return days[today]
}

// Fetch user data on component mount
onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  await fetchUserData()
  await fetchPrograms()
  await calculateStats()
  await loadTodayWorkout()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Fetch user data
const fetchUserData = async () => {
  try {
    const response = await $fetch('/api/auth/me')
    
    if (response.user) {
      const user = response.user
      userName.value = user.fullName
      userEmail.value = user.email
      
      // Generate initials from full name
      if (user.fullName && typeof user.fullName === 'string') {
        userInitials.value = user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
      } else {
        userInitials.value = 'ST'
      }
    }
  } catch (error) {
    console.error('Failed to fetch user data:', error)
    await navigateTo('/')
  }
}

// Fetch workout programs
const fetchPrograms = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/workouts')
    
    if (response.success) {
      programs.value = response.programs.filter(p => p.status === 'active')
    }
  } catch (error) {
    console.error('Error fetching programs:', error)
  } finally {
    loading.value = false
  }
}

// Calculate statistics
const calculateStats = () => {
  if (programs.value.length === 0) return
  
  stats.activePrograms = programs.value.length
  
  // Calculate total exercises
  let totalExercises = 0
  let totalDuration = 0
  let programsWithDuration = 0
  
  programs.value.forEach(program => {
    program.weeks.forEach(week => {
      week.days.forEach(day => {
        if (day.duration) {
          totalDuration += day.duration
          programsWithDuration++
        }
        totalExercises += day.exercises.length
      })
    })
  })
  
  stats.remainingWorkouts = totalExercises
  stats.avgDuration = programsWithDuration > 0 ? Math.round(totalDuration / programsWithDuration) : 0
}

// Load today's workout
const loadTodayWorkout = () => {
  if (programs.value.length === 0) return
  
  const program = programs.value[0]
  if (program && program.weeks.length > 0 && program.weeks[0].days.length > 0) {
    const today = new Date().getDay()
    const dayIndex = today === 0 ? 6 : today - 1
    
    if (program.weeks[0].days[dayIndex]) {
      const day = program.weeks[0].days[dayIndex]
      todayWorkout.value = {
        programId: program.id,
        programTitle: program.title,
        day: day,
        exercises: day.exercises.map(ex => ({
          ...ex,
          completed: false
        }))
      }
    }
  }
}

// Get program progress
const getProgramProgress = (program) => {
  return Math.floor(Math.random() * 60) + 20 // Placeholder
}

// Get total exercises count
const getTotalExercises = (program) => {
  let total = 0
  program.weeks.forEach(week => {
    week.days.forEach(day => {
      total += day.exercises.length
    })
  })
  return total
}

// Check if all exercises are completed
const allExercisesCompleted = computed(() => {
  if (!todayWorkout.value) return false
  return todayWorkout.value.exercises.every(ex => ex.completed)
})

// Get status text
const getStatusText = (status) => {
  const statusMap = {
    'active': 'فعال',
    'completed': 'تکمیل شده',
    'cancelled': 'لغو شده'
  }
  return statusMap[status] || status
}

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'ثبت نشده'
  const date = new Date(dateString)
  return date.toLocaleDateString('fa-IR')
}

// Get today's date in Persian
const getTodayDate = () => {
  const now = new Date()
  return now.toLocaleDateString('fa-IR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// View program details
const viewProgramDetails = (program) => {
  if (isMobile.value) {
    selectedProgram.value = program
  } else {
    selectedProgram.value = program
  }
}

// Toggle exercise completion
const toggleExercise = (exercise) => {
  console.log('Exercise completed:', exercise.name, exercise.completed)
}

// Complete workout
const completeWorkout = () => {
  alert('تبریک! تمرین امروز با موفقیت ثبت شد.')
  showTodayWorkout.value = false
}

// Refresh programs
const refreshPrograms = async () => {
  await fetchPrograms()
  await calculateStats()
  await loadTodayWorkout()
  if (isMobile.value) {
    showSidebar.value = false
  }
}

// Close modal
const closeModal = () => {
  selectedProgram.value = null
}

// Print program
const printProgram = (program) => {
  window.print()
}

// Logout
const handleLogout = async () => {
  if (confirm('آیا مطمئنید که می‌خواهید خارج شوید؟')) {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      await navigateTo('/')
    } catch (error) {
      console.error('Logout error:', error)
      await navigateTo('/')
    }
  }
}
</script>

<style scoped>
.student-dashboard {
  direction: rtl;
  min-height: 100vh;
  background: #f8f9fa;
}

/* Mobile Header */
.mobile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.menu-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.menu-icon {
  color: white;
  font-size: 1.5rem;
}

.mobile-header h1 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.logout-icon-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.logout-icon {
  color: white;
  font-size: 1.2rem;
}

.user-profile-summary {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.profile-avatar {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
}

.profile-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.profile-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.profile-email {
  font-size: 0.75rem;
  opacity: 0.9;
}

/* Desktop Header */
.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.header-content h1 {
  margin: 0;
  font-size: 1.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  font-size: 1rem;
}

.user-email {
  font-size: 0.85rem;
  opacity: 0.9;
}

.user-role {
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.1rem 0.75rem;
  border-radius: 12px;
  margin-top: 0.25rem;
  align-self: flex-start;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Mobile Sidebar */
.mobile-sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.mobile-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 80%;
  max-width: 320px;
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
}

.sidebar-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sidebar-avatar {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.sidebar-user-info {
  display: flex;
  flex-direction: column;
}

.sidebar-user-name {
  font-weight: 600;
  font-size: 1rem;
}

.sidebar-user-email {
  font-size: 0.8rem;
  opacity: 0.9;
}

.close-sidebar {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
}

.sidebar-menu {
  flex: 1;
  padding: 1.5rem 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: #333;
  cursor: pointer;
  transition: background 0.3s ease;
}

.menu-item:hover,
.menu-item:active {
  background: #f5f5f5;
}

.menu-item.active {
  background: #eef2ff;
  color: #667eea;
  border-right: 3px solid #667eea;
}

.menu-icon {
  font-size: 1.2rem;
  width: 24px;
}

.menu-text {
  font-size: 0.95rem;
  font-weight: 500;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}

.app-version {
  color: #999;
  font-size: 0.8rem;
}

/* Dashboard Content */
.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Welcome Card */
.welcome-card {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  color: white;
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.welcome-icon {
  font-size: 3rem;
  background: rgba(255, 255, 255, 0.2);
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.welcome-content {
  flex: 1;
}

.welcome-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.welcome-content p {
  margin: 0.25rem 0;
  opacity: 0.9;
}

.welcome-subtitle {
  font-size: 0.9rem;
  margin-top: 0.5rem !important;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.stat-icon {
  font-size: 2rem;
  background: #f8f9fa;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.stat-info h3 {
  font-size: 1.8rem;
  margin: 0;
  color: #333;
  font-weight: 700;
}

.stat-info p {
  margin: 0.25rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
}

/* Today Highlight */
.today-highlight {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 2px solid #667eea;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
}

.highlight-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.highlight-icon {
  font-size: 1.5rem;
}

.highlight-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
  flex: 1;
}

.today-badge {
  background: #eef2ff;
  color: #667eea;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.today-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.today-preview:active {
  background: #e9ecef;
  transform: scale(0.99);
}

.preview-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.preview-title {
  font-weight: 600;
  color: #333;
}

.preview-count {
  font-size: 0.85rem;
  color: #667eea;
}

.preview-arrow {
  font-size: 1.2rem;
  color: #999;
}

/* Section Card */
.section-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.refresh-btn {
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.refresh-btn:active {
  background: #e0e0e0;
}

.refresh-btn:disabled {
  opacity: 0.6;
}

/* Programs List */
.programs-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.program-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.program-card:active {
  background: #e9ecef;
  transform: scale(0.99);
}

.program-header {
  margin-bottom: 1rem;
}

.program-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.program-title h3 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.program-status {
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
}

.program-status.active {
  background: #e8f5e9;
  color: #2e7d32;
}

.program-coach {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.85rem;
}

/* Progress Bar */
.program-progress {
  margin-bottom: 1rem;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: #666;
}

/* Program Meta */
.program-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #666;
  font-size: 0.8rem;
}

.meta-icon {
  font-size: 0.85rem;
}

/* Workout Modal */
.workout-modal .modal-body {
  padding: 1.5rem;
}

.workout-info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.workout-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.workout-title h3 {
  margin: 0;
  font-size: 1.2rem;
}

.workout-date {
  font-size: 0.85rem;
  opacity: 0.9;
}

.workout-focus {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.focus-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.focus-value {
  font-weight: 600;
}

.workout-duration {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Exercise Card */
.exercises-section {
  margin-bottom: 1.5rem;
}

.exercises-section h4 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.1rem;
}

.exercise-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.exercise-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.exercise-number {
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.exercise-name {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.exercise-specs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.spec-item {
  background: #f8f9fa;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #666;
}

.spec-label {
  font-weight: 500;
  color: #999;
}

.exercise-actions {
  margin-bottom: 0.75rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label {
  font-size: 0.9rem;
  color: #666;
}

.exercise-description {
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #666;
  font-style: italic;
  border-right: 3px solid #ff9800;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
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

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 0;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  color: #666;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #888;
  margin-bottom: 0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.btn-close:active {
  background: #f0f0f0;
}

.modal-body {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #f0f0f0;
  position: sticky;
  bottom: 0;
  background: white;
}

/* Buttons */
.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.btn-primary:active {
  transform: scale(0.97);
}

.btn-primary:disabled {
  opacity: 0.6;
}

.btn-secondary {
  background: white;
  color: #666;
  border: 2px solid #e0e0e0;
}

.btn-secondary:active {
  background: #f5f5f5;
}

/* FAB */
.fab-container {
  position: fixed;
  bottom: 2rem;
  left: 1rem;
  z-index: 100;
}

.fab-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.fab-button:active {
  transform: scale(0.95);
}

.fab-icon {
  font-size: 1.5rem;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .dashboard-content {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 1rem;
  }

  .welcome-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }

  .welcome-icon {
    width: 70px;
    height: 70px;
    font-size: 2rem;
  }

  .welcome-content h3 {
    font-size: 1.2rem;
  }

  .welcome-content p {
    font-size: 0.9rem;
  }

  .stats-grid {
    gap: 0.75rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }

  .stat-info h3 {
    font-size: 1.4rem;
  }

  .stat-info p {
    font-size: 0.8rem;
  }

  .section-card {
    padding: 1.25rem;
  }

  .section-header h2 {
    font-size: 1.1rem;
  }

  .program-card {
    padding: 1rem;
  }

  .program-title h3 {
    font-size: 1rem;
  }

  .program-meta {
    gap: 0.75rem;
  }

  .modal-content {
    width: 95%;
  }

  .fab-container {
    bottom: 1.5rem;
    left: 1rem;
  }

  .fab-button {
    width: 52px;
    height: 52px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .program-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }

  .fab-container {
    bottom: 1rem;
    left: 0.75rem;
  }

  .fab-button {
    width: 48px;
    height: 48px;
  }
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

/* RTL Support */
[dir="rtl"] .menu-item.active {
  border-right: 3px solid #667eea;
  border-left: none;
}

[dir="rtl"] .preview-arrow {
  transform: scaleX(-1);
}

[dir="rtl"] .mobile-sidebar {
  left: auto;
  right: 0;
  animation: slideIn 0.3s ease;
}

/* Safe Area Support */
@supports (padding: max(0px)) {
  .mobile-header {
    padding-top: max(0.75rem, env(safe-area-inset-top));
    padding-left: max(1rem, env(safe-area-inset-left));
    padding-right: max(1rem, env(safe-area-inset-right));
  }

  .fab-container {
    bottom: max(2rem, env(safe-area-inset-bottom));
    left: max(1rem, env(safe-area-inset-left));
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .mobile-sidebar,
  .program-card,
  .fab-button,
  .spinner {
    animation: none;
    transition: none;
  }
}
</style>