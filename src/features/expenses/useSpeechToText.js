import { useCallback, useEffect, useRef, useState } from 'react';

function getSpeechRecognitionCtor() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function useSpeechToText({ lang = 'es-CO', onResult, onFinalResult } = {}) {
  const RecognitionCtor = getSpeechRecognitionCtor();
  const isSupported = Boolean(RecognitionCtor);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');
  const onResultRef = useRef(onResult);
  const onFinalResultRef = useRef(onFinalResult);
  onResultRef.current = onResult;
  onFinalResultRef.current = onFinalResult;

  useEffect(() => {
    if (!isSupported) return undefined;

    const recognition = new RecognitionCtor();
    recognition.lang = lang;
    // Modo continuo: no corta al primer silencio, así se permite dictar frases largas.
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let combined = '';
      for (let i = 0; i < event.results.length; i += 1) {
        combined += event.results[i][0]?.transcript ?? '';
      }
      transcriptRef.current = combined.trim();
      onResultRef.current?.(transcriptRef.current);
    };
    recognition.onend = () => {
      setIsListening(false);
      const finalTranscript = transcriptRef.current;
      transcriptRef.current = '';
      if (finalTranscript) onFinalResultRef.current?.(finalTranscript);
    };
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, [isSupported, lang, RecognitionCtor]);

  const start = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    transcriptRef.current = '';
    setIsListening(true);
    recognitionRef.current.start();
  }, [isListening]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return { isSupported, isListening, start, stop };
}
