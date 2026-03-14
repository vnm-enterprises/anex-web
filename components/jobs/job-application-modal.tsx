"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

interface JobApplicationModalProps {
  jobTitle: string | null;
  onClose: () => void;
}

export function JobApplicationModal({
  jobTitle,
  onClose,
}: JobApplicationModalProps) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    if (jobTitle) formData.append("job_title", jobTitle);
    if (file) formData.append("cv", file);

    try {
      const response = await fetch("/api/jobs/apply", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to submit application");

      toast.success("Application submitted successfully!");
      onClose();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!jobTitle} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">
            Apply for <span className="text-primary italic">{jobTitle}</span>
          </DialogTitle>
          <DialogDescription className="font-medium">
            Fill in your details and upload your CV to apply for this position.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid gap-2">
            <Label
              htmlFor="full_name"
              className="text-xs font-black uppercase tracking-widest ml-1"
            >
              Full Name
            </Label>
            <Input
              id="full_name"
              name="full_name"
              required
              placeholder="Your full name"
              className="rounded-xl h-12"
            />
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="email"
              className="text-xs font-black uppercase tracking-widest ml-1"
            >
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="email@example.com"
              className="rounded-xl h-12"
            />
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="phone"
              className="text-xs font-black uppercase tracking-widest ml-1"
            >
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              required
              placeholder="+94 7X XXX XXXX"
              className="rounded-xl h-12"
            />
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="cv"
              className="text-xs font-black uppercase tracking-widest ml-1"
            >
              Upload CV (PDF)
            </Label>
            <div className="relative group">
              <input
                id="cv"
                type="file"
                accept=".pdf"
                required
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-border group-hover:border-primary transition-colors rounded-xl p-4 flex items-center justify-center gap-2 text-muted-foreground group-hover:text-primary bg-muted/30">
                <Upload size={18} />
                <span className="text-sm font-bold truncate max-w-[200px]">
                  {file ? file.name : "Select PDF file"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="message"
              className="text-xs font-black uppercase tracking-widest ml-1"
            >
              Cover Letter / Message
            </Label>
            <Textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Tell us why you're a great fit!"
              className="rounded-xl resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-xl text-lg font-black shadow-lg shadow-primary/20"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
