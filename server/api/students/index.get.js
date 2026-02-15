import { Student, User } from '../../models/index.js'

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
    
    console.log('Fetching students for coach:', session.userId)
    
    if (session.role !== 'coach') {
      throw createError({
        statusCode: 403,
        statusMessage: 'فقط مربیان می‌توانند شاگردان را مشاهده کنند'
      })
    }
    
    // Get coach's students
    const students = await User.findAll({
      where: {
        coachId: session.userId,
        role: 'student'
      },
      include: [{
        model: Student,
        required: false
      }],
      order: [['createdAt', 'DESC']]
    })
    
    console.log(`Found ${students.length} students for coach ${session.userId}`)
    
    // Return both userId and studentId for flexibility
    return {
      success: true,
      students: students.map(student => ({
        userId: student.id,                    // User ID (برای API لاگین)
        studentId: student.Student ? student.Student.id : null, // Student Profile ID (برای برنامه‌ها)
        email: student.email,
        fullName: student.fullName,
        department: student.department,
        createdAt: student.createdAt,
        age: student.Student ? student.Student.age : null,
        gender: student.Student ? student.Student.gender : null,
        height: student.Student ? student.Student.height : null,
        weight: student.Student ? student.Student.weight : null,
        fitnessLevel: student.Student ? student.Student.fitnessLevel : 'beginner',
        goals: student.Student ? student.Student.goals : '',
        notes: student.Student ? student.Student.notes : ''
      }))
    }
    
  } catch (error) {
    console.error('Error fetching students:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'خطا در دریافت لیست شاگردان'
    })
  }
})