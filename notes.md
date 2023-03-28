### Notes

Need to update flow, like instead of the NFTs having URIs they might just need to have imageURIs - this way the ipfs URIs will work instantly and kids won't have to wait for IPFS to finish uploading their images

#### This way kids will:

1. interact with a task that calls a smart contract function
2. input their name and pokemon name,
   - the name will be saved on the smart contract, but the pokemon name will be checked inside the task
3. the provided pokemon name is assigned a URI that matches the name
4. from here the URI and name input are passed to the smart contract function
5. users can go home and read the contract to see their name and URI
   - may need a mapping from tokenId to URI && name
