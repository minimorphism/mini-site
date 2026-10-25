// Copyright (c) 2026 minimorphism
// License GPLv3

import styles from "./ScrollHint.module.scss";

interface ScrollHintProps {
	label?: string;
}

const ScrollHint = ({ label = "SCROLL TO EXPLORE" }: ScrollHintProps) => {
	return (
		<div className={styles.scrollHint}>
			<span className={styles.label}>{label}</span>
		</div>
	);
};

export default ScrollHint;
