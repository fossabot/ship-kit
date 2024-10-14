"use client";

import { debounce } from 'lodash-es';
import { useCallback, useEffect, useRef, useState } from 'react';

const AIEditor = () => {
  const [inputText, setInputText] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchSuggestion = useCallback(
    debounce(async (text: string) => {
      if (text.trim() === '') {
        setSuggestion('');
        return;
      }

      try {
        const response = await fetch('/type-ahead/api/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setSuggestion(data.suggestion);
      } catch (error) {
        console.error('Error fetching suggestion:', error);
        // Optionally, handle error state here
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchSuggestion(inputText);
  }, [inputText, fetchSuggestion]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      setInputText(inputText + suggestion);
      setSuggestion('');
    }
  };

  return (
    <div className="relative w-full max-w-2xl">
      <textarea
        ref={textareaRef}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full h-64 p-4 text-base box-border relative bg-transparent text-black resize-none z-10"
        style={{ caretColor: 'black' }}
      />
      <div
        className="pointer-events-none absolute top-4 left-4 right-4 bottom-4 p-4 text-base whitespace-pre-wrap break-words text-gray-400 opacity-60 z-0"
      >
        {inputText}
        <span>{suggestion}</span>
      </div>
    </div>
  );
};

export default AIEditor;