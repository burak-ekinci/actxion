import {
  readContract,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { wagmiConfig } from "@/lib/wagmi-config";
import { Address } from "viem";

// Contract adresi environment variable'dan alınacak
export const ACTXION_NFT_CONTRACT_ADDRESS = (process.env
  .NEXT_PUBLIC_ACTXION_NFT_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

// Contract ABI - ACTXIONNFT.sol'dan türetilmiş
export const ACTXION_NFT_ABI = [
  // ============ STRUCTS ============
  {
    type: "struct",
    name: "NFTType",
    components: [
      { name: "id", type: "uint8" },
      { name: "name", type: "string" },
      { name: "price", type: "uint256" },
      { name: "maxSupply", type: "uint256" },
      { name: "currentSupply", type: "uint256" },
      { name: "maxPoolNumber", type: "uint8" },
      { name: "baseURI", type: "string" },
      { name: "isActive", type: "bool" },
      { name: "freeMintNumber", type: "uint16" },
    ],
  },
  {
    type: "struct",
    name: "NftTypeInput",
    components: [
      { name: "name", type: "string" },
      { name: "baseURI", type: "string" },
      { name: "price", type: "uint256" },
      { name: "maxSupply", type: "uint256" },
      { name: "maxPoolNumber", type: "uint8" },
      { name: "freeMintNumber", type: "uint16" },
    ],
  },
  // ============ EVENTS ============
  {
    type: "event",
    name: "NFTTypeAdded",
    inputs: [
      { name: "id", type: "uint8", indexed: true },
      { name: "name", type: "string", indexed: false },
      { name: "price", type: "uint256", indexed: false },
      { name: "maxSupply", type: "uint256", indexed: false },
      { name: "maxPoolNumber", type: "uint8", indexed: false },
      { name: "baseURI", type: "string", indexed: false },
    ],
  },
  {
    type: "event",
    name: "NFTMinted",
    inputs: [
      { name: "to", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "nftTypeIndex", type: "uint8", indexed: false },
    ],
  },
  {
    type: "event",
    name: "NFTTypeUpdated",
    inputs: [
      { name: "id", type: "uint8", indexed: true },
      { name: "name", type: "string", indexed: false },
      { name: "price", type: "uint256", indexed: false },
      { name: "maxSupply", type: "uint256", indexed: false },
      { name: "maxPoolNumber", type: "uint8", indexed: false },
      { name: "baseURI", type: "string", indexed: false },
      { name: "isActive", type: "bool", indexed: false },
    ],
  },
  {
    type: "event",
    name: "FundsWithdrawn",
    inputs: [
      { name: "to", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "MerkleRootUpdated",
    inputs: [{ name: "newRoot", type: "bytes32", indexed: false }],
  },
  {
    type: "event",
    name: "GuardDecision",
    inputs: [
      { name: "guard", type: "address", indexed: true },
      { name: "decision", type: "bool", indexed: false },
    ],
  },
  // ============ GETTER FUNCTIONS (Public Mappings) ============
  {
    type: "function",
    name: "nftTypes",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint8" }],
    outputs: [
      { name: "id", type: "uint8" },
      { name: "name", type: "string" },
      { name: "price", type: "uint256" },
      { name: "maxSupply", type: "uint256" },
      { name: "currentSupply", type: "uint256" },
      { name: "maxPoolNumber", type: "uint8" },
      { name: "baseURI", type: "string" },
      { name: "isActive", type: "bool" },
      { name: "freeMintNumber", type: "uint16" },
    ],
  },
  {
    type: "function",
    name: "tokenIdToBaseURI",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
  },
  {
    type: "function",
    name: "userLevel",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    type: "function",
    name: "guardDecisions",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "hasUserMinted",
    stateMutability: "view",
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "uint8" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "hasWhitelistMinted",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "hasFreeMinted",
    stateMutability: "view",
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "uint8" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  // ============ VIEW FUNCTIONS ============
  {
    type: "function",
    name: "tokenURI",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
  },
  {
    type: "function",
    name: "getUserOwnedNFT",
    stateMutability: "view",
    inputs: [
      { name: "user", type: "address" },
      { name: "_nftTypeIndex", type: "uint8" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "getNftTypes",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        type: "tuple[]",
        components: [
          { name: "id", type: "uint8" },
          { name: "name", type: "string" },
          { name: "price", type: "uint256" },
          { name: "maxSupply", type: "uint256" },
          { name: "currentSupply", type: "uint256" },
          { name: "maxPoolNumber", type: "uint8" },
          { name: "baseURI", type: "string" },
          { name: "isActive", type: "bool" },
          { name: "freeMintNumber", type: "uint16" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getNftTypeBaseURI",
    stateMutability: "view",
    inputs: [{ name: "_nftTypeIndex", type: "uint8" }],
    outputs: [{ name: "", type: "string" }],
  },
  {
    type: "function",
    name: "getNftTypeCounter",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    type: "function",
    name: "getTokenIdCounter",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "getMerkleRoot",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bytes32" }],
  },
  {
    type: "function",
    name: "getGuards",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "", type: "address" },
      { name: "", type: "address" },
    ],
  },
  {
    type: "function",
    name: "getGuardDecision",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
  },
  // ============ WRITE FUNCTIONS ============
  {
    type: "function",
    name: "addNftType",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "_input",
        type: "tuple",
        components: [
          { name: "name", type: "string" },
          { name: "baseURI", type: "string" },
          { name: "price", type: "uint256" },
          { name: "maxSupply", type: "uint256" },
          { name: "maxPoolNumber", type: "uint8" },
          { name: "freeMintNumber", type: "uint16" },
        ],
      },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "updateNftType",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_nftTypeIndex", type: "uint8" },
      {
        name: "_input",
        type: "tuple",
        components: [
          { name: "name", type: "string" },
          { name: "baseURI", type: "string" },
          { name: "price", type: "uint256" },
          { name: "maxSupply", type: "uint256" },
          { name: "maxPoolNumber", type: "uint8" },
          { name: "freeMintNumber", type: "uint16" },
        ],
      },
      { name: "_isActive", type: "bool" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "updateNftTypeStatus",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_nftTypeIndex", type: "uint8" },
      { name: "_isActive", type: "bool" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "whitelistMint",
    stateMutability: "nonpayable",
    inputs: [
      { name: "merkleProof", type: "bytes32[]" },
      { name: "_nftTypeIndex", type: "uint8" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "mint",
    stateMutability: "payable",
    inputs: [{ name: "_nftTypeIndex", type: "uint8" }],
    outputs: [],
  },
  {
    type: "function",
    name: "setMerkleRoot",
    stateMutability: "nonpayable",
    inputs: [{ name: "_newMerkleRoot", type: "bytes32" }],
    outputs: [],
  },
  {
    type: "function",
    name: "withdraw",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "pause",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "unpause",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "guardPass",
    stateMutability: "nonpayable",
    inputs: [{ name: "decision", type: "bool" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "transferOwnership",
    stateMutability: "nonpayable",
    inputs: [{ name: "newOwner", type: "address" }],
    outputs: [],
  },
] as const;

// ============ TYPE DEFINITIONS ============
export interface NFTType {
  id: number;
  name: string;
  price: bigint;
  maxSupply: bigint;
  currentSupply: bigint;
  maxPoolNumber: number;
  baseURI: string;
  isActive: boolean;
  freeMintNumber: number;
}

export interface NftTypeInput {
  name: string;
  baseURI: string;
  price: bigint;
  maxSupply: bigint;
  maxPoolNumber: number;
  freeMintNumber: number;
}

// ============ GETTER FUNCTIONS ============

/**
 * Get NFT Type by index
 */
export async function getNftType(nftTypeIndex: number): Promise<NFTType> {
  const result = (await readContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "nftTypes",
    args: [nftTypeIndex],
  })) as readonly [
    bigint,
    string,
    bigint,
    bigint,
    bigint,
    bigint,
    string,
    boolean,
    bigint
  ];

  return {
    id: Number(result[0]),
    name: result[1],
    price: result[2],
    maxSupply: result[3],
    currentSupply: result[4],
    maxPoolNumber: Number(result[5]),
    baseURI: result[6],
    isActive: result[7],
    freeMintNumber: Number(result[8]),
  };
}

/**
 * Get token URI by token ID
 */
export async function getTokenURI(tokenId: bigint): Promise<string> {
  return (await readContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "tokenURI",
    args: [tokenId],
  })) as string;
}

/**
 * Get user level
 */
export async function getUserLevel(userAddress: Address): Promise<number> {
  const result = (await readContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "userLevel",
    args: [userAddress],
  })) as bigint;
  return Number(result);
}

/**
 * Get guard decision for an address
 */
export async function getGuardDecision(
  guardAddress: Address
): Promise<boolean> {
  return (await readContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "guardDecisions",
    args: [guardAddress],
  })) as boolean;
}

/**
 * Check if user has minted a specific NFT type
 */
export async function hasUserMinted(
  userAddress: Address,
  nftTypeIndex: number
): Promise<boolean> {
  return (await readContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "hasUserMinted",
    args: [userAddress, nftTypeIndex],
  })) as boolean;
}

/**
 * Check if user has whitelist minted
 */
export async function hasWhitelistMinted(
  userAddress: Address
): Promise<boolean> {
  return (await readContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "hasWhitelistMinted",
    args: [userAddress],
  })) as boolean;
}

/**
 * Check if user has free minted a specific NFT type
 */
export async function hasFreeMinted(
  userAddress: Address,
  nftTypeIndex: number
): Promise<boolean> {
  return (await readContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "hasFreeMinted",
    args: [userAddress, nftTypeIndex],
  })) as boolean;
}

/**
 * Get token ID to Base URI mapping
 */
export async function getTokenIdToBaseURI(tokenId: bigint): Promise<string> {
  return (await readContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "tokenIdToBaseURI",
    args: [tokenId],
  })) as string;
}

/**
 * Get user owned NFT status
 */
export async function getUserOwnedNFT(
  userAddress: Address,
  nftTypeIndex: number
): Promise<boolean> {
  return (await readContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "getUserOwnedNFT",
    args: [userAddress, nftTypeIndex],
  })) as boolean;
}

/**
 * Get all NFT types
 */
export async function getNftTypes(): Promise<NFTType[]> {
  const result = (await readContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "getNftTypes",
  })) as readonly (readonly [
    bigint,
    string,
    bigint,
    bigint,
    bigint,
    bigint,
    string,
    boolean,
    bigint
  ])[];

  return result.map((nft) => ({
    id: Number(nft[0]),
    name: nft[1],
    price: nft[2],
    maxSupply: nft[3],
    currentSupply: nft[4],
    maxPoolNumber: Number(nft[5]),
    baseURI: nft[6],
    isActive: nft[7],
    freeMintNumber: Number(nft[8]),
  }));
}

/**
 * Get NFT type base URI
 */
export async function getNftTypeBaseURI(nftTypeIndex: number): Promise<string> {
  return (await readContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "getNftTypeBaseURI",
    args: [nftTypeIndex],
  })) as string;
}

/**
 * Get NFT type counter
 */
export async function getNftTypeCounter(): Promise<number> {
  const result = (await readContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "getNftTypeCounter",
  })) as bigint;
  return Number(result);
}

/**
 * Get token ID counter (only owner)
 */
export async function getTokenIdCounter(): Promise<bigint> {
  return (await readContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "getTokenIdCounter",
  })) as bigint;
}

/**
 * Get merkle root (only owner)
 */
export async function getMerkleRoot(): Promise<`0x${string}`> {
  return (await readContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "getMerkleRoot",
  })) as `0x${string}`;
}

/**
 * Get guard addresses (only owner)
 */
export async function getGuards(): Promise<[Address, Address]> {
  const result = (await readContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "getGuards",
  })) as readonly [Address, Address];
  return [result[0], result[1]];
}

/**
 * Get current guard decision status
 */
export async function getGuardDecisionStatus(): Promise<boolean> {
  return (await readContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "getGuardDecision",
  })) as boolean;
}

// ============ SETTER/WRITE FUNCTIONS ============

/**
 * Add a new NFT type (only owner)
 */
export async function addNftType(input: NftTypeInput): Promise<`0x${string}`> {
  const hash = await writeContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "addNftType",
    args: [
      [
        input.name,
        input.baseURI,
        input.price,
        input.maxSupply,
        input.maxPoolNumber,
        input.freeMintNumber,
      ],
    ],
  });

  await waitForTransactionReceipt(wagmiConfig, { hash });
  return hash;
}

/**
 * Update existing NFT type (only owner)
 */
export async function updateNftType(
  nftTypeIndex: number,
  input: NftTypeInput,
  isActive: boolean
): Promise<`0x${string}`> {
  const hash = await writeContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "updateNftType",
    args: [
      nftTypeIndex,
      [
        input.name,
        input.baseURI,
        input.price,
        input.maxSupply,
        input.maxPoolNumber,
        input.freeMintNumber,
      ],
      isActive,
    ],
  });

  await waitForTransactionReceipt(wagmiConfig, { hash });
  return hash;
}

/**
 * Update NFT type status (only owner)
 */
export async function updateNftTypeStatus(
  nftTypeIndex: number,
  isActive: boolean
): Promise<`0x${string}`> {
  const hash = await writeContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "updateNftTypeStatus",
    args: [nftTypeIndex, isActive],
  });

  await waitForTransactionReceipt(wagmiConfig, { hash });
  return hash;
}

/**
 * Whitelist mint
 */
export async function whitelistMint(
  merkleProof: readonly `0x${string}`[],
  nftTypeIndex: number
): Promise<`0x${string}`> {
  const hash = await writeContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "whitelistMint",
    args: [merkleProof, nftTypeIndex],
  });

  await waitForTransactionReceipt(wagmiConfig, { hash });
  return hash;
}

/**
 * Regular mint (payable)
 */
export async function mint(
  nftTypeIndex: number,
  value?: bigint
): Promise<`0x${string}`> {
  const hash = await writeContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "mint",
    args: [nftTypeIndex],
    value: value,
  });

  await waitForTransactionReceipt(wagmiConfig, { hash });
  return hash;
}

/**
 * Set merkle root (only owner)
 */
export async function setMerkleRoot(
  newMerkleRoot: `0x${string}`
): Promise<`0x${string}`> {
  const hash = await writeContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "setMerkleRoot",
    args: [newMerkleRoot],
  });

  await waitForTransactionReceipt(wagmiConfig, { hash });
  return hash;
}

/**
 * Withdraw funds (only owner, requires guard approval)
 */
export async function withdraw(): Promise<`0x${string}`> {
  const hash = await writeContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "withdraw",
  });

  await waitForTransactionReceipt(wagmiConfig, { hash });
  return hash;
}

/**
 * Pause contract (only owner)
 */
export async function pause(): Promise<`0x${string}`> {
  const hash = await writeContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "pause",
  });

  await waitForTransactionReceipt(wagmiConfig, { hash });
  return hash;
}

/**
 * Unpause contract (only owner)
 */
export async function unpause(): Promise<`0x${string}`> {
  const hash = await writeContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "unpause",
  });

  await waitForTransactionReceipt(wagmiConfig, { hash });
  return hash;
}

/**
 * Guard pass decision (only guard)
 */
export async function guardPass(decision: boolean): Promise<`0x${string}`> {
  const hash = await writeContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "guardPass",
    args: [decision],
  });

  await waitForTransactionReceipt(wagmiConfig, { hash });
  return hash;
}

/**
 * Transfer ownership (owner/guard with approval)
 */
export async function transferOwnership(
  newOwner: Address
): Promise<`0x${string}`> {
  const hash = await writeContract(wagmiConfig, {
    address: ACTXION_NFT_CONTRACT_ADDRESS,
    abi: ACTXION_NFT_ABI,
    functionName: "transferOwnership",
    args: [newOwner],
  });

  await waitForTransactionReceipt(wagmiConfig, { hash });
  return hash;
}
