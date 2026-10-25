// Copyright (c) 2026 minimorphism
// License GPLv3

import { useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useSpringCamera } from "./useSpringCamera";

import styles from "./FullPageScroller.module.scss";

interface FullPageScrollerProps {
	currentSection: number;
	onGoToSection: (index: number) => void;
	sections: ReactNode[];
}

const FullPageScroller = ({
	currentSection,
	onGoToSection,
	sections,
}: FullPageScrollerProps) => {
	const cameraElement = useRef<HTMLDivElement | null>(null);
	const { initialCameraStyle } = useSpringCamera(
		currentSection,
		cameraElement
	);

	const sceneHeight = `${sections.length * 100}dvh`;

	const cameraStyle: CSSProperties = {
		...initialCameraStyle,
		height: sceneHeight,
	};

	return (
		<main className={styles.main}>
			<div className={styles.viewport}>
				<div
					ref={cameraElement}
					className={styles.camera}
					style={cameraStyle}
				>
					<div
						className={styles.scene}
						style={{ height: sceneHeight }}
					>
						{sections.map((section, index) => (
							<section key={index} className={styles.section}>
								{section}
							</section>
						))}
					</div>
				</div>

				<nav
					className={styles.progress}
					aria-label="Section navigation"
				>
					{sections.map((_, index) => (
						<button
							key={index}
							type="button"
							aria-label={`Section ${index + 1}`}
							aria-current={
								currentSection === index ? "step" : undefined
							}
							className={`
                ${styles.progressDot}
                ${currentSection === index ? styles.progressDotActive : ""}
                `}
							onClick={() => onGoToSection(index)}
						/>
					))}
				</nav>
			</div>
		</main>
	);
};

export default FullPageScroller;
