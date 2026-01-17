import { ProjectIconTypes } from './BaseProjectIcon';

export const getIconTypeName = (iconType: ProjectIconTypes) => {
  if (iconType === ProjectIconTypes.BullseyeArrow) {
    return `faBullseye`;
  }
  if (iconType === ProjectIconTypes.PaperclipVertical) {
    return `faPaperclip`;
  }
  return `fa${iconType || ProjectIconTypes.Trophy}`;
};
