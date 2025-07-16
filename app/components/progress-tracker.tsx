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
      chest: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      back: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      legs: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      shoulders: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      arms: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      cardio: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    }
    return (
      colors[muscleGroup as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400"
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Workouts</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalWorkouts}</p>
              </div>
              <Dumbbell className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold text-foreground">{stats.thisWeekWorkouts}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Time</p>
                <p className="text-2xl font-bold text-foreground">{Math.round(stats.totalDuration / 60)}h</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Duration</p>
                <p className="text-2xl font-bold text-foreground">{stats.avgDuration}m</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Weekly Progress</CardTitle>
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
                    <h3 className="font-semibold text-foreground">
                      {weekDate.toLocaleDateString()} - {weekEnd.toLocaleDateString()}
                    </h3>
                    <Badge variant="secondary" className="bg-muted text-muted-foreground">
                      {workouts.length} workouts
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {workouts.map((workout, idx) => (
                      <div key={idx} className="bg-muted/50 rounded-lg p-3 border border-border/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm text-foreground">{workout.workoutName}</span>
                          <Badge variant="secondary" className={`text-xs ${getMuscleGroupColor(workout.day)}`}>
                            {workout.day}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
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
              <Dumbbell className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No workouts yet</h3>
              <p className="text-muted-foreground">Start your first workout to see your progress here!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Workouts */}
      {progress.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {progress
                .slice(-10)
                .reverse()
                .map((workout, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/30"
                  >
                    <div>
                      <h4 className="font-medium text-foreground">{workout.workoutName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(workout.date).toLocaleDateString()} • {workout.exercises.length} exercises
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{workout.duration}min</p>
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
