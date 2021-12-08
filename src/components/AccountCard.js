import React from "react";
import styled from "styled-components";

import ConnectButton from "./ConnectButton";

import { Spacer, Row } from "../styling/global";

const AccountCard = ({ isFirst, account, balance, accountSelectHandler }) => {
  return (
    <Card>
      <Row>
        <h3>{`${isFirst ? "First" : "Second"} Account:`}</h3>
        <Spacer width={10} />
        <p>{account}</p>
      </Row>

      <Row>
        <h3>{"Balance:"}</h3>
        <Spacer width={10} />
        <p>{`${balance} ETH`}</p>
      </Row>

      <ConnectButton label={"Change Account"} onClick={accountSelectHandler} />
    </Card>
  );
};

export default AccountCard;

const Card = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid black;
  border-radius: 1rem;
  width: 100%;
`;
