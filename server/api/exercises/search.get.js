import { ExerciseApiService } from '../../services/exerciseApi.service.js'

const exerciseApi = new ExerciseApiService()

export default defineEventHandler(async (event) => {
  try {
    // Check authentication
    const authToken = getCookie(event, 'trainmate-auth')
    if (!authToken) {
      throw createError({
        statusCode: 401,
        statusMessage: 'لطفاً ابتدا وارد شوید'
      })
    }

    const query = getQuery(event)
    const { q, offset = 0, limit = 20 } = query

    if (!q) {
      throw createError({
        statusCode: 400,
        statusMessage: 'عبارت جستجو الزامی است'
      })
    }

    const result = await exerciseApi.searchExercises(q, parseInt(offset), parseInt(limit))

    return {
      success: true,
      ...result
    }

  } catch (error) {
    console.error('Error searching exercises:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'خطا در جستجوی حرکات'
    })
  }
})