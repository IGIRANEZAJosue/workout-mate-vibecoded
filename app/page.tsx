"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Dumbbell, TrendingUp, Settings, Play, CheckCircle } from "lucide-react"
import WeeklySchedule from "./components/weekly-schedule"
import WorkoutSession from "./components/workout-session"
import ProgressTracker from "./components/progress-tracker"
import SettingsPanel from "./components/settings-panel"
import type { WorkoutPlan, UserSettings, WorkoutProgress } from "./types/workout"
import { ThemeToggle } from "@/components/theme-toggle"

const defaultSettings: UserSettings = {
  fitnessLevel: "intermediate",
  workoutDays: 5,
  preferredMuscleGroups: ["chest", "back", "legs", "arms", "shoulders"],
  sessionDuration: 60,
}

const defaultWorkoutPlan: WorkoutPlan = {
  monday: {
    name: "Chest & Triceps",
    exercises: [
      { name: "Bench Press", sets: 4, reps: "8-10", restTime: 120, duration: 8 },
      { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", restTime: 90, duration: 6 },
      { name: "Chest Flyes", sets: 3, reps: "12-15", restTime: 60, duration: 5 },
      { name: "Tricep Dips", sets: 3, reps: "10-12", restTime: 60, duration: 4 },
      { name: "Overhead Tricep Extension", sets: 3, reps: "12-15", restTime: 60, duration: 4 },
    ],
    totalDuration: 45,
    muscleGroup: "chest",
  },
  tuesday: {
    name: "Back & Biceps",
    exercises: [
      { name: "Pull-ups", sets: 4, reps: "6-8", restTime: 120, duration: 8 },
      { name: "Bent-over Rows", sets: 4, reps: "8-10", restTime: 90, duration: 7 },
      { name: "Lat Pulldowns", sets: 3, reps: "10-12", restTime: 90, duration: 6 },
      { name: "Bicep Curls", sets: 3, reps: "12-15", restTime: 60, duration: 4 },
      { name: "Hammer Curls", sets: 3, reps: "12-15", restTime: 60, duration: 4 },
    ],
    totalDuration: 50,
    muscleGroup: "back",
  },
  wednesday: {
    name: "Rest Day",
    exercises: [],
    totalDuration: 0,
    muscleGroup: "rest",
  },
  thursday: {
    name: "Legs",
    exercises: [
      { name: "Squats", sets: 4, reps: "8-10", restTime: 120, duration: 10 },
      { name: "Romanian Deadlifts", sets: 4, reps: "8-10", restTime: 120, duration: 8 },
      { name: "Leg Press", sets: 3, reps: "12-15", restTime: 90, duration: 6 },
      { name: "Leg Curls", sets: 3, reps: "12-15", restTime: 60, duration: 4 },
      { name: "Calf Raises", sets: 4, reps: "15-20", restTime: 45, duration: 5 },
    ],
    totalDuration: 55,
    muscleGroup: "legs",
  },
  friday: {
    name: "Shoulders & Abs",
    exercises: [
      { name: "Overhead Press", sets: 4, reps: "8-10", restTime: 120, duration: 8 },
      { name: "Lateral Raises", sets: 3, reps: "12-15", restTime: 60, duration: 4 },
      { name: "Rear Delt Flyes", sets: 3, reps: "12-15", restTime: 60, duration: 4 },
      { name: "Plank", sets: 3, reps: "30-60s", restTime: 60, duration: 3 },
      { name: "Russian Twists", sets: 3, reps: "20-30", restTime: 45, duration: 3 },
    ],
    totalDuration: 40,
    muscleGroup: "shoulders",
  },
  saturday: {
    name: "Full Body HIIT",
    exercises: [
      { name: "Burpees", sets: 4, reps: "10-15", restTime: 60, duration: 5 },
      { name: "Mountain Climbers", sets: 4, reps: "20-30", restTime: 60, duration: 4 },
      { name: "Jump Squats", sets: 4, reps: "15-20", restTime: 60, duration: 4 },
      { name: "Push-ups", sets: 3, reps: "10-15", restTime: 60, duration: 3 },
      { name: "High Knees", sets: 3, reps: "30s", restTime: 45, duration: 3 },
    ],
    totalDuration: 35,
    muscleGroup: "cardio",
  },
  sunday: {
    name: "Rest Day",
    exercises: [],
    totalDuration: 0,
    muscleGroup: "rest",
  },
}

export default function WorkoutScheduler() {
  const [activeTab, setActiveTab] = useState("schedule")
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan>(defaultWorkoutPlan)
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultSettings)
  const [progress, setProgress] = useState<WorkoutProgress[]>([])
  const [activeWorkout, setActiveWorkout] = useState<string | null>(null)

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedPlan = localStorage.getItem("workoutPlan")
    const savedSettings = localStorage.getItem("userSettings")
    const savedProgress = localStorage.getItem("workoutProgress")

    if (savedPlan) setWorkoutPlan(JSON.parse(savedPlan))
    if (savedSettings) setUserSettings(JSON.parse(savedSettings))
    if (savedProgress) setProgress(JSON.parse(savedProgress))
  }, [])

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("workoutPlan", JSON.stringify(workoutPlan))
  }, [workoutPlan])

  useEffect(() => {
    localStorage.setItem("userSettings", JSON.stringify(userSettings))
  }, [userSettings])

  useEffect(() => {
    localStorage.setItem("workoutProgress", JSON.stringify(progress))
  }, [progress])

  const handleWorkoutComplete = (day: string, completedExercises: any[]) => {
    const newProgress: WorkoutProgress = {
      date: new Date().toISOString(),
      day,
      workoutName: workoutPlan[day as keyof WorkoutPlan].name,
      exercises: completedExercises,
      duration: workoutPlan[day as keyof WorkoutPlan].totalDuration,
    }
    setProgress((prev) => [...prev, newProgress])
    setActiveWorkout(null)
  }

  const getWeeklyStats = () => {
    const thisWeek = progress.filter((p) => {
      const progressDate = new Date(p.date)
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      return progressDate >= weekStart
    })

    return {
      workoutsCompleted: thisWeek.length,
      totalDuration: thisWeek.reduce((sum, p) => sum + p.duration, 0),
      weeklyGoal: userSettings.workoutDays,
    }
  }

  const stats = getWeeklyStats()

  if (activeWorkout) {
    return (
      <WorkoutSession
        workout={workoutPlan[activeWorkout as keyof WorkoutPlan]}
        onComplete={(exercises) => handleWorkoutComplete(activeWorkout, exercises)}
        onExit={() => setActiveWorkout(null)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Workout Scheduler</h1>
              <p className="text-muted-foreground">Your personalized fitness journey starts here</p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Weekly Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-border/50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.workoutsCompleted}/{stats.weeklyGoal}
                  </p>
                  <p className="text-sm text-muted-foreground">Workouts completed</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <Progress value={(stats.workoutsCompleted / stats.weeklyGoal) * 100} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Time</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalDuration}m</p>
                  <p className="text-sm text-muted-foreground">This week</p>
                </div>
                <Dumbbell className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fitness Level</p>
                  <p className="text-2xl font-bold text-foreground capitalize">{userSettings.fitnessLevel}</p>
                  <p className="text-sm text-muted-foreground">Current level</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger
              value="schedule"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              <Calendar className="h-4 w-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              <TrendingUp className="h-4 w-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger
              value="workout"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              <Play className="h-4 w-4" />
              Quick Start
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="mt-6">
            <WeeklySchedule workoutPlan={workoutPlan} onStartWorkout={setActiveWorkout} progress={progress} />
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <ProgressTracker progress={progress} />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <SettingsPanel
              settings={userSettings}
              onSettingsChange={setUserSettings}
              workoutPlan={workoutPlan}
              onWorkoutPlanChange={setWorkoutPlan}
            />
          </TabsContent>

          <TabsContent value="workout" className="mt-6">
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Start Workout</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(workoutPlan).map(([day, workout]) => {
                    if (workout.exercises.length === 0) return null

                    const isCompleted = progress.some(
                      (p) => p.day === day && new Date(p.date).toDateString() === new Date().toDateString(),
                    )

                    return (
                      <Card key={day} className="relative border-border/50 hover:border-border transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold capitalize text-foreground">{day}</h3>
                            {isCompleted && (
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              >
                                Completed
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{workout.name}</p>
                          <p className="text-xs text-muted-foreground mb-3">
                            {workout.exercises.length} exercises • {workout.totalDuration}min
                          </p>
                          <Button
                            onClick={() => setActiveWorkout(day)}
                            className="w-full"
                            variant={isCompleted ? "outline" : "default"}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            {isCompleted ? "Repeat" : "Start"}
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
