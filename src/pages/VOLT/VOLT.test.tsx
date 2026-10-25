// Copyright (c) 2026 minimorphism
// License GPLv3

import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import VOLT from "./VOLT";

jest.mock("../../components/common/FullPageScroller/FullPageScroller", () => ({
	__esModule: true,
	default: ({
		currentSection,
		onGoToSection,
		sections,
	}: {
		currentSection: number;
		onGoToSection: (index: number) => void;
		sections: ReactNode[];
	}) => (
		<div
			data-testid="full-page-scroller"
			data-current-section={currentSection}
		>
			<button type="button" onClick={() => onGoToSection(2)}>
				Go to section two
			</button>

			<div data-testid="scroller-sections">{sections}</div>
		</div>
	),
}));

jest.mock("../../components/volt/FirstSection/FirstSection", () => ({
	__esModule: true,
	default: ({
		onNext,
		onLogoClick,
	}: {
		onNext: () => void;
		onLogoClick: () => void;
	}) => (
		<section data-testid="first-section">
			<button type="button" onClick={onNext}>
				First Next
			</button>

			<button type="button" onClick={onLogoClick}>
				First Logo
			</button>
		</section>
	),
}));

jest.mock("../../components/volt/DescSection/DescSection", () => ({
	__esModule: true,
	default: ({
		onNext,
		onPrev,
		onVOLT_Download,
	}: {
		onNext: () => void;
		onPrev: () => void;
		onVOLT_Download: () => void;
	}) => (
		<section data-testid="description-section">
			<button type="button" onClick={onNext}>
				Description Next
			</button>

			<button type="button" onClick={onPrev}>
				Description Previous
			</button>

			<button type="button" onClick={onVOLT_Download}>
				Description Download
			</button>
		</section>
	),
}));

jest.mock("../../components/volt/VideoSection/VideoSection", () => ({
	__esModule: true,
	default: ({
		onNext,
		onPrev,
	}: {
		onNext: () => void;
		onPrev: () => void;
	}) => (
		<section data-testid="video-section">
			<button type="button" onClick={onNext}>
				Video Next
			</button>

			<button type="button" onClick={onPrev}>
				Video Previous
			</button>
		</section>
	),
}));

jest.mock("../../components/volt/VOLT_IDSection/VOLT_IDSection", () => ({
	__esModule: true,
	default: ({
		onPrev,
		onVOLT_Download,
	}: {
		onPrev: () => void;
		onVOLT_Download: () => void;
	}) => (
		<section data-testid="volt-id-section">
			<button type="button" onClick={onPrev}>
				VOLT ID Previous
			</button>

			<button type="button" onClick={onVOLT_Download}>
				VOLT ID Download
			</button>
		</section>
	),
}));

const createProps = () => ({
	currentSection: 2,
	onNext: jest.fn(),
	onPrev: jest.fn(),
	onGoToSection: jest.fn(),
	onGoToVOLT_Download: jest.fn(),
	onLogoClick: jest.fn(),
});

describe("VOLT", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders FullPageScroller", () => {
		render(<VOLT {...createProps()} />);

		expect(screen.getByTestId("full-page-scroller")).toBeInTheDocument();
	});

	it("passes currentSection to FullPageScroller", () => {
		render(<VOLT {...createProps()} />);

		expect(screen.getByTestId("full-page-scroller")).toHaveAttribute(
			"data-current-section",
			"2"
		);
	});

	it("passes onGoToSection to FullPageScroller", () => {
		const props = createProps();

		render(<VOLT {...props} />);

		fireEvent.click(
			screen.getByRole("button", { name: "Go to section two" })
		);

		expect(props.onGoToSection).toHaveBeenCalledTimes(1);
		expect(props.onGoToSection).toHaveBeenCalledWith(2);
	});

	it("renders all four sections in the correct order", () => {
		render(<VOLT {...createProps()} />);

		const sections = screen.getByTestId("scroller-sections");

		const sectionIds = Array.from(sections.children).map((section) =>
			section.getAttribute("data-testid")
		);

		expect(sectionIds).toEqual([
			"first-section",
			"description-section",
			"video-section",
			"volt-id-section",
		]);
	});

	it("passes callbacks to FirstSection", () => {
		const props = createProps();

		render(<VOLT {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "First Next" }));

		expect(props.onNext).toHaveBeenCalledTimes(1);

		fireEvent.click(screen.getByRole("button", { name: "First Logo" }));

		expect(props.onLogoClick).toHaveBeenCalledTimes(1);
	});

	it("passes callbacks to DescSection", () => {
		const props = createProps();

		render(<VOLT {...props} />);

		fireEvent.click(
			screen.getByRole("button", { name: "Description Next" })
		);

		expect(props.onNext).toHaveBeenCalledTimes(1);

		fireEvent.click(
			screen.getByRole("button", { name: "Description Previous" })
		);

		expect(props.onPrev).toHaveBeenCalledTimes(1);

		fireEvent.click(
			screen.getByRole("button", { name: "Description Download" })
		);

		expect(props.onGoToVOLT_Download).toHaveBeenCalledTimes(1);
	});

	it("passes callbacks to VideoSection", () => {
		const props = createProps();

		render(<VOLT {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "Video Next" }));

		expect(props.onNext).toHaveBeenCalledTimes(1);

		fireEvent.click(screen.getByRole("button", { name: "Video Previous" }));

		expect(props.onPrev).toHaveBeenCalledTimes(1);
	});

	it("passes callbacks to VOLT_IDSection", () => {
		const props = createProps();

		render(<VOLT {...props} />);

		fireEvent.click(
			screen.getByRole("button", { name: "VOLT ID Previous" })
		);

		expect(props.onPrev).toHaveBeenCalledTimes(1);

		fireEvent.click(
			screen.getByRole("button", { name: "VOLT ID Download" })
		);

		expect(props.onGoToVOLT_Download).toHaveBeenCalledTimes(1);
	});

	it("renders each section exactly once", () => {
		render(<VOLT {...createProps()} />);

		expect(screen.getAllByTestId("first-section")).toHaveLength(1);
		expect(screen.getAllByTestId("description-section")).toHaveLength(1);
		expect(screen.getAllByTestId("video-section")).toHaveLength(1);
		expect(screen.getAllByTestId("volt-id-section")).toHaveLength(1);
	});
});
