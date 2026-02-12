
import { WorkoutProgram, WorkoutWeek, WorkoutDay, Exercise, Student, User } from '../../models/index.js'

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
        statusMessage: 'فقط مربیان می‌توانند برنامه تمرینی ایجاد کنند'
      })
    }
    
    const body = await readBody(event)
    
    // Validate required fields
    const { studentId, title, startDate, endDate, durationWeeks, weeks } = body
    
    if (!studentId || !title || !startDate || !endDate || !durationWeeks || !weeks) {
      throw createError({
        statusCode: 400,
        statusMessage: 'پر کردن تمام فیلدهای الزامی ضروری است'
      })
    }
    
    // Check if student exists and belongs to this coach
// Check if student exists and belongs to this coach - FIXED
const studentUser = await User.findOne({
  where: { 
    id: studentId,
    coachId: session.userId,
    role: 'student'
  }
})

if (!studentUser) {
  throw createError({
    statusCode: 404,
    statusMessage: 'شاگرد مورد نظر یافت نشد یا به شما تعلق ندارد'
  })
}

// Get student profile
const student = await Student.findOne({
  where: { userId: studentId }
})

if (!student) {
  // Create a basic student profile if it doesn't exist
  const student = await Student.create({
    userId: studentId,
    fitnessLevel: 'beginner'
  })
}
    
    // Create workout program
    const program = await WorkoutProgram.create({
      studentId,
      coachId: session.userId,
      title,
      description: body.description || '',
      startDate,
      endDate,
      durationWeeks,
      status: 'active',
      notes: body.notes || ''
    })
    
    console.log('Workout program created:', program.id)
    
    // Create weeks
    for (const weekData of weeks) {
      const week = await WorkoutWeek.create({
        programId: program.id,
        weekNumber: weekData.weekNumber,
        title: weekData.title || `هفته ${weekData.weekNumber}`,
        focus: weekData.focus || '',
        notes: weekData.notes || ''
      })
      
      // Create days for this week
      for (const dayData of weekData.days) {
        const day = await WorkoutDay.create({
          weekId: week.id,
          dayNumber: dayData.dayNumber,
          dayName: dayData.dayName,
          title: dayData.title || `روز ${dayData.dayNumber}`,
          focus: dayData.focus || '',
          duration: dayData.duration || null,
          notes: dayData.notes || ''
        })
        
        // Create exercises for this day
        if (dayData.exercises && dayData.exercises.length > 0) {
          for (const exerciseData of dayData.exercises) {
            await Exercise.create({
              dayId: day.id,
              order: exerciseData.order || 1,
              name: exerciseData.name,
              description: exerciseData.description || '',
              sets: exerciseData.sets || 3,
              reps: exerciseData.reps || '10-12',
              restTime: exerciseData.restTime || '60-90 ثانیه',
              notes: exerciseData.notes || ''
            })
          }
        }
      }
    }
    
    console.log('Workout program fully created for student:', studentId)
    
    return {
      success: true,
      message: 'برنامه تمرینی با موفقیت ایجاد شد',
      programId: program.id
    }
    
  } catch (error) {
    console.error('Error creating workout program:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'خطا در ایجاد برنامه تمرینی'
    })
  }
})