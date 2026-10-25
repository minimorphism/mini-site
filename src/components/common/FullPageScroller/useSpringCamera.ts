// Copyright (c) 2026 minimorphism
// License GPLv3

import { useCallback, useEffect, useRef } from "react";
import type { CSSProperties, RefObject } from "react";
import { forceWebGLRender } from "@minimorphism/mds-ui";

const SPRING_STIFFNESS = 0.07;
const SPRING_DAMPING = 0.48;
const MAX_VELOCITY = 0.07;
const POSITION_EPSILON = 0.001;
const VELOCITY_EPSILON = 0.05;

const WEBGL_TRANSITION_DURATION = 1400;

interface UseSpringCameraResult {
	initialCameraStyle: CSSProperties;
}

export const useSpringCamera = (
	currentSection: number,
	cameraElement: RefObject<HTMLDivElement | null>
): UseSpringCameraResult => {
	const cameraPosition = useRef(currentSection);
	const cameraVelocity = useRef(0);
	const cameraTarget = useRef(currentSection);
	const rafId = useRef<number | null>(null);

	const startAnimation = useCallback(() => {
		if (rafId.current !== null) {
			return;
		}

		const animate = () => {
			const position = cameraPosition.current;
			const target = cameraTarget.current;
			let velocity = cameraVelocity.current;

			const distance = target - position;
			const springForce = distance * SPRING_STIFFNESS;

			velocity += springForce;
			velocity *= SPRING_DAMPING;
			velocity = Math.max(
				-MAX_VELOCITY,
				Math.min(MAX_VELOCITY, velocity)
			);

			let nextPosition = position + velocity;

			if (
				Math.abs(distance) < POSITION_EPSILON &&
				Math.abs(velocity) < VELOCITY_EPSILON
			) {
				nextPosition = target;
				velocity = 0;
			}

			cameraPosition.current = nextPosition;
			cameraVelocity.current = velocity;

			if (cameraElement.current) {
				const y = -nextPosition * 100;
				cameraElement.current.style.transform = `translate3d(0, ${y}dvh, 0)`;
			}

			const isSettled =
				Math.abs(target - nextPosition) < POSITION_EPSILON &&
				Math.abs(velocity) < VELOCITY_EPSILON;

			if (isSettled) {
				cameraPosition.current = target;
				cameraVelocity.current = 0;

				if (cameraElement.current) {
					cameraElement.current.style.transform = `translate3d(0, ${-target * 100}dvh, 0)`;
				}

				rafId.current = null;
				return;
			}

			rafId.current = window.requestAnimationFrame(animate);
		};

		rafId.current = window.requestAnimationFrame(animate);
	}, [cameraElement]);

	useEffect(() => {
		cameraTarget.current = currentSection;

		forceWebGLRender(WEBGL_TRANSITION_DURATION, true);
		startAnimation();
	}, [currentSection, startAnimation]);

	useEffect(() => {
		return () => {
			if (rafId.current !== null) {
				window.cancelAnimationFrame(rafId.current);
				rafId.current = null;
			}
		};
	}, []);

	const initialCameraStyle = useRef<CSSProperties>({
		transform: `translate3d(0, ${-currentSection * 100}dvh, 0)`,
	}).current;

	return {
		initialCameraStyle,
	};
};
