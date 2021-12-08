import React from "react";

import styled from "styled-components";

const ConnectButton = ({ label, onClick }) => (
  <StyledConnectButton onClick={onClick}>
    <h3>{label}</h3>
  </StyledConnectButton>
);

export default ConnectButton;

const StyledConnectButton = styled.button`
  border: none;
  border-radius: 1rem;
  background-color: orange;
  padding: 0px 1rem;
  cursor: pointer;
  transition-duration: 0.4s;
  color: white;

  :hover {
    background-color: lightgray;
  }
`;
