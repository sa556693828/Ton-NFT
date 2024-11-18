import * as dotenv from "dotenv";
import { readdir } from "fs/promises";
import { updateMetadataFiles, uploadFolderToIPFS } from "./metadata";
dotenv.config();

async function init() {
  const metadataFolderPath = "./data/metadata/";
  const imagesFolderPath = "./data/images/";
  // const mnemonic = process.env.MNEMONICS || "";
  // const wallet = await openWallet(mnemonic.split(" "), true);
  // console.log("Started uploading images to IPFS...");
  // const imagesIpfsHash = await uploadFolderToIPFS(imagesFolderPath);
  // const imagesIpfsHash = "QmV7hpFWTei1TZC5MaVa5su8pYxZbRJJqdiR5BJ72YyE4c"; //靜態圖
  // console.log(
  //   `Successfully uploaded the pictures to ipfs: https://gateway.pinata.cloud/ipfs/${imagesIpfsHash}`
  // );
  console.log("Started uploading metadata files to IPFS...");
  // await updateMetadataFiles(metadataFolderPath, imagesIpfsHash);
  const metadataIpfsHash = await uploadFolderToIPFS(metadataFolderPath);
  // // const metadataIpfsHash = "QmVQARpsCgqPUA63r9YALQh3XBj5w3Nfpq4tfVgP5SduyM";
  console.log(
    `Successfully uploaded the metadata to ipfs: https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`
  );
  // console.log("Start deploy of nft collection...");
  // const collectionData = {
  //   ownerAddress: wallet.contract.address,
  //   royaltyPercent: 0.05, // 0.05 = 5%
  //   royaltyAddress: wallet.contract.address,
  //   nextItemIndex: 0,
  //   collectionContentUrl: `ipfs://${metadataIpfsHash}/collection.json`,
  //   commonContentUrl: `ipfs://${metadataIpfsHash}/`,
  // };
  // const collection = new NftCollection(collectionData);
  // console.log(collection);
  // try {
  //   let seqno = await collection.deploy(wallet);
  //   console.log(`Collection deployed: ${collection.address}`);
  //   await waitSeqno(seqno, wallet);
  // } catch (error) {
  //   console.log(error);
  // }

  // async function mintNftItem(index: number, file: string) {
  //   try {
  //     console.log(`Start minting NFT item at index ${index}`);
  //     const mintParams = {
  //       queryId: 0,
  //       itemOwnerAddress: wallet.contract.address,
  //       itemIndex: index,
  //       amount: toNano("0.05"),
  //       commonContentUrl: file,
  //     };
  //     let seqno = await collection.mint(wallet, mintParams);
  //     console.log(`Successfully minted NFT item at index ${index}`);
  //     await waitSeqno(seqno, wallet);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // // 示例：用戶請求 mint NFT item
  const files = await readdir(metadataFolderPath);
  files.pop();
  let index = 0;
  for (const file of files) {
    console.log(file);
    // await mintNftItem(index, file);
    index++;
  }

  // Marketplace
  // console.log("Start deploy of new marketplace");
  // const marketplace = new NftMarketplace(wallet.contract.address);
  // try {
  //   let seqno = await marketplace.deploy(wallet);
  //   console.log(`Marketplace deployed: ${marketplace.address}`);
  //   await waitSeqno(seqno, wallet);
  //   console.log("Successfully deployed new marketplace");
  // } catch (error) {
  //   console.log(error);
  // }
  // try {
  //   const nftToSaleAddress = await NftItem.getAddressByIndex(
  //     collection.address,
  //     0
  //   );
  //   const saleData: GetGemsSaleData = {
  //     isComplete: false,
  //     createdAt: Math.ceil(Date.now() / 1000),
  //     marketplaceAddress: marketplace.address,
  //     nftAddress: nftToSaleAddress,
  //     nftOwnerAddress: null,
  //     fullPrice: toNano("10"),
  //     marketplaceFeeAddress: wallet.contract.address,
  //     marketplaceFee: toNano("1"),
  //     royaltyAddress: wallet.contract.address,
  //     royaltyAmount: toNano("0.5"),
  //   };
  //   const nftSaleContract = new NftSale(saleData);
  //   let seqno = await nftSaleContract.deploy(wallet);
  //   await waitSeqno(seqno, wallet);
  // } catch (error) {
  //   console.log(error);
  // }

  // await NftItem.transfer(wallet, nftToSaleAddress, nftSaleContract.address);
}

void init();
