require("@nomicfoundation/hardhat-toolbox");
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

/**@dev this task allows you to create your twContract.objectURI */
task(
  "createUri",
  "simple objectURI format using this task's hardcoded values"
).setAction(async () => {
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

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
};
