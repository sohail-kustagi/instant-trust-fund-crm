import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  Clock, 
  AlertCircle,
  Activity
} from 'lucide-react';

export const Customer360 = ({ customerId }: { customerId: string }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch360 = async () => {
      try {
        const res = await fetch(`/api/v1/customers/360/${customerId}`);
        const result = await res.json();
        if (result.status === 'success') {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to fetch customer data.');
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Network error occurred while fetching 360 profile.');
      } finally {
        setLoading(false);
      }
    };
    if (customerId) fetch360();
  }, [customerId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Activity className="h-8 w-8 text-blue-500 animate-spin" />
        <p className="text-slate-500 font-medium">Aggregating customer 360° profile view...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-lg border border-red-200">
        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
        <h4 className="font-bold text-lg">Error Loading Profile</h4>
        <p className="text-sm mt-1">{error || 'Unable to retrieve data.'}</p>
      </div>
    );
  }

  const { profile, loans, payments, insurance, smsLogs, analytics } = data;

  const getLoanBadge = (status: string) => {
    switch(status) {
      case 'ACTIVE': 
        return <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">🟢 Active</Badge>;
      case 'DUE_SOON': 
        return <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20">🟡 Due Soon</Badge>;
      case 'OVERDUE': 
        return <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/20 animate-pulse">🔴 Overdue</Badge>;
      case 'CLOSED': 
        return <Badge className="bg-slate-500/10 text-slate-600 border border-slate-500/20">⚪ Closed</Badge>;
      default: 
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRedactedDisplay = (val: string) => {
    if (val === '[Redacted - Admin Only]') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
          <Clock className="h-3 w-3" /> Redacted (Admin Only)
        </span>
      );
    }
    return val || 'N/A';
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl border shadow-sm">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Enterprise Customer Hub</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <User className="h-6 w-6 sm:h-7 sm:w-7 text-blue-500" /> {profile.name || profile.fullName}'s 360° Profile
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Unique Customer ID: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">{profile.customerId || profile._id}</code></p>
        </div>
        
        {analytics && analytics !== '[Redacted - Admin Only]' ? (
          <div className="flex gap-3 sm:gap-4 w-full md:w-auto">
            <div className="bg-slate-50 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border flex-1 md:flex-none">
              <span className="text-[11px] sm:text-xs text-slate-500 font-semibold block">Total Loans</span>
              <strong className="text-base sm:text-lg text-slate-950 font-bold">{analytics.totalLoans}</strong>
            </div>
            <div className="bg-slate-50 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border flex-1 md:flex-none">
              <span className="text-[11px] sm:text-xs text-slate-500 font-semibold block">Outstanding</span>
              <strong className="text-base sm:text-lg text-rose-600 font-bold">₹{analytics.totalOutstanding?.toLocaleString("en-IN")}</strong>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 px-4 py-3 rounded-xl border flex items-center gap-2 text-xs font-semibold text-slate-500">
            <ShieldCheck className="h-4 w-4 text-slate-400" /> Analytics Redacted (Admin Only)
          </div>
        )}
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <div className="overflow-x-auto no-scrollbar mb-6 pb-1">
          <TabsList className="inline-flex w-auto min-w-full p-1 bg-slate-100 rounded-xl justify-start">
            <TabsTrigger value="profile" className="rounded-lg py-2 px-3 font-semibold text-xs sm:text-sm whitespace-nowrap shrink-0">Personal Info</TabsTrigger>
            <TabsTrigger value="loans" className="rounded-lg py-2 px-3 font-semibold text-xs sm:text-sm whitespace-nowrap shrink-0">Loans ({loans?.length || 0})</TabsTrigger>
            <TabsTrigger value="payments" className="rounded-lg py-2 px-3 font-semibold text-xs sm:text-sm whitespace-nowrap shrink-0">Payments ({payments?.length || 0})</TabsTrigger>
            <TabsTrigger value="insurance" className="rounded-lg py-2 px-3 font-semibold text-xs sm:text-sm whitespace-nowrap shrink-0">Insurance ({insurance?.length || 0})</TabsTrigger>
            <TabsTrigger value="sms" className="rounded-lg py-2 px-3 font-semibold text-xs sm:text-sm whitespace-nowrap shrink-0">SMS Log ({smsLogs?.length || 0})</TabsTrigger>
          </TabsList>
        </div>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="mt-0">
          <Card className="border shadow-sm">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" /> KYC & Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-xs text-slate-400 block font-semibold">Full Name</span>
                      <span className="text-sm font-bold text-slate-800">{profile.fullName || profile.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-xs text-slate-400 block font-semibold">Mobile Number</span>
                      <span className="text-sm font-mono text-slate-800">{profile.mobile || profile.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-xs text-slate-400 block font-semibold">Email Address</span>
                      <span className="text-sm text-slate-800">{profile.email || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-xs text-slate-400 block font-semibold">Residential Address</span>
                      <span className="text-sm text-slate-800">{profile.address || profile.addressLine1 || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-xs text-slate-400 block font-semibold">PAN Card Number</span>
                      <span className="text-sm font-mono font-bold text-slate-800">{getRedactedDisplay(profile.panNumber || profile.pan)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-xs text-slate-400 block font-semibold">Aadhaar Card Number</span>
                      <span className="text-sm font-mono font-bold text-slate-800">{getRedactedDisplay(profile.aadhaarNumber || profile.aadhaar)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-xs text-slate-400 block font-semibold">KYC Verification Status</span>
                      <Badge className={`uppercase text-[10px] mt-0.5 ${
                        ['verified', 'VERIFIED'].includes(profile.kycStatus) 
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : ['rejected', 'REJECTED'].includes(profile.kycStatus)
                          ? 'bg-rose-500/10 text-rose-600'
                          : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {profile.kycStatus}
                      </Badge>
                    </div>
                  </div>
                  {profile.referralCode && (
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-slate-400 shrink-0" />
                      <div>
                        <span className="text-xs text-slate-400 block font-semibold">Referral Code</span>
                        <span className="text-sm font-bold text-blue-600">{profile.referralCode}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LOANS TAB */}
        <TabsContent value="loans" className="mt-0">
          <div className="space-y-4">
            {loans && loans.length > 0 ? (
              loans.map((loan: any) => (
                <Card key={loan._id} className="border shadow-sm hover:shadow-md transition duration-200">
                  <CardHeader className="border-b bg-slate-50/50 py-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-blue-500" /> {loan.loanType} - <span className="font-mono text-slate-500">{loan.loanId}</span>
                      </CardTitle>
                      {getLoanBadge(loan.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <span className="text-xs text-slate-400 block font-semibold">Principal Amount</span>
                        <strong className="text-sm text-slate-900">₹{loan.principalAmount?.toLocaleString("en-IN")}</strong>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block font-semibold">Outstanding Amount</span>
                        <strong className="text-sm text-rose-600">₹{loan.outstandingAmount?.toLocaleString("en-IN")}</strong>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block font-semibold">Interest Rate</span>
                        <strong className="text-sm text-slate-900">{loan.interestRate}% P.A.</strong>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block font-semibold">Tenure Months</span>
                        <strong className="text-sm text-slate-900">{loan.tenureMonths} Months</strong>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block font-semibold">Monthly EMI</span>
                        <strong className="text-sm text-slate-900">₹{loan.emiAmount?.toLocaleString("en-IN")}</strong>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block font-semibold">EMI Due Date</span>
                        <strong className="text-sm text-slate-900">{loan.emiDueDate}th of Month</strong>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block font-semibold">Next EMI Date</span>
                        <strong className="text-sm text-slate-900">{loan.nextEmiDate ? new Date(loan.nextEmiDate).toLocaleDateString("en-IN") : 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block font-semibold">Start & End Dates</span>
                        <span className="text-xs text-slate-600 block mt-0.5">
                          {new Date(loan.startDate).toLocaleDateString("en-IN")} to {new Date(loan.endDate).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="p-12 text-center border rounded-2xl bg-white shadow-sm">
                <AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700">No Loans Configured</h4>
                <p className="text-sm text-slate-500 mt-1">There are no active or closed loans registered for this profile.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* PAYMENTS TAB */}
        <TabsContent value="payments" className="mt-0">
          <Card className="border shadow-sm">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-lg font-bold text-slate-800">Transaction History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {payments && payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b">
                        <th className="px-6 py-3">Payment Date</th>
                        <th className="px-6 py-3">Payment Method</th>
                        <th className="px-6 py-3">Transaction ID</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-700">
                      {payments.map((p: any) => (
                        <tr key={p._id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4">{new Date(p.paymentDate).toLocaleDateString("en-IN")}</td>
                          <td className="px-6 py-4 capitalize font-semibold">{p.paymentMethod}</td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">{p.transactionId || 'N/A'}</td>
                          <td className="px-6 py-4 font-bold text-slate-900">₹{p.amountPaid?.toLocaleString("en-IN")}</td>
                          <td className="px-6 py-4">
                            <Badge className={
                              p.status === 'success' || p.status === 'SUCCESS'
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : 'bg-rose-500/10 text-rose-600'
                            }>
                              {p.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <CreditCard className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <h4 className="font-bold text-slate-700">No Transaction Records</h4>
                  <p className="text-sm text-slate-500 mt-1">This user does not have any recorded payment transactions.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* INSURANCE TAB */}
        <TabsContent value="insurance" className="mt-0">
          <div className="space-y-4">
            {insurance && insurance.length > 0 ? (
              insurance.map((policy: any) => (
                <Card key={policy._id} className="border shadow-sm hover:shadow-md transition duration-200">
                  <CardHeader className="border-b bg-slate-50/50 py-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-teal-500" /> {policy.policyType} Insurance — <span className="font-mono text-slate-500">{policy.policyNumber}</span>
                      </CardTitle>
                      <Badge className={`uppercase text-[10px] ${
                        policy.status === 'ACTIVE' 
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                          : policy.status === 'RENEWAL_SOON' 
                          ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' 
                          : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                      }`}>
                        {policy.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-xs text-slate-400 block font-semibold">Premium Amount</span>
                        <strong className="text-slate-900">₹{policy.premiumAmount?.toLocaleString("en-IN")}</strong>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block font-semibold">Payment Frequency</span>
                        <strong className="text-slate-900">{policy.frequency}</strong>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block font-semibold">Next Premium Date</span>
                        <strong className="text-slate-900">{policy.nextPremiumDate ? new Date(policy.nextPremiumDate).toLocaleDateString("en-IN") : 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block font-semibold">Policy Start & Expiry</span>
                        <span className="text-xs text-slate-600 block mt-0.5">
                          {new Date(policy.startDate).toLocaleDateString("en-IN")} to {new Date(policy.expiryDate).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="p-12 text-center border rounded-2xl bg-white shadow-sm">
                <ShieldCheck className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700">No Insurance Policies</h4>
                <p className="text-sm text-slate-500 mt-1">There are no insurance policies associated with this profile.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* SMS AUDIT TAB */}
        <TabsContent value="sms" className="mt-0">
          <Card className="border shadow-sm">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-500" /> DLT Compliant SMS Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {smsLogs && smsLogs.length > 0 ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {smsLogs.map((s: any) => (
                    <div key={s._id} className="p-3.5 sm:p-4 border rounded-xl hover:bg-slate-50/50 transition">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-[11px] sm:text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono truncate max-w-full">
                          Header: {s.headerUsed} | Template: {s.dltTemplateId}
                        </span>
                        <div className="flex items-center gap-2 self-start sm:self-center">
                          <span className="text-[11px] text-slate-400 font-medium">
                            {new Date(s.sentAt || s.createdAt).toLocaleString("en-IN")}
                          </span>
                          <Badge className={
                            s.status === 'DELIVERED' || s.status === 'SENT'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : 'bg-rose-500/10 text-rose-600'
                          }>
                            {s.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 mt-2 bg-slate-50 p-2.5 rounded-lg border font-mono break-words">
                        {s.messageText}
                      </p>
                      {s.failureReason && (
                        <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" /> Error: {s.failureReason}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <h4 className="font-bold text-slate-700">No Message History</h4>
                  <p className="text-sm text-slate-500 mt-1">No transaction notifications or scheduler SMS events logged yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
