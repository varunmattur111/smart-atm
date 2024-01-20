import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [depositPin, setDepositPin] = useState("");
  const [withdrawalPin, setWithdrawalPin] = useState("");
  const [pin, setPin] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [amount, setAmount] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const depositPinCorrect = "9676";
  const withdrawalPinCorrect = "3452";

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const deposit = async () => {
    if (atm && amount) {
      setTransactionType("Deposit");
      let tx = await atm.deposit(amount);
      await tx.wait();
      getBalance();
    } else {
      alert("Please enter a valid deposit amount.");
    }
  };

  const withdraw = async () => {
    if (atm && amount) {
      setTransactionType("Withdrawal");
      let tx = await atm.withdraw(amount);
      await tx.wait();
      getBalance();
    } else {
      alert("Please enter a valid withdrawal amount.");
    }
  };

  const handleNumberPadClick = (number) => {
    setPin((prevPin) => prevPin + number);
  };

  const clearPin = () => {
    setPin("");
  };

  const handleTransactionType = (type) => {
    setTransactionType(type);
    setPin("");
  };

  const handlePinSubmit = () => {
    if (transactionType === "Deposit" && pin === depositPinCorrect) {
      setPin("");
    } else if (transactionType === "Withdrawal" && pin === withdrawalPinCorrect) {
      setPin("");
    } else {
      alert("Incorrect PIN. Please try again.");
      setPin("");
    }
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      <div>
        {ethWallet && (
          <div>
            {account ? (
              <div>
                <p>Your Account: {account}</p>
                <p>Your Balance: {balance}</p>
                <div>
                  <section>
                    <h2>Deposit Section</h2>
                    <button onClick={() => handleTransactionType("Deposit")}>Deposit</button>
                    {transactionType === "Deposit" && (
                      <div>
                        <input
                          type="number"
                          placeholder="Enter amount"
                          value={amount}
                          onChange={handleAmountChange}
                        />
                        <input type="text" placeholder="Enter PIN" value={pin} readOnly />
                        <div>
                          <button onClick={() => handleNumberPadClick("1")}>1</button>
                          <button onClick={() => handleNumberPadClick("2")}>2</button>
                          <button onClick={() => handleNumberPadClick("3")}>3</button>
                        </div>
                        <div>
                          <button onClick={() => handleNumberPadClick("4")}>4</button>
                          <button onClick={() => handleNumberPadClick("5")}>5</button>
                          <button onClick={() => handleNumberPadClick("6")}>6</button>
                        </div>
                        <div>
                          <button onClick={() => handleNumberPadClick("7")}>7</button>
                          <button onClick={() => handleNumberPadClick("8")}>8</button>
                          <button onClick={() => handleNumberPadClick("9")}>9</button>
                        </div>
                        <div>
                          <button onClick={clearPin}>Clear</button>
                          <button onClick={() => handleNumberPadClick("0")}>0</button>
                          <button onClick={handlePinSubmit}>Submit</button>
                        </div>
                      </div>
                    )}
                    {transactionType === "Deposit" && (
                      <div>
                        <p>Transaction Type: {transactionType}</p>
                        <button onClick={deposit}>Confirm Deposit</button>
                      </div>
                    )}
                  </section>

                  <section>
                    <h2>Withdrawal Section</h2>
                    <button onClick={() => handleTransactionType("Withdrawal")}>Withdraw</button>
                    {transactionType === "Withdrawal" && (
                      <div>
                        <input
                          type="number"
                          placeholder="Enter amount"
                          value={amount}
                          onChange={handleAmountChange}
                        />
                        <input type="text" placeholder="Enter PIN" value={pin} readOnly />
                        <div>
                          <button onClick={() => handleNumberPadClick("1")}>1</button>
                          <button onClick={() => handleNumberPadClick("2")}>2</button>
                          <button onClick={() => handleNumberPadClick("3")}>3</button>
                        </div>
                        <div>
                          <button onClick={() => handleNumberPadClick("4")}>4</button>
                          <button onClick={() => handleNumberPadClick("5")}>5</button>
                          <button onClick={() => handleNumberPadClick("6")}>6</button>
                        </div>
                        <div>
                          <button onClick={() => handleNumberPadClick("7")}>7</button>
                          <button onClick={() => handleNumberPadClick("8")}>8</button>
                          <button onClick={() => handleNumberPadClick("9")}>9</button>
                        </div>
                        <div>
                          <button onClick={clearPin}>Clear</button>
                          <button onClick={() => handleNumberPadClick("0")}>0</button>
                          <button onClick={handlePinSubmit}>Submit</button>
                        </div>
                      </div>
                    )}
                    {transactionType === "Withdrawal" && (
                      <div>
                        <p>Transaction Type: {transactionType}</p>
                        <button onClick={withdraw}>Confirm Withdrawal</button>
                      </div>
                    )}
                  </section>
                </div>
              </div>
            ) : (
              <div>
                <button onClick={connectAccount}>Connect Metamask Wallet</button>
              </div>
            )}
          </div>
        )}
      </div>
      <style jsx>{`
        .container {
          text-align: center;
        }

        section {
          margin-bottom: 20px;
        }
      `}</style>
    </main>
  );
}
