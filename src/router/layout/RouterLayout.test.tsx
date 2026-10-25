// Copyright (c) 2026 minimorphism
// License GPLv3

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import RouterLayout from "./RouterLayout";
import styles from "../GlobalRouter.module.scss";

jest.mock("../runtime/MDSRuntime", () => ({
	__esModule: true,
	default: () => <div data-testid="mds-runtime" />,
}));

jest.mock("../GlobalRouter.module.scss", () => ({
	router: "router",
}));

const renderWithRouter = () =>
	render(
		<MemoryRouter
			initialEntries={["/"]}
			future={{
				v7_relativeSplatPath: true,
				v7_startTransition: true,
			}}
		>
			<Routes>
				<Route path="/" element={<RouterLayout />}>
					<Route
						index
						element={
							<div data-testid="outlet-content">
								Outlet content
							</div>
						}
					/>
				</Route>
			</Routes>
		</MemoryRouter>
	);

describe("RouterLayout", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders the layout container", () => {
		renderWithRouter();

		expect(screen.getByTestId("outlet-content").parentElement).toHaveClass(
			styles.router
		);
	});

	it("renders MDSRuntime", () => {
		renderWithRouter();

		expect(screen.getByTestId("mds-runtime")).toBeInTheDocument();
	});

	it("renders the nested route through Outlet", () => {
		renderWithRouter();

		expect(screen.getByTestId("outlet-content")).toBeInTheDocument();
		expect(screen.getByText("Outlet content")).toBeInTheDocument();
	});

	it("renders MDSRuntime and nested route together", () => {
		renderWithRouter();

		expect(screen.getByTestId("mds-runtime")).toBeInTheDocument();
		expect(screen.getByTestId("outlet-content")).toBeInTheDocument();
	});

	it("renders only one MDSRuntime instance", () => {
		renderWithRouter();

		expect(screen.getAllByTestId("mds-runtime")).toHaveLength(1);
	});
});
