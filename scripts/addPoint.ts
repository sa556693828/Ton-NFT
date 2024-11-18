import { Address, toNano } from '@ton/core';
import { NftCollection } from '../wrappers/NftCollection';
import { NetworkProvider } from '@ton/blueprint';
import { setItemContentCell } from './nftContent/onChain';

const randomSeed = Math.floor(Math.random() * 10000);

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const collectionAddress = Address.parse(args.length > 0 ? args[0] : await ui.input('Collection address'));
    const itemAddress = Address.parse(args.length > 1 ? args[1] : await ui.input('Item address'));

    const nftCollection = provider.open(NftCollection.createFromAddress(collectionAddress));
    const result = await nftCollection.sendAddPoint(provider.sender(), {
        value: toNano('0.02'),
        queryId: randomSeed,
        points: 100,
        nftItemAddress: itemAddress,
    });

    ui.write(`Result : ${result}`);
}
