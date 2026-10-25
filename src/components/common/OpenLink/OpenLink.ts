// Copyright (c) 2026 minimorphism
// License GPLv3

export const openInNewTab = (url: string): void => {
	window.open(url, "_blank", "noopener,noreferrer");
};
