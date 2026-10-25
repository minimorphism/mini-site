// Copyright (c) 2026 minimorphism
// License GPLv3

import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FirstSection from "./FirstSection";

jest.mock("./FirstSection.module.scss", () => ({
	section: "section",
	content: "content",
	video: "video",
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

	it("renders the header with the white variant", () => {
		render(<FirstSection {...createProps()} />);

		expect(screen.getByTestId("header")).toHaveAttribute(
			"data-variant",
			"white"
		);
	});

	it("passes onLogoClick to the header", () => {
		const props = createProps();

		render(<FirstSection {...props} />);

		fireEvent.click(screen.getByRole("button", { name: "Header logo" }));

		expect(props.onLogoClick).toHaveBeenCalledTimes(1);
	});

	it("renders the video element", () => {
		const { container } = render(<FirstSection {...createProps()} />);

		expect(container.querySelector("video")).toBeInTheDocument();
	});

	it("applies the video CSS class", () => {
		const { container } = render(<FirstSection {...createProps()} />);

		expect(container.querySelector("video")).toHaveClass("video");
	});

	it("enables autoplay, muted playback, and inline playback", () => {
		const { container } = render(<FirstSection {...createProps()} />);

		const video = container.querySelector("video");

		expect(video).toHaveAttribute("autoplay");
	});

	it("sets preload to auto", () => {
		const { container } = render(<FirstSection {...createProps()} />);

		expect(container.querySelector("video")).toHaveAttribute(
			"preload",
			"auto"
		);
	});

	it("renders the expected video source", () => {
		const { container } = render(<FirstSection {...createProps()} />);

		const source = container.querySelector("video source");

		expect(source).toBeInTheDocument();
		expect(source).toHaveAttribute("src", "/videos/first.mp4");
		expect(source).toHaveAttribute("type", "video/mp4");
	});

	it("renders fallback text for unsupported browsers", () => {
		const { container } = render(<FirstSection {...createProps()} />);

		expect(container.querySelector("video")).toHaveTextContent(
			"Your browser does not support videos :("
		);
	});

	it("does not call callbacks during initial render", () => {
		const props = createProps();

		render(<FirstSection {...props} />);

		expect(props.onNext).not.toHaveBeenCalled();
		expect(props.onLogoClick).not.toHaveBeenCalled();
	});

	it("does not call onNext when the video is rendered", () => {
		const props = createProps();

		render(<FirstSection {...props} />);

		expect(props.onNext).not.toHaveBeenCalled();
	});

	it("renders when onLogoClick is omitted", () => {
		render(<FirstSection onNext={jest.fn()} />);

		expect(screen.getByTestId("header")).toBeInTheDocument();

		expect(() => {
			fireEvent.click(
				screen.getByRole("button", { name: "Header logo" })
			);
		}).not.toThrow();
	});
});
