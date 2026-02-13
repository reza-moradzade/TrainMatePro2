<template>
  <div class="student-program-view">
    <!-- Program Header - Responsive -->
    <div class="program-header" :class="{ 'mobile': isMobile }">
      <div class="header-info">
        <div class="header-top">
          <h1>{{ program.title }}</h1>
          <span class="program-status" :class="program.status">
            {{ getStatusText(program.status) }}
          </span>
        </div>
        
        <div class="coach-info">
          <span class="coach-icon">👨‍🏫</span>
          <span class="coach-name">{{ program.coach.fullName }}</span>
        </div>
      </div>
      
      <div class="program-meta-grid">
        <div class="meta-card">
          <span class="meta-icon">📅</span>
          <div class="meta-content">
            <span class="meta-label">شروع</span>
            <span class="meta-value">{{ formatDate(program.startDate) }}</span>
          </div>
        </div>
        
        <div class="meta-card">
          <span class="meta-icon">📅</span>
          <div class="meta-content">
            <span class="meta-label">پایان</span>
            <span class="meta-value">{{ formatDate(program.endDate) }}</span>
          </div>
        </div>
        
        <div class="meta-card">
          <span class="meta-icon">⏱️</span>
          <div class="meta-content">
            <span class="meta-label">مدت</span>
            <span class="meta-value">{{ program.durationWeeks }} هفته</span>
          </div>
        </div>
        
        <div class="meta-card">
          <span class="meta-icon">🏋️</span>
          <div class="meta-content">
            <span class="meta-label">حرکات</span>
            <span class="meta-value">{{ totalExercises }} حرکت</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Program Description -->
    <div class="program-description" v-if="program.description">
      <div class="description-header">
        <span class="description-icon">📝</span>
        <h3>توضیحات برنامه</h3>
      </div>
      <p>{{ program.description }}</p>
    </div>

    <!-- Weekly Schedule -->
    <div class="weekly-schedule">
      <div class="schedule-header">
        <div class="header-title">
          <span class="title-icon">📅</span>
          <h3>برنامه هفتگی</h3>
        </div>
        
        <!-- Week Selector Dropdown for Mobile -->
        <div v-if="isMobile" class="week-selector">
          <select v-model="activeWeek" class="week-dropdown">
            <option v-for="week in program.weeks" :key="week.id" :value="week.weekNumber">
              هفته {{ week.weekNumber }} {{ week.focus ? `- ${week.focus}` : '' }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- Weeks Tabs - Desktop -->
      <div v-if="!isMobile" class="weeks-tabs">
        <button 
          v-for="week in program.weeks" 
          :key="week.id"
          :class="{ active: activeWeek === week.weekNumber }"
          @click="setActiveWeek(week.weekNumber)"
          class="week-tab"
        >
          <span class="week-number">هفته {{ week.weekNumber }}</span>
          <span v-if="week.focus" class="week-focus">
            {{ week.focus }}
          </span>
        </button>
      </div>

      <!-- Week Summary Card for Mobile -->
      <div v-if="isMobile && activeWeekData" class="week-summary-card">
        <div class="week-summary-header">
          <h4>{{ activeWeekData.title }}</h4>
          <div class="week-badge">{{ activeWeekData.days.length }} روز</div>
        </div>
        <div class="week-focus-badge" v-if="activeWeekData.focus">
          🎯 {{ activeWeekData.focus }}
        </div>
        <div class="week-stats">
          <div class="stat">
            <span class="stat-value">{{ countExercises(activeWeekData) }}</span>
            <span class="stat-label">حرکت</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ getTotalDuration(activeWeekData) }}</span>
            <span class="stat-label">دقیقه</span>
          </div>
        </div>
      </div>

      <!-- Active Week Content -->
      <div class="week-content" v-if="activeWeekData">
        <!-- Days Accordion for Mobile -->
        <div v-if="isMobile" class="days-accordion">
          <div 
            v-for="(day, index) in activeWeekData.days" 
            :key="day.id"
            class="day-accordion-item"
            :class="{ expanded: expandedDay === index }"
          >
            <div class="day-accordion-header" @click="toggleDay(index)">
              <div class="day-info">
                <span class="day-name">{{ getDayName(day.dayName) }}</span>
                <span class="day-exercises-count">{{ day.exercises.length }} حرکت</span>
              </div>
              <div class="day-meta">
                <span v-if="day.duration" class="day-duration">
                  ⏱️ {{ day.duration }}'
                </span>
                <span class="accordion-icon">{{ expandedDay === index ? '▼' : '◀' }}</span>
              </div>
            </div>
            
            <div class="day-accordion-content" v-show="expandedDay === index">
              <div class="day-content">
                <div class="day-focus" v-if="day.focus">
                  <span class="focus-label">تمرکز:</span>
                  <span class="focus-value">{{ day.focus }}</span>
                </div>
                
                <div class="exercises-section" v-if="day.exercises.length > 0">
                  <h6>حرکات</h6>
                  <div class="exercises-list">
                    <div 
                      class="exercise-card" 
                      v-for="exercise in day.exercises" 
                      :key="exercise.id"
                    >
                      <div class="exercise-header">
                        <span class="exercise-number">{{ exercise.order }}</span>
                        <span class="exercise-name">{{ exercise.name }}</span>
                      </div>
                      
                      <div class="exercise-specs">
                        <div class="spec-item">
                          <span class="spec-label">ست</span>
                          <span class="spec-value">{{ exercise.sets }}</span>
                        </div>
                        <div class="spec-item">
                          <span class="spec-label">تکرار</span>
                          <span class="spec-value">{{ exercise.reps }}</span>
                        </div>
                        <div class="spec-item">
                          <span class="spec-label">استراحت</span>
                          <span class="spec-value">{{ exercise.restTime }}</span>
                        </div>
                      </div>
                      
                      <div class="exercise-note" v-if="exercise.description">
                        <span class="note-icon">💡</span>
                        <span class="note-text">{{ exercise.description }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-else class="rest-day">
                  <span class="rest-icon">😊</span>
                  <span class="rest-text">روز استراحت</span>
                </div>
                
                <div class="day-note" v-if="day.notes">
                  <span class="note-icon">📝</span>
                  <span class="note-text">{{ day.notes }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Days Grid - Desktop -->
        <div v-else class="days-grid">
          <div class="day-card" v-for="day in activeWeekData.days" :key="day.id">
            <div class="day-card-header">
              <h5>{{ getDayName(day.dayName) }}</h5>
              <div class="day-badges">
                <span v-if="day.duration" class="duration-badge">
                  ⏱️ {{ day.duration }}'
                </span>
                <span class="exercises-badge">
                  {{ day.exercises.length }} حرکت
                </span>
              </div>
            </div>
            
            <div class="day-card-content">
              <div class="day-focus" v-if="day.focus">
                {{ day.focus }}
              </div>
              
              <div class="exercises-preview">
                <div 
                  v-for="exercise in day.exercises.slice(0, 2)" 
                  :key="exercise.id"
                  class="exercise-preview"
                >
                  <span class="preview-name">{{ exercise.name }}</span>
                  <span class="preview-sets">{{ exercise.sets }}×{{ exercise.reps }}</span>
                </div>
                <div v-if="day.exercises.length > 2" class="more-exercises">
                  + {{ day.exercises.length - 2 }} حرکت دیگر
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Program Notes -->
    <div class="program-notes" v-if="program.notes">
      <div class="notes-header">
        <span class="notes-icon">📌</span>
        <h3>یادداشت‌های مربی</h3>
      </div>
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
const expandedDay = ref(null)
const isMobile = ref(false)

// Computed
const activeWeekData = computed(() => {
  return props.program.weeks.find(w => w.weekNumber === activeWeek.value) || props.program.weeks[0]
})

const totalExercises = computed(() => {
  let total = 0
  props.program.weeks.forEach(week => {
    week.days.forEach(day => {
      total += day.exercises.length
    })
  })
  return total
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

// Set active week
const setActiveWeek = (weekNumber) => {
  activeWeek.value = weekNumber
  expandedDay.value = null // Reset expanded day
}

// Toggle day accordion
const toggleDay = (index) => {
  expandedDay.value = expandedDay.value === index ? null : index
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

// Get total duration in a week
const getTotalDuration = (week) => {
  return week.days.reduce((total, day) => total + (day.duration || 0), 0)
}
</script>

<style scoped>
.student-program-view {
  direction: rtl;
  max-width: 1200px;
  margin: 0 auto;
}

/* Program Header */
.program-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 1.5rem;
}

.program-header.mobile {
  padding: 1.5rem;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.header-info h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.program-status {
  padding: 0.35rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
}

.program-status.active {
  background: rgba(76, 175, 80, 0.3);
}

.coach-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  opacity: 0.9;
}

.coach-icon {
  font-size: 1.1rem;
}

/* Program Meta Grid */
.program-meta-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.meta-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  backdrop-filter: blur(10px);
}

.meta-icon {
  font-size: 1.3rem;
}

.meta-content {
  display: flex;
  flex-direction: column;
}

.meta-label {
  font-size: 0.7rem;
  opacity: 0.8;
}

.meta-value {
  font-weight: 600;
  font-size: 0.95rem;
}

/* Program Description */
.program-description {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 1.5rem;
  border: 1px solid #e9ecef;
}

.description-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.description-icon {
  font-size: 1.2rem;
}

.program-description h3 {
  margin: 0;
  color: #444;
  font-size: 1.1rem;
}

.program-description p {
  margin: 0;
  color: #666;
  line-height: 1.7;
}

/* Weekly Schedule */
.weekly-schedule {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 1.5rem;
  border: 1px solid #e9ecef;
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f0f0f0;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.title-icon {
  font-size: 1.2rem;
}

.schedule-header h3 {
  margin: 0;
  color: #444;
  font-size: 1.2rem;
}

/* Week Dropdown - Mobile */
.week-selector {
  width: 100%;
  max-width: 200px;
}

.week-dropdown {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 0.95rem;
  background: white;
  color: #333;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: left 1rem center;
  background-size: 1em;
  padding-left: 2.5rem;
}

/* Weeks Tabs - Desktop */
.weeks-tabs {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.75rem;
  margin-bottom: 1.5rem;
}

.week-tab {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.95rem;
  color: #666;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.week-tab:hover {
  background: #e9ecef;
}

.week-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.week-number {
  font-weight: 600;
}

.week-focus {
  font-size: 0.7rem;
  opacity: 0.9;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Week Summary Card - Mobile */
.week-summary-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.25rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.week-summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.week-summary-header h4 {
  margin: 0;
  font-size: 1.1rem;
}

.week-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

.week-focus-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.15);
  padding: 0.35rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.week-stats {
  display: flex;
  gap: 1.5rem;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.9;
}

/* Days Accordion - Mobile */
.days-accordion {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.day-accordion-item {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
}

.day-accordion-item.expanded {
  border-color: #667eea;
}

.day-accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.day-accordion-header:active {
  background: #f8f9fa;
}

.day-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.day-name {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.day-exercises-count {
  color: #667eea;
  font-size: 0.8rem;
}

.day-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.day-duration {
  color: #666;
  font-size: 0.85rem;
}

.accordion-icon {
  color: #999;
  font-size: 0.9rem;
}

.day-accordion-content {
  padding: 1rem;
  border-top: 1px solid #f0f0f0;
  background: #f8f9fa;
}

/* Days Grid - Desktop */
.days-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.day-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
}

.day-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.day-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.day-card-header h5 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.day-badges {
  display: flex;
  gap: 0.5rem;
}

.duration-badge {
  color: #667eea;
  font-size: 0.8rem;
  background: #eef2ff;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

.exercises-badge {
  color: #666;
  font-size: 0.8rem;
  background: #f5f5f5;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

/* Exercise Cards */
.exercises-section h6 {
  margin: 0 0 1rem 0;
  color: #444;
  font-size: 0.95rem;
}

.exercises-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.exercise-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 1rem;
}

.exercise-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.exercise-number {
  width: 26px;
  height: 26px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8rem;
}

.exercise-name {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.exercise-specs {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.spec-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f9fa;
  padding: 0.5rem;
  border-radius: 8px;
  flex: 1;
}

.spec-label {
  color: #666;
  font-size: 0.7rem;
  margin-bottom: 0.25rem;
}

.spec-value {
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

.exercise-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff3e0;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #e65100;
}

.note-icon {
  font-size: 1rem;
}

/* Exercises Preview */
.exercises-preview {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.exercise-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.preview-name {
  color: #666;
}

.preview-sets {
  color: #333;
  font-weight: 500;
  background: #f5f5f5;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.more-exercises {
  color: #667eea;
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: 0.25rem;
}

/* Rest Day */
.rest-day {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
}

.rest-icon {
  font-size: 1.2rem;
}

.rest-text {
  color: #666;
  font-style: italic;
}

/* Day Notes */
.day-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: #e3f2fd;
  border-radius: 8px;
  color: #1565c0;
  font-size: 0.85rem;
}

/* Program Notes */
.program-notes {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid #e9ecef;
}

.notes-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.notes-icon {
  font-size: 1.2rem;
}

.program-notes h3 {
  margin: 0;
  color: #444;
  font-size: 1.1rem;
}

.program-notes p {
  margin: 0;
  color: #666;
  line-height: 1.7;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .program-meta-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .student-program-view {
    padding: 0;
  }

  .program-header {
    border-radius: 0;
    margin-bottom: 1rem;
  }

  .header-info h1 {
    font-size: 1.4rem;
  }

  .program-meta-grid {
    gap: 0.75rem;
  }

  .meta-card {
    padding: 0.75rem;
  }

  .meta-icon {
    font-size: 1.1rem;
  }

  .meta-value {
    font-size: 0.85rem;
  }

  .program-description,
  .weekly-schedule,
  .program-notes {
    border-radius: 12px;
    margin-bottom: 1rem;
    padding: 1.25rem;
  }

  .schedule-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .week-selector {
    max-width: 100%;
  }

  .exercise-specs {
    flex-wrap: wrap;
  }

  .spec-item {
    min-width: calc(50% - 0.5rem);
  }
}

@media (max-width: 480px) {
  .program-meta-grid {
    grid-template-columns: 1fr;
  }

  .program-header {
    padding: 1.25rem;
  }

  .header-info h1 {
    font-size: 1.2rem;
  }

  .exercise-specs {
    flex-direction: column;
    gap: 0.5rem;
  }

  .spec-item {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.75rem;
  }

  .spec-label {
    margin-bottom: 0;
  }

  .day-accordion-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .day-meta {
    width: 100%;
    justify-content: space-between;
  }
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  .week-tab,
  .day-accordion-header,
  .day-card {
    cursor: default;
  }

  .day-accordion-header:active {
    background: #f0f0f0;
  }
}

/* RTL Support */
[dir="rtl"] .week-dropdown {
  background-position: right 1rem center;
  padding-right: 2.5rem;
  padding-left: 1rem;
}

[dir="rtl"] .accordion-icon {
  transform: scaleX(-1);
}

[dir="rtl"] .meta-card {
  text-align: right;
}

/* Safe Area Support */
@supports (padding: max(0px)) {
  .program-header.mobile {
    padding-top: max(1.5rem, env(safe-area-inset-top));
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .week-tab,
  .day-card,
  .day-accordion-header {
    transition: none;
  }
}
</style>