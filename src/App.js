import { useState } from "react";
import "./App.css";
import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";

import contractAddress from "./contract/address.json";

import DonateKhuong from "./contract/donate.json";

function App() {
  const [address, setAddress] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [contract, setContract] = useState(null);

  const [donate, setDonate] = useState(0);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install Metamask");
      return;
    }
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const _address = await signer.getAddress();
    setAddress(_address);

    const _chainId = await provider.getNetwork();
    if (_chainId.chainId !== 17000n) {
      alert("Please switch to the correct network");
      return;
    }

    const contract = new Contract(
      contractAddress.address,
      DonateKhuong.abi,
      signer
    );
    setContract(contract);

    const balance = await contract.accounts(_address);
    console.log(balance);
    setBalance(balance);
  };

  const Donate = async () => {
    await contract.Donate({ value: parseEther(donate) });
  };

  const checkOwner = async () => {
    const owner = await contract.owner();
  };
  const withdraw = async () => {
    await contract.withdraw();
    alert("withdraw completed!");
    const balance = await contract.accounts(address);
    setBalance(balance);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {!checkOwner && (
            <div style={{ display: address ? "block" : "none" }}>
              <p>
                <code>Your accounts: {address && address}</code>
              </p>
              <p>Balance: {balance && formatEther(balance).toString()} ETH</p>
              <div
                style={{
                  width: "200px",
                  margin: "auto",
                }}
              >
                <input
                  onChange={(e) => setDonate(e.target.value)}
                  type="number"
                />
                <button onClick={Donate}>Donate</button>
              </div>
            </div>
          )}

          {checkOwner && (
            <div style={{ display: contract ? "block" : "none" }}>
              <p>
                <code>Your accounts: {address && address}</code>
              </p>
              <p>Balance: {balance && formatEther(balance).toString()} ETH</p>
              <div
                style={{
                  width: "200px",
                  margin: "auto",
                }}
              >
                <button onClick={withdraw}>Withdraw</button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={connectWallet}
          style={{
            display: contract ? "none" : "block",
            backgroundColor: "white",
            color: "black",
            padding: "20px, 40px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "30px",
            width: "500px",
            height: "200px",
          }}
        >
          Connect your wallet
        </button>
      </header>
    </div>
  );
}

export default App;
