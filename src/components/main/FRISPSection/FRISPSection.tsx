// Copyright (c) 2026 minimorphism
// License GPLv3

import { useRef } from "react";
import { useTranslation } from "react-i18next";

import styles from "./FRISPSection.module.scss";
import Footer from "../../common/Footer/Footer";
import MoveImage from "../../common/MoveImage/MoveImage";
import { Button, Typography } from "@minimorphism/mds-ui";

interface FRISPSectionProps {
	onPrev: () => void;
}

const FRISPSection = ({ onPrev }: FRISPSectionProps) => {
	const { t } = useTranslation();

	return (
		<section className={styles.section}>
			<div className={styles.content}>
				<Typography
					variant="h1"
					weight="light"
					className={styles.title}
				>
					FRISP
				</Typography>

				<Button
					variant="black"
					type="button"
					className={styles.comingBtn}
				>
					{t("main.frisp.btn")}
				</Button>
			</div>

			<MoveImage
				image="/images/frisp_phone.webp"
				className={styles.image}
			/>

			<Footer />
		</section>
	);
};

export default FRISPSection;
