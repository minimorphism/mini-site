// Copyright (c) 2026 minimorphism
// License GPLv3

import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "./Footer";

const mockChangeLanguage = jest.fn();
let mockLanguage = "ru";

jest.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
		i18n: {
			get language() {
				return mockLanguage;
			},
			changeLanguage: mockChangeLanguage,
		},
	}),
}));

jest.mock("@minimorphism/mds-ui", () => ({
	Box: ({
		children,
		variant,
		className,
	}: {
		children: React.ReactNode;
		variant: string;
		className?: string;
	}) => (
		<div
			data-testid="footer-box"
			data-variant={variant}
			className={className}
		>
			{children}
		</div>
	),
	Button: ({
		children,
		variant,
		onClick,
		type,
		className,
		"aria-label": ariaLabel,
	}: {
		children: React.ReactNode;
		variant: string;
		onClick: () => void;
		type: "button";
		className?: string;
		"aria-label"?: string;
	}) => (
		<button
			type={type}
			data-variant={variant}
			className={className}
			aria-label={ariaLabel}
			onClick={onClick}
		>
			{children}
		</button>
	),
}));

jest.mock("./Footer.module.scss", () => ({
	footer: "footer",
	footerBox: "footerBox",
	text: "text",
	langBtn: "langBtn",
}));

describe("Footer", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockLanguage = "ru";
	});

	it("renders the footer", () => {
		render(<Footer />);

		expect(screen.getByRole("contentinfo")).toBeInTheDocument();
	});

	it("renders the copyright text", () => {
		render(<Footer />);

		expect(
			screen.getByText(/Copyright © 2026 minimorphism\./)
		).toBeInTheDocument();

		expect(screen.getByText("footer.copyrights")).toBeInTheDocument();
	});

	it("uses the black variant by default", () => {
		render(<Footer />);

		expect(screen.getByTestId("footer-box")).toHaveAttribute(
			"data-variant",
			"black"
		);

		expect(
			screen.getByRole("button", { name: "Switch language to English" })
		).toHaveAttribute("data-variant", "anodized");
	});

	it("uses the white variant when requested", () => {
		render(<Footer variant="white" />);

		expect(screen.getByTestId("footer-box")).toHaveAttribute(
			"data-variant",
			"anodized"
		);

		expect(
			screen.getByRole("button", { name: "Switch language to English" })
		).toHaveAttribute("data-variant", "black");
	});

	it("renders the default language button with RU text", () => {
		render(<Footer />);

		expect(
			screen.getByRole("button", { name: "Switch language to English" })
		).toHaveTextContent("RU");
	});

	it("switches the button label to EN after clicking", () => {
		render(<Footer />);

		fireEvent.click(
			screen.getByRole("button", { name: "Switch language to English" })
		);

		expect(
			screen.getByRole("button", { name: "Switch language to Russian" })
		).toHaveTextContent("EN");
	});

	it("changes the language from Russian to English", () => {
		render(<Footer />);

		fireEvent.click(
			screen.getByRole("button", { name: "Switch language to English" })
		);

		expect(mockChangeLanguage).toHaveBeenCalledTimes(1);
		expect(mockChangeLanguage).toHaveBeenCalledWith("en");
	});

	it("changes the language from English to Russian", () => {
		mockLanguage = "en";

		render(<Footer />);

		fireEvent.click(
			screen.getByRole("button", { name: "Switch language to English" })
		);

		expect(mockChangeLanguage).toHaveBeenCalledWith("ru");
	});

	it("toggles the button label on repeated clicks", () => {
		render(<Footer />);

		fireEvent.click(
			screen.getByRole("button", { name: "Switch language to English" })
		);

		fireEvent.click(
			screen.getByRole("button", { name: "Switch language to Russian" })
		);

		expect(
			screen.getByRole("button", { name: "Switch language to English" })
		).toHaveTextContent("RU");

		expect(mockChangeLanguage).toHaveBeenNthCalledWith(1, "en");
		expect(mockChangeLanguage).toHaveBeenNthCalledWith(2, "en");
	});
});
