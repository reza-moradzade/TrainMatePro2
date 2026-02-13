<template>
  <div class="student-card" @click="$emit('view', student)">
    <div class="student-header">
      <div class="student-avatar" :style="{ background: getAvatarColor(student.id) }">
        {{ getInitials(student.fullName) }}
      </div>
      <div class="student-info">
        <h3 class="student-name">{{ student.fullName }}</h3>
        <p class="student-email">{{ student.email }}</p>
        <span class="student-badge">{{ student.department || 'ورزشکار' }}</span>
      </div>
    </div>
    
    <div class="student-details">
      <div v-if="student.profile" class="profile-info">
        <div class="detail-item">
          <span class="detail-label">سطح:</span>
          <span class="detail-value badge">{{ getFitnessLevelText(student.profile.fitnessLevel) }}</span>
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
        <span>📋 پروفایل تکمیل نشده</span>
      </div>
    </div>
    
    <div class="student-stats">
      <div class="stat">
        <span class="stat-value">{{ student.programCount || 0 }}</span>
        <span class="stat-label">برنامه</span>
      </div>
      <div class="stat">
        <span class="stat-value">{{ student.activePrograms || 0 }}</span>
        <span class="stat-label">فعال</span>
      </div>
      <div class="stat">
        <span class="stat-value">{{ student.completedWorkouts || 0 }}</span>
        <span class="stat-label">تکمیل</span>
      </div>
    </div>
    
    <div class="student-actions">
      <button @click.stop="$emit('view', student)" class="btn-view">
        👁️ مشاهده
      </button>
      <button @click.stop="$emit('edit', student)" class="btn-edit">
        ✏️ ویرایش
      </button>
      <button @click.stop="$emit('workout', student)" class="btn-workout">
        🏋️ برنامه
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  student: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'edit', 'workout'])

// Generate avatar color based on student id
const getAvatarColor = (id) => {
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  ]
  return colors[(id % colors.length)]
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
</script>

<style scoped>
.student-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.student-card:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
}

.student-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.student-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  color: white;
  flex-shrink: 0;
}

.student-info {
  flex: 1;
  min-width: 0;
}

.student-name {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.student-email {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.85rem;
  direction: ltr;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.student-badge {
  display: inline-block;
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
}

.student-details {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
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
  font-size: 0.85rem;
}

.detail-value {
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

.detail-value.badge {
  background: #eef2ff;
  padding: 0.2rem 0.75rem;
  border-radius: 15px;
  color: #667eea;
}

.no-profile {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #999;
  font-size: 0.9rem;
  padding: 0.5rem;
}

.student-stats {
  display: flex;
  justify-content: space-around;
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 12px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #667eea;
}

.stat-label {
  font-size: 0.7rem;
  color: #666;
  margin-top: 0.1rem;
}

.student-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.btn-view,
.btn-edit,
.btn-workout {
  flex: 1;
  padding: 0.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  color: #666;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.btn-view:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.btn-edit:hover {
  background: #ff9800;
  color: white;
  border-color: #ff9800;
}

.btn-workout:hover {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

@media (max-width: 768px) {
  .student-card {
    padding: 1.25rem;
  }

  .student-avatar {
    width: 50px;
    height: 50px;
    font-size: 1rem;
  }

  .student-name {
    font-size: 1.1rem;
  }

  .student-actions {
    flex-direction: column;
  }
}
</style>