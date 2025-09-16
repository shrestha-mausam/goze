'use client';

import React, { useEffect } from 'react';
import { Button } from 'primereact/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-column align-items-center justify-content-center min-h-screen p-4">
            <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
            <p className="text-xl mb-6">We apologize for the inconvenience.</p>
            <Button
                label="Try again"
                icon="pi pi-refresh"
                onClick={reset}
                className="p-button-raised"
            />
        </div>
    );
}
