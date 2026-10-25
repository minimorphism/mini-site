// Copyright (c) 2026 minimorphism
// License GPLv3

import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import MDS_UI from "./MDS_UI";

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

jest.mock("../../components/mds_ui/FirstSection/FirstSection", () => ({
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

jest.mock("../../components/mds_ui/DescSection/DescSection", () => ({
	__esModule: true,
	default: ({
		onNext,
		onBack,
	}: {
		onNext: () => void;
		onBack: () => void;
	}) => (
		<section data-testid="description-section">
			<button type="button" onClick={onNext}>
				Description Next
			</button>

			<button type="button" onClick={onBack}>
				Description Back
			</button>
		</section>
	),
}));

jest.mock("../../components/mds_ui/ObjectsSection/ObjectsSection", () => ({
	__esModule: true,
	default: ({
		onNext,
		onBack,
	}: {
		onNext: () => void;
		onBack: () => void;
	}) => (
		<section data-testid="objects-section">
			<button type="button" onClick={onNext}>
				Objects Next
			</button>

			<button type="button" onClick={onBack}>
				Objects Back
			</button>
		</section>
	),
}));

jest.mock("../../components/mds_ui/MaterialsSection/MaterialsSection", () => ({
	__esModule: true,
	default: ({
		onNext,
		onBack,
	}: {
		onNext: () => void;
		onBack: () => void;
	}) => (
		<section data-testid="materials-section">
			<button type="button" onClick={onNext}>
				Materials Next
			</button>

			<button type="button" onClick={onBack}>
				Materials Back
			</button>
		</section>
	),
}));

jest.mock("../../components/mds_ui/LightSection/LightSection", () => ({
	__esModule: true,
	default: ({
		onNext,
		onBack,
	}: {
		onNext: () => void;
		onBack: () => void;
	}) => (
		<section data-testid="light-section">
			<button type="button" onClick={onNext}>
				Light Next
			</button>

			<button type="button" onClick={onBack}>
				Light Back
			</button>
		</section>
	),
}));

jest.mock("../../components/mds_ui/DownloadSection/DownloadSection", () => ({
	__esModule: true,
	default: ({ onBack }: { onBack: () => void }) => (
		<section data-testid="download-section">
			<button type="button" onClick={onBack}>
				Download Back
			</button>
		</section>
	),
}));

const createProps = () => ({
	currentSection: 3,
	onNext: jest.fn(),
	onPrev: jest.fn(),
	onGoToSection: jest.fn(),
	onLogoClick: jest.fn(),
});

describe("MDS_UI", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders FullPageScroller", () => {
		render(<MDS_UI {...createProps()} />);

		expect(screen.getByTestId("full-page-scroller")).toBeInTheDocument();
	});

	it("passes currentSection to FullPageScroller", () => {
		render(<MDS_UI {...createProps()} />);

		expect(screen.getByTestId("full-page-scroller")).toHaveAttribute(
			"data-current-section",
			"3"
		);
	});

	it("passes onGoToSection to FullPageScroller", () => {
		const props = createProps();

		render(<MDS_UI {...props} />);

		fireEvent.click(
			screen.getByRole("button", {
				name: "Go to section two",
			})
		);

		expect(props.onGoToSection).toHaveBeenCalledTimes(1);
		expect(props.onGoToSection).toHaveBeenCalledWith(2);
	});

	it("renders all six sections in the correct order", () => {
		render(<MDS_UI {...createProps()} />);

		const sections = screen.getByTestId("scroller-sections");

		const sectionIds = Array.from(sections.children).map((section) =>
			section.getAttribute("data-testid")
		);

		expect(sectionIds).toEqual([
			"first-section",
			"description-section",
			"objects-section",
			"materials-section",
			"light-section",
			"download-section",
		]);
	});

	it("passes callbacks to FirstSection", () => {
		const props = createProps();

		render(<MDS_UI {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "First Next" }));

		expect(props.onNext).toHaveBeenCalledTimes(1);

		fireEvent.click(screen.getByRole("button", { name: "First Logo" }));

		expect(props.onLogoClick).toHaveBeenCalledTimes(1);
	});

	it("passes callbacks to DescSection", () => {
		const props = createProps();

		render(<MDS_UI {...props} />);

		fireEvent.click(
			screen.getByRole("button", { name: "Description Next" })
		);

		expect(props.onNext).toHaveBeenCalledTimes(1);

		fireEvent.click(
			screen.getByRole("button", { name: "Description Back" })
		);

		expect(props.onPrev).toHaveBeenCalledTimes(1);
	});

	it("passes callbacks to ObjectsSection", () => {
		const props = createProps();

		render(<MDS_UI {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "Objects Next" }));

		expect(props.onNext).toHaveBeenCalledTimes(1);

		fireEvent.click(screen.getByRole("button", { name: "Objects Back" }));

		expect(props.onPrev).toHaveBeenCalledTimes(1);
	});

	it("passes callbacks to MaterialsSection", () => {
		const props = createProps();

		render(<MDS_UI {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "Materials Next" }));

		expect(props.onNext).toHaveBeenCalledTimes(1);

		fireEvent.click(screen.getByRole("button", { name: "Materials Back" }));

		expect(props.onPrev).toHaveBeenCalledTimes(1);
	});

	it("passes callbacks to LightSection", () => {
		const props = createProps();

		render(<MDS_UI {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "Light Next" }));

		expect(props.onNext).toHaveBeenCalledTimes(1);

		fireEvent.click(screen.getByRole("button", { name: "Light Back" }));

		expect(props.onPrev).toHaveBeenCalledTimes(1);
	});

	it("passes onPrev to DownloadSection", () => {
		const props = createProps();

		render(<MDS_UI {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "Download Back" }));

		expect(props.onPrev).toHaveBeenCalledTimes(1);
	});

	it("renders each section exactly once", () => {
		render(<MDS_UI {...createProps()} />);

		expect(screen.getAllByTestId("first-section")).toHaveLength(1);
		expect(screen.getAllByTestId("description-section")).toHaveLength(1);
		expect(screen.getAllByTestId("objects-section")).toHaveLength(1);
		expect(screen.getAllByTestId("materials-section")).toHaveLength(1);
		expect(screen.getAllByTestId("light-section")).toHaveLength(1);
		expect(screen.getAllByTestId("download-section")).toHaveLength(1);
	});
});
