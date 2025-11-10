import { Chain } from "viem";

export interface WalletState {
  address: string | `0x${string}` | null;
  isConnected: boolean;
  isSignedIn: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  chain: string | null;
}
