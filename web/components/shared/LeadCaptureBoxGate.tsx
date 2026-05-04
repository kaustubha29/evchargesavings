"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { LeadCaptureBox, LEAD_FORM_SUBMITTED_KEY } from "./LeadCaptureBox";

interface Props {
  sourcePage?: string;
  children?: ReactNode;
  sectionId?: string;
  sectionClassName?: string;
  contentClassName?: string;
  defaultIntent?: ("ev" | "charger" | "insurance")[];
  heading?: string;
  description?: string;
  submitLabel?: string;
  successMessage?: string;
}

export function LeadCaptureBoxGate({
  sourcePage = "/",
  children,
  sectionId,
  sectionClassName,
  contentClassName,
  defaultIntent,
  heading,
  description,
  submitLabel,
  successMessage,
}: Props) {
  const [isSubmitted, setIsSubmitted] = useState<boolean | null>(null);
  const gateId = useId();

  useEffect(() => {
    const checkSubmission = (event?: Event) => {
      try {
        const submittedGateId = event instanceof CustomEvent ? event.detail?.gateId : null;
        if (submittedGateId === gateId) return;

        setIsSubmitted(localStorage.getItem(LEAD_FORM_SUBMITTED_KEY) === "true");
      } catch {
        setIsSubmitted(false);
      }
    };

    checkSubmission();
    window.addEventListener("ecs-lead-submitted", checkSubmission);

    return () => window.removeEventListener("ecs-lead-submitted", checkSubmission);
  }, [gateId]);

  if (isSubmitted === null || isSubmitted) {
    return null;
  }

  const leadBox = (
    <LeadCaptureBox
      sourcePage={sourcePage}
      gateId={gateId}
      defaultIntent={defaultIntent}
      heading={heading}
      description={description}
      submitLabel={submitLabel}
      successMessage={successMessage}
    />
  );

  if (sectionClassName) {
    return (
      <section id={sectionId} className={sectionClassName}>
        <div className={contentClassName}>
          {children}
          {leadBox}
        </div>
      </section>
    );
  }

  return (
    <>
      {children}
      {leadBox}
    </>
  );
}
