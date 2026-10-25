// Copyright (c) 2026 minimorphism
// License GPLv3

import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MoveImage from "./MoveImage";

jest.mock("./MoveImage.module.scss", () => ({
	visual: "visual",
	phoneScene: "phoneScene",
	phoneImage: "phoneImage",
}));

const mockRect = {
	left: 10,
	top: 20,
	width: 200,
	height: 100,
	right: 210,
	bottom: 120,
	x: 10,
	y: 20,
	toJSON: () => ({}),
};

describe("MoveImage", () => {
	const image = "/images/phone.png";

	const setup = (className?: string) => {
		const result = render(
			<MoveImage image={image} className={className} />
		);

		const scene =
			result.container.querySelector<HTMLDivElement>(".phoneScene");

		if (!scene) {
			throw new Error("Phone scene element was not rendered");
		}

		jest.spyOn(scene, "getBoundingClientRect").mockReturnValue(
			mockRect as DOMRect
		);

		return {
			...result,
			scene,
		};
	};

	it("renders the image", () => {
		setup();

		const imageElement = screen.getByRole("img", {
			name: "Move Image",
		});

		expect(imageElement).toBeInTheDocument();
		expect(imageElement).toHaveAttribute("src", image);
	});

	it("sets the image to be non-draggable", () => {
		setup();

		expect(screen.getByRole("img", { name: "Move Image" })).toHaveAttribute(
			"draggable",
			"false"
		);
	});

	it("renders the visual and phone scene elements", () => {
		const { container } = setup();

		expect(container.querySelector(".visual")).toBeInTheDocument();
		expect(container.querySelector(".phoneScene")).toBeInTheDocument();
	});

	it("applies the optional className to the visual container", () => {
		const { container } = setup("customVisual");

		expect(container.querySelector(".visual")).toHaveClass(
			"visual",
			"customVisual"
		);
	});

	it("renders without an optional className", () => {
		const { container } = setup();

		expect(container.querySelector(".visual")).toHaveClass("visual");
		expect(container.querySelector(".visual")).not.toHaveClass("undefined");
	});

	it("updates transform properties after multiple pointer movements", () => {
		const { scene } = setup();

		fireEvent.pointerMove(scene, {
			clientX: 210,
			clientY: 120,
		});

		fireEvent.pointerMove(scene, {
			clientX: 10,
			clientY: 20,
		});
	});
});
