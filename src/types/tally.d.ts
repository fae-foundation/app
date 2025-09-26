// Tally 类型定义
declare global {
  interface Window {
    Tally: {
      openPopup: (formId: string, options?: TallyPopupOptions) => void;
      closePopup: (formId: string) => void;
    };
  }
}

export interface TallyPopupOptions {
  key?: string;
  layout?: 'default' | 'modal';
  width?: number;
  alignLeft?: boolean;
  hideTitle?: boolean;
  overlay?: boolean;
  emoji?: {
    text: string;
    animation: 'none' | 'wave' | 'tada' | 'heart-beat' | 'spin' | 'flash' | 'bounce' | 'rubber-band' | 'head-shake';
  };
  autoClose?: number;
  showOnce?: boolean;
  doNotShowAfterSubmit?: boolean;
  customFormUrl?: string;
  hiddenFields?: {
    [key: string]: any;
  };
  onOpen?: () => void;
  onClose?: () => void;
  onPageView?: (page: number) => void;
  onSubmit?: (payload: any) => void;
}

export {};
