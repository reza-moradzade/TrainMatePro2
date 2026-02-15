import { Sequelize, DataTypes } from 'sequelize'
import bcrypt from 'bcryptjs'

// Connect to SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASE_PATH || './database.sqlite',
  logging: false
})

// ==================== USER MODELS ====================
// User model definition (for authentication)
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('coach', 'student'),
    allowNull: false,
    defaultValue: 'student'
  },
  department: {
    type: DataTypes.STRING,
    defaultValue: 'General'
  },
  coachId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
})

// Student Profile model
const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('male', 'female'),
    allowNull: true
  },
  height: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  fitnessLevel: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'beginner'
  },
  goals: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
})

// ==================== WORKOUT MODELS ====================
// Workout Program model
const WorkoutProgram = sequelize.define('WorkoutProgram', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Students',
      key: 'id'
    }
  },
  coachId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'برنامه تمرینی جدید'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  durationWeeks: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 4
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'cancelled'),
    defaultValue: 'active'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
})

// Workout Week model (هر هفته برنامه)
const WorkoutWeek = sequelize.define('WorkoutWeek', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  programId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'WorkoutPrograms',
      key: 'id'
    }
  },
  weekNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 12
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'هفته تمرینی'
  },
  focus: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
})

// Workout Day model (هر روز هفته)
const WorkoutDay = sequelize.define('WorkoutDay', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  weekId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'WorkoutWeeks',
      key: 'id'
    }
  },
  dayNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 7
    }
  },
  dayName: {
    type: DataTypes.ENUM('saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'روز تمرین'
  },
  focus: {
    type: DataTypes.STRING,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER, // مدت به دقیقه
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
})

// ==================== EXERCISE MODELS ====================
// Exercise Reference model (برای ذخیره اطلاعات حرکات از API خارجی)
const ExerciseRef = sequelize.define('ExerciseRef', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  exerciseId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'ID from ExerciseDB API'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gifUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  targetMuscles: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  bodyParts: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  equipments: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  secondaryMuscles: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  instructions: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  lastSynced: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
})

// Exercise model (هر حرکت ورزشی در برنامه تمرینی)
const Exercise = sequelize.define('Exercise', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dayId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'WorkoutDays',
      key: 'id'
    }
  },
  exerciseRefId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'ExerciseRefs',
      key: 'id'
    },
    comment: 'Reference to cached exercise in ExerciseRef table'
  },
  exerciseApiId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Direct reference to exercise ID from external API (for quick lookup)'
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sets: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 3
  },
  reps: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '10-12'
  },
  restTime: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '60-90 ثانیه'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  gifUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Cached GIF URL from external API'
  }
})

// ==================== RELATIONSHIPS ====================
// User - Student relationships
User.hasOne(Student, { foreignKey: 'userId' })
Student.belongsTo(User, { foreignKey: 'userId' })

// Coach - Student relationships (self-reference)
User.hasMany(User, { as: 'Students', foreignKey: 'coachId' })
User.belongsTo(User, { as: 'Coach', foreignKey: 'coachId' })

// Student - WorkoutProgram relationships
Student.hasMany(WorkoutProgram, { foreignKey: 'studentId' })
WorkoutProgram.belongsTo(Student, { foreignKey: 'studentId' })

// Coach - WorkoutProgram relationships
User.hasMany(WorkoutProgram, { as: 'CoachPrograms', foreignKey: 'coachId' })
WorkoutProgram.belongsTo(User, { as: 'Coach', foreignKey: 'coachId' })

// WorkoutProgram - WorkoutWeek relationships
WorkoutProgram.hasMany(WorkoutWeek, { foreignKey: 'programId' })
WorkoutWeek.belongsTo(WorkoutProgram, { foreignKey: 'programId' })

// WorkoutWeek - WorkoutDay relationships
WorkoutWeek.hasMany(WorkoutDay, { foreignKey: 'weekId' })
WorkoutDay.belongsTo(WorkoutWeek, { foreignKey: 'weekId' })

// WorkoutDay - Exercise relationships
WorkoutDay.hasMany(Exercise, { foreignKey: 'dayId' })
Exercise.belongsTo(WorkoutDay, { foreignKey: 'dayId' })

// ExerciseRef - Exercise relationships
ExerciseRef.hasMany(Exercise, { foreignKey: 'exerciseRefId' })
Exercise.belongsTo(ExerciseRef, { foreignKey: 'exerciseRefId' })

// ==================== HOOKS & METHODS ====================
// Hash password before saving
User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
  }
})

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
  }
})

// Method to check password
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// ==================== DATABASE INITIALIZATION ====================
// Initialize and sync database
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Database connection established successfully.')
    
    // Sync all models (create tables if they don't exist)
    await sequelize.sync({ force: false })
    console.log('✅ Database synchronized.')
    
    await createDefaultUsers()
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error)
  }
}

// Create default users
const createDefaultUsers = async () => {
  try {
    const userCount = await User.count()
    if (userCount === 0) {
      // Create coach user
      const coach = await User.create({
        email: 'qc.reza@gmail.com',
        password: 'reza123456',
        fullName: 'رضا مرادزاده',
        role: 'coach',
        department: 'بدنسازی'
      })
      console.log('✅ Coach user created:', coach.email)
      
      // // Optionally create a sample student for testing
      // const student = await User.create({
      //   email: 'student@example.com',
      //   password: 'student123',
      //   fullName: 'شاگرد نمونه',
      //   role: 'student',
      //   department: 'عمومی',
      //   coachId: coach.id
      // })
      // console.log('✅ Sample student created:', student.email)
      
      // // Create student profile
      // await Student.create({
      //   userId: student.id,
      //   age: 25,
      //   gender: 'male',
      //   height: 175,
      //   weight: 70,
      //   fitnessLevel: 'intermediate',
      //   goals: 'افزایش قدرت و تناسب اندام',
      //   notes: 'شاگرد نمونه برای تست'
      // })
      // console.log('✅ Sample student profile created')
    }
  } catch (error) {
    console.error('❌ Error creating default users:', error)
  }
}

// ==================== EXPORTS ====================
export {
  User,
  Student,
  WorkoutProgram,
  WorkoutWeek,
  WorkoutDay,
  Exercise,
  ExerciseRef,  // <-- مدل جدید اضافه شد
  sequelize,
  initializeDatabase
}