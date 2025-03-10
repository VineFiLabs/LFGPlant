const hre = require("hardhat");

const LFGTokenABI = require("../artifacts/contracts/core/LFGToken.sol/LFGToken.json");
const LFGCollectionABI = require("../artifacts/contracts/core/LFGCollection.sol/LFGCollection.json");
const GovernanceABI = require("../artifacts/contracts/core/Governance.sol/Governance.json");
const LFGFactoryABI = require("../artifacts/contracts/core/LFGFactory.sol/LFGFactory.json");
const LFGRouterABI = require("../artifacts/contracts/core/LFGRouter.sol/LFGRouter.json");
const LFGStorageABI = require("../artifacts/contracts/core/LFGStorage.sol/LFGStorage.json");

//monad testnet:
// Governance Address: 0x857511A18F30C5FbC8f016Fa526bb72D643220bB
// LFGRouter Address: 0xcbd2Ee09EE46Ddb30d2e86E9859eCc69b3095695
// LFGFactory Address: 0x5086dd231C4f976F8b25f2443E7cc2f20Fd9A2D1
// LFGStroage Address: 0xfD9196b3bF08ddbbc28B7a8705c7517480c12159

//sonic testnet:
// Governance Address: 0xF4F41E44e3671039150Ec4A36358b68C7ad344Ac
// LFGRouter Address: 0x04A7A2346434952a1C818266117C769C3d9a36a9
// LFGFactory Address: 0xd826F63ABE7f8Cd37E3c3D19Fee261768B073418
// LFGStorage Address: 0xa67948677E0644FC68be16834Cf29824B529498F
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
  const GovernanceAddress = "0x857511A18F30C5FbC8f016Fa526bb72D643220bB";
  // const LFGStorageAddress = "0x5086dd231C4f976F8b25f2443E7cc2f20Fd9A2D1";
  const LFGRouterAddress="0xcbd2Ee09EE46Ddb30d2e86E9859eCc69b3095695";
  // const LFGFactoryAddress = "0xfD9196b3bF08ddbbc28B7a8705c7517480c12159";

  //sonic
  // const GovernanceAddress = "0xE76e96FCDc56BE6F44F11aaec03713B2195E6377";
  // const LFGStorageAddress = "0xf08662C279034fE3348608c873A289aAf66c2d64";
  // const LFGRouterAddress="0x13905f3bcecccEBbe56B94f2bc131A1823757CBe";
  // const LFGFactoryAddress = "0x857511A18F30C5FbC8f016Fa526bb72D643220bB";

  // const LFGStorage = new ethers.Contract(LFGStorageAddress, LFGStorageABI.abi, owner);
  // const LFGRouter = new ethers.Contract(LFGRouterAddress, LFGRouterABI.abi, owner);

  //change router
  // const changeRouter = await LFGStorage.changeCaller(LFGRouterAddress);
  // const changeRouterTx = await changeRouter.wait();
  // console.log("changeRouter tx:", changeRouterTx.hash);

  // const fee = ethers.parseEther("0.1");
  // const governance = await hre.ethers.getContractFactory("Governance");
  // const Governance = await governance.deploy(
  //   owner.address,
  //   manager.address,
  //   manager.address,
  //   fee
  // );
  // const GovernanceAddress = Governance.target;
  // console.log("Governance Address:", GovernanceAddress);

  // const GovernanceAddress="0xE76e96FCDc56BE6F44F11aaec03713B2195E6377";
  // const Governance=new ethers.Contract(GovernanceAddress, GovernanceABI.abi, owner);


  // const lfgRouter = await hre.ethers.getContractFactory("LFGRouter");
  // const LFGRouter = await lfgRouter.deploy(GovernanceAddress);
  // const LFGRouterAddress = LFGRouter.target;
  // console.log("LFGRouter Address:", LFGRouterAddress);

  // const LFGRouterAddress = "0xcbd2Ee09EE46Ddb30d2e86E9859eCc69b3095695"; 

  const lfgFactory = await hre.ethers.getContractFactory("LFGFactory");
  const LFGFactory = await lfgFactory.deploy(LFGRouterAddress);
  const LFGFactoryAddress = LFGFactory.target;
  console.log("LFGFactory Address:", LFGFactoryAddress);

  // const LFGFactory = new ethers.Contract(LFGFactoryAddress, LFGFactoryABI.abi, owner);

  const lfgStorage = await hre.ethers.getContractFactory("LFGStorage");
  const LFGStorage = await lfgStorage.deploy(LFGRouterAddress);
  const LFGStorageAddress = LFGStorage.target;
  console.log("LFGStorage Address:", LFGStorageAddress);

  //create collection
  // const createCollection = await LFGFactory.createCollection(
  //   "LFG Plant Genesis Collection",
  //   "LFG"
  // );
  // const createCollectionTx = await createCollection.wait();
  // console.log("Create collection success:", createCollectionTx.hash);

  // const getUserCollectionInfo = await LFGFactory.getUserCollectionInfo(LFGFactoryAddress, 0);
  // console.log("getUserCollectionInfo:", getUserCollectionInfo);

  // const Collection = new ethers.Contract(
  //   getUserCollectionInfo[1],
  //   LFGCollectionABI.abi,
  //   owner
  // );

  // const CreateParams = {
  //       tokenDecimals: 18,
  //       collction: getUserCollectionInfo[1], 
  //       lfgURLStorage: LFGStorageAddress,
  //       lfgMaxSupply:  ethers.parseEther("100000"),
  //       tokenName:  "LFG Plant Story 1",
  //       tokenSymbol: "LFG Story1",
  //       content: "Welcome to LFG Plant world",
  //       imageURI: "https://9ddc5954c64cf31c9c8b721bae2421d3.ipfs.4everland.link/ipfs/bafkreidtjxmovj5qbtw36ykcv2fot5xvcp3bdgl7ay7hpo7now7b6afrw4"
  // };
  // const create = await LFGRouter.create(CreateParams,{ value: fee });
  // const createTx = await create.wait();
  // console.log("Create success:", createTx.hash);

  // const idToTokenInfo = await Collection.getTokenInfo(0n);
  // console.log("Token Info:", idToTokenInfo);

  // const UserLFGToken = new ethers.Contract(idToTokenInfo[8], LFGTokenABI.abi, owner);
  // const UserBalance=await UserLFGToken.balanceOf(owner.address);
  // console.log("UserBalance:", UserBalance);

  // const getUserCollectionInfo = await LFGFactory.getUserCollectionInfo(owner.address, 0);
  // console.log("getUserCollectionInfo:", getUserCollectionInfo);

  // const updateOwner=await Collection.updateOwner(0n);
  // const updateOwnerTx=await updateOwner.wait();
  // console.log("updateOwner tx:", updateOwnerTx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
