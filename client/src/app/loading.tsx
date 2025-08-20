import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function Loading() {
  return (
    <div className="flex justify-content-center align-items-center min-h-screen">
      <ProgressSpinner 
        style={{ width: '50px', height: '50px' }} 
        strokeWidth="4" 
        fill="var(--surface-ground)" 
        animationDuration=".5s" 
      />
    </div>
  );
} 