import { MouseEventHandler, useCallback } from 'react';

const url = 'https://calendly.com/timecamp-chris?hide_gdpr_banner=1';
type DemoButtonHookInterface = {
  onClick: MouseEventHandler<HTMLElement>;
};

export default function useComponent(): DemoButtonHookInterface {
  const onClick = useCallback(() => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url });
    }
  }, []);

  return {
    onClick,
  };
}
