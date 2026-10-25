// Copyright (c) 2026 minimorphism
// License GPLv3

import type { ReactNode } from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import DescSection from "./DescSection";

jest.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}));

jest.mock("./DescSection.module.scss", () => ({
	section: "section",
	content: "content",
	backgroundBox: "backgroundBox",
	title: "title",
	description: "description",
	exampleBox: "exampleBox",
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
		color,
		className,
	}: {
		children: ReactNode;
		color?: string;
		className?: string;
	}) => (
		<p data-color={color} className={className}>
			{children}
		</p>
	),
}));

const createProps = () => ({
	onNext: jest.fn(),
	onBack: jest.fn(),
});

describe("DescSection", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders the section container", () => {
		const { container } = render(<DescSection {...createProps()} />);

		expect(container.querySelector("section")).toBeInTheDocument();
		expect(container.querySelector(".section")).toBeInTheDocument();
	});

	it("renders the translated title", () => {
		render(<DescSection {...createProps()} />);

		const title = screen.getByText("mds-ui.desc.title");

		expect(title).toBeInTheDocument();
		expect(title).toHaveClass("title");
		expect(title).toHaveAttribute("data-color", "white");
	});

	it("renders the translated description", () => {
		render(<DescSection {...createProps()} />);

		const description = screen.getByText("mds-ui.desc.desc");

		expect(description).toBeInTheDocument();
		expect(description).toHaveClass("description");
		expect(description).toHaveAttribute("data-color", "white");
	});

	it("renders the example box with the anodized variant", () => {
		render(<DescSection {...createProps()} />);

		const boxes = screen.getAllByTestId("mds-box");
		const exampleBox = boxes[1];

		expect(exampleBox).toHaveAttribute("data-variant", "anodized");
		expect(exampleBox).toHaveClass("exampleBox");
	});

	it("renders exactly two Box components", () => {
		render(<DescSection {...createProps()} />);

		expect(screen.getAllByTestId("mds-box")).toHaveLength(2);
	});

	it("renders the expected content containers", () => {
		const { container } = render(<DescSection {...createProps()} />);

		expect(container.querySelectorAll(".content")).toHaveLength(2);
	});

	it("does not call navigation callbacks during initial render", () => {
		const props = createProps();

		render(<DescSection {...props} />);

		expect(props.onNext).not.toHaveBeenCalled();
		expect(props.onBack).not.toHaveBeenCalled();
	});
});
