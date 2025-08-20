'use client';

import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import AppLayout from '@/components/AppLayout';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import AppInfo from '@/components/AppInfo';
import Topbar from '@/components/Topbar';
export default function Login() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  return (
    <AppLayout title="Login | Next.js App">
      <Topbar />
      <div className="flex h-screen">
        {/* Left Section - App Info - Removed gray background */}
        <div className="w-6 flex flex-column justify-content-start align-items-center p-5 pt-8">
          <AppInfo />
        </div>

        {/* Right Section - Login/Register Form - More subtle shadow */}
        <div className="w-6 flex align-items-start justify-content-center pt-8">
          <Card className={`w-full max-w-30rem shadow-2 m-3`}>
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
              <TabPanel header="Login">
                <LoginForm />
              </TabPanel>
              
              <TabPanel header="Register">
                <RegisterForm />
              </TabPanel>
            </TabView>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
} 