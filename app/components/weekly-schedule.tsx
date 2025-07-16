"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, Dumbbell, CheckCircle } from "lucide-react"
import type { WorkoutPlan, WorkoutProgress } from "../types/workout"

interface WeeklyScheduleProps {
  workoutPlan: WorkoutPlan
  onStartWorkout: (day: string) => void
  progress: WorkoutProgress[]
}

export default function WeeklySchedule({ workoutPlan, onStartWorkout, progress }: WeeklyScheduleProps) {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const isWorkoutCompleted = (day: string) => {
    return progress.some((p) => p.day === day && new Date(p.date).toDateString() === new Date().toDateString())
  }

  const getMuscleGroupColor = (muscleGroup: string) => {
    const colors = {
      chest: "bg-red-100 text-red-800",
      back: "bg-blue-100 text-blue-800",
      legs: "bg-green-100 text-green-800",
      shoulders: "bg-yellow-100 text-yellow-800",
      arms: "bg-purple-100 text-purple-800",
      cardio: "bg-orange-100 text-orange-800",
      rest: "bg-gray-100 text-gray-800",
    }
    return colors[muscleGroup as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {days.map((day, index) => {
        const workout = workoutPlan[day as keyof WorkoutPlan]
        const isCompleted = isWorkoutCompleted(day)
        const isRestDay = workout.exercises.length === 0

        return (
          <Card key={day} className={`relative ${isCompleted ? "ring-2 ring-green-500" : ""}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{dayNames[index]}</CardTitle>
                {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
              </div>
              <Badge variant="secondary" className={getMuscleGroupColor(workout.muscleGroup)}>
                {workout.muscleGroup}
              </Badge>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-3">{workout.name}</h3>

              {!isRestDay ? (
                <>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Dumbbell className="h-4 w-4 mr-2" />
                      {workout.exercises.length} exercises
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {workout.totalDuration} minutes
                    </div>
                  </div>

                  <div className="space-y-1 mb-4">
                    {workout.exercises.slice(0, 3).map((exercise, idx) => (
                      <div key={idx} className="text-xs text-gray-500">
                        • {exercise.name} ({exercise.sets}x{exercise.reps})
                      </div>
                    ))}
                    {workout.exercises.length > 3 && (
                      <div className="text-xs text-gray-400">+{workout.exercises.length - 3} more exercises</div>
                    )}
                  </div>

                  <Button
                    onClick={() => onStartWorkout(day)}
                    className="w-full"
                    variant={isCompleted ? "outline" : "default"}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isCompleted ? "Repeat Workout" : "Start Workout"}
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">🛌</div>
                  <p className="text-sm text-gray-500">Recovery day</p>
                  <p className="text-xs text-gray-400 mt-1">Rest and recover</p>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
