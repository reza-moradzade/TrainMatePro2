<template>
  <div class="add-student-page">
    <!-- Page Header - Responsive -->
    <div class="page-header">
      <div class="header-top">
        <button @click="goBack" class="back-button-mobile" v-if="isMobile">
          <span class="back-icon">←</span>
        </button>
        <div class="header-title">
          <h1>➕ افزودن شاگرد جدید</h1>
          <p>اطلاعات شاگرد جدید را وارد کنید</p>
        </div>
      </div>
    </div>

    <!-- Progress Steps for Mobile -->
    <div v-if="isMobile" class="progress-steps">
      <div class="step" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
        <span class="step-number">1</span>
        <span class="step-label">اطلاعات حساب</span>
      </div>
      <div class="step" :class="{ active: currentStep === 2, completed: currentStep > 2 }">
        <span class="step-number">2</span>
        <span class="step-label">پروفایل</span>
      </div>
      <div class="step" :class="{ active: currentStep === 3, completed: currentStep > 3 }">
        <span class="step-number">3</span>
        <span class="step-label">اهداف</span>
      </div>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="student-form">
        <!-- Step 1: Account Information -->
        <div v-show="!isMobile || currentStep === 1" class="form-section">
          <h3>
            <span class="section-icon">👤</span>
            اطلاعات حساب کاربری
          </h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="fullName">
                <span class="required-star">*</span>
                نام کامل
              </label>
              <div class="input-wrapper">
                <span class="input-icon">👤</span>
                <input
                  id="fullName"
                  v-model="form.fullName"
                  type="text"
                  placeholder="مثال: علی احمدی"
                  required
                  class="form-input"
                  :class="{ 'error': validationErrors.fullName }"
                  @blur="validateField('fullName')"
                />
              </div>
              <span v-if="validationErrors.fullName" class="error-text">
                {{ validationErrors.fullName }}
              </span>
            </div>
            
            <div class="form-group">
              <label for="email">
                <span class="required-star">*</span>
                ایمیل
              </label>
              <div class="input-wrapper">
                <span class="input-icon">📧</span>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="student@example.com"
                  required
                  class="form-input ltr"
                  :class="{ 'error': validationErrors.email }"
                  @blur="validateField('email')"
                />
              </div>
              <span v-if="validationErrors.email" class="error-text">
                {{ validationErrors.email }}
              </span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="password">
                <span class="required-star">*</span>
                رمز عبور
              </label>
              <div class="input-wrapper">
                <span class="input-icon">🔒</span>
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="حداقل ۶ کاراکتر"
                  required
                  class="form-input ltr"
                  :class="{ 'error': validationErrors.password }"
                  @blur="validateField('password')"
                />
                <button 
                  type="button" 
                  @click="togglePassword" 
                  class="toggle-password"
                >
                  {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
              <div class="password-strength" v-if="form.password">
                <div class="strength-bar" :class="passwordStrength.class"></div>
                <span class="strength-text">{{ passwordStrength.text }}</span>
              </div>
              <span v-if="validationErrors.password" class="error-text">
                {{ validationErrors.password }}
              </span>
            </div>
            
            <div class="form-group">
              <label for="department">رشته ورزشی</label>
              <div class="input-wrapper">
                <span class="input-icon">🎯</span>
                <input
                  id="department"
                  v-model="form.department"
                  type="text"
                  placeholder="مثال: بدنسازی"
                  class="form-input"
                />
              </div>
            </div>
          </div>

          <!-- Next Button for Mobile -->
          <div v-if="isMobile && currentStep === 1" class="step-action">
            <button 
              type="button" 
              @click="nextStep"
              class="btn-next"
              :disabled="!isStep1Valid"
            >
              مرحله بعد
              <span class="btn-icon">←</span>
            </button>
          </div>
        </div>

        <!-- Step 2: Profile Information -->
        <div v-show="!isMobile || currentStep === 2" class="form-section">
          <h3>
            <span class="section-icon">📋</span>
            اطلاعات پروفایل
          </h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="age">سن</label>
              <div class="input-wrapper">
                <span class="input-icon">🎂</span>
                <input
                  id="age"
                  v-model="form.age"
                  type="number"
                  min="10"
                  max="100"
                  placeholder="مثال: ۲۵"
                  class="form-input ltr"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="gender">جنسیت</label>
              <div class="input-wrapper">
                <span class="input-icon">⚥</span>
                <select id="gender" v-model="form.gender" class="form-input">
                  <option value="">انتخاب کنید</option>
                  <option value="male">مرد</option>
                  <option value="female">زن</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="height">قد (سانتی‌متر)</label>
              <div class="input-wrapper">
                <span class="input-icon">📏</span>
                <input
                  id="height"
                  v-model="form.height"
                  type="number"
                  step="0.1"
                  placeholder="۱۸۰"
                  class="form-input ltr"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="weight">وزن (کیلوگرم)</label>
              <div class="input-wrapper">
                <span class="input-icon">⚖️</span>
                <input
                  id="weight"
                  v-model="form.weight"
                  type="number"
                  step="0.1"
                  placeholder="۷۵"
                  class="form-input ltr"
                />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="fitnessLevel">سطح آمادگی جسمانی</label>
            <div class="input-wrapper">
              <span class="input-icon">💪</span>
              <select id="fitnessLevel" v-model="form.fitnessLevel" class="form-input">
                <option value="beginner">مبتدی</option>
                <option value="intermediate">متوسط</option>
                <option value="advanced">پیشرفته</option>
              </select>
            </div>
          </div>

          <!-- Next/Prev Buttons for Mobile -->
          <div v-if="isMobile && currentStep === 2" class="step-actions">
            <button 
              type="button" 
              @click="prevStep"
              class="btn-prev"
            >
              <span class="btn-icon">→</span>
              مرحله قبل
            </button>
            <button 
              type="button" 
              @click="nextStep"
              class="btn-next"
            >
              مرحله بعد
              <span class="btn-icon">←</span>
            </button>
          </div>
        </div>

        <!-- Step 3: Goals & Notes -->
        <div v-show="!isMobile || currentStep === 3" class="form-section">
          <h3>
            <span class="section-icon">🎯</span>
            اهداف و یادداشت‌ها
          </h3>

          <div class="form-group">
            <label for="goals">اهداف ورزشی</label>
            <div class="input-wrapper">
              <span class="input-icon">🎯</span>
              <textarea
                id="goals"
                v-model="form.goals"
                placeholder="مثال: کاهش وزن، افزایش قدرت، آمادگی مسابقه"
                class="form-input"
                rows="4"
              ></textarea>
            </div>
            <span class="helper-text">اهداف خود را با کاما جدا کنید</span>
          </div>

          <div class="form-group">
            <label for="notes">یادداشت‌ها</label>
            <div class="input-wrapper">
              <span class="input-icon">📝</span>
              <textarea
                id="notes"
                v-model="form.notes"
                placeholder="یادداشت‌های اضافی درباره شاگرد"
                class="form-input"
                rows="3"
              ></textarea>
            </div>
          </div>

          <!-- Preview Section for Mobile -->
          <div v-if="isMobile" class="preview-section">
            <h4>📋 خلاصه اطلاعات</h4>
            <div class="preview-card">
              <div class="preview-item">
                <span class="preview-label">نام:</span>
                <span class="preview-value">{{ form.fullName || '---' }}</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">ایمیل:</span>
                <span class="preview-value">{{ form.email || '---' }}</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">رشته:</span>
                <span class="preview-value">{{ form.department || '---' }}</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">سطح:</span>
                <span class="preview-value">{{ getFitnessLevelText(form.fitnessLevel) }}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons for Mobile -->
          <div v-if="isMobile && currentStep === 3" class="step-actions">
            <button 
              type="button" 
              @click="prevStep"
              class="btn-prev"
            >
              <span class="btn-icon">→</span>
              مرحله قبل
            </button>
            <button 
              type="submit" 
              :disabled="loading || !isFormValid"
              class="btn-submit"
              :class="{ 'loading': loading }"
            >
              {{ loading ? 'در حال ایجاد...' : '✅ ایجاد شاگرد' }}
            </button>
          </div>
        </div>

        <!-- Desktop Action Buttons -->
        <div v-if="!isMobile" class="form-actions">
          <button 
            type="button" 
            @click="goBack"
            class="btn-secondary"
          >
            بازگشت
          </button>
          
          <button 
            type="submit" 
            :disabled="loading || !isFormValid"
            class="btn-primary"
            :class="{ 'loading': loading }"
          >
            {{ loading ? 'در حال ایجاد...' : 'ایجاد شاگرد' }}
          </button>
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
  fullName: '',
  email: '',
  password: '',
  department: '',
  age: '',
  gender: '',
  height: '',
  weight: '',
  fitnessLevel: 'beginner',
  goals: '',
  notes: ''
})

// Component states
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const isMobile = ref(false)
const currentStep = ref(1)
const showPassword = ref(false)
const validationErrors = reactive({
  fullName: '',
  email: '',
  password: ''
})

// Password strength
const passwordStrength = computed(() => {
  const password = form.password
  if (!password) return { class: '', text: '' }
  
  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  const length = password.length
  
  let strength = 0
  if (length >= 6) strength++
  if (length >= 8) strength++
  if (hasLower && hasUpper) strength++
  if (hasNumber) strength++
  if (hasSpecial) strength++
  
  if (strength <= 2) return { class: 'weak', text: 'ضعیف' }
  if (strength <= 3) return { class: 'medium', text: 'متوسط' }
  if (strength <= 4) return { class: 'good', text: 'خوب' }
  return { class: 'strong', text: 'قوی' }
})

// Form validation
const isStep1Valid = computed(() => {
  return form.fullName && form.email && form.password && form.password.length >= 6
})

const isFormValid = computed(() => {
  return isStep1Valid.value
})

// Emit for parent component
const emit = defineEmits(['menu-changed'])

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) {
    currentStep.value = 1 // Reset to first step on desktop
  }
}

// Lifecycle hooks
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Validate field
const validateField = (field) => {
  switch (field) {
    case 'fullName':
      validationErrors.fullName = !form.fullName ? 'نام کامل الزامی است' : ''
      break
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      validationErrors.email = !form.email ? 'ایمیل الزامی است' : 
        !emailRegex.test(form.email) ? 'ایمیل معتبر نیست' : ''
      break
    case 'password':
      validationErrors.password = !form.password ? 'رمز عبور الزامی است' :
        form.password.length < 6 ? 'رمز عبور باید حداقل ۶ کاراکتر باشد' : ''
      break
  }
}

// Toggle password visibility
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// Navigation steps
const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
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

// Form submission handler
const handleSubmit = async () => {
  // Validate all fields
  validateField('fullName')
  validateField('email')
  validateField('password')
  
  if (!isFormValid.value) {
    error.value = 'لطفاً فیلدهای الزامی را پر کنید'
    return
  }

  loading.value = true
  
  try {
    const studentData = {
      fullName: form.fullName,
      email: form.email,
      password: form.password,
      department: form.department || 'ورزشکار',
      age: form.age ? parseInt(form.age) : null,
      gender: form.gender || null,
      height: form.height ? parseFloat(form.height) : null,
      weight: form.weight ? parseFloat(form.weight) : null,
      fitnessLevel: form.fitnessLevel,
      goals: form.goals,
      notes: form.notes
    }
    
    const response = await $fetch('/api/students/create', {
      method: 'POST',
      body: studentData
    })
    
    if (response.success) {
      successMessage.value = `شاگرد ${form.fullName} با موفقیت ایجاد شد!`
      
      // Reset form
      Object.keys(form).forEach(key => {
        form[key] = key === 'fitnessLevel' ? 'beginner' : ''
      })
      currentStep.value = 1
      
      setTimeout(() => {
        emit('menu-changed', 'students')
      }, 2000)
    }
    
  } catch (err) {
    console.error('Error creating student:', err)
    error.value = err.data?.statusMessage || err.message || 'خطا در ایجاد شاگرد'
  } finally {
    loading.value = false
  }
}

// Go back
const goBack = () => {
  emit('menu-changed', 'students')
}
</script>

<style scoped>
.add-student-page {
  direction: rtl;
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
}

/* Page Header */
.page-header {
  margin-bottom: 2rem;
}

.header-top {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-button-mobile {
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

.back-button-mobile:active {
  background: #f5f5f5;
  transform: scale(0.95);
}

.back-icon {
  font-size: 1.2rem;
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

/* Progress Steps */
.progress-steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0.5rem;
  background: white;
  border-radius: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  left: -50%;
  top: 25%;
  width: 100%;
  height: 2px;
  background: #e0e0e0;
  z-index: 1;
}

.step.active .step-number {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.step.completed .step-number {
  background: #4caf50;
  color: white;
  border-color: transparent;
}

.step.completed::after {
  background: #4caf50;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: white;
  border: 2px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.step-label {
  font-size: 0.8rem;
  color: #666;
}

.step.active .step-label {
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
  padding-bottom: 2rem;
  border-bottom: 1px solid #f0f0f0;
}

.form-section:last-child {
  border-bottom: none;
}

.form-section h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #444;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f0f0f0;
}

.section-icon {
  font-size: 1.3rem;
}

/* Form Groups */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
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

.required-star {
  color: #f44336;
  margin-left: 0.25rem;
}

/* Input Wrapper */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  right: 1rem;
  color: #999;
  font-size: 1rem;
  z-index: 1;
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

.form-input.ltr {
  direction: ltr;
  text-align: left;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error {
  border-color: #f44336;
}

.form-input.error:focus {
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}

/* Toggle Password */
.toggle-password {
  position: absolute;
  left: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #999;
  transition: color 0.3s ease;
}

.toggle-password:hover {
  color: #667eea;
}

/* Select Input */
select.form-input {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: left 1rem center;
  background-size: 1em;
  padding-left: 3rem;
}

/* Password Strength */
.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  height: 4px;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.strength-bar.weak {
  width: 25%;
  background: #f44336;
}

.strength-bar.medium {
  width: 50%;
  background: #ff9800;
}

.strength-bar.good {
  width: 75%;
  background: #2196f3;
}

.strength-bar.strong {
  width: 100%;
  background: #4caf50;
}

.strength-text {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
  display: block;
}

/* Error Text */
.error-text {
  color: #f44336;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

/* Helper Text */
.helper-text {
  color: #666;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

/* Textarea */
textarea.form-input {
  resize: vertical;
  min-height: 100px;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

/* Preview Section */
.preview-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.preview-section h4 {
  margin: 0 0 1rem 0;
  color: #444;
  font-size: 1rem;
}

.preview-card {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.preview-item:last-child {
  border-bottom: none;
}

.preview-label {
  color: #666;
  font-size: 0.9rem;
}

.preview-value {
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

/* Step Actions */
.step-action,
.step-actions {
  margin-top: 2rem;
}

.step-actions {
  display: flex;
  gap: 1rem;
}

.btn-next,
.btn-prev,
.btn-submit {
  flex: 1;
  padding: 0.875rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 48px;
}

.btn-next {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-prev {
  background: #f5f5f5;
  color: #666;
  border: 2px solid #e0e0e0;
}

.btn-submit {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  color: white;
}

.btn-next:disabled,
.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-next:not(:disabled):active,
.btn-prev:active,
.btn-submit:not(:disabled):active {
  transform: scale(0.97);
}

.btn-icon {
  font-size: 1.1rem;
}

/* Desktop Buttons */
.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f0f0f0;
}

.btn-primary,
.btn-secondary {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
  min-height: 48px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
  border: 2px solid #e0e0e0;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

/* Loading State */
.btn-primary.loading,
.btn-submit.loading {
  position: relative;
  color: transparent;
}

.btn-primary.loading::after,
.btn-submit.loading::after {
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
  .add-student-page {
    padding: 0.5rem;
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

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .form-section h3 {
    font-size: 1.1rem;
  }

  .form-input {
    padding: 0.875rem 2.75rem 0.875rem 0.875rem;
    font-size: 16px; /* Prevent zoom on mobile */
  }

  .input-icon {
    right: 0.875rem;
  }

  .toggle-password {
    left: 0.875rem;
  }

  select.form-input {
    padding-left: 2.75rem;
  }

  .step-label {
    font-size: 0.7rem;
  }

  .step-number {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }

  .preview-section {
    padding: 1rem;
  }

  .btn-next,
  .btn-prev,
  .btn-submit {
    padding: 0.75rem;
    font-size: 0.95rem;
  }
}

/* Small Mobile Styles */
@media (max-width: 480px) {
  .progress-steps {
    padding: 0.25rem;
  }

  .step-number {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }

  .step-label {
    display: none;
  }

  .form-container {
    padding: 1rem;
  }

  .form-section {
    padding-bottom: 1.5rem;
  }

  .preview-card {
    padding: 0.75rem;
  }

  .success-message,
  .error-message {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }

  .step-actions {
    flex-direction: column;
  }

  .btn-prev {
    order: 2;
  }

  .btn-submit {
    order: 1;
  }
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  .back-button-mobile,
  .btn-next,
  .btn-prev,
  .btn-submit,
  .btn-primary,
  .btn-secondary {
    min-height: 48px;
  }

  .form-input {
    font-size: 16px;
  }
}

/* RTL Support */
[dir="rtl"] .input-icon {
  right: 1rem;
  left: auto;
}

[dir="rtl"] .form-input {
  padding: 0.875rem 3rem 0.875rem 1rem;
}

[dir="rtl"] .form-input.ltr {
  text-align: right;
  direction: ltr;
}

[dir="rtl"] .toggle-password {
  left: auto;
  right: calc(100% - 3rem);
}

[dir="rtl"] select.form-input {
  background-position: right 1rem center;
  padding-right: 3rem;
  padding-left: 1rem;
}

[dir="rtl"] .btn-icon {
  transform: scaleX(-1);
}

[dir="rtl"] .step:not(:last-child)::after {
  left: auto;
  right: -50%;
}

/* Safe Area Support */
@supports (padding: max(0px)) {
  .add-student-page {
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }

  .form-container {
    margin-bottom: max(1rem, env(safe-area-inset-bottom));
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .btn-primary,
  .btn-next,
  .btn-prev,
  .btn-submit,
  .success-message,
  .error-message {
    animation: none;
    transition: none;
  }
}
</style>