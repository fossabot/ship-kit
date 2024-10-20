"use client"

import { useState, useRef, useEffect } from 'react'
import { Check, Clock, ChevronRight, Star, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Event {
  id: string
  title: string
  date: Date
  type: 'reminder' | 'todo' | 'calendar'
  description?: string
}

// Current date for demo purposes
const currentDate = new Date(2023, 5, 15, 12, 0)

const allEvents: Event[] = [
  { id: '1', title: 'Team Meeting', date: new Date(2023, 5, 15, 14, 0), type: 'calendar', description: 'Discuss project progress and next steps' },
  { id: '2', title: 'Buy groceries', date: new Date(2023, 5, 15, 16, 0), type: 'todo' },
  { id: '3', title: 'Dentist Appointment', date: new Date(2023, 5, 15, 17, 30), type: 'calendar', description: 'Regular checkup' },
  { id: '4', title: 'Call Mom', date: new Date(2023, 5, 15, 19, 0), type: 'reminder' },
  { id: '5', title: 'Gym Session', date: new Date(2023, 5, 15, 20, 0), type: 'calendar', description: 'Leg day' },
  { id: '6', title: 'Submit Report', date: new Date(2023, 5, 14, 17, 0), type: 'todo', description: 'Finish and submit quarterly report' },
  { id: '7', title: 'Pay Bills', date: new Date(2023, 5, 13, 10, 0), type: 'reminder', description: 'Pay electricity and water bills' },
  { id: '8', title: 'Book Flight', date: new Date(2023, 5, 12, 9, 0), type: 'todo', description: 'Book flight for next month\'s conference' },
]

const suggestedTask: Event = {
  id: 'suggested',
  title: 'Review Project Proposal',
  date: new Date(2023, 5, 15, 15, 0),
  type: 'todo',
  description: 'Go through the project proposal and prepare feedback for the team meeting'
}

function getOverdueStatus(date: Date): string {
  const diffInHours = (currentDate.getTime() - date.getTime()) / (1000 * 60 * 60)
  if (diffInHours < 24) return 'text-yellow-600 bg-yellow-50'
  if (diffInHours < 48) return 'text-orange-600 bg-orange-50'
  return 'text-red-600 bg-red-50'
}

export function DailyEventsUpdated() {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)
  const [completedEvents, setCompletedEvents] = useState<string[]>([])
  const [overdueVisible, setOverdueVisible] = useState(true)

  const toggleExpand = (id: string) => {
    setExpandedEvent(expandedEvent === id ? null : id)
  }

  const completeEvent = (id: string) => {
    setCompletedEvents([...completedEvents, id])
  }

  const snoozeEvent = (id: string) => {
    console.log(`Snoozed event ${id}`)
  }

  const todayEvents = allEvents.filter(event => event.date >= currentDate).slice(0, 4)
  const overdueEvents = allEvents.filter(event => event.date < currentDate).slice(0, 3)

  return (
    <div className="w-[720px] h-[1280px] bg-gradient-to-b from-gray-50 to-gray-100 p-6 font-sans overflow-hidden relative">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Today's Events</h1>
      
      {/* Featured Suggested Task */}
      <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-blue-800 flex items-center">
            <Star className="w-5 h-5 mr-2 text-blue-500" />
            Suggested Task
          </h2>
          <span className="text-sm text-blue-600">{suggestedTask.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
        <p className="text-blue-700 mb-2">{suggestedTask.title}</p>
        <p className="text-sm text-blue-600">{suggestedTask.description}</p>
        <div className="mt-3 flex space-x-2">
          <button
            onClick={() => completeEvent(suggestedTask.id)}
            className="flex items-center justify-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors duration-300"
          >
            <Check className="w-4 h-4 mr-1" />
            Complete
          </button>
          <button
            onClick={() => snoozeEvent(suggestedTask.id)}
            className="flex items-center justify-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors duration-300"
          >
            <Clock className="w-4 h-4 mr-1" />
            Snooze
          </button>
        </div>
      </div>

      {/* Today's Events */}
      <div className="space-y-4 mb-6">
        {todayEvents.map((event) => (
          <div
            key={event.id}
            className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 ease-in-out ${
              expandedEvent === event.id ? 'h-32' : 'h-16'
            } ${completedEvents.includes(event.id) ? 'opacity-50' : ''}`}
          >
            <div
              className="h-16 px-4 flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpand(event.id)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  event.type === 'reminder' ? 'bg-blue-400' :
                  event.type === 'todo' ? 'bg-green-400' : 'bg-purple-400'
                }`} />
                <span className="text-sm font-medium text-gray-700">
                  {event.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
                <span className="text-base text-gray-900">{event.title}</span>
              </div>
              <ChevronRight
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                  expandedEvent === event.id ? 'transform rotate-90' : ''
                }`}
              />
            </div>
            {expandedEvent === event.id && (
              <div className="px-4 pb-4">
                <p className="text-sm text-gray-600 mb-2">{event.description || 'No additional details'}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => completeEvent(event.id)}
                    className="flex items-center justify-center px-3 py-1 bg-green-50 text-green-700 rounded-md text-sm hover:bg-green-100 transition-colors duration-300"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Complete
                  </button>
                  <button
                    onClick={() => snoozeEvent(event.id)}
                    className="flex items-center justify-center px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm hover:bg-blue-100 transition-colors duration-300"
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    Snooze
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Overdue Events */}
      <AnimatePresence>
        {overdueVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 right-6 z-50"
          >
            <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Overdue Tasks</h2>
                <button
                  onClick={() => setOverdueVisible(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {overdueEvents.map((event, index) => (
                <div
                  key={event.id}
                  className={`${getOverdueStatus(event.date)} rounded-lg p-4 ${
                    index === 0 ? '' : 'mt-2'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{event.title}</span>
                    <span className="text-sm">
                      {event.date.toLocaleDateString()} {event.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <p className="text-sm">{event.description || 'No additional details'}</p>
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => completeEvent(event.id)}
                      className="flex items-center justify-center px-3 py-1 bg-white bg-opacity-50 rounded-md text-sm hover:bg-opacity-75 transition-colors duration-300"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Complete
                    </button>
                    <button
                      onClick={() => snoozeEvent(event.id)}
                      className="flex items-center justify-center px-3 py-1 bg-white bg-opacity-50 rounded-md text-sm hover:bg-opacity-75 transition-colors duration-300"
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      Snooze
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}