<template>
  <div>
    <!-- Navbar - Responsive -->
    <nav class="navbar" v-if="!$route.path.includes('/dashboard') && !$route.path.includes('/student-dashboard')">
      <div class="nav-container">
        <NuxtLink to="/" class="logo">
          <span class="logo-icon">💪</span>
          <span class="logo-text">TrainMate Pro</span>
        </NuxtLink>
        
        <!-- Mobile Menu Button -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu" v-if="isMobile">
          <span class="menu-icon" :class="{ 'active': mobileMenuOpen }">☰</span>
        </button>
        
        <!-- Navigation Links - Desktop -->
        <div class="nav-links" :class="{ 'mobile-open': mobileMenuOpen }" v-if="!isMobile || mobileMenuOpen">
          <NuxtLink to="/" class="nav-link" @click="closeMobileMenu">ورود</NuxtLink>
        </div>
      </div>
    </nav>
    
    <NuxtPage />
  </div>
</template>

<script setup>
// Mobile menu state
const mobileMenuOpen = ref(false)
const isMobile = ref(false)

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// Toggle mobile menu
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// Close mobile menu
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// Handle resize
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style>
/* Reset & Base Styles - Mobile First */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent; /* Remove tap highlight on mobile */
}

html {
  font-size: 16px; /* Base font size */
  -webkit-text-size-adjust: 100%; /* Prevent font scaling on mobile */
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  direction: rtl;
  background: #f8f9fa;
  overflow-x: hidden; /* Prevent horizontal scroll */
}

/* Responsive Navbar */
.navbar {
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0.75rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
}

.nav-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #667eea;
  font-weight: bold;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  font-size: 1.25rem;
}

@media (max-width: 480px) {
  .logo-text {
    font-size: 1.1rem;
  }
  
  .logo-icon {
    font-size: 1.25rem;
  }
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.mobile-menu-btn:hover {
  background-color: #f5f5f5;
}

.menu-icon {
  font-size: 1.5rem;
  color: #333;
  transition: transform 0.3s ease;
}

.menu-icon.active {
  transform: rotate(90deg);
}

/* Navigation Links - Desktop */
.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  color: #333;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  white-space: nowrap;
}

.nav-link:hover {
  background-color: #f5f5f5;
  color: #667eea;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: block;
  }
  
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    padding: 1rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 0 0 12px 12px;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 999;
  }
  
  .nav-links.mobile-open {
    display: flex;
  }
  
  .nav-link {
    width: 100%;
    text-align: center;
    padding: 0.75rem;
    border-radius: 8px;
  }
  
  .nav-link:active {
    background-color: #667eea;
    color: white;
  }
}

/* Utility Classes for Responsive Design */
.hide-on-mobile {
  @media (max-width: 768px) {
    display: none !important;
  }
}

.hide-on-desktop {
  @media (min-width: 769px) {
    display: none !important;
  }
}

/* RTL Support for Mobile */
[dir="rtl"] .nav-links {
  @media (max-width: 768px) {
    left: auto;
    right: 0;
  }
}

/* Touch-friendly improvements */
button, 
.nav-link,
.action-item,
.stat-card {
  min-height: 44px; /* Minimum touch target size */
  min-width: 44px;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Better font rendering */
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Container max-width for all pages */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Responsive typography */
h1 {
  font-size: 2rem;
}

h2 {
  font-size: 1.5rem;
}

h3 {
  font-size: 1.25rem;
}

p {
  font-size: 1rem;
}

@media (max-width: 768px) {
  h1 {
    font-size: 1.5rem;
  }
  
  h2 {
    font-size: 1.25rem;
  }
  
  h3 {
    font-size: 1.1rem;
  }
  
  p {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.25rem;
  }
  
  h2 {
    font-size: 1.1rem;
  }
  
  .container {
    padding: 0 0.75rem;
  }
}

/* Grid System - Mobile First */
.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -0.5rem;
}

.col {
  flex: 1;
  padding: 0 0.5rem;
}

/* Responsive images */
img {
  max-width: 100%;
  height: auto;
}

/* Hide scrollbar for mobile but keep functionality */
@media (max-width: 768px) {
  ::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
}

/* Loading states */
.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Fade animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide animations */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Card styles for mobile */
.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .card {
    padding: 1rem;
    border-radius: 8px;
  }
}

/* Button styles for mobile */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:active {
  opacity: 0.9;
  transform: scale(0.98);
}

@media (max-width: 768px) {
  .btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.95rem;
    width: 100%; /* Full width buttons on mobile */
  }
}

/* Form styles for mobile */
.form-group {
  margin-bottom: 1rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  min-height: 44px;
}

@media (max-width: 768px) {
  .form-input {
    padding: 0.7rem;
    font-size: 16px; /* Prevent zoom on mobile */
  }
}

/* Alert messages */
.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.alert-success {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.alert-error {
  background: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}

.alert-warning {
  background: #fff3e0;
  color: #ef6c00;
  border: 1px solid #ffe0b2;
}

/* Print styles */
@media print {
  .navbar,
  .mobile-menu-btn,
  .btn,
  .no-print {
    display: none !important;
  }
  
  body {
    background: white;
  }
  
  .card {
    box-shadow: none;
    border: 1px solid #ddd;
  }
}
</style>