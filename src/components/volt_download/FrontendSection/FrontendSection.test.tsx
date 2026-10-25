// Copyright (c) 2026 minimorphism
// License GPLv3

import type { ReactNode } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import FrontendSection from "./FrontendSection";
import { openInNewTab } from "../../common/OpenLink/OpenLink";

jest.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}));

jest.mock("./FrontendSection.module.scss", () => ({
	section: "section",
	mainBox: "mainBox",
	title: "title",
	childBox: "childBox",
	image: "image",
	content: "content",
	boxTitle: "boxTitle",
	boxDesc: "boxDesc",
	btnGoTo: "btnGoTo",
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
		color,
		align,
		className,
	}: {
		children: ReactNode;
		weight?: string;
		color?: string;
		align?: string;
		className?: string;
	}) => (
		<p
			data-weight={weight}
			data-color={color}
			data-align={align}
			className={className}
		>
			{children}
		</p>
	),
}));

const createProps = () => ({
	onNext: jest.fn(),
	onPrev: jest.fn(),
});

describe("FrontendSection", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders the section container", () => {
		const { container } = render(<FrontendSection {...createProps()} />);

		expect(container.querySelector("section")).toBeInTheDocument();
		expect(container.querySelector(".section")).toBeInTheDocument();
	});

	it("renders the main and child boxes", () => {
		render(<FrontendSection {...createProps()} />);

		const boxes = screen.getAllByTestId("mds-box");

		expect(boxes).toHaveLength(2);
		expect(boxes[0]).toHaveClass("mainBox");
		expect(boxes[1]).toHaveClass("childBox");
	});

	it("uses the expected box variants", () => {
		render(<FrontendSection {...createProps()} />);

		const boxes = screen.getAllByTestId("mds-box");

		expect(boxes[0]).toHaveAttribute("data-variant", "black");
		expect(boxes[1]).toHaveAttribute("data-variant", "anodized");
	});

	it("renders the translated main title", () => {
		render(<FrontendSection {...createProps()} />);

		const title = screen.getByText("volt-download.frontend.title");

		expect(title).toBeInTheDocument();
		expect(title).toHaveClass("title");
		expect(title).toHaveAttribute("data-weight", "light");
		expect(title).toHaveAttribute("data-color", "white");
		expect(title).toHaveAttribute("data-align", "center");
	});

	it("renders the Frontend heading", () => {
		render(<FrontendSection {...createProps()} />);

		const heading = screen.getByText("Frontend");

		expect(heading).toBeInTheDocument();
		expect(heading).toHaveClass("boxTitle");
		expect(heading).toHaveAttribute("data-weight", "light");
		expect(heading).toHaveAttribute("data-align", "center");
	});

	it("renders the translated description", () => {
		render(<FrontendSection {...createProps()} />);

		const description = screen.getByText("volt-download.frontend.desc");

		expect(description).toBeInTheDocument();
		expect(description).toHaveClass("boxDesc");
		expect(description).toHaveAttribute("data-weight", "light");
		expect(description).toHaveAttribute("data-align", "center");
	});

	it("renders the project image with the expected attributes", () => {
		render(<FrontendSection {...createProps()} />);

		const image = screen.getByRole("img", {
			name: "Description project",
		});

		expect(image).toHaveAttribute("src", "/images/frontend.png");
		expect(image).toHaveClass("image");
	});

	it("renders the project image inside the child box", () => {
		render(<FrontendSection {...createProps()} />);

		const boxes = screen.getAllByTestId("mds-box");
		const childBox = boxes[1];

		expect(
			within(childBox).getByRole("img", {
				name: "Description project",
			})
		).toBeInTheDocument();
	});

	it("renders the GitHub button with the translated label", () => {
		render(<FrontendSection {...createProps()} />);

		expect(
			screen.getByRole("button", {
				name: "volt-download.frontend.btn",
			})
		).toBeInTheDocument();
	});

	it("renders the GitHub button with the black variant", () => {
		render(<FrontendSection {...createProps()} />);

		const button = screen.getByRole("button", {
			name: "volt-download.frontend.btn",
		});

		expect(button).toHaveAttribute("data-variant", "black");
		expect(button).toHaveClass("btnGoTo");
	});

	it("opens the GitHub project when the button is clicked", () => {
		render(<FrontendSection {...createProps()} />);

		fireEvent.click(
			screen.getByRole("button", {
				name: "volt-download.frontend.btn",
			})
		);

		expect(openInNewTab).toHaveBeenCalledTimes(1);
		expect(openInNewTab).toHaveBeenCalledWith(
			"https://github.com/minimorphism/volt-ui"
		);
	});

	it("does not open the GitHub project before the button is clicked", () => {
		render(<FrontendSection {...createProps()} />);

		expect(openInNewTab).not.toHaveBeenCalled();
	});

	it("does not call navigation callbacks during initial render", () => {
		const props = createProps();

		render(<FrontendSection {...props} />);

		expect(props.onNext).not.toHaveBeenCalled();
		expect(props.onPrev).not.toHaveBeenCalled();
	});

	it("does not call navigation callbacks when the GitHub button is clicked", () => {
		const props = createProps();

		render(<FrontendSection {...props} />);

		fireEvent.click(
			screen.getByRole("button", {
				name: "volt-download.frontend.btn",
			})
		);

		expect(props.onNext).not.toHaveBeenCalled();
		expect(props.onPrev).not.toHaveBeenCalled();
		expect(openInNewTab).toHaveBeenCalledWith(
			"https://github.com/minimorphism/volt-ui"
		);
	});
});
