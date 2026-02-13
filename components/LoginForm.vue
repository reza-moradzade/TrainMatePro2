<template>
  <div class="login-container" :class="{ 'mobile': isMobile }">
    <form @submit.prevent="handleLogin" class="login-form">
      <!-- لوگوی فرم در موبایل -->
      <div class="form-logo" v-if="isMobile">
        <div class="logo-icon">💪</div>
      </div>

      <h2>سیستم مدیریت تمرین</h2>
      
      <!-- فیلد ایمیل با آیکون -->
      <div class="form-group">
        <label for="email">
          <span class="label-icon">📧</span>
          ایمیل
        </label>
        <div class="input-wrapper">
          <span class="input-icon">📧</span>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="coach@trainmate.com"
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
        <div class="input-wrapper">
          <span class="input-icon">🔒</span>
          <input
            :id="passwordFieldId"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="رمز عبور خود را وارد کنید"
            required
            class="form-input"
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
            {{ showPassword ? '👁️' : '👁️‍🗨️' }}
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

      <!-- اطلاعات آزمایشی - جمع‌شونده در موبایل -->
      <div class="demo-info" :class="{ 'collapsed': isMobile && !showDemo }">
        <div class="demo-header" @click="isMobile && (showDemo = !showDemo)" v-if="isMobile">
          <span class="demo-icon">🔧</span>
          <span class="demo-title">اطلاعات آزمایشی</span>
          <span class="expand-icon">{{ showDemo ? '▼' : '◀' }}</span>
        </div>
        
        <div class="demo-content" v-show="!isMobile || showDemo">
          <p><strong>اطلاعات آزمایشی:</strong></p>
          <div class="demo-item">
            <span class="role-badge coach">مربی</span>
            <span class="demo-credential">coach@trainmate.com / coach123</span>
          </div>
          <div class="demo-item">
            <span class="role-badge student">شاگرد</span>
            <span class="demo-credential">student@trainmate.com / student123</span>
          </div>
          <p class="note">✅ هم مربی و هم شاگرد می‌توانند وارد شوند</p>
        </div>
      </div>

      <!-- دکمه‌های سریع برای موبایل -->
      <div class="quick-login" v-if="isMobile">
        <p>ورود سریع:</p>
        <div class="quick-buttons">
          <button type="button" class="quick-btn coach" @click="quickLogin('coach')">
            <span>👨‍🏫</span>
            مربی
          </button>
          <button type="button" class="quick-btn student" @click="quickLogin('student')">
            <span>🧑‍🎓</span>
            شاگرد
          </button>
        </div>
      </div>
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

/* Form Logo - Mobile */
.form-logo {
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-logo .logo-icon {
  font-size: 3rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
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

.input-icon {
  position: absolute;
  right: 1rem;
  color: #999;
  font-size: 1.1rem;
  z-index: 1;
  transition: color 0.3s ease;
}

.form-input {
  width: 100%;
  padding: 0.875rem 3rem 0.875rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  direction: ltr;
  text-align: left;
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
  left: 1rem;
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

/* Demo Info */
.demo-info {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  margin-top: 1.5rem;
  overflow: hidden;
}

.demo-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #e3f2fd;
  color: #1565c0;
  cursor: pointer;
  transition: background 0.3s ease;
}

.demo-header:active {
  background: #bbdefb;
}

.demo-icon {
  font-size: 1.1rem;
}

.demo-title {
  flex: 1;
  font-weight: 600;
  font-size: 0.95rem;
}

.expand-icon {
  font-size: 0.9rem;
  transition: transform 0.3s ease;
}

.demo-content {
  padding: 1rem;
  border-top: 1px solid #e9ecef;
}

.demo-content p {
  margin: 0 0 0.75rem 0;
  color: #1565c0;
  font-weight: 600;
}

.demo-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  white-space: nowrap;
}

.role-badge.coach {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.role-badge.student {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
}

.demo-credential {
  font-size: 0.85rem;
  color: #666;
  direction: ltr;
  text-align: left;
  font-family: monospace;
}

.note {
  color: #4caf50 !important;
  font-size: 0.85rem;
  margin-top: 0.75rem !important;
  font-weight: 500 !important;
}

/* Quick Login - Mobile */
.quick-login {
  margin-top: 1.5rem;
  text-align: center;
}

.quick-login p {
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.quick-buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.quick-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background: white;
  color: #666;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-btn.coach {
  border-color: #667eea;
  color: #667eea;
}

.quick-btn.coach:active {
  background: #667eea;
  color: white;
}

.quick-btn.student {
  border-color: #4caf50;
  color: #4caf50;
}

.quick-btn.student:active {
  background: #4caf50;
  color: white;
}

.quick-btn span {
  font-size: 1.1rem;
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
    padding: 1rem 3rem 1rem 1rem;
    font-size: 16px; /* Prevent zoom on mobile */
  }

  .toggle-password {
    padding: 0.75rem;
  }

  .login-button {
    padding: 1rem;
  }

  .demo-content {
    padding: 0.75rem;
  }

  .demo-item {
    padding: 0.75rem;
  }

  .demo-credential {
    font-size: 0.8rem;
  }

  .quick-buttons {
    flex-direction: column;
  }

  .quick-btn {
    padding: 0.875rem;
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

  .form-logo .logo-icon {
    font-size: 2.5rem;
  }

  .demo-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .demo-credential {
    width: 100%;
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
  .quick-btn,
  .toggle-password,
  .demo-header,
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
  padding: 0.875rem 1rem 0.875rem 3rem;
}

[dir="rtl"] .input-icon {
  right: 1rem;
  left: auto;
}

[dir="rtl"] .toggle-password {
  left: auto;
  right: calc(100% - 3rem);
}

[dir="rtl"] .forgot-password {
  text-align: right;
}

[dir="rtl"] .demo-credential {
  text-align: right;
  direction: ltr;
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

  .demo-info,
  .quick-login,
  .toggle-password,
  .forgot-password {
    display: none !important;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .login-button,
  .form-logo .logo-icon,
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