// Copyright (c) 2026 minimorphism
// License GPLv3

import { openInNewTab } from "./OpenLink";

describe("openInNewTab", () => {
	let windowOpenSpy: jest.SpyInstance;

	beforeEach(() => {
		windowOpenSpy = jest
			.spyOn(window, "open")
			.mockImplementation(() => null);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("opens the provided URL in a new tab", () => {
		openInNewTab("https://example.com");

		expect(windowOpenSpy).toHaveBeenCalledWith(
			"https://example.com",
			"_blank",
			"noopener,noreferrer"
		);
	});

	it("opens the URL only once", () => {
		openInNewTab("https://example.com");

		expect(windowOpenSpy).toHaveBeenCalledTimes(1);
	});

	it("passes the provided URL unchanged", () => {
		const url = "https://example.com/path?query=value&source=test";

		openInNewTab(url);

		expect(windowOpenSpy).toHaveBeenCalledWith(
			url,
			"_blank",
			"noopener,noreferrer"
		);
	});

	it("uses noopener and noreferrer for security", () => {
		openInNewTab("https://example.com");

		const [, target, features] = windowOpenSpy.mock.calls[0];

		expect(target).toBe("_blank");
		expect(features).toBe("noopener,noreferrer");
	});

	it("returns undefined", () => {
		const result = openInNewTab("https://example.com");

		expect(result).toBeUndefined();
	});
});
