// Copyright (c) 2026 minimorphism
// License GPLv3

import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FirstSection from "./FirstSection";

jest.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}));

jest.mock("./FirstSection.module.scss", () => ({
	section: "section",
	content: "content",
	title: "title",
	actions: "actions",
	primaryButton: "primaryButton",
	secondaryButton: "secondaryButton",
	image: "image",
}));

jest.mock("../../common/Header/Header", () => ({
	__esModule: true,
	default: ({
		variant,
		onLogoClick,
	}: {
		variant: string;
		onLogoClick?: () => void;
	}) => (
		<header data-testid="header" data-variant={variant}>
			<button type="button" onClick={onLogoClick}>
				Header logo
			</button>
		</header>
	),
}));

jest.mock("../../common/MoveImage/MoveImage", () => ({
	__esModule: true,
	default: ({ image, className }: { image: string; className?: string }) => (
		<div
			data-testid="move-image"
			data-image={image}
			data-class-name={className}
		/>
	),
}));

jest.mock("@minimorphism/mds-ui", () => ({
	Button: ({
		children,
		variant,
		type,
		className,
		onClick,
	}: {
		children: ReactNode;
		variant: string;
		type: "button";
		className?: string;
		onClick: () => void;
	}) => (
		<button
			type={type}
			data-variant={variant}
			className={className}
			onClick={onClick}
		>
			{children}
		</button>
	),
	Typography: ({
		children,
		variant,
		weight,
		align,
		className,
	}: {
		children: ReactNode;
		variant: string;
		weight: string;
		align: string;
		className?: string;
	}) => (
		<h1
			data-variant={variant}
			data-weight={weight}
			data-align={align}
			className={className}
		>
			{children}
		</h1>
	),
}));

const createProps = () => ({
	onNext: jest.fn(),
	onVolt: jest.fn(),
	onVOLT_Download: jest.fn(),
	onLogoClick: jest.fn(),
});

describe("FirstSection", () => {
	it("renders the main section", () => {
		const { container } = render(<FirstSection {...createProps()} />);

		expect(container.querySelector(".section")).toBeInTheDocument();
	});

	it("renders the VOLT heading", () => {
		render(<FirstSection {...createProps()} />);

		expect(
			screen.getByRole("heading", { name: "VOLT" })
		).toBeInTheDocument();
	});

	it("passes the expected props to the heading", () => {
		render(<FirstSection {...createProps()} />);

		const heading = screen.getByRole("heading", { name: "VOLT" });

		expect(heading).toHaveAttribute("data-variant", "h1");
		expect(heading).toHaveAttribute("data-weight", "light");
		expect(heading).toHaveAttribute("data-align", "center");
		expect(heading).toHaveClass("title");
	});

	it("renders the header with the black variant", () => {
		render(<FirstSection {...createProps()} />);

		expect(screen.getByTestId("header")).toHaveAttribute(
			"data-variant",
			"black"
		);
	});

	it("passes onLogoClick to the header", () => {
		const props = createProps();

		render(<FirstSection {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "Header logo" }));

		expect(props.onLogoClick).toHaveBeenCalledTimes(1);
	});

	it("renders both action buttons with translated labels", () => {
		render(<FirstSection {...createProps()} />);

		expect(
			screen.getByRole("button", { name: "main.first.first-btn" })
		).toBeInTheDocument();

		expect(
			screen.getByRole("button", { name: "main.first.second-btn" })
		).toBeInTheDocument();
	});

	it("renders both action buttons with the black variant", () => {
		render(<FirstSection {...createProps()} />);

		expect(
			screen.getByRole("button", { name: "main.first.first-btn" })
		).toHaveAttribute("data-variant", "black");

		expect(
			screen.getByRole("button", { name: "main.first.second-btn" })
		).toHaveAttribute("data-variant", "black");
	});

	it("renders both action buttons with button type", () => {
		render(<FirstSection {...createProps()} />);

		expect(
			screen.getByRole("button", { name: "main.first.first-btn" })
		).toHaveAttribute("type", "button");

		expect(
			screen.getByRole("button", { name: "main.first.second-btn" })
		).toHaveAttribute("type", "button");
	});

	it("calls onVolt when the first action button is clicked", () => {
		const props = createProps();

		render(<FirstSection {...props} />);

		fireEvent.click(
			screen.getByRole("button", { name: "main.first.first-btn" })
		);

		expect(props.onVolt).toHaveBeenCalledTimes(1);
		expect(props.onNext).not.toHaveBeenCalled();
	});

	it("calls onVOLT_Download when the second action button is clicked", () => {
		const props = createProps();

		render(<FirstSection {...props} />);

		fireEvent.click(
			screen.getByRole("button", { name: "main.first.second-btn" })
		);

		expect(props.onVOLT_Download).toHaveBeenCalledTimes(1);
		expect(props.onVolt).not.toHaveBeenCalled();
	});

	it("renders the phone image component with the expected props", () => {
		render(<FirstSection {...createProps()} />);

		const moveImage = screen.getByTestId("move-image");

		expect(moveImage).toHaveAttribute("data-image", "/images/phone.png");
		expect(moveImage).toHaveAttribute("data-class-name", "image");
	});

	it("does not call navigation callbacks during initial render", () => {
		const props = createProps();

		render(<FirstSection {...props} />);

		expect(props.onNext).not.toHaveBeenCalled();
		expect(props.onVolt).not.toHaveBeenCalled();
		expect(props.onVOLT_Download).not.toHaveBeenCalled();
		expect(props.onLogoClick).not.toHaveBeenCalled();
	});

	it("renders without an optional logo callback", () => {
		const props = createProps();

		render(
			<FirstSection
				onNext={props.onNext}
				onVolt={props.onVolt}
				onVOLT_Download={props.onVOLT_Download}
			/>
		);

		expect(screen.getByTestId("header")).toBeInTheDocument();

		expect(() => {
			fireEvent.click(
				screen.getByRole("button", { name: "Header logo" })
			);
		}).not.toThrow();
	});
});
