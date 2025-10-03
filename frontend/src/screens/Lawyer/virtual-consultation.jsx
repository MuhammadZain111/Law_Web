import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Calendar,
  Clock,
  User,
  Settings,
  Monitor,
  Users,
} from "lucide-react"

const mockSessions = [
  {
    id: "1",
    clientName: "Sarah Mitchell",
    clientEmail: "sarah.mitchell@email.com",
    scheduledDate: "2024-01-15",
    scheduledTime: "09:00",
    duration: 60,
    status: "scheduled",
    meetingType: "video",
    caseNumber: "2024-001",
    notes: "Divorce case consultation - discuss asset division",
  },
  {
    id: "2",
    clientName: "Robert Chen",
    clientEmail: "robert.chen@email.com",
    scheduledDate: "2024-01-15",
    scheduledTime: "11:30",
    duration: 45,
    status: "scheduled",
    meetingType: "video",
    caseNumber: "2024-002",
    notes: "Contract dispute follow-up meeting",
  },
  {
    id: "3",
    clientName: "James Wilson",
    clientEmail: "james.wilson@email.com",
    scheduledDate: "2024-01-14",
    scheduledTime: "14:00",
    duration: 30,
    status: "completed",
    meetingType: "audio",
    caseNumber: "2024-004",
    notes: "Business incorporation consultation completed",
  },
]

export default function VirtualConsultation() {
  const [sessions, setSessions] = useState(mockSessions)
  const [activeSession, setActiveSession] = useState(null)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isInMeeting, setIsInMeeting] = useState(false)

  const handleStartSession = (session) => {
    setActiveSession(session)
    setIsInMeeting(true)
    setSessions((prev) =>
      prev.map((s) =>
        s.id === session.id ? { ...s, status: "in-progress" } : s
      )
    )
  }

  const handleEndSession = () => {
    if (activeSession) {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSession.id ? { ...s, status: "completed" } : s
        )
      )
    }
    setActiveSession(null)
    setIsInMeeting(false)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="secondary">Scheduled</Badge>
      case "in-progress":
        return <Badge variant="default">In Progress</Badge>
      case "completed":
        return <Badge className="bg-primary">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusCount = (status) => {
    return sessions.filter((session) => session.status === status).length
  }

  const todaySessions = sessions.filter(
    (session) => session.scheduledDate === "2024-01-15"
  )
  const upcomingSessions = sessions.filter(
    (session) => session.scheduledDate > "2024-01-15" && session.status === "scheduled"
  )
  const completedSessions = sessions.filter(
    (session) => session.status === "completed"
  )

  if (isInMeeting && activeSession) {
    return (
      <div className="h-screen bg-gray-900 flex flex-col">
        {/* Meeting Header */}
        <div className="bg-gray-800 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{activeSession.clientName}</h3>
              <p className="text-sm text-gray-300">Case #{activeSession.caseNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">
              {activeSession.scheduledTime} • {activeSession.duration} min
            </span>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
          {isVideoEnabled ? (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-center text-white">
                <Video className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg">Video consultation with {activeSession.clientName}</p>
                <p className="text-sm text-gray-400">Video call simulation</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-center text-white">
                <VideoOff className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg">Video is disabled</p>
                <p className="text-sm text-gray-400">Audio-only consultation</p>
              </div>
            </div>
          )}

          {/* Self Video (Picture-in-Picture) */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg border-2 border-gray-600 flex items-center justify-center">
            <div className="text-center text-white">
              <User className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-xs">You</p>
            </div>
          </div>
        </div>

        {/* Meeting Controls */}
        <div className="bg-gray-800 p-4 flex items-center justify-center gap-4">
          <Button
            variant={isAudioEnabled ? "default" : "destructive"}
            size="lg"
            className="rounded-full w-12 h-12 p-0"
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
          >
            {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>

          <Button
            variant={isVideoEnabled ? "default" : "secondary"}
            size="lg"
            className="rounded-full w-12 h-12 p-0"
            onClick={() => setIsVideoEnabled(!isVideoEnabled)}
          >
            {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>

          <Button
            variant="destructive"
            size="lg"
            className="rounded-full w-12 h-12 p-0"
            onClick={handleEndSession}
          >
            <PhoneOff className="h-5 w-5" />
          </Button>

          <Button variant="secondary" size="lg" className="rounded-full w-12 h-12 p-0">
            <Monitor className="h-5 w-5" />
          </Button>

          <Button variant="secondary" size="lg" className="rounded-full w-12 h-12 p-0">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Virtual Consultation</h1>
          <p className="text-muted-foreground">Conduct online meetings with your clients</p>
        </div>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Session
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Sessions</p>
                <p className="text-2xl font-bold">{todaySessions.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">{getStatusCount("scheduled")}</p>
              </div>
              <Clock className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{getStatusCount("in-progress")}</p>
              </div>
              <Video className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{getStatusCount("completed")}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Tabs */}
      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today's Sessions</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {/* Today Tab */}
        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Today's Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaySessions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No consultations scheduled for today.
                  </div>
                ) : (
                  todaySessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                          {session.meetingType === "video" ? (
                            <Video className="h-6 w-6 text-primary" />
                          ) : (
                            <Phone className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{session.clientName}</h3>
                            {getStatusBadge(session.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {session.scheduledTime}
                            </span>
                            <span>{session.duration} minutes</span>
                            {session.caseNumber && <span>Case #{session.caseNumber}</span>}
                          </div>
                          {session.notes && (
                            <p className="text-sm text-muted-foreground italic">
                              {session.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.status === "scheduled" && (
                          <Button onClick={() => handleStartSession(session)}>
                            <Video className="h-4 w-4 mr-2" />
                            Start Session
                          </Button>
                        )}
                        {session.status === "in-progress" && (
                          <Button variant="destructive" onClick={handleEndSession}>
                            <PhoneOff className="h-4 w-4 mr-2" />
                            End Session
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upcoming Tab */}
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Upcoming Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No upcoming consultations scheduled.
                  </div>
                ) : (
                  upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                          {session.meetingType === "video" ? (
                            <Video className="h-6 w-6 text-primary" />
                          ) : (
                            <Phone className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{session.clientName}</h3>
                            {getStatusBadge(session.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {session.scheduledDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {session.scheduledTime}
                            </span>
                            <span>{session.duration} minutes</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline">View Details</Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Completed Tab */}
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Completed Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-full">
                        {session.meetingType === "video" ? (
                          <Video className="h-6 w-6 text-muted-foreground" />
                        ) : (
                          <Phone className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{session.clientName}</h3>
                          {getStatusBadge(session.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {session.scheduledDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {session.scheduledTime}
                          </span>
                          <span>{session.duration} minutes</span>
                        </div>
                        {session.notes && (
                          <p className="text-sm text-muted-foreground italic">
                            {session.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button variant="outline">View Recording</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
