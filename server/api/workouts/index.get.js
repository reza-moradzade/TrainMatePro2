
import { WorkoutProgram, WorkoutWeek, WorkoutDay, Exercise, Student, User } from '../../models/index.js'

export default defineEventHandler(async (event) => {
  try {
    // Check if user is authenticated
    const authToken = getCookie(event, 'trainmate-auth')
    if (!authToken) {
      throw createError({
        statusCode: 401,
        statusMessage: 'لطفاً ابتدا وارد شوید'
      })
    }
    
    const session = JSON.parse(authToken)
    const { studentId } = getQuery(event)
    
    let programs
    
    if (session.role === 'coach') {
      // Coach can see all programs for a specific student or all students
      const whereCondition = {}
      
      if (studentId) {
        // Check if this student belongs to the coach
        const student = await Student.findOne({
          where: { 
            id: studentId,
          },
          include: [{
            model: User,
            where: { coachId: session.userId }
          }]
        })
        
        if (!student) {
          throw createError({
            statusCode: 404,
            statusMessage: 'شاگرد مورد نظر یافت نشد'
          })
        }
        
        whereCondition.studentId = studentId
      } else {
        // Get all students of this coach, then get their programs
        const students = await Student.findAll({
          include: [{
            model: User,
            where: { coachId: session.userId },
            attributes: ['id']
          }]
        })
        
        const studentIds = students.map(s => s.id)
        whereCondition.studentId = studentIds
      }
      
      programs = await WorkoutProgram.findAll({
        where: whereCondition,
        include: [
          {
            model: Student,
            include: [{
              model: User,
              attributes: ['id', 'fullName', 'email']
            }]
          },
          {
            model: User,
            as: 'Coach',
            attributes: ['id', 'fullName']
          },
          {
            model: WorkoutWeek,
            include: [{
              model: WorkoutDay,
              include: [{
                model: Exercise,
                order: [['order', 'ASC']]
              }]
            }]
          }
        ],
        order: [['createdAt', 'DESC']]
      })
    } else if (session.role === 'student') {
      // Student can only see their own programs
      const student = await Student.findOne({
        where: { userId: session.userId }
      })
      
      if (!student) {
        throw createError({
          statusCode: 404,
          statusMessage: 'پروفایل دانش آموز یافت نشد'
        })
      }
      
      programs = await WorkoutProgram.findAll({
        where: { studentId: student.id },
        include: [
          {
            model: Student,
            include: [{
              model: User,
              attributes: ['id', 'fullName', 'email']
            }]
          },
          {
            model: User,
            as: 'Coach',
            attributes: ['id', 'fullName']
          },
          {
            model: WorkoutWeek,
            include: [{
              model: WorkoutDay,
              include: [{
                model: Exercise,
                order: [['order', 'ASC']]
              }]
            }]
          }
        ],
        order: [['createdAt', 'DESC']]
      })
    } else {
      throw createError({
        statusCode: 403,
        statusMessage: 'دسترسی غیرمجاز'
      })
    }
    
    return {
      success: true,
      programs: programs.map(program => ({
        id: program.id,
        title: program.title,
        description: program.description,
        startDate: program.startDate,
        endDate: program.endDate,
        durationWeeks: program.durationWeeks,
        status: program.status,
        notes: program.notes,
        createdAt: program.createdAt,
        student: program.Student ? {
          id: program.Student.id,
          fullName: program.Student.User.fullName,
          email: program.Student.User.email
        } : null,
        coach: program.Coach ? {
          id: program.Coach.id,
          fullName: program.Coach.fullName
        } : null,
        weeks: program.WorkoutWeeks ? program.WorkoutWeeks.map(week => ({
          id: week.id,
          weekNumber: week.weekNumber,
          title: week.title,
          focus: week.focus,
          notes: week.notes,
          days: week.WorkoutDays ? week.WorkoutDays.map(day => ({
            id: day.id,
            dayNumber: day.dayNumber,
            dayName: day.dayName,
            title: day.title,
            focus: day.focus,
            duration: day.duration,
            notes: day.notes,
            exercises: day.Exercises ? day.Exercises.map(exercise => ({
              id: exercise.id,
              order: exercise.order,
              name: exercise.name,
              description: exercise.description,
              sets: exercise.sets,
              reps: exercise.reps,
              restTime: exercise.restTime,
              notes: exercise.notes
            })) : []
          })) : []
        })) : []
      }))
    }
    
  } catch (error) {
    console.error('Error fetching workout programs:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'خطا در دریافت برنامه‌های تمرینی'
    })
  }
})