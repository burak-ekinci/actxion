"use client";
import React, { useState } from "react";
import PageHeading from "@/components/ui/shared/PageHeading";
import ProgressBarStep from "@/components/ui/shared/ProgressBarStep";

const CreateCampaignPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    {
      name: "Basic Info",
      description: "Enter campaign title, category and details",
      href: "#",
    },

    {
      name: "Budget",
      description: "Set your campaign budget and rewards",
      href: "#",
    },

    {
      name: "Proof Schema",
      description: "Configure proof requirements and validation",
      href: "#",
    },
    {
      name: "Preview",
      description: "Preview your campaign",
      href: "#",
    },
  ];

  return (
    <div>
      <PageHeading
        config={{
          title: "Create Campaign",
          description: "Create a new campaign",
        }}
      />
      <ProgressBarStep steps={steps} />
    </div>
  );
};

export default CreateCampaignPage;
