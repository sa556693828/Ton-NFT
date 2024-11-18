import { Address, toNano } from "@ton/core";
import { compile, NetworkProvider } from "@ton/blueprint";
import {
  buildCollectionContentCell,
  setItemContentCell,
} from "./nftContent/onChain";
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

  const nextIndex = collectionData.nextItemId;
  console.log(`Next item index: ${nextIndex}`);

  for (let i = 0; i < nextIndex; i++) {
    const itemAddress = await nftCollection.getItemAddressByIndex(i);
    console.log(`Item address: ${itemAddress.toString()}`);
  }
}
