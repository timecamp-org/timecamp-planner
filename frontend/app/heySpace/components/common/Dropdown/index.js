import Component from './component';
import EnhanceDropdown from './enhancers/EnhanceDropdown';
import EnhanceWithStretchComponentToBottomWithMargin from 'enhancers/EnhanceWithStretchComponentToBottomWithMargin';

import { gridCellSize } from 'styles/common.css';

export default EnhanceWithStretchComponentToBottomWithMargin(EnhanceDropdown(Component), 30);
