import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface QuoteFormContextType {
  open: boolean;
  openForm: () => void;
  closeForm: () => void;
}

const QuoteFormContext = createContext<QuoteFormContextType>({
  open: false,
  openForm: () => {},
  closeForm: () => {},
});

export function QuoteFormProvider(props: { children: ReactNode }) {
  const { children } = props;
  const [open, setOpen] = useState(false);
  const openForm = useCallback(() => setOpen(true), []);
  const closeForm = useCallback(() => setOpen(false), []);

  return (
    <QuoteFormContext.Provider value={{ open, openForm, closeForm }}>
      {children}
    </QuoteFormContext.Provider>
  );
}

export function useQuoteForm() {
  return useContext(QuoteFormContext);
}
