const hre = require("hardhat");

const LFGTokenABI = require("../artifacts/contracts/core/LFGToken.sol/LFGToken.json");
const LFGCollectionABI = require("../artifacts/contracts/core/LFGCollection.sol/LFGCollection.json");
const GovernanceABI = require("../artifacts/contracts/core/Governance.sol/Governance.json");
const LFGFactoryABI = require("../artifacts/contracts/core/LFGFactory.sol/LFGFactory.json");
const LFGRouterABI = require("../artifacts/contracts/core/LFGRouter.sol/LFGRouter.json");

//monad testnet:
// Governance Address: 0x857511A18F30C5FbC8f016Fa526bb72D643220bB
// LFGRouter Address: 0xb1CbBF733CE33b4472f7D18C5D4A71C289aA18b1
// LFGFactory Address: 0x1E42af2b7a683844F2a68910D81aE4Bcd2973fb1
// LFGStroage Address: 0x7B0c19759D6711FA3a1dF3910F2504501FED7777
// Collection 0 Address: 0x771E9B3F02474bBa63F722E411ff84AdFC44F672
// Collection 0 的Token0 : 0x1487A31afEbF325571FcF868f9bAB6C81820B89A

//sonic testnet:
// Governance Address: 0xE76e96FCDc56BE6F44F11aaec03713B2195E6377
// LFGRouter Address: 0x7c116D284096577ECD915A7742c13019A0cCa9AE
// LFGFactory Address: 0xC4993F18E3B1De62e92a68d498d953D263E264a1
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

  const fee = ethers.parseEther("0.1");
  const governance = await hre.ethers.getContractFactory("Governance");
  const Governance = await governance.deploy(
    owner.address,
    manager.address,
    manager.address,
    fee
  );
  const GovernanceAddress = Governance.target;
  console.log("Governance Address:", GovernanceAddress);

  // const GovernanceAddress="0x857511A18F30C5FbC8f016Fa526bb72D643220bB";
  // const Governance=new ethers.Contract(GovernanceAddress, GovernanceABI.abi, owner);

  const lfgRouter = await hre.ethers.getContractFactory("LFGRouter");
  const LFGRouter = await lfgRouter.deploy(GovernanceAddress);
  const LFGRouterAddress = LFGRouter.target;
  console.log("LFGRouter Address:", LFGRouterAddress);

  const lfgFactory = await hre.ethers.getContractFactory("LFGFactory");
  const LFGFactory = await lfgFactory.deploy(LFGRouterAddress);
  const LFGFactoryAddress = LFGFactory.target;
  console.log("LFGFactory Address:", LFGFactoryAddress);

  const lfgStorage = await hre.ethers.getContractFactory("LFGStorage");
  const LFGStorage = await lfgStorage.deploy(LFGRouterAddress);
  const LFGStorageAddress = LFGStorage.target;
  console.log("LFGStorage Address:", LFGStorageAddress);

  //create collection
  const createCollection = await LFGFactory.createCollection(
    "LFG Plant Genesis Collection",
    "LFG"
  );
  const createCollectionTx = await createCollection.wait();
  console.log("Create collection success:", createCollectionTx.hash);

  const collectionAddress = await LFGFactory.IdToCollection(0);
  console.log("Collection Address:", collectionAddress);

  const Collection = new ethers.Contract(
    collectionAddress,
    LFGCollectionABI.abi,
    owner
  );
  // const create = await Collection.create(
  //     18,
  //     ethers.parseEther("100000"),
  //     "LFG Plant Story 1",
  //     "Story1",
  //     "Welcome to LFG Plant world",
  //     "",
  //     {value: fee}
  // );
  // const createTx = await create.wait();
  // console.log("Create success:", createTx);

  // const idToTokenInfo = await Collection.getTokenInfo(0n);
  // console.log("Token Info:", idToTokenInfo);

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
  const create = await LFGRouter.create(CreateParams,{ value: fee });
  const createTx = await create.wait();
  console.log("Create success:", createTx.hash);

  const idToTokenInfo = await Collection.getTokenInfo(0n);
  console.log("Token Info:", idToTokenInfo);

  const UserLFGToken = new ethers.Contract(idToTokenInfo[8], LFGTokenABI.abi, owner);
  const UserBalance=await UserLFGToken.balanceOf(owner.address);
  console.log("UserBalance:", UserBalance);

  // const updateOwner=await Collection.updateOwner(0n);
  // const updateOwnerTx=await updateOwner.wait();
  // console.log("updateOwner tx:", updateOwnerTx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
