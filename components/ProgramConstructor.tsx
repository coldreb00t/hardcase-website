'use client'

import { useState } from 'react'
import { Plus, Trash2, GripVertical, X } from 'lucide-react'

interface Exercise {
  name: string
  sets: number
  reps: string
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

interface ProgramConstructorProps {
  initialData?: ProgramData
  onSave: (data: ProgramData) => void
  onCancel: () => void
}

const DAYS_OF_WEEK = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресенье'
]

export default function ProgramConstructor({
  initialData,
  onSave,
  onCancel
}: ProgramConstructorProps) {
  const [programData, setProgramData] = useState<ProgramData>(
    initialData || {
      weeks: [{ week_number: 1, workouts: [] }],
      general_notes: ''
    }
  )

  const [currentWeek, setCurrentWeek] = useState(0)

  const addWeek = () => {
    setProgramData({
      ...programData,
      weeks: [
        ...programData.weeks,
        { week_number: programData.weeks.length + 1, workouts: [] }
      ]
    })
  }

  const removeWeek = (weekIndex: number) => {
    if (programData.weeks.length === 1) return
    setProgramData({
      ...programData,
      weeks: programData.weeks.filter((_, i) => i !== weekIndex)
    })
    if (currentWeek >= programData.weeks.length - 1) {
      setCurrentWeek(Math.max(0, currentWeek - 1))
    }
  }

  const addWorkout = () => {
    const newWeeks = [...programData.weeks]
    newWeeks[currentWeek].workouts.push({
      day: 'Понедельник',
      title: '',
      exercises: []
    })
    setProgramData({ ...programData, weeks: newWeeks })
  }

  const removeWorkout = (workoutIndex: number) => {
    const newWeeks = [...programData.weeks]
    newWeeks[currentWeek].workouts = newWeeks[currentWeek].workouts.filter(
      (_, i) => i !== workoutIndex
    )
    setProgramData({ ...programData, weeks: newWeeks })
  }

  const updateWorkout = (
    workoutIndex: number,
    field: keyof Workout,
    value: any
  ) => {
    const newWeeks = [...programData.weeks]
    newWeeks[currentWeek].workouts[workoutIndex] = {
      ...newWeeks[currentWeek].workouts[workoutIndex],
      [field]: value
    }
    setProgramData({ ...programData, weeks: newWeeks })
  }

  const addExercise = (workoutIndex: number) => {
    const newWeeks = [...programData.weeks]
    newWeeks[currentWeek].workouts[workoutIndex].exercises.push({
      name: '',
      sets: 3,
      reps: '10-12',
      rest_seconds: 90,
      notes: '',
      video_url: '',
      difficulty: 'intermediate'
    })
    setProgramData({ ...programData, weeks: newWeeks })
  }

  const removeExercise = (workoutIndex: number, exerciseIndex: number) => {
    const newWeeks = [...programData.weeks]
    newWeeks[currentWeek].workouts[workoutIndex].exercises = newWeeks[
      currentWeek
    ].workouts[workoutIndex].exercises.filter((_, i) => i !== exerciseIndex)
    setProgramData({ ...programData, weeks: newWeeks })
  }

  const updateExercise = (
    workoutIndex: number,
    exerciseIndex: number,
    field: keyof Exercise,
    value: any
  ) => {
    const newWeeks = [...programData.weeks]
    newWeeks[currentWeek].workouts[workoutIndex].exercises[exerciseIndex] = {
      ...newWeeks[currentWeek].workouts[workoutIndex].exercises[exerciseIndex],
      [field]: value
    }
    setProgramData({ ...programData, weeks: newWeeks })
  }

  const handleSave = () => {
    onSave(programData)
  }

  const currentWeekData = programData.weeks[currentWeek]

  return (
    <div className="space-y-6">
      {/* Week Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-700 pb-4">
        <div className="flex gap-2 flex-1 overflow-x-auto">
          {programData.weeks.map((week, index) => (
            <button
              key={index}
              onClick={() => setCurrentWeek(index)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                currentWeek === index
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Неделя {week.week_number}
            </button>
          ))}
        </div>
        <button
          onClick={addWeek}
          className="px-3 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-all flex items-center gap-1"
        >
          <Plus size={16} />
          Неделя
        </button>
        {programData.weeks.length > 1 && (
          <button
            onClick={() => removeWeek(currentWeek)}
            className="px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Workouts in Current Week */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Тренировки - Неделя {currentWeekData.week_number}
          </h3>
          <button
            onClick={addWorkout}
            className="px-3 py-2 bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 rounded-lg transition-all flex items-center gap-1 text-sm"
          >
            <Plus size={16} />
            Добавить тренировку
          </button>
        </div>

        {currentWeekData.workouts.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <p className="text-gray-400">Нет тренировок на этой неделе</p>
            <p className="text-gray-500 text-sm mt-1">
              Добавьте первую тренировку
            </p>
          </div>
        ) : (
          currentWeekData.workouts.map((workout, workoutIndex) => (
            <div
              key={workoutIndex}
              className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6"
            >
              {/* Workout Header */}
              <div className="flex items-start gap-4 mb-4">
                <GripVertical className="text-gray-500 mt-2" size={20} />
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">
                        День недели:
                      </label>
                      <select
                        value={workout.day}
                        onChange={(e) =>
                          updateWorkout(workoutIndex, 'day', e.target.value)
                        }
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {DAYS_OF_WEEK.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">
                        Название тренировки:
                      </label>
                      <input
                        type="text"
                        value={workout.title}
                        onChange={(e) =>
                          updateWorkout(workoutIndex, 'title', e.target.value)
                        }
                        placeholder="Например: Верх тела"
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeWorkout(workoutIndex)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Exercises */}
              <div className="ml-8 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-medium">Упражнения</h4>
                  <button
                    onClick={() => addExercise(workoutIndex)}
                    className="px-2 py-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded text-xs flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Упражнение
                  </button>
                </div>

                {workout.exercises.length === 0 ? (
                  <div className="text-center py-6 bg-gray-900/30 rounded-lg">
                    <p className="text-gray-500 text-sm">Нет упражнений</p>
                  </div>
                ) : (
                  workout.exercises.map((exercise, exerciseIndex) => (
                    <div
                      key={exerciseIndex}
                      className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={exercise.name}
                            onChange={(e) =>
                              updateExercise(
                                workoutIndex,
                                exerciseIndex,
                                'name',
                                e.target.value
                              )
                            }
                            placeholder="Название упражнения"
                            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                          />

                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-gray-500 text-xs mb-1">
                                Подходы
                              </label>
                              <input
                                type="number"
                                value={exercise.sets}
                                onChange={(e) =>
                                  updateExercise(
                                    workoutIndex,
                                    exerciseIndex,
                                    'sets',
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-full px-2 py-1 bg-gray-700/50 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-500 text-xs mb-1">
                                Повторения
                              </label>
                              <input
                                type="text"
                                value={exercise.reps}
                                onChange={(e) =>
                                  updateExercise(
                                    workoutIndex,
                                    exerciseIndex,
                                    'reps',
                                    e.target.value
                                  )
                                }
                                placeholder="8-12"
                                className="w-full px-2 py-1 bg-gray-700/50 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-500 text-xs mb-1">
                                Отдых (сек)
                              </label>
                              <input
                                type="number"
                                value={exercise.rest_seconds}
                                onChange={(e) =>
                                  updateExercise(
                                    workoutIndex,
                                    exerciseIndex,
                                    'rest_seconds',
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-full px-2 py-1 bg-gray-700/50 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                              />
                            </div>
                          </div>

                          <textarea
                            value={exercise.notes}
                            onChange={(e) =>
                              updateExercise(
                                workoutIndex,
                                exerciseIndex,
                                'notes',
                                e.target.value
                              )
                            }
                            placeholder="Заметки (опционально)"
                            rows={2}
                            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
                          />
                        </div>
                        <button
                          onClick={() =>
                            removeExercise(workoutIndex, exerciseIndex)
                          }
                          className="p-1 text-red-400 hover:bg-red-500/20 rounded transition-all"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* General Notes */}
      <div>
        <label className="block text-gray-400 text-sm mb-2">
          Общие заметки к программе:
        </label>
        <textarea
          value={programData.general_notes}
          onChange={(e) =>
            setProgramData({ ...programData, general_notes: e.target.value })
          }
          placeholder="Общие рекомендации, цели программы..."
          rows={4}
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-700">
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all font-medium"
        >
          Сохранить программу
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
        >
          Отмена
        </button>
      </div>
    </div>
  )
}
