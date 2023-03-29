# Elementary Career Fair

This repo was created to help showcase some basic web3 fundamentals to children at a title 1 elementary school!

## NFT Guide

To begin with the demonstration, pick out a random pokemon card!

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
