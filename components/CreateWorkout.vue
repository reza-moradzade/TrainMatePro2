
<template>
  <div class="create-workout-page">
    <div class="page-header">
      <h1>🏋️‍♂️ ایجاد برنامه تمرینی جدید</h1>
      <p>برنامه‌ای برای شاگرد خود ایجاد کنید</p>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="workout-form">
        <!-- Step 1: Basic Information -->
        <div class="form-section" v-if="currentStep === 1">
          <h3>📋 اطلاعات اولیه برنامه</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="studentId">شاگرد *</label>
              <select 
                id="studentId" 
                v-model="form.studentId" 
                required 
                class="form-input"
                @change="loadStudentInfo"
              >
                <option value="">انتخاب شاگرد</option>
                <option v-for="student in students" :key="student.id" :value="student.id">
                  {{ student.fullName }} - {{ student.email }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="title">عنوان برنامه *</label>
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
            <div class="form-group">
              <label for="startDate">تاریخ شروع *</label>
              <input
                id="startDate"
                v-model="form.startDate"
                type="date"
                required
                class="form-input"
                @change="calculateEndDate"
              />
            </div>
            
            <div class="form-group">
              <label for="durationWeeks">مدت برنامه (هفته) *</label>
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

          <div class="form-row">
            <div class="form-group">
              <label for="endDate">تاریخ پایان</label>
              <input
                id="endDate"
                v-model="form.endDate"
                type="date"
                readonly
                class="form-input"
                style="background-color: #f5f5f5;"
              />
            </div>
            
            <div class="form-group">
              <label for="description">توضیحات</label>
              <textarea
                id="description"
                v-model="form.description"
                placeholder="توضیح مختصر درباره برنامه"
                class="form-input"
                rows="2"
              ></textarea>
            </div>
          </div>

          <div v-if="selectedStudent" class="student-info-card">
            <h4>👤 اطلاعات شاگرد انتخاب شده:</h4>
            <div class="student-details">
              <p><strong>نام:</strong> {{ selectedStudent.fullName }}</p>
              <p><strong>سن:</strong> {{ selectedStudent.age || 'ثبت نشده' }} سال</p>
              <p><strong>قد/وزن:</strong> 
                {{ selectedStudent.height || '?' }}cm / {{ selectedStudent.weight || '?' }}kg
              </p>
              <p><strong>سطح:</strong> {{ getFitnessLevelText(selectedStudent.fitnessLevel) }}</p>
              <p><strong>اهداف:</strong> {{ selectedStudent.goals || 'ثبت نشده' }}</p>
            </div>
          </div>
        </div>

        <!-- Step 2: Weekly Schedule -->
        <div class="form-section" v-if="currentStep === 2">
          <h3>📅 برنامه هفتگی</h3>
          <p class="section-description">
            برنامه تمرینی هفته اول را تنظیم کنید. این برنامه برای {{ form.durationWeeks }} هفته تکرار خواهد شد.
          </p>

          <div class="weeks-container">
            <div class="week-card" v-for="week in form.weeks" :key="week.weekNumber">
              <div class="week-header">
                <h4>{{ week.title }}</h4>
                <span class="week-badge">هفته {{ week.weekNumber }}</span>
              </div>
              
              <div class="week-focus">
                <label>تمرکز اصلی هفته:</label>
                <input
                  v-model="week.focus"
                  type="text"
                  placeholder="مثال: افزایش قدرت پایه"
                  class="form-input"
                />
              </div>

              <div class="days-container">
                <div class="day-card" v-for="day in week.days" :key="day.dayNumber">
                  <div class="day-header">
                    <h5>{{ day.title }}</h5>
                    <span class="day-badge">{{ getDayName(day.dayName) }}</span>
                  </div>
                  
                  <div class="day-content">
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
                        <h6>حرکات ورزشی:</h6>
                        <button 
                          type="button" 
                          @click="addExercise(day)"
                          class="btn-small"
                        >
                          ➕ اضافه کردن حرکت
                        </button>
                      </div>
                      
                      <div class="exercises-list">
                        <div class="exercise-item" v-for="(exercise, exIndex) in day.exercises" :key="exIndex">
                          <div class="exercise-header">
                            <span class="exercise-number">{{ exIndex + 1 }}</span>
                            <button 
                              type="button" 
                              @click="removeExercise(day, exIndex)"
                              class="btn-remove"
                            >
                              ❌
                            </button>
                          </div>
                          
                          <div class="exercise-form">
                            <div class="form-row">
                              <div class="form-group">
                                <label>نام حرکت *</label>
                                <input
                                  v-model="exercise.name"
                                  type="text"
                                  placeholder="مثال: پرس سینه"
                                  required
                                  class="form-input"
                                />
                              </div>
                              
                              <div class="form-group">
                                <label>تعداد ست‌ها *</label>
                                <input
                                  v-model="exercise.sets"
                                  type="number"
                                  min="1"
                                  max="10"
                                  required
                                  class="form-input"
                                />
                              </div>
                            </div>
                            
                            <div class="form-row">
                              <div class="form-group">
                                <label>تعداد تکرار *</label>
                                <input
                                  v-model="exercise.reps"
                                  type="text"
                                  placeholder="مثال: 10-12"
                                  required
                                  class="form-input"
                                />
                              </div>
                              
                              <div class="form-group">
                                <label>زمان استراحت</label>
                                <input
                                  v-model="exercise.restTime"
                                  type="text"
                                  placeholder="60-90 ثانیه"
                                  class="form-input"
                                />
                              </div>
                            </div>
                            
                            <div class="form-group">
                              <label>توضیحات (اختیاری)</label>
                              <textarea
                                v-model="exercise.description"
                                placeholder="نکات فنی اجرای حرکت"
                                class="form-input"
                                rows="2"
                              ></textarea>
                            </div>
                          </div>
                        </div>
                        
                        <div v-if="day.exercises.length === 0" class="no-exercises">
                          هنوز حرکتی اضافه نشده است
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Review & Submit -->
        <div class="form-section" v-if="currentStep === 3">
          <h3>👁️ مرور نهایی</h3>
          
          <div class="review-summary">
            <div class="summary-card">
              <h4>📋 اطلاعات برنامه</h4>
              <div class="summary-details">
                <p><strong>شاگرد:</strong> {{ getStudentName(form.studentId) }}</p>
                <p><strong>عنوان:</strong> {{ form.title }}</p>
                <p><strong>مدت:</strong> {{ form.durationWeeks }} هفته</p>
                <p><strong>از:</strong> {{ formatDate(form.startDate) }}</p>
                <p><strong>تا:</strong> {{ formatDate(form.endDate) }}</p>
                <p><strong>توضیحات:</strong> {{ form.description || 'ثبت نشده' }}</p>
              </div>
            </div>
            
            <div class="summary-card">
              <h4>📅 ساختار برنامه</h4>
              <div class="weeks-summary">
                <div class="week-summary" v-for="week in form.weeks" :key="week.weekNumber">
                  <h5>{{ week.title }} (هفته {{ week.weekNumber }})</h5>
                  <p><strong>تمرکز:</strong> {{ week.focus || 'ثبت نشده' }}</p>
                  
                  <div class="days-summary">
                    <div class="day-summary" v-for="day in week.days" :key="day.dayNumber">
                      <span class="day-name">{{ getDayName(day.dayName) }}</span>
                      <span class="day-focus">{{ day.focus || 'بدون تمرکز' }}</span>
                      <span class="day-exercises">{{ day.exercises.length }} حرکت</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="form-navigation">
          <div class="step-indicator">
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
              ⬅️ مرحله قبل
            </button>
            
            <button 
              type="button" 
              @click="nextStep"
              v-if="currentStep < 3"
              class="btn-primary"
            >
              مرحله بعد ➡️
            </button>
            
            <button 
              type="submit" 
              v-if="currentStep === 3"
              :disabled="loading"
              class="btn-success"
              :class="{ 'loading': loading }"
            >
              {{ loading ? 'در حال ایجاد...' : '✅ ایجاد برنامه' }}
            </button>
          </div>
        </div>

        <div v-if="successMessage" class="success-message">
          ✅ {{ successMessage }}
        </div>

        <div v-if="error" class="error-message">
          ❌ {{ error }}
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
}

// Fetch students on component mount
onMounted(async () => {
  await fetchStudents()
  initializeWeeks()
  
  // Set default start date to tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  form.startDate = tomorrow.toISOString().split('T')[0]
  calculateEndDate()
})

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
    restTime: '60-90 ثانیه',
    notes: ''
  })
}

// Remove exercise from a day
const removeExercise = (day, index) => {
  day.exercises.splice(index, 1)
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
    
    // API call to create workout
    const response = await $fetch('/api/workouts/create', {
      method: 'POST',
      body: workoutData,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Create workout response:', response)
    
    if (response.success) {
      successMessage.value = `برنامه تمرینی "${form.title}" با موفقیت ایجاد شد!`
      
      // Reset form after 3 seconds
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
      }, 3000)
    } else {
      error.value = response.message || 'خطا در ایجاد برنامه تمرینی'
    }
    
  } catch (err) {
    console.error('Error creating workout:', err)
    error.value = err.data?.statusMessage || err.message || 'خطا در ایجاد برنامه تمرینی'
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

.form-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #f0f0f0;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.form-section h3 {
  color: #444;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  padding-right: 0.5rem;
  border-right: 3px solid #667eea;
}

.section-description {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.6;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
  font-size: 0.95rem;
}

.form-group label[for]::after {
  content: ' *';
  color: #f44336;
  opacity: 0.8;
}

.form-group label[for="description"]::after,
.form-group label[for="endDate"]::after {
  content: '';
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

select.form-input {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: left 0.75rem center;
  background-size: 1em;
  padding-left: 2.5rem;
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
}

.student-info-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.student-info-card h4 {
  margin: 0 0 1rem 0;
  color: #444;
  font-size: 1.1rem;
}

.student-details {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.student-details p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.weeks-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.week-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 1.5rem;
}

.week-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.week-header h4 {
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

.week-focus {
  margin-bottom: 1.5rem;
}

.week-focus label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.days-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .days-container {
    grid-template-columns: 1fr;
  }
}

.day-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 1.25rem;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.day-header h5 {
  margin: 0;
  color: #444;
  font-size: 1rem;
}

.day-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.2rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.day-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.exercises-section {
  margin-top: 1rem;
}

.exercises-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.exercises-header h6 {
  margin: 0;
  color: #555;
  font-size: 0.95rem;
}

.btn-small {
  background: #4caf50;
  color: white;
  border: none;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-small:hover {
  background: #45a049;
}

.exercises-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.exercise-item {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
}

.exercise-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed #dee2e6;
}

.exercise-number {
  background: #667eea;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
}

.btn-remove {
  background: #ff6b6b;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.btn-remove:hover {
  background: #ff5252;
}

.exercise-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.no-exercises {
  text-align: center;
  color: #999;
  padding: 1rem;
  font-style: italic;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
}

.review-summary {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.summary-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 1.5rem;
}

.summary-card h4 {
  margin: 0 0 1rem 0;
  color: #444;
  font-size: 1.1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #667eea;
}

.summary-details {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.75rem;
}

.summary-details p {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
}

.weeks-summary {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.week-summary {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
}

.week-summary h5 {
  margin: 0 0 0.5rem 0;
  color: #444;
  font-size: 1rem;
}

.week-summary p {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.days-summary {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.day-summary {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.day-name {
  font-weight: 600;
  color: #444;
  font-size: 0.9rem;
}

.day-focus {
  color: #666;
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.day-exercises {
  color: #667eea;
  font-size: 0.8rem;
  font-weight: 500;
}

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

.btn-primary, .btn-secondary, .btn-success {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
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

.btn-primary:hover:not(:disabled),
.btn-success:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-2px);
}

.btn-secondary:hover {
  background: #e0e0e0;
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

.success-message {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1.5rem;
  text-align: center;
  border: 1px solid #c8e6c9;
  animation: fadeIn 0.5s ease;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1.5rem;
  text-align: center;
  border: 1px solid #ffcdd2;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>