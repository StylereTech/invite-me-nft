{
  "solidity": "0.8.19",
  "name": "invite-me-nft",
  "version": "1.0.0",
  "defaultNetwork": "baseSepolia",
  "networks": {
    "hardhat": {
      "chainId": 31337
    },
    "baseSepolia": {
      "url": "https://sepolia.base.org",
      "chainId": 84532,
      "accounts": []
    },
    "base": {
      "url": "https://mainnet.base.org",
      "chainId": 8453,
      "accounts": []
    }
  },
  "paths": {
    "sources": "./contracts",
    "tests": "./test",
    "cache": "./cache",
    "artifacts": "./artifacts"
  },
  "compilerOptions": {
    "optimizer": {
      "enabled": true,
      "runs": 200
    }
  }
}
