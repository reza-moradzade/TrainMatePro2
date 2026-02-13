<template>
  <div class="student-mobile-card" @click="$emit('view', student)">
    <div class="card-header">
      <div class="student-avatar" :style="{ background: getAvatarColor(student.id) }">
        {{ getInitials(student.fullName) }}
      </div>
      <div class="student-info">
        <h3>{{ student.fullName }}</h3>
        <p>{{ student.email }}</p>
      </div>
      <span class="department-badge">{{ student.department || 'ورزشکار' }}</span>
    </div>

    <div class="card-content">
      <div class="info-row" v-if="student.profile">
        <div class="info-item">
          <span class="info-label">سطح</span>
          <span class="info-value badge">{{ getFitnessLevelText(student.profile.fitnessLevel) }}</span>
        </div>
        <div class="info-item" v-if="student.profile.age">
          <span class="info-label">سن</span>
          <span class="info-value">{{ student.profile.age }}</span>
        </div>
        <div class="info-item" v-if="student.profile.height">
          <span class="info-label">قد</span>
          <span class="info-value">{{ student.profile.height }}cm</span>
        </div>
        <div class="info-item" v-if="student.profile.weight">
          <span class="info-label">وزن</span>
          <span class="info-value">{{ student.profile.weight }}kg</span>
        </div>
      </div>
      <div v-else class="no-profile">
        📋 پروفایل تکمیل نشده
      </div>
    </div>

    <div class="card-footer">
      <div class="stats">
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
      
      <div class="actions">
        <button @click.stop="$emit('view', student)" class="action-btn view">
          👁️
        </button>
        <button @click.stop="$emit('edit', student)" class="action-btn edit">
          ✏️
        </button>
        <button @click.stop="$emit('workout', student)" class="action-btn workout">
          🏋️
        </button>
      </div>
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
.student-mobile-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.student-mobile-card:active {
  background: #f8f9fa;
  transform: scale(0.99);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
}

.student-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
  color: white;
  flex-shrink: 0;
}

.student-info {
  flex: 1;
  min-width: 0;
}

.student-info h3 {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.student-info p {
  margin: 0;
  color: #666;
  font-size: 0.75rem;
  direction: ltr;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.department-badge {
  position: absolute;
  top: -0.25rem;
  left: -0.25rem;
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: 600;
  white-space: nowrap;
}

.card-content {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 0.75rem;
}

.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: space-around;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
}

.info-label {
  color: #666;
  font-size: 0.65rem;
  margin-bottom: 0.1rem;
}

.info-value {
  color: #333;
  font-weight: 600;
  font-size: 0.85rem;
}

.info-value.badge {
  background: #eef2ff;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  color: #667eea;
}

.no-profile {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.8rem;
  padding: 0.5rem;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;
  border-top: 1px solid #f0f0f0;
}

.stats {
  display: flex;
  gap: 1rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: #667eea;
}

.stat-label {
  font-size: 0.6rem;
  color: #666;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: white;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.action-btn.view:active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.action-btn.edit:active {
  background: #ff9800;
  color: white;
  border-color: #ff9800;
}

.action-btn.workout:active {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

@media (max-width: 480px) {
  .student-mobile-card {
    padding: 0.875rem;
  }

  .student-avatar {
    width: 45px;
    height: 45px;
    font-size: 0.9rem;
  }

  .stats {
    gap: 0.75rem;
  }

  .action-btn {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
}
</style>