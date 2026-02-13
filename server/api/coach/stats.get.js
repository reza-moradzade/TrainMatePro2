import { User, Student, WorkoutProgram } from '../../models/index.js'

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
        statusMessage: 'فقط مربیان می‌توانند آمار را مشاهده کنند'
      })
    }
    
    const coachId = session.userId
    
    // 1. Get students count
    const studentsCount = await User.count({
      where: {
        coachId: coachId,
        role: 'student'
      }
    })
    
    // 2. Get active workout programs count
    // First get all students of this coach
    const students = await User.findAll({
      where: {
        coachId: coachId,
        role: 'student'
      },
      attributes: ['id']
    })
    
    const studentIds = students.map(s => s.id)
    
    // Get student profiles
    const studentProfiles = await Student.findAll({
      where: {
        userId: studentIds
      },
      attributes: ['id']
    })
    
    const studentProfileIds = studentProfiles.map(s => s.id)
    
    // Count active programs for these students
    const activeProgramsCount = await WorkoutProgram.count({
      where: {
        studentId: studentProfileIds,
        status: 'active'
      }
    })
    
    // 3. Get completed workouts count (for demo purposes)
    // In a real app, you'd have a completed_workouts table or field
    const completedWorkoutsCount = 0 // Placeholder
    
    // 4. Get notes count (for demo purposes)
    const notesCount = 0 // Placeholder
    
    return {
      success: true,
      stats: {
        studentsCount,
        activeProgramsCount,
        completedWorkoutsCount,
        notesCount
      }
    }
    
  } catch (error) {
    console.error('Error fetching coach stats:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'خطا در دریافت آمار'
    })
  }
})