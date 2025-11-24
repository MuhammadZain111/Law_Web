import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { appointmentAPI } from '@/services/api'
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useToast } from "../../hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import {
  DollarSign,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  User,
  Calendar,
  XCircle,
} from "lucide-react"

export function PaymentStatus() {
  const [transactions, setTransactions] = useState([])
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Get current lawyer ID from token
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return null
      const [, payload] = String(token).split('.')
      if (!payload) return null
      const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')) || '{}')
      return json?.id || json?.userId || null
    } catch (_e) {
      return null
    }
  }

  // Convert appointment to transaction format
  const convertAppointmentToTransaction = (appointment) => {
    const appointmentId = appointment._id || appointment.id
    const appointmentDate = new Date(appointment.appointmentDate || appointment.createdAt)
    
    // Map paymentStatus to transaction status
    let status = "pending"
    if (appointment.paymentStatus === "paid") {
      status = "completed"
    } else if (appointment.paymentStatus === "refunded") {
      status = "refunded"
    } else if (appointment.paymentStatus === "unpaid") {
      status = "pending"
    }

    // Generate invoice number from appointment ID
    const invoiceNumber = `INV-${appointmentId.toString().slice(-8).toUpperCase()}`

    // Generate case number
    const caseNumber = appointmentId.toString().slice(-6).toUpperCase()

    // Format payment method
    let paymentMethod = appointment.paymentMethod?.toLowerCase().replace(/\s+/g, '_') || 'unknown'
    if (paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash') {
      paymentMethod = 'bank_transfer'
    } else if (paymentMethod === 'cash_on_meeting') {
      paymentMethod = 'cash'
    } else if (paymentMethod === 'credit_card') {
      paymentMethod = 'credit_card'
    } else if (paymentMethod === 'bank_transfer' || paymentMethod === 'bank') {
      paymentMethod = 'bank_transfer'
    }

    return {
      id: appointmentId.toString(),
      appointmentId: appointmentId.toString(),
      clientName: appointment.clientName || "Unknown Client",
      clientEmail: appointment.clientEmail || "",
      caseNumber: caseNumber,
      serviceDescription: appointment.caseType || appointment.caseDescription || "Legal consultation",
      amount: appointment.consultationFee || 0,
      paymentMethod: paymentMethod,
      status: status,
      transactionDate: appointmentDate.toISOString().split('T')[0],
      dueDate: appointmentDate.toISOString().split('T')[0], // Same as transaction date for now
      invoiceNumber: invoiceNumber,
      notes: appointment.notes || appointment.lawyerNotes || "",
      paymentScreenshot: appointment.paymentScreenshot || appointment.paymentScreenshotFile?.url || null,
      appointmentStatus: appointment.status,
      appointmentDate: appointmentDate
    }
  }

  // Fetch appointments and convert to transactions
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true)
      const response = await appointmentAPI.getAppointments()
      
      if (response.appointments) {
        const currentLawyerId = getUserIdFromToken()
        
        // Filter appointments for current lawyer
        const lawyerAppointments = currentLawyerId
          ? response.appointments.filter((a) => {
              const lid = a.lawyerId?._id || a.lawyerId
              return String(lid) === String(currentLawyerId)
            })
          : response.appointments

        // Convert appointments to transactions
        const transactionsList = lawyerAppointments.map(convertAppointmentToTransaction)
        
        console.log('📊 Payment transactions loaded:', transactionsList.length)
        setTransactions(transactionsList)
      }
    } catch (error) {
      console.error('❌ Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch payments on component mount
  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  // ✅ Mark as completed (update payment status to paid)
  const handleVerifyPayment = async (transactionId) => {
    try {
      const API_BASE = import.meta.env?.VITE_API_BASE || 'http://localhost:5000'
      const token = localStorage.getItem('token')
      
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication required. Please login again.",
          variant: "destructive",
        })
        return
      }
      
      const response = await fetch(`${API_BASE}/api/v1/appointments/${transactionId}/payment-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentStatus: 'paid' })
      })
      
      const data = await response.json().catch(() => ({}))
      
      if (response.ok && data.success) {
        toast({
          title: "Success",
          description: "Payment verified successfully!",
        })
        // Refresh payments
        await fetchPayments()
      } else {
        const errorMessage = data.message || "Failed to verify payment"
        console.error('Error verifying payment:', errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error verifying payment:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to verify payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  // ✅ Mark as refunded
  const handleRefundPayment = async (transactionId) => {
    try {
      // Confirm before refunding
      const confirmed = window.confirm("Are you sure you want to refund this payment? This action cannot be undone.")
      if (!confirmed) {
        return
      }
      
      const API_BASE = import.meta.env?.VITE_API_BASE || 'http://localhost:5000'
      const token = localStorage.getItem('token')
      
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication required. Please login again.",
          variant: "destructive",
        })
        return
      }
      
      console.log('🔄 Refunding payment for transaction:', transactionId)
      
      const response = await fetch(`${API_BASE}/api/v1/appointments/${transactionId}/payment-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentStatus: 'refunded' })
      })
      
      const data = await response.json().catch(() => ({}))
      
      console.log('📥 Refund response:', { status: response.status, data })
      
      if (response.ok && data.success) {
        toast({
          title: "Success",
          description: "Payment refunded successfully!",
        })
        // Refresh payments
        await fetchPayments()
      } else {
        const errorMessage = data.message || "Failed to refund payment"
        console.error('Error refunding payment:', errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error refunding payment:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to refund payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  // ✅ Filters & Search
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus
    const matchesSearch =
      transaction.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // ✅ Status Badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "completed":
        return <Badge variant="default">Completed</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      case "refunded":
        return <Badge variant="outline">Refunded</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // ✅ Payment Method Icon
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "credit_card":
        return <CreditCard className="h-4 w-4" />
      case "bank_transfer":
        return <DollarSign className="h-4 w-4" />
      case "check":
        return <CheckCircle className="h-4 w-4" />
      case "cash":
        return <DollarSign className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  // ✅ Stats helpers
  const getStatusCount = (status) => transactions.filter((t) => t.status === status).length
  const getTotalRevenue = () =>
    transactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.amount, 0).toFixed(2)
  const getPendingAmount = () =>
    transactions.filter((t) => t.status === "pending").reduce((sum, t) => sum + t.amount, 0).toFixed(2)
  
  // Format amount in PKR
  const formatAmount = (amount) => {
    return `Rs. ${Number(amount).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Payment Status</h1>
          <p className="text-muted-foreground">Track and verify client payments</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">{formatAmount(getTotalRevenue())}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Payments</p>
              <p className="text-2xl font-bold">{formatAmount(getPendingAmount())}</p>
            </div>
            <Clock className="h-8 w-8 text-secondary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{getStatusCount("completed")}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold">{getStatusCount("failed")}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-destructive" />
          </CardContent>
        </Card>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by client, case number, or invoice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-2 border-gray-300 hover:border-amber-500 focus:border-amber-500 shadow-sm hover:shadow-md transition-all duration-200"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48 border-2 border-gray-300 hover:border-amber-500 focus:border-amber-500 font-medium shadow-sm hover:shadow-md transition-all duration-200">
            <Filter className="h-4 w-4 mr-2 text-amber-600" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Payment Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading payments...</div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No transactions found.</div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full">
                      {getPaymentMethodIcon(transaction.paymentMethod)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{transaction.clientName}</h3>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{transaction.serviceDescription}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" /> Case #{transaction.caseNumber}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {transaction.transactionDate}
                        </span>
                        <span>Invoice #{transaction.invoiceNumber}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold">{formatAmount(transaction.amount)}</p>
                      <p className="text-sm text-muted-foreground">Due: {transaction.dueDate}</p>
                    </div>
                    <div className="flex gap-2">
                      {/* View Details */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setSelectedTransaction(transaction)}
                            className="border-2 border-amber-500 text-amber-600 hover:bg-amber-50 hover:border-amber-600 hover:text-amber-700 font-semibold px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Transaction Details</DialogTitle>
                            <DialogDescription>Invoice #{transaction.invoiceNumber}</DialogDescription>
                          </DialogHeader>
                          {selectedTransaction && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium">Client</p>
                                  <p className="text-sm text-muted-foreground">{selectedTransaction.clientName}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Amount</p>
                                  <p className="text-sm text-muted-foreground">
                                    {formatAmount(selectedTransaction.amount)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Payment Method</p>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedTransaction.paymentMethod.replace("_", " ")}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Status</p>
                                  {getStatusBadge(selectedTransaction.status)}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Service Description</p>
                                <p className="text-sm text-muted-foreground">{selectedTransaction.serviceDescription}</p>
                              </div>
                              {selectedTransaction.notes && (
                                <div>
                                  <p className="text-sm font-medium">Notes</p>
                                  <p className="text-sm text-muted-foreground">{selectedTransaction.notes}</p>
                                </div>
                              )}
                            </div>
                          )}
                          <DialogFooter>
                            <Button 
                              variant="outline"
                              className="border-2 border-amber-600 text-amber-600 hover:bg-amber-50 hover:border-amber-700 hover:text-amber-700 font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Invoice
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {/* Verify / Refund */}
                      {transaction.status === "pending" && (
                        <Button 
                          size="sm" 
                          onClick={() => handleVerifyPayment(transaction.id)}
                          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-0"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> 
                          Verify Payment
                        </Button>
                      )}
                      {transaction.status === "completed" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleRefundPayment(transaction.id)}
                          className="border-2 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 hover:text-red-700 font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Refund
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
