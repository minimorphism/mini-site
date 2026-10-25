// Copyright (c) 2026 minimorphism
// License GPLv3

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

jest.mock("./router/GlobalRouter", () => ({
	__esModule: true,
	default: () => <div data-testid="global-router" />,
}));

describe("App", () => {
	it("should render GlobalRouter", () => {
		render(<App />);

		expect(screen.getByTestId("global-router")).toBeInTheDocument();
	});

	it("should render GlobalRouter only once", () => {
		render(<App />);

		expect(screen.getAllByTestId("global-router")).toHaveLength(1);
	});
});
