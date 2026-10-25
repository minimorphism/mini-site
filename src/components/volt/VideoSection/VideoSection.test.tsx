// Copyright (c) 2026 minimorphism
// License GPLv3

import { act, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import VideoSection from "./VideoSection";

jest.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}));

jest.mock("./VideoSection.module.scss", () => ({
	section: "section",
	content: "content",
	backgroundBox: "backgroundBox",
	containerTitle: "containerTitle",
	title: "title",
	titleActive: "titleActive",
	videoWrapper: "videoWrapper",
	videoViewport: "videoViewport",
	video: "video",
	videoActive: "videoActive",
	videoOverlay: "videoOverlay",
	slideIndicators: "slideIndicators",
	indicator: "indicator",
	indicatorActive: "indicatorActive",
	indicatorFill: "indicatorFill",
}));

jest.mock("@minimorphism/mds-ui", () => ({
	Box: ({
		children,
		variant,
		className,
	}: {
		children: React.ReactNode;
		variant: string;
		className?: string;
	}) => (
		<div data-variant={variant} className={className}>
			{children}
		</div>
	),
	Typography: ({
		children,
		variant,
		color,
		weight,
		className,
		"aria-hidden": ariaHidden,
	}: {
		children: React.ReactNode;
		variant: string;
		color?: string;
		weight?: string;
		className?: string;
		"aria-hidden"?: boolean;
	}) => (
		<h2
			data-variant={variant}
			data-color={color}
			data-weight={weight}
			className={className}
			aria-hidden={ariaHidden}
		>
			{children}
		</h2>
	),
}));

let intersectionCallback: IntersectionObserverCallback = () => {};
let observerOptions: IntersectionObserverInit | undefined;
let observeMock: jest.Mock;
let disconnectMock: jest.Mock;

let playMock: jest.SpyInstance;
let pauseMock: jest.SpyInstance;

let frameCallbacks: Map<number, FrameRequestCallback>;
let nextFrameId: number;
let requestAnimationFrameMock: jest.Mock;
let cancelAnimationFrameMock: jest.Mock;

const originalIntersectionObserver = Object.getOwnPropertyDescriptor(
	globalThis,
	"IntersectionObserver"
);
const originalRequestAnimationFrame = Object.getOwnPropertyDescriptor(
	globalThis,
	"requestAnimationFrame"
);
const originalCancelAnimationFrame = Object.getOwnPropertyDescriptor(
	globalThis,
	"cancelAnimationFrame"
);

const restoreProperty = (
	property: string,
	descriptor: PropertyDescriptor | undefined
) => {
	if (descriptor) {
		Object.defineProperty(globalThis, property, descriptor);
	} else {
		Reflect.deleteProperty(globalThis, property);
	}
};

const setVisibility = (isIntersecting: boolean) => {
	const section = document.querySelector("section");

	if (!section) {
		throw new Error("Video section was not rendered");
	}

	const rect = section.getBoundingClientRect();

	const entry = {
		target: section,
		isIntersecting,
		intersectionRatio: isIntersecting ? 1 : 0,
		boundingClientRect: rect,
		intersectionRect: rect,
		rootBounds: null,
		time: 0,
	} as IntersectionObserverEntry;

	act(() => {
		intersectionCallback([entry], {} as IntersectionObserver);
	});
};

const runNextAnimationFrame = () => {
	const entry = frameCallbacks.entries().next().value as
		| [number, FrameRequestCallback]
		| undefined;

	if (!entry) {
		throw new Error("No animation frame is pending");
	}

	const [id, callback] = entry;

	frameCallbacks.delete(id);
	callback(16);
};

const getVideos = (container: HTMLElement): HTMLVideoElement[] =>
	Array.from(container.querySelectorAll("video"));

describe("VideoSection", () => {
	beforeEach(() => {
		jest.clearAllMocks();

		intersectionCallback = () => {};
		observerOptions = undefined;

		observeMock = jest.fn();
		disconnectMock = jest.fn();

		class MockIntersectionObserver implements IntersectionObserver {
			readonly root: Element | Document | null = null;
			readonly rootMargin = "0px";
			readonly thresholds: ReadonlyArray<number> = [];

			constructor(
				callback: IntersectionObserverCallback,
				options?: IntersectionObserverInit
			) {
				intersectionCallback = callback;
				observerOptions = options;
			}

			observe(target: Element) {
				observeMock(target);
			}

			unobserve() {}

			disconnect() {
				disconnectMock();
			}

			takeRecords(): IntersectionObserverEntry[] {
				return [];
			}
		}

		Object.defineProperty(globalThis, "IntersectionObserver", {
			configurable: true,
			writable: true,
			value: MockIntersectionObserver,
		});

		frameCallbacks = new Map();
		nextFrameId = 1;

		requestAnimationFrameMock = jest.fn(
			(callback: FrameRequestCallback): number => {
				const id = nextFrameId++;
				frameCallbacks.set(id, callback);
				return id;
			}
		);

		cancelAnimationFrameMock = jest.fn((id: number) => {
			frameCallbacks.delete(id);
		});

		Object.defineProperty(globalThis, "requestAnimationFrame", {
			configurable: true,
			writable: true,
			value: requestAnimationFrameMock,
		});

		Object.defineProperty(globalThis, "cancelAnimationFrame", {
			configurable: true,
			writable: true,
			value: cancelAnimationFrameMock,
		});

		playMock = jest
			.spyOn(HTMLMediaElement.prototype, "play")
			.mockImplementation(() => Promise.resolve());

		pauseMock = jest
			.spyOn(HTMLMediaElement.prototype, "pause")
			.mockImplementation(() => {});
	});

	afterEach(() => {
		jest.restoreAllMocks();

		restoreProperty("IntersectionObserver", originalIntersectionObserver);
		restoreProperty("requestAnimationFrame", originalRequestAnimationFrame);
		restoreProperty("cancelAnimationFrame", originalCancelAnimationFrame);
	});

	it("renders the section and background box", () => {
		const { container } = render(
			<VideoSection onNext={jest.fn()} onPrev={jest.fn()} />
		);

		expect(container.querySelector("section")).toBeInTheDocument();
		expect(container.querySelector(".section")).toBeInTheDocument();

		const box = container.querySelector(".backgroundBox");

		expect(box).toBeInTheDocument();
		expect(box).toHaveAttribute("data-variant", "black");
	});

	it("renders all three videos with the expected sources", () => {
		const { container } = render(
			<VideoSection onNext={jest.fn()} onPrev={jest.fn()} />
		);

		const videos = getVideos(container);

		expect(videos).toHaveLength(3);
		expect(videos[0]).toHaveAttribute("src", "/videos/1.mp4");
		expect(videos[1]).toHaveAttribute("src", "/videos/2.mp4");
		expect(videos[2]).toHaveAttribute("src", "/videos/3.mp4");
	});

	it("renders all videos as muted inline videos", () => {
		const { container } = render(
			<VideoSection onNext={jest.fn()} onPrev={jest.fn()} />
		);

		getVideos(container).forEach((video) => {
			expect(video).toHaveAttribute("playsinline");
			expect(video).toHaveAttribute("preload", "auto");
		});
	});

	it("renders all three translated titles", () => {
		render(<VideoSection onNext={jest.fn()} onPrev={jest.fn()} />);

		expect(screen.getByText("volt.videos.first-text")).toBeInTheDocument();
		expect(screen.getByText("volt.videos.second-text")).toBeInTheDocument();
		expect(screen.getByText("volt.videos.third-text")).toBeInTheDocument();
	});

	it("marks only the first title and video as active initially", () => {
		const { container } = render(
			<VideoSection onNext={jest.fn()} onPrev={jest.fn()} />
		);

		expect(
			screen.getByRole("heading", {
				name: "volt.videos.first-text",
			})
		).toHaveClass("titleActive");

		const videos = getVideos(container);

		expect(videos[0]).toHaveClass("videoActive");
		expect(videos[1]).not.toHaveClass("videoActive");
		expect(videos[2]).not.toHaveClass("videoActive");

		expect(videos[1]).toHaveAttribute("aria-hidden", "true");
		expect(videos[2]).toHaveAttribute("aria-hidden", "true");
	});

	it("creates an intersection observer with the expected threshold", () => {
		const { container } = render(
			<VideoSection onNext={jest.fn()} onPrev={jest.fn()} />
		);

		expect(observerOptions).toEqual({ threshold: 0.35 });
		expect(observeMock).toHaveBeenCalledTimes(1);
		expect(observeMock).toHaveBeenCalledWith(
			container.querySelector("section")
		);
	});

	it("does not play videos before the section becomes visible", () => {
		render(<VideoSection onNext={jest.fn()} onPrev={jest.fn()} />);

		expect(playMock).not.toHaveBeenCalled();
	});

	it("plays the active video when the section becomes visible", () => {
		const { container } = render(
			<VideoSection onNext={jest.fn()} onPrev={jest.fn()} />
		);

		const videos = getVideos(container);

		setVisibility(true);

		expect(playMock).toHaveBeenCalled();
		expect(videos[0].muted).toBe(true);
		expect(videos[0].playsInline).toBe(true);
	});

	it("does not play an inactive video on canplay", () => {
		const { container } = render(
			<VideoSection onNext={jest.fn()} onPrev={jest.fn()} />
		);

		const videos = getVideos(container);

		setVisibility(true);

		const callsBefore = playMock.mock.calls.length;

		fireEvent.canPlay(videos[1]);

		expect(playMock).toHaveBeenCalledTimes(callsBefore);
	});

	it("plays the active video again when it can play", () => {
		const { container } = render(
			<VideoSection onNext={jest.fn()} onPrev={jest.fn()} />
		);

		const videos = getVideos(container);

		setVisibility(true);

		const callsBefore = playMock.mock.calls.length;

		fireEvent.canPlay(videos[0]);

		expect(playMock).toHaveBeenCalledTimes(callsBefore + 1);
	});

	it("switches to the next video when the active video ends", () => {
		const { container } = render(
			<VideoSection onNext={jest.fn()} onPrev={jest.fn()} />
		);

		const videos = getVideos(container);

		setVisibility(true);

		fireEvent.ended(videos[0]);

		expect(
			screen.getByRole("heading", {
				name: "volt.videos.second-text",
			})
		).toHaveClass("titleActive");

		expect(videos[1]).toHaveClass("videoActive");
		expect(videos[0]).not.toHaveClass("videoActive");
	});

	it("wraps to the first video after the third video ends", () => {
		const { container } = render(
			<VideoSection onNext={jest.fn()} onPrev={jest.fn()} />
		);

		const videos = getVideos(container);

		setVisibility(true);

		fireEvent.ended(videos[0]);
		fireEvent.ended(videos[1]);
		fireEvent.ended(videos[2]);

		expect(
			screen.getByRole("heading", {
				name: "volt.videos.first-text",
			})
		).toHaveClass("titleActive");

		expect(videos[0]).toHaveClass("videoActive");
	});

	it("does not advance when an inactive video ends", () => {
		const { container } = render(
			<VideoSection onNext={jest.fn()} onPrev={jest.fn()} />
		);

		const videos = getVideos(container);

		setVisibility(true);

		fireEvent.ended(videos[1]);

		expect(
			screen.getByRole("heading", {
				name: "volt.videos.first-text",
			})
		).toHaveClass("titleActive");

		expect(videos[0]).toHaveClass("videoActive");
	});

	it("pauses videos and cancels animation when the section becomes invisible", () => {
		render(<VideoSection onNext={jest.fn()} onPrev={jest.fn()} />);

		setVisibility(true);

		expect(frameCallbacks.size).toBeGreaterThan(0);

		const pauseCallsBefore = pauseMock.mock.calls.length;

		setVisibility(false);

		expect(pauseMock.mock.calls.length).toBeGreaterThan(pauseCallsBefore);
		expect(cancelAnimationFrameMock).toHaveBeenCalled();
		expect(frameCallbacks.size).toBe(0);
	});

	it("updates the active video's progress indicator", () => {
		const { container } = render(
			<VideoSection onNext={jest.fn()} onPrev={jest.fn()} />
		);

		const videos = getVideos(container);
		const firstVideo = videos[0];

		setVisibility(true);

		Object.defineProperty(firstVideo, "duration", {
			configurable: true,
			value: 10,
		});

		Object.defineProperty(firstVideo, "currentTime", {
			configurable: true,
			writable: true,
			value: 5,
		});

		act(() => {
			runNextAnimationFrame();
		});

		const indicators = container.querySelectorAll(".indicatorFill");

		expect(indicators).toHaveLength(3);
		expect(indicators[0]).toHaveStyle({
			"--progress": "0.5",
		});
		expect(indicators[1]).toHaveStyle({
			"--progress": "0",
		});
		expect(indicators[2]).toHaveStyle({
			"--progress": "0",
		});
	});

	it("clamps the progress indicator to one when current time exceeds duration", () => {
		const { container } = render(
			<VideoSection onNext={jest.fn()} onPrev={jest.fn()} />
		);

		const firstVideo = getVideos(container)[0];

		setVisibility(true);

		Object.defineProperty(firstVideo, "duration", {
			configurable: true,
			value: 10,
		});

		Object.defineProperty(firstVideo, "currentTime", {
			configurable: true,
			writable: true,
			value: 15,
		});

		act(() => {
			runNextAnimationFrame();
		});

		const activeIndicator = container.querySelector(".indicatorFill");

		expect(activeIndicator).toHaveStyle({
			"--progress": "1",
		});
	});

	it("disconnects the intersection observer on unmount", () => {
		const { unmount } = render(
			<VideoSection onNext={jest.fn()} onPrev={jest.fn()} />
		);

		unmount();

		expect(disconnectMock).toHaveBeenCalledTimes(1);
	});

	it("cancels the pending animation frame on unmount", () => {
		const { unmount } = render(
			<VideoSection onNext={jest.fn()} onPrev={jest.fn()} />
		);

		setVisibility(true);

		expect(frameCallbacks.size).toBeGreaterThan(0);

		unmount();

		expect(cancelAnimationFrameMock).toHaveBeenCalled();
		expect(frameCallbacks.size).toBe(0);
	});

	it("does not call navigation callbacks during playback", () => {
		const onNext = jest.fn();
		const onPrev = jest.fn();

		const { container } = render(
			<VideoSection onNext={onNext} onPrev={onPrev} />
		);

		const videos = getVideos(container);

		setVisibility(true);
		fireEvent.ended(videos[0]);

		expect(onNext).not.toHaveBeenCalled();
		expect(onPrev).not.toHaveBeenCalled();
	});
});
