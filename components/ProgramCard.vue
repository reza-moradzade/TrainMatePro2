<template>
  <div class="program-card" @click="$emit('view', program)">
    <div class="program-header">
      <div class="program-title">
        <h3>{{ program.title }}</h3>
        <span class="program-status" :class="program.status">
          {{ getStatusText(program.status) }}
        </span>
      </div>
      
      <div class="program-student">
        <span class="student-icon">👤</span>
        <span class="student-name">{{ program.student?.fullName || 'نامشخص' }}</span>
      </div>
    </div>

    <div class="program-content">
      <div class="program-meta">
        <div class="meta-item">
          <span class="meta-icon">📅</span>
          <span class="meta-text">{{ formatDate(program.startDate) }} - {{ formatDate(program.endDate) }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-icon">⏱️</span>
          <span class="meta-text">{{ program.durationWeeks }} هفته</span>
        </div>
      </div>

      <div class="program-description" v-if="program.description">
        <p>{{ truncateText(program.description, 80) }}</p>
      </div>

      <div class="program-weeks-preview">
        <span class="weeks-count">{{ program.weeks?.length || 0 }} هفته</span>
        <span class="exercises-count">{{ getTotalExercises(program) }} حرکت</span>
      </div>
    </div>

    <div class="program-actions">
      <button @click.stop="$emit('view', program)" class="btn-view">
        👁️ مشاهده
      </button>
      <button @click.stop="$emit('edit', program)" class="btn-edit">
        ✏️ ویرایش
      </button>
      <button @click.stop="$emit('delete', program)" class="btn-delete">
        🗑️ حذف
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
  return date.toLocaleDateString('fa-IR')
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
</script>

<style scoped>
.program-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.program-card:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
}

.program-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.program-title {
  flex: 1;
}

.program-title h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

.program-status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
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

.program-student {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.85rem;
  background: #f8f9fa;
  padding: 0.4rem 0.75rem;
  border-radius: 20px;
  white-space: nowrap;
}

.student-icon {
  font-size: 0.9rem;
}

.student-name {
  font-weight: 500;
}

.program-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #666;
  font-size: 0.85rem;
}

.meta-icon {
  font-size: 0.9rem;
}

.meta-text {
  color: #555;
}

.program-description {
  background: #f8f9fa;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  margin-bottom: 0.5rem;
  border-right: 3px solid #667eea;
}

.program-description p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.program-weeks-preview {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.weeks-count,
.exercises-count {
  background: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  color: #555;
}

.exercises-count {
  background: #eef2ff;
  color: #667eea;
}

.program-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f0f0f0;
}

.btn-view,
.btn-edit,
.btn-delete {
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

.btn-delete:hover {
  background: #f44336;
  color: white;
  border-color: #f44336;
}

@media (max-width: 768px) {
  .program-card {
    padding: 1rem;
  }

  .program-title h3 {
    font-size: 1.1rem;
  }

  .program-actions {
    flex-direction: column;
  }

  .btn-view,
  .btn-edit,
  .btn-delete {
    padding: 0.6rem;
  }
}
</style>