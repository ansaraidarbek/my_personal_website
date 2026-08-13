import { useLayoutEffect, useRef, useState } from 'react';

export interface ElementSize {
	width: number;
	height: number;
}

/** Live width/height of an element, driven by a ResizeObserver. */
export const useElementSize = <T extends HTMLElement>() => {
	const ref = useRef<T>(null);
	const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

	useLayoutEffect(() => {
		const node = ref.current;
		if (node === null) return;
		const measure = () => {
			const rect = node.getBoundingClientRect();
			setSize((prev) =>
				prev.width === rect.width && prev.height === rect.height
					? prev
					: { width: rect.width, height: rect.height },
			);
		};
		// Measure synchronously on mount; the observer only handles later resizes.
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	return { ref, size };
};
