<template>
  <div class="create-workout-page">
    <!-- Page Header - Responsive -->
    <div class="page-header">
      <div class="header-top">
        <button v-if="isMobile && currentStep > 1" @click="prevStep" class="back-button">
          <span class="back-icon">←</span>
        </button>
        <div class="header-title">
          <h1>🏋️‍♂️ ایجاد برنامه تمرینی</h1>
          <p>برنامه‌ای برای شاگرد خود ایجاد کنید</p>
        </div>
        <button v-if="isMobile" @click="showHelp = !showHelp" class="help-button">
          <span class="help-icon">❓</span>
        </button>
      </div>

      <!-- Progress Bar - Mobile -->
      <div v-if="isMobile" class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
        <div class="progress-steps">
          <div class="progress-step" :class="{ active: currentStep >= 1 }">
            <span class="step-number">۱</span>
            <span class="step-label">اطلاعات</span>
          </div>
          <div class="progress-step" :class="{ active: currentStep >= 2 }">
            <span class="step-number">۲</span>
            <span class="step-label">برنامه</span>
          </div>
          <div class="progress-step" :class="{ active: currentStep >= 3 }">
            <span class="step-number">۳</span>
            <span class="step-label">مرور</span>
          </div>
        </div>
      </div>

      <!-- Desktop Step Indicator -->
      <div v-else class="step-indicator">
        <span class="step" :class="{ active: currentStep === 1 }">۱</span>
        <span class="step" :class="{ active: currentStep === 2 }">۲</span>
        <span class="step" :class="{ active: currentStep === 3 }">۳</span>
      </div>
    </div>

    <!-- Help Modal - Mobile -->
    <div v-if="showHelp" class="help-modal" @click="showHelp = false">
      <div class="help-content" @click.stop>
        <div class="help-header">
          <h3>📋 راهنمای ایجاد برنامه</h3>
          <button @click="showHelp = false" class="close-help">✕</button>
        </div>
        <div class="help-body">
          <div class="help-item">
            <span class="help-icon">📝</span>
            <div class="help-text">
              <strong>مرحله ۱:</strong>
              <p>اطلاعات اولیه برنامه را وارد کنید. شاگرد، عنوان و تاریخ شروع را انتخاب کنید.</p>
            </div>
          </div>
          <div class="help-item">
            <span class="help-icon">📅</span>
            <div class="help-text">
              <strong>مرحله ۲:</strong>
              <p>برنامه هفتگی را تنظیم کنید. برای هر روز می‌توانید حرکات مورد نظر را اضافه کنید.</p>
            </div>
          </div>
          <div class="help-item">
            <span class="help-icon">👁️</span>
            <div class="help-text">
              <strong>مرحله ۳:</strong>
              <p>اطلاعات را مرور کنید و برنامه را ثبت کنید.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="workout-form">
        <!-- Step 1: Basic Information -->
        <div class="form-section" v-show="currentStep === 1">
          <h3>
            <span class="section-icon">📋</span>
            اطلاعات اولیه برنامه
          </h3>
          
          <div class="form-card">
            <div class="form-group">
              <label for="studentId">
                <span class="required-star">*</span>
                شاگرد
              </label>
              <div class="select-wrapper">
                <span class="select-icon">👤</span>
                <select 
                  id="studentId" 
                  v-model="form.studentId" 
                  required 
                  class="form-input"
                  @change="loadStudentInfo"
                >
                  <option value="">انتخاب شاگرد</option>
                  <option v-for="student in students" :key="student.id" :value="student.id">
                    {{ student.fullName }}
                  </option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label for="title">
                <span class="required-star">*</span>
                عنوان برنامه
              </label>
              <div class="input-wrapper">
                <span class="input-icon">🏷️</span>
                <input
                  id="title"
                  v-model="form.title"
                  type="text"
                  placeholder="مثال: برنامه فیتنس ۴ هفته‌ای"
                  required
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group half">
                <label for="startDate">
                  <span class="required-star">*</span>
                  تاریخ شروع
                </label>
                <div class="input-wrapper">
                  <span class="input-icon">📅</span>
                  <input
                    id="startDate"
                    v-model="form.startDate"
                    type="date"
                    required
                    class="form-input"
                    @change="calculateEndDate"
                  />
                </div>
              </div>
              
              <div class="form-group half">
                <label for="durationWeeks">
                  <span class="required-star">*</span>
                  مدت برنامه
                </label>
                <div class="select-wrapper">
                  <span class="select-icon">⏱️</span>
                  <select 
                    id="durationWeeks" 
                    v-model="form.durationWeeks" 
                    required 
                    class="form-input"
                    @change="calculateEndDate"
                  >
                    <option value="1">۱ هفته</option>
                    <option value="2">۲ هفته</option>
                    <option value="3">۳ هفته</option>
                    <option value="4" selected>۴ هفته</option>
                    <option value="8">۸ هفته</option>
                    <option value="12">۱۲ هفته</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="endDate">تاریخ پایان</label>
              <div class="input-wrapper readonly">
                <span class="input-icon">📅</span>
                <input
                  id="endDate"
                  v-model="form.endDate"
                  type="date"
                  readonly
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="description">توضیحات</label>
              <div class="textarea-wrapper">
                <span class="textarea-icon">📝</span>
                <textarea
                  id="description"
                  v-model="form.description"
                  placeholder="توضیح مختصر درباره برنامه"
                  class="form-input"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          <div v-if="selectedStudent" class="student-info-card">
            <div class="student-info-header">
              <span class="header-icon">👤</span>
              <h4>اطلاعات شاگرد</h4>
            </div>
            <div class="student-details">
              <div class="detail-row">
                <span class="detail-label">نام:</span>
                <span class="detail-value">{{ selectedStudent.fullName }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">سن:</span>
                <span class="detail-value">{{ selectedStudent.age || 'ثبت نشده' }} سال</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">قد/وزن:</span>
                <span class="detail-value">{{ selectedStudent.height || '?' }}cm / {{ selectedStudent.weight || '?' }}kg</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">سطح:</span>
                <span class="detail-value badge">{{ getFitnessLevelText(selectedStudent.fitnessLevel) }}</span>
              </div>
              <div class="detail-row" v-if="selectedStudent.goals">
                <span class="detail-label">اهداف:</span>
                <span class="detail-value">{{ selectedStudent.goals }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Weekly Schedule - Mobile Optimized -->
        <div class="form-section" v-show="currentStep === 2">
          <h3>
            <span class="section-icon">📅</span>
            برنامه هفتگی
          </h3>
          <p class="section-description">
            برنامه تمرینی هفته اول را تنظیم کنید. این برنامه برای {{ form.durationWeeks }} هفته تکرار خواهد شد.
          </p>

          <!-- Week Selector for Mobile -->
          <div v-if="isMobile" class="week-selector">
            <div class="week-tabs">
              <button 
                v-for="week in form.weeks" 
                :key="week.weekNumber"
                :class="{ active: selectedWeek === week.weekNumber }"
                @click="selectedWeek = week.weekNumber"
                class="week-tab"
              >
                هفته {{ week.weekNumber }}
              </button>
            </div>
          </div>

          <div class="weeks-container">
            <div 
              v-for="week in form.weeks" 
              :key="week.weekNumber"
              v-show="!isMobile || week.weekNumber === selectedWeek"
              class="week-card"
            >
              <div class="week-header">
                <div class="week-title">
                  <h4>{{ week.title }}</h4>
                  <span class="week-badge">هفته {{ week.weekNumber }}</span>
                </div>
                <div class="week-focus">
                  <label>تمرکز اصلی:</label>
                  <input
                    v-model="week.focus"
                    type="text"
                    placeholder="مثال: افزایش قدرت پایه"
                    class="form-input"
                  />
                </div>
              </div>

              <div class="days-container">
                <div 
                  v-for="day in week.days" 
                  :key="day.dayNumber"
                  class="day-card"
                >
                  <div class="day-header" @click="isMobile && toggleDay(day.dayNumber)">
                    <div class="day-title">
                      <h5>{{ getDayName(day.dayName) }}</h5>
                      <span class="day-exercises-count">{{ day.exercises.length }} حرکت</span>
                    </div>
                    <div class="day-actions">
                      <span v-if="day.duration" class="day-duration">
                        ⏱️ {{ day.duration }}'
                      </span>
                      <span v-if="isMobile" class="expand-icon">
                        {{ expandedDay === day.dayNumber ? '▼' : '◀' }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="day-content" v-show="!isMobile || expandedDay === day.dayNumber">
                    <div class="form-group">
                      <label>تمرکز روز:</label>
                      <input
                        v-model="day.focus"
                        type="text"
                        placeholder="مثال: تمرین سینه و پشت بازو"
                        class="form-input"
                      />
                    </div>
                    
                    <div class="form-group">
                      <label>مدت تمرین (دقیقه):</label>
                      <input
                        v-model="day.duration"
                        type="number"
                        placeholder="60"
                        class="form-input"
                      />
                    </div>

                    <div class="exercises-section">
                      <div class="exercises-header">
                        <h6>حرکات</h6>
                        <button 
                          type="button" 
                          @click="addExercise(day)"
                          class="btn-add-exercise"
                        >
                          <span class="btn-icon">➕</span>
                          <span v-if="!isMobile">اضافه کردن حرکت</span>
                        </button>
                      </div>
                      
                      <div class="exercises-list">
                        <div 
                          class="exercise-item" 
                          v-for="(exercise, exIndex) in day.exercises" 
                          :key="exIndex"
                        >
                          <div class="exercise-header">
                            <div class="exercise-number">{{ exIndex + 1 }}</div>
                            <input
                              v-model="exercise.name"
                              type="text"
                              placeholder="نام حرکت"
                              required
                              class="exercise-name-input"
                            />
                            <button 
                              type="button" 
                              @click="removeExercise(day, exIndex)"
                              class="btn-remove"
                            >
                              ✕
                            </button>
                          </div>
                          
                          <div class="exercise-details">
                            <div class="detail-input">
                              <label>ست</label>
                              <input
                                v-model="exercise.sets"
                                type="number"
                                min="1"
                                max="10"
                                placeholder="۳"
                                class="small-input"
                              />
                            </div>
                            <div class="detail-input">
                              <label>تکرار</label>
                              <input
                                v-model="exercise.reps"
                                type="text"
                                placeholder="۱۰-۱۲"
                                class="small-input"
                              />
                            </div>
                            <div class="detail-input">
                              <label>استراحت</label>
                              <input
                                v-model="exercise.restTime"
                                type="text"
                                placeholder="۶۰-۹۰"
                                class="small-input"
                              />
                            </div>
                          </div>
                          
                          <div class="exercise-notes" v-if="exercise.description || isMobile">
                            <textarea
                              v-model="exercise.description"
                              placeholder="نکات فنی حرکت (اختیاری)"
                              class="notes-input"
                              rows="2"
                            ></textarea>
                          </div>
                        </div>
                        
                        <div v-if="day.exercises.length === 0" class="no-exercises">
                          <span class="empty-icon">🏋️‍♂️</span>
                          <p>هنوز حرکتی اضافه نشده است</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Review & Submit - Mobile Optimized -->
        <div class="form-section" v-show="currentStep === 3">
          <h3>
            <span class="section-icon">👁️</span>
            مرور نهایی
          </h3>
          
          <div class="review-summary">
            <div class="summary-card">
              <div class="card-header">
                <span class="header-icon">📋</span>
                <h4>اطلاعات برنامه</h4>
              </div>
              <div class="summary-content">
                <div class="summary-row">
                  <span class="summary-label">شاگرد:</span>
                  <span class="summary-value">{{ getStudentName(form.studentId) }}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">عنوان:</span>
                  <span class="summary-value">{{ form.title }}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">مدت:</span>
                  <span class="summary-value">{{ form.durationWeeks }} هفته</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">از:</span>
                  <span class="summary-value">{{ formatDate(form.startDate) }}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">تا:</span>
                  <span class="summary-value">{{ formatDate(form.endDate) }}</span>
                </div>
                <div v-if="form.description" class="summary-row description">
                  <span class="summary-label">توضیحات:</span>
                  <span class="summary-value">{{ form.description }}</span>
                </div>
              </div>
            </div>
            
            <div class="summary-card">
              <div class="card-header">
                <span class="header-icon">📅</span>
                <h4>ساختار برنامه</h4>
              </div>
              <div class="weeks-summary">
                <div 
                  v-for="week in form.weeks" 
                  :key="week.weekNumber"
                  class="week-summary-item"
                >
                  <div class="week-summary-header" @click="toggleWeekSummary(week.weekNumber)">
                    <span class="week-title">هفته {{ week.weekNumber }}</span>
                    <span v-if="week.focus" class="week-focus-tag">{{ week.focus }}</span>
                    <span class="expand-icon">
                      {{ expandedWeek === week.weekNumber ? '▼' : '◀' }}
                    </span>
                  </div>
                  
                  <div class="week-summary-days" v-show="expandedWeek === week.weekNumber">
                    <div 
                      v-for="day in week.days" 
                      :key="day.dayNumber"
                      class="day-summary-item"
                    >
                      <div class="day-summary-header">
                        <span class="day-name">{{ getDayName(day.dayName) }}</span>
                        <span class="day-exercises">{{ day.exercises.length }} حرکت</span>
                      </div>
                      <div v-if="day.focus" class="day-focus">{{ day.focus }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons - Mobile Optimized -->
        <div class="form-navigation">
          <div v-if="!isMobile" class="step-indicator">
            <span class="step" :class="{ active: currentStep === 1 }">۱</span>
            <span class="step" :class="{ active: currentStep === 2 }">۲</span>
            <span class="step" :class="{ active: currentStep === 3 }">۳</span>
          </div>
          
          <div class="navigation-buttons">
            <button 
              type="button" 
              @click="prevStep"
              v-if="currentStep > 1"
              class="btn-secondary"
            >
              <span class="btn-icon">→</span>
              <span v-if="!isMobile">مرحله قبل</span>
            </button>
            
            <button 
              type="button" 
              @click="nextStep"
              v-if="currentStep < 3"
              class="btn-primary"
            >
              <span v-if="!isMobile">مرحله بعد</span>
              <span class="btn-icon">←</span>
            </button>
            
            <button 
              type="submit" 
              v-if="currentStep === 3"
              :disabled="loading"
              class="btn-success"
              :class="{ 'loading': loading }"
            >
              <span v-if="!loading">✅ {{ isMobile ? 'ثبت' : 'ایجاد برنامه' }}</span>
              <span v-else>در حال ایجاد...</span>
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div v-if="successMessage" class="success-message">
          <span class="message-icon">✅</span>
          <div class="message-content">
            <h4>موفقیت!</h4>
            <p>{{ successMessage }}</p>
          </div>
        </div>

        <div v-if="error" class="error-message">
          <span class="message-icon">❌</span>
          <div class="message-content">
            <h4>خطا</h4>
            <p>{{ error }}</p>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// Reactive form state
const form = reactive({
  studentId: '',
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  durationWeeks: 4,
  weeks: []
})

// Component states
const currentStep = ref(1)
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const students = ref([])
const selectedStudent = ref(null)
const isMobile = ref(false)
const showHelp = ref(false)
const selectedWeek = ref(1)
const expandedDay = ref(null)
const expandedWeek = ref(null)

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
const progressPercentage = computed(() => {
  return (currentStep.value / 3) * 100
})

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// Lifecycle hooks
onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  await fetchStudents()
  initializeWeeks()
  
  // Set default start date to tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  form.startDate = tomorrow.toISOString().split('T')[0]
  calculateEndDate()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Initialize form with default weeks and days
const initializeWeeks = () => {
  const weeks = []
  const dayNames = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  
  for (let weekNum = 1; weekNum <= form.durationWeeks; weekNum++) {
    const days = dayNames.map((dayName, index) => ({
      dayNumber: index + 1,
      dayName: dayName,
      title: `روز ${index + 1}`,
      focus: '',
      duration: 60,
      notes: '',
      exercises: []
    }))
    
    weeks.push({
      weekNumber: weekNum,
      title: `هفته ${weekNum}`,
      focus: '',
      notes: '',
      days: days
    })
  }
  
  form.weeks = weeks
  selectedWeek.value = 1
}

// Fetch students from API
const fetchStudents = async () => {
  try {
    const response = await $fetch('/api/students')
    if (response.success) {
      students.value = response.students
    }
  } catch (err) {
    console.error('Error fetching students:', err)
    error.value = 'خطا در دریافت لیست شاگردان'
  }
}

// Load student info when selected
const loadStudentInfo = () => {
  if (form.studentId) {
    selectedStudent.value = students.value.find(s => s.id == form.studentId) || null
  } else {
    selectedStudent.value = null
  }
}

// Calculate end date based on start date and duration
const calculateEndDate = () => {
  if (form.startDate && form.durationWeeks) {
    const startDate = new Date(form.startDate)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + (form.durationWeeks * 7) - 1)
    form.endDate = endDate.toISOString().split('T')[0]
  }
}

// Get day name in Persian
const getDayName = (dayName) => {
  return persianDays[dayName] || dayName
}

// Get fitness level text
const getFitnessLevelText = (level) => {
  const levels = {
    'beginner': 'مبتدی',
    'intermediate': 'متوسط',
    'advanced': 'پیشرفته'
  }
  return levels[level] || level
}

// Get student name by ID
const getStudentName = (studentId) => {
  const student = students.value.find(s => s.id == studentId)
  return student ? student.fullName : 'نامشخص'
}

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'ثبت نشده'
  const date = new Date(dateString)
  return date.toLocaleDateString('fa-IR')
}

// Add exercise to a day
const addExercise = (day) => {
  day.exercises.push({
    name: '',
    description: '',
    sets: 3,
    reps: '10-12',
    restTime: '60-90',
    notes: ''
  })
}

// Remove exercise from a day
const removeExercise = (day, index) => {
  day.exercises.splice(index, 1)
}

// Toggle day expansion
const toggleDay = (dayNumber) => {
  expandedDay.value = expandedDay.value === dayNumber ? null : dayNumber
}

// Toggle week summary
const toggleWeekSummary = (weekNumber) => {
  expandedWeek.value = expandedWeek.value === weekNumber ? null : weekNumber
}

// Navigation between steps
const nextStep = () => {
  // Validate current step
  if (currentStep.value === 1) {
    if (!form.studentId || !form.title || !form.startDate) {
      error.value = 'لطفاً فیلدهای الزامی مرحله اول را پر کنید'
      return
    }
  } else if (currentStep.value === 2) {
    // Check if all required exercise fields are filled
    let hasError = false
    for (const week of form.weeks) {
      for (const day of week.days) {
        for (const exercise of day.exercises) {
          if (!exercise.name || !exercise.sets || !exercise.reps) {
            hasError = true
            break
          }
        }
        if (hasError) break
      }
      if (hasError) break
    }
    
    if (hasError) {
      error.value = 'لطفاً تمام فیلدهای الزامی حرکات را پر کنید'
      return
    }
  }
  
  error.value = ''
  if (currentStep.value < 3) {
    currentStep.value++
    if (isMobile.value) {
      expandedDay.value = null
      expandedWeek.value = null
    }
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    error.value = ''
  }
}

// Form submission
const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // Prepare data for API
    const workoutData = {
      studentId: parseInt(form.studentId),
      title: form.title,
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
      durationWeeks: parseInt(form.durationWeeks),
      weeks: form.weeks
    }
    
    console.log('Submitting workout data:', workoutData)
    
    const response = await $fetch('/api/workouts/create', {
      method: 'POST',
      body: workoutData
    })
    
    if (response.success) {
      successMessage.value = `برنامه "${form.title}" با موفقیت ایجاد شد!`
      
      setTimeout(() => {
        // Reset form
        form.studentId = ''
        form.title = ''
        form.description = ''
        form.durationWeeks = 4
        
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        form.startDate = tomorrow.toISOString().split('T')[0]
        calculateEndDate()
        
        initializeWeeks()
        selectedStudent.value = null
        successMessage.value = ''
        currentStep.value = 1
        expandedDay.value = null
        expandedWeek.value = null
      }, 3000)
    }
    
  } catch (err) {
    console.error('Error creating workout:', err)
    error.value = err.data?.statusMessage || 'خطا در ایجاد برنامه تمرینی'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.create-workout-page {
  direction: rtl;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

/* Page Header */
.page-header {
  margin-bottom: 2rem;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header-title h1 {
  color: #333;
  margin: 0 0 0.25rem 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.header-title p {
  color: #666;
  margin: 0;
  font-size: 1rem;
}

.back-button {
  width: 44px;
  height: 44px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:active {
  background: #f5f5f5;
  transform: scale(0.95);
}

.back-icon {
  font-size: 1.2rem;
}

.help-button {
  width: 44px;
  height: 44px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  color: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.help-button:active {
  background: #f5f5f5;
}

.help-icon {
  font-size: 1.2rem;
}

/* Progress Bar - Mobile */
.progress-bar-container {
  background: #f5f5f5;
  border-radius: 20px;
  padding: 0.5rem;
  margin-top: 1rem;
}

.progress-bar {
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e9ecef;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  transition: all 0.3s ease;
}

.progress-step.active .step-number {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.step-label {
  font-size: 0.7rem;
  color: #666;
}

.progress-step.active .step-label {
  color: #667eea;
  font-weight: 600;
}

/* Form Container */
.form-container {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #444;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f0f0f0;
}

.section-icon {
  font-size: 1.3rem;
}

.section-description {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.6;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 12px;
  border-right: 3px solid #667eea;
}

/* Form Card */
.form-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group.half {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
  font-size: 0.95rem;
}

.required-star {
  color: #f44336;
  margin-left: 0.25rem;
}

/* Input Wrappers */
.input-wrapper,
.select-wrapper,
.textarea-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon,
.select-icon,
.textarea-icon {
  position: absolute;
  right: 1rem;
  color: #999;
  font-size: 1rem;
  z-index: 1;
}

.textarea-icon {
  top: 1rem;
  transform: none;
}

.form-input {
  width: 100%;
  padding: 0.875rem 3rem 0.875rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input[readonly] {
  background: #f8f9fa;
  color: #666;
}

select.form-input {
  appearance: none;
  cursor: pointer;
  padding-left: 2.5rem;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: left 1rem center;
  background-size: 1em;
}

textarea.form-input {
  padding-top: 1rem;
  padding-bottom: 1rem;
  resize: vertical;
  min-height: 100px;
}

/* Student Info Card */
.student-info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 16px;
  margin-top: 1.5rem;
}

.student-info-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header-icon {
  font-size: 1.2rem;
}

.student-info-header h4 {
  margin: 0;
  font-size: 1.1rem;
}

.student-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.detail-label {
  font-size: 0.9rem;
  opacity: 0.9;
  min-width: 70px;
}

.detail-value {
  font-weight: 600;
  font-size: 0.95rem;
}

.detail-value.badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.2rem 0.75rem;
  border-radius: 20px;
}

/* Week Selector - Mobile */
.week-selector {
  margin-bottom: 1.5rem;
  overflow-x: auto;
}

.week-tabs {
  display: flex;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
}

.week-tab {
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

.week-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

/* Week Card */
.week-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.week-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.week-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.week-title h4 {
  margin: 0;
  color: #444;
  font-size: 1.2rem;
}

.week-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.week-focus label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
  font-size: 0.9rem;
}

/* Days Container */
.days-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.day-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.25rem;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.day-title {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.day-title h5 {
  margin: 0;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
}

.day-exercises-count {
  color: #667eea;
  font-size: 0.8rem;
}

.day-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.day-duration {
  color: #666;
  font-size: 0.85rem;
  background: #f5f5f5;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

.expand-icon {
  color: #999;
  font-size: 0.9rem;
}

.day-content {
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid #f0f0f0;
}

/* Exercises Section */
.exercises-section {
  margin-top: 1.25rem;
}

.exercises-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.exercises-header h6 {
  margin: 0;
  color: #444;
  font-size: 0.95rem;
}

.btn-add-exercise {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #4caf50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add-exercise:active {
  transform: scale(0.97);
}

.btn-icon {
  font-size: 1rem;
}

/* Exercise Items */
.exercises-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.exercise-item {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1rem;
}

.exercise-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.exercise-number {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.exercise-name-input {
  flex: 1;
  padding: 0.6rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.95rem;
}

.btn-remove {
  width: 28px;
  height: 28px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.btn-remove:active {
  transform: scale(0.9);
}

.exercise-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.detail-input {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-input label {
  color: #666;
  font-size: 0.7rem;
}

.small-input {
  padding: 0.5rem;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 0.85rem;
  width: 100%;
}

.exercise-notes {
  margin-top: 0.75rem;
}

.notes-input {
  width: 100%;
  padding: 0.6rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.85rem;
  resize: vertical;
}

.no-exercises {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #dee2e6;
}

.empty-icon {
  font-size: 2rem;
  opacity: 0.5;
}

.no-exercises p {
  color: #999;
  margin: 0;
  font-size: 0.9rem;
}

/* Review Summary */
.review-summary {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.summary-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 1.25rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #667eea;
}

.card-header h4 {
  margin: 0;
  color: #444;
  font-size: 1.1rem;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0.5rem;
  background: white;
  border-radius: 8px;
}

.summary-row.description {
  flex-direction: column;
  gap: 0.5rem;
}

.summary-label {
  color: #666;
  font-size: 0.9rem;
}

.summary-value {
  color: #333;
  font-weight: 500;
  font-size: 0.95rem;
}

/* Weeks Summary */
.weeks-summary {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.week-summary-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
}

.week-summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  cursor: pointer;
}

.week-title {
  font-weight: 600;
  color: #333;
}

.week-focus-tag {
  color: #667eea;
  font-size: 0.8rem;
  background: #eef2ff;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

.week-summary-days {
  padding: 1rem;
  border-top: 1px solid #e9ecef;
}

.day-summary-item {
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed #dee2e6;
}

.day-summary-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.day-summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.day-name {
  font-weight: 600;
  color: #444;
  font-size: 0.9rem;
}

.day-exercises {
  color: #667eea;
  font-size: 0.8rem;
  font-weight: 500;
}

.day-focus {
  color: #666;
  font-size: 0.8rem;
}

/* Navigation */
.form-navigation {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f0f0f0;
}

.step-indicator {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.step {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e9ecef;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.step.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: scale(1.1);
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.btn-primary,
.btn-secondary,
.btn-success {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
  border: 2px solid #e0e0e0;
}

.btn-success {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  color: white;
}

.btn-primary:active,
.btn-success:active {
  transform: scale(0.97);
}

.btn-primary:disabled,
.btn-success:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-success.loading {
  position: relative;
  color: transparent;
}

.btn-success.loading::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  top: 50%;
  left: 50%;
  margin-left: -10px;
  margin-top: -10px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn-icon {
  font-size: 1rem;
}

/* Help Modal */
.help-modal {
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

.help-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.help-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid #f0f0f0;
}

.help-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.close-help {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  border-radius: 50%;
}

.help-body {
  padding: 1.25rem;
}

.help-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.help-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.help-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 50%;
}

.help-text {
  flex: 1;
}

.help-text strong {
  color: #333;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.25rem;
}

.help-text p {
  margin: 0;
  color: #666;
  font-size: 0.85rem;
  line-height: 1.5;
}

/* Messages */
.success-message,
.error-message {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 12px;
  margin-top: 1.5rem;
  animation: slideIn 0.3s ease;
}

.success-message {
  background: #e8f5e9;
  border: 1px solid #c8e6c9;
}

.error-message {
  background: #ffebee;
  border: 1px solid #ffcdd2;
}

.message-icon {
  font-size: 1.5rem;
}

.message-content {
  flex: 1;
}

.message-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.message-content p {
  margin: 0;
  font-size: 0.9rem;
}

.success-message h4 {
  color: #2e7d32;
}

.success-message p {
  color: #1b5e20;
}

.error-message h4 {
  color: #c62828;
}

.error-message p {
  color: #b71c1c;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile Styles */
@media (max-width: 768px) {
  .create-workout-page {
    padding: 0.75rem;
  }

  .header-title h1 {
    font-size: 1.4rem;
  }

  .header-title p {
    font-size: 0.9rem;
  }

  .form-container {
    padding: 1.25rem;
  }

  .form-card {
    padding: 1.25rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .form-group.half {
    margin-bottom: 1.25rem;
  }

  .form-group.half:last-child {
    margin-bottom: 0;
  }

  .student-info-card {
    padding: 1.25rem;
  }

  .student-details {
    gap: 0.5rem;
  }

  .detail-row {
    flex-wrap: wrap;
  }

  .detail-label {
    min-width: 60px;
  }

  .week-card {
    padding: 1.25rem;
  }

  .week-title h4 {
    font-size: 1.1rem;
  }

  .exercise-details {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .detail-input {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }

  .detail-input label {
    width: 70px;
    margin-bottom: 0;
  }

  .small-input {
    flex: 1;
  }

  .navigation-buttons {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary,
  .btn-success {
    width: 100%;
    min-width: auto;
  }

  .btn-secondary {
    order: 2;
  }

  .btn-primary {
    order: 1;
  }

  .btn-success {
    order: 1;
  }

  .success-message,
  .error-message {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }
}

/* Small Mobile Styles */
@media (max-width: 480px) {
  .header-top {
    gap: 0.5rem;
  }

  .back-button,
  .help-button {
    width: 40px;
    height: 40px;
  }

  .form-container {
    padding: 1rem;
  }

  .form-card {
    padding: 1rem;
  }

  .week-card {
    padding: 1rem;
  }

  .day-card {
    padding: 1rem;
  }

  .exercise-header {
    flex-wrap: wrap;
  }

  .exercise-name-input {
    width: 100%;
    margin-top: 0.5rem;
  }

  .btn-remove {
    position: absolute;
    left: 0.5rem;
    top: 0.5rem;
  }

  .exercise-item {
    position: relative;
    padding-top: 1.5rem;
  }

  .exercise-number {
    position: absolute;
    top: -0.5rem;
    right: -0.5rem;
  }
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  .back-button,
  .help-button,
  .btn-primary,
  .btn-secondary,
  .btn-success,
  .btn-add-exercise,
  .week-tab,
  .day-header {
    min-height: 48px;
  }

  .form-input,
  select.form-input,
  .exercise-name-input,
  .small-input,
  .notes-input {
    font-size: 16px;
  }
}

/* RTL Support */
[dir="rtl"] .input-icon,
[dir="rtl"] .select-icon,
[dir="rtl"] .textarea-icon {
  right: 1rem;
  left: auto;
}

[dir="rtl"] .form-input {
  padding: 0.875rem 3rem 0.875rem 1rem;
}

[dir="rtl"] select.form-input {
  background-position: left 1rem center;
  padding-left: 2.5rem;
  padding-right: 3rem;
}

[dir="rtl"] .btn-icon {
  transform: scaleX(-1);
}

[dir="rtl"] .expand-icon {
  transform: scaleX(-1);
}

[dir="rtl"] .exercise-number {
  right: -0.5rem;
  left: auto;
}

[dir="rtl"] .btn-remove {
  left: 0.5rem;
  right: auto;
}

/* Safe Area Support */
@supports (padding: max(0px)) {
  .create-workout-page {
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }

  .help-content {
    margin-bottom: env(safe-area-inset-bottom);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .progress-bar,
  .btn-primary,
  .btn-success,
  .btn-add-exercise,
  .help-content {
    animation: none;
    transition: none;
  }
}
</style>