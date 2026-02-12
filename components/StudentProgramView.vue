
<template>
  <div class="student-program-view">
    <!-- Program Header -->
    <div class="program-header">
      <div class="header-info">
        <h1>{{ program.title }}</h1>
        <div class="program-meta">
          <span class="meta-item">
            <span class="meta-icon">👨‍🏫</span>
            مربی: {{ program.coach.fullName }}
          </span>
          <span class="meta-item">
            <span class="meta-icon">📅</span>
            از {{ formatDate(program.startDate) }} تا {{ formatDate(program.endDate) }}
          </span>
          <span class="meta-item">
            <span class="meta-icon">⏱️</span>
            {{ program.durationWeeks }} هفته
          </span>
          <span class="meta-item status" :class="program.status">
            {{ getStatusText(program.status) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Program Description -->
    <div class="program-description" v-if="program.description">
      <h3>📝 توضیحات برنامه</h3>
      <p>{{ program.description }}</p>
    </div>

    <!-- Weekly Schedule -->
    <div class="weekly-schedule">
      <h3>📅 برنامه هفتگی</h3>
      
      <div class="weeks-tabs">
        <button 
          v-for="week in program.weeks" 
          :key="week.id"
          :class="{ active: activeWeek === week.weekNumber }"
          @click="setActiveWeek(week.weekNumber)"
          class="week-tab"
        >
          هفته {{ week.weekNumber }}
          <span v-if="week.focus" class="week-focus-badge">
            {{ week.focus }}
          </span>
        </button>
      </div>

      <!-- Active Week Content -->
      <div class="week-content" v-if="activeWeekData">
        <div class="week-header">
          <h4>{{ activeWeekData.title }}</h4>
          <div class="week-stats">
            <span class="stat-item">
              <span class="stat-icon">📅</span>
              {{ activeWeekData.days.length }} روز تمرین
            </span>
            <span class="stat-item">
              <span class="stat-icon">🏋️‍♂️</span>
              {{ countExercises(activeWeekData) }} حرکت
            </span>
            <span class="stat-item" v-if="activeWeekData.focus">
              <span class="stat-icon">🎯</span>
              تمرکز: {{ activeWeekData.focus }}
            </span>
          </div>
        </div>

        <!-- Days of Week -->
        <div class="days-container">
          <div class="day-card" v-for="day in activeWeekData.days" :key="day.id">
            <div class="day-header">
              <h5>{{ getDayName(day.dayName) }}</h5>
              <div class="day-meta">
                <span v-if="day.duration" class="day-duration">
                  ⏱️ {{ day.duration }} دقیقه
                </span>
                <span class="day-exercises-count">
                  {{ day.exercises.length }} حرکت
                </span>
              </div>
            </div>
            
            <div class="day-content">
              <div class="day-focus" v-if="day.focus">
                <strong>تمرکز:</strong> {{ day.focus }}
              </div>
              
              <div class="exercises-section" v-if="day.exercises.length > 0">
                <h6>حرکات:</h6>
                <div class="exercises-list">
                  <div class="exercise-card" v-for="exercise in day.exercises" :key="exercise.id">
                    <div class="exercise-header">
                      <span class="exercise-number">{{ exercise.order }}</span>
                      <h7>{{ exercise.name }}</h7>
                    </div>
                    
                    <div class="exercise-details">
                      <div class="detail-row">
                        <span class="detail-label">ست‌ها:</span>
                        <span class="detail-value">{{ exercise.sets }}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">تکرار:</span>
                        <span class="detail-value">{{ exercise.reps }}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">استراحت:</span>
                        <span class="detail-value">{{ exercise.restTime }}</span>
                      </div>
                    </div>
                    
                    <div class="exercise-notes" v-if="exercise.description">
                      <span class="notes-label">نکات:</span>
                      <p>{{ exercise.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else class="no-exercises">
                روز استراحت
              </div>
              
              <div class="day-notes" v-if="day.notes">
                <strong>📝 یادداشت مربی:</strong> {{ day.notes }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Program Notes -->
    <div class="program-notes" v-if="program.notes">
      <h3>📌 یادداشت‌های مربی</h3>
      <p>{{ program.notes }}</p>
    </div>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  program: {
    type: Object,
    required: true
  }
})

// Reactive state
const activeWeek = ref(1)

// Computed
const activeWeekData = computed(() => {
  return props.program.weeks.find(w => w.weekNumber === activeWeek.value) || props.program.weeks[0]
})

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

// Set active week
const setActiveWeek = (weekNumber) => {
  activeWeek.value = weekNumber
}

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

// Get day name in Persian
const getDayName = (dayName) => {
  return persianDays[dayName] || dayName
}

// Count exercises in a week
const countExercises = (week) => {
  return week.days.reduce((total, day) => total + day.exercises.length, 0)
}
</script>

<style scoped>
.student-program-view {
  direction: rtl;
}

.program-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.header-info h1 {
  margin: 0 0 1rem 0;
  font-size: 1.8rem;
}

.program-meta {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  opacity: 0.9;
}

.meta-icon {
  font-size: 1rem;
}

.meta-item.status {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 1rem;
  border-radius: 15px;
  font-weight: 600;
}

.meta-item.status.active {
  background: rgba(76, 175, 80, 0.3);
}

.program-description {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  border: 2px solid #e9ecef;
}

.program-description h3 {
  margin: 0 0 1rem 0;
  color: #444;
  font-size: 1.2rem;
}

.program-description p {
  margin: 0;
  color: #666;
  line-height: 1.7;
}

.weekly-schedule {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  border: 2px solid #e9ecef;
}

.weekly-schedule h3 {
  margin: 0 0 1.5rem 0;
  color: #444;
  font-size: 1.3rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f0f0f0;
}

.weeks-tabs {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.75rem;
  margin-bottom: 1.5rem;
}

.week-tab {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  color: #666;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.week-tab:hover {
  background: #e9ecef;
}

.week-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.week-focus-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.1rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.week-content {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
}

.week-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.week-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.week-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.stat-icon {
  font-size: 0.9rem;
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
  border-radius: 10px;
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
  color: #333;
  font-size: 1.1rem;
}

.day-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-end;
}

.day-duration {
  color: #667eea;
  font-size: 0.85rem;
  font-weight: 500;
}

.day-exercises-count {
  color: #666;
  font-size: 0.8rem;
  background: #f5f5f5;
  padding: 0.1rem 0.5rem;
  border-radius: 10px;
}

.day-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.day-focus {
  color: #666;
  font-size: 0.9rem;
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 8px;
  border-right: 3px solid #ff9800;
}

.exercises-section h6 {
  margin: 0 0 1rem 0;
  color: #444;
  font-size: 1rem;
}

.exercises-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.exercise-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
}

.exercise-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed #dee2e6;
}

.exercise-number {
  width: 25px;
  height: 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8rem;
}

.exercise-header h7 {
  margin: 0;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
}

.exercise-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  color: #666;
  font-size: 0.8rem;
}

.detail-value {
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

.exercise-notes {
  background: white;
  padding: 0.75rem;
  border-radius: 6px;
  border-left: 3px solid #4caf50;
}

.notes-label {
  color: #666;
  font-size: 0.85rem;
  font-weight: 500;
  display: block;
  margin-bottom: 0.25rem;
}

.exercise-notes p {
  margin: 0;
  color: #666;
  font-size: 0.85rem;
  line-height: 1.5;
}

.no-exercises {
  text-align: center;
  color: #999;
  padding: 2rem 1rem;
  font-style: italic;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
}

.day-notes {
  background: #e3f2fd;
  border: 1px solid #90caf9;
  padding: 0.75rem;
  border-radius: 8px;
  color: #1565c0;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.program-notes {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  border: 2px solid #e9ecef;
}

.program-notes h3 {
  margin: 0 0 1rem 0;
  color: #444;
  font-size: 1.2rem;
}

.program-notes p {
  margin: 0;
  color: #666;
  line-height: 1.7;
}
</style>