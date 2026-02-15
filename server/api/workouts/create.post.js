import { WorkoutProgram, WorkoutWeek, WorkoutDay, Exercise, ExerciseRef, Student, User } from '../../models/index.js'

export default defineEventHandler(async (event) => {
  try {
    console.log('🚀 API /api/workouts/create called')
    
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
    console.log('📦 Received body:', JSON.stringify(body, null, 2))
    
    // Validate required fields
    const { studentId, title, startDate, endDate, durationWeeks, weeks } = body
    
    if (!studentId || !title || !startDate || !endDate || !durationWeeks || !weeks) {
      throw createError({
        statusCode: 400,
        statusMessage: 'پر کردن تمام فیلدهای الزامی ضروری است'
      })
    }
    
    // ========== اصلاح این بخش ==========
    // اول Student رو بر اساس studentId پیدا کن (studentId اینجا همون Student.id هستش)
    const student = await Student.findOne({
      where: { id: studentId },
      include: [{
        model: User,
        where: { coachId: session.userId }  // چک میکنیم این شاگرد متعلق به این مربی هستش
      }]
    })
    
    if (!student) {
      console.log('❌ Student not found for ID:', studentId, 'and coach:', session.userId)
      throw createError({
        statusCode: 404,
        statusMessage: 'شاگرد مورد نظر یافت نشد یا به شما تعلق ندارد'
      })
    }
    
    console.log('✅ Student found:', student.id, 'User ID:', student.userId)
    // ========== پایان اصلاح ==========
    
    // Create workout program - استفاده از student.id (همون Student.id)
    const program = await WorkoutProgram.create({
      studentId: student.id,  // اینجا student.id درسته
      coachId: session.userId,
      title,
      description: body.description || '',
      startDate,
      endDate,
      durationWeeks,
      status: 'active',
      notes: body.notes || ''
    })
    
    console.log('✅ Workout program created:', program.id)
    
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
            
            // بررسی کنیم آیا این حرکت قبلاً در ExerciseRef ذخیره شده؟
            let exerciseRef = null
            if (exerciseData.exerciseId) {
              exerciseRef = await ExerciseRef.findOne({
                where: { exerciseId: exerciseData.exerciseId }
              })
              
              // اگر وجود نداشت، ایجادش کن
              if (!exerciseRef) {
                exerciseRef = await ExerciseRef.create({
                  exerciseId: exerciseData.exerciseId,
                  name: exerciseData.name,
                  gifUrl: exerciseData.gifUrl,
                  targetMuscles: exerciseData.targetMuscles || [],
                  bodyParts: exerciseData.bodyParts || [],
                  equipments: exerciseData.equipments || [],
                  secondaryMuscles: exerciseData.secondaryMuscles || [],
                  instructions: exerciseData.instructions || []
                })
                console.log('📝 Created ExerciseRef for:', exerciseData.exerciseId)
              }
            }
            
            // حالا Exercise رو ایجاد کن
            await Exercise.create({
              dayId: day.id,
              exerciseRefId: exerciseRef ? exerciseRef.id : null,
              exerciseApiId: exerciseData.exerciseId || null,
              order: exerciseData.order || 1,
              name: exerciseData.name,
              description: exerciseData.description || '',
              sets: exerciseData.sets || 3,
              reps: exerciseData.reps || '10-12',
              restTime: exerciseData.restTime || '60-90 ثانیه',
              notes: exerciseData.notes || '',
              gifUrl: exerciseData.gifUrl || null
            })
          }
        }
      }
    }
    
    console.log('🎉 Workout program fully created for student:', student.id)
    
    return {
      success: true,
      message: 'برنامه تمرینی با موفقیت ایجاد شد',
      programId: program.id
    }
    
  } catch (error) {
    console.error('❌ Error creating workout program:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'خطا در ایجاد برنامه تمرینی'
    })
  }
})