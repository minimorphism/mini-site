// Copyright (c) 2026 minimorphism
// License GPLv3

import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, useLocation } from "react-router-dom";

import VOLTDownloadRoute from "./VOLT_DownloadRoute";
import useSectionController from "../hooks/useSectionController";
import { ROUTES, SECTION_COUNTS } from "../routeConfig";

jest.mock("../../pages/VOLT_Download/VOLT_Download", () => ({
	__esModule: true,
	default: (props: { onLogoClick: () => void; testValue: string }) => (
		<div data-testid="volt-download-page">
			<div data-testid="controller-data">{props.testValue}</div>
			<button type="button" onClick={props.onLogoClick}>
				Home
			</button>
		</div>
	),
}));

jest.mock("../hooks/useSectionController", () => ({
	__esModule: true,
	default: jest.fn(() => ({
		testValue: "section-controller-data",
	})),
}));

const LocationDisplay = () => {
	const location = useLocation();

	return <div data-testid="current-location">{location.pathname}</div>;
};

const renderWithRouter = (initialPath: string = ROUTES.voltDownload) =>
	render(
		<MemoryRouter
			initialEntries={[initialPath]}
			future={{
				v7_relativeSplatPath: true,
				v7_startTransition: true,
			}}
		>
			<VOLTDownloadRoute />
			<LocationDisplay />
		</MemoryRouter>
	);

describe("VOLTDownloadRoute", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders the VOLT download page", () => {
		renderWithRouter();

		expect(screen.getByTestId("volt-download-page")).toBeInTheDocument();
	});

	it("initializes the section controller with the correct section count", () => {
		renderWithRouter();

		expect(useSectionController).toHaveBeenCalledTimes(1);
		expect(useSectionController).toHaveBeenCalledWith(
			SECTION_COUNTS.voltDownload
		);
	});

	it("navigates home when the logo is clicked", () => {
		renderWithRouter();

		fireEvent.click(screen.getByRole("button", { name: "Home" }));

		expect(screen.getByTestId("current-location")).toHaveTextContent(
			ROUTES.home
		);
	});

	it("renders the page when opened directly", () => {
		renderWithRouter(ROUTES.voltDownload);

		expect(screen.getByTestId("volt-download-page")).toBeInTheDocument();
		expect(screen.getByTestId("current-location")).toHaveTextContent(
			ROUTES.voltDownload
		);
	});
});
