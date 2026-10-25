// Copyright (c) 2026 minimorphism
// License GPLv3

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import GlobalRouter from "./GlobalRouter";

jest.mock("./AppRoutes", () => {
	const { useLocation } = jest.requireActual("react-router-dom");

	return {
		__esModule: true,
		default: () => {
			const location = useLocation();

			return <div data-testid="app-routes">{location.pathname}</div>;
		},
	};
});

describe("GlobalRouter", () => {
	beforeEach(() => {
		window.history.replaceState({}, "", "/global-router-test");
	});

	afterEach(() => {
		window.history.replaceState({}, "", "/");
	});

	it("renders AppRoutes inside BrowserRouter", () => {
		render(<GlobalRouter />);

		expect(screen.getByTestId("app-routes")).toBeInTheDocument();
		expect(screen.getByTestId("app-routes")).toHaveTextContent(
			"/global-router-test"
		);
	});

	it("renders AppRoutes only once", () => {
		render(<GlobalRouter />);

		expect(screen.getAllByTestId("app-routes")).toHaveLength(1);
	});
});
