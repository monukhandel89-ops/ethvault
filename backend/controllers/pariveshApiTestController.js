const express = require('express');
const Web3 = require("web3").default;
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const contractJsonPath = path.resolve(__dirname, '../build', 'contracts', 'SampleERC20.json');
const contractJson = JSON.parse(fs.readFileSync(contractJsonPath, 'utf8'));

const web3 = new Web3("http://127.0.0.1:8545");

let contract;
let accounts;

async function initContract() {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = contractJson.networks[networkId];

    if (!deployedNetwork) {
        console.error("❌ Contract not deployed on this network.");
        process.exit(1);
    }

    contract = new web3.eth.Contract(contractJson.abi, deployedNetwork.address);
    accounts = await web3.eth.getAccounts();
    console.log("✅ Contract initialized");
}

initContract();


// mint ERC20 contract
exports.mint = async (req, res) => {
  const { to, amount } = req.body;

    try {
        const weiAmount = web3.utils.toWei(amount.toString(), "ether");
        await contract.methods.mint(to, weiAmount).send({
            from: accounts[0],
            gas: 300000,
            gasPrice: web3.utils.toWei("20", "gwei")
        });

        return res.json({ message: `Minted ${amount} tokens to ${to}` });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Minting failed" });
    }
};


// balance
exports.balance = async (req, res) => {
   const { address } = req.params;


    try {
        const balance = await contract.methods.balanceOf(address).call();
        const formatted = web3.utils.fromWei(balance, "ether");
        return res.json({ address, balance: formatted });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch balance" });
    }
};