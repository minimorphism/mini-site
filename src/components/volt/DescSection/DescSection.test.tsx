// Copyright (c) 2026 minimorphism
// License GPLv3

import type { ReactNode } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
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
	title: "title",
	card: "card",
	partDesc: "partDesc",
	description: "description",
	downloadBtn: "downloadBtn",
	imageBox: "imageBox",
	image: "image",
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
		size,
		onClick,
		className,
	}: {
		children: ReactNode;
		variant: string;
		size?: string;
		onClick?: () => void;
		className?: string;
	}) => (
		<button
			type="button"
			data-variant={variant}
			data-size={size}
			className={className}
			onClick={onClick}
		>
			{children}
		</button>
	),
	Typography: ({
		children,
		variant,
		color,
		align,
		weight,
		className,
	}: {
		children: ReactNode;
		variant: string;
		color?: string;
		align?: string;
		weight?: string;
		className?: string;
	}) => {
		const Tag = variant === "h6" ? "h6" : "p";

		return (
			<Tag
				data-testid="typography"
				data-variant={variant}
				data-color={color}
				data-align={align}
				data-weight={weight}
				className={className}
			>
				{children}
			</Tag>
		);
	},
}));

const createProps = () => ({
	onNext: jest.fn(),
	onPrev: jest.fn(),
	onVOLT_Download: jest.fn(),
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

		expect(
			screen.getByRole("heading", { name: "volt.desc.title" })
		).toBeInTheDocument();
	});

	it("passes the expected props to the title", () => {
		render(<DescSection {...createProps()} />);

		const title = screen.getByRole("heading", {
			name: "volt.desc.title",
		});

		expect(title).toHaveAttribute("data-variant", "h6");
		expect(title).toHaveAttribute("data-color", "black");
		expect(title).toHaveAttribute("data-align", "center");
		expect(title).toHaveAttribute("data-weight", "light");
		expect(title).toHaveClass("title");
	});

	it("renders the translated description", () => {
		render(<DescSection {...createProps()} />);

		expect(screen.getByText("volt.desc.body")).toBeInTheDocument();
	});

	it("passes the expected props to the description", () => {
		render(<DescSection {...createProps()} />);

		const description = screen.getByText("volt.desc.body");

		expect(description.tagName).toBe("P");
		expect(description).toHaveAttribute("data-variant", "body1");
		expect(description).toHaveAttribute("data-color", "black");
		expect(description).toHaveClass("description");
	});

	it("renders the card and image boxes with the expected variants", () => {
		render(<DescSection {...createProps()} />);

		const boxes = screen.getAllByTestId("mds-box");

		expect(boxes).toHaveLength(2);
		expect(boxes[0]).toHaveAttribute("data-variant", "white");
		expect(boxes[1]).toHaveAttribute("data-variant", "black");

		expect(boxes[0]).toHaveClass("card");
		expect(boxes[1]).toHaveClass("imageBox");
	});

	it("renders the download button with the translated label", () => {
		render(<DescSection {...createProps()} />);

		expect(
			screen.getByRole("button", { name: "volt.desc.btn" })
		).toBeInTheDocument();
	});

	it("renders the download button with the expected props", () => {
		render(<DescSection {...createProps()} />);

		const button = screen.getByRole("button", {
			name: "volt.desc.btn",
		});

		expect(button).toHaveAttribute("data-variant", "black");
		expect(button).toHaveAttribute("data-size", "md");
		expect(button).toHaveClass("downloadBtn");
	});

	it("calls onVOLT_Download when the download button is clicked", () => {
		const props = createProps();

		render(<DescSection {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "volt.desc.btn" }));

		expect(props.onVOLT_Download).toHaveBeenCalledTimes(1);
	});

	it("renders the VOLT description image", () => {
		render(<DescSection {...createProps()} />);

		const image = screen.getByRole("img", {
			name: "Description VOLT",
		});

		expect(image).toBeInTheDocument();
		expect(image).toHaveAttribute("src", "/images/desc_volt.png");
		expect(image).toHaveClass("image");
	});

	it("places the image inside the black image box", () => {
		render(<DescSection {...createProps()} />);

		const boxes = screen.getAllByTestId("mds-box");
		const imageBox = boxes[1];

		expect(
			within(imageBox).getByRole("img", {
				name: "Description VOLT",
			})
		).toBeInTheDocument();
	});

	it("does not call callbacks during initial render", () => {
		const props = createProps();

		render(<DescSection {...props} />);

		expect(props.onNext).not.toHaveBeenCalled();
		expect(props.onPrev).not.toHaveBeenCalled();
		expect(props.onVOLT_Download).not.toHaveBeenCalled();
	});

	it("does not call navigation callbacks when the download button is clicked", () => {
		const props = createProps();

		render(<DescSection {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "volt.desc.btn" }));

		expect(props.onNext).not.toHaveBeenCalled();
		expect(props.onPrev).not.toHaveBeenCalled();
		expect(props.onVOLT_Download).toHaveBeenCalledTimes(1);
	});
});
