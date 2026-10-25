// Copyright (c) 2026 minimorphism 
// License GPLv3

import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import VOLT_Download from "./VOLT_Download";

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
			<button type="button" onClick={() => onGoToSection(3)}>
				Go to section
			</button>

			{sections.map((section, index) => (
				<div data-testid={`section-${index}`} key={index}>
					{section}
				</div>
			))}
		</div>
	),
}));

jest.mock("../../components/volt_download/FirstSection/FirstSection", () => ({
	__esModule: true,
	default: ({
		onNext,
		onLogoClick,
	}: {
		onNext: () => void;
		onLogoClick: () => void;
	}) => (
		<section data-testid="first-section">
			<span>FirstSection</span>
			<button type="button" onClick={onNext}>
				First next
			</button>
			<button type="button" onClick={onLogoClick}>
				First logo
			</button>
		</section>
	),
}));

jest.mock(
	"../../components/volt_download/FrontendSection/FrontendSection",
	() => ({
		__esModule: true,
		default: ({
			onNext,
			onPrev,
		}: {
			onNext: () => void;
			onPrev: () => void;
		}) => (
			<section data-testid="frontend-section">
				<span>FrontendSection</span>
				<button type="button" onClick={onNext}>
					Frontend next
				</button>
				<button type="button" onClick={onPrev}>
					Frontend prev
				</button>
			</section>
		),
	})
);

jest.mock("../../components/volt_download/SystemSection/SystemSection", () => ({
	__esModule: true,
	default: ({
		onNext,
		onPrev,
	}: {
		onNext: () => void;
		onPrev: () => void;
	}) => (
		<section data-testid="system-section">
			<span>SystemSection</span>
			<button type="button" onClick={onNext}>
				System next
			</button>
			<button type="button" onClick={onPrev}>
				System prev
			</button>
		</section>
	),
}));

jest.mock("../../components/volt_download/CoreSection/CoreSection", () => ({
	__esModule: true,
	default: ({ onPrev }: { onPrev: () => void }) => (
		<section data-testid="core-section">
			<span>CoreSection</span>
			<button type="button" onClick={onPrev}>
				Core prev
			</button>
		</section>
	),
}));

const createProps = () => ({
	currentSection: 2,
	onNext: jest.fn(),
	onPrev: jest.fn(),
	onGoToSection: jest.fn(),
	onLogoClick: jest.fn(),
});

describe("VOLT_Download", () => {
	it("renders the FullPageScroller component", () => {
		render(<VOLT_Download {...createProps()} />);

		expect(screen.getByTestId("full-page-scroller")).toBeInTheDocument();
	});

	it("passes currentSection to FullPageScroller", () => {
		const props = createProps();

		render(<VOLT_Download {...props} />);

		expect(screen.getByTestId("full-page-scroller")).toHaveAttribute(
			"data-current-section",
			"2"
		);
	});

	it("passes onGoToSection to FullPageScroller", () => {
		const props = createProps();

		render(<VOLT_Download {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "Go to section" }));

		expect(props.onGoToSection).toHaveBeenCalledTimes(1);
		expect(props.onGoToSection).toHaveBeenCalledWith(3);
	});

	it("renders all sections in the correct order", () => {
		render(<VOLT_Download {...createProps()} />);

		const sections = screen.getAllByTestId(/^section-\d+$/);

		expect(sections).toHaveLength(4);
		expect(sections[0]).toHaveTextContent("FirstSection");
		expect(sections[1]).toHaveTextContent("FrontendSection");
		expect(sections[2]).toHaveTextContent("SystemSection");
		expect(sections[3]).toHaveTextContent("CoreSection");
	});

	it("renders every section exactly once", () => {
		render(<VOLT_Download {...createProps()} />);

		expect(screen.getAllByTestId("first-section")).toHaveLength(1);
		expect(screen.getAllByTestId("frontend-section")).toHaveLength(1);
		expect(screen.getAllByTestId("system-section")).toHaveLength(1);
		expect(screen.getAllByTestId("core-section")).toHaveLength(1);
	});

	it("passes onNext to the sections that support forward navigation", () => {
		const props = createProps();

		render(<VOLT_Download {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "First next" }));
		fireEvent.click(screen.getByRole("button", { name: "Frontend next" }));
		fireEvent.click(screen.getByRole("button", { name: "System next" }));

		expect(props.onNext).toHaveBeenCalledTimes(3);
	});

	it("passes onPrev to the sections that support backward navigation", () => {
		const props = createProps();

		render(<VOLT_Download {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "Frontend prev" }));
		fireEvent.click(screen.getByRole("button", { name: "System prev" }));
		fireEvent.click(screen.getByRole("button", { name: "Core prev" }));

		expect(props.onPrev).toHaveBeenCalledTimes(3);
	});

	it("passes onLogoClick to FirstSection", () => {
		const props = createProps();

		render(<VOLT_Download {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "First logo" }));

		expect(props.onLogoClick).toHaveBeenCalledTimes(1);
	});
});
