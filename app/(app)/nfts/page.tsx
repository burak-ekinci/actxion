import React from "react";
import Nfts from "@/components/ui/nfts/Nfts";
import PageHeading from "@/components/ui/shared/PageHeading";

const NftsPage = () => {
  return (
    <div>
      {/* <PageHeading
        config={{
          title: "ACTXION NFT: Your Ad Access Pass",
          description:
            "Launch verifiable Web3 campaigns by holding an ACTXION Genesis NFT. Your pass ensures premium access, priority validation, and commitment to real-world activity tracking. Mint it. Use it. Start driving action.",
        }}
      /> */}
      <Nfts />
    </div>
  );
};

export default NftsPage;
