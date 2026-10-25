// Copyright (c) 2026 minimorphism
// License GPLv3

import { useRef } from "react";
import { useTranslation } from "react-i18next";

import styles from "./FirstSection.module.scss";

import MoveImage from "../../common/MoveImage/MoveImage";
import Header from "../../common/Header/Header";

import { openInNewTab } from "../../common/OpenLink/OpenLink";
import { Button, Typography } from "@minimorphism/mds-ui";

interface FirstSectionProps {
	onNext: () => void;
	onLogoClick?: () => void;
}

const FirstSection = ({ onNext, onLogoClick }: FirstSectionProps) => {
	const { t } = useTranslation();

	return (
		<section className={styles.section}>
			<Header variant="black" onLogoClick={onLogoClick} />

			<MoveImage
				image="/images/download_phone.webp"
				className={styles.image}
			/>

			<div className={styles.content}>
				<Typography weight="light" className={styles.title}>
					VOLT
				</Typography>

				<div className={styles.actions}>
					<Button
						variant="black"
						type="button"
						className={styles.downloadBtn}
					>
						{t("volt-download.first.first-btn")}
					</Button>

					<Button
						variant="black"
						type="button"
						className={styles.forDevelopersBtn}
						onClick={() => openInNewTab("https://github.com/minimorphism")}
					>
						{t("volt-download.first.second-btn")}
					</Button>
				</div>
			</div>
		</section>
	);
};

export default FirstSection;
