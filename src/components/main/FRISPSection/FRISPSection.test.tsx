// Copyright (c) 2026 minimorphism
// License GPLv3

import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FRISPSection from "./FRISPSection";

jest.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}));

jest.mock("./FRISPSection.module.scss", () => ({
	section: "section",
	content: "content",
	title: "title",
	comingBtn: "comingBtn",
	image: "image",
}));

jest.mock("../../common/Footer/Footer", () => ({
	__esModule: true,
	default: () => <footer data-testid="footer" />,
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
		variant: string;
		weight: string;
		className?: string;
	}) => (
		<h1 data-variant={variant} data-weight={weight} className={className}>
			{children}
		</h1>
	),
}));

describe("FRISPSection", () => {
	it("renders the section container", () => {
		const { container } = render(<FRISPSection onPrev={jest.fn()} />);

		expect(container.querySelector(".section")).toBeInTheDocument();
	});

	it("renders the FRISP heading", () => {
		render(<FRISPSection onPrev={jest.fn()} />);

		expect(
			screen.getByRole("heading", { name: "FRISP" })
		).toBeInTheDocument();
	});

	it("passes the expected props to the heading", () => {
		render(<FRISPSection onPrev={jest.fn()} />);

		const heading = screen.getByRole("heading", { name: "FRISP" });

		expect(heading).toHaveAttribute("data-variant", "h1");
		expect(heading).toHaveAttribute("data-weight", "light");
		expect(heading).toHaveClass("title");
	});

	it("renders the coming soon button", () => {
		render(<FRISPSection onPrev={jest.fn()} />);

		expect(
			screen.getByRole("button", { name: "main.frisp.btn" })
		).toBeInTheDocument();
	});

	it("renders the button with the black variant", () => {
		render(<FRISPSection onPrev={jest.fn()} />);

		expect(
			screen.getByRole("button", { name: "main.frisp.btn" })
		).toHaveAttribute("data-variant", "black");
	});

	it("renders the button with button type", () => {
		render(<FRISPSection onPrev={jest.fn()} />);

		expect(
			screen.getByRole("button", { name: "main.frisp.btn" })
		).toHaveAttribute("type", "button");
	});

	it("renders the button with the expected CSS class", () => {
		render(<FRISPSection onPrev={jest.fn()} />);

		expect(
			screen.getByRole("button", { name: "main.frisp.btn" })
		).toHaveClass("comingBtn");
	});

	it("renders the phone image with the expected props", () => {
		render(<FRISPSection onPrev={jest.fn()} />);

		const moveImage = screen.getByTestId("move-image");

		expect(moveImage).toHaveAttribute(
			"data-image",
			"/images/frisp_phone.png"
		);
		expect(moveImage).toHaveAttribute("data-class-name", "image");
	});

	it("renders the footer", () => {
		render(<FRISPSection onPrev={jest.fn()} />);

		expect(screen.getByTestId("footer")).toBeInTheDocument();
	});

	it("does not call onPrev during initial render", () => {
		const onPrev = jest.fn();

		render(<FRISPSection onPrev={onPrev} />);

		expect(onPrev).not.toHaveBeenCalled();
	});

	it("does not call onPrev when the coming soon button is clicked", () => {
		const onPrev = jest.fn();

		render(<FRISPSection onPrev={onPrev} />);

		fireEvent.click(screen.getByRole("button", { name: "main.frisp.btn" }));

		expect(onPrev).not.toHaveBeenCalled();
	});
});
