import React from 'react'
import { Link } from 'react-router-dom'

export default function LawyerCard({ lawyer }) {
  const firstName = lawyer?.firstname || ''
  const lastName = lawyer?.lastname || ''
  const fullName = `${firstName} ${lastName}`.trim() || 'Unnamed Lawyer'
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'L'
  const occupation = lawyer?.occupation || 'Lawyer'
  const email = lawyer?.email || ''
  const location = lawyer?.city || lawyer?.location || ''
  const rating = typeof lawyer?.rating === 'number' ? lawyer.rating : null

  return (
    <div className="relative rounded-2xl border bg-white shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group">
      <div className="absolute inset-x-0 -top-12 h-24 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-indigo-600/10 text-indigo-700 flex items-center justify-center font-semibold">
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold leading-tight truncate">{fullName}</h3>
            <p className="text-sm text-gray-500 truncate">{occupation}</p>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600 break-all truncate">{email}</div>

        <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
          {location && <span className="px-2 py-1 rounded-full bg-gray-100">{location}</span>}
          {typeof rating === 'number' && (
            <span className="px-2 py-1 rounded-full bg-yellow-50 text-yellow-700">⭐ {rating.toFixed(1)}</span>
          )}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <Link
            to={`/lawyers/${lawyer._id}`}
            className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50"
          >
            View Profile
          </Link>
          <Link
            to={`/lawyers/${lawyer._id}/book`}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Book
          </Link>
        </div>
      </div>
    </div>
  )
}


