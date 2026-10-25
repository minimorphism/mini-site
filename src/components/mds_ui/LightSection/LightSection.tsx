// Copyright (c) 2026 minimorphism
// License GPLv3

import { useRef } from "react";
import { useTranslation } from "react-i18next";

import styles from "./LightSection.module.scss";
import { Box, Typography } from "@minimorphism/mds-ui";

interface LightSectionProps {
	onNext: () => void;
	onBack: () => void;
}

const LightSection = ({ onNext, onBack }: LightSectionProps) => {
	const { t } = useTranslation();

	return (
		<section className={styles.section}>
			<Typography weight="light" align="center" className={styles.title}>
				{t("mds-ui.light.title")}
			</Typography>

			<Typography
				weight="light"
				align="center"
				className={styles.description}
			>
				{t("mds-ui.light.desc")}
			</Typography>

			<div className={styles.row}>
				<Box variant="black" className={styles.blackBox}></Box>

				<Box variant="black" className={styles.anodizedBox}>
					<Box variant="anodized" className={styles.childBox}></Box>
				</Box>

				<Box variant="white" className={styles.whiteBox}></Box>
			</div>
		</section>
	);
};

export default LightSection;
