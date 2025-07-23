"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { UserSettings, WorkoutPlan, Exercise, Workout } from "../types/workout"
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDayForEdit, setSelectedDayForEdit] = useState<string | null>(null)
  const [currentEditingExercises, setCurrentEditingExercises] = useState<Exercise[]>([])
  const [newExercise, setNewExercise] = useState<Exercise>({
    name: "",
    sets: 3,
    reps: "10-12",
    restTime: 60,
    duration: 5,
  })

  // Effect to load exercises into modal when a day is selected
  useEffect(() => {
    if (selectedDayForEdit) {
      const dayWorkout = workoutPlan[selectedDayForEdit as keyof WorkoutPlan]
      // Deep copy exercises to avoid direct mutation of workoutPlan state
      setCurrentEditingExercises(dayWorkout.exercises.map((ex) => ({ ...ex })))
      setIsModalOpen(true)
    } else {
      setIsModalOpen(false)
      setCurrentEditingExercises([])
    }
  }, [selectedDayForEdit, workoutPlan])

  const handleSettingsUpdate = (key: keyof UserSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  const handleMuscleGroupToggle = (muscleGroup: string) => {
    const updated = settings.preferredMuscleGroups.includes(muscleGroup)
      ? settings.preferredMuscleGroups.filter((mg) => mg !== muscleGroup)
      : [...settings.preferredMuscleGroups, muscleGroup]

    handleSettingsUpdate("preferredMuscleGroups", updated)
  }

  const handleExerciseChange = (index: number, field: keyof Exercise, value: any) => {
    const updatedExercises = [...currentEditingExercises]
    // Ensure numeric fields are parsed correctly
    if (field === "sets" || field === "restTime" || field === "duration") {
      updatedExercises[index] = { ...updatedExercises[index], [field]: Number.parseInt(value) || 0 }
    } else {
      updatedExercises[index] = { ...updatedExercises[index], [field]: value }
    }
    setCurrentEditingExercises(updatedExercises)
  }

  const addExercise = () => {
    if (!newExercise.name) return

    setCurrentEditingExercises((prev) => [...prev, { ...newExercise }])
    setNewExercise({
      name: "",
      sets: 3,
      reps: "10-12",
      restTime: 60,
      duration: 5,
    })
  }

  const removeExercise = (index: number) => {
    setCurrentEditingExercises((prev) => prev.filter((_, idx) => idx !== index))
  }

  const handleSaveWorkoutChanges = () => {
    if (!selectedDayForEdit) return

    const updatedPlan = { ...workoutPlan }
    const updatedWorkout: Workout = {
      ...updatedPlan[selectedDayForEdit as keyof WorkoutPlan],
      exercises: currentEditingExercises,
      totalDuration: currentEditingExercises.reduce((sum, ex) => sum + ex.duration, 0),
    }
    updatedPlan[selectedDayForEdit as keyof WorkoutPlan] = updatedWorkout

    onWorkoutPlanChange(updatedPlan)
    setIsModalOpen(false)
    setSelectedDayForEdit(null)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedDayForEdit(null)
    setNewExercise({
      name: "",
      sets: 3,
      reps: "10-12",
      restTime: 60,
      duration: 5,
    })
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
    <>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDayForEdit(day)} // Trigger modal
                      >
                        Edit
                      </Button>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* This tab content is now handled by the modal */}
        <TabsContent value="exercises" className="space-y-6">
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">Edit Workout Exercises</h3>
              <p className="text-gray-600">
                Go to the Workout Plan tab and click "Edit" on any day to customize exercises in a modal.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Workout Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit {selectedDayForEdit?.charAt(0).toUpperCase() + selectedDayForEdit?.slice(1)} Workout
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Current Exercises</h4>
              {currentEditingExercises.length === 0 && (
                <p className="text-muted-foreground text-sm">No exercises added yet for this day.</p>
              )}
              {currentEditingExercises.map((exercise, idx) => (
                <Card key={idx} className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-semibold">{exercise.name}</h5>
                    <Button variant="ghost" size="sm" onClick={() => removeExercise(idx)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                      <span className="sr-only">Remove exercise</span>
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`edit-name-${idx}`}>Name</Label>
                      <Input
                        id={`edit-name-${idx}`}
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(idx, "name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`edit-sets-${idx}`}>Sets</Label>
                      <Input
                        id={`edit-sets-${idx}`}
                        type="number"
                        value={exercise.sets}
                        onChange={(e) => handleExerciseChange(idx, "sets", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`edit-reps-${idx}`}>Reps</Label>
                      <Input
                        id={`edit-reps-${idx}`}
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(idx, "reps", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`edit-rest-${idx}`}>Rest Time (s)</Label>
                      <Input
                        id={`edit-rest-${idx}`}
                        type="number"
                        value={exercise.restTime}
                        onChange={(e) => handleExerciseChange(idx, "restTime", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`edit-duration-${idx}`}>Duration (min)</Label>
                      <Input
                        id={`edit-duration-${idx}`}
                        type="number"
                        value={exercise.duration}
                        onChange={(e) => handleExerciseChange(idx, "duration", e.target.value)}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <h4 className="font-medium text-lg">Add New Exercise</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="new-exercise-name">Exercise Name</Label>
                  <Input
                    id="new-exercise-name"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                    placeholder="e.g., Push-ups"
                  />
                </div>
                <div>
                  <Label htmlFor="new-exercise-sets">Sets</Label>
                  <Input
                    id="new-exercise-sets"
                    type="number"
                    value={newExercise.sets}
                    onChange={(e) => setNewExercise({ ...newExercise, sets: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="new-exercise-reps">Reps</Label>
                  <Input
                    id="new-exercise-reps"
                    value={newExercise.reps}
                    onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                    placeholder="e.g., 10-12"
                  />
                </div>
                <div>
                  <Label htmlFor="new-exercise-rest">Rest Time (seconds)</Label>
                  <Input
                    id="new-exercise-rest"
                    type="number"
                    value={newExercise.restTime}
                    onChange={(e) => setNewExercise({ ...newExercise, restTime: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="new-exercise-duration">Duration (minutes)</Label>
                  <Input
                    id="new-exercise-duration"
                    type="number"
                    value={newExercise.duration}
                    onChange={(e) => setNewExercise({ ...newExercise, duration: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <Button onClick={addExercise} className="mt-3" disabled={!newExercise.name}>
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleSaveWorkoutChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
