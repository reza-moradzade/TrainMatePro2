
<template>
  <div class="home-page">
    <div class="page-header">
      <h1>👋 سلام، {{ userName }} عزیز</h1>
      <p>به پنل مربی سیستم مدیریت تمرین خوش آمدید</p>
    </div>

    <div class="welcome-card">
      <div class="welcome-icon">💪</div>
      <div class="welcome-content">
        <h3>آماده‌اید برنامه تمرینی ایجاد کنید؟</h3>
        <p>در این پنل می‌توانید برای شاگردان خود برنامه تمرینی ایجاد و مدیریت کنید.</p>
        <p class="coming-soon">🚧 این بخش به زودی فعال می‌شود...</p>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <h3>۰</h3>
          <p>تعداد شاگردان</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-info">
          <h3>۰</h3>
          <p>برنامه‌های فعال</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-info">
          <h3>۰</h3>
          <p>تمرینات تکمیل شده</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📝</div>
        <div class="stat-info">
          <h3>۰</h3>
          <p>یادداشت‌ها</p>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <div class="section-card">
        <h2>🔧 دسترسی‌های مربی</h2>
        <div class="actions-list">
          <div class="action-item" @click="showComingSoon">
            <div class="action-icon">➕</div>
            <div class="action-content">
              <p class="action-title">ایجاد برنامه جدید</p>
              <p class="action-desc">برنامه تمرینی جدید برای شاگردان</p>
            </div>
          </div>
          
          <div class="action-item" @click="showComingSoon">
            <div class="action-icon">👤</div>
            <div class="action-content">
              <p class="action-title">مدیریت شاگردان</p>
              <p class="action-desc">افزودن یا حذف شاگرد</p>
            </div>
          </div>
          
          <div class="action-item" @click="showComingSoon">
            <div class="action-icon">📋</div>
            <div class="action-content">
              <p class="action-title">مشاهده گزارشات</p>
              <p class="action-desc">گزارش پیشرفت شاگردان</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// User name
const userName = ref('مربی')

// Fetch user data on component mount
onMounted(async () => {
  try {
    const response = await $fetch('/api/auth/me')
    if (response.user) {
      userName.value = response.user.fullName
    }
  } catch (error) {
    console.error('Failed to fetch user data:', error)
  }
})

// Show coming soon message
const showComingSoon = () => {
  alert('این بخش به زودی فعال خواهد شد!')
}
</script>

<style scoped>
.home-page {
  direction: rtl;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.welcome-icon {
  font-size: 3rem;
}

.welcome-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.welcome-content p {
  margin: 0.25rem 0;
  opacity: 0.9;
}

.coming-soon {
  margin-top: 1rem !important;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  border-radius: 8px;
  display: inline-block;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2rem;
}

.stat-info h3 {
  font-size: 1.8rem;
  margin: 0;
  color: #333;
}

.stat-info p {
  margin: 0.25rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
}

.quick-actions {
  margin-bottom: 2rem;
}

.section-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-card h2 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.3rem;
}

.actions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid #f0f0f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-item:hover {
  background: #f8f9fa;
  border-color: #667eea;
  transform: translateX(-5px);
}

.action-icon {
  font-size: 1.5rem;
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 10px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-content {
  flex: 1;
}

.action-title {
  margin: 0;
  color: #333;
  font-weight: 600;
  font-size: 1.1rem;
}

.action-desc {
  margin: 0.25rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
}
</style>