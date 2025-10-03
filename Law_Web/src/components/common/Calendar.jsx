"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "../../assets/icons/Icons.jsx"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const Calendar = ({ className = "", mode = "single", selected, onSelect, initialFocus = false, onDateSelect, ...props }) => {
  const [viewDate, setViewDate] = useState(new Date())

  const handleSelect = (date, event) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    if (mode === "single") {
      onSelect(date)
      if (onDateSelect) {
        onDateSelect(date)
      }
    }
  }

  const isSelected = (date) => {
    if (!selected) return false
    if (mode === "single") {
      return date.toDateString() === selected.toDateString()
    }
    return false
  }

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const renderDays = () => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isToday = date.toDateString() === new Date().toDateString()

      days.push(
        <button
          key={day}
          type="button"
          className={`h-9 w-9 rounded-md p-0 font-normal aria-selected:opacity-100 ${
            isSelected(date)
              ? "bg-primary text-primary-foreground"
              : isToday
                ? "bg-accent text-accent-foreground"
                : "text-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
          onClick={(e) => handleSelect(date, e)}
        >
          {day}
        </button>,
      )
    }

    return days
  }

  const nextMonth = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  const prevMonth = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }

  return (
    <div className={`p-3 ${className}`} {...props}>
      <div className="flex justify-between mb-2">
        <button type="button" onClick={(e) => prevMonth(e)} className="p-1 rounded-md hover:bg-accent">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div>
          {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
        </div>
        <button type="button" onClick={(e) => nextMonth(e)} className="p-1 rounded-md hover:bg-accent">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {DAYS.map((day) => (
          <div key={day} className="h-9 w-9 flex items-center justify-center text-muted-foreground">
            {day.charAt(0)}
          </div>
        ))}
        {renderDays()}
      </div>
    </div>
  )
}

export default Calendar
