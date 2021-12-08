import styled from "styled-components";

export const Spacer = styled.div`
  ${({ height, width }) => `
    height: ${(height || "10") + "px"};
    width: ${(width || "10") + "px"};
  `}
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
