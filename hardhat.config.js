require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomicfoundation/hardhat-chai-matchers");
require("hardhat-deploy");
require("hardhat-contract-sizer");
require("dotenv").config();
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");
require("chai");

FUJI_RPC_URL = process.env.FUJI_RPC_URL;
MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL;
GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
PRIVATE_KEY = process.env.PRIVATE_KEY;
LENDER_PRIVATE_KEY = process.env.LENDER_PRIVATE_KEY;
USER_PRIVATE_KEY = process.env.USER_PRIVATE_KEY;
ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;
SNOWTRACE_API_KEY = process.env.SNOWTRACE_API_KEY;
COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
/**@dev hardhat's balance task */
task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs) => {
    const balance = await ethers.provider.getBalance(taskArgs.account);

    console.log(ethers.utils.formatEther(balance), "ETH");
  });
/**@dev this task allows you to create an elementaryNFT with the desired URI */
task("createUri", "simple objectURI format using this task's hardcoded values")
  .addOptionalParam("name", "name to be given to your NFT")
  .addParam("pokemon", "name of the pokemon")
  .setAction(async (taskArgs) => {
    const pokemonImageUris = [];
    const {
      storeImages,
      storeTokenUriMetadata,
    } = require("./utils/uploadToPinata");
    const imagesLocation = "./images/";
    const metadataTemplate = {
      name: "",
      description: "",
      image: "",
    };
    if (process.env.UPLOAD_TO_PINATA == "true") {
      tokenUris = await handleTokenUris();
    }
    async function handleTokenUris() {
      tokenUris = [];
      const { responses: imageUploadResponses, files } = await storeImages(
        imagesLocation
      );
      for (imageUploadResponseIndex in imageUploadResponses) {
        let tokenUriMetadata = { ...metadataTemplate };

        /** if `name` is given then that will be the URI name, otherwise it will be the png file name */
        if (taskArgs.name) {
          console.log("code reached");
          tokenUriMetadata.name = taskArgs.name;
        } else {
          tokenUriMetadata.name = files[imageUploadResponseIndex].replace(
            ".png",
            ""
          );
        }

        if (taskArgs.pokemon) {
          tokenUriMetadata.image = `ipfs://`;
        }

        tokenUriMetadata.description = `your desc here ${tokenUriMetadata.name}!`;
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`;
        console.log(`Uploading ${tokenUriMetadata.name}...`);
        const metadataUploadResponse = await storeTokenUriMetadata(
          tokenUriMetadata
        );
        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
      }
      console.log("Token URIs uploaded! They are:");
      console.log(tokenUris);
    }
  });

/**@dev this task allows you to create an elementaryNFT with the desired URI */
task(
  "createImageUri",
  "simple objectURI format using this task's hardcoded values"
).setAction(async (taskArgs) => {
  const pokemonImageUris = [];
  const {
    storeImages,
    storeTokenUriMetadata,
  } = require("./utils/uploadToPinata");
  const imagesLocation = "./images/";
  const metadataTemplate = {
    name: "",
    description: "",
    image: "",
  };
  if (process.env.UPLOAD_TO_PINATA == "true") {
    tokenUris = await handleTokenUris();
  }
  async function handleTokenUris() {
    imageUris = [];
    const { responses: imageUploadResponses, files } = await storeImages(
      imagesLocation
    );
    for (imageUploadResponseIndex in imageUploadResponses) {
      const imageUri = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`;

      imageUris.push(
        `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
      );
    }
    console.log("Image URIs uploaded! They are:");
    console.log(imageUris);
  }
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
  },

  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    goerli: {
      url: GOERLI_RPC_URL || "",
      accounts: [PRIVATE_KEY, LENDER_PRIVATE_KEY, USER_PRIVATE_KEY] || "key",
      chainId: 5,
      blockConfirmations: 5,
    },
    mumbai: {
      url: MUMBAI_RPC_URL || "",
      accounts: [PRIVATE_KEY, LENDER_PRIVATE_KEY, USER_PRIVATE_KEY] || "key",
      chainId: 80001,
      blockConfirmations: 5,
    },
    fuji: {
      url: FUJI_RPC_URL || "",
      accounts: [PRIVATE_KEY, LENDER_PRIVATE_KEY, USER_PRIVATE_KEY] || "key",
      chainId: 43113,
      blockConfirmations: 3,
    },
  },
  namedAccounts: {
    deployer: 0,
    lender: 1,
    user: 2,
  },
  gasReporter: {
    enabled: true,
    //outputFile: "gas-report.txt",
    //noColors: true,
    coinmarketcap: COINMARKETCAP_API_KEY,
    currency: "USD",
    token: "ETH",
    //gasPrice: 21,
  },
  mocha: {
    timeout: 400000,
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API_KEY,
      polygonMumbai: POLYGONSCAN_API_KEY,
      avalancheFujiTestnet: SNOWTRACE_API_KEY,
    },
  },
};
