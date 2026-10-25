// Copyright (c) 2026 minimorphism
// License GPLv3

import { useRef } from "react";
import cx from "classnames";
import styles from "./MoveImage.module.scss";

interface MoveImageProps {
	image: string;
	className?: string;
}

const MoveImage = ({ image, className }: MoveImageProps) => {
	const phoneRef = useRef<HTMLDivElement>(null);
	const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
		const phone = phoneRef.current;

		if (!phone) {
			return;
		}

		const rect = phone.getBoundingClientRect();
		const mouseX = (event.clientX - rect.left) / rect.width;
		const mouseY = (event.clientY - rect.top) / rect.height;

		const x = (mouseX - 0.5) * 2;
		const y = (mouseY - 0.5) * 2;

		const rotateY = x * 4;
		const rotateX = y * -2;
		const skewX = x * 2;

		phone.style.setProperty("--rotate-x", `${rotateX}deg`);
		phone.style.setProperty("--rotate-y", `${rotateY}deg`);
		phone.style.setProperty("--skew-x", `${skewX}deg`);
	};

	const handlePointerLeave = () => {
		const phone = phoneRef.current;

		if (!phone) {
			return;
		}

		phone.style.setProperty("--rotate-x", "0deg");
		phone.style.setProperty("--rotate-y", "0deg");
		phone.style.setProperty("--skew-x", "0deg");
	};

	return (
		<div className={cx(styles.visual, className)}>
			<div
				ref={phoneRef}
				className={styles.phoneScene}
				onPointerMove={handlePointerMove}
				onPointerLeave={handlePointerLeave}
			>
				<img
					src={image}
					alt="Move Image"
					className={styles.phoneImage}
					draggable={false}
				/>
			</div>
		</div>
	);
};

export default MoveImage;
