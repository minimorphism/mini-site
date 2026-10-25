// Copyright (c) 2026 minimorphism
// License GPLv3

import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";

const GlobalRouter = () => (
	<BrowserRouter
		future={{
			v7_relativeSplatPath: true,
			v7_startTransition: true,
		}}
	>
		<AppRoutes />
	</BrowserRouter>
);

export default GlobalRouter;
