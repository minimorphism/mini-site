// Copyright (c) 2026 minimorphism
// License GPLv3

import type { ReactNode } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import MDSSection from "./MDSSection";

jest.mock("./MDSSection.module.scss", () => ({
	section: "section",
	backgroundBox: "backgroundBox",
	contentBox: "contentBox",
	imageBox: "imageBox",
	linkBtn: "linkBtn",
}));

jest.mock("@minimorphism/mds-ui", () => ({
	Box: ({
		children,
		variant,
		className,
	}: {
		children: ReactNode;
		variant: string;
		className?: string;
	}) => (
		<div data-testid="mds-box" data-variant={variant} className={className}>
			{children}
		</div>
	),
	Button: ({
		children,
		variant,
		onClick,
		className,
	}: {
		children: ReactNode;
		variant: string;
		onClick?: () => void;
		className?: string;
	}) => (
		<button
			type="button"
			data-variant={variant}
			className={className}
			onClick={onClick}
		>
			{children}
		</button>
	),
}));

const createProps = () => ({
	onNext: jest.fn(),
	onPrev: jest.fn(),
	onMDS: jest.fn(),
});

describe("MDSSection", () => {
	it("renders the section container", () => {
		const { container } = render(<MDSSection {...createProps()} />);

		expect(container.querySelector("section")).toBeInTheDocument();
		expect(container.querySelector(".section")).toBeInTheDocument();
	});

	it("renders three nested Box components", () => {
		render(<MDSSection {...createProps()} />);

		expect(screen.getAllByTestId("mds-box")).toHaveLength(3);
	});

	it("renders the boxes with the expected variants", () => {
		render(<MDSSection {...createProps()} />);

		const boxes = screen.getAllByTestId("mds-box");

		expect(boxes[0]).toHaveAttribute("data-variant", "black");
		expect(boxes[1]).toHaveAttribute("data-variant", "anodized");
		expect(boxes[2]).toHaveAttribute("data-variant", "black");
	});

	it("applies the expected CSS classes to the boxes", () => {
		render(<MDSSection {...createProps()} />);

		const boxes = screen.getAllByTestId("mds-box");

		expect(boxes[0]).toHaveClass("backgroundBox");
		expect(boxes[1]).toHaveClass("contentBox");
		expect(boxes[2]).toHaveClass("imageBox");
	});

	it("renders all three screen images", () => {
		render(<MDSSection {...createProps()} />);

		expect(
			screen.getByRole("img", { name: "Screen1" })
		).toBeInTheDocument();
		expect(
			screen.getByRole("img", { name: "Screen2" })
		).toBeInTheDocument();
		expect(
			screen.getByRole("img", { name: "Screen3" })
		).toBeInTheDocument();
	});

	it("renders the images with the expected source paths", () => {
		render(<MDSSection {...createProps()} />);

		expect(screen.getByRole("img", { name: "Screen1" })).toHaveAttribute(
			"src",
			"/images/mds_ui_screen1.png"
		);

		expect(screen.getByRole("img", { name: "Screen2" })).toHaveAttribute(
			"src",
			"/images/mds_ui_screen2.png"
		);

		expect(screen.getByRole("img", { name: "Screen3" })).toHaveAttribute(
			"src",
			"/images/mds_ui_screen3.png"
		);
	});

	it("makes all screen images non-draggable", () => {
		render(<MDSSection {...createProps()} />);

		expect(screen.getByRole("img", { name: "Screen1" })).toHaveAttribute(
			"draggable",
			"false"
		);

		expect(screen.getByRole("img", { name: "Screen2" })).toHaveAttribute(
			"draggable",
			"false"
		);

		expect(screen.getByRole("img", { name: "Screen3" })).toHaveAttribute(
			"draggable",
			"false"
		);
	});

	it("places the screen images inside the image box", () => {
		render(<MDSSection {...createProps()} />);

		const boxes = screen.getAllByTestId("mds-box");
		const imageBox = boxes[2];

		expect(within(imageBox).getAllByRole("img")).toHaveLength(3);
	});

	it("renders the design system button", () => {
		render(<MDSSection {...createProps()} />);

		expect(
			screen.getByRole("button", {
				name: "minimorphism design system",
			})
		).toBeInTheDocument();
	});

	it("renders the button with the black variant", () => {
		render(<MDSSection {...createProps()} />);

		expect(
			screen.getByRole("button", {
				name: "minimorphism design system",
			})
		).toHaveAttribute("data-variant", "black");
	});

	it("applies the expected CSS class to the button", () => {
		render(<MDSSection {...createProps()} />);

		expect(
			screen.getByRole("button", {
				name: "minimorphism design system",
			})
		).toHaveClass("linkBtn");
	});

	it("underlines the button label", () => {
		render(<MDSSection {...createProps()} />);

		const button = screen.getByRole("button", {
			name: "minimorphism design system",
		});

		expect(
			within(button).getByText("minimorphism design system").tagName
		).toBe("U");
	});

	it("calls onMDS when the design system button is clicked", () => {
		const props = createProps();

		render(<MDSSection {...props} />);

		fireEvent.click(
			screen.getByRole("button", {
				name: "minimorphism design system",
			})
		);

		expect(props.onMDS).toHaveBeenCalledTimes(1);
	});

	it("does not call navigation callbacks during initial render", () => {
		const props = createProps();

		render(<MDSSection {...props} />);

		expect(props.onNext).not.toHaveBeenCalled();
		expect(props.onPrev).not.toHaveBeenCalled();
		expect(props.onMDS).not.toHaveBeenCalled();
	});

	it("does not call onNext or onPrev when the design system button is clicked", () => {
		const props = createProps();

		render(<MDSSection {...props} />);

		fireEvent.click(
			screen.getByRole("button", {
				name: "minimorphism design system",
			})
		);

		expect(props.onNext).not.toHaveBeenCalled();
		expect(props.onPrev).not.toHaveBeenCalled();
		expect(props.onMDS).toHaveBeenCalledTimes(1);
	});
});
