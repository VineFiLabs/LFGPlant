const hre = require("hardhat");

const LFGTokenABI = require("../artifacts/contracts/core/LFGToken.sol/LFGToken.json");
const LFGCollectionABI = require("../artifacts/contracts/core/LFGCollection.sol/LFGCollection.json");
const GovernanceABI = require("../artifacts/contracts/core/Governance.sol/Governance.json");
const LFGFactoryABI = require("../artifacts/contracts/core/LFGFactory.sol/LFGFactory.json");
const LFGRouterABI = require("../artifacts/contracts/core/LFGRouter.sol/LFGRouter.json");
const LFGStorageABI = require("../artifacts/contracts/core/LFGStorage.sol/LFGStorage.json");

//monad testnet:
// Governance Address: 0x857511A18F30C5FbC8f016Fa526bb72D643220bB
// LFGRouter Address: 0x828cBCD2b57218D77320B941B4a4ee13D5C88c3d
// LFGFactory Address: 0xABde257f943Aed355E1856afA004B228A84Ed4C2
// LFGStroage Address: 0x7B0c19759D6711FA3a1dF3910F2504501FED7777
// Collection 0 Address: 0x771E9B3F02474bBa63F722E411ff84AdFC44F672
// Collection 0 的Token0 : 0x1487A31afEbF325571FcF868f9bAB6C81820B89A

//sonic testnet:
// Governance Address: 0xE76e96FCDc56BE6F44F11aaec03713B2195E6377
// LFGRouter Address: 0x13905f3bcecccEBbe56B94f2bc131A1823757CBe
// LFGFactory Address: 0x857511A18F30C5FbC8f016Fa526bb72D643220bB
// LFGStorage Address: 0xf08662C279034fE3348608c873A289aAf66c2d64
// Collection 0 Address: 0x870Fc96A203e61B4E7A19B4F4f528A1c5a716125
// Collection 0 的Token0 : 0xF37Dc1243fc2e2E2C5D6a0dEc3dC961df37dde8C
async function main() {
  const [owner, manager] = await hre.ethers.getSigners();
  console.log("owner:", owner.address);
  console.log("manager:", manager.address);

  const provider = ethers.provider;
  const network = await provider.getNetwork();
  const chainId = network.chainId;
  console.log("Chain ID:", chainId);

  async function sendETH(toAddress, amountInEther) {
    const amountInWei = ethers.parseEther(amountInEther);
    const tx = {
      to: toAddress,
      value: amountInWei,
    };
    const transactionResponse = await owner.sendTransaction(tx);
    await transactionResponse.wait();
    console.log("Transfer eth success");
  }

  //monad
//   const GovernanceAddress = "0x857511A18F30C5FbC8f016Fa526bb72D643220bB";
//   const LFGStorageAddress = "0x5318952F1C1a44c930b649A065Db0b9cfC502231";
//   const LFGRouterAddress="0x828cBCD2b57218D77320B941B4a4ee13D5C88c3d";
//   const LFGFactoryAddress = "0xABde257f943Aed355E1856afA004B228A84Ed4C2";

  //sonic
  const GovernanceAddress = "0xE76e96FCDc56BE6F44F11aaec03713B2195E6377";
//   const LFGStorageAddress = "0xf08662C279034fE3348608c873A289aAf66c2d64";
  const LFGRouterAddress="0x13905f3bcecccEBbe56B94f2bc131A1823757CBe";
  const LFGFactoryAddress = "0x857511A18F30C5FbC8f016Fa526bb72D643220bB";

//   const LFGStorage = new ethers.Contract(LFGStorageAddress, LFGStorageABI.abi, owner);
  const LFGRouter = new ethers.Contract(LFGRouterAddress, LFGRouterABI.abi, owner);

  const fee = ethers.parseEther("0.1");
  const LFGFactory = new ethers.Contract(LFGFactoryAddress, LFGFactoryABI.abi, owner);

  const lfgStorage = await hre.ethers.getContractFactory("LFGStorage");
  const LFGStorage = await lfgStorage.deploy(LFGRouterAddress);
  const LFGStorageAddress = LFGStorage.target;
  console.log("LFGStorage Address:", LFGStorageAddress);

  const collectionAddress = await LFGFactory.IdToCollection(0);
  console.log("Collection Address:", collectionAddress);

  const CreateParams = {
    tokenDecimals: 18,
    collction: collectionAddress, 
    lfgURLStorage: LFGStorageAddress,
    lfgMaxSupply:  ethers.parseEther("100000"),
    tokenName:  "LFG Plant Story 1",
    tokenSymbol: "LFG Story1",
    content: "Welcome to LFG Plant world",
    imageURI: "https://9ddc5954c64cf31c9c8b721bae2421d3.ipfs.4everland.link/ipfs/bafkreidtjxmovj5qbtw36ykcv2fot5xvcp3bdgl7ay7hpo7now7b6afrw4"
    };

    const createMetadataUri = await LFGStorage.metadataUri(
        CreateParams.tokenName,
        CreateParams.tokenSymbol,
        CreateParams.imageURI,
        CreateParams.collction,
        0n,
        CreateParams.lfgMaxSupply
    );
    const createMetadataUriTx=await createMetadataUri.wait();
    console.log("createMetadataUri tx:", createMetadataUriTx.hash);

    const getCollectMetadataInfo = await LFGStorage.getCollectMetadataInfo(
        CreateParams.collction,
        0n,
    );
    console.log("getCollectMetadataInfo:", getCollectMetadataInfo);

 
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
