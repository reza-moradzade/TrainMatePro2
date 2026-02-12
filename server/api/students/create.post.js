
import { User, Student } from '../../models/index.js'

export default defineEventHandler(async (event) => {
  try {
    // Check if user is authenticated and is a coach
    const authToken = getCookie(event, 'trainmate-auth')
    if (!authToken) {
      throw createError({
        statusCode: 401,
        statusMessage: 'لطفاً ابتدا وارد شوید'
      })
    }
    
    const session = JSON.parse(authToken)
    if (session.role !== 'coach') {
      throw createError({
        statusCode: 403,
        statusMessage: 'فقط مربیان می‌توانند شاگرد ایجاد کنند'
      })
    }
    
    const body = await readBody(event)
    
    // Validate required fields
    const { email, password, fullName } = body
    if (!email || !password || !fullName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ایمیل، رمز عبور و نام کامل الزامی است'
      })
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'این ایمیل قبلاً ثبت شده است'
      })
    }
    
    // Create student user
    const studentUser = await User.create({
      email,
      password,
      fullName,
      role: 'student',
      coachId: session.userId,
      department: body.department || 'ورزشکار'
    })
    
    // Create student profile
    const studentProfile = await Student.create({
      userId: studentUser.id,
      age: body.age || null,
      gender: body.gender || null,
      height: body.height || null,
      weight: body.weight || null,
      fitnessLevel: body.fitnessLevel || 'beginner',
      goals: body.goals || '',
      notes: body.notes || ''
    })
    
    console.log('New student created by coach:', session.email, 'Student:', email)
    
    return {
      success: true,
      message: 'شاگرد با موفقیت ایجاد شد',
      student: {
        id: studentUser.id,
        email: studentUser.email,
        fullName: studentUser.fullName,
        profile: studentProfile
      }
    }
    
  } catch (error) {
    console.error('Error creating student:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'خطا در ایجاد شاگرد'
    })
  }

})