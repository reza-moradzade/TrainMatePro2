<template>
  <div class="workout-programs-page">
    <!-- Page Header - Responsive -->
    <div class="page-header">
      <div class="header-top">
        <div class="header-title">
          <h1>📅 برنامه‌های تمرینی</h1>
          <p>مدیریت برنامه‌های تمرینی شاگردان</p>
        </div>
        
        <!-- Mobile FAB Button -->
        <button v-if="isMobile" @click="goToCreateWorkout" class="fab-button">
          <span class="fab-icon">➕</span>
        </button>
        
        <!-- Desktop Create Button -->
        <button v-else @click="goToCreateWorkout" class="btn-primary">
          🏋️‍♂️ ایجاد برنامه جدید
        </button>
      </div>

      <!-- Stats Summary Cards -->
      <div class="stats-summary">
        <div class="stat-item">
          <span class="stat-value">{{ programs.length }}</span>
          <span class="stat-label">کل برنامه‌ها</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ activeProgramsCount }}</span>
          <span class="stat-label">برنامه‌های فعال</span>
        </div>
        <div class="stat-item" v-if="!isMobile">
          <span class="stat-value">{{ totalStudentsCount }}</span>
          <span class="stat-label">شاگردان</span>
        </div>
        <div class="stat-item" v-if="!isMobile">
          <span class="stat-value">{{ totalWeeksCount }}</span>
          <span class="stat-label">هفته‌ها</span>
        </div>
      </div>

      <!-- Search and Filters - Mobile Optimized -->
      <div class="filters-section">
        <div class="search-box" v-if="programs.length > 0">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="جستجوی برنامه..."
            class="search-input"
            @input="filterPrograms"
          />
          <button v-if="searchQuery" @click="clearSearch" class="clear-search">
            ✕
          </button>
        </div>

        <div class="filter-group">
          <div class="filter-label">
            <span class="filter-icon">👥</span>
            <span>فیلتر شاگرد:</span>
          </div>
          <select v-model="selectedStudentId" @change="fetchPrograms" class="filter-select">
            <option value="">همه شاگردان</option>
            <option v-for="student in students" :key="student.id" :value="student.id">
              {{ student.fullName }}
            </option>
          </select>
        </div>

        <!-- Status Filter Tabs - Mobile -->
        <div v-if="isMobile" class="status-tabs">
          <button 
            v-for="tab in statusTabs" 
            :key="tab.value"
            :class="{ active: selectedStatus === tab.value }"
            @click="setStatusFilter(tab.value)"
            class="status-tab"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Programs Container -->
    <div class="programs-container">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>در حال بارگذاری برنامه‌ها...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>خطا در بارگذاری</h3>
        <p>{{ error }}</p>
        <button @click="fetchPrograms" class="btn-retry">
          🔄 تلاش مجدد
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredPrograms.length === 0" class="empty-state">
        <div class="empty-icon">
          {{ searchQuery ? '🔍' : '📅' }}
        </div>
        <h3>
          {{ searchQuery ? 'نتیجه‌ای یافت نشد' : 'هنوز برنامه تمرینی وجود ندارد' }}
        </h3>
        <p>
          {{ searchQuery 
            ? 'برنامه‌ای با این مشخصات پیدا نشد.' 
            : 'برای شاگردان خود برنامه تمرینی ایجاد کنید.' 
          }}
        </p>
        <button v-if="!searchQuery" @click="goToCreateWorkout" class="btn-primary">
          ➕ ایجاد اولین برنامه
        </button>
        <button v-else @click="clearSearch" class="btn-secondary">
          🗑️ پاک کردن جستجو
        </button>
      </div>

      <!-- Programs Grid/List -->
      <div v-else class="programs-list">
        <!-- Desktop Grid -->
        <div v-if="!isMobile" class="programs-grid">
          <div v-for="program in paginatedPrograms" :key="program.id" class="program-card">
            <ProgramCard 
              :program="program"
              @view="viewProgram"
              @edit="editProgram"
              @delete="deleteProgram"
              @duplicate="duplicateProgram"
            />
          </div>
        </div>

        <!-- Mobile List -->
        <div v-else class="programs-mobile-list">
          <div v-for="program in paginatedPrograms" :key="program.id" class="program-mobile-card">
            <ProgramMobileCard 
              :program="program"
              @view="viewProgram"
              @edit="editProgram"
              @delete="deleteProgram"
            />
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination" v-if="totalPages > 1">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            ←
          </button>
          
          <div class="page-info">
            <span class="current-page">{{ currentPage }}</span>
            <span class="total-pages">از {{ totalPages }}</span>
          </div>
          
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            →
          </button>
        </div>
      </div>
    </div>

    <!-- Program Detail Modal - Mobile Optimized -->
    <div v-if="selectedProgram" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="modal-header-content">
            <h2>{{ selectedProgram.title }}</h2>
            <span class="program-status" :class="selectedProgram.status">
              {{ getStatusText(selectedProgram.status) }}
            </span>
          </div>
          <button @click="closeModal" class="btn-close">✕</button>
        </div>
        
        <div class="modal-body">
          <!-- Program Info Card -->
          <div class="program-info-card">
            <div class="info-row">
              <span class="info-label">👤 شاگرد:</span>
              <span class="info-value">{{ selectedProgram.student.fullName }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">👨‍🏫 مربی:</span>
              <span class="info-value">{{ selectedProgram.coach.fullName }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">📅 تاریخ:</span>
              <span class="info-value">
                {{ formatDate(selectedProgram.startDate) }} تا {{ formatDate(selectedProgram.endDate) }}
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">⏱️ مدت:</span>
              <span class="info-value">{{ selectedProgram.durationWeeks }} هفته</span>
            </div>
          </div>
          
          <!-- Description -->
          <div class="description-card" v-if="selectedProgram.description">
            <div class="card-header">
              <span class="header-icon">📝</span>
              <h3>توضیحات</h3>
            </div>
            <p>{{ selectedProgram.description }}</p>
          </div>
          
          <!-- Weekly Schedule - Accordion for Mobile -->
          <div class="schedule-card">
            <div class="card-header">
              <span class="header-icon">📅</span>
              <h3>برنامه هفتگی</h3>
            </div>
            
            <div class="weeks-accordion">
              <div 
                v-for="week in selectedProgram.weeks" 
                :key="week.id"
                class="week-accordion-item"
                :class="{ expanded: expandedWeek === week.id }"
              >
                <div class="week-accordion-header" @click="toggleWeek(week.id)">
                  <div class="week-info">
                    <span class="week-title">هفته {{ week.weekNumber }}</span>
                    <span v-if="week.focus" class="week-focus-badge">
                      {{ week.focus }}
                    </span>
                  </div>
                  <div class="week-meta">
                    <span class="week-days-count">{{ week.days.length }} روز</span>
                    <span class="accordion-icon">
                      {{ expandedWeek === week.id ? '▼' : '◀' }}
                    </span>
                  </div>
                </div>
                
                <div class="week-accordion-content" v-show="expandedWeek === week.id">
                  <div 
                    v-for="day in week.days" 
                    :key="day.id"
                    class="day-item"
                  >
                    <div class="day-header">
                      <span class="day-name">{{ getDayName(day.dayName) }}</span>
                      <span v-if="day.duration" class="day-duration">
                        ⏱️ {{ day.duration }} دقیقه
                      </span>
                    </div>
                    
                    <div class="day-focus" v-if="day.focus">
                      🎯 {{ day.focus }}
                    </div>
                    
                    <div class="exercises-list" v-if="day.exercises.length > 0">
                      <div 
                        v-for="exercise in day.exercises" 
                        :key="exercise.id"
                        class="exercise-item"
                      >
                        <div class="exercise-header">
                          <div class="exercise-name">
                            <span class="exercise-dot"></span>
                            {{ exercise.name }}
                          </div>
                          <!-- دکمه نمایش انیمیشن برای مربی -->
                          <button 
                            v-if="exercise.gifUrl" 
                            @click.stop="showExerciseGif(exercise)"
                            class="exercise-gif-button"
                            title="نمایش انیمیشن حرکت"
                          >
                            🎬
                          </button>
                        </div>
                        
                        <div class="exercise-details">
                          <span class="detail-badge">{{ exercise.sets }} ست</span>
                          <span class="detail-badge">{{ exercise.reps }} تکرار</span>
                          <span class="detail-badge">{{ exercise.restTime }}</span>
                        </div>
                        
                        <div class="exercise-note" v-if="exercise.description">
                          {{ exercise.description }}
                        </div>

                        <!-- دکمه مشاهده انیمیشن در بخش پایین -->
                        <div v-if="exercise.gifUrl" class="exercise-gif-action">
                          <button 
                            @click.stop="showExerciseGif(exercise)"
                            class="view-gif-button"
                          >
                            🎬 مشاهده انیمیشن حرکت
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div v-else class="rest-day">
                      روز استراحت
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeModal" class="btn-secondary">
            بستن
          </button>
          <button @click="editProgram(selectedProgram)" class="btn-edit">
            ✏️ ویرایش
          </button>
          <button @click="printProgram(selectedProgram)" class="btn-primary">
            🖨️ چاپ
          </button>
        </div>
      </div>
    </div>

    <!-- مودال نمایش GIF -->
    <div v-if="showGifModal" class="modal-overlay" @click="closeGifModal">
      <div class="modal-content gif-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedExercise?.name }}</h3>
          <button @click="closeGifModal" class="btn-close">✕</button>
        </div>
        
        <div class="modal-body">
          <img 
            v-if="selectedExercise?.gifUrl"
            :src="selectedExercise.gifUrl" 
            :alt="selectedExercise.name"
            class="exercise-gif"
            loading="lazy"
          />
          <div class="exercise-details-modal">
            <div class="detail-item">
              <span class="detail-label">ست‌ها:</span>
              <span class="detail-value">{{ selectedExercise?.sets }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">تکرار:</span>
              <span class="detail-value">{{ selectedExercise?.reps }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">استراحت:</span>
              <span class="detail-value">{{ selectedExercise?.restTime }}</span>
            </div>
          </div>
          <div v-if="selectedExercise?.description" class="exercise-description">
            <strong>نکات:</strong>
            <p>{{ selectedExercise.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Action FAB for Mobile -->
    <div v-if="isMobile && programs.length > 0" class="fab-container">
      <button @click="goToCreateWorkout" class="fab-main-button">
        <span class="fab-main-icon">➕</span>
      </button>
    </div>
  </div>
</template>

<script setup>
// Import child components
import ProgramCard from './ProgramCard.vue'
import ProgramMobileCard from './ProgramMobileCard.vue'

// Reactive state
const programs = ref([])
const filteredPrograms = ref([])
const students = ref([])
const selectedStudentId = ref('')
const selectedStatus = ref('all')
const searchQuery = ref('')
const loading = ref(true)
const error = ref('')
const selectedProgram = ref(null)
const expandedWeek = ref(null)
const isMobile = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(9)

// Modal states for GIF
const showGifModal = ref(false)
const selectedExercise = ref(null)

// Status tabs for mobile
const statusTabs = [
  { value: 'all', label: 'همه' },
  { value: 'active', label: 'فعال' },
  { value: 'completed', label: 'تکمیل شده' }
]

// Days of week in Persian
const persianDays = {
  saturday: 'شنبه',
  sunday: 'یکشنبه',
  monday: 'دوشنبه',
  tuesday: 'سه‌شنبه',
  wednesday: 'چهارشنبه',
  thursday: 'پنجشنبه',
  friday: 'جمعه'
}

// Computed
const activeProgramsCount = computed(() => {
  return programs.value.filter(p => p.status === 'active').length
})

const totalStudentsCount = computed(() => {
  const uniqueStudents = new Set(programs.value.map(p => p.student?.id))
  return uniqueStudents.size
})

const totalWeeksCount = computed(() => {
  return programs.value.reduce((total, p) => total + (p.weeks?.length || 0), 0)
})

const totalPages = computed(() => {
  return Math.ceil(filteredPrograms.value.length / itemsPerPage.value)
})

const paginatedPrograms = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredPrograms.value.slice(start, end)
})

// Emit for parent component
const emit = defineEmits(['menu-changed'])

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  itemsPerPage.value = isMobile.value ? 5 : 9
}

// Fetch data on component mount
onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  await Promise.all([fetchStudents(), fetchPrograms()])
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Fetch students
const fetchStudents = async () => {
  try {
    const response = await $fetch('/api/students')
    if (response.success) {
      students.value = response.students
    }
  } catch (err) {
    console.error('Error fetching students:', err)
  }
}

// Fetch workout programs
const fetchPrograms = async () => {
  try {
    loading.value = true
    error.value = ''
    
    let url = '/api/workouts'
    if (selectedStudentId.value) {
      url += `?studentId=${selectedStudentId.value}`
    }
    
    const response = await $fetch(url)
    
    if (response.success) {
      programs.value = response.programs
      filterPrograms()
      console.log('Programs loaded with exercises:', programs.value[0]?.weeks[0]?.days[0]?.exercises)
    }
  } catch (err) {
    console.error('Error fetching workout programs:', err)
    error.value = err.data?.statusMessage || 'خطا در دریافت برنامه‌ها'
  } finally {
    loading.value = false
  }
}

// Filter programs
const filterPrograms = () => {
  let filtered = [...programs.value]
  
  // Filter by status
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(p => p.status === selectedStatus.value)
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.title?.toLowerCase().includes(query) ||
      p.student?.fullName?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    )
  }
  
  filteredPrograms.value = filtered
  currentPage.value = 1
}

// Set status filter
const setStatusFilter = (status) => {
  selectedStatus.value = status
  filterPrograms()
}

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
  filterPrograms()
}

// Pagination functions
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Show exercise GIF
const showExerciseGif = (exercise) => {
  console.log('Showing GIF for:', exercise.name, exercise.gifUrl)
  selectedExercise.value = exercise
  showGifModal.value = true
}

// Close GIF modal
const closeGifModal = () => {
  showGifModal.value = false
  selectedExercise.value = null
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

// Get day name in Persian
const getDayName = (dayName) => {
  return persianDays[dayName] || dayName
}

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'ثبت نشده'
  const date = new Date(dateString)
  return date.toLocaleDateString('fa-IR')
}

// Toggle week accordion
const toggleWeek = (weekId) => {
  expandedWeek.value = expandedWeek.value === weekId ? null : weekId
}

// Navigation functions
const goToCreateWorkout = () => {
  emit('menu-changed', 'create-workout')
}

const viewProgram = (program) => {
  selectedProgram.value = program
  expandedWeek.value = program.weeks[0]?.id || null
}

const editProgram = (program) => {
  alert(`ویرایش برنامه: ${program.title}\nاین بخش به زودی فعال می‌شود.`)
  closeModal()
}

const duplicateProgram = (program) => {
  alert(`تکثیر برنامه: ${program.title}\nاین بخش به زودی فعال می‌شود.`)
}

const deleteProgram = async (program) => {
  if (confirm(`آیا مطمئنید که می‌خواهید برنامه "${program.title}" را حذف کنید؟`)) {
    alert('حذف برنامه (در نسخه بعدی پیاده‌سازی می‌شود)')
  }
}

const closeModal = () => {
  selectedProgram.value = null
  expandedWeek.value = null
}

const printProgram = (program) => {
  window.print()
}
</script>

<style scoped>
.workout-programs-page {
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
  margin-bottom: 1.5rem;
}

.header-title h1 {
  color: #333;
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.header-title p {
  color: #666;
  margin: 0;
  font-size: 1rem;
}

/* FAB Button */
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

/* Stats Summary */
.stats-summary {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  line-height: 1;
}

.stat-label {
  color: #666;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

/* Filters Section */
.filters-section {
  background: white;
  padding: 1.25rem;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
}

.search-box {
  position: relative;
  margin-bottom: 1rem;
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.875rem 3rem 0.875rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.clear-search {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
}

.clear-search:hover {
  background: #f0f0f0;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.95rem;
}

.filter-icon {
  font-size: 1.1rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 0.95rem;
  min-width: 200px;
  background: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: left 1rem center;
  background-size: 1em;
  padding-left: 2.5rem;
}

/* Status Tabs */
.status-tabs {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.status-tab {
  padding: 0.5rem 1.25rem;
  border: 2px solid #e1e5e9;
  border-radius: 25px;
  background: white;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.status-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

/* Programs Container */
.programs-container {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  min-height: 500px;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  text-align: center;
  padding: 4rem 0;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-state h3 {
  color: #c62828;
  margin-bottom: 0.5rem;
}

.error-state p {
  color: #666;
  margin-bottom: 2rem;
}

.btn-retry {
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  color: #666;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-retry:hover {
  background: #e0e0e0;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 0;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  color: #666;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #888;
  margin-bottom: 2rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

/* Buttons */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: white;
  border: 2px solid #e0e0e0;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  color: #666;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
}

.btn-secondary:hover {
  background: #f5f5f5;
}

.btn-edit {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
}

.btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 152, 0, 0.3);
}

/* Programs Grid - Desktop */
.programs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* Programs List - Mobile */
.programs-mobile-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 2px solid #f0f0f0;
}

.pagination-btn {
  width: 44px;
  height: 44px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  background: white;
  color: #666;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #667eea;
  color: #667eea;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.current-page {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.total-pages {
  color: #666;
  font-size: 0.9rem;
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
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.modal-header-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.modal-header-content h2 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.program-status {
  display: inline-block;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  width: fit-content;
}

.program-status.active {
  background: #e8f5e9;
  color: #2e7d32;
}

.program-status.completed {
  background: #e3f2fd;
  color: #1976d2;
}

.program-status.cancelled {
  background: #ffebee;
  color: #c62828;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.btn-close:hover {
  background: #f5f5f5;
  color: #f44336;
}

.modal-body {
  padding: 1.5rem;
}

/* Modal Cards */
.program-info-card,
.description-card,
.schedule-card {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e9ecef;
}

.header-icon {
  font-size: 1.2rem;
}

.card-header h3 {
  margin: 0;
  color: #444;
  font-size: 1.1rem;
}

.info-row {
  display: flex;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  width: 100px;
  color: #666;
  font-size: 0.9rem;
}

.info-value {
  flex: 1;
  color: #333;
  font-weight: 500;
  font-size: 0.95rem;
}

.description-card p {
  margin: 0;
  color: #666;
  line-height: 1.7;
}

/* Weeks Accordion */
.weeks-accordion {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.week-accordion-item {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
}

.week-accordion-item.expanded {
  border-color: #667eea;
}

.week-accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.week-accordion-header:active {
  background: #f8f9fa;
}

.week-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.week-title {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.week-focus-badge {
  color: #667eea;
  font-size: 0.8rem;
  background: #eef2ff;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  width: fit-content;
}

.week-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.week-days-count {
  color: #666;
  font-size: 0.85rem;
}

.accordion-icon {
  color: #999;
  font-size: 0.9rem;
}

.week-accordion-content {
  padding: 1rem;
  border-top: 1px solid #f0f0f0;
  background: #f8f9fa;
}

/* Day Items */
.day-item {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  border: 1px solid #e9ecef;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed #dee2e6;
}

.day-name {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.day-duration {
  color: #667eea;
  font-size: 0.85rem;
}

.day-focus {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 6px;
  border-right: 3px solid #ff9800;
}

/* Exercise Items */
.exercise-item {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
}

.exercise-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.exercise-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.exercise-dot {
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
}

/* Exercise GIF Button */
.exercise-gif-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  transition: transform 0.2s ease;
  border-radius: 4px;
}

.exercise-gif-button:hover {
  transform: scale(1.2);
  background: #f0f0f0;
}

.exercise-gif-button:active {
  transform: scale(1.1);
}

.exercise-details {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.detail-badge {
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
  color: #666;
  border: 1px solid #e0e0e0;
}

.exercise-note {
  color: #666;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #fff3e0;
  border-radius: 6px;
  font-style: italic;
}

/* Exercise GIF Action */
.exercise-gif-action {
  margin-top: 0.5rem;
  text-align: center;
}

.view-gif-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.view-gif-button:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.view-gif-button:active {
  transform: scale(0.97);
}

.rest-day {
  text-align: center;
  color: #999;
  padding: 1rem;
  font-style: italic;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
}

/* Modal Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #f0f0f0;
  position: sticky;
  bottom: 0;
  background: white;
}

/* FAB Container */
.fab-container {
  position: fixed;
  bottom: 2rem;
  left: 1rem;
  z-index: 100;
}

.fab-main-button {
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

.fab-main-button:active {
  transform: scale(0.95);
}

.fab-main-icon {
  font-size: 1.5rem;
}

/* GIF Modal */
.gif-modal {
  max-width: 500px;
}

.exercise-gif {
  width: 100%;
  height: auto;
  border-radius: 12px;
  margin-bottom: 1rem;
  background: #f8f9fa;
}

.exercise-details-modal {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 8px;
}

.detail-label {
  color: #666;
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.detail-value {
  color: #333;
  font-weight: 600;
  font-size: 1rem;
}

.exercise-description {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.6;
}

.exercise-description strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #444;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .programs-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .workout-programs-page {
    padding: 0.75rem;
  }

  .header-title h1 {
    font-size: 1.5rem;
  }

  .header-title p {
    font-size: 0.9rem;
  }

  .stats-summary {
    padding: 1rem;
    justify-content: space-around;
    gap: 1rem;
  }

  .stat-item {
    min-width: auto;
  }

  .stat-value {
    font-size: 1.6rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }

  .filters-section {
    padding: 1rem;
  }

  .filter-select {
    width: 100%;
    min-width: auto;
  }

  .programs-container {
    padding: 1rem;
  }

  .modal-content {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .modal-header {
    padding: 1rem;
  }

  .modal-body {
    padding: 1rem;
  }

  .modal-footer {
    padding: 1rem;
    flex-direction: column;
  }

  .modal-footer button {
    width: 100%;
  }

  .info-row {
    flex-direction: column;
    gap: 0.25rem;
  }

  .info-label {
    width: auto;
  }

  .exercise-details-modal {
    grid-template-columns: 1fr;
  }

  .fab-container {
    bottom: 1.5rem;
    left: 1rem;
  }

  .fab-main-button {
    width: 52px;
    height: 52px;
  }
}

@media (max-width: 480px) {
  .stats-summary {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .stat-item {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .stat-value {
    font-size: 1.4rem;
  }

  .stat-label {
    margin-top: 0;
  }

  .programs-container {
    padding: 0.75rem;
  }

  .week-meta {
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
  }

  .fab-container {
    bottom: 1rem;
    left: 0.75rem;
  }

  .fab-main-button {
    width: 48px;
    height: 48px;
  }

  .fab-main-icon {
    font-size: 1.3rem;
  }
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  .btn-primary,
  .btn-secondary,
  .btn-edit,
  .filter-select,
  .status-tab,
  .week-accordion-header,
  .fab-main-button,
  .exercise-gif-button,
  .view-gif-button {
    min-height: 48px;
  }

  .week-accordion-header:active {
    background: #f0f0f0;
  }

  .btn-primary:active,
  .btn-edit:active,
  .fab-main-button:active,
  .exercise-gif-button:active,
  .view-gif-button:active {
    transform: scale(0.96);
  }
}

/* RTL Support */
[dir="rtl"] .search-icon {
  right: 1rem;
  left: auto;
}

[dir="rtl"] .search-input {
  padding: 0.875rem 3rem 0.875rem 1rem;
}

[dir="rtl"] .clear-search {
  left: 1rem;
  right: auto;
}

[dir="rtl"] .filter-select {
  background-position: right 1rem center;
  padding-right: 2.5rem;
  padding-left: 1rem;
}

[dir="rtl"] .fab-container {
  left: auto;
  right: 1rem;
}

[dir="rtl"] .pagination-btn:first-child {
  transform: scaleX(-1);
}

[dir="rtl"] .pagination-btn:last-child {
  transform: scaleX(-1);
}

[dir="rtl"] .accordion-icon {
  transform: scaleX(-1);
}

/* Safe Area Support */
@supports (padding: max(0px)) {
  .workout-programs-page {
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }

  .fab-container {
    bottom: max(2rem, env(safe-area-inset-bottom));
    left: max(1rem, env(safe-area-inset-left));
  }

  [dir="rtl"] .fab-container {
    right: max(1rem, env(safe-area-inset-right));
    left: auto;
  }

  .modal-content {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .spinner,
  .btn-primary,
  .fab-button,
  .fab-main-button,
  .modal-content,
  .exercise-gif-button,
  .view-gif-button {
    animation: none;
    transition: none;
  }
}

/* Print Styles */
@media print {
  .filters-section,
  .programs-header button,
  .program-actions,
  .btn-action,
  .fab-container,
  .pagination,
  .modal-footer,
  .btn-close,
  .exercise-gif-button,
  .view-gif-button,
  .gif-modal {
    display: none !important;
  }

  .programs-container {
    box-shadow: none;
    padding: 0;
  }

  .program-card,
  .program-mobile-card {
    break-inside: avoid;
    border: 1px solid #000;
  }
}
</style>