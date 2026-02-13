import { useState, useEffect, useCallback } from 'react';

const TYPING_SPEED = 80;
const DELETING_SPEED = 50;
const PAUSE_AFTER_TYPING = 2500;
const PAUSE_AFTER_DELETING = 400;

export function useTypewriter(words: string[]): { displayText: string; isDeleting: boolean } {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const currentWord = words[wordIndex];

  const tick = useCallback(() => {
    if (!isDeleting) {
      if (displayText.length < currentWord.length) {
        return {
          delay: TYPING_SPEED,
          action: () => setDisplayText(currentWord.slice(0, displayText.length + 1)),
        };
      }
      return {
        delay: PAUSE_AFTER_TYPING,
        action: () => setIsDeleting(true),
      };
    }

    if (displayText.length > 0) {
      return {
        delay: DELETING_SPEED,
        action: () => setDisplayText(currentWord.slice(0, displayText.length - 1)),
      };
    }

    return {
      delay: PAUSE_AFTER_DELETING,
      action: () => {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      },
    };
  }, [displayText, isDeleting, currentWord, words.length]);

  useEffect(() => {
    const { delay, action } = tick();
    const timeout = setTimeout(action, delay);
    return () => clearTimeout(timeout);
  }, [tick]);

  return { displayText, isDeleting };
}
