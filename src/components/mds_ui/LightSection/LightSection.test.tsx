// Copyright (c) 2026 minimorphism
// License GPLv3

import type { ReactNode } from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import LightSection from "./LightSection";

jest.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}));

jest.mock("./LightSection.module.scss", () => ({
	section: "section",
	title: "title",
	description: "description",
	row: "row",
	blackBox: "blackBox",
	anodizedBox: "anodizedBox",
	childBox: "childBox",
	whiteBox: "whiteBox",
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
		<div
			data-testid="mds-box"
			data-variant={variant}
			className={className}
		>
			{children}
		</div>
	),
	Typography: ({
		children,
		weight,
		align,
		className,
	}: {
		children: ReactNode;
		weight?: string;
		align?: string;
		className?: string;
	}) => (
		<p
			data-weight={weight}
			data-align={align}
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

describe("LightSection", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders the section container", () => {
		const { container } = render(
			<LightSection {...createProps()} />,
		);

		expect(container.querySelector("section")).toBeInTheDocument();
		expect(container.querySelector(".section")).toBeInTheDocument();
	});

	it("renders the translated title", () => {
		render(<LightSection {...createProps()} />);

		const title = screen.getByText("mds-ui.light.title");

		expect(title).toBeInTheDocument();
		expect(title).toHaveClass("title");
		expect(title).toHaveAttribute("data-weight", "light");
		expect(title).toHaveAttribute("data-align", "center");
	});

	it("renders the translated description", () => {
		render(<LightSection {...createProps()} />);

		const description = screen.getByText("mds-ui.light.desc");

		expect(description).toBeInTheDocument();
		expect(description).toHaveClass("description");
		expect(description).toHaveAttribute("data-weight", "light");
		expect(description).toHaveAttribute("data-align", "center");
	});

	it("renders the row container", () => {
		const { container } = render(
			<LightSection {...createProps()} />,
		);

		expect(container.querySelector(".row")).toBeInTheDocument();
	});

	it("renders four Box components", () => {
		render(<LightSection {...createProps()} />);

		expect(screen.getAllByTestId("mds-box")).toHaveLength(4);
	});

	it("renders the Box components with the expected variants", () => {
		render(<LightSection {...createProps()} />);

		const boxes = screen.getAllByTestId("mds-box");

		expect(boxes[0]).toHaveAttribute("data-variant", "black");
		expect(boxes[1]).toHaveAttribute("data-variant", "black");
		expect(boxes[2]).toHaveAttribute("data-variant", "anodized");
		expect(boxes[3]).toHaveAttribute("data-variant", "white");
	});

	it("applies the expected CSS classes to the Box components", () => {
		render(<LightSection {...createProps()} />);

		const boxes = screen.getAllByTestId("mds-box");

		expect(boxes[0]).toHaveClass("blackBox");
		expect(boxes[1]).toHaveClass("anodizedBox");
		expect(boxes[2]).toHaveClass("childBox");
		expect(boxes[3]).toHaveClass("whiteBox");
	});

	it("nests the anodized child box inside the anodized container", () => {
		render(<LightSection {...createProps()} />);

		const boxes = screen.getAllByTestId("mds-box");
		const anodizedBox = boxes[1];

		expect(anodizedBox).toContainElement(boxes[2]);
		expect(boxes[2]).toHaveAttribute("data-variant", "anodized");
		expect(boxes[2]).toHaveClass("childBox");
	});

	it("places all three primary boxes inside the row", () => {
		const { container } = render(
			<LightSection {...createProps()} />,
		);

		const row = container.querySelector(".row");

		expect(row).toBeInTheDocument();

		const boxes = within(row as HTMLElement).getAllByTestId("mds-box");

		expect(boxes).toHaveLength(4);
		expect(boxes[0]).toHaveClass("blackBox");
		expect(boxes[1]).toHaveClass("anodizedBox");
		expect(boxes[2]).toHaveClass("childBox");
		expect(boxes[3]).toHaveClass("whiteBox");
	});

	it("does not call navigation callbacks during initial render", () => {
		const props = createProps();

		render(<LightSection {...props} />);

		expect(props.onNext).not.toHaveBeenCalled();
		expect(props.onBack).not.toHaveBeenCalled();
	});
});
