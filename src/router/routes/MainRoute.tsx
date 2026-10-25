// Copyright (c) 2026 minimorphism
// License GPLv3

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import Main from "../../pages/Main/Main";
import useSectionController from "../hooks/useSectionController";
import { ROUTES, SECTION_COUNTS } from "../routeConfig";

const MainRoute = () => {
	const navigate = useNavigate();
	const sectionController = useSectionController(SECTION_COUNTS.main);

	const goToVOLT = useCallback(() => navigate(ROUTES.volt), [navigate]);
	const goToMDS = useCallback(() => navigate(ROUTES.mdsUI), [navigate]);
	const goToVOLTDownload = useCallback(
		() => navigate(ROUTES.voltDownload),
		[navigate]
	);
	const goHome = useCallback(() => navigate(ROUTES.home), [navigate]);

	return (
		<Main
			{...sectionController}
			onGoToVOLT={goToVOLT}
			onGoToMDS={goToMDS}
			onGoToVOLT_Download={goToVOLTDownload}
			onLogoClick={goHome}
		/>
	);
};

export default MainRoute;
