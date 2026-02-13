
import { Sequelize, DataTypes } from 'sequelize'
import bcrypt from 'bcryptjs'

// Connect to SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASE_PATH || './database.sqlite',
  logging: false
})

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

// Exercise model (هر حرکت ورزشی)
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
    type: DataTypes.STRING, // زمان استراحت بین ست‌ها
    allowNull: true,
    defaultValue: '60-90 ثانیه'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
})

// Define relationships
User.hasOne(Student, { foreignKey: 'userId' })
Student.belongsTo(User, { foreignKey: 'userId' })

User.hasMany(User, { as: 'Students', foreignKey: 'coachId' })
User.belongsTo(User, { as: 'Coach', foreignKey: 'coachId' })

Student.hasMany(WorkoutProgram, { foreignKey: 'studentId' })
WorkoutProgram.belongsTo(Student, { foreignKey: 'studentId' })

User.hasMany(WorkoutProgram, { as: 'CoachPrograms', foreignKey: 'coachId' })
WorkoutProgram.belongsTo(User, { as: 'Coach', foreignKey: 'coachId' })

WorkoutProgram.hasMany(WorkoutWeek, { foreignKey: 'programId' })
WorkoutWeek.belongsTo(WorkoutProgram, { foreignKey: 'programId' })

WorkoutWeek.hasMany(WorkoutDay, { foreignKey: 'weekId' })
WorkoutDay.belongsTo(WorkoutWeek, { foreignKey: 'weekId' })

WorkoutDay.hasMany(Exercise, { foreignKey: 'dayId' })
Exercise.belongsTo(WorkoutDay, { foreignKey: 'dayId' })

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

// Initialize and sync database
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connection established successfully.')
    
    await sequelize.sync({ force: false })
    console.log('Database synchronized.')
    
    await createDefaultUsers()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
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
      console.log('Coach user created:', coach.email)
      
      // Create student user with coach relation
      const student = await User.create({
        email: 'ali@gmail.com',
        password: 'student123',
        fullName: 'علی مرادزاده',
        role: 'student',
        department: 'ورزشکار',
        coachId: coach.id
      })
      
      // Create student profile
      const studentProfile = await Student.create({
        userId: student.id,
        age: 20,
        gender: 'male',
        height: 178,
        weight: 62,
        fitnessLevel: 'intermediate',
        goals: 'افزایش حجم عضله',
        notes: 'شاگرد'
      })
      
      console.log('Student user created:', student.email)
      
      // Create a sample workout program
      // const program = await WorkoutProgram.create({
      //   studentId: studentProfile.id,
      //   coachId: coach.id,
      //   title: 'برنامه فیتنس اولیه',
      //   description: 'برنامه ۴ هفته‌ای برای افزایش قدرت پایه',
      //   startDate: '2024-01-01',
      //   endDate: '2024-01-28',
      //   durationWeeks: 4,
      //   status: 'active',
      //   notes: 'برنامه نمونه برای نمایش'
      // })
      
     //console.log('Sample workout program created')
      
     // console.log('Default users created successfully.')
    }
  } catch (error) {
    console.error('Error creating default users:', error)
  }
}

// Export all modules
export {
  User,
  Student,
  WorkoutProgram,
  WorkoutWeek,
  WorkoutDay,
  Exercise,
  sequelize,
  initializeDatabase
}