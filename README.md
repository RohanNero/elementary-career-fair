# Elementary Career Fair

This repo was created to help showcase some basic web3 fundamentals to children at a title 1 elementary school!

All you need to do in order to use this repo is buy some pokemon cards! Use the ones already hard-coded in so that you don't have to update any code, otherwise you will need to drop a picture of the pokemon into the `images` folder. Once your image is in the image folder update the
hardhat task `createUri` and then run the command `yarn hardhat createUri`. Once your **URI** is updated you need to add its value to the `createNft` task inside of the `hardhat.config.js` file. Now you should be able to follow the rest of the steps!

## NFT Guide

Preliminary step: set up local blockchain if using it, otherwise just pass `--network goerli` when you run the tasks

```
yarn hardhat node --network hardhat
```

**To begin with the demonstration**, pick out a random pokemon card!

Once you've gotten a card, its time to create an **NFT**

```
yarn hardhat createNFT --name <NICKNAME FOR POKEMON> --pokemon <NAME OF POKEMON>
```

**Note: you must pass in the pokemon's name with correct spelling and the first letter must be uppercase!**

Now that you have an **NFT**, you can view its info with this command

```
yarn hardhat viewInfo --id <YOUR TOKENID>
```

## Messi VS Ronaldo

To vote for who you think is best, all you need to do is run this command

```
yarn hardhat vote --player <Messi/Ronaldo>
```

## Goerli testnet address:

https://goerli.etherscan.io/address/0xA9582BA6489C8D8f8C545F66aA427c92E3EAA615#code
