"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { UserSettings, WorkoutPlan, Exercise } from "../types/workout"
import { Plus, Trash2 } from "lucide-react"

interface SettingsPanelProps {
  settings: UserSettings
  onSettingsChange: (settings: UserSettings) => void
  workoutPlan: WorkoutPlan
  onWorkoutPlanChange: (plan: WorkoutPlan) => void
}

export default function SettingsPanel({
  settings,
  onSettingsChange,
  workoutPlan,
  onWorkoutPlanChange,
}: SettingsPanelProps) {
  const [editingDay, setEditingDay] = useState<string | null>(null)
  const [newExercise, setNewExercise] = useState<Exercise>({
    name: "",
    sets: 3,
    reps: "10-12",
    restTime: 60,
    duration: 5,
  })

  const handleSettingsUpdate = (key: keyof UserSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  const handleMuscleGroupToggle = (muscleGroup: string) => {
    const updated = settings.preferredMuscleGroups.includes(muscleGroup)
      ? settings.preferredMuscleGroups.filter((mg) => mg !== muscleGroup)
      : [...settings.preferredMuscleGroups, muscleGroup]

    handleSettingsUpdate("preferredMuscleGroups", updated)
  }

  const addExerciseToDay = (day: string) => {
    if (!newExercise.name) return

    const updatedPlan = { ...workoutPlan }
    updatedPlan[day as keyof WorkoutPlan] = {
      ...updatedPlan[day as keyof WorkoutPlan],
      exercises: [...updatedPlan[day as keyof WorkoutPlan].exercises, { ...newExercise }],
    }

    onWorkoutPlanChange(updatedPlan)
    setNewExercise({
      name: "",
      sets: 3,
      reps: "10-12",
      restTime: 60,
      duration: 5,
    })
  }

  const removeExerciseFromDay = (day: string, exerciseIndex: number) => {
    const updatedPlan = { ...workoutPlan }
    updatedPlan[day as keyof WorkoutPlan] = {
      ...updatedPlan[day as keyof WorkoutPlan],
      exercises: updatedPlan[day as keyof WorkoutPlan].exercises.filter((_, idx) => idx !== exerciseIndex),
    }

    onWorkoutPlanChange(updatedPlan)
  }

  const generateWorkoutPlan = () => {
    // Simple workout plan generation based on fitness level
    const exerciseDatabase = {
      beginner: {
        chest: [
          { name: "Push-ups", sets: 3, reps: "8-12", restTime: 60, duration: 4 },
          { name: "Incline Push-ups", sets: 3, reps: "10-15", restTime: 60, duration: 4 },
          { name: "Chest Press Machine", sets: 3, reps: "10-12", restTime: 90, duration: 5 },
        ],
        back: [
          { name: "Assisted Pull-ups", sets: 3, reps: "5-8", restTime: 90, duration: 5 },
          { name: "Seated Row Machine", sets: 3, reps: "10-12", restTime: 60, duration: 5 },
          { name: "Lat Pulldown", sets: 3, reps: "10-12", restTime: 60, duration: 5 },
        ],
        legs: [
          { name: "Bodyweight Squats", sets: 3, reps: "12-15", restTime: 60, duration: 4 },
          { name: "Leg Press", sets: 3, reps: "12-15", restTime: 90, duration: 6 },
          { name: "Leg Curls", sets: 3, reps: "10-12", restTime: 60, duration: 4 },
        ],
      },
      intermediate: {
        chest: [
          { name: "Bench Press", sets: 4, reps: "8-10", restTime: 120, duration: 8 },
          { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", restTime: 90, duration: 6 },
          { name: "Chest Flyes", sets: 3, reps: "12-15", restTime: 60, duration: 5 },
        ],
        back: [
          { name: "Pull-ups", sets: 4, reps: "6-8", restTime: 120, duration: 8 },
          { name: "Bent-over Rows", sets: 4, reps: "8-10", restTime: 90, duration: 7 },
          { name: "Lat Pulldowns", sets: 3, reps: "10-12", restTime: 90, duration: 6 },
        ],
        legs: [
          { name: "Squats", sets: 4, reps: "8-10", restTime: 120, duration: 10 },
          { name: "Romanian Deadlifts", sets: 4, reps: "8-10", restTime: 120, duration: 8 },
          { name: "Leg Press", sets: 3, reps: "12-15", restTime: 90, duration: 6 },
        ],
      },
      advanced: {
        chest: [
          { name: "Barbell Bench Press", sets: 5, reps: "5-6", restTime: 180, duration: 10 },
          { name: "Incline Barbell Press", sets: 4, reps: "6-8", restTime: 120, duration: 8 },
          { name: "Weighted Dips", sets: 4, reps: "8-10", restTime: 90, duration: 6 },
          { name: "Cable Flyes", sets: 3, reps: "12-15", restTime: 60, duration: 5 },
        ],
        back: [
          { name: "Weighted Pull-ups", sets: 5, reps: "5-6", restTime: 180, duration: 10 },
          { name: "Barbell Rows", sets: 4, reps: "6-8", restTime: 120, duration: 8 },
          { name: "T-Bar Rows", sets: 4, reps: "8-10", restTime: 90, duration: 7 },
          { name: "Cable Rows", sets: 3, reps: "10-12", restTime: 90, duration: 6 },
        ],
        legs: [
          { name: "Back Squats", sets: 5, reps: "5-6", restTime: 180, duration: 12 },
          { name: "Romanian Deadlifts", sets: 4, reps: "6-8", restTime: 150, duration: 10 },
          { name: "Bulgarian Split Squats", sets: 4, reps: "8-10", restTime: 90, duration: 8 },
          { name: "Walking Lunges", sets: 3, reps: "12-15", restTime: 60, duration: 6 },
        ],
      },
    }

    // Generate a new plan based on current settings
    const level = settings.fitnessLevel as keyof typeof exerciseDatabase
    const exercises = exerciseDatabase[level]

    const newPlan: WorkoutPlan = {
      monday: {
        name: "Chest & Triceps",
        exercises: exercises.chest,
        totalDuration: exercises.chest.reduce((sum, ex) => sum + ex.duration, 0),
        muscleGroup: "chest",
      },
      tuesday: {
        name: "Back & Biceps",
        exercises: exercises.back,
        totalDuration: exercises.back.reduce((sum, ex) => sum + ex.duration, 0),
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
        exercises: exercises.legs,
        totalDuration: exercises.legs.reduce((sum, ex) => sum + ex.duration, 0),
        muscleGroup: "legs",
      },
      friday: {
        name: "Shoulders & Arms",
        exercises: [
          { name: "Overhead Press", sets: 4, reps: "8-10", restTime: 120, duration: 8 },
          { name: "Lateral Raises", sets: 3, reps: "12-15", restTime: 60, duration: 4 },
          { name: "Bicep Curls", sets: 3, reps: "12-15", restTime: 60, duration: 4 },
        ],
        totalDuration: 16,
        muscleGroup: "shoulders",
      },
      saturday: {
        name: "Cardio & Core",
        exercises: [
          { name: "Treadmill", sets: 1, reps: "20-30min", restTime: 0, duration: 25 },
          { name: "Plank", sets: 3, reps: "30-60s", restTime: 60, duration: 3 },
          { name: "Crunches", sets: 3, reps: "15-20", restTime: 45, duration: 3 },
        ],
        totalDuration: 31,
        muscleGroup: "cardio",
      },
      sunday: {
        name: "Rest Day",
        exercises: [],
        totalDuration: 0,
        muscleGroup: "rest",
      },
    }

    onWorkoutPlanChange(newPlan)
  }

  const muscleGroups = ["chest", "back", "legs", "shoulders", "arms", "cardio"]
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="workout-plan">Workout Plan</TabsTrigger>
        <TabsTrigger value="exercises">Exercises</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="fitness-level">Fitness Level</Label>
              <Select
                value={settings.fitnessLevel}
                onValueChange={(value) => handleSettingsUpdate("fitnessLevel", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="workout-days">Workout Days per Week</Label>
              <Input
                id="workout-days"
                type="number"
                min="1"
                max="7"
                value={settings.workoutDays}
                onChange={(e) => handleSettingsUpdate("workoutDays", Number.parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="session-duration">Preferred Session Duration (minutes)</Label>
              <Input
                id="session-duration"
                type="number"
                min="15"
                max="120"
                value={settings.sessionDuration}
                onChange={(e) => handleSettingsUpdate("sessionDuration", Number.parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label>Preferred Muscle Groups</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {muscleGroups.map((group) => (
                  <div key={group} className="flex items-center space-x-2">
                    <Checkbox
                      id={group}
                      checked={settings.preferredMuscleGroups.includes(group)}
                      onCheckedChange={() => handleMuscleGroupToggle(group)}
                    />
                    <Label htmlFor={group} className="capitalize">
                      {group}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="workout-plan" className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Workout Plan</CardTitle>
              <Button onClick={generateWorkoutPlan}>Generate New Plan</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {days.map((day) => {
                const workout = workoutPlan[day as keyof WorkoutPlan]
                return (
                  <Card key={day} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold capitalize">{day}</h3>
                      <Badge variant="secondary">{workout.muscleGroup}</Badge>
                    </div>
                    <h4 className="font-medium mb-2">{workout.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {workout.exercises.length} exercises • {workout.totalDuration}min
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setEditingDay(editingDay === day ? null : day)}>
                      {editingDay === day ? "Close" : "Edit"}
                    </Button>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="exercises" className="space-y-6">
        {editingDay && (
          <Card>
            <CardHeader>
              <CardTitle>Edit {editingDay.charAt(0).toUpperCase() + editingDay.slice(1)} Workout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {workoutPlan[editingDay as keyof WorkoutPlan].exercises.map((exercise, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{exercise.name}</h4>
                      <p className="text-sm text-gray-600">
                        {exercise.sets} sets × {exercise.reps} reps • {exercise.restTime}s rest
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => removeExerciseFromDay(editingDay, idx)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Add New Exercise</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="exercise-name">Exercise Name</Label>
                    <Input
                      id="exercise-name"
                      value={newExercise.name}
                      onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                      placeholder="e.g., Push-ups"
                    />
                  </div>
                  <div>
                    <Label htmlFor="exercise-sets">Sets</Label>
                    <Input
                      id="exercise-sets"
                      type="number"
                      value={newExercise.sets}
                      onChange={(e) => setNewExercise({ ...newExercise, sets: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="exercise-reps">Reps</Label>
                    <Input
                      id="exercise-reps"
                      value={newExercise.reps}
                      onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                      placeholder="e.g., 10-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="exercise-rest">Rest Time (seconds)</Label>
                    <Input
                      id="exercise-rest"
                      type="number"
                      value={newExercise.restTime}
                      onChange={(e) => setNewExercise({ ...newExercise, restTime: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <Button onClick={() => addExerciseToDay(editingDay)} className="mt-3" disabled={!newExercise.name}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exercise
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!editingDay && (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">Select a Day to Edit</h3>
              <p className="text-gray-600">
                Go to the Workout Plan tab and click "Edit" on any day to customize exercises.
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  )
}
