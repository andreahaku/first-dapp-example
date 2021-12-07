import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import ConnectButton from "../components/ConnectButton";
import AccountCard from "../components/AccountCard";

import styled from "styled-components";
import ConnectionStatus from "../components/ConnectionStatus";

const BalanceSplitter = () => {
  const [isConnected, setIsConnected] = useState(false);

  const [firstAccountId, setFirstAccountId] = useState(false);
  const [firstAccountBalance, setFirstAccountBalance] = useState(0);

  const [secondAccountId, setSecondAccountId] = useState(false);
  const [secondAccountBalance, setSecondAccountBalance] = useState(0);

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

        // updates requested account
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

      if (isFirst) {
        setFirstAccountId(account[0]);
        setFirstAccountBalance(ethers.utils.formatEther(balance));
      } else {
        setSecondAccountId(account[0]);
        setSecondAccountBalance(ethers.utils.formatEther(balance));
      }
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
            {firstAccountId && (
              <AccountCard
                isFirst
                account={firstAccountId}
                balance={firstAccountBalance}
                accountSelectHandler={() => selectAccount(true, true)}
              />
            )}

            <Spacer height={10} />

            {firstAccountId && !secondAccountId ? (
              <ConnectButton
                label={"Select SECOND Account"}
                onClick={() => selectAccount(false)}
              />
            ) : (
              <AccountCard
                account={secondAccountId}
                balance={secondAccountBalance}
                accountSelectHandler={() => selectAccount(false, true)}
              />
            )}
          </CardsContainer>
        </>
      )}

      {firstAccountId && secondAccountId && (
        <>
          <Row>
            <h3>{"Average Balance:"}</h3>
            <Spacer width={10} />
            <p>{`${
              (parseFloat(firstAccountBalance) +
                parseFloat(secondAccountBalance)) /
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

const Spacer = styled.div`
  ${({ height, width }) => `
    height: ${(height || "10") + "px"};
    width: ${(width || "10") + "px"};
  `}
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
