import styled from 'styles/styled';

export const TextUnderlined = styled.span<{ $isUnderlined: boolean }>`
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background-color: ${({ $isUnderlined }) => ($isUnderlined ? 'var(--color-accent-500)' : 'transparent')};
  }
`;
