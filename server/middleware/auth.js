
export default defineEventHandler(async (event) => {
  // Skip auth for public routes
  if (event.path.startsWith('/api/auth/') || event.path === '/api/init') {
    return
  }
  
  // Only check auth for API routes
  if (!event.path.startsWith('/api/')) {
    return
  }
  
  const authToken = getCookie(event, 'trainmate-auth')
  
  if (!authToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'لطفاً ابتدا وارد شوید'
    })
  }
  
  try {
    const session = JSON.parse(authToken)
    event.context.user = session
    
    // Check role for coach-specific routes
    if (event.path.startsWith('/api/coach/') && session.role !== 'coach') {
      throw createError({
        statusCode: 403,
        statusMessage: 'شما دسترسی به این بخش را ندارید'
      })
    }
    
  } catch (error) {
    if (error.statusCode === 403) {
      throw error
    }
    throw createError({
      statusCode: 401,
      statusMessage: 'سشن نامعتبر است'
    })
  }
})