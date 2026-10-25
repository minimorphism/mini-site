// Copyright (c) 2026 minimorphism
// License GPlv3

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import VOLT from "../../pages/VOLT/VOLT";
import useSectionController from "../hooks/useSectionController";
import { ROUTES, SECTION_COUNTS } from "../routeConfig";

const VOLTRoute = () => {
	const navigate = useNavigate();
	const sectionController = useSectionController(SECTION_COUNTS.volt);

	const goToVOLT = useCallback(() => navigate(ROUTES.volt), [navigate]);
	const goToVOLTDownload = useCallback(
		() => navigate(ROUTES.voltDownload),
		[navigate]
	);
	const goHome = useCallback(() => navigate(ROUTES.home), [navigate]);

	return (
		<VOLT
			{...sectionController}
			onGoToVOLT_Download={goToVOLTDownload}
			onLogoClick={goHome}
		/>
	);
};

export default VOLTRoute;
