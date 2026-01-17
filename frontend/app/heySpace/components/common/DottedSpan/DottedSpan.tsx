import styled from 'styles/styled';

const DottedSpan = styled.span<{ $hasDot?: boolean }>`
  ${({ $hasDot }) =>
    $hasDot &&
    `
 position: relative;
 &::after {
   content: '';
   position: absolute;
   height: 7px;
   width: 7px;
   background-color: var(--color-accent-400);
   border-radius: 50%;
   right: -7px;
   top: 0;
 }`}
`;

export default DottedSpan;
