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

  // automatically hides any error message after 2 seconds
  useEffect(() => {
    setTimeout(() => setErrorMessage(false), 2000);
  }, [errorMessage]);

  // selects the account from wallet
  const selectAccount = async (isFirst = true, isReset = false) => {
    if (typeof window.ethereum !== "undefined") {
      const { ethereum } = window;

      setIsConnected(ethereum.isConnected());

      // gets selected account
      let account = await ethereum.request({
        method: "eth_requestAccounts",
      });

      // requests permission to wallet to select a new account
      if (!isFirst || isReset) {
        await ethereum.request({
          method: "wallet_requestPermissions",
          params: [
            {
              eth_accounts: {},
            },
          ],
        });

        // asks to select a new account
        account = await ethereum.request({
          method: "eth_requestAccounts",
          params: [
            {
              eth_accounts: {},
            },
          ],
        });
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

  // splits the balance between the two accounts
  const splitBalance = () => {
    console.log("SPLIT");
  };

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
              (parseFloat(accounts[FIRST].balance) +
                parseFloat(accounts[SECOND].balance)) /
              2
            } ETH`}</p>
          </Row>
          <ConnectButton label={"Split Balance"} onClick={splitBalance} />
        </>
      )}

      {<ErrorMessage>{errorMessage}</ErrorMessage>}
    </>
  );
};

export default BalanceSplitter;

const ErrorMessage = styled.h4`
  color: red;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 2rem;
`;
