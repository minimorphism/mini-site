// Copyright (c) 2026 minimorphism
// License GPLv3

import { StrictMode } from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { initWebGL } from "@minimorphism/mds-ui";
import MDSRuntime from "./MDSRuntime";

jest.mock("@minimorphism/mds-ui", () => ({
	initWebGL: jest.fn(),
	WebGLCanvas: () => <div data-testid="webgl-canvas" />,
}));

jest.mock("@minimorphism/mds-ui/dist/index.css", () => ({}));

describe("MDSRuntime", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders WebGLCanvas", () => {
		render(<MDSRuntime />);

		expect(screen.getByTestId("webgl-canvas")).toBeInTheDocument();
	});

	it("initializes WebGL on mount", () => {
		render(<MDSRuntime />);

		expect(initWebGL).toHaveBeenCalledTimes(1);
	});

	it("initializes WebGL only once in StrictMode", () => {
		render(
			<StrictMode>
				<MDSRuntime />
			</StrictMode>
		);

		expect(initWebGL).toHaveBeenCalledTimes(1);
	});

	it("keeps WebGLCanvas rendered after rerender", () => {
		const { rerender } = render(<MDSRuntime />);

		rerender(<MDSRuntime />);

		expect(screen.getByTestId("webgl-canvas")).toBeInTheDocument();
		expect(initWebGL).toHaveBeenCalledTimes(1);
	});
});
