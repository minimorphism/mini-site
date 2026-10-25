// Copyright (c) 2026 minimorphism
// License GPLv3

import { useEffect } from "react";

interface UseSectionInputOptions {
	sectionCount: number;
	onNext: () => void;
	onPrev: () => void;
	onGoToSection: (index: number) => void;
}

const WHEEL_LOCK_DURATION = 1350;
const WHEEL_DELTA_THRESHOLD = 6;
const SWIPE_THRESHOLD = 5;

const useSectionInput = ({
	sectionCount,
	onNext,
	onPrev,
	onGoToSection,
}: UseSectionInputOptions) => {
	useEffect(() => {
		let wheelLocked = false;
		let wheelLockTimer: number | null = null;
		let touchStartY: number | null = null;

		const handleWheel = (event: WheelEvent) => {
			event.preventDefault();

			if (wheelLocked) {
				return;
			}

			if (Math.abs(event.deltaY) < WHEEL_DELTA_THRESHOLD) {
				return;
			}

			wheelLocked = true;

			if (event.deltaY > 0) {
				onNext();
			} else {
				onPrev();
			}

			if (wheelLockTimer !== null) {
				window.clearTimeout(wheelLockTimer);
			}

			wheelLockTimer = window.setTimeout(() => {
				wheelLocked = false;
				wheelLockTimer = null;
			}, WHEEL_LOCK_DURATION);
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.repeat) {
				return;
			}

			switch (event.key) {
				case "ArrowDown":
				case "s":
				case "S":
					event.preventDefault();
					onNext();
					break;

				case "ArrowUp":
				case "w":
				case "W":
					event.preventDefault();
					onPrev();
					break;

				case "Home":
					event.preventDefault();
					onGoToSection(0);
					break;

				case "End":
					event.preventDefault();
					onGoToSection(sectionCount - 1);
					break;

				default:
					break;
			}
		};

		const handleTouchStart = (event: TouchEvent) => {
			touchStartY = event.touches[0]?.clientY ?? null;
		};

		const handleTouchEnd = (event: TouchEvent) => {
			if (touchStartY === null) {
				return;
			}

			const endY = event.changedTouches[0]?.clientY ?? touchStartY;
			const delta = touchStartY - endY;

			touchStartY = null;

			if (Math.abs(delta) < SWIPE_THRESHOLD) {
				return;
			}

			if (delta > 0) {
				onNext();
			} else {
				onPrev();
			}
		};

		document.addEventListener("wheel", handleWheel, {
			passive: false,
			capture: true,
		});
		document.addEventListener("keydown", handleKeyDown, true);
		document.addEventListener("touchstart", handleTouchStart, {
			passive: true,
		});
		document.addEventListener("touchend", handleTouchEnd, {
			passive: true,
		});

		return () => {
			document.removeEventListener("wheel", handleWheel, true);
			document.removeEventListener("keydown", handleKeyDown, true);
			document.removeEventListener("touchstart", handleTouchStart);
			document.removeEventListener("touchend", handleTouchEnd);

			if (wheelLockTimer !== null) {
				window.clearTimeout(wheelLockTimer);
			}
		};
	}, [sectionCount, onNext, onPrev, onGoToSection]);
};

export default useSectionInput;
