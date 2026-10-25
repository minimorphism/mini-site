
import { useEffect, useRef } from "react";
import { initWebGL, WebGLCanvas } from "@minimorphism/mds-ui";

import "@minimorphism/mds-ui/dist/index.css";

const DPR_LIMITS = {
	lowEndMobile: 1.2,
	mobile: 1.2,
	lowEndDesktop: 1.2,
} as const;

type NavigatorWithHints = Navigator & {
	deviceMemory?: number;
	connection?: {
		effectiveType?: string;
		saveData?: boolean;
	};
};

function getMaxDpr(): number {
	const nav = navigator as NavigatorWithHints;
	const userAgent = nav.userAgent || "";

	const hasCoarsePointer =
	typeof window.matchMedia === "function" &&
	window.matchMedia("(pointer: coarse)").matches;

	const isMobile =
	/Android|iPhone|iPad|iPod|Mobile|IEMobile/i.test(userAgent) ||
	(nav.maxTouchPoints > 1 && hasCoarsePointer);

	const lowMemory =
	typeof nav.deviceMemory === "number" &&
	nav.deviceMemory <= 4;

	const fewCores =
	typeof nav.hardwareConcurrency === "number" &&
	nav.hardwareConcurrency > 0 &&
	nav.hardwareConcurrency <= 4;

	const connection = nav.connection;

	const dataSaver =
	connection?.saveData === true ||
	connection?.effectiveType === "slow-2g" ||
	connection?.effectiveType === "2g";

	const knownBudgetDevice = /\bitel\b/i.test(userAgent);

	const isLowEnd =
	lowMemory ||
	fewCores ||
	dataSaver ||
	knownBudgetDevice;

	if (isMobile) {
		return isLowEnd
		? DPR_LIMITS.lowEndMobile
		: DPR_LIMITS.mobile;
	}

	if (isLowEnd) {
		return DPR_LIMITS.lowEndDesktop;
	}

	return Number.POSITIVE_INFINITY;
}

function installDprLimit(maxDpr: number): () => void {
	if (!Number.isFinite(maxDpr)) {
		return () => {};
	}

	const ownDescriptor = Object.getOwnPropertyDescriptor(
		window,
		"devicePixelRatio"
	);

	const prototype = Object.getPrototypeOf(window) as Window | null;

	const nativeGetter =
	Object.getOwnPropertyDescriptor(
		prototype,
		"devicePixelRatio"
	)?.get ??
	Object.getOwnPropertyDescriptor(
		Window.prototype,
		"devicePixelRatio"
	)?.get;

	const initialDpr = window.devicePixelRatio || 1;

	const readNativeDpr = (): number => {
		try {
			let value: unknown;

			if (ownDescriptor?.get) {
				value = ownDescriptor.get.call(window);
			} else if (
				ownDescriptor &&
				"value" in ownDescriptor
			) {
				value = ownDescriptor.value;
			} else if (nativeGetter) {
				value = nativeGetter.call(window);
			} else {
				value = initialDpr;
			}

			return typeof value === "number" &&
			Number.isFinite(value) &&
			value > 0
			? value
			: initialDpr;
		} catch {
			return initialDpr;
		}
	};

	const cappedGetter = () =>
	Math.min(readNativeDpr(), maxDpr);

	try {
		Object.defineProperty(window, "devicePixelRatio", {
			configurable: true,
			enumerable: ownDescriptor?.enumerable ?? true,
			get: cappedGetter,
		});
	} catch (error) {
		console.warn(
			"[MDSRuntime] Could not limit devicePixelRatio.",
			error
		);

		return () => {};
	}

	return () => {
		const currentDescriptor = Object.getOwnPropertyDescriptor(
			window,
			"devicePixelRatio"
		);

		if (currentDescriptor?.get !== cappedGetter) {
			return;
		}

		if (ownDescriptor) {
			Object.defineProperty(
				window,
				"devicePixelRatio",
				ownDescriptor
			);
		} else {
			Reflect.deleteProperty(window, "devicePixelRatio");
		}
	};
}

function isMdsCanvas(canvas: HTMLCanvasElement): boolean {
	const style = canvas.style;

	return (
		canvas.isConnected &&
		canvas.parentElement === document.body &&
		style.position === "fixed" &&
		style.pointerEvents === "none" &&
		style.zIndex === "-1" &&
		style.width === "100%" &&
		style.height === "100%"
	);
}

function installCanvasOptimizations(): () => void {
	const canvasPrototype = HTMLCanvasElement.prototype;
	const originalGetContext = canvasPrototype.getContext;

	type GetContextShim = (
		this: HTMLCanvasElement,
		contextId: string,
		...args: unknown[]
	) => unknown;

	const callOriginal =
	originalGetContext as unknown as GetContextShim;

	const patchedGetContext: GetContextShim = function (
		this: HTMLCanvasElement,
		contextId: string,
		...args: unknown[]
	): unknown {
		if (
			contextId === "webgl" &&
			isMdsCanvas(this)
		) {
			const suppliedOptions = args[0];

			const options: WebGLContextAttributes =
			suppliedOptions !== null &&
			typeof suppliedOptions === "object"
			? suppliedOptions as WebGLContextAttributes
			: {};

			args[0] = {
				...options,
				antialias: false,
			};
		}

		return callOriginal.call(this, contextId, ...args);
	};

	canvasPrototype.getContext =
	patchedGetContext as unknown as typeof canvasPrototype.getContext;

	return () => {
		if (
			canvasPrototype.getContext ===
			(patchedGetContext as unknown as typeof canvasPrototype.getContext)
		) {
			canvasPrototype.getContext = originalGetContext;
		}
	};
}

const MDSRuntime = () => {
	const initialized = useRef(false);

	useEffect(() => {
		const maxDpr = getMaxDpr();

		const restoreDpr = installDprLimit(maxDpr);
		const restoreCanvas = installCanvasOptimizations();

		if (!initialized.current) {
			initWebGL();
			initialized.current = true;
		}

		return () => {
			restoreCanvas();
			restoreDpr();
		};
	}, []);

	return <WebGLCanvas />;
};

export default MDSRuntime;
