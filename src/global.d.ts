// Copyright (c) 2026 minimorphism
// License GPLv3

declare module "*.module.scss" {
	const classes: {
		readonly [key: string]: string;
	};

	export default classes;
}

declare module "*.scss";
