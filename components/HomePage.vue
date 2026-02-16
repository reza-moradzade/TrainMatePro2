<template>
  <div class="home-page">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-top">
       <h1>داشبورد مربی</h1>
        <!--  <div class="date-badge" v-if="isMobile">
          {{ currentDate }}
        </div> -->
      </div>

    </div>

    <!-- Welcome Card - Responsive -->
    <!-- <div class="welcome-card">
      <div class="welcome-icon">💪</div>
      <div class="welcome-content">
        <h3>آماده‌اید برنامه تمرینی ایجاد کنید؟</h3>
        <p>در این پنل می‌توانید برای شاگردان خود برنامه تمرینی ایجاد و مدیریت کنید.</p>
        <div class="quick-stats">
          <div class="quick-stat">
            <span class="stat-number">{{ stats.studentsCount }}</span>
            <span class="stat-label">شاگرد</span>
          </div>
          <div class="quick-stat">
            <span class="stat-number">{{ stats.activeProgramsCount }}</span>
            <span class="stat-label">برنامه فعال</span>
          </div>
        </div>
      </div>
    </div> -->

    <!-- Stats Cards - Responsive Grid -->
    <div class="stats-grid">
      <div class="stat-card" @click="goToStudents">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <h3>{{ stats.studentsCount }}</h3>
          <p>تعداد شاگردان</p>
        </div>
      </div>
      
      <div class="stat-card" @click="goToWorkouts">
        <div class="stat-icon">📊</div>
        <div class="stat-info">
          <h3>{{ stats.activeProgramsCount }}</h3>
          <p>برنامه‌های فعال</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-info">
          <h3>{{ stats.completedWorkoutsCount }}</h3>
          <p>تمرینات تکمیل شده</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📝</div>
        <div class="stat-info">
          <h3>{{ stats.notesCount }}</h3>
          <p>یادداشت‌ها</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions - Mobile Optimized -->
    <div class="quick-actions">
      <div class="section-card">
        <div class="section-header">
          <h2>🔧 دسترسی‌های سریع</h2>
          <span class="section-badge" v-if="isMobile">۴ گزینه</span>
        </div>
        
        <div class="actions-grid">
          <div class="action-item" @click="goToCreateWorkout">
            <div class="action-icon-wrapper">
              <div class="action-icon">➕</div>
            </div>
            <div class="action-content">
              <p class="action-title">ایجاد برنامه</p>
              <p class="action-desc">برنامه جدید</p>
            </div>
          </div>
          
          <div class="action-item" @click="goToStudents">
            <div class="action-icon-wrapper">
              <div class="action-icon">👤</div>
            </div>
            <div class="action-content">
              <p class="action-title">شاگردان</p>
              <p class="action-desc">مدیریت شاگردان</p>
            </div>
          </div>
          
          <div class="action-item" @click="goToWorkouts">
            <div class="action-icon-wrapper">
              <div class="action-icon">📋</div>
            </div>
            <div class="action-content">
              <p class="action-title">برنامه‌ها</p>
              <p class="action-desc">مشاهده برنامه‌ها</p>
            </div>
          </div>

          <div class="action-item" @click="goToAddStudent">
            <div class="action-icon-wrapper">
              <div class="action-icon">➕👤</div>
            </div>
            <div class="action-content">
              <p class="action-title">افزودن شاگرد</p>
              <p class="action-desc">شاگرد جدید</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Students Section - Responsive -->
    <div class="section-card" v-if="recentStudents.length > 0">
      <div class="section-header">
        <h2>👥 شاگردان اخیر</h2>
        <button @click="goToStudents" class="btn-link">
          مشاهده همه
          <span class="btn-arrow">←</span>
        </button>
      </div>
      
      <div class="recent-students-list">
        <div class="student-item" v-for="student in recentStudents" :key="student.id">
          <div class="student-avatar" :style="{ background: getAvatarColor(student.id) }">
            {{ getInitials(student.fullName) }}
          </div>
          <div class="student-info">
            <span class="student-name">{{ student.fullName }}</span>
            <span class="student-email">{{ student.email }}</span>
          </div>
          <div class="student-meta">
            <span class="student-program-count">
              {{ student.programCount || 0 }} برنامه
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-skeleton">
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
    </div>
  </div>
</template>

<script setup>
// Emit for parent component
const emit = defineEmits(['menu-changed'])

// Reactive state
const userName = ref('مربی')
const isMobile = ref(false)
const currentDate = ref('')
const stats = reactive({
  studentsCount: 0,
  activeProgramsCount: 0,
  completedWorkoutsCount: 0,
  notesCount: 0
})
const recentStudents = ref([])
const loading = ref(false)

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// Get current date in Persian
const updateCurrentDate = () => {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('fa-IR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Generate avatar color based on student id
const getAvatarColor = (id) => {
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  ]
  return colors[id % colors.length]
}

// Fetch all data on component mount
onMounted(async () => {
  checkMobile()
  updateCurrentDate()
  window.addEventListener('resize', checkMobile)
  
  await Promise.all([
    fetchUserData(),
    fetchStats(),
    fetchRecentStudents()
  ])
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Fetch user data
const fetchUserData = async () => {
  try {
    const response = await $fetch('/api/auth/me')
    if (response.user) {
      userName.value = response.user.fullName
    }
  } catch (error) {
    console.error('Failed to fetch user data:', error)
  }
}

// Fetch coach statistics
const fetchStats = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/coach/stats')
    
    if (response.success) {
      stats.studentsCount = response.stats.studentsCount || 0
      stats.activeProgramsCount = response.stats.activeProgramsCount || 0
      stats.completedWorkoutsCount = response.stats.completedWorkoutsCount || 0
      stats.notesCount = response.stats.notesCount || 0
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error)
  } finally {
    loading.value = false
  }
}

// Fetch recent students
const fetchRecentStudents = async () => {
  try {
    const response = await $fetch('/api/students')
    
    if (response.success) {
      // Get first 3-4 students based on screen size
      const limit = isMobile.value ? 3 : 4
      recentStudents.value = response.students.slice(0, limit).map(student => ({
        ...student,
        programCount: Math.floor(Math.random() * 5) + 1 // Placeholder
      }))
    }
  } catch (error) {
    console.error('Failed to fetch recent students:', error)
  }
}

// Get initials from full name
const getInitials = (fullName) => {
  if (!fullName) return '??'
  return fullName.split(' ').map(n => n[0]).join('').toUpperCase()
}

// Navigation functions
const goToStudents = () => {
  emit('menu-changed', 'students')
}

const goToWorkouts = () => {
  emit('menu-changed', 'workouts')
}

const goToCreateWorkout = () => {
  emit('menu-changed', 'create-workout')
}

const goToAddStudent = () => {
  emit('menu-changed', 'add-student')
}
</script>

<style scoped>
.home-page {
  direction: rtl;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
}

/* Page Header */
.page-header {
  margin-bottom: 1.5rem;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.page-header h1 {
  color: #333;
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.page-header p {
  color: #666;
  margin: 0;
  font-size: 1rem;
}

.date-badge {
  background: #f0f0f0;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #666;
  white-space: nowrap;
}

/* Welcome Card */
.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
}

.welcome-icon {
  font-size: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
  width: 70px;
  height: 70px;
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
  font-size: 1.3rem;
}

.welcome-content p {
  margin: 0.25rem 0;
  opacity: 0.9;
  font-size: 0.95rem;
}

/* Quick Stats */
.quick-stats {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
}

.quick-stat {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.15);
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
}

.stat-label {
  font-size: 0.8rem;
  opacity: 0.9;
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
  cursor: pointer;
  border: 2px solid transparent;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.stat-card:active {
  transform: scale(0.98);
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

/* Section Card */
.section-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

.section-badge {
  background: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  color: #666;
}

/* Actions Grid */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.25rem 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.action-item:hover {
  background: white;
  border-color: #667eea;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.1);
}

.action-item:active {
  transform: scale(0.97);
}

.action-icon-wrapper {
  margin-bottom: 0.75rem;
}

.action-icon {
  font-size: 1.8rem;
  background: white;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.action-content {
  width: 100%;
}

.action-title {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
}

.action-desc {
  margin: 0;
  color: #666;
  font-size: 0.8rem;
}

/* Recent Students */
.recent-students-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.student-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 12px;
  transition: background-color 0.3s ease;
}

.student-item:hover {
  background: #f8f9fa;
}

.student-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  flex-shrink: 0;
}

.student-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.student-name {
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.student-email {
  color: #666;
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: ltr;
  text-align: right;
}

.student-meta {
  flex-shrink: 0;
}

.student-program-count {
  color: #667eea;
  font-weight: 600;
  font-size: 0.85rem;
  background: #eef2ff;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  white-space: nowrap;
}

.btn-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-link:hover {
  background: #f0f0f0;
}

.btn-arrow {
  font-size: 1rem;
}

/* Loading Skeleton */
.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-card {
  height: 100px;
  background: linear-gradient(90deg, #f0f0f0 25%, #f8f9fa 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 12px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Tablet Styles */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile Styles */
@media (max-width: 768px) {
  .home-page {
    padding: 1rem 0.75rem;
  }

  .header-top {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-header h1 {
    font-size: 1.4rem;
  }

  .date-badge {
    align-self: flex-start;
  }

  .welcome-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem 1rem;
  }

  .welcome-icon {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }

  .welcome-content h3 {
    font-size: 1.1rem;
  }

  .welcome-content p {
    font-size: 0.9rem;
  }

  .quick-stats {
    justify-content: center;
  }

  .quick-stat {
    padding: 0.5rem 1rem;
  }

  .stat-number {
    font-size: 1.2rem;
  }

  .stats-grid {
    gap: 0.75rem;
    margin-bottom: 1.5rem;
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
    margin-bottom: 1.25rem;
  }

  .section-header h2 {
    font-size: 1.1rem;
  }

  .actions-grid {
    gap: 0.75rem;
  }

  .action-item {
    padding: 1rem 0.75rem;
  }

  .action-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }

  .action-title {
    font-size: 0.9rem;
  }

  .action-desc {
    display: none; /* Hide description on mobile */
  }

  .student-avatar {
    width: 44px;
    height: 44px;
    font-size: 0.9rem;
  }

  .student-name {
    font-size: 0.9rem;
  }

  .student-program-count {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }
}

/* Small Mobile Styles */
@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-stats {
    flex-direction: column;
    gap: 0.5rem;
  }

  .quick-stat {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .student-item {
    flex-wrap: wrap;
  }

  .student-meta {
    width: 100%;
    margin-top: 0.5rem;
  }

  .student-program-count {
    display: inline-block;
  }
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  .stat-card:active,
  .action-item:active,
  .student-item:active {
    background: #f0f0f0;
    transform: scale(0.98);
  }

  .btn-link {
    padding: 0.75rem 1rem;
  }
}

/* RTL Support */
[dir="rtl"] .btn-arrow {
  transform: scaleX(-1);
}

[dir="rtl"] .student-email {
  direction: ltr;
  text-align: left;
}

/* Safe Area Support */
@supports (padding: max(0px)) {
  .home-page {
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .stat-card,
  .action-item,
  .loading-skeleton {
    animation: none;
    transition: none;
  }
}
</style>