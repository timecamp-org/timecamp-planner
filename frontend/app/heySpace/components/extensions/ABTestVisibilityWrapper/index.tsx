import { TestGranulation, TestType } from 'models/component/ABTestsModel/types';
import useComponent from './hook';

export type ABTestVisibilityWrapperInterface = {
  testType: TestType;
  granulation?: TestGranulation;
  fallbackGranulation?: TestGranulation;
  baseComponent?: JSX.Element;
};

const defaultProps = {
  granulation: TestGranulation.ORGANIZATION,
  fallbackGranulation: TestGranulation.ORGANIZATION,
};

const ABTestVisibilityWrapper: ReactFCWithChildren<ABTestVisibilityWrapperInterface> = (props) => {
  const { isABTestEnabled } = useComponent(props);
  if (!isABTestEnabled) {
    return props.baseComponent || null;
  }

  return <>{props.children}</>;
};

ABTestVisibilityWrapper.defaultProps = defaultProps;

export default ABTestVisibilityWrapper;
