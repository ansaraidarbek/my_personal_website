import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
	typeof window !== 'undefined' &&
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type Phase = 'type' | 'hold' | 'delete';

/**
 * Typewriter that cycles a list of words: types a word, holds, deletes, moves
 * on. Returns the current text and a blinking caret flag. Mirrors the design's
 * runTyping state machine.
 */
export const useTypedText = (words: readonly string[]) => {
	const [text, setText] = useState('');
	const [caretOn, setCaretOn] = useState(true);
	const timer = useRef<ReturnType<typeof setTimeout>>();

	useEffect(() => {
		if (!words.length) return;

		if (prefersReducedMotion()) {
			setText(words[words.length - 1]);
			setCaretOn(false);
			return;
		}

		const caret = setInterval(() => setCaretOn((on) => !on), 500);

		const run = (wordIdx: number, charIdx: number, phase: Phase) => {
			const word = words[wordIdx];
			setText(word.slice(0, charIdx));

			let delay = 65;
			let nextIdx = charIdx;
			let nextPhase: Phase = phase;
			let nextWord = wordIdx;

			if (phase === 'type') {
				if (charIdx < word.length) nextIdx = charIdx + 1;
				else {
					nextPhase = 'hold';
					delay = 1400;
				}
			} else if (phase === 'hold') {
				nextPhase = 'delete';
				delay = 40;
			} else {
				if (charIdx > 0) {
					nextIdx = charIdx - 1;
					delay = 40;
				} else {
					nextWord = (wordIdx + 1) % words.length;
					nextPhase = 'type';
					nextIdx = 0;
					delay = 260;
				}
			}
			timer.current = setTimeout(() => run(nextWord, nextIdx, nextPhase), delay);
		};

		run(0, 0, 'type');

		return () => {
			clearInterval(caret);
			if (timer.current) clearTimeout(timer.current);
		};
	}, [words]);

	return { text, caretOn };
};
