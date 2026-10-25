// Copyright (c) 2026 minimorphism
// License GPLv3

import { act, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "./Header";

jest.mock("./Header.module.scss", () => ({
	header: "header",
	white: "white",
	black: "black",
	logoButton: "logoButton",
	logo: "logo",
	companyName: "companyName",
	companyNameActive: "companyNameActive",
	companyText: "companyText",
	companyUnderline: "companyUnderline",
	companyUnderlinePath: "companyUnderlinePath",
	rightMark: "rightMark",
	rightImage: "rightImage",
}));

jest.mock("../Icons/Icons", () => ({
	Icons: {
		MiniLogo: ({ className }: { className?: string }) => (
			<svg data-testid="mini-logo" className={className} />
		),
	},
}));

describe("Header", () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.clearAllTimers();
		jest.useRealTimers();
		jest.restoreAllMocks();
	});

	it("renders the header", () => {
		render(<Header />);

		expect(screen.getByRole("banner")).toBeInTheDocument();
	});

	it("uses the white variant by default", () => {
		const { container } = render(<Header />);

		expect(container.querySelector("header")).toHaveClass(
			"header",
			"white"
		);
	});

	it("uses the black variant when requested", () => {
		const { container } = render(<Header variant="black" />);

		expect(container.querySelector("header")).toHaveClass(
			"header",
			"black"
		);
	});

	it("renders the logo icon", () => {
		render(<Header />);

		expect(screen.getByTestId("mini-logo")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "home" })).toContainElement(
			screen.getByTestId("mini-logo")
		);
	});

	it("calls onLogoClick when the logo button is clicked", () => {
		const onLogoClick = jest.fn();

		render(<Header onLogoClick={onLogoClick} />);

		fireEvent.click(screen.getByRole("button", { name: "home" }));

		expect(onLogoClick).toHaveBeenCalledTimes(1);
	});

	it("allows the logo button to be clicked without a callback", () => {
		render(<Header />);

		expect(() => {
			fireEvent.click(screen.getByRole("button", { name: "home" }));
		}).not.toThrow();
	});

	it("renders the company name", () => {
		render(<Header />);

		expect(screen.getByText("minimorphism")).toBeInTheDocument();
	});

	it("uses the default black image for the white variant", () => {
		const { container } = render(<Header variant="white" />);

		const image = container.querySelector(".rightImage");

		expect(image).toHaveAttribute("src", "/images/be_free_black.png");
	});

	it("uses the default white image for the black variant", () => {
		const { container } = render(<Header variant="black" />);

		const image = container.querySelector(".rightImage");

		expect(image).toHaveAttribute("src", "/images/be_free_white.png");
	});

	it("uses a custom right image when provided", () => {
		const { container } = render(
			<Header rightImage="/images/custom.png" />
		);

		expect(container.querySelector(".rightImage")).toHaveAttribute(
			"src",
			"/images/custom.png"
		);
	});

	it("renders the right image as decorative content", () => {
		const { container } = render(<Header />);

		const image = container.querySelector("img");

		expect(image).toHaveAttribute("alt", "");
		expect(image).toHaveAttribute("aria-hidden", "true");
		expect(image).toHaveAttribute("draggable", "false");
	});

	it("activates the company name when the pointer enters", () => {
		const { container } = render(<Header />);

		const company = container.querySelector('[aria-label="minimorphism"]');

		expect(company).not.toHaveClass("companyNameActive");

		fireEvent.mouseEnter(company!);

		expect(company).toHaveClass("companyNameActive");
	});

	it("keeps the company name active before the timeout expires", () => {
		const { container } = render(<Header />);

		const company = container.querySelector('[aria-label="minimorphism"]')!;

		fireEvent.mouseEnter(company);
		fireEvent.mouseLeave(company);

		act(() => {
			jest.advanceTimersByTime(5999);
		});

		expect(company).toHaveClass("companyNameActive");
	});

	it("deactivates the company name after six seconds", () => {
		const { container } = render(<Header />);

		const company = container.querySelector('[aria-label="minimorphism"]')!;

		fireEvent.mouseEnter(company);
		fireEvent.mouseLeave(company);

		act(() => {
			jest.advanceTimersByTime(6000);
		});

		expect(company).not.toHaveClass("companyNameActive");
	});

	it("cancels the pending timeout when the pointer re-enters", () => {
		const { container } = render(<Header />);

		const company = container.querySelector('[aria-label="minimorphism"]')!;

		fireEvent.mouseEnter(company);
		fireEvent.mouseLeave(company);

		act(() => {
			jest.advanceTimersByTime(3000);
		});

		fireEvent.mouseEnter(company);

		act(() => {
			jest.advanceTimersByTime(6000);
		});

		expect(company).toHaveClass("companyNameActive");
	});

	it("resets the timeout when the pointer leaves again", () => {
		const { container } = render(<Header />);

		const company = container.querySelector('[aria-label="minimorphism"]')!;

		fireEvent.mouseEnter(company);
		fireEvent.mouseLeave(company);

		act(() => {
			jest.advanceTimersByTime(4000);
		});

		fireEvent.mouseEnter(company);
		fireEvent.mouseLeave(company);

		act(() => {
			jest.advanceTimersByTime(5999);
		});

		expect(company).toHaveClass("companyNameActive");

		act(() => {
			jest.advanceTimersByTime(1);
		});

		expect(company).not.toHaveClass("companyNameActive");
	});

	it("clears the pending timeout when unmounted", () => {
		const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
		const { container, unmount } = render(<Header />);

		const company = container.querySelector('[aria-label="minimorphism"]')!;

		fireEvent.mouseEnter(company);
		fireEvent.mouseLeave(company);

		unmount();

		expect(clearTimeoutSpy).toHaveBeenCalled();
	});

	it("does not deactivate the company name before mouse leave", () => {
		const { container } = render(<Header />);

		const company = container.querySelector('[aria-label="minimorphism"]')!;

		fireEvent.mouseEnter(company);

		act(() => {
			jest.advanceTimersByTime(6000);
		});

		expect(company).toHaveClass("companyNameActive");
	});
});
