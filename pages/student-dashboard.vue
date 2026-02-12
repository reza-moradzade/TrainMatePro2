
<template>
  <div class="student-dashboard">
    <div class="dashboard-header">
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

    <div class="dashboard-content">
      <!-- Welcome Card -->
      <div class="welcome-card">
        <div class="welcome-icon">💪</div>
        <div class="welcome-content">
          <h3>سلام، {{ userName }} عزیز!</h3>
          <p>به پنل شاگرد سیستم مدیریت تمرین خوش آمدید. در اینجا می‌توانید برنامه‌های تمرینی مربی خود را مشاهده کنید.</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-cards">
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
            <p>میانگین مدت (دقیقه)</p>
          </div>
        </div>
      </div>

      <!-- Active Programs -->
      <div class="section-card">
        <div class="section-header">
          <h2>📋 برنامه‌های تمرینی فعال</h2>
          <button @click="refreshPrograms" class="refresh-btn" :disabled="loading">
            🔄 {{ loading ? 'در حال بارگذاری...' : 'بروزرسانی' }}
          </button>
        </div>
        
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>در حال بارگذاری برنامه‌ها...</p>
        </div>

        <div v-else-if="programs.length === 0" class="empty-state">
          <div class="empty-icon">📅</div>
          <h3>هنوز برنامه تمرینی ندارید</h3>
          <p>مربی شما هنوز برنامه‌ای برای شما ایجاد نکرده است.</p>
        </div>

        <div v-else class="programs-list">
          <div class="program-card" v-for="program in programs" :key="program.id">
            <div class="program-header">
              <div class="program-title">
                <h3>{{ program.title }}</h3>
                <span class="program-status" :class="program.status">
                  {{ getStatusText(program.status) }}
                </span>
              </div>
              <div class="program-coach">
                <span class="coach-icon">👨‍🏫</span>
                <span class="coach-name">مربی: {{ program.coach.fullName }}</span>
              </div>
            </div>
            
            <div class="program-dates">
              <span class="date-item">
                <span class="date-icon">📅</span>
                شروع: {{ formatDate(program.startDate) }}
              </span>
              <span class="date-item">
                <span class="date-icon">📅</span>
                پایان: {{ formatDate(program.endDate) }}
              </span>
              <span class="date-item">
                <span class="date-icon">⏱️</span>
                مدت: {{ program.durationWeeks }} هفته
              </span>
            </div>
            
            <div class="program-description" v-if="program.description">
              <p>{{ program.description }}</p>
            </div>
            
            <div class="program-actions">
              <button @click="viewProgramDetails(program)" class="btn-primary">
                👁️ مشاهده جزئیات
              </button>
              <button @click="viewTodayWorkout(program)" class="btn-secondary">
                🏋️‍♂️ تمرین امروز
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Today's Workout -->
      <div class="section-card" v-if="todayWorkout">
        <div class="section-header">
          <h2>🏋️‍♂️ تمرین امروز</h2>
          <span class="today-date">{{ getTodayDate() }}</span>
        </div>
        
        <div class="today-workout">
          <div class="workout-header">
            <h3>{{ todayWorkout.day.title }}</h3>
            <span class="workout-duration" v-if="todayWorkout.day.duration">
              ⏱️ {{ todayWorkout.day.duration }} دقیقه
            </span>
          </div>
          
          <div class="workout-focus" v-if="todayWorkout.day.focus">
            <strong>تمرکز:</strong> {{ todayWorkout.day.focus }}
          </div>
          
          <div class="exercises-list">
            <h4>حرکات امروز:</h4>
            <div class="exercise-item" v-for="(exercise, index) in todayWorkout.exercises" :key="index">
              <div class="exercise-number">{{ index + 1 }}</div>
              <div class="exercise-content">
                <div class="exercise-name">{{ exercise.name }}</div>
                <div class="exercise-details">
                  <span class="detail-item">{{ exercise.sets }} ست</span>
                  <span class="detail-item">{{ exercise.reps }} تکرار</span>
                  <span class="detail-item">{{ exercise.restTime }} استراحت</span>
                </div>
                <div class="exercise-description" v-if="exercise.description">
                  {{ exercise.description }}
                </div>
              </div>
              <div class="exercise-status">
                <label class="checkbox-container">
                  <input type="checkbox" v-model="exercise.completed" @change="toggleExercise(exercise)">
                  <span class="checkmark"></span>
                </label>
              </div>
            </div>
          </div>
          
          <div class="workout-notes" v-if="todayWorkout.day.notes">
            <strong>📝 یادداشت مربی:</strong> {{ todayWorkout.day.notes }}
          </div>
        </div>
      </div>
    </div>

    <!-- Program Details Modal -->
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
const stats = reactive({
  activePrograms: 0,
  completedWorkouts: 0,
  remainingWorkouts: 0,
  avgDuration: 0
})

// Fetch user data on component mount
onMounted(async () => {
  await fetchUserData()
  await fetchPrograms()
  await calculateStats()
  await loadTodayWorkout()
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
  let completedExercises = 0
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
  
  // For demo, get the first program and first day of first week
  const program = programs.value[0]
  if (program && program.weeks.length > 0 && program.weeks[0].days.length > 0) {
    const today = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.
    const dayIndex = today === 0 ? 6 : today - 1 // Convert to our day mapping
    
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
  selectedProgram.value = program
}

// View today's workout
const viewTodayWorkout = (program) => {
  // Scroll to today's workout section
  const element = document.querySelector('.today-workout')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// Toggle exercise completion
const toggleExercise = (exercise) => {
  console.log('Exercise completed:', exercise.name, exercise.completed)
  // Here you would save to API in a real app
}

// Refresh programs
const refreshPrograms = async () => {
  await fetchPrograms()
  await calculateStats()
  await loadTodayWorkout()
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

.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome-card {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.welcome-icon {
  font-size: 3rem;
}

.welcome-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.welcome-content p {
  margin: 0;
  opacity: 0.9;
  line-height: 1.6;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2rem;
}

.stat-info h3 {
  font-size: 1.8rem;
  margin: 0;
  color: #333;
}

.stat-info p {
  margin: 0.25rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
}

.section-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
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
  color: #666;
  border: 2px solid #e0e0e0;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: #e0e0e0;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.today-date {
  color: #667eea;
  font-weight: 600;
  font-size: 0.95rem;
}

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

.programs-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.program-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.program-card:hover {
  border-color: #667eea;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.1);
}

.program-header {
  margin-bottom: 1rem;
}

.program-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.program-title h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.program-status {
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
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
  font-size: 0.9rem;
}

.coach-icon {
  font-size: 1rem;
}

.program-dates {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.date-icon {
  font-size: 0.9rem;
}

.program-description {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 3px solid #4caf50;
}

.program-description p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.program-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-primary, .btn-secondary {
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.btn-secondary {
  background: white;
  color: #666;
  border: 2px solid #e0e0e0;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.btn-secondary:hover {
  background: #f5f5f5;
  border-color: #667eea;
  color: #667eea;
}

/* Today's Workout Styles */
.today-workout {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  border: 2px solid #e9ecef;
}

.workout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #dee2e6;
}

.workout-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.workout-duration {
  color: #667eea;
  font-weight: 500;
  font-size: 0.9rem;
}

.workout-focus {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  background: white;
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 3px solid #ff9800;
}

.exercises-list {
  margin-bottom: 1.5rem;
}

.exercises-list h4 {
  margin: 0 0 1rem 0;
  color: #444;
  font-size: 1rem;
}

.exercise-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.exercise-item:hover {
  border-color: #667eea;
  transform: translateX(-5px);
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
  flex-shrink: 0;
}

.exercise-content {
  flex: 1;
}

.exercise-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.exercise-details {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.detail-item {
  color: #666;
  font-size: 0.85rem;
  background: #f5f5f5;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
}

.exercise-description {
  color: #888;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  font-style: italic;
}

.exercise-status {
  flex-shrink: 0;
}

.checkbox-container {
  display: block;
  position: relative;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: relative;
  height: 25px;
  width: 25px;
  background-color: #f5f5f5;
  border: 2px solid #ddd;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #4caf50;
  border-color: #4caf50;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.workout-notes {
  background: #e3f2fd;
  border: 1px solid #90caf9;
  padding: 1rem;
  border-radius: 8px;
  color: #1565c0;
  font-size: 0.9rem;
  margin-top: 1.5rem;
}

/* Modal Styles */
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
  border-radius: 12px;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h2 {
  margin: 0;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  transition: color 0.3s ease;
}

.btn-close:hover {
  color: #f44336;
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
  padding: 1.5rem;
  border-top: 1px solid #f0f0f0;
}
</style>