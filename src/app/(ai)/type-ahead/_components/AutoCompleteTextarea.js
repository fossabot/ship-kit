import { debounce } from 'lodash'; // Install lodash if you haven't already
import React, { useEffect, useRef, useState } from 'react';

function AutoCompleteTextarea() {
  const [inputText, setInputText] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    const fetchSuggestion = debounce(async () => {
      if (inputText.trim() === '') {
        setSuggestion('');
        return;
      }

      try {
        const response = await fetch('http://localhost:4000/api/autocomplete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputText }),
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
    }, 500);

    fetchSuggestion();

    return () => {
      fetchSuggestion.cancel();
    };
  }, [inputText]);

  const handleKeyDown = (e) => {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      setInputText(inputText + suggestion);
      setSuggestion('');
    }
  };

  return (
    <div style={{ position: 'relative', width: '500px' }}>
      <textarea
        ref={textareaRef}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          width: '100%',
          height: '200px',
          padding: '10px',
          fontSize: '16px',
          boxSizing: 'border-box',
          position: 'relative',
          background: 'transparent',
          color: 'black',
          resize: 'none',
          zIndex: 1,
        }}
      />
      <div
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          bottom: '10px',
          padding: '10px',
          fontSize: '16px',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          color: 'gray',
          opacity: 0.6,
          zIndex: 0,
        }}
      >
        {inputText}
        <span>{suggestion}</span>
      </div>
    </div>
  );
}

export default AutoCompleteTextarea;