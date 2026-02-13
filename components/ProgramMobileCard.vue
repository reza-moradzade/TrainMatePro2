<template>
  <div class="program-mobile-card" @click="$emit('view', program)">
    <div class="card-header">
      <div class="header-left">
        <h3>{{ program.title }}</h3>
        <span class="program-status" :class="program.status">
          {{ getStatusText(program.status) }}
        </span>
      </div>
      <div class="student-badge">
        <span class="badge-icon">👤</span>
        <span class="badge-text">{{ program.student?.fullName || 'شاگرد' }}</span>
      </div>
    </div>

    <div class="card-content">
      <div class="date-info">
        <span class="date-icon">📅</span>
        <span class="date-text">{{ formatDate(program.startDate) }}</span>
        <span class="date-separator">-</span>
        <span class="date-text">{{ formatDate(program.endDate) }}</span>
      </div>

      <div class="stats-row">
        <div class="stat">
          <span class="stat-value">{{ program.durationWeeks }}</span>
          <span class="stat-label">هفته</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ program.weeks?.length || 0 }}</span>
          <span class="stat-label">هفته</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ getTotalExercises(program) }}</span>
          <span class="stat-label">حرکت</span>
        </div>
      </div>

      <div class="progress-section" v-if="program.status === 'active'">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: getProgressWidth() + '%' }"></div>
        </div>
        <span class="progress-text">۶۰% تکمیل</span>
      </div>

      <div class="description-preview" v-if="program.description">
        <p>{{ truncateText(program.description, 60) }}</p>
      </div>
    </div>

    <div class="card-footer">
      <button @click.stop="$emit('view', program)" class="footer-btn view">
        <span class="btn-icon">👁️</span>
        <span>مشاهده</span>
      </button>
      <button @click.stop="$emit('edit', program)" class="footer-btn edit">
        <span class="btn-icon">✏️</span>
        <span>ویرایش</span>
      </button>
      <button @click.stop="$emit('delete', program)" class="footer-btn delete">
        <span class="btn-icon">🗑️</span>
        <span>حذف</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  program: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'edit', 'delete'])

// Get status text
const getStatusText = (status) => {
  const statusMap = {
    'active': 'فعال',
    'completed': 'تکمیل شده',
    'cancelled': 'لغو شده'
  }
  return statusMap[status] || status
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'ثبت نشده'
  const date = new Date(dateString)
  return date.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' })
}

// Truncate text
const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

// Get total exercises
const getTotalExercises = (program) => {
  let total = 0
  program.weeks?.forEach(week => {
    week.days?.forEach(day => {
      total += day.exercises?.length || 0
    })
  })
  return total
}

// Get progress width (demo)
const getProgressWidth = () => {
  return Math.floor(Math.random() * 60) + 20
}
</script>

<style scoped>
.program-mobile-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.program-mobile-card:active {
  background: #f8f9fa;
  transform: scale(0.99);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-left {
  flex: 1;
}

.header-left h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.program-status {
  display: inline-block;
  padding: 0.2rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
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

.student-badge {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: #f8f9fa;
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  color: #666;
  white-space: nowrap;
}

.badge-icon {
  font-size: 0.8rem;
}

.badge-text {
  font-weight: 500;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.date-info {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #666;
  font-size: 0.8rem;
  background: #f8f9fa;
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
}

.date-icon {
  font-size: 0.9rem;
}

.date-text {
  color: #555;
}

.date-separator {
  color: #999;
}

.stats-row {
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
  font-size: 1.1rem;
  font-weight: 700;
  color: #667eea;
}

.stat-label {
  font-size: 0.65rem;
  color: #666;
  margin-top: 0.1rem;
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.7rem;
  color: #4caf50;
  font-weight: 600;
  white-space: nowrap;
}

.description-preview {
  background: #fff3e0;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  border-right: 3px solid #ff9800;
}

.description-preview p {
  margin: 0;
  color: #e65100;
  font-size: 0.8rem;
  line-height: 1.4;
}

.card-footer {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f0f0f0;
}

.footer-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.6rem 0;
  border: none;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  border: 1px solid #e0e0e0;
  color: #666;
}

.footer-btn.view:active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.footer-btn.edit:active {
  background: #ff9800;
  color: white;
  border-color: #ff9800;
}

.footer-btn.delete:active {
  background: #f44336;
  color: white;
  border-color: #f44336;
}

.btn-icon {
  font-size: 0.9rem;
}

@media (max-width: 480px) {
  .program-mobile-card {
    padding: 1rem;
  }

  .card-footer {
    flex-direction: column;
  }

  .footer-btn {
    padding: 0.7rem;
  }

  .stats-row {
    padding: 0.6rem;
  }

  .stat-value {
    font-size: 1rem;
  }
}
</style>