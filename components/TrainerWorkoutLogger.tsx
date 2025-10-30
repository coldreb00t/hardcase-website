'use client'

import { useState } from 'react'
import { Save, X } from 'lucide-react'

interface SetLog {
  reps: number
  weight_kg: number
  rpe: number // Rate of Perceived Exertion (1-10)
}

interface ExerciseLog {
  exercise_name: string
  sets_completed: SetLog[]
}

interface TrainerWorkoutLoggerProps {
  clientId: string
  clientName: string
  programId: string
  plannedExercises: {
    name: string
    sets: number
    reps: string
    weight_kg: number
  }[]
  onSave: (sessionData: {
    exercises_completed: ExerciseLog[]
    duration_minutes: number
    notes: string
  }) => Promise<void>
  onCancel: () => void
}

export default function TrainerWorkoutLogger({
  clientId,
  clientName,
  programId,
  plannedExercises,
  onSave,
  onCancel
}: TrainerWorkoutLoggerProps) {
  const [sessionData, setSessionData] = useState<ExerciseLog[]>(
    plannedExercises.map((ex) => ({
      exercise_name: ex.name,
      sets_completed: Array.from({ length: ex.sets }, () => ({
        reps: parseInt(ex.reps.split('-')[0]) || 0,
        weight_kg: ex.weight_kg,
        rpe: 5
      }))
    }))
  )

  const [duration, setDuration] = useState(60)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const updateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: keyof SetLog,
    value: number
  ) => {
    const newData = [...sessionData]
    newData[exerciseIndex].sets_completed[setIndex][field] = value
    setSessionData(newData)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave({
        exercises_completed: sessionData,
        duration_minutes: duration,
        notes
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-2xl p-6 max-w-4xl w-full border border-gray-700 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">
              Запись тренировки
            </h3>
            <p className="text-gray-400 mt-1">
              Клиент: <span className="text-white">{clientName}</span>
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Duration */}
        <div className="mb-6 bg-gray-700/30 rounded-lg p-4">
          <label className="block text-gray-400 text-sm mb-2">
            Длительность тренировки (минут): *
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Exercises */}
        <div className="space-y-6 mb-6">
          {sessionData.map((exercise, exerciseIndex) => (
            <div
              key={exerciseIndex}
              className="bg-gray-700/30 rounded-lg p-4 border border-gray-600"
            >
              <h4 className="text-white font-bold text-lg mb-4">
                {exerciseIndex + 1}. {exercise.exercise_name}
              </h4>

              <div className="space-y-3">
                {exercise.sets_completed.map((set, setIndex) => (
                  <div
                    key={setIndex}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-gray-800/50 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm font-medium w-20">
                        Подход {setIndex + 1}:
                      </span>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">
                        Повторения
                      </label>
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) =>
                          updateSet(
                            exerciseIndex,
                            setIndex,
                            'reps',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 text-xs mb-1">
                        Вес (кг)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={set.weight_kg}
                        onChange={(e) =>
                          updateSet(
                            exerciseIndex,
                            setIndex,
                            'weight_kg',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 text-xs mb-1">
                        RPE (1-10)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={set.rpe}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1
                          updateSet(
                            exerciseIndex,
                            setIndex,
                            'rpe',
                            Math.min(10, Math.max(1, value))
                          )
                        }}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-gray-400 text-sm mb-2">
            Заметки о тренировке:
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Общие комментарии, наблюдения, рекомендации..."
            rows={4}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-700">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-600 text-white rounded-lg transition-all font-medium flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {saving ? 'Сохранение...' : 'Сохранить тренировку'}
          </button>
          <button
            onClick={onCancel}
            disabled={saving}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 text-white rounded-lg transition-all"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  )
}

