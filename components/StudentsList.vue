<template>
  <div class="students-page">
    <!-- Page Header - Responsive -->
    <div class="page-header">
      <div class="header-top">
        <div class="header-title">
          <h1>👥 شاگردان من</h1>
          <p>لیست شاگردان تحت آموزش شما</p>
        </div>
        
        <!-- Add Student Button - Mobile Optimized -->
        <button @click="goToAddStudent" class="btn-add">
          <span class="btn-icon">➕</span>
          <span class="btn-text">{{ isMobile ? 'افزودن' : 'افزودن شاگرد' }}</span>
        </button>
      </div>

      <!-- Stats Summary - Responsive -->
      <div class="stats-summary">
        <div class="stat-item">
          <span class="stat-number">{{ students.length }}</span>
          <span class="stat-label">تعداد شاگردان</span>
        </div>
        <div class="stat-item" v-if="!isMobile">
          <span class="stat-number">{{ activeStudentsCount }}</span>
          <span class="stat-label">شاگردان فعال</span>
        </div>
        <div class="stat-item" v-if="!isMobile">
          <span class="stat-number">{{ totalProgramsCount }}</span>
          <span class="stat-label">برنامه‌های فعال</span>
        </div>
      </div>
    </div>

    <!-- Search Bar - Mobile Optimized -->
    <div class="search-section" v-if="students.length > 0">
      <div class="search-container">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="جستجوی شاگرد..."
          class="search-input"
          @input="filterStudents"
        />
        <button v-if="searchQuery" @click="clearSearch" class="clear-search">
          ✕
        </button>
      </div>
      
      <!-- Filter Tabs - Mobile -->
      <div class="filter-tabs" v-if="isMobile">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          :class="{ active: currentFilter === filter.value }"
          @click="setFilter(filter.value)"
          class="filter-tab"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Students Container -->
    <div class="students-container">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>در حال بارگذاری شاگردان...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>خطا در بارگذاری</h3>
        <p>{{ error }}</p>
        <button @click="fetchStudents" class="btn-retry">
          🔄 تلاش مجدد
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredStudents.length === 0" class="empty-state">
        <div class="empty-icon">
          {{ searchQuery ? '🔍' : '👥' }}
        </div>
        <h3>
          {{ searchQuery ? 'نتیجه‌ای یافت نشد' : 'هنوز شاگردی ندارید' }}
        </h3>
        <p>
          {{ searchQuery 
            ? 'شاگردی با این مشخصات پیدا نشد. لطفاً جستجوی دیگری انجام دهید.' 
            : 'با کلیک روی دکمه "افزودن شاگرد" اولین شاگرد خود را اضافه کنید.' 
          }}
        </p>
        <button v-if="!searchQuery" @click="goToAddStudent" class="btn-primary">
          ➕ افزودن شاگرد
        </button>
        <button v-else @click="clearSearch" class="btn-secondary">
          🗑️ پاک کردن جستجو
        </button>
      </div>

      <!-- Students Grid/List -->
      <div v-else class="students-list">
        <!-- Desktop Grid -->
        <div v-if="!isMobile" class="students-grid">
          <div v-for="student in paginatedStudents" :key="student.id" class="student-card">
            <StudentCard 
              :student="student" 
              @view="viewStudent"
              @edit="editStudent"
              @workout="createWorkout"
            />
          </div>
        </div>

        <!-- Mobile List -->
        <div v-else class="students-mobile-list">
          <div v-for="student in paginatedStudents" :key="student.id" class="student-mobile-card">
            <StudentMobileCard 
              :student="student" 
              @view="viewStudent"
              @edit="editStudent"
              @workout="createWorkout"
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

    <!-- Quick Actions FAB for Mobile -->
    <div v-if="isMobile && students.length > 0" class="fab-container">
      <button @click="goToAddStudent" class="fab-button">
        <span class="fab-icon">➕</span>
      </button>
    </div>
  </div>
</template>

<script setup>
// Import child components
import StudentCard from './StudentCard.vue'
import StudentMobileCard from './StudentMobileCard.vue'

// Reactive state
const students = ref([])
const filteredStudents = ref([])
const loading = ref(true)
const error = ref('')
const isMobile = ref(false)
const searchQuery = ref('')
const currentFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = ref(9) // 3x3 grid for desktop, 6 for mobile

// Filters
const filters = [
  { value: 'all', label: 'همه' },
  { value: 'active', label: 'فعال' },
  { value: 'new', label: 'جدید' }
]

// Computed stats
const activeStudentsCount = computed(() => {
  return students.value.filter(s => s.programCount > 0).length
})

const totalProgramsCount = computed(() => {
  return students.value.reduce((sum, s) => sum + (s.programCount || 0), 0)
})

const totalPages = computed(() => {
  return Math.ceil(filteredStudents.value.length / itemsPerPage.value)
})

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredStudents.value.slice(start, end)
})

// Emit for parent component
const emit = defineEmits(['menu-changed'])

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  itemsPerPage.value = isMobile.value ? 6 : 9
}

// Fetch students on component mount
onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  await fetchStudents()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Fetch students from API
const fetchStudents = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await $fetch('/api/students')
    
    console.log('Students response:', response)
    
    if (response.success) {
      students.value = response.students.map(student => ({
        ...student,
        programCount: Math.floor(Math.random() * 5) + 1 // Placeholder
      }))
      filteredStudents.value = students.value
    } else {
      error.value = response.message || 'خطا در دریافت لیست شاگردان'
    }
  } catch (err) {
    console.error('Error fetching students:', err)
    error.value = err.data?.statusMessage || err.message || 'خطا در دریافت لیست شاگردان'
  } finally {
    loading.value = false
  }
}

// Filter students based on search query
const filterStudents = () => {
  const query = searchQuery.value.toLowerCase()
  filteredStudents.value = students.value.filter(student => 
    student.fullName.toLowerCase().includes(query) ||
    student.email.toLowerCase().includes(query)
  )
  currentPage.value = 1
}

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
  filteredStudents.value = students.value
  currentPage.value = 1
}

// Set filter
const setFilter = (filter) => {
  currentFilter.value = filter
  // Apply filter logic here
  currentPage.value = 1
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

// Navigation functions
const goToAddStudent = () => {
  emit('menu-changed', 'add-student')
}

const viewStudent = (student) => {
  // Show student details modal or navigate
  alert(`مشاهده شاگرد: ${student.fullName}\nاین بخش به زودی فعال می‌شود.`)
}

const editStudent = (student) => {
  alert(`ویرایش شاگرد: ${student.fullName}\nاین بخش به زودی فعال می‌شود.`)
}

const createWorkout = (student) => {
  // Navigate to create workout with pre-selected student
  emit('menu-changed', 'create-workout')
}

// Get initials from full name
const getInitials = (fullName) => {
  if (!fullName) return '??'
  return fullName.split(' ').map(n => n[0]).join('').toUpperCase()
}
</script>

<style scoped>
.students-page {
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
  flex-wrap: wrap;
  gap: 1rem;
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

/* Add Button */
.btn-add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.btn-add:active {
  transform: scale(0.98);
}

.btn-icon {
  font-size: 1.1rem;
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
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
}

.stat-number {
  font-size: 2.2rem;
  font-weight: bold;
  color: #667eea;
  line-height: 1;
}

.stat-label {
  color: #666;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

/* Search Section */
.search-section {
  margin-bottom: 1.5rem;
}

.search-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin-bottom: 1rem;
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 1.1rem;
}

.search-input {
  width: 100%;
  padding: 0.875rem 3rem 0.875rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
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
  font-size: 1rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.clear-search:hover {
  background: #f0f0f0;
  color: #666;
}

/* Filter Tabs */
.filter-tabs {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  -webkit-overflow-scrolling: touch;
}

.filter-tab {
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

.filter-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

/* Students Container */
.students-container {
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

/* Students Grid - Desktop */
.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* Students List - Mobile */
.students-mobile-list {
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

/* FAB for Mobile */
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
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fab-button:hover {
  transform: scale(1.1);
}

.fab-button:active {
  transform: scale(0.95);
}

.fab-icon {
  font-size: 1.5rem;
}

/* Tablet Styles */
@media (max-width: 1024px) {
  .students-page {
    padding: 0.75rem;
  }

  .students-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }
}

/* Mobile Styles */
@media (max-width: 768px) {
  .students-page {
    padding: 0.5rem;
  }

  .header-top {
    flex-direction: column;
    align-items: stretch;
  }

  .header-title h1 {
    font-size: 1.5rem;
  }

  .btn-add {
    justify-content: center;
  }

  .stats-summary {
    padding: 1rem;
    justify-content: space-around;
    gap: 1rem;
  }

  .stat-item {
    min-width: auto;
  }

  .stat-number {
    font-size: 1.8rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .students-container {
    padding: 1rem;
  }

  .search-container {
    max-width: 100%;
  }

  .search-input {
    padding: 0.75rem 2.75rem 0.75rem 0.75rem;
    font-size: 16px; /* Prevent zoom on mobile */
  }

  .filter-tabs {
    gap: 0.4rem;
  }

  .filter-tab {
    padding: 0.4rem 1rem;
    font-size: 0.85rem;
  }

  .pagination {
    gap: 1rem;
  }

  .pagination-btn {
    width: 40px;
    height: 40px;
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

/* Small Mobile Styles */
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

  .stat-number {
    font-size: 1.5rem;
  }

  .stat-label {
    margin-top: 0;
  }

  .students-container {
    padding: 0.75rem;
  }

  .empty-icon {
    font-size: 3rem;
  }

  .empty-state h3 {
    font-size: 1.1rem;
  }

  .empty-state p {
    font-size: 0.9rem;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    padding: 0.75rem;
  }

  .fab-container {
    bottom: 1rem;
    left: 0.75rem;
  }

  .fab-button {
    width: 48px;
    height: 48px;
  }

  .fab-icon {
    font-size: 1.3rem;
  }
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  .btn-add,
  .btn-primary,
  .btn-secondary,
  .btn-retry,
  .filter-tab,
  .pagination-btn,
  .fab-button {
    min-height: 48px;
  }

  .btn-add:active,
  .btn-primary:active,
  .fab-button:active {
    transform: scale(0.96);
  }

  .student-card:active,
  .student-mobile-card:active {
    background: #f5f5f5;
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

/* Safe Area Support */
@supports (padding: max(0px)) {
  .students-page {
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
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .spinner,
  .btn-add,
  .btn-primary,
  .fab-button,
  .student-card {
    animation: none;
    transition: none;
  }
}

/* Print Styles */
@media print {
  .btn-add,
  .search-section,
  .filter-tabs,
  .pagination,
  .fab-container {
    display: none !important;
  }

  .students-container {
    box-shadow: none;
    padding: 0;
  }

  .student-card,
  .student-mobile-card {
    break-inside: avoid;
  }
}
</style>