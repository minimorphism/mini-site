// Copyright (c) 2026 minimorphism
// License GPLv3

import type { ReactNode } from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import MaterialsSection from "./MaterialsSection";

jest.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}));

jest.mock("./MaterialsSection.module.scss", () => ({
	section: "section",
	backgroundBox: "backgroundBox",
	title: "title",
	grid: "grid",
	description: "description",
	exampleBox: "exampleBox",
	childExampleBox: "childExampleBox",
}));

jest.mock("@minimorphism/mds-ui", () => ({
	Box: ({
		children,
		variant,
		className,
	}: {
		children?: ReactNode;
		variant: string;
		className?: string;
	}) => (
		<div data-testid="mds-box" data-variant={variant} className={className}>
			{children}
		</div>
	),
	Typography: ({
		children,
		align,
		color,
		weight,
		className,
	}: {
		children: ReactNode;
		align?: string;
		color?: string;
		weight?: string;
		className?: string;
	}) => (
		<p
			data-align={align}
			data-color={color}
			data-weight={weight}
			className={className}
		>
			{children}
		</p>
	),
}));

const createProps = () => ({
	onNext: jest.fn(),
	onBack: jest.fn(),
});

describe("MaterialsSection", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders the section container", () => {
		const { container } = render(<MaterialsSection {...createProps()} />);

		expect(container.querySelector("section")).toBeInTheDocument();
		expect(container.querySelector(".section")).toBeInTheDocument();
	});

	it("renders the translated title", () => {
		render(<MaterialsSection {...createProps()} />);

		const title = screen.getByText("mds-ui.materials.title");

		expect(title).toBeInTheDocument();
		expect(title).toHaveClass("title");
		expect(title).toHaveAttribute("data-align", "center");
		expect(title).toHaveAttribute("data-color", "white");
		expect(title).toHaveAttribute("data-weight", "light");
	});

	it("renders all three translated descriptions", () => {
		render(<MaterialsSection {...createProps()} />);

		expect(
			screen.getByText("mds-ui.materials.first-desc")
		).toBeInTheDocument();

		expect(
			screen.getByText("mds-ui.materials.second-desc")
		).toBeInTheDocument();

		expect(
			screen.getByText("mds-ui.materials.third-desc")
		).toBeInTheDocument();
	});

	it("applies the expected properties to each description", () => {
		render(<MaterialsSection {...createProps()} />);

		const descriptions = [
			screen.getByText("mds-ui.materials.first-desc"),
			screen.getByText("mds-ui.materials.second-desc"),
			screen.getByText("mds-ui.materials.third-desc"),
		];

		descriptions.forEach((description) => {
			expect(description).toHaveClass("description");
			expect(description).toHaveAttribute("data-color", "white");
			expect(description).toHaveAttribute("data-weight", "light");
		});
	});

	it("renders the grid container", () => {
		const { container } = render(<MaterialsSection {...createProps()} />);

		expect(container.querySelector(".grid")).toBeInTheDocument();
	});

	it("renders five Box components", () => {
		render(<MaterialsSection {...createProps()} />);

		expect(screen.getAllByTestId("mds-box")).toHaveLength(5);
	});

	it("renders the boxes with the expected variants", () => {
		render(<MaterialsSection {...createProps()} />);

		const boxes = screen.getAllByTestId("mds-box");

		expect(boxes[0]).toHaveAttribute("data-variant", "black");
		expect(boxes[1]).toHaveAttribute("data-variant", "white");
		expect(boxes[2]).toHaveAttribute("data-variant", "black");
		expect(boxes[3]).toHaveAttribute("data-variant", "white");
		expect(boxes[4]).toHaveAttribute("data-variant", "anodized");
	});

	it("applies the expected CSS classes to the example boxes", () => {
		render(<MaterialsSection {...createProps()} />);

		const boxes = screen.getAllByTestId("mds-box");

		expect(boxes[1]).toHaveClass("exampleBox");
		expect(boxes[2]).toHaveClass("childExampleBox");
		expect(boxes[3]).toHaveClass("exampleBox");
		expect(boxes[4]).toHaveClass("exampleBox");
	});

	it("places all descriptions and example boxes inside the grid", () => {
		const { container } = render(<MaterialsSection {...createProps()} />);

		const grid = container.querySelector(".grid");

		expect(grid).toBeInTheDocument();

		const gridContent = within(grid as HTMLElement);

		expect(
			gridContent.getByText("mds-ui.materials.first-desc")
		).toBeInTheDocument();

		expect(
			gridContent.getByText("mds-ui.materials.second-desc")
		).toBeInTheDocument();

		expect(
			gridContent.getByText("mds-ui.materials.third-desc")
		).toBeInTheDocument();

		expect(gridContent.getAllByTestId("mds-box")).toHaveLength(4);
	});

	it("does not call navigation callbacks during initial render", () => {
		const props = createProps();

		render(<MaterialsSection {...props} />);

		expect(props.onNext).not.toHaveBeenCalled();
		expect(props.onBack).not.toHaveBeenCalled();
	});
});
