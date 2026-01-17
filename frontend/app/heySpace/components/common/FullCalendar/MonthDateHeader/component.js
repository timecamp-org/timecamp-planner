import styled from 'styles/styled';
import { format } from 'common/utils/dateOperations';

const DaySpan = styled.span`
  color: var(--color-gray-900);
`;

function MonthDateHeader(props) {
  const { date } = props;
  const day = format(date, 'D');

  return <DaySpan>{day}</DaySpan>;
}

export default MonthDateHeader;
