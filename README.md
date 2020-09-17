# Outpost

Repo for our smart contracts and js package.

Our smart contracts are built on Arweave. They mostly contain meta data about communities. Arweave smart contracts, a.k.a. SmartWeave contracts, are super cheap and a lot more flexible than those on any other smart contract platform we've seen. Notably they allow use to use an alternate identity system. Rather than using Arweave public keys as identities, we use 3box 3IDs. 3IDs, an implementation of [w3c's DID spec](https://www.w3.org/TR/did-core/#:~:text=A%20DID%20method%20is%20defined,documents%20are%20written%20and%20updated.) are blockchain agnostic identifiers; they'll allow us to use a single identity system as we plan to add features from multiple blockchains in the future.

The Repo

- packages/contracts
  - our smartweave contracts
- packages/outpost-js
  - a js package. It mostly contains constants that we need throughout our repositories and common functions.
