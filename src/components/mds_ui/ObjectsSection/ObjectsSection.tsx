// Copyright (c) 2026 minimorphism
// License GPLv3

import { useRef } from "react";
import { useTranslation } from "react-i18next";

import styles from "./ObjectsSection.module.scss";

import { Button, Typography } from "@minimorphism/mds-ui";

interface ObjectsSectionProps {
	onNext: () => void;
	onBack: () => void;
}

const ObjectsSection = ({ onNext, onBack }: ObjectsSectionProps) => {
	const { t } = useTranslation();

	return (
		<section className={styles.section}>
			<Typography color="black" align="center" className={styles.title}>
				{t("mds-ui.objects.title")}
			</Typography>

			<Typography
				color="black"
				align="center"
				className={styles.description}
			>
				{t("mds-ui.objects.desc")}
			</Typography>

			<img
				src="/images/widgets.webp"
				alt="MDS UI Widgets"
				className={styles.image}
			/>
		</section>
	);
};

export default ObjectsSection;
