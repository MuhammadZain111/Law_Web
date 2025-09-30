import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
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
} from "lucide-react"

// ✅ Mock Transactions Data
const mockTransactions = [
  {
    id: "1",
    clientName: "Sarah Mitchell",
    clientEmail: "sarah.mitchell@email.com",
    caseNumber: "2024-001",
    serviceDescription: "Divorce consultation and filing fees",
    amount: 2500.0,
    paymentMethod: "credit_card",
    status: "completed",
    transactionDate: "2024-01-12",
    dueDate: "2024-01-10",
    invoiceNumber: "INV-2024-001",
    notes: "Payment processed successfully",
  },
  {
    id: "2",
    clientName: "Robert Chen",
    clientEmail: "robert.chen@email.com",
    caseNumber: "2024-002",
    serviceDescription: "Contract dispute legal services",
    amount: 1800.0,
    paymentMethod: "bank_transfer",
    status: "pending",
    transactionDate: "2024-01-15",
    dueDate: "2024-01-20",
    invoiceNumber: "INV-2024-002",
    notes: "Awaiting bank transfer confirmation",
  },
  {
    id: "3",
    clientName: "Maria Rodriguez",
    clientEmail: "maria.rodriguez@email.com",
    caseNumber: "2024-003",
    serviceDescription: "Real estate transaction review",
    amount: 1200.0,
    paymentMethod: "check",
    status: "completed",
    transactionDate: "2024-01-08",
    dueDate: "2024-01-05",
    invoiceNumber: "INV-2024-003",
    notes: "Check cleared successfully",
  },
  {
    id: "4",
    clientName: "James Wilson",
    clientEmail: "james.wilson@email.com",
    caseNumber: "2024-004",
    serviceDescription: "Business incorporation services",
    amount: 950.0,
    paymentMethod: "credit_card",
    status: "failed",
    transactionDate: "2024-01-14",
    dueDate: "2024-01-15",
    invoiceNumber: "INV-2024-004",
    notes: "Payment declined - insufficient funds",
  },
]

export function PaymentStatus() {
  const [transactions, setTransactions] = useState(mockTransactions)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // ✅ Mark as completed
  const handleVerifyPayment = (transactionId) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === transactionId ? { ...transaction, status: "completed" } : transaction
      )
    )
  }

  // ✅ Mark as refunded
  const handleRefundPayment = (transactionId) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === transactionId ? { ...transaction, status: "refunded" } : transaction
      )
    )
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Payment Status</h1>
          <p className="text-muted-foreground">Track and verify client payments</p>
        </div>
        <Button>
          <DollarSign className="h-4 w-4 mr-2" />
          Generate Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">${getTotalRevenue()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Payments</p>
              <p className="text-2xl font-bold">${getPendingAmount()}</p>
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
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
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
            {filteredTransactions.length === 0 ? (
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
                      <p className="text-lg font-bold">${transaction.amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Due: {transaction.dueDate}</p>
                    </div>
                    <div className="flex gap-2">
                      {/* View Details */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedTransaction(transaction)}>
                            <Eye className="h-4 w-4" />
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
                                    ${selectedTransaction.amount.toFixed(2)}
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
                            <Button variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              Download Invoice
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {/* Verify / Refund */}
                      {transaction.status === "pending" && (
                        <Button size="sm" onClick={() => handleVerifyPayment(transaction.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" /> Verify
                        </Button>
                      )}
                      {transaction.status === "completed" && (
                        <Button size="sm" variant="outline" onClick={() => handleRefundPayment(transaction.id)}>
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
