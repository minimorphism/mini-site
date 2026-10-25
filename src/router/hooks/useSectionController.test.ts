// Copyright (c) 2026 minimorphism
// License GPLv3

import { act, renderHook } from "@testing-library/react";
import "@testing-library/jest-dom";

import useSectionController from "./useSectionController";
import useSectionInput from "./useSectionInput";

jest.mock("./useSectionInput", () => ({
	__esModule: true,
	default: jest.fn(),
}));

describe("useSectionController", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("initialization", () => {
		it("initializes the current section to zero", () => {
			const { result } = renderHook(() => useSectionController(5));

			expect(result.current.currentSection).toBe(0);
		});

		it("returns all controller callbacks", () => {
			const { result } = renderHook(() => useSectionController(5));

			expect(result.current.onNext).toEqual(expect.any(Function));
			expect(result.current.onPrev).toEqual(expect.any(Function));
			expect(result.current.onGoToSection).toEqual(expect.any(Function));
		});

		it("initializes useSectionInput with the controller callbacks", () => {
			const { result } = renderHook(() => useSectionController(4));

			expect(useSectionInput).toHaveBeenCalledWith({
				sectionCount: 4,
				onNext: result.current.onNext,
				onPrev: result.current.onPrev,
				onGoToSection: result.current.onGoToSection,
			});
		});

		it("accepts a section count of one", () => {
			const { result } = renderHook(() => useSectionController(1));

			expect(result.current.currentSection).toBe(0);

			act(() => {
				result.current.onNext();
			});

			expect(result.current.currentSection).toBe(0);
		});
	});

	describe("section count validation", () => {
		it.each([0, -1, -10, 1.5, NaN, Infinity, -Infinity])(
			"throws an error for invalid section count %s",
			(sectionCount) => {
				expect(() =>
					renderHook(() => useSectionController(sectionCount))
				).toThrow("sectionCount must be positive.");
			}
		);
	});

	describe("onNext", () => {
		it("increments the current section", () => {
			const { result } = renderHook(() => useSectionController(5));

			act(() => {
				result.current.onNext();
			});

			expect(result.current.currentSection).toBe(1);
		});

		it("increments the current section multiple times", () => {
			const { result } = renderHook(() => useSectionController(5));

			act(() => {
				result.current.onNext();
				result.current.onNext();
				result.current.onNext();
			});

			expect(result.current.currentSection).toBe(3);
		});

		it("does not exceed the last section", () => {
			const { result } = renderHook(() => useSectionController(3));

			act(() => {
				result.current.onNext();
				result.current.onNext();
				result.current.onNext();
				result.current.onNext();
			});

			expect(result.current.currentSection).toBe(2);
		});
	});

	describe("onPrev", () => {
		it("decrements the current section", () => {
			const { result } = renderHook(() => useSectionController(5));

			act(() => {
				result.current.onNext();
				result.current.onNext();
			});

			act(() => {
				result.current.onPrev();
			});

			expect(result.current.currentSection).toBe(1);
		});

		it("does not go below the first section", () => {
			const { result } = renderHook(() => useSectionController(5));

			act(() => {
				result.current.onPrev();
			});

			expect(result.current.currentSection).toBe(0);
		});

		it("stops at zero after multiple previous actions", () => {
			const { result } = renderHook(() => useSectionController(5));

			act(() => {
				result.current.onPrev();
				result.current.onPrev();
				result.current.onPrev();
			});

			expect(result.current.currentSection).toBe(0);
		});
	});

	describe("onGoToSection", () => {
		it("navigates to the requested section", () => {
			const { result } = renderHook(() => useSectionController(5));

			act(() => {
				result.current.onGoToSection(3);
			});

			expect(result.current.currentSection).toBe(3);
		});

		it("navigates to the first section", () => {
			const { result } = renderHook(() => useSectionController(5));

			act(() => {
				result.current.onGoToSection(0);
			});

			expect(result.current.currentSection).toBe(0);
		});

		it("navigates to the last section", () => {
			const { result } = renderHook(() => useSectionController(5));

			act(() => {
				result.current.onGoToSection(4);
			});

			expect(result.current.currentSection).toBe(4);
		});

		it("clamps negative indexes to zero", () => {
			const { result } = renderHook(() => useSectionController(5));

			act(() => {
				result.current.onGoToSection(-3);
			});

			expect(result.current.currentSection).toBe(0);
		});

		it("clamps indexes above the last section", () => {
			const { result } = renderHook(() => useSectionController(5));

			act(() => {
				result.current.onGoToSection(10);
			});

			expect(result.current.currentSection).toBe(4);
		});
	});

	describe("state transitions", () => {
		it("supports sequential navigation between sections", () => {
			const { result } = renderHook(() => useSectionController(4));

			act(() => {
				result.current.onNext();
				result.current.onNext();
			});

			expect(result.current.currentSection).toBe(2);

			act(() => {
				result.current.onPrev();
			});

			expect(result.current.currentSection).toBe(1);

			act(() => {
				result.current.onGoToSection(3);
			});

			expect(result.current.currentSection).toBe(3);
		});

		it("preserves the current section when callbacks are not invoked", () => {
			const { result, rerender } = renderHook(() =>
				useSectionController(5)
			);

			act(() => {
				result.current.onGoToSection(2);
			});

			rerender();

			expect(result.current.currentSection).toBe(2);
		});
	});

	describe("callback references", () => {
		it("preserves callback references when section count is unchanged", () => {
			const { result, rerender } = renderHook(() =>
				useSectionController(5)
			);

			const initialOnNext = result.current.onNext;
			const initialOnPrev = result.current.onPrev;
			const initialOnGoToSection = result.current.onGoToSection;

			rerender();

			expect(result.current.onNext).toBe(initialOnNext);
			expect(result.current.onPrev).toBe(initialOnPrev);
			expect(result.current.onGoToSection).toBe(initialOnGoToSection);
		});
	});
});
