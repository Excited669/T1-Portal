import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import styles from './MainLayout.module.css';

export default function MainLayout({ children }: { children?: ReactNode }) {
    return (
        <div className={styles.mainLayout}>
            <Outlet />
        </div>
    );
}