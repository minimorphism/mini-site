// Copyright (c) 2026 minimorphism
// License GPLv3

import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, useLocation } from "react-router-dom";

import VOLTRoute from "./VOLTRoute";
import useSectionController from "../hooks/useSectionController";
import { ROUTES, SECTION_COUNTS } from "../routeConfig";

jest.mock("../../pages/VOLT/VOLT", () => ({
	__esModule: true,
	default: (props: {
		currentSection: number;
		totalSections: number;
		onGoToVolt: () => void;
		onGoToVOLT_Download: () => void;
		onLogoClick: () => void;
	}) => (
		<div data-testid="volt-page">
			<div data-testid="section-data">
				{props.currentSection}/{props.totalSections}
			</div>

			<button type="button" onClick={props.onGoToVolt}>
				Go to VOLT
			</button>

			<button type="button" onClick={props.onGoToVOLT_Download}>
				Download VOLT
			</button>

			<button type="button" onClick={props.onLogoClick}>
				Home
			</button>
		</div>
	),
}));

jest.mock("../hooks/useSectionController", () => ({
	__esModule: true,
	default: jest.fn(() => ({
		currentSection: 2,
		totalSections: 4,
	})),
}));

const LocationDisplay = () => {
	const location = useLocation();

	return <div data-testid="current-location">{location.pathname}</div>;
};

const renderWithRouter = (initialPath: string = ROUTES.home) =>
	render(
		<MemoryRouter
			initialEntries={[initialPath]}
			future={{
				v7_relativeSplatPath: true,
				v7_startTransition: true,
			}}
		>
			<VOLTRoute />
			<LocationDisplay />
		</MemoryRouter>
	);

describe("VOLTRoute", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders the VOLT page", () => {
		renderWithRouter();

		expect(screen.getByTestId("volt-page")).toBeInTheDocument();
	});

	it("initializes the section controller with the correct section count", () => {
		renderWithRouter();

		expect(useSectionController).toHaveBeenCalledTimes(1);
		expect(useSectionController).toHaveBeenCalledWith(SECTION_COUNTS.volt);
	});

	it("navigates to the VOLT download route", () => {
		renderWithRouter(ROUTES.volt);

		fireEvent.click(screen.getByRole("button", { name: "Download VOLT" }));

		expect(screen.getByTestId("current-location")).toHaveTextContent(
			ROUTES.voltDownload
		);
	});

	it("navigates home when the logo is clicked", () => {
		renderWithRouter(ROUTES.volt);

		fireEvent.click(screen.getByRole("button", { name: "Home" }));

		expect(screen.getByTestId("current-location")).toHaveTextContent(
			ROUTES.home
		);
	});
});
