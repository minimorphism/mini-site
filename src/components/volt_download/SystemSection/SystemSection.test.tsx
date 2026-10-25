// Copyright (c) 2026 minimorphism
// License GPLv3

import type { ReactNode } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import SystemSection from "./SystemSection";
import { openInNewTab } from "../../common/OpenLink/OpenLink";

jest.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}));

jest.mock("./SystemSection.module.scss", () => ({
	section: "section",
	card: "card",
	content: "content",
	title: "title",
	description: "description",
	button: "button",
	imageBox: "imageBox",
	image: "image",
}));

jest.mock("../../common/OpenLink/OpenLink", () => ({
	openInNewTab: jest.fn(),
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
		className,
		onClick,
	}: {
		children: ReactNode;
		variant: string;
		size?: string;
		className?: string;
		onClick?: () => void;
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
		color,
		align,
		className,
	}: {
		children: ReactNode;
		color?: string;
		align?: string;
		className?: string;
	}) => (
		<p data-color={color} data-align={align} className={className}>
			{children}
		</p>
	),
}));

const createProps = () => ({
	onNext: jest.fn(),
	onPrev: jest.fn(),
});

describe("SystemSection", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders the section container", () => {
		const { container } = render(<SystemSection {...createProps()} />);

		expect(container.querySelector("section")).toBeInTheDocument();
		expect(container.querySelector(".section")).toBeInTheDocument();
	});

	it("renders the card with the white variant", () => {
		render(<SystemSection {...createProps()} />);

		const boxes = screen.getAllByTestId("mds-box");

		expect(boxes[0]).toHaveAttribute("data-variant", "white");
		expect(boxes[0]).toHaveClass("card");
	});

	it("renders the image box with the black variant", () => {
		render(<SystemSection {...createProps()} />);

		const boxes = screen.getAllByTestId("mds-box");

		expect(boxes[1]).toHaveAttribute("data-variant", "black");
		expect(boxes[1]).toHaveClass("imageBox");
	});

	it("renders the System title", () => {
		render(<SystemSection {...createProps()} />);

		expect(screen.getByText("System")).toBeInTheDocument();
		expect(screen.getByText("System")).toHaveClass("title");
		expect(screen.getByText("System")).toHaveAttribute(
			"data-align",
			"center"
		);
	});

	it("renders the translated description", () => {
		render(<SystemSection {...createProps()} />);

		const description = screen.getByText("volt-download.system.desc");

		expect(description).toBeInTheDocument();
		expect(description).toHaveClass("description");
		expect(description).toHaveAttribute("data-color", "black");
		expect(description).toHaveAttribute("data-align", "center");
	});

	it("renders the GitHub button with the translated label", () => {
		render(<SystemSection {...createProps()} />);

		expect(
			screen.getByRole("button", {
				name: "volt-download.system.btn",
			})
		).toBeInTheDocument();
	});

	it("renders the button with the expected properties", () => {
		render(<SystemSection {...createProps()} />);

		const button = screen.getByRole("button", {
			name: "volt-download.system.btn",
		});

		expect(button).toHaveAttribute("type", "button");
		expect(button).toHaveAttribute("data-variant", "black");
		expect(button).toHaveAttribute("data-size", "md");
	});

	it("opens the GitHub repository when the button is clicked", () => {
		render(<SystemSection {...createProps()} />);

		fireEvent.click(
			screen.getByRole("button", {
				name: "volt-download.system.btn",
			})
		);

		expect(openInNewTab).toHaveBeenCalledTimes(1);
		expect(openInNewTab).toHaveBeenCalledWith(
			"https://github.com/minimorphism/volt-wallet"
		);
	});

	it("does not open the GitHub repository before the button is clicked", () => {
		render(<SystemSection {...createProps()} />);

		expect(openInNewTab).not.toHaveBeenCalled();
	});

	it("renders the system phone image with the expected attributes", () => {
		render(<SystemSection {...createProps()} />);

		const image = screen.getByRole("img", {
			name: "System Phone",
		});

		expect(image).toHaveAttribute("src", "/images/system_phone.png");
		expect(image).toHaveClass("image");
	});

	it("places the phone image inside the image box", () => {
		render(<SystemSection {...createProps()} />);

		const boxes = screen.getAllByTestId("mds-box");

		expect(
			within(boxes[1]).getByRole("img", {
				name: "System Phone",
			})
		).toBeInTheDocument();
	});

	it("does not call navigation callbacks during initial render", () => {
		const props = createProps();

		render(<SystemSection {...props} />);

		expect(props.onNext).not.toHaveBeenCalled();
		expect(props.onPrev).not.toHaveBeenCalled();
	});

	it("does not call navigation callbacks when the GitHub button is clicked", () => {
		const props = createProps();

		render(<SystemSection {...props} />);

		fireEvent.click(
			screen.getByRole("button", {
				name: "volt-download.system.btn",
			})
		);

		expect(props.onNext).not.toHaveBeenCalled();
		expect(props.onPrev).not.toHaveBeenCalled();
		expect(openInNewTab).toHaveBeenCalledWith(
			"https://github.com/minimorphism/volt-wallet"
		);
	});
});
