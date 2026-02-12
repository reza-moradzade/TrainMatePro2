
<template>
  <div class="workout-programs-page">
    <div class="page-header">
      <h1>📅 برنامه‌های تمرینی</h1>
      <p>مدیریت برنامه‌های تمرینی شاگردان</p>
    </div>

    <div class="programs-container">
      <div class="programs-header">
        <div class="filters">
          <div class="filter-group">
            <label>فیلتر بر اساس شاگرد:</label>
            <select v-model="selectedStudentId" @change="fetchPrograms" class="form-input">
              <option value="">همه شاگردان</option>
              <option v-for="student in students" :key="student.id" :value="student.id">
                {{ student.fullName }}
              </option>
            </select>
          </div>
        </div>
        
        <button @click="goToCreateWorkout" class="btn-primary">
          🏋️‍♂️ ایجاد برنامه جدید
        </button>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>در حال بارگذاری برنامه‌ها...</p>
      </div>

      <div v-else-if="programs.length === 0" class="empty-state">
        <div class="empty-icon">📅</div>
        <h3>هنوز برنامه تمرینی وجود ندارد</h3>
        <p>برای شاگردان خود برنامه تمرینی ایجاد کنید.</p>
        <button @click="goToCreateWorkout" class="btn-primary">
          ایجاد اولین برنامه
        </button>
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
            <div class="program-meta">
              <span class="meta-item">
                <span class="meta-icon">👤</span>
                {{ program.student.fullName }}
              </span>
              <span class="meta-item">
                <span class="meta-icon">📅</span>
                {{ formatDate(program.startDate) }} تا {{ formatDate(program.endDate) }}
              </span>
              <span class="meta-item">
                <span class="meta-icon">⏱️</span>
                {{ program.durationWeeks }} هفته
              </span>
            </div>
          </div>
          
          <div class="program-content">
            <p class="program-description">{{ program.description || 'بدون توضیح' }}</p>
            
            <div class="program-weeks">
              <div class="weeks-summary">
                <h4>هفته‌های برنامه:</h4>
                <div class="weeks-grid">
                  <div class="week-preview" v-for="week in program.weeks.slice(0, 4)" :key="week.id">
                    <div class="week-preview-header">
                      <span class="week-number">هفته {{ week.weekNumber }}</span>
                      <span class="week-focus" v-if="week.focus">{{ week.focus }}</span>
                    </div>
                    <div class="week-days">
                      <span class="day-count">{{ week.days.length }} روز</span>
                      <span class="exercises-count">
                        {{ countExercises(week) }} حرکت
                      </span>
                    </div>
                  </div>
                  
                  <div v-if="program.weeks.length > 4" class="more-weeks">
                    + {{ program.weeks.length - 4 }} هفته دیگر
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="program-actions">
            <button @click="viewProgram(program)" class="btn-action">
              👁️ مشاهده جزئیات
            </button>
            <button @click="editProgram(program)" class="btn-action">
              ✏️ ویرایش
            </button>
            <button @click="deleteProgram(program)" class="btn-action delete">
              🗑️ حذف
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Program Detail Modal -->
    <div v-if="selectedProgram" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedProgram.title }}</h2>
          <button @click="closeModal" class="btn-close">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="program-detail">
            <div class="detail-section">
              <h3>📋 اطلاعات کلی</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">شاگرد:</span>
                  <span class="detail-value">{{ selectedProgram.student.fullName }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">مربی:</span>
                  <span class="detail-value">{{ selectedProgram.coach.fullName }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">مدت:</span>
                  <span class="detail-value">{{ selectedProgram.durationWeeks }} هفته</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">وضعیت:</span>
                  <span class="detail-value" :class="selectedProgram.status">
                    {{ getStatusText(selectedProgram.status) }}
                  </span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">تاریخ شروع:</span>
                  <span class="detail-value">{{ formatDate(selectedProgram.startDate) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">تاریخ پایان:</span>
                  <span class="detail-value">{{ formatDate(selectedProgram.endDate) }}</span>
                </div>
              </div>
            </div>
            
            <div class="detail-section" v-if="selectedProgram.description">
              <h3>📝 توضیحات</h3>
              <p>{{ selectedProgram.description }}</p>
            </div>
            
            <div class="detail-section">
              <h3>📅 برنامه هفتگی</h3>
              <div class="weeks-detail">
                <div class="week-detail" v-for="week in selectedProgram.weeks" :key="week.id">
                  <div class="week-detail-header">
                    <h4>{{ week.title }} (هفته {{ week.weekNumber }})</h4>
                    <span class="week-focus" v-if="week.focus">{{ week.focus }}</span>
                  </div>
                  
                  <div class="days-detail">
                    <div class="day-detail" v-for="day in week.days" :key="day.id">
                      <div class="day-detail-header">
                        <h5>{{ getDayName(day.dayName) }} - {{ day.title }}</h5>
                        <span v-if="day.duration" class="day-duration">
                          ⏱️ {{ day.duration }} دقیقه
                        </span>
                      </div>
                      
                      <div v-if="day.focus" class="day-focus">
                        <strong>تمرکز:</strong> {{ day.focus }}
                      </div>
                      
                      <div class="exercises-detail" v-if="day.exercises.length > 0">
                        <h6>حرکات:</h6>
                        <div class="exercises-table">
                          <div class="exercise-row header">
                            <div class="ex-col-name">حرکت</div>
                            <div class="ex-col-sets">ست</div>
                            <div class="ex-col-reps">تکرار</div>
                            <div class="ex-col-rest">استراحت</div>
                          </div>
                          
                          <div class="exercise-row" v-for="exercise in day.exercises" :key="exercise.id">
                            <div class="ex-col-name">
                              <strong>{{ exercise.name }}</strong>
                              <div v-if="exercise.description" class="ex-description">
                                {{ exercise.description }}
                              </div>
                            </div>
                            <div class="ex-col-sets">{{ exercise.sets }}</div>
                            <div class="ex-col-reps">{{ exercise.reps }}</div>
                            <div class="ex-col-rest">{{ exercise.restTime }}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div v-else class="no-exercises">
                        هیچ حرکتی برای این روز تعریف نشده است
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
// Reactive state
const programs = ref([])
const students = ref([])
const selectedStudentId = ref('')
const loading = ref(true)
const selectedProgram = ref(null)

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

// Emit for parent component
const emit = defineEmits(['menu-changed'])

// Fetch data on component mount
onMounted(async () => {
  await Promise.all([fetchStudents(), fetchPrograms()])
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
    let url = '/api/workouts'
    if (selectedStudentId.value) {
      url += `?studentId=${selectedStudentId.value}`
    }
    
    const response = await $fetch(url)
    
    if (response.success) {
      programs.value = response.programs
    }
  } catch (err) {
    console.error('Error fetching workout programs:', err)
  } finally {
    loading.value = false
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

// Count total exercises in a week
const countExercises = (week) => {
  return week.days.reduce((total, day) => total + day.exercises.length, 0)
}

// Navigation functions
const goToCreateWorkout = () => {
  emit('menu-changed', 'create-workout')
}

const viewProgram = (program) => {
  selectedProgram.value = program
}

const editProgram = (program) => {
  alert(`ویرایش برنامه: ${program.title}\nاین بخش به زودی فعال می‌شود.`)
}

const deleteProgram = async (program) => {
  if (confirm(`آیا مطمئنید که می‌خواهید برنامه "${program.title}" را حذف کنید؟`)) {
    // Here you would call delete API
    alert('حذف برنامه (در نسخه بعدی پیاده‌سازی می‌شود)')
  }
}

const closeModal = () => {
  selectedProgram.value = null
}

const printProgram = (program) => {
  window.print()
}
</script>

<style scoped>
.workout-programs-page {
  direction: rtl;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}

.page-header p {
  color: #666;
  font-size: 1rem;
}

.programs-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.programs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.filters {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.form-input {
  padding: 0.5rem 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.95rem;
  min-width: 200px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

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
}

.programs-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.program-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.program-card:hover {
  border-color: #667eea;
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.1);
}

.program-header {
  margin-bottom: 1.5rem;
}

.program-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.program-title h3 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.program-status {
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
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

.program-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.meta-icon {
  font-size: 1rem;
}

.program-content {
  margin-bottom: 1.5rem;
}

.program-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.program-weeks {
  background: white;
  padding: 1rem;
  border-radius: 8px;
}

.weeks-summary h4 {
  margin: 0 0 1rem 0;
  color: #444;
  font-size: 1.1rem;
}

.weeks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.week-preview {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 0.75rem;
}

.week-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.week-number {
  font-weight: 600;
  color: #444;
  font-size: 0.9rem;
}

.week-focus {
  color: #666;
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

.week-days {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #888;
}

.more-weeks {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-weight: 600;
  font-size: 0.9rem;
}

.program-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn-action {
  padding: 0.5rem 1rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-action:hover {
  background: #f5f5f5;
  border-color: #667eea;
  color: #667eea;
}

.btn-action.delete:hover {
  border-color: #f44336;
  color: #f44336;
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
}

.program-detail {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section h3 {
  color: #444;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #667eea;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-label {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.detail-value {
  color: #333;
  font-weight: 500;
}

.detail-section p {
  color: #666;
  line-height: 1.6;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.weeks-detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.week-detail {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 1.25rem;
}

.week-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #dee2e6;
}

.week-detail-header h4 {
  margin: 0;
  color: #444;
  font-size: 1.1rem;
}

.week-detail-header .week-focus {
  color: #667eea;
  font-weight: 500;
  font-size: 0.9rem;
}

.days-detail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.day-detail {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 1rem;
}

.day-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed #dee2e6;
}

.day-detail-header h5 {
  margin: 0;
  color: #444;
  font-size: 1rem;
}

.day-duration {
  color: #666;
  font-size: 0.9rem;
}

.day-focus {
  color: #666;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.exercises-detail h6 {
  margin: 0 0 0.75rem 0;
  color: #555;
  font-size: 0.95rem;
}

.exercises-table {
  display: table;
  width: 100%;
  border-collapse: collapse;
}

.exercise-row {
  display: table-row;
  border-bottom: 1px solid #f0f0f0;
}

.exercise-row.header {
  font-weight: 600;
  background: #f8f9fa;
}

.exercise-row.header .ex-col-name {
  border-right: none;
}

.ex-col-name,
.ex-col-sets,
.ex-col-reps,
.ex-col-rest {
  display: table-cell;
  padding: 0.75rem;
  vertical-align: top;
}

.ex-col-name {
  width: 50%;
  text-align: right;
}

.ex-col-sets,
.ex-col-reps,
.ex-col-rest {
  width: 16.66%;
  text-align: center;
}

.ex-description {
  color: #666;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  font-style: italic;
}

.no-exercises {
  color: #999;
  text-align: center;
  padding: 1rem;
  font-style: italic;
  background: #f8f9fa;
  border-radius: 6px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #f0f0f0;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
  border: 2px solid #e0e0e0;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

/* Print Styles */
@media print {
  .modal-overlay {
    position: static;
    background: none;
  }
  
  .modal-content {
    max-width: none;
    max-height: none;
    box-shadow: none;
    border: 1px solid #000;
  }
  
  .modal-header,
  .modal-footer,
  .program-actions,
  .filters,
  .programs-header button {
    display: none !important;
  }
}
</style>