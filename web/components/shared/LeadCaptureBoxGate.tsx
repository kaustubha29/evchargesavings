"use client";

import { useEffect, useState } from "react";
import { LeadCaptureBox, LEAD_FORM_SUBMITTED_KEY } from "./LeadCaptureBox";

interface Props {
  sourcePage?: string;
}

export function LeadCaptureBoxGate({ sourcePage = "/" }: Props) {
  const [isSubmitted, setIsSubmitted] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSubmission = () => {
      try {
        setIsSubmitted(localStorage.getItem(LEAD_FORM_SUBMITTED_KEY) === "true");
      } catch {
        setIsSubmitted(false);
      }
    };

    checkSubmission();
    window.addEventListener("ecs-lead-submitted", checkSubmission);

    return () => window.removeEventListener("ecs-lead-submitted", checkSubmission);
  }, []);

  if (isSubmitted === null || isSubmitted) {
    return null;
  }

  return <LeadCaptureBox sourcePage={sourcePage} />;
}
