// Copyright (c) 2026 minimorphism
// License GPLv3

import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ObjectsSection from "./ObjectsSection";

jest.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}));

jest.mock("./ObjectsSection.module.scss", () => ({
	section: "section",
	title: "title",
	description: "description",
	image: "image",
}));

jest.mock("@minimorphism/mds-ui", () => ({
	Button: ({ children }: { children: ReactNode }) => (
		<button type="button">{children}</button>
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
	onBack: jest.fn(),
});

describe("ObjectsSection", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders the section container", () => {
		const { container } = render(<ObjectsSection {...createProps()} />);

		expect(container.querySelector("section")).toBeInTheDocument();
		expect(container.querySelector(".section")).toBeInTheDocument();
	});

	it("renders the translated title", () => {
		render(<ObjectsSection {...createProps()} />);

		const title = screen.getByText("mds-ui.objects.title");

		expect(title).toBeInTheDocument();
		expect(title).toHaveClass("title");
		expect(title).toHaveAttribute("data-color", "black");
		expect(title).toHaveAttribute("data-align", "center");
	});

	it("renders the translated description", () => {
		render(<ObjectsSection {...createProps()} />);

		const description = screen.getByText("mds-ui.objects.desc");

		expect(description).toBeInTheDocument();
		expect(description).toHaveClass("description");
		expect(description).toHaveAttribute("data-color", "black");
		expect(description).toHaveAttribute("data-align", "center");
	});

	it("renders the widgets image with the expected source", () => {
		render(<ObjectsSection {...createProps()} />);

		const image = screen.getByRole("img", {
			name: "MDS UI Widgets",
		});

		expect(image).toBeInTheDocument();
		expect(image).toHaveAttribute("src", "/images/widgets.png");
		expect(image).toHaveClass("image");
	});

	it("renders the title before the description and image", () => {
		const { container } = render(<ObjectsSection {...createProps()} />);

		const section = container.querySelector("section");

		expect(section).not.toBeNull();

		const children = Array.from(section!.children);

		expect(children).toHaveLength(3);
		expect(children[0]).toHaveTextContent("mds-ui.objects.title");
		expect(children[1]).toHaveTextContent("mds-ui.objects.desc");
		expect(children[2].tagName).toBe("IMG");
	});

	it("renders the widgets image only once", () => {
		render(<ObjectsSection {...createProps()} />);

		expect(
			screen.getAllByRole("img", { name: "MDS UI Widgets" })
		).toHaveLength(1);
	});

	it("does not call navigation callbacks during initial render", () => {
		const props = createProps();

		render(<ObjectsSection {...props} />);

		expect(props.onNext).not.toHaveBeenCalled();
		expect(props.onBack).not.toHaveBeenCalled();
	});
});
