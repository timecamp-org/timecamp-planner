import { FC, MutableRefObject, ReactElement, useEffect } from 'react';

import { useIMask } from 'react-imask';

import { getDurationHumanText, parseMinutesToDuration } from 'common/utils/duration';
import { DurationInterface } from 'models/domain/TaskTimeEstimateModel/types';

import { parseTimeStringToMinutes } from './helpers';

interface DurationMaskInterface {
  initialValue?: number;
  onChange?: (durationMinutes: number) => void;
  inputRenderer: (props: { ref: MutableRefObject<unknown>; value: string }) => ReactElement;
}

export const DurationMask: ReactFCWithChildren<DurationMaskInterface> = ({ initialValue, inputRenderer, onChange }) => {
  const { ref, value, setValue } = useIMask(
    {
      mask: [
        { mask: '000h' },
        { mask: '0m' },
        { mask: '00m' },
        { mask: '000m' },
        { mask: '0:00' },
        { mask: '0:0' },
        { mask: '00:0' },
        { mask: '00:00' },
        { mask: '00h00m' },
        { mask: '000h00m' },
        { mask: '00h' },
        { mask: '0.0' },
        { mask: '0.00' },
        { mask: '00.00' },
        { mask: '00m' },
        { mask: '00-0' },
        { mask: '0-0' },
        { mask: '00-00' },
        { mask: '0-00' },
        {
          mask: /^(?:[0-9]{1,3}h[0-5]?[0-9]m?)?$|^(?:[0-5]?[0-9]m?)?$|^(?:[0-9]{1,2}h)$/,
        },

        { mask: Number },
      ],
    },
    {
      // eslint-disable-next-line no-shadow
      onAccept: (value) => {
        onChange?.(parseTimeStringToMinutes(value));
      },
    },
  );

  useEffect(() => {
    const duration: DurationInterface = parseMinutesToDuration(initialValue) ?? { hours: 0, minutes: 0 };

    setValue(getDurationHumanText(duration));
  }, []);

  return inputRenderer({ value, ref });
};
