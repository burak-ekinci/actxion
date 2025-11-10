const CHAIN_IDS = [
  // Ana ağlar (Mainnets)
  {
    name: "Ethereum Mainnet",
    chainId: 1,
    symbol: "ETH",
    explorer: "https://etherscan.io",
  },
  {
    name: "Binance Smart Chain",
    chainId: 56,
    symbol: "BNB",
    explorer: "https://bscscan.com",
  },
  {
    name: "Polygon",
    chainId: 137,
    symbol: "MATIC",
    explorer: "https://polygonscan.com",
  },
  {
    name: "Avalanche C-Chain",
    chainId: 43114,
    symbol: "AVAX",
    explorer: "https://snowtrace.io",
  },
  {
    name: "Arbitrum One",
    chainId: 42161,
    symbol: "ETH",
    explorer: "https://arbiscan.io",
  },
  {
    name: "Optimism",
    chainId: 10,
    symbol: "ETH",
    explorer: "https://optimistic.etherscan.io",
  },
  {
    name: "Fantom Opera",
    chainId: 250,
    symbol: "FTM",
    explorer: "https://ftmscan.com",
  },
  {
    name: "Cronos Mainnet",
    chainId: 25,
    symbol: "CRO",
    explorer: "https://cronoscan.com",
  },
  {
    name: "Harmony Mainnet Shard 0",
    chainId: 1666600000,
    symbol: "ONE",
    explorer: "https://explorer.harmony.one",
  },
  {
    name: "Base",
    chainId: 8453,
    symbol: "ETH",
    explorer: "https://basescan.org",
  },

  // Test ağları (Testnets)
  {
    name: "Sepolia",
    chainId: 11155111,
    symbol: "ETH",
    explorer: "https://sepolia.etherscan.io",
    testnet: true,
  },
  {
    name: "Goerli",
    chainId: 5,
    symbol: "ETH",
    explorer: "https://goerli.etherscan.io",
    testnet: true,
  },
  {
    name: "BSC Testnet",
    chainId: 97,
    symbol: "tBNB",
    explorer: "https://testnet.bscscan.com",
    testnet: true,
  },
  {
    name: "Mumbai (Polygon Testnet)",
    chainId: 80001,
    symbol: "MATIC",
    explorer: "https://mumbai.polygonscan.com",
    testnet: true,
  },
  {
    name: "Avalanche Fuji Testnet",
    chainId: 43113,
    symbol: "AVAX",
    explorer: "https://testnet.snowtrace.io",
    testnet: true,
  },
  {
    name: "Arbitrum Goerli",
    chainId: 421613,
    symbol: "ETH",
    explorer: "https://goerli.arbiscan.io",
    testnet: true,
  },
];

export default CHAIN_IDS;

// coin terminal message
// const message = {
//   domain: { name: "Ape Terminal Launchpad" },
//   message: {
//     contents: "Sign in",
//     message: "Sign in with your wallet",
//     uri: "https://cointerminal.com",
//   },
//   primaryType: "Mail",
//   types: {
//     EIP712Domain: [{ name: "name", type: "string" }],
//     Mail: [
//       { name: "message", type: "string" },
//       { name: "uri", type: "string" },
//       { name: "contents", type: "string" },
//     ],
//   },
// };
