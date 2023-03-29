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

        /** Pokemon name matching to description
         * 18 pokemon in total, arranged alphabetically
         */
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
  .setAction(async (taskArgs) => {
    const nft = await ethers.getContract("ElementaryNFT");
    let pokemon;

    /** Pokemon name matching to URI */
    if (taskArgs.pokemon == "Baltoy") {
      pokemon = "ipfs://QmZo5M1wDgKyLZTyVx4jn7zoF44hoHwmpKBE9wfQJ5fUws";
    } else if (taskArgs.pokemon == "Buizel") {
      pokemon = "ipfs://QmNWgZYFrWtdoSJYFGhXQVrU2DDA1LcCo58RF47wiuJxGZ";
    } else if (taskArgs.pokemon == "Carvanha") {
      pokemon = "ipfs://QmaBPxa44TEHfRWBdeSgqvrH72qKacYEB6rfUZ1NARYocw";
    } else if (taskArgs.pokemon == "Clefairy") {
      pokemon = "ipfs://QmXP6y9nBaeHt94zXcYY5f7Q8WEJzKbRjbEY36LJadinDd";
    } else if (taskArgs.pokemon == "Corphish") {
      pokemon = "ipfs://QmcP7Q6PP2B3UoQo4i3qsNtonGENBa4EtU8KbPdz3sHv2L";
    } else if (taskArgs.pokemon == "Duskull") {
      pokemon = "ipfs://QmdAWbqgEhSeonCMPRpuTqn7QqD9JDA11jhNaAiU66LmbT";
    } else if (taskArgs.pokemon == "Ekans") {
      pokemon = "ipfs://QmVnJhBk8EDivGp4HYVKVGBSa9bSKPa3S3mTu8ycrKedRH";
    } else if (taskArgs.pokemon == "Golett") {
      pokemon = "ipfs://QmWv5LhDv34x5ZqVkyPdR5wvcG3eVhsDVV8ZByv8N2w8KU";
    } else if (taskArgs.pokemon == "Goldeen") {
      pokemon = "ipfs://QmNvdFygv97z6gEzP3HEggbbWCXk6Aeq5QiEqNQsRbM2ED";
    } else if (taskArgs.pokemon == "Horsea") {
      pokemon = "ipfs://QmeX57BLnfrKmZEuHe8TYacKAnpuhTSBWo5wQGV36ZiUHt";
    } else if (taskArgs.pokemon == "Koffing") {
      pokemon = "ipfs://Qmawz3tL89nhn6gKhn5sNBzp131BusaFLkochW3dP3JS7v";
    } else if (taskArgs.pokemon == "Nickit") {
      pokemon = "ipfs://QmQgbhcYQ8gj4CoHKCyocCBGszwdC5PkuVqNHvBQyuh5qo";
    } else if (taskArgs.pokemon == "Nincada") {
      pokemon = "ipfs://QmYqhsVFgNrpDGGxeV7Fo95jYgRu7Erce68pnwbNy9a3jq";
    } else if (taskArgs.pokemon == "Nosepass") {
      pokemon = "ipfs://QmSPx5Ec9DdqqnEWs8qH9dBpuHmG57fB1kumE4p9HPwsNc";
    } else if (taskArgs.pokemon == "Shinx") {
      pokemon = "ipfs://QmY8M5HQ8QRG573BBTKW4Nk6PHkjCFmQX19nyx1JR6jBwo";
    } else if (taskArgs.pokemon == "Sneasel") {
      pokemon = "ipfs://QmZjnTw7CfmbRFgU9LhN3ESVRFc2q9tPRPLaZr7DpEH19E";
    } else if (taskArgs.pokemon == "Voltorb") {
      pokemon = "ipfs://QmTSFFn3cGtsj544ja5QMdGiZXP7dhGz55yXUz33so5Xud";
    } else if (taskArgs.pokemon == "Yanma") {
      pokemon = "ipfs://QmZ1dWiHNhS1bM72TjKaicj3QKmvmdrE4U64PfHboXepXd";
    }
    const tx = await nft.createNFT(pokemon, taskArgs.name);
    const txReceipt = await tx.wait();
    const id = txReceipt.events[1].args.tokenId;
    console.log("------------------------------------");
    console.log("✨ New NFT created with the Id: ", parseInt(id));
    console.log("------------------------------------");
  });

/**@dev this task allows two people to trade NFTs */
task("trade", "allows two people to trade NFTs")
  .addParam("firstId", "first person's tokenId")
  .addParam("secondId", "second person's tokenId")
  .setAction(async (taskArgs) => {});

/**@dev this task allows you to vote for either Messi or Ronaldo */
task("vote", "votes for either Messi or Ronaldo")
  .addParam("player", "either messi or ronaldo")
  .setAction(async (taskArgs) => {
    const nft = await ethers.getContract("ElementaryNFT");

    /** vote based on `player` input */
    if (taskArgs.player.toLowerCase() == "messi") {
      const voteTx = await nft.voteForMessi();
      await voteTx.wait();
    } else if (taskArgs.player.toLowerCase() == "ronaldo") {
      const voteTx = await nft.voteForRonaldo();
      await voteTx.wait();
    }
    const messiVotes = await nft.viewMessiVotes();
    const ronaldoVotes = await nft.viewRonaldoVotes();

    //console.log(parseInt(messiVotes) < parseInt(ronaldoVotes));
    console.log("----------------------------------");
    console.log(parseInt(messiVotes), "votes for Messi!");
    console.log(parseInt(ronaldoVotes), "votes for Ronaldo!");
    console.log("----------------------------------");
    if (parseInt(messiVotes) > parseInt(ronaldoVotes)) {
      console.log(
        "Messi is winning by",
        parseInt(messiVotes - ronaldoVotes),
        "votes! ⚽"
      );
    } else if (parseInt(messiVotes) < parseInt(ronaldoVotes)) {
      console.log(
        "Ronaldo is winning by",
        parseInt(ronaldoVotes - messiVotes),
        "votes! ⚽"
      );
    } else {
      console.log("Its a tie! ⚽");
    }
    console.log("----------------------------------");
  });
/**@dev this task allows two people to trade NFTs */
task(
  "viewInfo",
  "allows someone to view name and URI associated with a tokenId"
)
  .addParam("id", "the NFT tokenId with info you wish to view")
  .setAction(async (taskArgs) => {
    //console.log("code reached");
    const nft = await ethers.getContract("ElementaryNFT");
    const name = await nft.viewName(taskArgs.id);
    const uri = await nft.viewTokenURI(taskArgs.id);
    console.log("----------------------------------------------");
    console.log("✨ Info for Pokemon with Id number", parseInt(taskArgs.id));
    console.log("----------------------------------------------");
    console.log(`name: ${name}`);
    console.log(`URI: ${uri}`);
    console.log("----------------------------------------------");
  });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [{ version: "0.8.18" }, { version: "0.6.6" }],
  },

  defaultNetwork: "localhost",
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
