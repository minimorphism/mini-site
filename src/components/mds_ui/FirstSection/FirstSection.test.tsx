// Copyright (c) 2026 minimorphism
// License GPLv3

import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FirstSection from "./FirstSection";
import { openInNewTab } from "../../common/OpenLink/OpenLink";

jest.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}));

jest.mock("./FirstSection.module.scss", () => ({
	section: "section",
	content: "content",
	whiteBox: "whiteBox",
	title: "title",
	actions: "actions",
	readManifestoBtn: "readManifestoBtn",
	goToBtn: "goToBtn",
}));

jest.mock("../../common/OpenLink/OpenLink", () => ({
	openInNewTab: jest.fn(),
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
		<div
			data-testid="mds-box"
			data-variant={variant}
			className={className}
		>
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
		variant,
		weight,
		className,
	}: {
		children: ReactNode;
		variant?: string;
		weight?: string;
		className?: string;
	}) => (
		<h1
			data-variant={variant}
			data-weight={weight}
			className={className}
		>
			{children}
		</h1>
	),
}));

const createProps = () => ({
	onNext: jest.fn(),
	onLogoClick: jest.fn(),
});

describe("FirstSection", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders the section container", () => {
		const { container } = render(<FirstSection {...createProps()} />);

		expect(container.querySelector("section")).toBeInTheDocument();
		expect(container.querySelector(".section")).toBeInTheDocument();
	});

	it("renders the header with the black variant", () => {
		render(<FirstSection {...createProps()} />);

		expect(screen.getByTestId("header")).toHaveAttribute(
			"data-variant",
			"black",
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
			fireEvent.click(screen.getByRole("button", { name: "Header logo" }));
		}).not.toThrow();
	});

	it("renders the design system title", () => {
		render(<FirstSection {...createProps()} />);

		const title = screen.getByRole("heading", {
			name: "minimorphism design system",
		});

		expect(title).toBeInTheDocument();
		expect(title).toHaveAttribute("data-variant", "h1");
		expect(title).toHaveAttribute("data-weight", "light");
		expect(title).toHaveClass("title");
	});

	it("renders the title inside a white box", () => {
		render(<FirstSection {...createProps()} />);

		const box = screen.getByTestId("mds-box");

		expect(box).toHaveAttribute("data-variant", "white");
		expect(box).toHaveClass("whiteBox");
		expect(box).toContainElement(
			screen.getByRole("heading", {
				name: "minimorphism design system",
			}),
		);
	});

	it("renders both action buttons with translated labels", () => {
		render(<FirstSection {...createProps()} />);

		expect(
			screen.getByRole("button", {
				name: "mds-ui.first.first-btn",
			}),
		).toBeInTheDocument();

		expect(
			screen.getByRole("button", {
				name: "mds-ui.first.second-btn",
			}),
		).toBeInTheDocument();
	});

	it("renders both action buttons with the black variant", () => {
		render(<FirstSection {...createProps()} />);

		expect(
			screen.getByRole("button", {
				name: "mds-ui.first.first-btn",
			}),
		).toHaveAttribute("data-variant", "black");

		expect(
			screen.getByRole("button", {
				name: "mds-ui.first.second-btn",
			}),
		).toHaveAttribute("data-variant", "black");
	});

	it("renders both action buttons with button type", () => {
		render(<FirstSection {...createProps()} />);

		expect(
			screen.getByRole("button", {
				name: "mds-ui.first.first-btn",
			}),
		).toHaveAttribute("type", "button");

		expect(
			screen.getByRole("button", {
				name: "mds-ui.first.second-btn",
			}),
		).toHaveAttribute("type", "button");
	});

	it("applies the expected CSS classes to the buttons", () => {
		render(<FirstSection {...createProps()} />);

		expect(
			screen.getByRole("button", {
				name: "mds-ui.first.first-btn",
			}),
		).toHaveClass("readManifestoBtn");

		expect(
			screen.getByRole("button", {
				name: "mds-ui.first.second-btn",
			}),
		).toHaveClass("goToBtn");
	});

	it("opens the manifesto when the first button is clicked", () => {
		render(<FirstSection {...createProps()} />);

		fireEvent.click(
			screen.getByRole("button", {
				name: "mds-ui.first.first-btn",
			}),
		);

		expect(openInNewTab).toHaveBeenCalledTimes(1);
		expect(openInNewTab).toHaveBeenCalledWith(
			"https://github.com/minimorphism/mds-ui/blob/main/Manifest/Manifest.md",
		);
	});

	it("opens the npm package when the second button is clicked", () => {
		render(<FirstSection {...createProps()} />);

		fireEvent.click(
			screen.getByRole("button", {
				name: "mds-ui.first.second-btn",
			}),
		);

		expect(openInNewTab).toHaveBeenCalledTimes(1);
		expect(openInNewTab).toHaveBeenCalledWith(
			"https://www.npmjs.com/package/@minimorphism/mds-ui",
		);
	});

	it("does not open any link during initial render", () => {
		render(<FirstSection {...createProps()} />);

		expect(openInNewTab).not.toHaveBeenCalled();
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
				name: "mds-ui.first.first-btn",
			}),
		);

		fireEvent.click(
			screen.getByRole("button", {
				name: "mds-ui.first.second-btn",
			}),
		);

		expect(props.onNext).not.toHaveBeenCalled();
		expect(openInNewTab).toHaveBeenCalledTimes(2);
	});
});
