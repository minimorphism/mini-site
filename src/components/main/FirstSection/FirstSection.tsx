// Copyright (c) 2026 minimorphism
// License GPLv3

import { useRef } from "react";
import { useTranslation } from "react-i18next";

import styles from "./FirstSection.module.scss";

import Header from "../../common/Header/Header";
import MoveImage from "../../common/MoveImage/MoveImage";

import { Button, Typography } from "@minimorphism/mds-ui";

interface FirstSectionProps {
	onNext: () => void;
	onVolt: () => void;
	onVOLT_Download: () => void;
	onLogoClick?: () => void;
}

const FirstSection = ({
	onNext,
	onVolt,
	onVOLT_Download,
	onLogoClick,
}: FirstSectionProps) => {
	const { t } = useTranslation();

	return (
		<section className={styles.section}>
			<Header variant="black" onLogoClick={onLogoClick} />

			<div className={styles.content}>
				<Typography
					variant="h1"
					weight="light"
					align="center"
					className={styles.title}
				>
					VOLT
				</Typography>

				<div className={styles.actions}>
					<Button
						variant="black"
						type="button"
						className={styles.learnMoreBtn}
						onClick={onVolt}
					>
						{t("main.first.first-btn")}
					</Button>

					<Button
						variant="black"
						type="button"
						className={styles.downloadBtn}
						onClick={onVOLT_Download}
					>
						{t("main.first.second-btn")}
					</Button>
				</div>
			</div>

			<MoveImage image={"/images/phone.webp"} className={styles.image} />
		</section>
	);
};

export default FirstSection;
