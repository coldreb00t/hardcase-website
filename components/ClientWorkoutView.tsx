'use client'

import { useState } from 'react'
import { Dumbbell, Calendar, Clock, Info } from 'lucide-react'
import type { Database } from '@/supabase/types/database.types'

type WorkoutProgram = Database['public']['Tables']['workout_programs']['Row']

interface Exercise {
  name: string
  sets: number
  reps: string
  weight_kg: number
  rest_seconds: number
  notes: string
  video_url: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

interface Workout {
  day: string
  title: string
  exercises: Exercise[]
}

interface Week {
  week_number: number
  workouts: Workout[]
}

interface ProgramData {
  weeks: Week[]
  general_notes: string
}

interface ClientWorkoutViewProps {
  program: WorkoutProgram
}

const DAYS_MAP: { [key: string]: string } = {
  'Понедельник': 'monday',
  'Вторник': 'tuesday',
  'Среда': 'wednesday',
  'Четверг': 'thursday',
  'Пятница': 'friday',
  'Суббота': 'saturday',
  'Воскресенье': 'sunday'
}

const getDayOfWeek = () => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[new Date().getDay()]
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'text-green-400 bg-green-500/20'
    case 'intermediate':
      return 'text-yellow-400 bg-yellow-500/20'
    case 'advanced':
      return 'text-red-400 bg-red-500/20'
    default:
      return 'text-gray-400 bg-gray-500/20'
  }
}

const getDifficultyLabel = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'Начальный'
    case 'intermediate':
      return 'Средний'
    case 'advanced':
      return 'Продвинутый'
    default:
      return difficulty
  }
}

export default function ClientWorkoutView({ program }: ClientWorkoutViewProps) {
  const [selectedWeek, setSelectedWeek] = useState(0)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const programData = program.program_data as ProgramData

  if (!programData || !programData.weeks || programData.weeks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Программа тренировок пока не назначена</p>
      </div>
    )
  }

  const currentWeek = programData.weeks[selectedWeek]
  const todayDay = getDayOfWeek()
  const todayWorkout = currentWeek?.workouts.find(
    (w) => DAYS_MAP[w.day] === todayDay
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-2">{program.title}</h2>
        {program.description && (
          <p className="text-gray-400 mb-4">{program.description}</p>
        )}
        
        {/* Week selector */}
        <div className="flex gap-2 flex-wrap">
          {programData.weeks.map((week, index) => (
            <button
              key={index}
              onClick={() => setSelectedWeek(index)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedWeek === index
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Неделя {week.week_number}
            </button>
          ))}
        </div>
      </div>

      {/* Today's Workout Highlight */}
      {todayWorkout && (
        <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="text-primary-400" size={20} />
            <h3 className="text-lg font-bold text-white">Тренировка сегодня</h3>
          </div>
          <p className="text-primary-300 font-medium text-xl mb-1">
            {todayWorkout.title}
          </p>
          <p className="text-gray-400 text-sm">
            {todayWorkout.exercises.length} упражнений
          </p>
        </div>
      )}

      {/* Workouts List */}
      <div className="space-y-4">
        {currentWeek?.workouts.map((workout, workoutIndex) => (
          <div
            key={workoutIndex}
            className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden"
          >
            {/* Workout Header */}
            <button
              onClick={() =>
                setSelectedDay(selectedDay === workout.day ? null : workout.day)
              }
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-12 rounded-full ${
                    DAYS_MAP[workout.day] === todayDay
                      ? 'bg-primary-500'
                      : 'bg-gray-600'
                  }`}
                />
                <div className="text-left">
                  <p className="text-white font-bold">{workout.day}</p>
                  <p className="text-gray-400 text-sm">{workout.title}</p>
                </div>
              </div>
              <div className="text-gray-400 text-sm">
                {workout.exercises.length} упр.
              </div>
            </button>

            {/* Exercises List */}
            {selectedDay === workout.day && (
              <div className="px-6 pb-4 space-y-4">
                {workout.exercises.map((exercise, exerciseIndex) => (
                  <div
                    key={exerciseIndex}
                    className="bg-gray-700/30 rounded-lg p-4 border border-gray-600"
                  >
                    {/* Exercise Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-lg mb-1">
                          {exerciseIndex + 1}. {exercise.name}
                        </h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs px-2 py-1 rounded ${getDifficultyColor(
                              exercise.difficulty
                            )}`}
                          >
                            {getDifficultyLabel(exercise.difficulty)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Exercise Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <p className="text-gray-400 text-xs mb-1">Подходы</p>
                        <p className="text-white font-bold text-lg">
                          {exercise.sets}
                        </p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <p className="text-gray-400 text-xs mb-1">Повторения</p>
                        <p className="text-white font-bold text-lg">
                          {exercise.reps}
                        </p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <p className="text-gray-400 text-xs mb-1">Вес</p>
                        <p className="text-white font-bold text-lg">
                          {exercise.weight_kg} кг
                        </p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3 flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Отдых</p>
                          <p className="text-white font-bold text-sm">
                            {exercise.rest_seconds}с
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {exercise.notes && (
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex gap-2">
                        <Info size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-blue-200 text-sm">{exercise.notes}</p>
                      </div>
                    )}

                    {/* Video Link */}
                    {exercise.video_url && (
                      <a
                        href={exercise.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block px-4 py-2 bg-primary-500/20 text-primary-300 rounded-lg hover:bg-primary-500/30 transition-all text-sm"
                      >
                        📹 Видео техники
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* General Notes */}
      {programData.general_notes && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
            <Info size={20} />
            Общие рекомендации
          </h3>
          <p className="text-yellow-200 whitespace-pre-wrap">
            {programData.general_notes}
          </p>
        </div>
      )}
    </div>
  )
}

