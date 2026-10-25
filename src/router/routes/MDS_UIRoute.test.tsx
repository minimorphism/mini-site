// Copyright (c) 2026 minimorphism
// License GPLv3

import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, useLocation } from "react-router-dom";

import MDSUIRoute from "./MDS_UIRoute";
import useSectionController from "../hooks/useSectionController";
import { ROUTES, SECTION_COUNTS } from "../routeConfig";

jest.mock("../../pages/MDS_UI/MDS_UI", () => ({
	__esModule: true,
	default: (props: {
		onGoToVolt: () => void;
		onLogoClick: () => void;
		testValue: string;
	}) => (
		<div data-testid="mds-ui-page">
			<div data-testid="controller-data">{props.testValue}</div>

			<button type="button" onClick={props.onGoToVolt}>
				Go to VOLT
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

const renderWithRouter = (initialPath: string = ROUTES.mdsUI) =>
	render(
		<MemoryRouter
			initialEntries={[initialPath]}
			future={{
				v7_relativeSplatPath: true,
				v7_startTransition: true,
			}}
		>
			<MDSUIRoute />
			<LocationDisplay />
		</MemoryRouter>
	);

describe("MDS_UIRoute", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders the MDS UI page", () => {
		renderWithRouter();

		expect(screen.getByTestId("mds-ui-page")).toBeInTheDocument();
	});

	it("initializes the section controller with the correct section count", () => {
		renderWithRouter();

		expect(useSectionController).toHaveBeenCalledTimes(1);
		expect(useSectionController).toHaveBeenCalledWith(SECTION_COUNTS.mdsUI);
	});

	it("navigates home when the logo is clicked", () => {
		renderWithRouter();

		fireEvent.click(screen.getByRole("button", { name: "Home" }));

		expect(screen.getByTestId("current-location")).toHaveTextContent(
			ROUTES.home
		);
	});

	it("renders the page when opened directly", () => {
		renderWithRouter(ROUTES.mdsUI);

		expect(screen.getByTestId("mds-ui-page")).toBeInTheDocument();
		expect(screen.getByTestId("current-location")).toHaveTextContent(
			ROUTES.mdsUI
		);
	});
});
