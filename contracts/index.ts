import {
  BALANCE_CONTRACT_ABI,
  BALANCE_CONTRACT_ADDRESS,
} from "./balanceContract";
import {
  MESSAGE_CONTRACT_ADDRESS,
  MESSAGE_CONTRACT_ABI,
} from "./messageContract";

interface ContractConfig {
  address: `0x${string}`;
  abi: any;
}

interface Contracts {
  messageContract: ContractConfig;
  balanceContract: ContractConfig;
}

export const contracts: Contracts = {
  messageContract: {
    address: MESSAGE_CONTRACT_ADDRESS as `0x${string}`,
    abi: MESSAGE_CONTRACT_ABI,
  },
  balanceContract: {
    address: BALANCE_CONTRACT_ADDRESS as `0x${string}`,
    abi: BALANCE_CONTRACT_ABI,
  },
} as const;
