// Copyright (c) 2026 minimorphism
// License GPLv3

import { act, cleanup, renderHook } from "@testing-library/react";
import "@testing-library/jest-dom";

import useSectionInput from "./useSectionInput";

const WHEEL_LOCK_DURATION = 1350;
const WHEEL_DELTA_THRESHOLD = 6;
const SWIPE_THRESHOLD = 5;

const createCallbacks = () => ({
	onNext: jest.fn(),
	onPrev: jest.fn(),
	onGoToSection: jest.fn(),
});

const setupHook = (callbacks = createCallbacks(), sectionCount = 5) => {
	const result = renderHook(() =>
		useSectionInput({
			sectionCount,
			...callbacks,
		})
	);

	return {
		...result,
		...callbacks,
	};
};

const dispatchWheel = (deltaY: number) => {
	const event = new WheelEvent("wheel", {
		deltaY,
		bubbles: true,
		cancelable: true,
	});

	act(() => {
		document.dispatchEvent(event);
	});

	return event;
};

const dispatchKey = (key: string, repeat = false) => {
	const event = new KeyboardEvent("keydown", {
		key,
		repeat,
		bubbles: true,
		cancelable: true,
	});

	act(() => {
		document.dispatchEvent(event);
	});

	return event;
};

const dispatchTouchStart = (clientY?: number) => {
	const event = new Event("touchstart", {
		bubbles: true,
		cancelable: true,
	});

	Object.defineProperty(event, "touches", {
		value: clientY === undefined ? [] : [{ clientY }],
	});

	act(() => {
		document.dispatchEvent(event);
	});

	return event;
};

const dispatchTouchEnd = (clientY?: number) => {
	const event = new Event("touchend", {
		bubbles: true,
		cancelable: true,
	});

	Object.defineProperty(event, "changedTouches", {
		value: clientY === undefined ? [] : [{ clientY }],
	});

	act(() => {
		document.dispatchEvent(event);
	});

	return event;
};

describe("useSectionInput", () => {
	beforeEach(() => {
		jest.useRealTimers();
		jest.clearAllMocks();
	});

	afterEach(() => {
		cleanup();
		jest.useRealTimers();
	});

	describe("wheel input", () => {
		it("calls onNext when scrolling down", () => {
			const { onNext, onPrev } = setupHook();

			dispatchWheel(10);

			expect(onNext).toHaveBeenCalledTimes(1);
			expect(onPrev).not.toHaveBeenCalled();
		});

		it("calls onPrev when scrolling up", () => {
			const { onNext, onPrev } = setupHook();

			dispatchWheel(-10);

			expect(onPrev).toHaveBeenCalledTimes(1);
			expect(onNext).not.toHaveBeenCalled();
		});

		it("prevents the default wheel behavior", () => {
			setupHook();

			const event = dispatchWheel(10);

			expect(event.defaultPrevented).toBe(true);
		});

		it("ignores wheel deltas below the threshold", () => {
			const { onNext, onPrev } = setupHook();

			dispatchWheel(WHEEL_DELTA_THRESHOLD - 1);

			expect(onNext).not.toHaveBeenCalled();
			expect(onPrev).not.toHaveBeenCalled();
		});

		it("accepts wheel deltas equal to the threshold", () => {
			const { onNext } = setupHook();

			dispatchWheel(WHEEL_DELTA_THRESHOLD);

			expect(onNext).toHaveBeenCalledTimes(1);
		});

		it("ignores additional wheel events while locked", () => {
			jest.useFakeTimers();

			const { onNext } = setupHook();

			dispatchWheel(10);
			dispatchWheel(10);
			dispatchWheel(10);

			expect(onNext).toHaveBeenCalledTimes(1);
		});

		it("unlocks wheel input after the lock duration", () => {
			jest.useFakeTimers();

			const { onNext } = setupHook();

			dispatchWheel(10);

			act(() => {
				jest.advanceTimersByTime(WHEEL_LOCK_DURATION);
			});

			dispatchWheel(10);

			expect(onNext).toHaveBeenCalledTimes(2);
		});

		it("clears the wheel lock timer on unmount", () => {
			jest.useFakeTimers();

			const { unmount } = setupHook();

			dispatchWheel(10);

			expect(jest.getTimerCount()).toBe(1);

			unmount();

			expect(jest.getTimerCount()).toBe(0);
		});
	});

	describe("keyboard input", () => {
		it.each(["ArrowDown", "s", "S"])(
			"calls onNext when pressing %s",
			(key) => {
				const { onNext, onPrev } = setupHook();

				const event = dispatchKey(key);

				expect(onNext).toHaveBeenCalledTimes(1);
				expect(onPrev).not.toHaveBeenCalled();
				expect(event.defaultPrevented).toBe(true);
			}
		);

		it.each(["ArrowUp", "w", "W"])(
			"calls onPrev when pressing %s",
			(key) => {
				const { onNext, onPrev } = setupHook();

				const event = dispatchKey(key);

				expect(onPrev).toHaveBeenCalledTimes(1);
				expect(onNext).not.toHaveBeenCalled();
				expect(event.defaultPrevented).toBe(true);
			}
		);

		it("navigates to the first section when pressing Home", () => {
			const { onGoToSection } = setupHook();

			const event = dispatchKey("Home");

			expect(onGoToSection).toHaveBeenCalledWith(0);
			expect(event.defaultPrevented).toBe(true);
		});

		it("navigates to the last section when pressing End", () => {
			const { onGoToSection } = setupHook(undefined, 5);

			const event = dispatchKey("End");

			expect(onGoToSection).toHaveBeenCalledWith(4);
			expect(event.defaultPrevented).toBe(true);
		});

		it("uses the current section count when navigating to the last section", () => {
			const { onGoToSection } = setupHook(undefined, 8);

			dispatchKey("End");

			expect(onGoToSection).toHaveBeenCalledWith(7);
		});

		it("ignores repeated keydown events", () => {
			const { onNext, onPrev, onGoToSection } = setupHook();

			const event = dispatchKey("ArrowDown", true);

			expect(onNext).not.toHaveBeenCalled();
			expect(onPrev).not.toHaveBeenCalled();
			expect(onGoToSection).not.toHaveBeenCalled();
			expect(event.defaultPrevented).toBe(false);
		});

		it("does not prevent default behavior for unsupported keys", () => {
			setupHook();

			const event = dispatchKey("Enter");

			expect(event.defaultPrevented).toBe(false);
		});
	});

	describe("touch input", () => {
		it("calls onNext when swiping up", () => {
			const { onNext, onPrev } = setupHook();

			dispatchTouchStart(100);
			dispatchTouchEnd(90);

			expect(onNext).toHaveBeenCalledTimes(1);
			expect(onPrev).not.toHaveBeenCalled();
		});

		it("calls onPrev when swiping down", () => {
			const { onNext, onPrev } = setupHook();

			dispatchTouchStart(100);
			dispatchTouchEnd(110);

			expect(onPrev).toHaveBeenCalledTimes(1);
			expect(onNext).not.toHaveBeenCalled();
		});

		it("ignores swipes below the threshold", () => {
			const { onNext, onPrev } = setupHook();

			dispatchTouchStart(100);
			dispatchTouchEnd(100 - (SWIPE_THRESHOLD - 1));

			expect(onNext).not.toHaveBeenCalled();
			expect(onPrev).not.toHaveBeenCalled();
		});

		it("accepts swipes equal to the threshold", () => {
			const { onNext } = setupHook();

			dispatchTouchStart(100);
			dispatchTouchEnd(100 - SWIPE_THRESHOLD);

			expect(onNext).toHaveBeenCalledTimes(1);
		});

		it("ignores touchend when touchstart was not received", () => {
			const { onNext, onPrev } = setupHook();

			dispatchTouchEnd(50);

			expect(onNext).not.toHaveBeenCalled();
			expect(onPrev).not.toHaveBeenCalled();
		});

		it("ignores touchend when touchstart has no touch points", () => {
			const { onNext, onPrev } = setupHook();

			dispatchTouchStart();
			dispatchTouchEnd(50);

			expect(onNext).not.toHaveBeenCalled();
			expect(onPrev).not.toHaveBeenCalled();
		});

		it("resets the touch start position after touchend", () => {
			const { onNext, onPrev } = setupHook();

			dispatchTouchStart(100);
			dispatchTouchEnd(90);
			dispatchTouchEnd(80);

			expect(onNext).toHaveBeenCalledTimes(1);
			expect(onPrev).not.toHaveBeenCalled();
		});
	});

	describe("event listener cleanup", () => {
		it("removes event listeners after unmount", () => {
			const { unmount, onNext, onPrev, onGoToSection } = setupHook();

			unmount();

			dispatchWheel(10);
			dispatchKey("ArrowDown");
			dispatchTouchStart(100);
			dispatchTouchEnd(90);

			expect(onNext).not.toHaveBeenCalled();
			expect(onPrev).not.toHaveBeenCalled();
			expect(onGoToSection).not.toHaveBeenCalled();
		});
	});

	describe("effect dependencies", () => {
		it("uses updated callbacks after rerender", () => {
			const initialCallbacks = createCallbacks();
			const updatedCallbacks = createCallbacks();

			const { rerender } = renderHook((props) => useSectionInput(props), {
				initialProps: {
					sectionCount: 5,
					...initialCallbacks,
				},
			});

			rerender({
				sectionCount: 5,
				...updatedCallbacks,
			});

			dispatchKey("ArrowDown");

			expect(initialCallbacks.onNext).not.toHaveBeenCalled();
			expect(updatedCallbacks.onNext).toHaveBeenCalledTimes(1);
		});
	});
});
