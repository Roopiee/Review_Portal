'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: any) => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

interface Options {
  // Called every time the recognised text changes (interim + final).
  onTranscript: (full: string) => void;
  lang?: string;
}

interface ReturnShape {
  isSupported: boolean;
  isRecording: boolean;
  errorMessage: string | null;
  start: (initialBaseText: string) => void;
  stop: () => void;
}

/**
 * Continuous, interim-results speech-to-text wrapped as a React hook.
 * Mirrors the behaviour in pulse-immersive.html (L1361-1431).
 */
export function useSpeechRecognition({ onTranscript, lang = 'en-US' }: Options): ReturnShape {
  const [isSupported, setIsSupported] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const baseTextRef = useRef('');
  const finalAccumRef = useRef('');
  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const Ctor: SpeechRecognitionConstructor | undefined =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Ctor) return;

    setIsSupported(true);
    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalAccumRef.current += t;
        else interim += t;
      }
      const sep = baseTextRef.current && (finalAccumRef.current || interim) ? ' ' : '';
      const next = (baseTextRef.current + sep + finalAccumRef.current + interim)
        .replace(/\s+/g, ' ')
        .trim();
      onTranscriptRef.current(next);
    };

    recognition.onend = () => {
      finalAccumRef.current = '';
      setIsRecording(false);
    };

    recognition.onerror = (e: any) => {
      setIsRecording(false);
      if (e?.error === 'not-allowed' || e?.error === 'service-not-allowed') {
        setErrorMessage('Mic blocked — allow microphone access in your browser to dictate.');
      }
    };

    recognitionRef.current = recognition;
    return () => {
      try {
        recognition.stop();
      } catch {
        /* recognition was never started */
      }
      recognitionRef.current = null;
    };
  }, [lang]);

  const start = useCallback((initialBaseText: string) => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    baseTextRef.current = initialBaseText.trim();
    finalAccumRef.current = '';
    setErrorMessage(null);
    try {
      recognition.start();
      setIsRecording(true);
    } catch {
      // start() can throw if called too quickly after stop — ignore.
    }
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return { isSupported, isRecording, errorMessage, start, stop };
}
