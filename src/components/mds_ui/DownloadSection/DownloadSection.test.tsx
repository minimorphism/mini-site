// Copyright (c) 2026 minimorphism
// License GPLv3

import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DownloadSection from "./DownloadSection";
import { openInNewTab } from "../../common/OpenLink/OpenLink";

jest.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}));

jest.mock("./DownloadSection.module.scss", () => ({
	section: "section",
	backgroundBox: "backgroundBox",
	title: "title",
	goToBtn: "goToBtn",
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
		weight,
		align,
		color,
		className,
	}: {
		children: ReactNode;
		weight?: string;
		align?: string;
		color?: string;
		className?: string;
	}) => (
		<p
			data-weight={weight}
			data-align={align}
			data-color={color}
			className={className}
		>
			{children}
		</p>
	),
}));

const createProps = () => ({
	onBack: jest.fn(),
});

describe("DownloadSection", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders the section container", () => {
		const { container } = render(<DownloadSection {...createProps()} />);

		expect(container.querySelector("section")).toBeInTheDocument();
		expect(container.querySelector(".section")).toBeInTheDocument();
	});

	it("renders the background box with the black variant", () => {
		render(<DownloadSection {...createProps()} />);

		const box = screen.getByTestId("mds-box");

		expect(box).toHaveAttribute("data-variant", "black");
		expect(box).toHaveClass("backgroundBox");
	});

	it("renders the translated title", () => {
		render(<DownloadSection {...createProps()} />);

		const title = screen.getByText("mds-ui.download.title");

		expect(title).toBeInTheDocument();
		expect(title).toHaveClass("title");
		expect(title).toHaveAttribute("data-weight", "light");
		expect(title).toHaveAttribute("data-align", "center");
		expect(title).toHaveAttribute("data-color", "white");
	});

	it("renders the title inside the background box", () => {
		render(<DownloadSection {...createProps()} />);

		expect(screen.getByTestId("mds-box")).toContainElement(
			screen.getByText("mds-ui.download.title")
		);
	});

	it("renders the GitHub button with the translated label", () => {
		render(<DownloadSection {...createProps()} />);

		expect(
			screen.getByRole("button", {
				name: "mds-ui.download.btn",
			})
		).toBeInTheDocument();
	});

	it("renders the button with the anodized variant", () => {
		render(<DownloadSection {...createProps()} />);

		const button = screen.getByRole("button", {
			name: "mds-ui.download.btn",
		});

		expect(button).toHaveAttribute("data-variant", "anodized");
		expect(button).toHaveClass("goToBtn");
	});

	it("opens the GitHub repository when the button is clicked", () => {
		render(<DownloadSection {...createProps()} />);

		fireEvent.click(
			screen.getByRole("button", {
				name: "mds-ui.download.btn",
			})
		);

		expect(openInNewTab).toHaveBeenCalledTimes(1);
		expect(openInNewTab).toHaveBeenCalledWith(
			"https://github.com/minimorphism/mds-ui"
		);
	});

	it("does not open the GitHub repository before the button is clicked", () => {
		render(<DownloadSection {...createProps()} />);

		expect(openInNewTab).not.toHaveBeenCalled();
	});

	it("renders the footer with the white variant", () => {
		render(<DownloadSection {...createProps()} />);

		expect(screen.getByTestId("footer")).toHaveAttribute(
			"data-variant",
			"white"
		);
	});

	it("does not call onBack during initial render", () => {
		const props = createProps();

		render(<DownloadSection {...props} />);

		expect(props.onBack).not.toHaveBeenCalled();
	});

	it("does not call onBack when the GitHub button is clicked", () => {
		const props = createProps();

		render(<DownloadSection {...props} />);

		fireEvent.click(
			screen.getByRole("button", {
				name: "mds-ui.download.btn",
			})
		);

		expect(props.onBack).not.toHaveBeenCalled();
		expect(openInNewTab).toHaveBeenCalledWith(
			"https://github.com/minimorphism/mds-ui"
		);
	});
});
