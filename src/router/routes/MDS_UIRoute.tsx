// Copyright (c) 2026 minimorphism
// License GPLv3

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import MDS_UI from "../../pages/MDS_UI/MDS_UI";
import useSectionController from "../hooks/useSectionController";
import { ROUTES, SECTION_COUNTS } from "../routeConfig";

const MDS_UIRoute = () => {
	const navigate = useNavigate();
	const sectionController = useSectionController(SECTION_COUNTS.mdsUI);

	const goToVOLT = useCallback(() => navigate(ROUTES.volt), [navigate]);
	const goHome = useCallback(() => navigate(ROUTES.home), [navigate]);

	return (
		<MDS_UI
			{...sectionController}
			onLogoClick={goHome}
		/>
	);
};

export default MDS_UIRoute;
