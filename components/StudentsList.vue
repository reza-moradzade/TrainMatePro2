
<template>
  <div class="students-page">
    <div class="page-header">
      <h1>👥 شاگردان من</h1>
      <p>لیست شاگردان تحت آموزش شما</p>
    </div>

    <div class="stats-summary">
      <div class="stat-item">
        <span class="stat-number">{{ students.length }}</span>
        <span class="stat-label">تعداد شاگردان</span>
      </div>
    </div>

    <div class="students-container">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>در حال بارگذاری شاگردان...</p>
      </div>

      <div v-else-if="students.length === 0" class="empty-state">
        <div class="empty-icon">👥</div>
        <h3>هنوز شاگردی ندارید</h3>
        <p>با کلیک روی دکمه "افزودن شاگرد" اولین شاگرد خود را اضافه کنید.</p>
        <button @click="goToAddStudent" class="btn-primary">
          ➕ افزودن شاگرد
        </button>
      </div>

      <div v-else class="students-list">
        <div class="students-grid">
          <div v-for="student in students" :key="student.id" class="student-card">
            <div class="student-header">
              <div class="student-avatar">
                {{ getInitials(student.fullName) }}
              </div>
              <div class="student-info">
                <h3 class="student-name">{{ student.fullName }}</h3>
                <p class="student-email">{{ student.email }}</p>
                <span class="student-badge">{{ student.department }}</span>
              </div>
            </div>
            
            <div class="student-details">
              <div v-if="student.profile" class="profile-info">
                <div class="detail-item">
                  <span class="detail-label">سطح:</span>
                  <span class="detail-value">{{ getFitnessLevelText(student.profile.fitnessLevel) }}</span>
                </div>
                <div v-if="student.profile.age" class="detail-item">
                  <span class="detail-label">سن:</span>
                  <span class="detail-value">{{ student.profile.age }} سال</span>
                </div>
                <div v-if="student.profile.height && student.profile.weight" class="detail-item">
                  <span class="detail-label">قد/وزن:</span>
                  <span class="detail-value">{{ student.profile.height }}cm / {{ student.profile.weight }}kg</span>
                </div>
              </div>
              <div v-else class="no-profile">
                پروفایل تکمیل نشده
              </div>
            </div>
            
            <div class="student-actions">
              <button class="btn-action" @click="viewStudent(student)">
                👁️ مشاهده
              </button>
              <button class="btn-action" @click="editStudent(student)">
                ✏️ ویرایش
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Reactive state
const students = ref([])
const loading = ref(true)
const error = ref('')

// Emit for parent component
const emit = defineEmits(['menu-changed'])

// Fetch students on component mount
onMounted(async () => {
  await fetchStudents()
})

// Fetch students from API
const fetchStudents = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/students')
    
    console.log('Students response:', response)
    
    if (response.success) {
      students.value = response.students
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

// Get initials from full name
const getInitials = (fullName) => {
  if (!fullName) return '??'
  return fullName.split(' ').map(n => n[0]).join('').toUpperCase()
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

// Navigation functions
const goToAddStudent = () => {
  emit('menu-changed', 'add-student')
}

const viewStudent = (student) => {
  alert(`مشاهده شاگرد: ${student.fullName}\nاین بخش به زودی فعال می‌شود.`)
}

const editStudent = (student) => {
  alert(`ویرایش شاگرد: ${student.fullName}\nاین بخش به زودی فعال می‌شود.`)
}
</script>

<style scoped>
.students-page {
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

.stats-summary {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #667eea;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.students-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  min-height: 400px;
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
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
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

.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.student-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.student-card:hover {
  border-color: #667eea;
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.1);
}

.student-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.student-avatar {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.student-info {
  flex: 1;
}

.student-name {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-size: 1.2rem;
}

.student-email {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
  direction: ltr;
  text-align: right;
}

.student-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.student-details {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  color: #666;
  font-size: 0.9rem;
}

.detail-value {
  color: #333;
  font-weight: 500;
  font-size: 0.95rem;
}

.no-profile {
  color: #999;
  text-align: center;
  padding: 0.5rem;
  font-style: italic;
}

.student-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-action {
  flex: 1;
  padding: 0.5rem;
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
</style>