import React from "react";
import { useAccount, useBalance } from "wagmi";

const WalletInfo = () => {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });

  return <div>WalletInfo</div>;
};

export default WalletInfo;
