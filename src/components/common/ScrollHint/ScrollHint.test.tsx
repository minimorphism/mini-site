// Copyright (c) 2026 minimorphism
// License GPLv3

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ScrollHint from "./ScrollHint";

jest.mock("./ScrollHint.module.scss", () => ({
	scrollHint: "scrollHint",
	label: "label",
}));

describe("ScrollHint", () => {
	it("renders the default label", () => {
		render(<ScrollHint />);

		expect(screen.getByText("SCROLL TO EXPLORE")).toBeInTheDocument();
	});

	it("renders a custom label", () => {
		render(<ScrollHint label="SCROLL DOWN" />);

		expect(screen.getByText("SCROLL DOWN")).toBeInTheDocument();
	});

	it("does not render the default label when a custom label is provided", () => {
		render(<ScrollHint label="KEEP EXPLORING" />);

		expect(screen.getByText("KEEP EXPLORING")).toBeInTheDocument();
		expect(screen.queryByText("SCROLL TO EXPLORE")).not.toBeInTheDocument();
	});

	it("renders the label inside a span", () => {
		render(<ScrollHint label="SCROLL DOWN" />);

		const label = screen.getByText("SCROLL DOWN");

		expect(label.tagName).toBe("SPAN");
	});

	it("applies the expected CSS classes", () => {
		const { container } = render(<ScrollHint />);

		expect(container.querySelector(".scrollHint")).toBeInTheDocument();
		expect(container.querySelector(".label")).toBeInTheDocument();
	});

	it("renders the label only once", () => {
		render(<ScrollHint />);

		expect(screen.getAllByText("SCROLL TO EXPLORE")).toHaveLength(1);
	});

	it("supports an empty custom label", () => {
		const { container } = render(<ScrollHint label="" />);

		expect(container.querySelector(".label")).toBeEmptyDOMElement();
		expect(screen.queryByText("SCROLL TO EXPLORE")).not.toBeInTheDocument();
	});
});
