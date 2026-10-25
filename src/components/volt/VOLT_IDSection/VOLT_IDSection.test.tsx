// Copyright (c) 2026 minimorphism
// License GPLv3

import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import VOLT_IDSection from "./VOLT_IDSection";

jest.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}));

jest.mock("./VOLT_IDSection.module.scss", () => ({
	section: "section",
	image: "image",
	content: "content",
	icon: "icon",
	title: "title",
	descriptionBox: "descriptionBox",
	description: "description",
	downloadBtn: "downloadBtn",
}));

jest.mock("../../common/Icons/Icons", () => ({
	Icons: {
		VOLT_IDLogo: () => <svg data-testid="volt-id-logo" />,
	},
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

jest.mock("../../common/Footer/Footer", () => ({
	__esModule: true,
	default: () => <footer data-testid="footer" />,
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
		type,
		className,
		onClick,
	}: {
		children: ReactNode;
		variant: string;
		type: "button";
		className?: string;
		onClick?: () => void;
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
		align,
		weight,
		className,
	}: {
		children: ReactNode;
		align?: string;
		weight?: string;
		className?: string;
	}) => (
		<p data-align={align} data-weight={weight} className={className}>
			{children}
		</p>
	),
}));

const createProps = () => ({
	onPrev: jest.fn(),
	onVOLT_Download: jest.fn(),
});

describe("VOLT_IDSection", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders the section container", () => {
		const { container } = render(<VOLT_IDSection {...createProps()} />);

		expect(container.querySelector("section")).toBeInTheDocument();
		expect(container.querySelector(".section")).toBeInTheDocument();
	});

	it("renders the VOLT ID logo", () => {
		render(<VOLT_IDSection {...createProps()} />);

		expect(screen.getByTestId("volt-id-logo")).toBeInTheDocument();
	});

	it("places the logo inside the icon container", () => {
		const { container } = render(<VOLT_IDSection {...createProps()} />);

		const iconContainer = container.querySelector(".icon");

		expect(iconContainer).toBeInTheDocument();
		expect(iconContainer).toContainElement(
			screen.getByTestId("volt-id-logo")
		);
	});

	it("renders the translated title", () => {
		render(<VOLT_IDSection {...createProps()} />);

		expect(screen.getByText("volt.volt-id.title")).toBeInTheDocument();
	});

	it("applies the expected title properties", () => {
		render(<VOLT_IDSection {...createProps()} />);

		const title = screen.getByText("volt.volt-id.title");

		expect(title).toHaveAttribute("data-align", "center");
		expect(title).toHaveAttribute("data-weight", "light");
		expect(title).toHaveClass("title");
	});

	it("renders the description inside a white box", () => {
		render(<VOLT_IDSection {...createProps()} />);

		const description = screen.getByText("volt.volt-id.desc");

		expect(description).toBeInTheDocument();
		expect(description).toHaveClass("description");

		const box = screen.getByTestId("mds-box");

		expect(box).toHaveAttribute("data-variant", "white");
		expect(box).toHaveClass("descriptionBox");
		expect(box).toContainElement(description);
	});

	it("renders the MoveImage component with the expected props", () => {
		render(<VOLT_IDSection {...createProps()} />);

		const moveImage = screen.getByTestId("move-image");

		expect(moveImage).toHaveAttribute(
			"data-image",
			"/images/volt_id_phone.png"
		);
		expect(moveImage).toHaveAttribute("data-class-name", "image");
	});

	it("renders the footer", () => {
		render(<VOLT_IDSection {...createProps()} />);

		expect(screen.getByTestId("footer")).toBeInTheDocument();
	});

	it("renders the download button with the translated label", () => {
		render(<VOLT_IDSection {...createProps()} />);

		expect(
			screen.getByRole("button", { name: "volt.volt-id.btn" })
		).toBeInTheDocument();
	});

	it("renders the download button with the expected properties", () => {
		render(<VOLT_IDSection {...createProps()} />);

		const button = screen.getByRole("button", {
			name: "volt.volt-id.btn",
		});

		expect(button).toHaveAttribute("type", "button");
		expect(button).toHaveAttribute("data-variant", "black");
		expect(button).toHaveClass("downloadBtn");
	});

	it("calls onVOLT_Download when the download button is clicked", () => {
		const props = createProps();

		render(<VOLT_IDSection {...props} />);

		fireEvent.click(
			screen.getByRole("button", { name: "volt.volt-id.btn" })
		);

		expect(props.onVOLT_Download).toHaveBeenCalledTimes(1);
	});

	it("does not call onPrev during initial render", () => {
		const props = createProps();

		render(<VOLT_IDSection {...props} />);

		expect(props.onPrev).not.toHaveBeenCalled();
	});

	it("does not call onPrev when the download button is clicked", () => {
		const props = createProps();

		render(<VOLT_IDSection {...props} />);

		fireEvent.click(
			screen.getByRole("button", { name: "volt.volt-id.btn" })
		);

		expect(props.onPrev).not.toHaveBeenCalled();
		expect(props.onVOLT_Download).toHaveBeenCalledTimes(1);
	});
});
