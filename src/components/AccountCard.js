import React from "react";

import ConnectButton from "./ConnectButton";

import styled from "styled-components";

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

const Card = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid black;
  border-radius: 1rem;
  width: 100%;
`;
