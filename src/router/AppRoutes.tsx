// Copyright (c) 2026 minimorphism
// License GPLv3

import { Navigate, Route, Routes } from "react-router-dom";

import RouterLayout from "./layout/RouterLayout";
import MainRoute from "./routes/MainRoute";
import MDSUIRoute from "./routes/MDS_UIRoute";
import VOLTRoute from "./routes/VOLTRoute";
import VOLTDownloadRoute from "./routes/VOLT_DownloadRoute";
import { ROUTES } from "./routeConfig";

const AppRoutes = () => (
	<Routes>
		<Route element={<RouterLayout />}>
			<Route path={ROUTES.home} element={<MainRoute />} />
			<Route path={ROUTES.volt} element={<VOLTRoute />} />
			<Route path={ROUTES.mdsUI} element={<MDSUIRoute />} />
			<Route path={ROUTES.voltDownload} element={<VOLTDownloadRoute />} />
			<Route path="*" element={<Navigate to={ROUTES.home} replace />} />
		</Route>
	</Routes>
);

export default AppRoutes;
