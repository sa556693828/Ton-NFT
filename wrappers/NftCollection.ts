import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
  TupleBuilder,
} from "@ton/core";
import { encodeOffChainContent } from "../utils";

export type RoyaltyParams = {
  royaltyFactor: number;
  royaltyBase: number;
  royaltyAddress: Address;
};
export type NftCollectionConfig = {
  ownerAddress: Address;
  nextItemIndex: bigint;
  collectionContentUrl: string;
  commonContentUrl: string;
  nftItemCode: Cell;
  royaltyParams: RoyaltyParams;
};
export function nftCollectionConfigToCell(config: NftCollectionConfig): Cell {
  const contentCell = beginCell();

  const collectionContent = encodeOffChainContent(config.collectionContentUrl);
  contentCell.storeRef(collectionContent);
  const commonContent = beginCell();
  commonContent.storeBuffer(Buffer.from(config.commonContentUrl));
  contentCell.storeRef(commonContent.asCell());

  return beginCell()
    .storeAddress(config.ownerAddress)
    .storeUint(config.nextItemIndex, 64)
    .storeRef(contentCell)
    .storeRef(config.nftItemCode)
    .storeRef(
      beginCell()
        .storeUint(config.royaltyParams.royaltyFactor, 16)
        .storeUint(config.royaltyParams.royaltyBase, 16)
        .storeAddress(config.royaltyParams.royaltyAddress)
    )
    .endCell();
}
export class NftCollection implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}
  static createFromAddress(address: Address) {
    return new NftCollection(address);
  }
  static createFromConfig(
    config: NftCollectionConfig,
    code: Cell,
    workchain = 0
  ) {
    const data = nftCollectionConfigToCell(config);
    const init = { code, data };
    return new NftCollection(contractAddress(workchain, init), init);
  }
  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }
  async sendMintNft(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      queryId: number;
      amount: bigint; // to send with nft
      itemIndex: bigint;
      itemOwnerAddress: Address;
      itemContentUrl: string;
    }
  ) {
    const nftMessage = beginCell();
    nftMessage.storeAddress(opts.itemOwnerAddress);

    const uriContent = beginCell();
    uriContent.storeBuffer(Buffer.from(opts.itemContentUrl));
    nftMessage.storeRef(uriContent.endCell());

    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(1, 32) // operation
        .storeUint(opts.queryId, 64)
        .storeUint(opts.itemIndex, 64)
        .storeCoins(opts.amount)
        .storeRef(nftMessage.endCell())
        .endCell(),
    });
  }
  async sendChangeOwner(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      queryId: bigint;
      newOwnerAddress: Address;
    }
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(3, 32) //operation
        .storeUint(opts.queryId, 64)
        .storeAddress(opts.newOwnerAddress)
        .endCell(),
    });
  }

  async getCollectionData(provider: ContractProvider): Promise<{
    nextItemId: bigint;
    ownerAddress: Address;
    collectionContent: Cell;
  }> {
    const collection_data = await provider.get("get_collection_data", []);
    const stack = collection_data.stack;
    const nextItem: bigint = stack.readBigNumber();
    const collectionContent = stack.readCell();
    const ownerAddress = stack.readAddress();
    return {
      nextItemId: nextItem,
      collectionContent: collectionContent,
      ownerAddress: ownerAddress,
    };
  }
  async getItemAddressByIndex(
    provider: ContractProvider,
    index: bigint | number
  ) {
    let args = new TupleBuilder();
    args.writeNumber(index);
    const result = await provider.get("get_nft_address_by_index", args.build());
    return result.stack.readAddress();
  }
}
