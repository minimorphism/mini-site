// Copyright (c) 2026 minimorphism
// License GPLv3

import type { ReactNode } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import CoreSection from "./CoreSection";
import { openInNewTab } from "../../common/OpenLink/OpenLink";

jest.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}));

jest.mock("./CoreSection.module.scss", () => ({
	section: "section",
	card: "card",
	image: "image",
	content: "content",
	title: "title",
	description: "description",
	btnGoTo: "btnGoTo",
}));

jest.mock("../../common/OpenLink/OpenLink", () => ({
	openInNewTab: jest.fn(),
}));

jest.mock("../../common/Footer/Footer", () => ({
	__esModule: true,
	default: ({ variant }: { variant?: string }) => (
		<footer data-testid="footer" data-variant={variant} />
	),
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
		className,
		onClick,
	}: {
		children: ReactNode;
		variant: string;
		className?: string;
		onClick?: () => void;
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
	Typography: ({
		children,
		color,
		align,
		weight,
		className,
	}: {
		children: ReactNode;
		color?: string;
		align?: string;
		weight?: string;
		className?: string;
	}) => (
		<p
			data-color={color}
			data-align={align}
			data-weight={weight}
			className={className}
		>
			{children}
		</p>
	),
}));

const createProps = () => ({
	onPrev: jest.fn(),
});

describe("CoreSection", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders the section container", () => {
		const { container } = render(<CoreSection {...createProps()} />);

		expect(container.querySelector("section")).toBeInTheDocument();
		expect(container.querySelector(".section")).toBeInTheDocument();
	});

	it("renders the card with the black variant", () => {
		render(<CoreSection {...createProps()} />);

		const card = screen.getByTestId("mds-box");

		expect(card).toHaveAttribute("data-variant", "black");
		expect(card).toHaveClass("card");
	});

	it("renders the VOLT Core image", () => {
		render(<CoreSection {...createProps()} />);

		const image = screen.getByRole("img", {
			name: "VOLT Core",
		});

		expect(image).toBeInTheDocument();
		expect(image).toHaveAttribute("src", "/images/volt_core.png");
		expect(image).toHaveClass("image");
	});

	it("places the image inside the card", () => {
		render(<CoreSection {...createProps()} />);

		const card = screen.getByTestId("mds-box");

		expect(
			within(card).getByRole("img", { name: "VOLT Core" })
		).toBeInTheDocument();
	});

	it("renders the Core title", () => {
		render(<CoreSection {...createProps()} />);

		const title = screen.getByText("Core");

		expect(title).toBeInTheDocument();
		expect(title).toHaveClass("title");
		expect(title).toHaveAttribute("data-color", "white");
		expect(title).toHaveAttribute("data-align", "center");
		expect(title).toHaveAttribute("data-weight", "light");
	});

	it("renders the translated description", () => {
		render(<CoreSection {...createProps()} />);

		const description = screen.getByText("volt-download.core.desc");

		expect(description).toBeInTheDocument();
		expect(description).toHaveClass("description");
		expect(description).toHaveAttribute("data-color", "white");
		expect(description).toHaveAttribute("data-align", "center");
		expect(description).toHaveAttribute("data-weight", "light");
	});

	it("renders the GitHub button with the translated label", () => {
		render(<CoreSection {...createProps()} />);

		expect(
			screen.getByRole("button", {
				name: "volt-download.core.btn",
			})
		).toBeInTheDocument();
	});

	it("renders the button with the anodized variant", () => {
		render(<CoreSection {...createProps()} />);

		const button = screen.getByRole("button", {
			name: "volt-download.core.btn",
		});

		expect(button).toHaveAttribute("data-variant", "anodized");
		expect(button).toHaveClass("btnGoTo");
	});

	it("opens the Core repository when the button is clicked", () => {
		render(<CoreSection {...createProps()} />);

		fireEvent.click(
			screen.getByRole("button", {
				name: "volt-download.core.btn",
			})
		);

		expect(openInNewTab).toHaveBeenCalledTimes(1);
		expect(openInNewTab).toHaveBeenCalledWith(
			"https://github.com/minimorphism/volt-core"
		);
	});

	it("does not open the repository before the button is clicked", () => {
		render(<CoreSection {...createProps()} />);

		expect(openInNewTab).not.toHaveBeenCalled();
	});

	it("renders the footer with the black variant", () => {
		render(<CoreSection {...createProps()} />);

		expect(screen.getByTestId("footer")).toHaveAttribute(
			"data-variant",
			"black"
		);
	});

	it("does not call onPrev during initial render", () => {
		const props = createProps();

		render(<CoreSection {...props} />);

		expect(props.onPrev).not.toHaveBeenCalled();
	});

	it("does not call onPrev when the GitHub button is clicked", () => {
		const props = createProps();

		render(<CoreSection {...props} />);

		fireEvent.click(
			screen.getByRole("button", {
				name: "volt-download.core.btn",
			})
		);

		expect(props.onPrev).not.toHaveBeenCalled();
		expect(openInNewTab).toHaveBeenCalledWith(
			"https://github.com/minimorphism/volt-core"
		);
	});
});
