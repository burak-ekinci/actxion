import AdvertiserDashboard from "@/components/ui/advertiser/AdvertiserDashboard";
import PageHeading from "@/components/ui/shared/PageHeading";
import React from "react";

const AdvertiserPage = () => {
  return (
    <div>
      <PageHeading
        title="Advertiser"
        description="Manage campaigns and track performance"
      />
      <AdvertiserDashboard />
    </div>
  );
};

export default AdvertiserPage;
