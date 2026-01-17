import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import ABTestVisibilityWrapper from 'components/extensions/ABTestVisibilityWrapper';
import { CardDescriptionEditorNext } from 'components/tasks/CardDescriptionEditorNext';
import CardDetailsDescriptionEditor from 'components/tasks/CardDetailsDescriptionEditor';
import { TestGranulation, TestType } from 'models/component/ABTestsModel/types';
import styles from './styles.css';

CardDescriptionSection.propTypes = {
  taskId: PropTypes.string.isRequired,
  color: PropTypes.string,
  isFocused: PropTypes.bool,

  onClick: PropTypes.func,
};

CardDescriptionSection.defaultProps = {
  isFocused: false,

  onClick: doNothing,
};

function CardDescriptionSection(props) {
  const onKeyDown = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={props.className || styles.Component} onKeyDown={onKeyDown}>
      <ABTestVisibilityWrapper
        testType={TestType.TIMECAMP_ORGANIZATION}
        granulation={TestGranulation.ORGANIZATION}
        baseComponent={<CardDetailsDescriptionEditor taskId={props.taskId} />}
      >
        <CardDescriptionEditorNext taskId={props.taskId} />
      </ABTestVisibilityWrapper>
    </div>
  );
}

export default CardDescriptionSection;
