// Copyright (c) 2026 minimorphism
// License GPLv3

import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, useLocation } from "react-router-dom";

import MainRoute from "./MainRoute";
import useSectionController from "../hooks/useSectionController";
import { ROUTES, SECTION_COUNTS } from "../routeConfig";

jest.mock("../../pages/Main/Main", () => ({
	__esModule: true,
	default: (props: {
		onGoToVolt: () => void;
		onGoToMDS: () => void;
		onGoToVOLT_Download: () => void;
		onLogoClick: () => void;
		testValue: string;
	}) => (
		<div data-testid="main-page">
			<div data-testid="controller-data">{props.testValue}</div>

			<button type="button" onClick={props.onGoToVolt}>
				Go to VOLT
			</button>

			<button type="button" onClick={props.onGoToMDS}>
				Go to MDS
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
		testValue: "section-controller-data",
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
			<MainRoute />
			<LocationDisplay />
		</MemoryRouter>
	);

describe("MainRoute", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders the main page", () => {
		renderWithRouter();

		expect(screen.getByTestId("main-page")).toBeInTheDocument();
	});

	it("initializes the section controller with the correct section count", () => {
		renderWithRouter();

		expect(useSectionController).toHaveBeenCalledTimes(1);
		expect(useSectionController).toHaveBeenCalledWith(SECTION_COUNTS.main);
	});

	it("navigates to the VOLT route", () => {
		renderWithRouter();

		fireEvent.click(screen.getByRole("button", { name: "Go to VOLT" }));
	});

	it("navigates to the MDS UI route", () => {
		renderWithRouter();

		fireEvent.click(screen.getByRole("button", { name: "Go to MDS" }));

		expect(screen.getByTestId("current-location")).toHaveTextContent(
			ROUTES.mdsUI
		);
	});

	it("navigates to the VOLT download route", () => {
		renderWithRouter();

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

	it("renders the page when opened directly", () => {
		renderWithRouter(ROUTES.home);

		expect(screen.getByTestId("main-page")).toBeInTheDocument();
		expect(screen.getByTestId("current-location")).toHaveTextContent(
			ROUTES.home
		);
	});
});
