const hre = require("hardhat");

const LFGTokenABI = require("../artifacts/contracts/core/LFGToken.sol/LFGToken.json");
const LFGCollectionABI = require("../artifacts/contracts/core/LFGCollection.sol/LFGCollection.json");
const GovernanceABI = require("../artifacts/contracts/core/Governance.sol/Governance.json");
const LFGFactoryABI = require("../artifacts/contracts/core/LFGFactory.sol/LFGFactory.json");
const LFGRouterABI = require("../artifacts/contracts/core/LFGRouter.sol/LFGRouter.json");
const LFGStorageABI = require("../artifacts/contracts/core/LFGStorage.sol/LFGStorage.json");

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

  

  for(let i=0; i<11; i++){  
    //create collection
    const createCollection = await LFGFactory.createCollection(
        "LFG Plant Genesis Collection",
        "LFG"
    );
    const createCollectionTx = await createCollection.wait();
    console.log("Create collection success:", createCollectionTx.hash);
  }

//   const getUserCollectionInfo1 = await LFGFactory.getUserCollectionInfo(owner.address, 0);
//   console.log("getUserCollectionInfo1:", getUserCollectionInfo1);

  const len = 5n;
  const lastId = await LFGFactory.CollectionId();
  console.log("lastId:", lastId);
  const getUserCollectionInfo2 = await LFGFactory.getUserCollectionInfo(LFGFactoryAddress, lastId - len);
  console.log("getUserCollectionInfo2:", getUserCollectionInfo2);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
