
export default defineEventHandler(async (event) => {
  // Get authentication token from cookie
  const authToken = getCookie(event, 'trainmate-auth')
  
  console.log('Auth token from cookie:', authToken)
  
  // Check if auth token exists
  if (!authToken) {
    console.log('No auth token found')
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated'
    })
  }
  
  try {
    // Parse session data from token
    const session = JSON.parse(authToken)
    console.log('Session data from cookie:', session)
    
    // Get user data from database to ensure it's still valid
    const { User } = await import('../../models/index.js')
    const user = await User.findByPk(session.userId)
    
    if (!user) {
      console.log('User not found in database:', session.userId)
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found'
      })
    }
    
    // Return complete user data
    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        department: user.department
      }
    }
    
  } catch (error) {
    console.error('Error in /api/auth/me:', error)
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid session'
    })
  }

})