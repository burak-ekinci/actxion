"use client";
import React, { useState } from "react";
import PageHeading from "@/components/ui/shared/PageHeading";
import ProgressBarStep from "@/components/ui/shared/ProgressBarStep";

const CreateCampaignPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    {
      name: "Step 1",
      description: "Step 1 description",
      href: "#",
    },

    {
      name: "Step 3",
      description: "Step 3 description",
      href: "#",
    },

    {
      name: "Step 4",
      description: "Step 4 description",
      href: "#",
    },
    {
      name: "Step 5",
      description: "Step 5 description",
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
