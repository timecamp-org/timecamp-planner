import { ButtonPopover } from 'components/buttons/ButtonPopover';

import { ArchiveCardModal } from './ArchiveCardModal/ArchiveCardModal';
import { CardDetailsDefaultMenu } from './CardDetailsDefaultMenu/CardDetailsDefaultMenu';
import { PopperContextConsumer, PopperContextProvider } from './CardDetailsPopperContext';
import { CopyCardMenu } from './CopyCardMenu/CopyCardMenu';
import { MoveAndUnarchiveTaskModal } from './MoveAndUnarchiveCardModal/MoveAndUnarchiveCardModal';
import { Target } from './Target/Target';
import { CardDetailsMoreOptionsInterface } from './types';

const CardDetailsMoreOptions = (props: CardDetailsMoreOptionsInterface) => {
  const {
    targetClassName,
    popperContentWrapperClassName,
    targetRenderer,
    iconClassName,
    color,
    popperPlacement,
    onSetIsPopperOpen,
  } = props;

  return (
    <PopperContextProvider {...props}>
      <PopperContextConsumer>
        {({ isPopperOpen, contentType, onTargetClick, isArchiveModalOpen, isMoveAndUnarchiveModalOpen }) => (
          <>
            <ButtonPopover
              targetClassName={targetClassName}
              popperContentWrapperClassName={popperContentWrapperClassName}
              popperPlacement={popperPlacement}
              popperComponentRenderer={({ onClose }) =>
                contentType === 'copyCard' ? (
                  <CopyCardMenu {...props} />
                ) : (
                  <CardDetailsDefaultMenu {...props} onClosePopover={onClose} />
                )
              }
              targetContent={
                targetRenderer ? (
                  targetRenderer(onTargetClick)
                ) : (
                  <Target color={color} iconClassName={iconClassName} isActive={isPopperOpen} onClick={onTargetClick} />
                )
              }
            />
            {isArchiveModalOpen && <ArchiveCardModal color={color} />}
            {isMoveAndUnarchiveModalOpen && <MoveAndUnarchiveTaskModal color={color} />}
          </>
        )}
      </PopperContextConsumer>
    </PopperContextProvider>
  );
};

export default CardDetailsMoreOptions;
