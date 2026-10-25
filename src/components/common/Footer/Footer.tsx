// Copyright (c) 2026 minimorphism
// License GPLv3

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Box, Button } from "@minimorphism/mds-ui";
import styles from "./Footer.module.scss";

export type FooterVariant = "black" | "white";

interface FooterProps {
	variant?: FooterVariant;
}

const Footer = ({ variant = "black" }: FooterProps) => {
	const [language, setLanguage] = useState<"EN" | "RU">("RU");
	const { t, i18n } = useTranslation();

	const toggleLanguage = () => {
		setLanguage((currentLanguage) =>
			currentLanguage === "RU" ? "EN" : "RU"
		);

		const newLang = i18n.language === "en" ? "ru" : "en";
		i18n.changeLanguage(newLang);
	};

	return (
		<footer className={styles.footer}>
			<Box
				variant={variant === "black" ? "black" : "anodized"}
				className={styles.footerBox}
			>
				<span className={styles.text}>
					Copyright © 2026 minimorphism.{" "}
					<a>{t("footer.copyrights")}</a>
				</span>

				<Button
					variant={variant === "black" ? "anodized" : "black"}
					type="button"
					className={styles.langBtn}
					onClick={toggleLanguage}
					aria-label={`Switch language to ${
						language === "EN" ? "Russian" : "English"
					}`}
				>
					{language}
				</Button>
			</Box>
		</footer>
	);
};

export default Footer;
