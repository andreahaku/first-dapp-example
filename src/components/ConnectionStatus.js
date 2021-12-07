import React from "react";

import styled from "styled-components";

const ConnectionStatus = ({ isConnected }) => {
  return (
    <StatusRow>
      <h4>{"Status:"}</h4>
      <Spacer width={5} />
      <p>{`${isConnected ? "" : "not "}connected`}</p>
    </StatusRow>
  );
};

export default ConnectionStatus;

const StatusRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Spacer = styled.div`
  ${({ height, width }) => `
    height: ${(height || "10") + "px"};
    width: ${(width || "10") + "px"};
  `}
`;
