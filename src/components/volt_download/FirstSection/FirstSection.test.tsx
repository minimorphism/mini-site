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
	image: "image",
	content: "content",
	title: "title",
	actions: "actions",
	downloadBtn: "downloadBtn",
	forDevelopersBtn: "forDevelopersBtn",
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
	}: {
		children: ReactNode;
		variant: string;
		type: "button";
		className?: string;
	}) => (
		<button type={type} data-variant={variant} className={className}>
			{children}
		</button>
	),
	Typography: ({
		children,
		weight,
		className,
	}: {
		children: ReactNode;
		weight?: string;
		className?: string;
	}) => (
		<h1 data-weight={weight} className={className}>
			{children}
		</h1>
	),
}));

const createProps = () => ({
	onNext: jest.fn(),
	onLogoClick: jest.fn(),
});

describe("FirstSection", () => {
	it("renders the section container", () => {
		const { container } = render(<FirstSection {...createProps()} />);

		expect(container.querySelector("section")).toBeInTheDocument();
		expect(container.querySelector(".section")).toBeInTheDocument();
	});

	it("renders the VOLT heading", () => {
		render(<FirstSection {...createProps()} />);

		expect(
			screen.getByRole("heading", { name: "VOLT" })
		).toBeInTheDocument();
	});

	it("renders the heading with the expected props", () => {
		render(<FirstSection {...createProps()} />);

		const heading = screen.getByRole("heading", { name: "VOLT" });

		expect(heading).toHaveAttribute("data-weight", "light");
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

	it("renders without an optional onLogoClick callback", () => {
		render(<FirstSection onNext={jest.fn()} />);

		expect(screen.getByTestId("header")).toBeInTheDocument();

		expect(() => {
			fireEvent.click(
				screen.getByRole("button", { name: "Header logo" })
			);
		}).not.toThrow();
	});

	it("renders MoveImage with the expected props", () => {
		render(<FirstSection {...createProps()} />);

		const moveImage = screen.getByTestId("move-image");

		expect(moveImage).toHaveAttribute(
			"data-image",
			"/images/download_phone.png"
		);
		expect(moveImage).toHaveAttribute("data-class-name", "image");
	});

	it("renders both action buttons with translated labels", () => {
		render(<FirstSection {...createProps()} />);

		expect(
			screen.getByRole("button", {
				name: "volt-download.first.first-btn",
			})
		).toBeInTheDocument();

		expect(
			screen.getByRole("button", {
				name: "volt-download.first.second-btn",
			})
		).toBeInTheDocument();
	});

	it("renders both buttons with the black variant", () => {
		render(<FirstSection {...createProps()} />);

		expect(
			screen.getByRole("button", {
				name: "volt-download.first.first-btn",
			})
		).toHaveAttribute("data-variant", "black");

		expect(
			screen.getByRole("button", {
				name: "volt-download.first.second-btn",
			})
		).toHaveAttribute("data-variant", "black");
	});

	it("renders both buttons with button type", () => {
		render(<FirstSection {...createProps()} />);

		expect(
			screen.getByRole("button", {
				name: "volt-download.first.first-btn",
			})
		).toHaveAttribute("type", "button");

		expect(
			screen.getByRole("button", {
				name: "volt-download.first.second-btn",
			})
		).toHaveAttribute("type", "button");
	});

	it("applies the expected CSS classes to the action buttons", () => {
		render(<FirstSection {...createProps()} />);

		expect(
			screen.getByRole("button", {
				name: "volt-download.first.first-btn",
			})
		).toHaveClass("downloadBtn");

		expect(
			screen.getByRole("button", {
				name: "volt-download.first.second-btn",
			})
		).toHaveClass("forDevelopersBtn");
	});

	it("does not call onNext during initial render", () => {
		const props = createProps();

		render(<FirstSection {...props} />);

		expect(props.onNext).not.toHaveBeenCalled();
	});

	it("does not call onNext when either action button is clicked", () => {
		const props = createProps();

		render(<FirstSection {...props} />);

		fireEvent.click(
			screen.getByRole("button", {
				name: "volt-download.first.first-btn",
			})
		);

		fireEvent.click(
			screen.getByRole("button", {
				name: "volt-download.first.second-btn",
			})
		);

		expect(props.onNext).not.toHaveBeenCalled();
	});
});
