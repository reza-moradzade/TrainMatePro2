import { ExerciseRef } from '../../models/index.js'

export default defineEventHandler(async (event) => {
  try {
    const authToken = getCookie(event, 'trainmate-auth')
    if (!authToken) {
      throw createError({
        statusCode: 401,
        statusMessage: 'لطفاً ابتدا وارد شوید'
      })
    }

    const body = await readBody(event)
    const { exercises } = body

    if (!exercises || !Array.isArray(exercises)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'لیست حرکات الزامی است'
      })
    }

    const results = []
    
    for (const ex of exercises) {
      // بررسی وجود
      let exerciseRef = await ExerciseRef.findOne({
        where: { exerciseId: ex.exerciseId }
      })
      
      if (!exerciseRef) {
        // اگر نبود، ایجاد کن
        exerciseRef = await ExerciseRef.create({
          exerciseId: ex.exerciseId,
          name: ex.name,
          gifUrl: ex.gifUrl,
          targetMuscles: ex.targetMuscles || [],
          bodyParts: ex.bodyParts || [],
          equipments: ex.equipments || [],
          secondaryMuscles: ex.secondaryMuscles || [],
          instructions: ex.instructions || []
        })
        results.push({ exerciseId: ex.exerciseId, status: 'created' })
      } else {
        results.push({ exerciseId: ex.exerciseId, status: 'already_exists' })
      }
    }

    return {
      success: true,
      results
    }

  } catch (error) {
    console.error('Error syncing exercises:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'خطا در همگام‌سازی حرکات'
    })
  }
})