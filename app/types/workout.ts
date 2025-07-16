export interface Exercise {
  name: string
  sets: number
  reps: string
  restTime: number // in seconds
  duration: number // estimated duration in minutes
}

export interface Workout {
  name: string
  exercises: Exercise[]
  totalDuration: number // in minutes
  muscleGroup: string
}

export interface WorkoutPlan {
  monday: Workout
  tuesday: Workout
  wednesday: Workout
  thursday: Workout
  friday: Workout
  saturday: Workout
  sunday: Workout
}

export interface UserSettings {
  fitnessLevel: "beginner" | "intermediate" | "advanced"
  workoutDays: number
  preferredMuscleGroups: string[]
  sessionDuration: number // preferred session duration in minutes
}

export interface WorkoutProgress {
  date: string
  day: string
  workoutName: string
  exercises: {
    exerciseName: string
    set: number
    reps: string
    weight: string
  }[]
  duration: number
}
