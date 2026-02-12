
<template>
  <div class="main-content">
    <div class="content-area">
      <component :is="currentComponent" @menu-changed="handleMenuChange" />
    </div>
  </div>
</template>

<script setup>
// Import page components
import HomePage from './HomePage.vue'
import StudentsList from './StudentsList.vue'
import AddStudent from './AddStudent.vue'
import WorkoutPrograms from './WorkoutPrograms.vue'
import CreateWorkout from './CreateWorkout.vue'

// Define available page components
const components = {
  home: HomePage,
  students: StudentsList,
  'add-student': AddStudent,
  'workouts': WorkoutPrograms,
  'create-workout': CreateWorkout,
}

// Props from parent component
const props = defineProps({
  activeMenu: {
    type: String,
    default: 'home'
  }
})

// Emit for parent component
const emit = defineEmits(['menu-changed'])

// Current component based on selected menu
const currentComponent = computed(() => {
  return components[props.activeMenu] || HomePage
})

// Handle menu change from child components
const handleMenuChange = (menuId) => {
  emit('menu-changed', menuId)
}
</script>

<style scoped>
.main-content {
  flex: 1;
  background: #f8f9fa;
  height: 100vh;
  overflow-y: auto;
}

.content-area {
  padding: 2rem;
  height: 100%;
}

</style>