
export default defineEventHandler(async (event) => {
  try {
    // یه پاسخ ساده برگردون
    return {
      status: 'ok',
      message: 'TrainMatePro API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }
  } catch (error) {
    console.error('Health check error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
