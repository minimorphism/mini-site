// Copyright (c) 2026 minimorphism
// License GPLv3

import { useTranslation } from "react-i18next";

import styles from "./FirstSection.module.scss";

import MoveImage from "../../common/MoveImage/MoveImage";
import Header from "../../common/Header/Header";

import { openInNewTab } from "../../common/OpenLink/OpenLink";
import { Button, Typography } from "@minimorphism/mds-ui";

const APK_DOWNLOAD_URL =
	"https://github.com/minimorphism/volt-wallet/releases/latest/download/VOLT.apk";

interface FirstSectionProps {
	onNext: () => void;
	onLogoClick?: () => void;
}

const FirstSection = ({ onNext, onLogoClick }: FirstSectionProps) => {
	const { t } = useTranslation();

	const handleDownload = () => {
		window.location.href = APK_DOWNLOAD_URL;
	};

	return (
		<section className={styles.section}>
			<Header variant="black" onLogoClick={onLogoClick} />

			<MoveImage
				image="./images/download_phone.webp"
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
						onClick={handleDownload}
					>
						{t("volt-download.first.first-btn")}
					</Button>

					<Button
						variant="black"
						type="button"
						className={styles.forDevelopersBtn}
						onClick={() =>
							openInNewTab("https://github.com/minimorphism")
						}
					>
						{t("volt-download.first.second-btn")}
					</Button>
				</div>
			</div>
		</section>
	);
};

export default FirstSection;
