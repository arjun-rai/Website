import React, { useEffect, useState } from "react";
import './TimeCapsule.css';
import abi from './utils/WavePortal.json';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
const { ethers } = require("ethers");

const TimeCapsule = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0xa8D0B4506EaD4cCC546CEF32c9C398423eEb26AA";
  const contractABI = abi.abi;
  const [MsgValue, setMsgValue] = React.useState("")

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();
        

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);

        wavePortalContract.on("NewWave", (from, timestamp, message) => {
          console.log("NewWave", from, timestamp, message);

          setAllWaves(prevState => [...prevState, {
            address: from,
            timestamp: new Date(timestamp * 1000),
            message: message
          }]);
        });
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    /*
    First make sure we have access to window.ethereum
    */
     try {
      const { ethereum } = window;
     

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

     
      //Check if we're authorized to access the user's wallet
      
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
        getAllWaves();
    } else {
        console.log("No authorized account found")
    }
  } 
  catch (error) {
      console.log(error);
  }
}

const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

         /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave(MsgValue, {gasLimit:300000});
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
    finally
    {
      setMsgValue("");
    }
}

  // This runs our function when the page loads 
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        🕒 Time Capsule 🕒
        </div>


        <div className="bio">
        Made by Arjun. <br/> 
        Connect your Rinkeby Ethereum wallet and store your message! 
        <br/>
        You can also have a chance to win 0.0001 ETH!
        </div>

        <button className="waveButton" onClick={wave}>
           Store Message
        </button>
        {
        /*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        <textarea name="msgArea"
            placeholder="Message:"
            type="text"
            className="message"
            value={MsgValue}
            onChange={e => setMsgValue(e.target.value)} />
        <SimpleBar className="totalHistory">
         {allWaves.map((wave, index) => {
          return (
            <div className="history" key={index}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
        </SimpleBar>

      </div>
    </div>
  );
}

export default TimeCapsule
