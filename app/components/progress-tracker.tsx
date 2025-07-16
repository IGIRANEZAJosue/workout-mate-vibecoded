import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, Dumbbell, Clock } from "lucide-react"
import type { WorkoutProgress } from "../types/workout"

interface ProgressTrackerProps {
  progress: WorkoutProgress[]
}

export default function ProgressTracker({ progress }: ProgressTrackerProps) {
  const getWeeklyData = () => {
    const weeks: { [key: string]: WorkoutProgress[] } = {}

    progress.forEach((p) => {
      const date = new Date(p.date)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const weekKey = weekStart.toISOString().split("T")[0]

      if (!weeks[weekKey]) weeks[weekKey] = []
      weeks[weekKey].push(p)
    })

    return Object.entries(weeks)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .slice(0, 4)
  }

  const getStats = () => {
    const totalWorkouts = progress.length
    const totalDuration = progress.reduce((sum, p) => sum + p.duration, 0)
    const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0

    const thisWeek = progress.filter((p) => {
      const progressDate = new Date(p.date)
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      return progressDate >= weekStart
    })

    return {
      totalWorkouts,
      totalDuration,
      avgDuration,
      thisWeekWorkouts: thisWeek.length,
    }
  }

  const stats = getStats()
  const weeklyData = getWeeklyData()

  const getMuscleGroupColor = (muscleGroup: string) => {
    const colors = {
      chest: "bg-red-100 text-red-800",
      back: "bg-blue-100 text-blue-800",
      legs: "bg-green-100 text-green-800",
      shoulders: "bg-yellow-100 text-yellow-800",
      arms: "bg-purple-100 text-purple-800",
      cardio: "bg-orange-100 text-orange-800",
    }
    return colors[muscleGroup as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Workouts</p>
                <p className="text-2xl font-bold">{stats.totalWorkouts}</p>
              </div>
              <Dumbbell className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold">{stats.thisWeekWorkouts}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Time</p>
                <p className="text-2xl font-bold">{Math.round(stats.totalDuration / 60)}h</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold">{stats.avgDuration}m</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {weeklyData.map(([weekStart, workouts]) => {
              const weekDate = new Date(weekStart)
              const weekEnd = new Date(weekDate)
              weekEnd.setDate(weekEnd.getDate() + 6)

              return (
                <div key={weekStart} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">
                      {weekDate.toLocaleDateString()} - {weekEnd.toLocaleDateString()}
                    </h3>
                    <Badge variant="secondary">{workouts.length} workouts</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {workouts.map((workout, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{workout.workoutName}</span>
                          <Badge variant="secondary" className={`text-xs ${getMuscleGroupColor(workout.day)}`}>
                            {workout.day}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>{new Date(workout.date).toLocaleDateString()}</span>
                          <span>{workout.duration}min</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {progress.length === 0 && (
            <div className="text-center py-12">
              <Dumbbell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No workouts yet</h3>
              <p className="text-gray-500">Start your first workout to see your progress here!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Workouts */}
      {progress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {progress
                .slice(-10)
                .reverse()
                .map((workout, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{workout.workoutName}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(workout.date).toLocaleDateString()} • {workout.exercises.length} exercises
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{workout.duration}min</p>
                      <Badge variant="secondary" className="text-xs">
                        {workout.day}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
