<template>
  <div class="create-workout-page">
    <div class="page-header">
      <div class="header-top">
        <div class="header-title">
          <h1>🏋️‍♂️ ایجاد برنامه تمرینی</h1>
        </div>
      </div>
    </div>
    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="workout-form">
        <div class="form-section" v-show="currentStep === 1">
          <h3>
            <span class="section-icon">📋</span>
            اطلاعات اولیه برنامه
          </h3>
          
          <div class="form-card">
            <div class="form-group">
              <label for="studentId">
                <span class="required-star">*</span>
                شاگرد
              </label>
              <div class="select-wrapper">
                <span class="select-icon">👤</span>
                <select 
                  id="studentId" 
                  v-model="form.studentId" 
                  required 
                  class="form-input"
                  @change="loadStudentInfo"
                >
                  <option value="" disabled selected>انتخاب شاگرد</option>
                  <option v-for="student in students" :key="student.studentId" :value="student.studentId">
                    {{ student.fullName }} - {{ student.email }}
                  </option>
                </select>
              </div>
            </div>
            <div v-if="selectedStudent" class="student-info-card">
            <div class="student-details">
              <div class="detail-row">
                <span class="detail-label">نام:</span>
                <span class="detail-value">{{ selectedStudent.fullName }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">سن:</span>
                <span class="detail-value">{{ selectedStudent.age || 'ثبت نشده' }} سال</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">قد/وزن:</span>
                <span class="detail-value">{{ selectedStudent.height || '?' }}cm / {{ selectedStudent.weight || '?' }}kg</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">سطح:</span>
                <span class="detail-value badge">{{ getFitnessLevelText(selectedStudent.fitnessLevel) }}</span>
              </div>
              <div class="detail-row" v-if="selectedStudent.goals">
                <span class="detail-label">اهداف:</span>
                <span class="detail-value">{{ selectedStudent.goals }}</span>
              </div>
            </div>
          </div>
           <br>
            <div class="form-group">
              <label for="title">
                <span class="required-star">*</span>
                عنوان برنامه
              </label>
              <div class="input-wrapper">
                <span class="input-icon">🏷️</span>
                <input
                  id="title"
                  v-model="form.title"
                  type="text"
                  placeholder="مثال: برنامه فیتنس ۴ هفته‌ای"
                  required
                  class="form-input"
                />
              </div>
            </div>
    <div class="form-group half">
                <label for="durationWeeks">
                  <span class="required-star">*</span>
                  مدت برنامه
                </label>
                <div class="select-wrapper">
                  <span class="select-icon">⏱️</span>
                  <select 
                    id="durationWeeks" 
                    v-model="form.durationWeeks" 
                    required 
                    class="form-input"
                    @change="handleDurationChange"
                  >
                    <option value="1">۱ هفته</option>
                    <option value="2">۲ هفته</option>
                    <option value="3">۳ هفته</option>
                    <option value="4" selected>۴ هفته</option>
                    <option value="8">۸ هفته</option>
                    <option value="12">۱۲ هفته</option>
                  </select>
                </div>
              </div>
              <br>
              
            <div class="form-row">
              <div class="form-group half">
                <label for="startDate">
                  <span class="required-star">*</span>
                  تاریخ شروع
                </label>
                <div class="input-wrapper">
                  <span class="input-icon">📅</span>
                  <input
                    id="startDate"
                    v-model="form.startDate"
                    type="date"
                    required
                    class="form-input"
                    @change="calculateEndDate"
                  />
                <div class="persian-date-display" v-if="form.startDate">
                  <span class="persian-icon">🇮🇷</span>
                  <span class="persian-date">{{ persianStartDate }}</span>
                </div>
                </div>
              </div>
              
          
            </div>
 <div class="form-row">
            <div class="form-group">
              <label for="endDate">تاریخ پایان</label>
              <div class="input-wrapper readonly">
                <span class="input-icon">📅</span>
                <input
                  id="endDate"
                  v-model="form.endDate"
                  type="date"
                  readonly
                  class="form-input"
                />
              <div class="persian-date-display" v-if="form.endDate">
                <span class="persian-icon">🇮🇷</span>
                <span class="persian-date">{{ persianEndDate }}</span>
              </div>
              </div>

            </div>
  </div>
            <div class="form-group">
              <label for="description">توضیحات</label>
              <div class="textarea-wrapper">
                <span class="textarea-icon">📝</span>
                <textarea
                  id="description"
                  v-model="form.description"
                  placeholder="توضیح مختصر درباره برنامه"
                  class="form-input"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

  
        </div>
        <div class="form-section" v-show="currentStep === 2">
          <h3>
            <span class="section-icon">📅</span>
            برنامه هفتگی
          </h3>
          <!-- Week Selector -->
          <div class="week-selector">
            <div class="week-tabs">
              <button 
                type="button"  
                v-for="week in form.weeks" 
                :key="week.weekNumber"
                :class="{ 
                  active: selectedWeek === week.weekNumber,
                  'first-week': week.weekNumber === 1,
                  'repeated-week': week.weekNumber > 1 && !week.customized
                }"
                @click="selectWeek(week.weekNumber)"
                class="week-tab"
              >
                <span class="week-number">هفته {{ week.weekNumber }}</span>
                <span v-if="week.weekNumber === 1" class="week-badge">اصلی</span>
                <span v-else-if="week.customized" class="week-badge customized">✏️ سفارشی</span>
                <span v-else class="week-badge repeated">🔄 تکراری</span>
              </button>
            </div>
          </div>

          <!-- Customization Notice -->
          <div v-if="selectedWeek > 1 && form.weeks[selectedWeek - 1] && !form.weeks[selectedWeek - 1].customized" class="customize-notice">
            <div class="notice-content">
              <span class="notice-icon">ℹ️</span>
              <p>این هفته از هفته اول کپی شده است. برای ایجاد تغییرات، گزینه زیر را فعال کنید.</p>
            </div>
            <button @click="customizeWeek(selectedWeek)" class="btn-customize">
              ✏️ سفارشی‌سازی این هفته
            </button>
          </div>

          <div v-if="selectedWeek > 1 && form.weeks[selectedWeek - 1] && form.weeks[selectedWeek - 1].customized" class="customized-badge">
            <span class="badge-icon">✨</span>
            <span>این هفته به صورت سفارشی تنظیم شده است</span>
          </div>

          <div class="weeks-container">
            <div 
              v-for="week in form.weeks" 
              :key="week.weekNumber"
              v-show="week.weekNumber === selectedWeek"
              class="week-card"
            >
              <div class="week-header">
                <div class="week-title">
                  <h4>{{ week.title }}</h4>
                  <div class="week-tags">
                    <span v-if="week.weekNumber === 1" class="week-badge-main">هفته اصلی</span>
                    <span v-else-if="week.customized" class="week-badge-custom">سفارشی</span>
                    <span v-else class="week-badge-repeat">تکراری از هفته اول</span>
                  </div>
                </div>
                <div class="week-focus">
                  <label>هدف برنامه :</label>
                  <input
                    v-model="week.focus"
                    type="text"
                    placeholder="مثال: افزایش قدرت پایه"
                    class="form-input"
                  />
                </div>
              </div>

              <div class="days-container">
                <div 
                  v-for="day in week.days" 
                  :key="day.dayNumber"
                  class="day-card"
                >
                  <div class="day-header" @click="isMobile && toggleDay(day.dayNumber)">
                    <div class="day-title">
                      <h5>{{ getDayName(day.dayName) }}</h5>
                      <span class="day-exercises-count">{{ day.exercises.length }} حرکت</span>
                    </div>
                    <div class="day-actions">
                      <span v-if="day.duration" class="day-duration">
                        ⏱️ {{ day.duration }}'
                      </span>
                      <span v-if="isMobile" class="expand-icon">
                        {{ expandedDay === day.dayNumber ? '▼' : '◀' }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="day-content" v-show="!isMobile || expandedDay === day.dayNumber">
                    <div class="form-group">
                      <label>تمرکز روز:</label>
                      <input
                        v-model="day.focus"
                        type="text"
                        placeholder="مثال: تمرین سینه و پشت بازو"
                        class="form-input"
                      />
                    </div>
                    
                    <div class="form-group">
                      <label>مدت تمرین (دقیقه):</label>
                      <input
                        v-model="day.duration"
                        type="number"
                        placeholder="60"
                        class="form-input"
                      />
                    </div>

                    <div class="exercises-section">
                      <div class="exercises-header">
                        <h6>حرکات</h6>
                        <button 
                          type="button" 
                          @click="showExerciseSearch(day)"
                          class="btn-add-exercise"
                        >
                          <span class="btn-icon">➕</span>
                          <span v-if="!isMobile">اضافه کردن حرکت</span>
                        </button>
                      </div>
                      
<div class="exercises-list">
  <div 
    class="exercise-item" 
    v-for="(exercise, exIndex) in day.exercises" 
    :key="exIndex"
  >
    <div class="exercise-header">
      <div class="exercise-number">{{ exIndex + 1 }}</div>
      
      <!-- تصویر کوچک حرکت -->
      <div class="exercise-thumbnail">
        <img 
          :src="exercise.gifUrl" 
          :alt="exercise.name"
          loading="lazy"
          @error="handleImageError"
        />
      </div>
      
      <!-- نام حرکت به صورت input قابل ویرایش - استفاده از displayName -->
      <div class="exercise-name-wrapper">
        <input
          v-model="exercise.displayName"
          type="text"
          class="exercise-name-input"
          @input="updateExerciseName(exercise)"
        />
        <span class="exercise-original-name" v-if="exercise.displayName !== exercise.name">
          نام اصلی: {{ exercise.name }}
        </span>
      </div>
      
      <button 
        type="button" 
        @click="removeExercise(day, exIndex)"
        class="btn-remove"
        title="حذف حرکت"
      >
        ✕
      </button>
    </div>
    
    <div class="exercise-details">
      <div class="detail-input">
        <label>ست</label>
        <input
          v-model="exercise.sets"
          type="number"
          min="1"
          max="10"
          placeholder="۳"
          class="small-input"
        />
      </div>
      <div class="detail-input">
        <label>تکرار</label>
        <input
          v-model="exercise.reps"
          type="text"
          placeholder="۱۰-۱۲"
          class="small-input"
        />
      </div>
      <div class="detail-input">
        <label>استراحت</label>
        <input
          v-model="exercise.restTime"
          type="text"
          placeholder="۶۰-۹۰"
          class="small-input"
        />
      </div>
    </div>
    
    <div class="exercise-notes">
      <textarea
        v-model="exercise.description"
        placeholder="نکات فنی حرکت (اختیاری)"
        class="notes-input"
        rows="2"
      ></textarea>
    </div>
    
    <!-- نمایش نام ذخیره شده (برای دیباگ) -->
    <div class="exercise-meta" v-if="exercise.displayName !== exercise.name">
      <small>نام سفارشی: {{ exercise.displayName }}</small>
    </div>
  </div>
  
  <div v-if="day.exercises.length === 0" class="no-exercises">
    <span class="empty-icon">🏋️‍♂️</span>
    <p>هنوز حرکتی اضافه نشده است</p>
  </div>
</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Review & Submit -->
        <div class="form-section" v-show="currentStep === 3">
          <h3>
            <span class="section-icon">👁️</span>
            مرور نهایی
          </h3>
          
          <div class="review-summary">
            <div class="summary-card">
              <div class="card-header">
                <span class="header-icon">📋</span>
                <h4>اطلاعات برنامه</h4>
              </div>
              <div class="summary-content">
                <div class="summary-row">
                  <span class="summary-label">شاگرد:</span>
                  <span class="summary-value">{{ getStudentName(form.studentId) }}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">عنوان:</span>
                  <span class="summary-value">{{ form.title }}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">مدت:</span>
                  <span class="summary-value">{{ form.durationWeeks }} هفته</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">از:</span>
                  <span class="summary-value">{{ formatPersianDate(form.startDate) }}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">تا:</span>
                  <span class="summary-value">{{ formatPersianDate(form.endDate) }}</span>
                </div>
                <div v-if="form.description" class="summary-row description">
                  <span class="summary-label">توضیحات:</span>
                  <span class="summary-value">{{ form.description }}</span>
                </div>
              </div>
            </div>
            
            <div class="summary-card">
              <div class="card-header">
                <span class="header-icon">📅</span>
                <h4>ساختار برنامه</h4>
                <span class="badge-info">{{ form.durationWeeks }} هفته</span>
              </div>
              <div class="weeks-summary">
                <div 
                  v-for="week in form.weeks" 
                  :key="week.weekNumber"
                  class="week-summary-item"
                  :class="{ 'customized-week': week.customized }"
                >
                  <div class="week-summary-header" @click="toggleWeekSummary(week.weekNumber)">
                    <div class="week-info">
                      <span class="week-title">هفته {{ week.weekNumber }}</span>
                      <span v-if="week.weekNumber === 1" class="week-type-badge primary">اصلی</span>
                      <span v-else-if="week.customized" class="week-type-badge customized">✏️ سفارشی</span>
                      <span v-else class="week-type-badge repeated">🔄 تکراری</span>
                    </div>
                    <span v-if="week.focus" class="week-focus-tag">{{ week.focus }}</span>
                    <span class="expand-icon">
                      {{ expandedWeek === week.weekNumber ? '▼' : '◀' }}
                    </span>
                  </div>
                  
                  <div class="week-summary-days" v-show="expandedWeek === week.weekNumber">
                    <div 
                      v-for="day in week.days" 
                      :key="day.dayNumber"
                      class="day-summary-item"
                    >
                      <div class="day-summary-header">
                        <span class="day-name">{{ getDayName(day.dayName) }}</span>
                        <span class="day-exercises">{{ day.exercises.length }} حرکت</span>
                      </div>
                      <div v-if="day.focus" class="day-focus">{{ day.focus }}</div>
                      <div v-if="day.exercises.length > 0" class="exercise-preview">
                        {{ day.exercises.slice(0, 2).map(e => e.name).join('، ') }}
                        <span v-if="day.exercises.length > 2"> + {{ day.exercises.length - 2 }} دیگر</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Messages -->
        <div v-if="successMessage" class="success-message">
          <span class="message-icon">✅</span>
          <div class="message-content">
            <h4>موفقیت!</h4>
            <p>{{ successMessage }}</p>
          </div>
        </div>

        <div v-if="error" class="error-message">
          <span class="message-icon">❌</span>
          <div class="message-content">
            <h4>خطا</h4>
            <p>{{ error }}</p>
          </div>
        </div>
        <!-- Navigation Buttons -->
        <div class="form-navigation">

          <div class="navigation-buttons">
            <button 
              type="button" 
              @click="prevStep"
              v-if="currentStep > 1"
              class="btn-secondary"
            >
              <span class="btn-icon">→</span>
              <span v-if="!isMobile">مرحله قبل</span>
            </button>
            
            <button 
              type="button" 
              @click="nextStep"
              v-if="currentStep < 3"
              class="btn-primary"
            >
              <span v-if="!isMobile">مرحله بعد</span>
              <span class="btn-icon">←</span>
            </button>
            
            <button 
              type="submit" 
              v-if="currentStep === 3"
              :disabled="loading"
              class="btn-success"
              :class="{ 'loading': loading }"
            >
              <span v-if="!loading">✅ {{ isMobile ? 'ثبت' : 'ایجاد برنامه' }}</span>
              <span v-else>در حال ایجاد...</span>
            </button>
          </div>
        </div>


      </form>
    </div>

    <!-- Exercise Selection Modal با فیلتر پیشرفته -->
    <div v-if="showExerciseModal" class="modal-overlay" @click="closeExerciseModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>🏋️‍♂️ انتخاب حرکت ورزشی</h3>
          <button @click="closeExerciseModal" class="close-help">✕</button>
        </div>
        
        <div class="modal-body">
          <!-- فیلترهای سریع -->
          <div class="filter-tabs">
            <button 
              v-for="filter in quickFilters" 
              :key="filter.value"
              :class="{ active: selectedQuickFilter === filter.value }"
              @click="setQuickFilter(filter.value)"
              class="filter-tab"
            >
              {{ filter.label }}
            </button>
          </div>

          <!-- دسته‌بندی اصلی -->
          <div class="category-tabs">
            <button 
              v-for="cat in categories" 
              :key="cat.value"
              :class="{ active: selectedCategory === cat.value }"
              @click="setCategory(cat.value)"
              class="category-tab"
            >
              {{ cat.label }}
            </button>
          </div>

          <!-- زیرمجموعه‌ها (بر اساس دسته انتخاب شده) -->
          <div class="subcategory-section" v-if="subcategories.length > 0">
            <div class="subcategory-grid">
              <button 
                v-for="sub in subcategories" 
                :key="sub"
                :class="{ active: selectedSubcategory === sub }"
                @click="setSubcategory(sub)"
                class="subcategory-btn"
              >
                {{ sub }}
              </button>
            </div>
          </div>

          <!-- Search Input -->
          <div class="search-container">
            <div class="input-wrapper">
              <span class="input-icon">🔍</span>
              <input
                v-model="exerciseSearchQuery"
                type="text"
                placeholder="جستجوی سریع..."
                class="form-input"
                @input="debouncedSearchExercises"
              />
              <button v-if="exerciseSearchQuery" @click="clearSearch" class="clear-search">
                ✕
              </button>
            </div>
          </div>

          <!-- نتایج -->
          <div class="results-section">
            <!-- تعداد نتایج -->
            <div class="results-count" v-if="!searchLoading && filteredExercises.length > 0">
              {{ filteredExercises.length }} حرکت یافت شد (صفحه {{ currentPage }} از {{ totalPages }})
            </div>

            <!-- Loading -->
            <div v-if="searchLoading" class="loading-state">
              <div class="spinner"></div>
              <p>در حال بارگذاری {{ allExercises.length }}/1500 حرکت...</p>
            </div>

            <!-- نتایج با صفحه‌بندی -->
            <div v-else-if="filteredExercises.length > 0" class="search-results">
              <div 
                v-for="exercise in paginatedExercises" 
                :key="exercise.exerciseId"
                class="search-result-item"
                @click="selectExercise(exercise)"
              >
                <div class="result-gif">
                  <img :src="exercise.gifUrl" :alt="exercise.name" loading="lazy" />
                </div>
                <div class="result-info">
                  <div class="result-name">{{ exercise.name }}</div>
                  <div class="result-tags">
                    <span class="result-tag muscle">
                      {{ exercise.targetMuscles?.[0] ? translateMuscle(exercise.targetMuscles[0]) : 'عضله' }}
                    </span>
                    <span class="result-tag equipment">
                      {{ exercise.equipments?.[0] ? translateEquipment(exercise.equipments[0]) : 'وسیله' }}
                    </span>
                    <span v-if="exercise.bodyParts?.[0]" class="result-tag bodypart">
                      {{ translateBodyPart(exercise.bodyParts[0]) }}
                    </span>
                  </div>
                  <div class="result-meta">
                    <span v-if="exercise.targetMuscles?.length > 1" class="meta-item">
                      +{{ exercise.targetMuscles.length - 1 }} عضله دیگر
                    </span>
                  </div>
                </div>
              </div>

              <!-- صفحه‌بندی -->
              <div v-if="totalPages > 1" class="pagination">
                <button 
                  @click="changePage(currentPage - 1)" 
                  :disabled="currentPage === 1"
                  class="pagination-btn"
                >
                  ←
                </button>
                
                <button 
                  v-for="page in displayedPages" 
                  :key="page"
                  @click="changePage(page)"
                  :class="['pagination-btn', { active: currentPage === page }]"
                >
                  {{ page }}
                </button>
                
                <button 
                  @click="changePage(currentPage + 1)" 
                  :disabled="currentPage === totalPages"
                  class="pagination-btn"
                >
                  →
                </button>
              </div>
            </div>

            <!-- بدون نتیجه -->
            <div v-else-if="exerciseSearchQuery || selectedQuickFilter !== 'all' || selectedSubcategory" class="no-results">
              <span class="empty-icon">😕</span>
              <p>حرکتی با این مشخصات یافت نشد</p>
              <p class="result-hint">تعداد کل حرکات: {{ allExercises.length }}</p>
              <button @click="clearFilters" class="btn-clear">
                🗑️ پاک کردن فیلترها
              </button>
            </div>

            <!-- حالت پیش‌فرض (پرطرفدارها) -->
            <div v-else class="popular-section">
              <h4>حرکات پرطرفدار ({{ popularExercises.length }} حرکت)</h4>
              <div class="popular-grid">
                <div 
                  v-for="exercise in popularExercises" 
                  :key="exercise.exerciseId"
                  class="popular-item"
                  @click="selectExercise(exercise)"
                >
                  <img :src="exercise.gifUrl" :alt="exercise.name" loading="lazy" />
                  <span>{{ exercise.name }}</span>
                  <span class="popular-tag">{{ translateMuscle(exercise.targetMuscles?.[0]) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import moment from 'jalali-moment'

// توابع ترجمه
const translateMuscle = (muscle) => {
  const translations = {
    'abs': 'شکم',
    'pectorals': 'سینه',
    'lats': 'پشت',
    'traps': 'ذوزنقه',
    'delts': 'سرشانه',
    'biceps': 'جلو بازو',
    'triceps': 'پشت بازو',
    'forearms': 'ساعد',
    'quads': 'جلو پا',
    'hamstrings': 'پشت پا',
    'glutes': 'باسن',
    'calves': 'ساق پا',
    'adductors': 'داخل ران',
    'abductors': 'بیرون ران',
    'upper back': 'پشت',
    'shoulders': 'سرشانه',
    'chest': 'سینه',
    'back': 'پشت',
    'upper arms': 'بازو',
    'lower arms': 'ساعد',
    'upper legs': 'پا',
    'lower legs': 'ساق پا',
    'waist': 'شکم',
    'neck': 'گردن',
    'cardiovascular system': 'قلبی عروقی',
    'spine': 'ستون فقرات',
    'serratus anterior': 'دندان‌ای قدامی',
    'levator scapulae': 'بالابر کتف'
  }
  return translations[muscle] || muscle
}

const translateEquipment = (equipment) => {
  const translations = {
    'body weight': 'بدون وسیله',
    'dumbbell': 'دمبل',
    'barbell': 'هالتر',
    'cable': 'سیم‌کش',
    'band': 'کش',
    'kettlebell': 'کتل بل',
    'leverage machine': 'دستگاه',
    'smith machine': 'اسمیت',
    'sled machine': 'اسکوات دستگاه',
    'stability ball': 'توپ تعادلی',
    'bosu ball': 'بوسو',
    'medicine ball': 'توپ طبی',
    'roller': 'غلتک',
    'rope': 'طناب',
    'weighted': 'وزنه‌دار',
    'assisted': 'کمکی',
    'trap bar': 'هالتر ذوزنقه',
    'ez barbell': 'هالتر EZ',
    'olympic barbell': 'هالتر المپیک',
    'wheel roller': 'چرخ شکم',
    'hammer': 'چکش',
    'tire': 'لاستیک'
  }
  return translations[equipment] || equipment
}

const translateBodyPart = (part) => {
  const translations = {
    'chest': 'سینه',
    'back': 'پشت',
    'shoulders': 'سرشانه',
    'upper arms': 'بازو',
    'lower arms': 'ساعد',
    'upper legs': 'پا',
    'lower legs': 'ساق پا',
    'waist': 'شکم',
    'neck': 'گردن',
    'cardio': 'قلبی عروقی'
  }
  return translations[part] || part
}

// Reactive form state
const form = reactive({
  studentId: '',
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  durationWeeks: 4,
  weeks: []
})

// برای نمایش شمسی
const persianStartDate = computed(() => {
  if (!form.startDate) return 'انتخاب نشده'
  return moment(form.startDate).locale('fa').format('YYYY/MM/DD')
})

const persianEndDate = computed(() => {
  if (!form.endDate) return 'انتخاب نشده'
  return moment(form.endDate).locale('fa').format('YYYY/MM/DD')
})

// فرمت تاریخ برای نمایش در خلاصه
const formatPersianDate = (dateString) => {
  if (!dateString) return 'ثبت نشده'
  return moment(dateString).locale('fa').format('dddd، DD MMMM YYYY')
}

// Component states
const currentStep = ref(1)
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const students = ref([])
const selectedStudent = ref(null)
const isMobile = ref(false)
const selectedWeek = ref(1)
const expandedDay = ref(null)
const expandedWeek = ref(null)

// Exercise search states
const showExerciseModal = ref(false)
const exerciseSearchQuery = ref('')
const allExercises = ref([])
const filteredExercises = ref([])
const searchLoading = ref(false)
const currentTargetDay = ref(null)

// Pagination states
const currentPage = ref(1)
const itemsPerPage = 20

// Filter states
const selectedQuickFilter = ref('all')
const selectedCategory = ref('all')
const selectedSubcategory = ref('')

// داده‌های فیلتر
const quickFilters = [
  { value: 'all', label: 'همه' },
  { value: 'chest', label: 'سینه' },
  { value: 'back', label: 'پشت' },
  { value: 'legs', label: 'پا' },
  { value: 'shoulders', label: 'سرشانه' },
  { value: 'arms', label: 'بازو' },
  { value: 'abs', label: 'شکم' }
]

const categories = [
  { value: 'all', label: 'همه دسته‌ها' },
  { value: 'muscle', label: 'عضله هدف' },
  { value: 'bodypart', label: 'بخش بدن' },
  { value: 'equipment', label: 'وسیله' }
]

// زیرمجموعه‌های داینامیک
const subcategories = computed(() => {
  if (selectedCategory.value === 'muscle') {
    return [...new Set(allExercises.value.flatMap(ex => 
      ex.targetMuscles?.map(m => translateMuscle(m)) || []
    ))].sort()
  } else if (selectedCategory.value === 'bodypart') {
    return [...new Set(allExercises.value.flatMap(ex => 
      ex.bodyParts?.map(b => translateBodyPart(b)) || []
    ))].sort()
  } else if (selectedCategory.value === 'equipment') {
    return [...new Set(allExercises.value.flatMap(ex => 
      ex.equipments?.map(e => translateEquipment(e)) || []
    ))].sort()
  }
  return []
})

// Popular exercises (cache)
const popularExercises = ref([])

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

// Pagination computed
const paginatedExercises = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredExercises.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredExercises.value.length / itemsPerPage)
})

const displayedPages = computed(() => {
  const delta = 2
  const range = []
  const rangeWithDots = []
  let l

  for (let i = 1; i <= totalPages.value; i++) {
    if (i === 1 || i === totalPages.value || (i >= currentPage.value - delta && i <= currentPage.value + delta)) {
      range.push(i)
    }
  }

  range.forEach((i) => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  })

  return rangeWithDots
})

// Debounce timer
let searchTimer = null

// Lifecycle hooks
onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  await fetchStudents()
  initializeWeeks()
  await loadAllExercises()
  await loadPopularExercises()
  
  // Set default start date to tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  form.startDate = tomorrow.toISOString().split('T')[0]
  calculateEndDate()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  if (searchTimer) clearTimeout(searchTimer)
})

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// Initialize weeks with first week as template
const initializeWeeks = () => {
  const weeks = []
  const dayNames = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  
  // Create first week (template)
  const firstWeekDays = dayNames.map((dayName, index) => ({
    dayNumber: index + 1,
    dayName: dayName,
    title: `روز ${index + 1}`,
    focus: '',
    duration: 60,
    notes: '',
    exercises: []
  }))
  
  const firstWeek = {
    weekNumber: 1,
    title: `هفته ۱`,
    focus: '',
    notes: '',
    days: firstWeekDays,
    isTemplate: true
  }
  
  weeks.push(firstWeek)
  
  // Create remaining weeks based on first week
  for (let weekNum = 2; weekNum <= form.durationWeeks; weekNum++) {
    // Deep clone the first week's days
    const clonedDays = firstWeekDays.map(day => ({
      ...day,
      exercises: [] // Start with empty exercises, will be filled when customizing
    }))
    
    weeks.push({
      weekNumber: weekNum,
      title: `هفته ${weekNum}`,
      focus: firstWeek.focus,
      notes: firstWeek.notes,
      days: clonedDays,
      customized: false // Flag to indicate if this week has been customized
    })
  }
  
  form.weeks = weeks
  selectedWeek.value = 1
}

// Handle duration change - rebuild weeks
const handleDurationChange = () => {
  calculateEndDate()
  
  // Keep first week's data if exists
  const firstWeek = form.weeks.length > 0 ? form.weeks[0] : null
  
  const weeks = []
  const dayNames = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  
  // Create or keep first week
  if (firstWeek) {
    weeks.push(firstWeek)
  } else {
    const firstWeekDays = dayNames.map((dayName, index) => ({
      dayNumber: index + 1,
      dayName: dayName,
      title: `روز ${index + 1}`,
      focus: '',
      duration: 60,
      notes: '',
      exercises: []
    }))
    
    weeks.push({
      weekNumber: 1,
      title: `هفته ۱`,
      focus: '',
      notes: '',
      days: firstWeekDays,
      isTemplate: true
    })
  }
  
  // Create or update remaining weeks
  for (let weekNum = 2; weekNum <= form.durationWeeks; weekNum++) {
    const existingWeek = form.weeks.find(w => w.weekNumber === weekNum)
    
    if (existingWeek && existingWeek.customized) {
      // Keep customized week
      weeks.push(existingWeek)
    } else {
      // Create new week based on first week
      const firstWeekDays = weeks[0].days.map(day => ({
        dayNumber: day.dayNumber,
        dayName: day.dayName,
        title: day.title,
        focus: '',
        duration: day.duration,
        notes: '',
        exercises: [] // Empty exercises for non-customized weeks
      }))
      
      weeks.push({
        weekNumber: weekNum,
        title: `هفته ${weekNum}`,
        focus: weeks[0].focus,
        notes: weeks[0].notes,
        days: firstWeekDays,
        customized: false
      })
    }
  }
  
  // Remove extra weeks if duration decreased
  if (form.weeks.length > form.durationWeeks) {
    form.weeks = weeks
  } else {
    form.weeks = weeks
  }
  
  // Reset selected week if out of range
  if (selectedWeek.value > form.durationWeeks) {
    selectedWeek.value = 1
  }
}
const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/40?text=No+Image'
}
// Fetch students from API
const fetchStudents = async () => {
  try {
    const response = await $fetch('/api/students')
    
    if (response.success) {
      students.value = response.students
      
      // Auto-select if only one student
      if (students.value.length === 1) {
        form.studentId = students.value[0].studentId
        await loadStudentInfo()
      }
    }
  } catch (err) {
    console.error('Error fetching students:', err)
    error.value = 'خطا در دریافت لیست شاگردان'
  }
}

// Load student info when selected
const loadStudentInfo = async () => {
  if (form.studentId) {
    selectedStudent.value = students.value.find(s => String(s.studentId) === String(form.studentId)) || null
    
    if (!selectedStudent.value) {
      error.value = 'شاگرد مورد نظر یافت نشد'
      setTimeout(() => {
        error.value = ''
      }, 3000)
    }
  } else {
    selectedStudent.value = null
  }
}

// Select a week to view/edit
const selectWeek = (weekNumber) => {
  selectedWeek.value = weekNumber
}

// Customize a specific week
const customizeWeek = (weekNumber) => {
  const week = form.weeks.find(w => w.weekNumber === weekNumber)
  if (week) {
    week.customized = true
    
    // Copy exercises from first week if they want to start from template
    if (weekNumber > 1 && form.weeks[0]) {
      const firstWeek = form.weeks[0]
      week.days.forEach((day, dayIndex) => {
        if (firstWeek.days[dayIndex]) {
          // Deep copy exercises from first week
          day.exercises = JSON.parse(JSON.stringify(firstWeek.days[dayIndex].exercises || []))
        }
      })
    }
    
    // Show success message
    successMessage.value = `هفته ${weekNumber} برای ویرایش فعال شد`
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  }
}

// Calculate end date based on start date and duration
const calculateEndDate = () => {
  if (form.startDate && form.durationWeeks) {
    const startDate = new Date(form.startDate)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + (form.durationWeeks * 7) - 1)
    form.endDate = endDate.toISOString().split('T')[0]
  }
}

// Get day name in Persian
const getDayName = (dayName) => {
  return persianDays[dayName] || dayName
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

// Get student name by ID
const getStudentName = (studentId) => {
  if (!studentId) return 'انتخاب نشده'
  const student = students.value.find(s => String(s.studentId) === String(form.studentId))
  return student ? student.fullName : 'نامشخص'
}

// ==================== EXERCISE API FUNCTIONS ====================
const loadAllExercises = async () => {
  try {
    searchLoading.value = true
    let allExercisesData = []
    let offset = 0
    const limit = 100
    
    while (true) {
      const response = await $fetch(`/api/exercises/search?q=a&limit=${limit}&offset=${offset}`)
      if (response.success && response.exercises.length > 0) {
        allExercisesData = [...allExercisesData, ...response.exercises]
        offset += limit
        
        // اگر تعداد حرکات کمتر از limit بود، یعنی به انتها رسیده‌ایم
        if (response.exercises.length < limit) {
          break
        }
      } else {
        break
      }
      
      // برای جلوگیری از حلقه بی‌نهایت
      if (offset > 2000) break
    }
    
    allExercises.value = allExercisesData
    console.log(`✅ ${allExercisesData.length} حرکت بارگذاری شد`)
    filterExercises()
  } catch (err) {
    console.error('Error loading exercises:', err)
  } finally {
    searchLoading.value = false
  }
}

const loadPopularExercises = async () => {
  try {
    // بارگذاری حرکات محبوب از دسته‌های مختلف
    const popularQueries = ['press', 'curl', 'squat', 'row', 'pull', 'push', 'fly', 'raise']
    let popularData = []
    
    for (const query of popularQueries) {
      const response = await $fetch(`/api/exercises/search?q=${query}&limit=20`)
      if (response.success) {
        popularData = [...popularData, ...response.exercises]
      }
    }
    
    // حذف موارد تکراری
    const uniqueExercises = []
    const seenIds = new Set()
    
    popularData.forEach(ex => {
      if (!seenIds.has(ex.exerciseId)) {
        seenIds.add(ex.exerciseId)
        uniqueExercises.push(ex)
      }
    })
    
    popularExercises.value = uniqueExercises.slice(0, 12)
    console.log(`✅ ${popularExercises.value.length} حرکت محبوب بارگذاری شد`)
  } catch (err) {
    console.error('Error loading popular exercises:', err)
  }
}

// تنظیم فیلتر سریع
const setQuickFilter = (filter) => {
  selectedQuickFilter.value = filter
  selectedCategory.value = 'all'
  selectedSubcategory.value = ''
  filterExercises()
}

// تنظیم دسته‌بندی
const setCategory = (category) => {
  selectedCategory.value = category
  selectedSubcategory.value = ''
  filterExercises()
}

// تنظیم زیرمجموعه
const setSubcategory = (sub) => {
  selectedSubcategory.value = sub
  selectedQuickFilter.value = 'all'
  filterExercises()
}

// پاک کردن فیلترها
const clearFilters = () => {
  selectedQuickFilter.value = 'all'
  selectedCategory.value = 'all'
  selectedSubcategory.value = ''
  exerciseSearchQuery.value = ''
  filterExercises()
}

// پاک کردن جستجو
const clearSearch = () => {
  exerciseSearchQuery.value = ''
  filterExercises()
}

// تغییر صفحه
const changePage = (page) => {
  if (page === '...') return
  currentPage.value = page
  // اسکرول به بالای نتایج
  document.querySelector('.results-section')?.scrollIntoView({ behavior: 'smooth' })
}

// فیلتر کردن تمرینات
const filterExercises = () => {
  let filtered = [...allExercises.value]

  // فیلتر بر اساس جستجو (با پشتیبانی از فارسی)
  if (exerciseSearchQuery.value) {
    const query = exerciseSearchQuery.value.toLowerCase()
    filtered = filtered.filter(ex => {
      // جستجو در نام انگلیسی
      if (ex.name.toLowerCase().includes(query)) return true
      
      // جستجو در عضلات هدف (ترجمه شده)
      if (ex.targetMuscles?.some(m => translateMuscle(m).toLowerCase().includes(query))) return true
      
      // جستجو در وسایل (ترجمه شده)
      if (ex.equipments?.some(e => translateEquipment(e).toLowerCase().includes(query))) return true
      
      // جستجو در بخش‌های بدن (ترجمه شده)
      if (ex.bodyParts?.some(b => translateBodyPart(b).toLowerCase().includes(query))) return true
      
      return false
    })
  }

  // فیلتر بر اساس دسته سریع (با پشتیبانی از فارسی)
  if (selectedQuickFilter.value !== 'all') {
    const filterMap = {
      'chest': ['سینه'],
      'back': ['پشت'],
      'legs': ['پا', 'جلو پا', 'پشت پا', 'باسن', 'ساق پا', 'ران'],
      'shoulders': ['سرشانه', 'دلتوئید'],
      'arms': ['بازو', 'جلو بازو', 'پشت بازو', 'ساعد'],
      'abs': ['شکم']
    }
    
    filtered = filtered.filter(ex => {
      const filterValue = selectedQuickFilter.value
      const targets = filterMap[filterValue] || [filterValue]
      
      return ex.targetMuscles?.some(m => {
        const translated = translateMuscle(m)
        return targets.some(t => translated.includes(t))
      }) || ex.bodyParts?.some(b => {
        const translated = translateBodyPart(b)
        return targets.some(t => translated.includes(t))
      })
    })
  }

  // فیلتر بر اساس دسته‌بندی اصلی و زیرمجموعه
  if (selectedCategory.value !== 'all' && selectedSubcategory.value) {
    filtered = filtered.filter(ex => {
      if (selectedCategory.value === 'muscle') {
        return ex.targetMuscles?.some(m => 
          translateMuscle(m).includes(selectedSubcategory.value)
        )
      } else if (selectedCategory.value === 'bodypart') {
        return ex.bodyParts?.some(b => 
          translateBodyPart(b).includes(selectedSubcategory.value)
        )
      } else if (selectedCategory.value === 'equipment') {
        return ex.equipments?.some(e => 
          translateEquipment(e).includes(selectedSubcategory.value)
        )
      }
      return true
    })
  }

  filteredExercises.value = filtered
  currentPage.value = 1 // بازگشت به صفحه اول بعد از فیلتر
  console.log(`🔍 ${filtered.length} حرکت پس از فیلتر`)
}

const searchExercises = async (reset = true) => {
  filterExercises()
  searchLoading.value = false
}

const debouncedSearchExercises = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    searchExercises(true)
  }, 300)
}

// ==================== EXERCISE MODAL FUNCTIONS ====================
const showExerciseSearch = (day) => {
  currentTargetDay.value = day
  showExerciseModal.value = true
  clearFilters()
  currentPage.value = 1
}

const closeExerciseModal = () => {
  showExerciseModal.value = false
  currentTargetDay.value = null
}

const syncExercisesToDatabase = async (exercises) => {
  try {
    const uniqueExercises = []
    const seenIds = new Set()
    
    // استخراج حرکات یکتا
    exercises.forEach(ex => {
      if (ex.exerciseId && !seenIds.has(ex.exerciseId)) {
        seenIds.add(ex.exerciseId)
        uniqueExercises.push({
          exerciseId: ex.exerciseId,
          name: ex.name,
          gifUrl: ex.gifUrl,
          targetMuscles: ex.targetMuscles || []
        })
      }
    })
    
    if (uniqueExercises.length === 0) return
    
    // ارسال به API برای همگام‌سازی
    const response = await $fetch('/api/exercises/sync', {
      method: 'POST',
      body: { exercises: uniqueExercises },
      headers: { 'Content-Type': 'application/json' }
    })
    
    console.log('Exercises synced:', response)
    
  } catch (err) {
    console.error('Error syncing exercises:', err)
  }
}

const selectExercise = (exercise) => {
  if (currentTargetDay.value) {
    // Add exercise to current day با نام قابل ویرایش
    currentTargetDay.value.exercises.push({
      exerciseId: exercise.exerciseId,
      name: exercise.name, // نام اصلی (برای مرجع)
      customName: exercise.name, // نام قابل ویرایش - اینجا مقداردهی اولیه میشه
      displayName: exercise.name, // نامی که نمایش داده میشه و کاربر می‌تونه ویرایش کنه
      description: exercise.instructions ? exercise.instructions[0] : '',
      sets: 3,
      reps: '10-12',
      restTime: '60-90 ثانیه',
      gifUrl: exercise.gifUrl,
      targetMuscles: exercise.targetMuscles,
      bodyParts: exercise.bodyParts,
      equipments: exercise.equipments
    })
    
    // Show success message
    successMessage.value = `حرکت "${exercise.name}" اضافه شد`
    setTimeout(() => { successMessage.value = '' }, 2000)
    
    // Auto-expand this day on mobile
    if (isMobile.value && currentTargetDay.value) {
      expandedDay.value = currentTargetDay.value.dayNumber
    }
  }
  
  closeExerciseModal()
}

// تابع برای بروزرسانی نام حرکت
const updateExerciseName = (exercise) => {
  // اینجا می‌تونی هر منطق اضافی که می‌خوای رو اضافه کنی
  console.log('Exercise name updated:', exercise.displayName)
}

const editExercise = (exercise) => {
  console.log('Edit exercise:', exercise)
}

// Remove exercise from a day
const removeExercise = (day, index) => {
  day.exercises.splice(index, 1)
}

// Toggle day expansion
const toggleDay = (dayNumber) => {
  expandedDay.value = expandedDay.value === dayNumber ? null : dayNumber
}

// Toggle week summary
const toggleWeekSummary = (weekNumber) => {
  expandedWeek.value = expandedWeek.value === weekNumber ? null : weekNumber
}

// Navigation between steps
const nextStep = () => {
  // Validate current step
  if (currentStep.value === 1) {
    if (!form.studentId || form.studentId === '') {
      error.value = 'لطفاً یک شاگرد انتخاب کنید'
      return
    }
    
    if (!form.title || form.title.trim() === '') {
      error.value = 'لطفاً عنوان برنامه را وارد کنید'
      return
    }
    
    if (!form.startDate || form.startDate === '') {
      error.value = 'لطفاً تاریخ شروع را انتخاب کنید'
      return
    }
    
    error.value = ''
    currentStep.value++
    
  } else if (currentStep.value === 2) {
    // Check if first week has exercises
    const firstWeek = form.weeks[0]
    let hasExercises = false
    
    for (const day of firstWeek.days) {
      if (day.exercises && day.exercises.length > 0) {
        hasExercises = true
        break
      }
    }
    
    if (!hasExercises) {
      error.value = 'حداقل یک حرکت برای هفته اول اضافه کنید'
      return
    }
    
    error.value = ''
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    error.value = ''
  }
}

// Form submission
const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const selectedStudentObj = students.value.find(s => String(s.studentId) === String(form.studentId))
    
    if (!selectedStudentObj) {
      error.value = 'شاگرد مورد نظر یافت نشد'
      loading.value = false
      return
    }
    
    // ========== STEP 1: جمع‌آوری و همگام‌سازی حرکات ==========
    const allExercises = []
    form.weeks.forEach(week => {
      week.days.forEach(day => {
        day.exercises.forEach(ex => {
          if (ex.exerciseId) {
            allExercises.push({
              exerciseId: ex.exerciseId,
              name: ex.name, // نام اصلی
              displayName: ex.displayName, // نام سفارشی
              gifUrl: ex.gifUrl,
              targetMuscles: ex.targetMuscles || [],
              bodyParts: ex.bodyParts || [],
              equipments: ex.equipments || [],
              instructions: ex.instructions || []
            })
          }
        })
      })
    })
    // اگر حرکتی وجود داشت، با API همگام‌سازی کن
    if (allExercises.length > 0) {
      try {
        const syncResponse = await $fetch('/api/exercises/sync', {
          method: 'POST',
          body: { exercises: allExercises },
          headers: { 'Content-Type': 'application/json' }
        })
        console.log('✅ Exercises synced:', syncResponse)
      } catch (syncErr) {
        console.error('⚠️ Error syncing exercises (continuing anyway):', syncErr)
      }
    }
    
    // ========== STEP 2: ایجاد برنامه تمرینی ==========
 const workoutData = {
      studentId: parseInt(selectedStudentObj.studentId),
      title: form.title,
      description: form.description || '',
      startDate: form.startDate,
      endDate: form.endDate,
      durationWeeks: parseInt(form.durationWeeks),
      weeks: form.weeks.map(week => ({
        ...week,
        days: week.days.map(day => ({
          ...day,
          exercises: day.exercises.map(ex => ({
            exerciseId: ex.exerciseId || null,
            name: ex.displayName || ex.name, // ⚠️ اینجا از displayName استفاده کن
            originalName: ex.name, // نام اصلی رو هم ذخیره کن (اختیاری)
            description: ex.description,
            sets: ex.sets,
            reps: ex.reps,
            restTime: ex.restTime,
            gifUrl: ex.gifUrl
          }))
        }))
      }))
    }
    
    console.log('📤 Submitting workout data:', JSON.stringify(workoutData, null, 2))
    
    const response = await $fetch('/api/workouts/create', {
      method: 'POST',
      body: workoutData,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.success) {
      successMessage.value = `برنامه "${form.title}" با موفقیت ایجاد شد!`
      
      setTimeout(() => {
        // Reset form
        form.studentId = ''
        form.title = ''
        form.description = ''
        form.durationWeeks = 4
        
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        form.startDate = tomorrow.toISOString().split('T')[0]
        calculateEndDate()
        
        initializeWeeks()
        selectedStudent.value = null
        successMessage.value = ''
        currentStep.value = 1
        selectedWeek.value = 1
        expandedDay.value = null
        expandedWeek.value = null
      }, 3000)
    }
    
  } catch (err) {
    console.error('❌ Error creating workout:', err)
    error.value = err.data?.statusMessage || 'خطا در ایجاد برنامه تمرینی'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.create-workout-page {
  direction: rtl;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

/* Page Header */
.page-header {
  margin-bottom: 2rem;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header-title h1 {
  color: #333;
  margin: 0 0 0.25rem 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.header-title p {
  color: #666;
  margin: 0;
  font-size: 1rem;
}

.back-button {
  width: 44px;
  height: 44px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:active {
  background: #f5f5f5;
  transform: scale(0.95);
}

.back-icon {
  font-size: 1.2rem;
}

.help-button {
  width: 44px;
  height: 44px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  color: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.help-button:active {
  background: #f5f5f5;
}

.help-icon {
  font-size: 1.2rem;
}

/* Progress Bar - Mobile */
.progress-bar-container {
  background: #f5f5f5;
  border-radius: 20px;
  padding: 0.5rem;
  margin-top: 1rem;
}

.progress-bar {
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e9ecef;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  transition: all 0.3s ease;
}

.progress-step.active .step-number {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.step-label {
  font-size: 0.7rem;
  color: #666;
}

.progress-step.active .step-label {
  color: #667eea;
  font-weight: 600;
}

/* Info Card */
.info-card {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border: 1px solid #90caf9;
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.info-icon {
  font-size: 1.3rem;
}

.info-header h4 {
  margin: 0;
  color: #1976d2;
  font-size: 1.1rem;
}

.info-content p {
  margin: 0 0 1rem 0;
  color: #444;
  line-height: 1.6;
}

.info-highlight {
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-right: 3px solid #1976d2;
}

.highlight-icon {
  font-size: 1.1rem;
}

.info-highlight span {
  color: #1976d2;
  font-size: 0.95rem;
}

/* Form Container */
.form-container {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #444;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f0f0f0;
}

.section-icon {
  font-size: 1.3rem;
}

.section-description {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.6;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 12px;
  border-right: 3px solid #667eea;
}

/* Form Card */
.form-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group.half {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
  font-size: 0.95rem;
}

.required-star {
  color: #f44336;
  margin-left: 0.25rem;
}

/* Input Wrappers */
.input-wrapper,
.select-wrapper,
.textarea-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon,
.select-icon,
.textarea-icon {
  position: absolute;
  right: 1rem;
  color: #999;
  font-size: 1rem;
  z-index: 1;
}

.textarea-icon {
  top: 1rem;
  transform: none;
}

.form-input {
  width: 100%;
  padding: 0.875rem 3rem 0.875rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input[readonly] {
  background: #f8f9fa;
  color: #666;
}

select.form-input {
  appearance: none;
  cursor: pointer;
  padding-left: 2.5rem;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: left 1rem center;
  background-size: 1em;
}

textarea.form-input {
  padding-top: 1rem;
  padding-bottom: 1rem;
  resize: vertical;
  min-height: 100px;
}

/* Persian Date Display */
.persian-date-display {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #fdfbfb 0%, #f8f9fa 100%);
  border: 2px solid #e9ecef;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #495057;
  direction: rtl;
}

.persian-icon {
  font-size: 1.1rem;
}

.persian-date {
  font-weight: 500;
  color: #667eea;
}

/* Student Info Card */
.student-info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 16px;
  margin-top: 1.5rem;
}

.student-info-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header-icon {
  font-size: 1.2rem;
}

.student-info-header h4 {
  margin: 0;
  font-size: 1.1rem;
}

.student-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.detail-label {
  font-size: 0.9rem;
  opacity: 0.9;
  min-width: 70px;
}

.detail-value {
  font-weight: 600;
  font-size: 0.95rem;
}

.detail-value.badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.2rem 0.75rem;
  border-radius: 20px;
}

/* Week Selector */
.week-selector {
  margin-bottom: 1.5rem;
  overflow-x: auto;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 16px;
}

.week-tabs {
  display: flex;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
}

.week-tab {
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  background: white;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  min-width: 90px;
}

.week-tab:hover {
  border-color: #667eea;
}

.week-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.week-tab.first-week {
  border-color: #4caf50;
  background: #e8f5e9;
  color: #2e7d32;
}

.week-tab.first-week.active {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  color: white;
}

.week-tab.repeated-week {
  border-color: #ff9800;
  background: #fff3e0;
  color: #e65100;
}

.week-tab.repeated-week.active {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
}

.week-number {
  font-weight: 600;
}

.week-badge {
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.05);
}

.week-badge.customized {
  background: #4caf50;
  color: white;
}

.week-badge.repeated {
  background: #ff9800;
  color: white;
}

/* Customize Notice */
.customize-notice {
  background: #fff3e0;
  border: 1px solid #ffb74d;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.notice-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #e65100;
}

.notice-icon {
  font-size: 1.2rem;
}

.notice-content p {
  margin: 0;
  font-size: 0.9rem;
}

.btn-customize {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-customize:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.customized-badge {
  background: #4caf50;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.badge-icon {
  font-size: 1.1rem;
}

/* Week Card */
.week-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.week-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.week-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.week-title h4 {
  margin: 0;
  color: #444;
  font-size: 1.2rem;
}

.week-tags {
  display: flex;
  gap: 0.5rem;
}

.week-badge-main {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.week-badge-custom {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.week-badge-repeat {
  background: #ff9800;
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.week-focus label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
  font-size: 0.9rem;
}

/* Days Container */
.days-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.day-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.25rem;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.day-title {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.day-title h5 {
  margin: 0;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
}

.day-exercises-count {
  color: #667eea;
  font-size: 0.8rem;
}

.day-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.day-duration {
  color: #666;
  font-size: 0.85rem;
  background: #f5f5f5;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

.expand-icon {
  color: #999;
  font-size: 0.9rem;
}

.day-content {
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid #f0f0f0;
}

/* Exercises Section */
.exercises-section {
  margin-top: 1.25rem;
}

.exercises-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.exercises-header h6 {
  margin: 0;
  color: #444;
  font-size: 0.95rem;
}

.btn-add-exercise {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #4caf50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add-exercise:active {
  transform: scale(0.97);
}

.btn-icon {
  font-size: 1rem;
}

/* Exercise Items */
.exercises-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.exercise-item {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1rem;
}

.exercise-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.exercise-number {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.85rem;
  flex-shrink: 0;
}

/* NEW: Exercise info styling */
.exercise-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  cursor: pointer;
}

.exercise-name {
  color: #333;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.exercise-has-gif {
  font-size: 0.9rem;
  background: #667eea;
  color: white;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.btn-remove {
  width: 28px;
  height: 28px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.btn-remove:active {
  transform: scale(0.9);
}

.exercise-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.detail-input {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-input label {
  color: #666;
  font-size: 0.7rem;
}

.small-input {
  padding: 0.5rem;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 0.85rem;
  width: 100%;
}

.exercise-notes {
  margin-top: 0.75rem;
}

.notes-input {
  width: 100%;
  padding: 0.6rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.85rem;
  resize: vertical;
}

.no-exercises {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #dee2e6;
}

.empty-icon {
  font-size: 2rem;
  opacity: 0.5;
}

.no-exercises p {
  color: #999;
  margin: 0;
  font-size: 0.9rem;
}

/* Review Summary */
.review-summary {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.summary-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 1.25rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #667eea;
}

.card-header h4 {
  margin: 0;
  color: #444;
  font-size: 1.1rem;
}

.badge-info {
  background: #667eea;
  color: white;
  padding: 0.2rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-right: auto;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0.5rem;
  background: white;
  border-radius: 8px;
}

.summary-row.description {
  flex-direction: column;
  gap: 0.5rem;
}

.summary-label {
  color: #666;
  font-size: 0.9rem;
}

.summary-value {
  color: #333;
  font-weight: 500;
  font-size: 0.95rem;
}

/* Weeks Summary */
.weeks-summary {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.week-summary-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.week-summary-item.customized-week {
  border-color: #4caf50;
  box-shadow: 0 0 0 1px #4caf50;
}

.week-summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  cursor: pointer;
}

.week-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.week-title {
  font-weight: 600;
  color: #333;
}

.week-type-badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.week-type-badge.primary {
  background: #667eea;
  color: white;
}

.week-type-badge.customized {
  background: #4caf50;
  color: white;
}

.week-type-badge.repeated {
  background: #ff9800;
  color: white;
}

.week-focus-tag {
  color: #667eea;
  font-size: 0.8rem;
  background: #eef2ff;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

.week-summary-days {
  padding: 1rem;
  border-top: 1px solid #e9ecef;
}

.day-summary-item {
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed #dee2e6;
}

.day-summary-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.day-summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.day-name {
  font-weight: 600;
  color: #444;
  font-size: 0.9rem;
}

.day-exercises {
  color: #667eea;
  font-size: 0.8rem;
  font-weight: 500;
}

.day-focus {
  color: #666;
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.exercise-preview {
  color: #888;
  font-size: 0.8rem;
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin-top: 0.25rem;
}

/* Navigation */
.form-navigation {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f0f0f0;
}

.step-indicator {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.step {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e9ecef;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.step.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: scale(1.1);
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.btn-primary,
.btn-secondary,
.btn-success {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
  border: 2px solid #e0e0e0;
}

.btn-success {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  color: white;
}

.btn-primary:active,
.btn-success:active {
  transform: scale(0.97);
}

.btn-primary:disabled,
.btn-success:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-success.loading {
  position: relative;
  color: transparent;
}

.btn-success.loading::after {
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn-icon {
  font-size: 1rem;
}

/* Help Modal */
.help-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.help-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.help-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid #f0f0f0;
}

.help-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.close-help {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  border-radius: 50%;
}

.help-body {
  padding: 1.25rem;
}

.help-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.help-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.help-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 50%;
}

.help-text {
  flex: 1;
}

.help-text strong {
  color: #333;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.25rem;
}

.help-text p {
  margin: 0;
  color: #666;
  font-size: 0.85rem;
  line-height: 1.5;
}

/* Messages */
.success-message,
.error-message {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 12px;
  margin-top: 1.5rem;
  animation: slideIn 0.3s ease;
}

.success-message {
  background: #e8f5e9;
  border: 1px solid #c8e6c9;
}

.error-message {
  background: #ffebee;
  border: 1px solid #ffcdd2;
}

.message-icon {
  font-size: 1.5rem;
}

.message-content {
  flex: 1;
}

.message-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.message-content p {
  margin: 0;
  font-size: 0.9rem;
}

.success-message h4 {
  color: #2e7d32;
}

.success-message p {
  color: #1b5e20;
}

.error-message h4 {
  color: #c62828;
}

.error-message p {
  color: #b71c1c;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ==================== EXERCISE SEARCH MODAL STYLES ==================== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 700px;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.modal-body {
  padding: 1.25rem;
}

/* Filter Tabs */
.filter-tabs {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.filter-tab {
  padding: 0.5rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 25px;
  background: white;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.filter-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

/* Category Tabs */
.category-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.category-tab {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  background: white;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

/* Subcategory Grid */
.subcategory-section {
  margin-bottom: 1.5rem;
}

.subcategory-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.subcategory-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 20px;
  background: white;
  color: #666;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.subcategory-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

/* Search Container */
.search-container {
  margin-bottom: 1.5rem;
  position: relative;
}

.clear-search {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
}

.clear-search:hover {
  background: #f0f0f0;
}

/* Results Section */
.results-section {
  margin-top: 1rem;
}

.results-count {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

/* Search Results */
.search-results {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.search-result-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-result-item:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.1);
}

.result-gif {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.result-gif img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.result-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.result-tag {
  background: #eef2ff;
  color: #667eea;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
}

.result-tag.muscle {
  background: #e8f5e9;
  color: #2e7d32;
}

.result-tag.equipment {
  background: #fff3e0;
  color: #e65100;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}

.no-results .empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.btn-clear {
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.btn-clear:hover {
  background: #e0e0e0;
}

/* Popular Section */
.popular-section {
  margin-top: 1rem;
}

.popular-section h4 {
  color: #444;
  margin-bottom: 1rem;
  font-size: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.popular-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
}

.popular-item {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 0.75rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.popular-item:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.popular-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.popular-item span {
  font-size: 0.8rem;
  color: #333;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Load More */
.load-more {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  padding: 1rem;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .create-workout-page {
    padding: 0.75rem;
  }

  .header-title h1 {
    font-size: 1.4rem;
  }

  .header-title p {
    font-size: 0.9rem;
  }

  .form-container {
    padding: 1.25rem;
  }

  .form-card {
    padding: 1.25rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .form-group.half {
    margin-bottom: 1.25rem;
  }

  .form-group.half:last-child {
    margin-bottom: 0;
  }

  .persian-date-display {
    padding: 0.4rem 0.75rem;
    font-size: 0.85rem;
  }

  .info-card {
    padding: 1rem;
  }

  .info-content p {
    font-size: 0.9rem;
  }

  .info-highlight {
    padding: 0.5rem;
  }

  .info-highlight span {
    font-size: 0.85rem;
  }

  .student-info-card {
    padding: 1.25rem;
  }

  .student-details {
    gap: 0.5rem;
  }

  .detail-row {
    flex-wrap: wrap;
  }

  .detail-label {
    min-width: 60px;
  }

  .week-tabs {
    flex-wrap: wrap;
  }

  .week-tab {
    min-width: 70px;
    padding: 0.5rem;
  }

  .customize-notice {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn-customize {
    width: 100%;
  }

  .week-card {
    padding: 1.25rem;
  }

  .week-title {
    flex-direction: column;
    align-items: flex-start;
  }

  .exercise-details {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .detail-input {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }

  .detail-input label {
    width: 70px;
    margin-bottom: 0;
  }

  .small-input {
    flex: 1;
  }

  .navigation-buttons {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary,
  .btn-success {
    width: 100%;
    min-width: auto;
  }

  .btn-secondary {
    order: 2;
  }

  .btn-primary {
    order: 1;
  }

  .btn-success {
    order: 1;
  }

  .success-message,
  .error-message {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }

  /* Modal mobile styles */
  .modal-content {
    max-height: 90vh;
  }

  .filter-tabs {
    flex-wrap: wrap;
  }

  .filter-tab {
    flex: 1;
    text-align: center;
  }

  .category-tabs {
    flex-direction: column;
  }

  .subcategory-grid {
    justify-content: center;
  }

  .result-gif {
    width: 60px;
    height: 60px;
  }

  .popular-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .exercise-info {
    min-width: auto;
    max-width: calc(100% - 40px);
  }
}

/* Small Mobile Styles */
@media (max-width: 480px) {
  .header-top {
    gap: 0.5rem;
  }

  .back-button,
  .help-button {
    width: 40px;
    height: 40px;
  }

  .form-container {
    padding: 1rem;
  }

  .form-card {
    padding: 1rem;
  }

  .week-card {
    padding: 1rem;
  }

  .day-card {
    padding: 1rem;
  }

  .exercise-header {
    flex-wrap: wrap;
  }

  .exercise-name-input {
    width: 100%;
    margin-top: 0.5rem;
  }

  .btn-remove {
    position: absolute;
    left: 0.5rem;
    top: 0.5rem;
  }

  .exercise-item {
    position: relative;
    padding-top: 1.5rem;
  }

  .exercise-number {
    position: absolute;
    top: -0.5rem;
    right: -0.5rem;
  }

  .modal-header {
    padding: 1rem;
  }

  .modal-body {
    padding: 1rem;
  }

  .result-gif {
    width: 50px;
    height: 50px;
  }

  .result-name {
    font-size: 0.9rem;
  }

  .result-tag {
    font-size: 0.65rem;
  }
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  .back-button,
  .help-button,
  .btn-primary,
  .btn-secondary,
  .btn-success,
  .btn-add-exercise,
  .week-tab,
  .day-header,
  .filter-tab,
  .category-tab,
  .subcategory-btn {
    min-height: 48px;
  }

  .form-input,
  select.form-input,
  .exercise-name-input,
  .small-input,
  .notes-input {
    font-size: 16px;
  }
}

/* RTL Support */
[dir="rtl"] .input-icon,
[dir="rtl"] .select-icon,
[dir="rtl"] .textarea-icon {
  right: 1rem;
  left: auto;
}

[dir="rtl"] .form-input {
  padding: 0.875rem 3rem 0.875rem 1rem;
}

[dir="rtl"] select.form-input {
  background-position: left 1rem center;
  padding-left: 2.5rem;
  padding-right: 3rem;
}

[dir="rtl"] .btn-icon {
  transform: scaleX(-1);
}

[dir="rtl"] .expand-icon {
  transform: scaleX(-1);
}

[dir="rtl"] .exercise-number {
  right: -0.5rem;
  left: auto;
}

[dir="rtl"] .btn-remove {
  left: 0.5rem;
  right: auto;
}

[dir="rtl"] .clear-search {
  left: 1rem;
  right: auto;
}

/* Safe Area Support */
@supports (padding: max(0px)) {
  .create-workout-page {
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }

  .help-content {
    margin-bottom: env(safe-area-inset-bottom);
  }

  .modal-content {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .progress-bar,
  .btn-primary,
  .btn-success,
  .btn-add-exercise,
  .help-content,
  .search-result-item,
  .popular-item,
  .spinner {
    animation: none;
    transition: none;
  }
}
/* Exercise Items - با thumbnail */
.exercises-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.exercise-item {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1rem;
}

.exercise-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.exercise-number {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.85rem;
  flex-shrink: 0;
}

/* thumbnail جدید */
.exercise-thumbnail {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  border: 2px solid #e9ecef;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.exercise-thumbnail:hover {
  border-color: #667eea;
  transform: scale(1.05);
}

.exercise-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.exercise-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  cursor: pointer;
}

.exercise-name {
  color: #333;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-remove {
  width: 28px;
  height: 28px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.9rem;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.btn-remove:hover {
  background: #ff5252;
  transform: scale(1.1);
}

.btn-remove:active {
  transform: scale(0.9);
}

/* responsive برای موبایل */
@media (max-width: 768px) {
  .exercise-thumbnail {
    width: 35px;
    height: 35px;
  }
  
  .exercise-name {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .exercise-header {
    flex-wrap: wrap;
    position: relative;
    padding-top: 0.5rem;
  }
  
  .exercise-number {
    position: absolute;
    top: -0.25rem;
    right: -0.25rem;
    width: 24px;
    height: 24px;
    font-size: 0.75rem;
  }
  
  .exercise-thumbnail {
    width: 45px;
    height: 45px;
    margin-right: 0.5rem;
  }
  
  .btn-remove {
    position: absolute;
    left: 0.25rem;
    top: 0.25rem;
    width: 24px;
    height: 24px;
    font-size: 0.8rem;
  }
  
  .exercise-info {
    width: calc(100% - 60px);
    margin-right: 50px;
  }
}
/* Exercise name wrapper */
.exercise-name-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.exercise-name-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
  background: white;
  transition: all 0.3s ease;
}

.exercise-name-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.exercise-name-input::placeholder {
  color: #999;
  font-style: italic;
}

.exercise-original-name {
  font-size: 0.7rem;
  color: #888;
  padding-right: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Exercise meta info */
.exercise-meta {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px dashed #dee2e6;
  font-size: 0.7rem;
  color: #888;
}

/* تنظیمات responsive */
@media (max-width: 768px) {
  .exercise-name-input {
    font-size: 0.9rem;
    padding: 0.4rem 0.6rem;
  }
  
  .exercise-original-name {
    font-size: 0.65rem;
  }
}

@media (max-width: 480px) {
  .exercise-name-wrapper {
    width: calc(100% - 80px);
    margin-right: 45px;
  }
  
  .exercise-name-input {
    font-size: 0.85rem;
  }
}
</style>