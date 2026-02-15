<template>
  <div class="login-container" :class="{ 'mobile': isMobile }">
    <form @submit.prevent="handleLogin" class="login-form">

      <h2>سیستم مدیریت برنامه تمرینی</h2>
      
      <!-- فیلد ایمیل با آیکون -->
      <div class="form-group">
        <label for="email">
          <span class="label-icon">📧</span>
          ایمیل
        </label>
        <div class="input-wrapper">
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="ایمیل خود را وارد کنید"
            required
            class="form-input"
            dir="ltr"
            :class="{ 'error': validationErrors.email }"
            @blur="validateEmail"
            @input="clearError"
          />
        </div>
        <span v-if="validationErrors.email" class="error-text">
          {{ validationErrors.email }}
        </span>
      </div>

      <!-- فیلد رمز عبور با آیکون و نمایش/مخفی‌سازی -->
      <div class="form-group">
        <label for="password">
          <span class="label-icon">🔒</span>
          رمز عبور
        </label>

        <div class="input-wrapper password-wrapper">
          <input
            :id="passwordFieldId"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="رمز عبور خود را وارد کنید"
            required
            class="form-input password-input"
            dir="ltr"
            :class="{ 'error': validationErrors.password }"
            @blur="validatePassword"
            @input="clearError"
          />
          
 <button 
    type="button" 
    @click="togglePassword" 
    class="toggle-password"
    :aria-label="showPassword ? 'مخفی کردن رمز' : 'نمایش رمز'"
  >
    <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
    
    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  </button>
        </div>
        
        <span v-if="validationErrors.password" class="error-text">
          {{ validationErrors.password }}
        </span>
        
        <!-- فراموشی رمز عبور - فقط در موبایل -->
        <div class="forgot-password" v-if="isMobile">
          <button type="button" class="forgot-link" @click="showForgotPassword">
            رمز عبور را فراموش کرده‌اید؟
          </button>
        </div>
      </div>

      <!-- دکمه ورود با انیمیشن -->
      <button 
        type="submit" 
        :disabled="loading || !isFormValid" 
        class="login-button"
        :class="{ 
          'loading': loading,
          'mobile': isMobile 
        }"
      >
        <span v-if="!loading">🔑 ورود</span>
        <span v-else>در حال ورود...</span>
      </button>

      <!-- پیام خطا -->
      <transition name="fade">
        <div v-if="error" class="error-message">
          <span class="error-icon">⚠️</span>
          <span class="error-text">{{ error }}</span>
          <button class="close-error" @click="error = ''" v-if="isMobile">✕</button>
        </div>
      </transition>

    </form>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  redirectTo: {
    type: String,
    default: ''
  }
})

// Reactive form state
const form = reactive({
  email: '',
  password: ''
})

// Validation errors
const validationErrors = reactive({
  email: '',
  password: ''
})

// Component states
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const isMobile = ref(false)
const showDemo = ref(false)
const passwordFieldId = ref(`password-${Math.random().toString(36).substr(2, 9)}`)

// Computed
const isFormValid = computed(() => {
  return form.email && form.password && !validationErrors.email && !validationErrors.password
})

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// Lifecycle hooks
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Email validation
const validateEmail = () => {
  if (!form.email) {
    validationErrors.email = 'ایمیل الزامی است'
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      validationErrors.email = 'ایمیل معتبر نیست'
    } else {
      validationErrors.email = ''
    }
  }
}

// Password validation
const validatePassword = () => {
  if (!form.password) {
    validationErrors.password = 'رمز عبور الزامی است'
  } else if (form.password.length < 6) {
    validationErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد'
  } else {
    validationErrors.password = ''
  }
}

// Clear error
const clearError = () => {
  error.value = ''
}

// Toggle password visibility
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// Quick login
const quickLogin = async (role) => {
  if (role === 'coach') {
    form.email = 'coach@trainmate.com'
    form.password = 'coach123'
  } else {
    form.email = 'student@trainmate.com'
    form.password = 'student123'
  }
  await handleLogin()
}

// Show forgot password (demo)
const showForgotPassword = () => {
  alert('در نسخه نمایشی، از اطلاعات آزمایشی استفاده کنید.')
}

// Login handler function
const handleLogin = async () => {
  // Validate fields
  validateEmail()
  validatePassword()
  
  if (!isFormValid.value) {
    error.value = 'لطفاً ایمیل و رمز عبور را وارد کنید'
    return
  }

  loading.value = true
  error.value = ''
  
  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: form,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Login response:', response)
    
    if (response.success) {
      console.log('Login successful - Role:', response.user.role)
      
      // Redirect based on role
      if (response.user.role === 'coach') {
        await navigateTo(props.redirectTo || '/dashboard')
      } else if (response.user.role === 'student') {
        await navigateTo(props.redirectTo || '/student-dashboard')
      } else {
        error.value = 'نقش کاربر نامعتبر است'
      }
    } else {
      error.value = response.message || 'ورود ناموفق بود'
    }
    
  } catch (err) {
    console.error('Login error details:', err)
    error.value = err.data?.statusMessage || err.message || 'خطا در ورود. لطفاً مجدد تلاش کنید.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.toggle-password svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
}
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
  padding: 1rem;
}

.login-form {
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  direction: rtl;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 700;
}

/* Form Group */
.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 600;
  font-size: 0.95rem;
}

.label-icon {
  font-size: 1.1rem;
}

/* Input Wrapper */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

/* مخصوص فیلد رمز عبور */
.password-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  direction: ltr;
  text-align: left;
}

/* تنظیمات مخصوص فیلد رمز عبور */
.password-input {
  padding-right: 1rem;
  padding-left: 3rem; /* فضا برای دکمه نمایش رمز */
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-input.error {
  border-color: #f44336;
}

.form-input.error:focus {
  box-shadow: 0 0 0 4px rgba(244, 67, 54, 0.1);
}

/* Toggle Password */
.toggle-password {
  position: absolute;
  left: 10px; /* فاصله از لبه چپ */
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #999;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  width: 36px;
  height: 36px;
}

.toggle-password:hover {
  color: #667eea;
  background: #f5f5f5;
}

/* Error Text */
.error-text {
  color: #f44336;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

/* Forgot Password */
.forgot-password {
  text-align: left;
  margin-top: 0.5rem;
}

.forgot-link {
  background: none;
  border: none;
  color: #667eea;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: all 0.3s ease;
}

.forgot-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* Login Button */
.login-button {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 1.5rem 0 1rem;
  position: relative;
  overflow: hidden;
}

.login-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.login-button:not(:disabled):active {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-button.mobile {
  padding: 1rem;
  font-size: 1rem;
}

/* Loading State */
.login-button.loading {
  color: transparent;
  pointer-events: none;
}

.login-button.loading::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 24px;
  top: 50%;
  left: 50%;
  margin-left: -12px;
  margin-top: -12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error Message */
.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid #ffcdd2;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.error-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.error-message .error-text {
  flex: 1;
  color: #c62828;
  margin: 0;
  font-size: 0.9rem;
}

.close-error {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1.1rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-error:hover {
  color: #666;
  background: rgba(0, 0, 0, 0.05);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .login-container {
    padding: 0;
  }

  .login-form {
    padding: 2rem 1.5rem;
    border-radius: 16px;
    max-width: 100%;
    margin: 0 1rem;
  }

  h2 {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.25rem;
  }

  .form-input {
    padding: 1rem 1rem;
    font-size: 16px; /* Prevent zoom on mobile */
  }

  .password-input {
    padding-left: 3rem;
  }

  .toggle-password {
    width: 44px;
    height: 44px;
    left: 5px;
  }

  .login-button {
    padding: 1rem;
  }
}

/* Small Mobile Styles */
@media (max-width: 480px) {
  .login-form {
    padding: 1.5rem 1.25rem;
    margin: 0 0.5rem;
  }

  h2 {
    font-size: 1.2rem;
  }
}

/* Tablet Styles */
@media (min-width: 769px) and (max-width: 1024px) {
  .login-form {
    padding: 2.5rem;
    max-width: 450px;
  }
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  .login-button,
  .toggle-password,
  .forgot-link {
    min-height: 48px;
  }

  .form-input {
    font-size: 16px;
  }
}

/* RTL Support */
[dir="rtl"] .form-input {
  text-align: right;
}

[dir="rtl"] .password-input {
  padding-left: 1rem;
  padding-right: 1rem;
}

[dir="rtl"] .toggle-password {
  left: auto;
  right: 10px;
}

[dir="rtl"] .forgot-password {
  text-align: right;
}

/* Print Styles */
@media print {
  .login-container {
    min-height: auto;
  }

  .login-form {
    box-shadow: none;
    border: 1px solid #ddd;
  }

  .toggle-password,
  .forgot-password {
    display: none !important;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .login-button,
  .error-message {
    animation: none;
    transition: none;
  }
}

/* Safe Area Support */
@supports (padding: max(0px)) {
  .login-form {
    padding-bottom: max(2rem, env(safe-area-inset-bottom));
  }

  .login-container.mobile {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>