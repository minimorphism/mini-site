// Copyright (c) 2026 minimorphism
// License GPLv3

import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Main from "./Main";

jest.mock("../../components/common/FullPageScroller/FullPageScroller", () => ({
	__esModule: true,
	default: ({
		currentSection,
		onGoToSection,
		sections,
	}: {
		currentSection: number;
		onGoToSection: (index: number) => void;
		sections: ReactNode;
	}) => (
		<div
			data-testid="full-page-scroller"
			data-current-section={currentSection}
		>
			<button type="button" onClick={() => onGoToSection(1)}>
				Go to section one
			</button>

			<div data-testid="scroller-sections">{sections}</div>
		</div>
	),
}));

jest.mock("../../components/main/FirstSection/FirstSection", () => ({
	__esModule: true,
	default: ({
		onNext,
		onVolt,
		onLogoClick,
		onVOLT_Download,
	}: {
		onNext: () => void;
		onVolt: () => void;
		onLogoClick: () => void;
		onVOLT_Download: () => void;
	}) => (
		<section data-testid="first-section">
			<button type="button" onClick={onNext}>
				First Next
			</button>

			<button type="button" onClick={onVolt}>
				First VOLT
			</button>

			<button type="button" onClick={onLogoClick}>
				First Logo
			</button>

			<button type="button" onClick={onVOLT_Download}>
				First Download
			</button>
		</section>
	),
}));

jest.mock("../../components/main/MDSSection/MDSSection", () => ({
	__esModule: true,
	default: ({
		onNext,
		onPrev,
		onMDS,
	}: {
		onNext: () => void;
		onPrev: () => void;
		onMDS: () => void;
	}) => (
		<section data-testid="mds-section">
			<button type="button" onClick={onNext}>
				MDS Next
			</button>

			<button type="button" onClick={onPrev}>
				MDS Previous
			</button>

			<button type="button" onClick={onMDS}>
				Go to MDS
			</button>
		</section>
	),
}));

jest.mock("../../components/main/FRISPSection/FRISPSection", () => ({
	__esModule: true,
	default: ({ onPrev }: { onPrev: () => void }) => (
		<section data-testid="frisp-section">
			<button type="button" onClick={onPrev}>
				FRISP Previous
			</button>
		</section>
	),
}));

const createProps = () => ({
	currentSection: 1,
	onNext: jest.fn(),
	onPrev: jest.fn(),
	onGoToSection: jest.fn(),
	onGoToMDS: jest.fn(),
	onGoToVOLT: jest.fn(),
	onGoToVOLT_Download: jest.fn(),
	onLogoClick: jest.fn(),
});

describe("Main", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders FullPageScroller", () => {
		render(<Main {...createProps()} />);

		expect(screen.getByTestId("full-page-scroller")).toBeInTheDocument();
	});

	it("passes currentSection to FullPageScroller", () => {
		const props = createProps();

		render(<Main {...props} />);

		expect(screen.getByTestId("full-page-scroller")).toHaveAttribute(
			"data-current-section",
			"1"
		);
	});

	it("passes onGoToSection to FullPageScroller", () => {
		const props = createProps();

		render(<Main {...props} />);

		fireEvent.click(
			screen.getByRole("button", {
				name: "Go to section one",
			})
		);

		expect(props.onGoToSection).toHaveBeenCalledTimes(1);
		expect(props.onGoToSection).toHaveBeenCalledWith(1);
	});

	it("renders all sections in the correct order", () => {
		render(<Main {...createProps()} />);

		const sections = screen.getByTestId("scroller-sections");

		const sectionIds = Array.from(sections.children).map((section) =>
			section.getAttribute("data-testid")
		);

		expect(sectionIds).toEqual([
			"first-section",
			"mds-section",
			"frisp-section",
		]);
	});

	it("passes navigation callbacks to FirstSection", () => {
		const props = createProps();

		render(<Main {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "First Next" }));
		expect(props.onNext).toHaveBeenCalledTimes(1);

		fireEvent.click(screen.getByRole("button", { name: "First VOLT" }));
		expect(props.onGoToVOLT).toHaveBeenCalledTimes(1);

		fireEvent.click(screen.getByRole("button", { name: "First Logo" }));
		expect(props.onLogoClick).toHaveBeenCalledTimes(1);

		fireEvent.click(screen.getByRole("button", { name: "First Download" }));
		expect(props.onGoToVOLT_Download).toHaveBeenCalledTimes(1);
	});

	it("passes navigation callbacks to MDSSection", () => {
		const props = createProps();

		render(<Main {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "MDS Next" }));
		expect(props.onNext).toHaveBeenCalledTimes(1);

		fireEvent.click(screen.getByRole("button", { name: "MDS Previous" }));
		expect(props.onPrev).toHaveBeenCalledTimes(1);

		fireEvent.click(screen.getByRole("button", { name: "Go to MDS" }));
		expect(props.onGoToMDS).toHaveBeenCalledTimes(1);
	});

	it("passes onPrev to FRISPSection", () => {
		const props = createProps();

		render(<Main {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "FRISP Previous" }));

		expect(props.onPrev).toHaveBeenCalledTimes(1);
	});

	it("renders each section exactly once", () => {
		render(<Main {...createProps()} />);

		expect(screen.getAllByTestId("first-section")).toHaveLength(1);
		expect(screen.getAllByTestId("mds-section")).toHaveLength(1);
		expect(screen.getAllByTestId("frisp-section")).toHaveLength(1);
	});
});
