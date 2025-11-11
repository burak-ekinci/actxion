"use client";
import PageHeading from "@/components/ui/shared/PageHeading";
import React from "react";
import { useRouter } from "next/navigation";

const MyCampaignsPage = () => {
  const router = useRouter();
  return (
    <div>
      <PageHeading
        config={{
          title: "My Campaigns",
          description: "View and manage your active campaigns",
          dropdown: {
            show: true,
            label: "Filter By",
            items: [
              {
                name: "Campaign 1",
                onClick: () => {
                  router.push("/advertiser/campaign/1");
                },
              },
            ],
          },
          button1: {
            label: "Create Campaign",
            onClick: () => {
              router.push("/advertiser/create");
            },
            show: true,
          },
        }}
      />
    </div>
  );
};

export default MyCampaignsPage;
