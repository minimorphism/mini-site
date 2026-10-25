// Copyright (c) 2026 minimorphism
// License GPLv3

import { Outlet } from "react-router-dom";

import MDSRuntime from "../runtime/MDSRuntime";
import styles from "../GlobalRouter.module.scss";

const RouterLayout = () => (
	<div className={styles.router}>
		<MDSRuntime />
		<Outlet />
	</div>
);

export default RouterLayout;
