"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play, Pause, SkipForward, Check, X, Timer } from "lucide-react"
import type { Workout } from "../types/workout"

interface WorkoutSessionProps {
  workout: Workout
  onComplete: (exercises: any[]) => void
  onExit: () => void
}

export default function WorkoutSession({ workout, onComplete, onExit }: WorkoutSessionProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [isResting, setIsResting] = useState(false)
  const [restTimer, setRestTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [completedExercises, setCompletedExercises] = useState<any[]>([])
  const [actualReps, setActualReps] = useState("")
  const [actualWeight, setActualWeight] = useState("")

  const currentExercise = workout.exercises[currentExerciseIndex]
  const progress = ((currentExerciseIndex + (currentSet / currentExercise?.sets || 1)) / workout.exercises.length) * 100

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false)
            setIsResting(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, restTimer])

  const startRestTimer = () => {
    setRestTimer(currentExercise.restTime)
    setIsResting(true)
    setIsTimerRunning(true)
  }

  const completeSet = () => {
    const exerciseData = {
      exerciseName: currentExercise.name,
      set: currentSet,
      reps: actualReps || currentExercise.reps,
      weight: actualWeight || "bodyweight",
    }

    setCompletedExercises((prev) => [...prev, exerciseData])

    if (currentSet < currentExercise.sets) {
      setCurrentSet((prev) => prev + 1)
      startRestTimer()
    } else {
      // Move to next exercise
      if (currentExerciseIndex < workout.exercises.length - 1) {
        setCurrentExerciseIndex((prev) => prev + 1)
        setCurrentSet(1)
        setIsResting(false)
        setRestTimer(0)
        setIsTimerRunning(false)
      } else {
        // Workout complete
        onComplete(completedExercises)
      }
    }

    setActualReps("")
    setActualWeight("")
  }

  const skipRest = () => {
    setIsResting(false)
    setIsTimerRunning(false)
    setRestTimer(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!currentExercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Check className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Workout Complete!</h2>
            <p className="text-gray-600 mb-6">Great job finishing your {workout.name} session!</p>
            <Button onClick={() => onComplete(completedExercises)} className="w-full">
              Finish & Save Progress
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{workout.name}</h1>
          <Button variant="outline" onClick={onExit}>
            <X className="h-4 w-4 mr-2" />
            Exit
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {isResting ? (
          <Card className="mb-6">
            <CardContent className="p-8 text-center">
              <Timer className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">{formatTime(restTimer)}</h2>
              <p className="text-gray-600 mb-6">Rest between sets</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={skipRest} variant="outline">
                  Skip Rest
                </Button>
                <Button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  variant={isTimerRunning ? "secondary" : "default"}
                >
                  {isTimerRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isTimerRunning ? "Pause" : "Resume"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{currentExercise.name}</CardTitle>
                <Badge variant="secondary">
                  Set {currentSet} of {currentExercise.sets}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Target Reps</p>
                  <p className="text-2xl font-bold">{currentExercise.reps}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Rest Time</p>
                  <p className="text-2xl font-bold">{currentExercise.restTime}s</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="reps">Actual Reps Completed</Label>
                  <Input
                    id="reps"
                    type="number"
                    placeholder={`Target: ${currentExercise.reps}`}
                    value={actualReps}
                    onChange={(e) => setActualReps(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight Used (optional)</Label>
                  <Input
                    id="weight"
                    placeholder="e.g., 50 lbs, 20 kg, bodyweight"
                    value={actualWeight}
                    onChange={(e) => setActualWeight(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={completeSet} className="flex-1">
                  <Check className="h-4 w-4 mr-2" />
                  Complete Set
                </Button>
                <Button
                  onClick={() => {
                    if (currentExerciseIndex < workout.exercises.length - 1) {
                      setCurrentExerciseIndex((prev) => prev + 1)
                      setCurrentSet(1)
                    }
                  }}
                  variant="outline"
                >
                  <SkipForward className="h-4 w-4 mr-2" />
                  Skip Exercise
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {workout.exercises.slice(currentExerciseIndex + 1, currentExerciseIndex + 4).map((exercise, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{exercise.name}</span>
                  <span className="text-sm text-gray-600">
                    {exercise.sets}x{exercise.reps}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
