// Copyright (c) 2026 minimorphism
// License GPLv3

export const ROUTES = {
	home: "/",
	volt: "/volt",
	mdsUI: "/mds-ui",
	voltDownload: "/volt-download",
} as const;

export const SECTION_COUNTS = {
	main: 3,
	volt: 4,
	mdsUI: 6,
	voltDownload: 4,
} as const;

export type AppRoutePath = (typeof ROUTES)[keyof typeof ROUTES];
