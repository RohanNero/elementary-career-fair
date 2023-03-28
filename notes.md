### Notes

Need to update flow, like instead of the NFTs having URIs they might just need to have imageURIs - this way the ipfs URIs will work instantly and kids won't have to wait for IPFS to finish uploading their images

Could even transfer contract over to remix and have children just interact with remix UI (pass name and pokemon game to function) - this means that the pokemon image URIs will need to be hard coded into the smart contract.

#### This way kids will:

1. interact with a task that calls a smart contract function
2. input their name and pokemon name,
   - the name will be saved on the smart contract, but the pokemon name will be checked inside the task
3. the provided pokemon name is assigned a URI that matches the name
4. from here the URI and name input are passed to the smart contract function
5. users can go home and read the contract to see their name and URI
   - may need a mapping from tokenId to URI && name

#### Current plan:

1. write a task that allows kids to interact with a smart contract function
   - implement a way for kids to pass their name/nickname to function
2.
