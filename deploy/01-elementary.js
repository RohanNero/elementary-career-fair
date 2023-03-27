const { network } = require("hardhat");
const { verify } = require("../utils/verify.js");

module.exports = async function ({ deployments, getNamedAccounts }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  const args = [];

  const elementaryNFT = await deploy("ElementaryNFT", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
    await verify(elementaryNFT.address, []);
  }
};

module.exports.tags = ["all", "main", "elementary"];
