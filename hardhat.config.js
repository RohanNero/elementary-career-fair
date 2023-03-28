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
  .addOptionalParam("pokemon", "name of the pokemon")
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

        tokenUriMetadata.name = files[imageUploadResponseIndex].replace(
          ".png",
          ""
        );
        /** Pokemon name matching to description */
        if (tokenUriMetadata.name == "Baltoy") {
          tokenUriMetadata.description = `Discovered in ancient ruins, it moves by spinning around and forms a group when it finds others.`;
        } else if (tokenUriMetadata.name == "Buizel") {
          tokenUriMetadata.description = `It inflates the flotation sac around its neck and pokes its head out of the water to see what is going on.`;
        } else if (tokenUriMetadata.name == "Carvanha") {
          tokenUriMetadata.description = `They swarm any foe that invades their territory. Their sharp fangs can tear out boat hulls.`;
        } else if (tokenUriMetadata.name == "Clefairy") {
          tokenUriMetadata.description = `On nights with a full moon, Clefairy gather from all over and dance. Bathing in moonlight makes them float.`;
        } else if (tokenUriMetadata.name == "Corphish") {
          tokenUriMetadata.description = `No matter how dirty the water in the river, it will adapt and thrive. It has a strong will to survive.`;
        } else if (tokenUriMetadata.name == "Duskull") {
          tokenUriMetadata.description = `Duskull can pass through any wall no matter how thick it may be.`;
        } else if (tokenUriMetadata.name == "Ekans") {
          tokenUriMetadata.description = `The older it gets, the longer it grows. At night, it wraps its long body around tree branches to rest.`;
        } else if (tokenUriMetadata.name == "Golett") {
          tokenUriMetadata.description = `These Pokémon are thought to have been created by the science of an ancient and mysterious civilization.`;
        } else if (tokenUriMetadata.name == "Goldeen") {
          tokenUriMetadata.description = `It swims elegantly by flittering its tail fin as if it were a dress. It has the look of a queen.`;
        } else if (tokenUriMetadata.name == "Horsea") {
          tokenUriMetadata.description = `Its big, developed fins move rapidly, allowing it to swim backward while still facing forward.`;
        } else if (tokenUriMetadata.name == "Koffing") {
          tokenUriMetadata.description = `The poisonous gases it contains are a little bit lighter than air, keeping it slightly airborne.`;
        } else if (tokenUriMetadata.name == "Nickit") {
          tokenUriMetadata.description = `Cunning and cautious, it erases its tracks with swipes of its tail as it makes off with its plunder.`;
        } else if (tokenUriMetadata.name == "Nincada") {
          tokenUriMetadata.description = `It can sometimes live underground for more than 10 years. It absorbs nutrients from the roots of trees.`;
        } else if (tokenUriMetadata.name == "Nosepass") {
          tokenUriMetadata.description = `Its magnetic nose always faces north and draws iron objects to its body to protect itself better.`;
        } else if (tokenUriMetadata.name == "Shinx") {
          tokenUriMetadata.description = `The extension and contraction of its muscles generates electricity. It glows when in trouble.`;
        } else if (tokenUriMetadata.name == "Sneasel") {
          tokenUriMetadata.description = `A smart and sneaky Pokémon, it makes its opponents flinch by suddenly showing the claws hidden in its paws.`;
        } else if (tokenUriMetadata.name == "Voltorb") {
          tokenUriMetadata.description = `It looks just like a Poké Ball. It is dangerous because it may electrocute on touch.`;
        } else if (tokenUriMetadata.name == "Yanma") {
          tokenUriMetadata.description = `By flapping its wings at high speed, it can fly freely through the air. Even sudden stops are no problem.`;
        }

        // if (taskArgs.pokemon) {
        //   tokenUriMetadata.image = `ipfs://`;
        // }

        //tokenUriMetadata.description = /*`${tokenUriMetadata.name}*/ `a Dark/Ice-type Pokémon introduced in Generation II!`;
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

/**@dev this task allows you to create an image URI using the images folder */
task(
  "createImageUri",
  "returns the image URIs of files inside the images folder"
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
/**@dev this task allows you to create an ElementaryNFT with a specific URI and name */
task("createNFT", "creates an ElementaryNFT with desired parameters")
  .addParam("pokemon", "name of pokemon for image URI")
  .addParam("name", "the child's chosen nickname for their pokemon NFT")
  .setAction(async (taskArgs) => {});

/**@dev this task allows two people to trade NFTs */
task("trade", "allows two people to trade NFTs")
  .addParam("firstId", "first person's tokenId")
  .addParam("secondId", "second person's tokenId")
  .setAction(async (taskArgs) => {});

/**@dev this task allows you to vote for either Messi or Ronaldo */
task("vote", "votes for either Messi or Ronaldo")
  .addParam("player")
  .setAction(async (taskArgs) => {});

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
