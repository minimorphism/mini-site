// Copyright (c) 2026 minimorphism
// License GPLv3

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";

jest.mock("./layout/RouterLayout", () => {
	const { Outlet } = jest.requireActual("react-router-dom");

	return {
		__esModule: true,
		default: () => (
			<div data-testid="router-layout">
				<Outlet />
			</div>
		),
	};
});

jest.mock("./routes/MainRoute", () => ({
	__esModule: true,
	default: () => <div data-testid="main-route">Main Route</div>,
}));

jest.mock("./routes/VOLTRoute", () => ({
	__esModule: true,
	default: () => <div data-testid="volt-route">VOLT Route</div>,
}));

jest.mock("./routes/VOLT_DownloadRoute", () => ({
	__esModule: true,
	default: () => (
		<div data-testid="volt-download-route">VOLT Download Route</div>
	),
}));

jest.mock("./routes/MDS_UIRoute", () => ({
	__esModule: true,
	default: () => <div data-testid="mds-ui-route">MDS UI Route</div>,
}));

const renderAt = (path: string) =>
	render(
		<MemoryRouter
			initialEntries={[path]}
			future={{
				v7_relativeSplatPath: true,
				v7_startTransition: true,
			}}
		>
			<AppRoutes />
		</MemoryRouter>
	);

describe("AppRoutes", () => {
	it("renders the main route at the root path", () => {
		renderAt("/");

		expect(screen.getByTestId("main-route")).toBeInTheDocument();
	});

	it("renders the VOLT route", () => {
		renderAt("/volt");

		expect(screen.getByTestId("volt-route")).toBeInTheDocument();
	});

	it("renders the VOLT download route", () => {
		renderAt("/volt-download");

		expect(screen.getByTestId("volt-download-route")).toBeInTheDocument();
	});

	it("renders the MDS UI route", () => {
		renderAt("/mds-ui");

		expect(screen.getByTestId("mds-ui-route")).toBeInTheDocument();
	});

	it("renders RouterLayout for the main route", () => {
		renderAt("/");

		expect(screen.getByTestId("router-layout")).toBeInTheDocument();
	});

	it("renders RouterLayout for the VOLT route", () => {
		renderAt("/volt");

		expect(screen.getByTestId("router-layout")).toBeInTheDocument();
	});

	it("redirects an unknown path to the main route", () => {
		renderAt("/unknown-path");

		expect(screen.getByTestId("main-route")).toBeInTheDocument();
	});

	it("does not render other routes when the main route is active", () => {
		renderAt("/");

		expect(screen.getByTestId("main-route")).toBeInTheDocument();
		expect(screen.queryByTestId("volt-route")).not.toBeInTheDocument();
		expect(
			screen.queryByTestId("volt-download-route")
		).not.toBeInTheDocument();
		expect(screen.queryByTestId("mds-ui-route")).not.toBeInTheDocument();
	});
});
