
import { User } from '../../models/index.js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  try {
    const { email, password } = body
    
    console.log('Login attempt for:', email)
    
    // Find user by email
    const user = await User.findOne({ where: { email } })
    
    if (!user) {
      console.log('User not found:', email)
      throw createError({
        statusCode: 401,
        statusMessage: 'ایمیل یا رمز عبور اشتباه است'
      })
    }
    
    console.log('User found:', user.email, 'Role:', user.role)
    
    // Check password using bcrypt
    const isValidPassword = await user.comparePassword(password)
    
    if (!isValidPassword) {
      console.log('Invalid password for:', email)
      throw createError({
        statusCode: 401,
        statusMessage: 'ایمیل یا رمز عبور اشتباه است'
      })
    }
    
    // Create session object
   const session = {
  userId: user.id,  // این باید number باشه
  email: user.email,
  fullName: user.fullName,
  role: user.role,
  department: user.department
}
    
    // Set authentication cookie
    setCookie(event, 'trainmate-auth', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60, // 24 hours
      sameSite: 'strict'
    })
    
    console.log('Login successful for:', email, 'Role:', user.role)
    
    // Return success response
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        department: user.department
      }
    }
    
  } catch (error) {
    console.error('Login error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'خطای سرور'
    })
  }
})