import { Address } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { NftItem } from '../wrappers/NftItem';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Item address'));

    const nftItem = provider.open(NftItem.createFromAddress(address));

    const nftData = await nftItem.getNftData();
    console.log(nftData);
}
