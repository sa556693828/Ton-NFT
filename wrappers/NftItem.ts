import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider } from '@ton/core';

export type NftItemConfig = {
    index: bigint;
    collectionAddress: Address;
    ownerAddress: Address;
    content: Cell;
    pointValue: number;
};
export function nftItemConfigToCell(config: NftItemConfig): Cell {
    return beginCell()
        .storeUint(config.index, 64)
        .storeAddress(config.collectionAddress)
        .storeAddress(config.ownerAddress)
        .storeRef(config.content)
        .storeUint(config.pointValue, 32)
        .endCell();
}

export class NftItem implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new NftItem(address);
    }
    static createFromConfig(config: NftItemConfig, code: Cell, workchain = 0) {
        const data = nftItemConfigToCell(config);
        const init = { code, data };
        return new NftItem(contractAddress(workchain, init), init);
    }
    async getNftData(provider: ContractProvider): Promise<{
        init: number;
        index: bigint;
        collectionAddress: Address;
        ownerAddress: Address;
        content: Cell;
        pointValue: number;
    }> {
        const nft_data = await provider.get('get_nft_data', []);
        const stack = nft_data.stack;
        const init = stack.readNumber();
        const index = stack.readBigNumber();
        const collectionAddress = stack.readAddress();
        const ownerAddress = stack.readAddress();
        const content = stack.readCell();
        const pointValue = stack.readNumber();
        return {
            init: init,
            index: index,
            collectionAddress: collectionAddress,
            ownerAddress: ownerAddress,
            content: content,
            pointValue: pointValue,
        };
    }
}
