// سرویس برای ارتباط با ExerciseDB API
//const EXERCISE_API_URL = process.env.EXERCISE_API_URL || 'http://localhost:3001/api/v1'
//const EXERCISE_API_URL = process.env.EXERCISE_API_URL || 'https://exercise-api-production-1e19.up.railway.app/api/v1'

const config = useRuntimeConfig()
const EXERCISE_API_URL = config.exerciseApiUrl

export class ExerciseApiService {
  
  // جستجوی حرکات
  async searchExercises(query, offset = 0, limit = 20) {
    try {
      const url = `${EXERCISE_API_URL}/exercises/search?q=${encodeURIComponent(query)}&offset=${offset}&limit=${limit}`
      const response = await $fetch(url)
      
      if (response.success) {
        return {
          exercises: response.data,
          metadata: response.metadata
        }
      }
      return { exercises: [], metadata: null }
    } catch (error) {
      console.error('Error searching exercises:', error)
      return { exercises: [], metadata: null }
    }
  }

  // دریافت حرکت با ID
  async getExerciseById(exerciseId) {
    try {
      const url = `${EXERCISE_API_URL}/exercises/${exerciseId}`
      const response = await $fetch(url)
      
      if (response.success) {
        return response.data
      }
      return null
    } catch (error) {
      console.error('Error fetching exercise by ID:', error)
      return null
    }
  }

  // دریافت حرکات با فیلتر
  async filterExercises(filters = {}, offset = 0, limit = 20) {
    try {
      let url = `${EXERCISE_API_URL}/exercises/filter?offset=${offset}&limit=${limit}`
      
      if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`
      if (filters.muscles) url += `&muscles=${encodeURIComponent(filters.muscles)}`
      if (filters.equipment) url += `&equipment=${encodeURIComponent(filters.equipment)}`
      if (filters.bodyParts) url += `&bodyParts=${encodeURIComponent(filters.bodyParts)}`
      
      const response = await $fetch(url)
      
      if (response.success) {
        return {
          exercises: response.data,
          metadata: response.metadata
        }
      }
      return { exercises: [], metadata: null }
    } catch (error) {
      console.error('Error filtering exercises:', error)
      return { exercises: [], metadata: null }
    }
  }

  // دریافت حرکات بر اساس عضله هدف
  async getExercisesByMuscle(muscleName, includeSecondary = false, offset = 0, limit = 20) {
    try {
      const url = `${EXERCISE_API_URL}/muscles/${encodeURIComponent(muscleName)}/exercises?offset=${offset}&limit=${limit}&includeSecondary=${includeSecondary}`
      const response = await $fetch(url)
      
      if (response.success) {
        return {
          exercises: response.data,
          metadata: response.metadata
        }
      }
      return { exercises: [], metadata: null }
    } catch (error) {
      console.error('Error fetching exercises by muscle:', error)
      return { exercises: [], metadata: null }
    }
  }

  // دریافت حرکات بر اساس وسیله
  async getExercisesByEquipment(equipmentName, offset = 0, limit = 20) {
    try {
      const url = `${EXERCISE_API_URL}/equipments/${encodeURIComponent(equipmentName)}/exercises?offset=${offset}&limit=${limit}`
      const response = await $fetch(url)
      
      if (response.success) {
        return {
          exercises: response.data,
          metadata: response.metadata
        }
      }
      return { exercises: [], metadata: null }
    } catch (error) {
      console.error('Error fetching exercises by equipment:', error)
      return { exercises: [], metadata: null }
    }
  }

  // دریافت حرکات بر اساس بخش بدن
  async getExercisesByBodyPart(bodyPartName, offset = 0, limit = 20) {
    try {
      const url = `${EXERCISE_API_URL}/bodyparts/${encodeURIComponent(bodyPartName)}/exercises?offset=${offset}&limit=${limit}`
      const response = await $fetch(url)
      
      if (response.success) {
        return {
          exercises: response.data,
          metadata: response.metadata
        }
      }
      return { exercises: [], metadata: null }
    } catch (error) {
      console.error('Error fetching exercises by body part:', error)
      return { exercises: [], metadata: null }
    }
  }

  // تبدیل داده API به فرمت مناسب برای ذخیره در دیتابیس
  mapExerciseToDbFormat(apiExercise) {
    return {
      exerciseId: apiExercise.exerciseId,
      name: apiExercise.name,
      gifUrl: apiExercise.gifUrl,
      targetMuscles: apiExercise.targetMuscles,
      bodyParts: apiExercise.bodyParts,
      equipments: apiExercise.equipments,
      secondaryMuscles: apiExercise.secondaryMuscles || [],
      instructions: apiExercise.instructions || []
    }
  }
}
