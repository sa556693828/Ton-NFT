import { Address, Cell, toNano } from "@ton/core";
import { NftCollection } from "../wrappers/NftCollection";
import { compile, NetworkProvider } from "@ton/blueprint";

const randomSeed = Math.floor(Math.random() * 10000);

// Deploys collection and mints one item to the address of the
export async function run(provider: NetworkProvider) {
  const metadataIpfsHash = "Qma4pn6R9M1QW7wdy9TozYVMCVueF4HXU86ya5fzPBuU8W";

  const nftCollection = provider.open(
    NftCollection.createFromConfig(
      {
        ownerAddress: provider.sender().address!!,
        nextItemIndex: BigInt(0),
        collectionContentUrl: `ipfs://${metadataIpfsHash}/collection.json`,
        commonContentUrl: `ipfs://${metadataIpfsHash}/`,
        nftItemCode: await compile("NftItem"),
        royaltyParams: {
          royaltyFactor: Math.floor(Math.random() * 500),
          royaltyBase: 1000,
          royaltyAddress: provider.sender().address as Address,
        },
      },
      await compile("NftCollection")
    )
  );

  await nftCollection.sendDeploy(provider.sender(), toNano("0.05"));
  await provider.waitForDeploy(nftCollection.address);

  // const mint = await nftCollection.sendMintNft(provider.sender(), {
  //   value: toNano("0.04"),
  //   queryId: randomSeed,
  //   amount: toNano("0.014"),
  //   itemIndex: BigInt(0),
  //   itemOwnerAddress: provider.sender().address!!,
  //   itemContentUrl: `item.json`,
  // });
  // console.log(
  //   `NFT Item deployed at https://testnet.tonviewer.com/${nftCollection.address}`
  // );
}

// EQDXRcc7zDYRbMJErcT0bLwkx4yCWwGM9TqD9Zf5P6HTLBBk
// EQBx_YvODfn_zNlgFg8l8LoQs849MRQrPytVah70Vj2ax_ox //test animation
