import React from "react";
import styled from "styled-components";

import { Spacer } from "../styling/global";

const ConnectionStatus = ({ isConnected }) => (
  <StatusRow>
    <h4>{"Status:"}</h4>
    <Spacer width={5} />
    <p>{`${isConnected ? "" : "not "}connected`}</p>
  </StatusRow>
);

export default ConnectionStatus;

const StatusRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
