import { WorkoutProgram, WorkoutWeek, WorkoutDay, Exercise, ExerciseRef, Student, User } from '../../models/index.js'

export default defineEventHandler(async (event) => {
  try {
    const authToken = getCookie(event, 'trainmate-auth')
    if (!authToken) {
      throw createError({ statusCode: 401, statusMessage: 'لطفاً ابتدا وارد شوید' })
    }
    
    const session = JSON.parse(authToken)
    const { studentId } = getQuery(event)  // <-- این خط رو برگردوندیم
    
    let programs
    
    if (session.role === 'coach') {
      // ===== بخش مربی =====
      // اول همه شاگردهای این مربی رو پیدا می‌کنیم
      const students = await Student.findAll({
        include: [{
          model: User,
          where: { coachId: session.userId }
        }]
      })
      
      const allStudentIds = students.map(s => s.id)
      
      // اگر studentId مشخص شده، فقط اون شاگرد رو فیلتر کن
      let whereCondition = {}
      if (studentId) {
        // چک کن این شاگرد متعلق به این مربی هست؟
        const belongsToCoach = allStudentIds.includes(parseInt(studentId))
        if (!belongsToCoach) {
          throw createError({ statusCode: 404, statusMessage: 'شاگرد مورد نظر یافت نشد' })
        }
        whereCondition.studentId = parseInt(studentId)
      } else {
        whereCondition.studentId = allStudentIds
      }
      
      programs = await WorkoutProgram.findAll({
        where: whereCondition,
        include: [
          { model: Student, include: [{ model: User }] },
          { model: User, as: 'Coach' },
          { 
            model: WorkoutWeek,
            include: [{
              model: WorkoutDay,
              include: [{
                model: Exercise,
                include: [{ model: ExerciseRef }]
              }]
            }]
          }
        ],
        order: [['createdAt', 'DESC']]
      })
      
    } else if (session.role === 'student') {
      // ===== بخش شاگرد =====
      const student = await Student.findOne({ where: { userId: session.userId } })
      
      programs = await WorkoutProgram.findAll({
        where: { studentId: student.id },
        include: [
          { model: Student, include: [{ model: User }] },
          { model: User, as: 'Coach' },
          { 
            model: WorkoutWeek,
            include: [{
              model: WorkoutDay,
              include: [{
                model: Exercise,
                include: [{ model: ExerciseRef }]
              }]
            }]
          }
        ],
        order: [['createdAt', 'DESC']]
      })
      
    } else {
      throw createError({ statusCode: 403, statusMessage: 'دسترسی غیرمجاز' })
    }
    
    // لاگ برای دیباگ
    console.log(`📊 Programs loaded for ${session.role}:`, programs.length)
    if (studentId) console.log('🔍 Filtered by studentId:', studentId)
    
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
          fullName: program.Student.User?.fullName,
          email: program.Student.User?.email
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
            exercises: day.Exercises ? day.Exercises.map(ex => ({
              id: ex.id,
              order: ex.order,
              name: ex.name,
              description: ex.description,
              sets: ex.sets,
              reps: ex.reps,
              restTime: ex.restTime,
              notes: ex.notes,
              gifUrl: ex.gifUrl || ex.ExerciseRef?.gifUrl || null,
              exerciseRef: ex.ExerciseRef ? {
                gifUrl: ex.ExerciseRef.gifUrl,
                targetMuscles: ex.ExerciseRef.targetMuscles
              } : null
            })) : []
          })) : []
        })) : []
      }))
    }
    
  } catch (error) {
    console.error('❌ Error fetching workout programs:', error)
    throw createError({ 
      statusCode: error.statusCode || 500, 
      statusMessage: error.statusMessage || 'خطا در دریافت برنامه‌های تمرینی' 
    })
  }
})