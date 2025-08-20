import React from 'react';
import Link from 'next/link';
import { Button } from 'primereact/button';

export default function NotFound() {
  return (
    <div className="flex flex-column align-items-center justify-content-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-6">The page you are looking for does not exist.</p>
      <Link href="/" passHref>
        <Button label="Go Home" icon="pi pi-home" className="p-button-raised" />
      </Link>
    </div>
  );
} 