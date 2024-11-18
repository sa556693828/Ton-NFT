import { Address, toNano, fromNano } from "@ton/core";
import { NetworkProvider } from "@ton/blueprint";
import { setItemContentCell } from "./nftContent/onChain";
import { NftCollection } from "../wrappers/NftCollection";

const randomSeed = Math.floor(Math.random() * 10000);

export async function run(provider: NetworkProvider, args: string[]) {
  const ui = provider.ui();

  const address = Address.parse(
    args.length > 0 ? args[0] : await ui.input("Collection address")
  );

  const nftCollection = provider.open(NftCollection.createFromAddress(address));

  const collectionData = await nftCollection.getCollectionData();
  console.log(collectionData);

  console.log(`Next item index: ${collectionData.nextItemId}`);
  const mint = await nftCollection.sendMintNft(provider.sender(), {
    value: toNano("0.04"),
    queryId: randomSeed,
    amount: toNano("0.014"),
    itemIndex: collectionData.nextItemId,
    itemOwnerAddress: provider.sender().address!!,
    itemContent: setItemContentCell({
      name: "VIP Item",
      description: "VIP Item",
      image: "https://i.imgur.com/QYiSfRi.jpeg",
      animation_url:
        "https://my.spline.design/gamecard-b3f438e67573d6dffb2906ad9edb0371/",
    }),
  });

  ui.write(
    `NFT Item deployed at https://testnet.tonscan.org/address/${nftCollection.address}`
  );
}
