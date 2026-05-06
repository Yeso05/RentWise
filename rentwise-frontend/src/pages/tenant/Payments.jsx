import { IndianRupee, Search, Clock, Wallet, Download, Filter, ShieldCheck, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TenantPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('25000');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [isProcessing, setIsProcessing] = useState(false);
  const user = JSON.parse(localStorage.getItem("rentwise_user") || "{}");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payments');
      const data = await response.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: user.id || 1, // fallback
          amount: parseFloat(paymentAmount),
          status: 'Paid',
          payment_date: new Date().toISOString()
        })
      });
      if (response.ok) {
        setShowPaymentModal(false);
        fetchPayments();
      } else {
        alert("Payment failed to process");
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert("Error processing payment");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadReceipt = (tx) => {
    const receiptContent = `
========================================
           RENTWISE RECEIPT
========================================
Transaction ID: PAY-${tx.id}
Date: ${new Date(tx.payment_date || tx.due_date || new Date()).toLocaleDateString('en-IN')}
Amount Paid: ₹${parseFloat(tx.amount).toLocaleString('en-IN')}
Status: ${tx.status}
========================================
Thank you for using RentWise!
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_PAY-${tx.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-[var(--navy)]">Loading...</div>
      </div>
    );
  }

  const totalPaid = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--navy)] tracking-tight">Rent Payments</h1>
          <p className="rw-muted mt-1">Manage your rental payments and transaction history</p>
        </div>
        <button onClick={() => setShowPaymentModal(true)} className="rw-btn-primary text-xs uppercase tracking-wider flex items-center gap-2">
          <Wallet size={18} />
          Pay Rent Now
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rw-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-[rgba(16,185,129,0.12)] text-[#0F766E] rounded-xl">
              <Clock size={24} />
            </div>
            <span className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase">Next Due</span>
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--ink-subtle)] uppercase mb-1">Upcoming Payment</p>
            <h2 className="text-3xl font-bold text-[var(--navy)]">₹25,000</h2>
            <p className="text-xs text-[#B45309] font-bold mt-4 uppercase">Due on 10 April 2024</p>
          </div>
        </div>

        <div className="rw-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-[rgba(181,155,114,0.12)] text-[var(--navy)] rounded-xl">
              <ShieldCheck size={24} />
            </div>
            <span className="text-[10px] font-bold text-[var(--ink-subtle)] uppercase">Total Paid</span>
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--ink-subtle)] uppercase mb-1">Total Settlement</p>
            <h2 className="text-3xl font-bold text-[var(--navy)]">₹{totalPaid.toLocaleString('en-IN', {maximumFractionDigits: 0})}</h2>
            <p className="text-xs text-[var(--ink-subtle)] font-bold mt-4 uppercase">Year to Date 2024</p>
          </div>
        </div>
      </div>

      <div className="rw-panel overflow-hidden">
        <div className="p-6 border-b border-[var(--gray-pale)] flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--navy)]">Payment History</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-subtle)]" size={16} />
              <input type="text" placeholder="Search..." className="rw-input py-2 pl-10 pr-4 text-xs w-64" />
            </div>
            <button className="p-2 border border-[var(--gray-pale)] rounded-lg">
              <Filter size={18} className="text-[var(--ink-subtle)]" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left rw-table">
            <thead>
              <tr className="border-b border-[var(--gray-pale)]">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Purpose</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gray-pale)]">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-[var(--ink-subtle)]">
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.map((tx) => (
                  <tr key={tx.id} className="transition-colors group">
                    <td className="px-6 py-5 text-xs font-bold text-[var(--ink-subtle)]">PAY-{tx.id}</td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-[var(--navy)]">Monthly Rent</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs text-[var(--ink-subtle)]">
                        {tx.due_date ? new Date(tx.due_date).toLocaleDateString('en-IN') : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[10px] font-bold uppercase px-2 py-1 rounded border border-[var(--gray-pale)]">Bank Transfer</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1 text-[#0F766E] font-bold">
                        <IndianRupee size={16} />
                        <span>{parseInt(tx.amount || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          tx.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`} />
                        <span className={`text-[10px] font-bold ${
                          tx.status === 'Paid' ? 'text-[#0F766E]' : 'text-[#B45309]'
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button onClick={() => handleDownloadReceipt(tx)} className="p-2 hover:bg-[rgba(28,47,63,0.04)] rounded-lg">
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[rgba(28,47,63,0.25)] backdrop-blur-sm">
           <div className="w-full max-w-md rw-panel p-10 animate-fade-in-up relative">
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-6 right-6 p-2 rounded-lg text-[var(--ink-subtle)] hover:text-[var(--navy)] transition-all"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold text-[var(--navy)] mb-6">Process Payment</h2>
              <form onSubmit={handlePaymentSubmit} className="space-y-6 text-left">
                 <div>
                    <label className="rw-label-text mb-2 block">Amount to Pay (₹)</label>
                    <input 
                      type="number" 
                      className="rw-input" 
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      required
                    />
                 </div>
                 <div>
                    <label className="rw-label-text mb-2 block">Payment Method</label>
                    <select 
                      className="rw-select appearance-none h-[54px]"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                      <option value="UPI">UPI</option>
                      <option value="Credit Card">Credit Card</option>
                    </select>
                 </div>
                 <button 
                  type="submit"
                  disabled={isProcessing}
                  className="w-full rw-btn-primary mt-6 uppercase tracking-widest text-xs flex justify-center"
                >
                  {isProcessing ? 'Processing...' : 'Confirm Payment'}
                </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
