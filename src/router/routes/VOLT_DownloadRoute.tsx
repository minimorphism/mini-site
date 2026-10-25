// Copyright (c) 2026 minimorphism
// License GPLv3

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import VOLT_Download from "../../pages/VOLT_Download/VOLT_Download";
import useSectionController from "../hooks/useSectionController";
import { ROUTES, SECTION_COUNTS } from "../routeConfig";

const VOLTDownloadRoute = () => {
	const navigate = useNavigate();
	const sectionController = useSectionController(SECTION_COUNTS.voltDownload);

	const goHome = useCallback(() => navigate(ROUTES.home), [navigate]);

	return <VOLT_Download {...sectionController} onLogoClick={goHome} />;
};

export default VOLTDownloadRoute;
