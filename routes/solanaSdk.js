const express = require("express");
const router = express.Router();
const Moralis = require("moralis-v1/node");
const solanaWeb3 = require('@solana/web3.js');

require("dotenv").config();

const headers = {
  "content-type": "application/json;"
};

let globalkeyPair = {}
let programId = new solanaWeb3.PublicKey("1xHcmkwBTDhesvtvHBB1semu6zz6xWdKNyXetLAmvGT")


const establishConnection = async () => {
  rpcUrl = "https://api.devnet.solana.com";
  connection = new solanaWeb3.Connection(rpcUrl, 'confirmed');
}

const createAccount = async () => {
  let keyPair = solanaWeb3.Keypair.generate();
  let secretKey = Uint8Array.from(keyPair.secretKey)
  keyPair = solanaWeb3.Keypair.fromSecretKey(secretKey);
  console.log(keyPair);


  globalkeyPair.publicKey = keyPair.publicKey
  globalkeyPair.secretKey = keyPair.secretKey
  globalkeyPair.keyPair = keyPair
};

const createPDAAccount = async () => {
  splaccount = solanaWeb3.Keypair.generate();
  const transaction = new solanaWeb3.Transaction();
  const instruction = solanaWeb3.SystemProgram.createAccount({
    fromPubkey: globalkeyPair.publicKey,
    newAccountPubkey: splaccount.publicKey,
    space: 165,
    lamports: 1000,
    programId,
  })

  transaction.add(instruction);
  const signature = await solanaWeb3.sendAndConfirmTransaction(
    connection,
    transaction,
    [globalkeyPair.keyPair, splaccount])

  console.log(signature);
}

const airdropRequest = async () => {
  let airdropSignature = await connection.requestAirdrop(
    new solanaWeb3.PublicKey(globalkeyPair.publicKey),
    solanaWeb3.LAMPORTS_PER_SOL,
  );

  await connection.confirmTransaction(airdropSignature);
  console.log("AirDropped 1 solana successfully")
}

router.get("/", async (req, res) => {
  establishConnection();
  console.log('Connection to cluster established:', rpcUrl);
  const Info = await connection.getEpochInfo()
  console.log("-----------------\n", Info);
  res.send([rpcUrl, Info])
})

router.post("/generateKeypair", async (req, res) => {
  establishConnection();
  createAccount();
  airdropRequest();
  // await createPDAAccount();
  res.send({
    "publickey": globalkeyPair.publicKey,
    "privateKey": globalkeyPair.secretKey,
    "keypair": globalkeyPair.keyPair
  })
})

router.post("/requestAirDrop", async (req, res) => {
  establishConnection();
  if (req.body.publicKey === undefined){
    res.status(500).send({ error: "Invalid public Key" });
  } else {
    let airdropSignature = await connection.requestAirdrop(
      new solanaWeb3.PublicKey(req.body.publicKey),
      solanaWeb3.LAMPORTS_PER_SOL,
    );
  
    await connection.confirmTransaction(airdropSignature);
  
    res.send("AirDropped 1 solana successfully")
  }

  
})

router.get("/getBalance", async (req, res) => {
  establishConnection();

  if (req.body.publicKey === undefined){
    res.status(500).send({ error: "Invalid public Key" });
  } else {
    let balance = await connection.getBalance(new solanaWeb3.PublicKey(req.body.publicKey));
    console.log(`balance: ${balance / 1000000000}`);
    res.send({
    "balance": balance / 1000000000
  });
  }
  
})

// router.post("/createPDAAccount", async (req, res) => {
//   establishConnection();
//   const createPDAAccount = async () => {
//     let publicKey = req.body.publicKey
//     let keyPair = req.body.keyPair
//     // publicKey = new solanaWeb3.PublicKey(publicKey)
//     console.log(publicKey);

//     splaccount = solanaWeb3.Keypair.generate();
//     const transaction = new solanaWeb3.Transaction();
//     const instruction = solanaWeb3.SystemProgram.createAccount({
//       fromPubkey: publicKey,
//       newAccountPubkey: splaccount.publicKey,
//       space: 165,
//       lamports: 1000,
//       programId,
//     })

//     const signature = await solanaWeb3.sendAndConfirmTransaction(
//       connection,
//       transaction,
//       [keyPair, splaccount])

//     console.log(signature);
//   }
//   createPDAAccount();
// })


// router.get("/sdk", async (req, res) => {
//   const establishConnection = async () => {
//     rpcUrl = "https://api.devnet.solana.com";
//     connection = new solanaWeb3.Connection(rpcUrl, 'confirmed');
//     console.log('Connection to cluster established:', rpcUrl);
//   }
//   const connectWallet = async () => {
//     let secretKey = Uint8Array.from([192, 211, 41, 49, 181, 13, 39, 208, 7, 47, 58, 36, 239, 174, 198, 69, 151, 158, 219, 8, 249, 131, 102, 223, 199, 77, 12, 211, 251, 74, 180, 195, 239, 26, 123, 16, 73, 49, 214, 38, 83, 28, 199, 9, 201, 32, 49, 89, 101, 10, 166, 184, 1, 132, 79, 22, 138, 51, 73, 206, 214, 40, 61, 118]
//     );
//     keypair = solanaWeb3.Keypair.fromSecretKey(secretKey);
//     console.log('keypair created');
//   }
//   const createPDAAccount = async () => {
//     splaccount = solanaWeb3.Keypair.generate();
//     const transaction = new solanaWeb3.Transaction();
//     const instruction = solanaWeb3.SystemProgram.createAccount({
//       fromPubkey: keypair.publicKey,
//       newAccountPubkey: splaccount.publicKey,
//       space: 165,
//       lamports: 1000,
//       programId,
//     });
//     transaction.add(instruction);
//     var signature = await solanaWeb3.sendAndConfirmTransaction(
//       connection,
//       transaction,
//       [keypair, splaccount]);
//     console.log(signature);
//   }
//   const balance = async () => {
//     let balance = await connection.getBalance(keypair.publicKey);
//     console.log(keypair.publicKey.toString());
//     console.log(`balance: ${balance}`);
//   }
//   establishConnection();
//   connectWallet();
//   balance();
//   createPDAAccount();
// });

module.exports = router;