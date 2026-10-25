// Copyright (c) 2026 minimorphism
// License GPLv3

import { useRef } from "react";
import { useTranslation } from "react-i18next";

import styles from "./VOLT_IDSection.module.scss";
import { Icons } from "../../common/Icons/Icons";

import MoveImage from "../../common/MoveImage/MoveImage";
import Footer from "../../common/Footer/Footer";

import { Button, Box, Typography } from "@minimorphism/mds-ui";

interface VOLT_IDSectionProps {
	onPrev: () => void;
	onVOLT_Download: () => void;
}

const VOLT_IDSection = ({ onPrev, onVOLT_Download }: VOLT_IDSectionProps) => {
	const { t } = useTranslation();

	return (
		<section className={styles.section}>
			<MoveImage
				className={styles.image}
				image="/images/volt_id_phone.webp"
			/>

			<div className={styles.content}>
				<div className={styles.icon}>
					<Icons.VOLT_IDLogo />
				</div>
				<Typography
					weight="light"
					align="center"
					className={styles.title}
				>
					{t("volt.volt-id.title")}
				</Typography>

				<Box variant="white" className={styles.descriptionBox}>
					<Typography align="center" className={styles.description}>
						{t("volt.volt-id.desc")}
					</Typography>
				</Box>

				<Button
					variant="black"
					type="button"
					className={styles.downloadBtn}
					onClick={onVOLT_Download}
				>
					{t("volt.volt-id.btn")}
				</Button>
			</div>

			<Footer />
		</section>
	);
};

export default VOLT_IDSection;
