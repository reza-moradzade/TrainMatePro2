
<template>
  <div class="add-student-page">
    <div class="page-header">
      <h1>➕ افزودن شاگرد جدید</h1>
      <p>اطلاعات شاگرد جدید را وارد کنید</p>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="student-form">
        <div class="form-section">
          <h3>اطلاعات حساب کاربری</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="fullName">نام کامل *</label>
              <input
                id="fullName"
                v-model="form.fullName"
                type="text"
                placeholder="مثال: علی احمدی"
                required
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label for="email">ایمیل *</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="مثال: student@example.com"
                required
                class="form-input"
                dir="ltr"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="password">رمز عبور *</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="حداقل ۶ کاراکتر"
                required
                class="form-input"
                dir="ltr"
              />
            </div>
            
            <div class="form-group">
              <label for="department">رشته ورزشی</label>
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

        <div class="form-section">
          <h3>اطلاعات پروفایل</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="age">سن</label>
              <input
                id="age"
                v-model="form.age"
                type="number"
                min="10"
                max="100"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label for="gender">جنسیت</label>
              <select id="gender" v-model="form.gender" class="form-input">
                <option value="">انتخاب کنید</option>
                <option value="male">مرد</option>
                <option value="female">زن</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="height">قد (سانتی‌متر)</label>
              <input
                id="height"
                v-model="form.height"
                type="number"
                step="0.1"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label for="weight">وزن (کیلوگرم)</label>
              <input
                id="weight"
                v-model="form.weight"
                type="number"
                step="0.1"
                class="form-input"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="fitnessLevel">سطح آمادگی جسمانی</label>
            <select id="fitnessLevel" v-model="form.fitnessLevel" class="form-input">
              <option value="beginner">مبتدی</option>
              <option value="intermediate">متوسط</option>
              <option value="advanced">پیشرفته</option>
            </select>
          </div>

          <div class="form-group">
            <label for="goals">اهداف ورزشی</label>
            <textarea
              id="goals"
              v-model="form.goals"
              placeholder="مثال: کاهش وزن، افزایش قدرت، آمادگی مسابقه"
              class="form-input"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="notes">یادداشت‌ها</label>
            <textarea
              id="notes"
              v-model="form.notes"
              placeholder="یادداشت‌های اضافی درباره شاگرد"
              class="form-input"
              rows="2"
            ></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button 
            type="button" 
            @click="goBack"
            class="btn-secondary"
          >
            بازگشت
          </button>
          
          <button 
            type="submit" 
            :disabled="loading"
            class="btn-primary"
            :class="{ 'loading': loading }"
          >
            {{ loading ? 'در حال ایجاد...' : 'ایجاد شاگرد' }}
          </button>
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

// Emit for parent component
const emit = defineEmits(['menu-changed'])

// Form submission handler
const handleSubmit = async () => {
  // Reset states
  error.value = ''
  successMessage.value = ''
  
  // Validation
  if (!form.fullName || !form.email || !form.password) {
    error.value = 'پر کردن فیلدهای ستاره‌دار الزامی است'
    return
  }
  
  if (form.password.length < 6) {
    error.value = 'رمز عبور باید حداقل ۶ کاراکتر باشد'
    return
  }

  loading.value = true
  
  try {
    // Prepare data for API
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
    
    // API call to create student
    const response = await $fetch('/api/students/create', {
      method: 'POST',
      body: studentData,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Create student response:', response)
    
    if (response.success) {
      successMessage.value = `شاگرد ${form.fullName} با موفقیت ایجاد شد!`
      
      // Reset form
      Object.keys(form).forEach(key => {
        form[key] = key === 'fitnessLevel' ? 'beginner' : ''
      })
      
      // Optional: Go back to students list after 2 seconds
      setTimeout(() => {
        emit('menu-changed', 'students')
      }, 2000)
    } else {
      error.value = response.message || 'خطا در ایجاد شاگرد'
    }
    
  } catch (err) {
    console.error('Error creating student:', err)
    error.value = err.data?.statusMessage || err.message || 'خطا در ایجاد شاگرد'
  } finally {
    loading.value = false
  }
}

// Go back to previous page
const goBack = () => {
  emit('menu-changed', 'students')
}
</script>

<style scoped>
.add-student-page {
  direction: rtl;
  max-width: 800px;
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
}

.form-section h3 {
  color: #444;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  padding-right: 0.5rem;
  border-right: 3px solid #667eea;
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
  margin-bottom: 1.5rem;
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

.form-group label[for="department"]::after,
.form-group label[for="age"]::after,
.form-group label[for="gender"]::after,
.form-group label[for="height"]::after,
.form-group label[for="weight"]::after,
.form-group label[for="fitnessLevel"]::after,
.form-group label[for="goals"]::after,
.form-group label[for="notes"]::after {
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

.form-input[type="number"] {
  direction: ltr;
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

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f0f0f0;
}

.btn-primary, .btn-secondary {
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

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary.loading {
  position: relative;
  color: transparent;
}

.btn-primary.loading::after {
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

.btn-secondary {
  background: #f5f5f5;
  color: #666;
  border: 2px solid #e0e0e0;
}

.btn-secondary:hover {
  background: #e0e0e0;
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