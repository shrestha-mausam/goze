'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import React from 'react';
// Import FontAwesome
import { logoutUser } from '@/lib/api.client';
import { ErrRespFromBackend } from '@/lib/types';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
    faChartBar,
    faChartPie,
    faCircleExclamation,
    faGear,
    faHome,
    faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Sidebar: React.FC = () => {
    const { themeType } = useTheme();
    const router = useRouter();
    const toast = React.useRef<Toast>(null);

    const showComingSoon = (feature: string) => {
        toast.current?.show({
            severity: 'info',
            summary: 'Coming Soon',
            detail: `${feature} feature is coming soon!`,
            life: 3000,
        });
    };

    const showErrorToast = (message: string) => {
        toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000,
        });
    };

    const showSuccessToast = (message: string) => {
        toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: message,
            life: 3000,
        });
    };

    // Define the sidebar border style based on theme
    const sidebarStyle = {
        width: '80px',
        height: '100vh',
        position: 'fixed' as const,
        left: 0,
        top: 0,
        zIndex: 999,
        borderRight:
            themeType === 'dark' ? '1px solid var(--primary-color)' : 'none',
    };

    // Conditional button that uses PrimeReact icons in light mode and FontAwesome in dark mode
    const IconButton = ({
        primeIcon,
        faIcon,
        tooltip,
        onClick,
    }: {
        primeIcon: string;
        faIcon: IconDefinition;
        tooltip: string;
        onClick: () => void;
    }) => {
        if (themeType === 'dark') {
            return (
                <Button
                    className="p-button-rounded p-button-text text-white"
                    tooltip={tooltip}
                    tooltipOptions={{ position: 'right' }}
                    onClick={onClick}
                >
                    <FontAwesomeIcon
                        icon={faIcon}
                        style={{
                            color: 'var(--primary-color)',
                            fontSize: '1rem', // Smaller size to match PrimeReact icons
                            width: '1rem',
                            height: '1rem',
                        }}
                    />
                </Button>
            );
        } else {
            return (
                <Button
                    icon={primeIcon}
                    className="p-button-rounded p-button-text"
                    tooltip={tooltip}
                    tooltipOptions={{ position: 'right' }}
                    onClick={onClick}
                />
            );
        }
    };

    const handleLogout = async () => {
        try {
            const response = await logoutUser();
            if (response.ok) {
                showSuccessToast('Logged out successfully');
                router.push('/login');
            } else {
                const errRespData =
                    (await response.json()) as ErrRespFromBackend;
                showErrorToast(errRespData.data.description);
            }
        } catch {
            showErrorToast('An error occurred during logout');
        }
    };

    return (
        <>
            <Toast ref={toast} />

            {/* Permanent Sidebar */}
            <div
                className={`sidebar-menu flex flex-column justify-content-between ${themeType === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}
                style={sidebarStyle}
            >
                {/* Top Section - 80% height */}
                <div
                    className="sidebar-top flex flex-column align-items-center pt-5"
                    style={{ height: '80%' }}
                >
                    {/* App Logo - Keep PrimeIcon for wallet in both modes */}
                    <div className="app-logo mb-5 flex align-items-center justify-content-center">
                        <i className="pi pi-wallet text-3xl text-primary"></i>
                    </div>

                    {/* Divider between logo and menu items */}
                    <div
                        className={`w-75 mb-5 ${themeType === 'dark' ? 'border-top-1 border-gray-800' : 'border-top-1 border-300'}`}
                    ></div>

                    {/* Menu Items - Conditional icons based on theme */}
                    <div className="menu-items flex flex-column gap-4">
                        <IconButton
                            primeIcon="pi pi-home"
                            faIcon={faHome}
                            tooltip="Home"
                            onClick={() => router.push('/home')}
                        />
                        <IconButton
                            primeIcon="pi pi-chart-pie"
                            faIcon={faChartPie}
                            tooltip="Budgets"
                            onClick={() => showComingSoon('Budgets')}
                        />
                        <IconButton
                            primeIcon="pi pi-chart-bar"
                            faIcon={faChartBar}
                            tooltip="Reports"
                            onClick={() => router.push('/reports')}
                        />
                        <IconButton
                            primeIcon="pi pi-cog"
                            faIcon={faGear}
                            tooltip="Settings"
                            onClick={() => showComingSoon('Settings')}
                        />
                    </div>
                </div>

                {/* Bottom Section - 20% height */}
                <div
                    className="sidebar-bottom flex flex-column align-items-center pb-5"
                    style={{ height: '20%' }}
                >
                    <div className="menu-items flex flex-column gap-4">
                        <IconButton
                            primeIcon="pi pi-exclamation-circle"
                            faIcon={faCircleExclamation}
                            tooltip="Report Issue"
                            onClick={() => showComingSoon('Report Issue')}
                        />
                        <IconButton
                            primeIcon="pi pi-sign-out"
                            faIcon={faRightFromBracket}
                            tooltip="Logout"
                            onClick={handleLogout}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
