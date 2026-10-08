import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "@/lib/app-store";
import type { ReactNode } from "react";

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter full name").max(80),
  mobile: z
    .string()
    .trim()
    .regex(/^[+\d\s-]{10,15}$/, "Enter a valid mobile number"),
  email: z.string().trim().email("Invalid email").max(120),
  aadhaar: z
    .string()
    .trim()
    .regex(/^\d{4}\s?\d{4}\s?\d{4}$/, "12-digit Aadhaar"),
  pan: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{5}\d{4}[A-Za-z]$/, "Invalid PAN (e.g. ABCDE1234F)"),
  address: z.string().trim().min(6, "Enter address").max(200).optional().or(z.literal("")),
  occupation: z.string().trim().max(60).optional().or(z.literal("")),
  income: z.string().trim().max(20).optional().or(z.literal("")),
  amount: z.string().trim().max(20).optional().or(z.literal("")),
  branch: z.string().trim().max(80).optional().or(z.literal("")),
  bank: z.string().trim().optional().or(z.literal("")),
  insuranceType: z.string().trim().optional().or(z.literal("")),
  referralCode: z.string().trim().optional().or(z.literal("")),
});
type FormValues = z.infer<typeof schema>;

export function ApplyDialog({
  productName,
  productKind,
  children,
}: {
  productName: string;
  productKind: "loan" | "insurance" | "service";
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ id: string } | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const { addApplication } = useAppStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const simulateUpload = (doc: string) => {
    if (!uploadedDocs.includes(doc)) {
      setUploadedDocs((prev) => [...prev, doc]);
      toast.success(`${doc.replace(/_/g, " ")} marked as attached.`);
    } else {
      setUploadedDocs((prev) => prev.filter((d) => d !== doc));
      toast.info(`Removed ${doc.replace(/_/g, " ")}`);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      const created = await addApplication({
        fullName: data.fullName,
        mobile: data.mobile,
        email: data.email,
        aadhaar: data.aadhaar,
        pan: data.pan.toUpperCase(),
        productType: productName,
        productKind: productKind === "service" ? "loan" : productKind,
        amount: parseInt((data.amount || "0").replace(/\D/g, "")) || 0,
        branch: data.branch || "—",
        bank: productKind === "loan" ? (data.bank || "SBI") : undefined,
        insuranceType: productKind === "insurance" ? (data.insuranceType || "Health Plan") : undefined,
        referralCode: data.referralCode || undefined,
        documents: uploadedDocs.length > 0 ? uploadedDocs : ["Aadhaar_Card.pdf", "PAN_Card.pdf"],
      });
      setSuccess({ id: created.applicationId || created._id || "submitted" });
      toast.success("Application submitted", {
        description: `Reference: ${created.applicationId || created._id || "submitted"}`,
      });
    } catch (error: any) {
      toast.error(error.message || "Unable to submit application right now.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSuccess(null);
      setUploadedDocs([]);
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        {children ?? (
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-brand-navy">
            Apply Now
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for {productName}</DialogTitle>
          <DialogDescription>
            Fill in your details — one of our advisors will call you back within 24 hours. Your
            information is processed only for the purpose of the requested financial service.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center py-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-primary" />
            <h3 className="mt-4 text-xl font-bold">Application submitted!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your reference number is{" "}
              <span className="font-mono font-semibold text-foreground">{success.id}</span>. Track
              its status in the Customer Dashboard or Admin CRM.
            </p>
            <div className="mt-6 flex gap-2">
              <Button variant="outline" onClick={() => handleClose(false)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setSuccess(null);
                  setUploadedDocs([]);
                  reset();
                }}
              >
                Submit another
              </Button>
            </div>
          </div>
        ) : (
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="sm:col-span-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input id="fullName" placeholder="As per Aadhaar" {...register("fullName")} />
              {errors.fullName && (
                <p className="mt-1 text-xs text-destructive">{errors.fullName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input id="mobile" placeholder="+91 98765 43210" {...register("mobile")} />
              {errors.mobile && (
                <p className="mt-1 text-xs text-destructive">{errors.mobile.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="aadhaar">Aadhaar Number *</Label>
              <Input id="aadhaar" placeholder="1234 5678 9012" {...register("aadhaar")} />
              {errors.aadhaar && (
                <p className="mt-1 text-xs text-destructive">{errors.aadhaar.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="pan">PAN Number *</Label>
              <Input id="pan" placeholder="ABCDE1234F" {...register("pan")} className="uppercase" />
              {errors.pan && <p className="mt-1 text-xs text-destructive">{errors.pan.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" rows={2} placeholder="Full address" {...register("address")} />
            </div>
            <div>
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                placeholder="Salaried / Business / Student"
                {...register("occupation")}
              />
            </div>
            <div>
              <Label htmlFor="income">Annual Income (₹)</Label>
              <Input id="income" placeholder="e.g. 8,50,000" {...register("income")} />
            </div>
            <div>
              <Label htmlFor="amount">
                {productKind === "insurance" ? "Sum Assured (₹)" : "Loan Amount (₹)"}
              </Label>
              <Input id="amount" placeholder="e.g. 25,00,000" {...register("amount")} />
            </div>
            <div>
              <Label htmlFor="branch">Preferred Branch</Label>
              <Input id="branch" placeholder="e.g. Mumbai Fort" {...register("branch")} />
            </div>

            {/* Conditional dropdown: Bank (For loans only) */}
            {productKind === "loan" && (
              <div>
                <Label htmlFor="bank">Preferred Lender Bank *</Label>
                <select
                  id="bank"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("bank")}
                >
                  <option value="SBI">State Bank of India (SBI)</option>
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="LIC Housing Finance">LIC Housing Finance</option>
                </select>
              </div>
            )}

            {/* Conditional dropdown: Insurance Type (For insurance only) */}
            {productKind === "insurance" && (
              <div>
                <Label htmlFor="insuranceType">Coverage Term / Plan Type *</Label>
                <select
                  id="insuranceType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("insuranceType")}
                >
                  <option value="Term Life">Term Life Plan</option>
                  <option value="Health Plan">Health Plan Cover</option>
                  <option value="Motor Guard">Motor Guard Policy</option>
                  <option value="Travel Protect">Travel Protect Plan</option>
                  <option value="Commercial Property">Commercial Property Protect</option>
                </select>
              </div>
            )}

            {/* Referral Code */}
            <div>
              <Label htmlFor="referralCode">Referral Code (Optional)</Label>
              <Input id="referralCode" placeholder="e.g. REF-101" {...register("referralCode")} className="uppercase" />
            </div>

            {/* Interactive Document Simulator */}
            <div className="sm:col-span-2 mt-2 rounded-xl bg-muted/60 p-4 border">
              <span className="text-xs font-bold text-brand-navy block mb-2">Simulate Document Uploads</span>
              <p className="text-[11px] text-muted-foreground mb-3">Click each checklist document to simulate uploading it. Green indicates attached.</p>
              
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Aadhaar_Card.pdf", label: "Aadhaar Card" },
                  { name: "PAN_Card.pdf", label: "PAN Card" },
                  { name: "Income_Proof.pdf", label: "Income Statement / Salary slip" },
                  { name: "Property_Title.pdf", label: "Property Deeds (optional)" },
                ].map((doc) => {
                  const isUploaded = uploadedDocs.includes(doc.name);
                  return (
                    <Button
                      key={doc.name}
                      type="button"
                      variant={isUploaded ? "default" : "outline"}
                      size="sm"
                      onClick={() => simulateUpload(doc.name)}
                      className="text-xs flex items-center gap-1.5 h-auto py-1.5 min-h-[32px] text-left"
                    >
                      {isUploaded && <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
                      <span>{doc.label}</span>
                    </Button>
                  );
                })}
              </div>

              {uploadedDocs.length > 0 && (
                <div className="mt-3 pt-3 border-t text-[11px]">
                  <span className="font-semibold text-brand-navy">Uploaded files ({uploadedDocs.length}):</span>
                  <ul className="list-disc list-inside mt-1 font-mono text-muted-foreground">
                    {uploadedDocs.map((doc) => (
                      <li key={doc}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="sm:col-span-2 flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => handleClose(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-primary hover:bg-brand-navy"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
