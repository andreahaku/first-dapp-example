import React, { useState, useEffect } from "react";

import { ethers } from "ethers";
import styled from "styled-components";

import ConnectButton from "../components/ConnectButton";
import AccountCard from "../components/AccountCard";
import ConnectionStatus from "../components/ConnectionStatus";

import { Spacer, Row } from "../styling/global";

const initialAccount = {
  id: "",
  balance: 0,
};

const FIRST = 0;
const SECOND = 1;

const BalanceSplitter = () => {
  const [isConnected, setIsConnected] = useState(false);

  const [accounts, setAccounts] = useState([initialAccount, initialAccount]);

  const [errorMessage, setErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  // automatically hides any error message after 2 seconds
  useEffect(() => {
    setTimeout(() => setErrorMessage(false), 2000);
  }, [errorMessage]);

  // requests permission to wallet to select a new account
  const requestNewAccount = async () => {
    const { ethereum } = window;

    await ethereum.request({
      method: "wallet_requestPermissions",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });

    // asks to select a new account
    const account = await ethereum.request({
      method: "eth_requestAccounts",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });

    return account;
  };

  // selects the account from wallet
  const selectAccount = async (isFirst = true, isReset = false) => {
    if (typeof window.ethereum !== "undefined") {
      const { ethereum } = window;

      setIsConnected(ethereum.isConnected());

      // gets selected account
      let account = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!isFirst || isReset) {
        // asks to select a new account
        account = await requestNewAccount();
      }

      // gets the balance of the selected account
      const balance = await ethereum.request({
        method: "eth_getBalance",
        params: [account[0], "latest"],
      });

      const tempAccount = [...accounts];

      tempAccount[isFirst ? FIRST : SECOND] = {
        id: account[0],
        balance: parseFloat(ethers.utils.formatEther(balance)),
      };

      setAccounts([...tempAccount]);
    } else {
      setErrorMessage("Please, install MetaMask");
    }
  };

  const dappReset = () => {
    const tempAccounts = [initialAccount, initialAccount];
    setAccounts([...tempAccounts]);
    setErrorMessage(false);
    setSuccessMessage(false);
    setIsConnected(window.ethereum?.isConnected());
  };

  // splits the balance between the two accounts
  const splitBalance = async () => {
    // average balance between the two accounts
    const average = (accounts[FIRST].balance + accounts[SECOND].balance) / 2;

    // which is the larger one?
    const isFirstBalanceGreater =
      accounts[FIRST].balance > accounts[SECOND].balance;

    const fromAccount = accounts[isFirstBalanceGreater ? FIRST : SECOND].id;
    const toAccount = accounts[isFirstBalanceGreater ? SECOND : FIRST].id;

    // calculates transaction value to balance accounts
    const transactionValue =
      average - accounts[isFirstBalanceGreater ? SECOND : FIRST].balance;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    if (isFirstBalanceGreater) {
      // asks to select the first account to sign the transaction
      // this is needed when the first account balance is larger that
      // the first one, and the transaction is from first > second
      alert(
        `Please select the first account:\n\nAccount: ${accounts[FIRST].id}\nBalance: ${accounts[FIRST].balance} ETH`
      );

      let account;

      // checks if the selected account is the right one
      while (!account || account[0] !== accounts[FIRST].id) {
        account = await requestNewAccount();
      }
    }

    // ETH transaction
    try {
      const tx = await signer.sendTransaction({
        from: fromAccount,
        to: toAccount,
        value: ethers.utils.parseEther(transactionValue.toString()),
      });

      setSuccessMessage(`TRANSACTION SUCCESSFULL:\n${tx.hash}`);

      // restarts the dapp after 5 seconds
      setTimeout(() => {
        setSuccessMessage(false);
        dappReset();
      }, 5000);
    } catch (error) {
      console.warn("ERROR:", error);
    }
  };

  // reloads the dapp if user changes network
  window.ethereum?.on("chainChanged", () => window.location.reload());

  return (
    <>
      <ConnectionStatus isConnected={isConnected} />

      {!isConnected ? (
        <ConnectButton
          onClick={() => selectAccount(true, false)}
          label="Connect to METAMASK to continue"
        />
      ) : (
        <>
          <h5>{"Select accounts to be balanced"}</h5>

          <CardsContainer>
            {accounts[FIRST].id && (
              <AccountCard
                isFirst
                account={accounts[FIRST].id}
                balance={accounts[FIRST].balance}
                accountSelectHandler={() => selectAccount(true, true)}
              />
            )}

            <Spacer height={10} />

            {accounts[FIRST].id && !accounts[SECOND].id ? (
              <ConnectButton
                label={"Select SECOND Account"}
                onClick={() => selectAccount(false)}
              />
            ) : (
              <AccountCard
                account={accounts[SECOND].id}
                balance={accounts[SECOND].balance}
                accountSelectHandler={() => selectAccount(false, true)}
              />
            )}
          </CardsContainer>
        </>
      )}

      {accounts[FIRST].id && accounts[SECOND].id && (
        <>
          <Row>
            <h3>{"Average Balance:"}</h3>
            <Spacer width={10} />
            <p>{`${
              (accounts[FIRST].balance + accounts[SECOND].balance) / 2
            } ETH`}</p>
          </Row>
          <ConnectButton label={"Split Balance"} onClick={splitBalance} />
        </>
      )}

      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </>
  );
};

export default BalanceSplitter;

const ErrorMessage = styled.h4`
  color: red;
`;

const SuccessMessage = styled.h3`
  color: green;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 2rem;
`;
