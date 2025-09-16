'use client';

import { registerUser } from '@/lib/api.client';
import { ErrRespFromBackend, RegisterRequest } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import React, { useState } from 'react';

interface RegisterFormProps {
    onRegisterSuccess?: () => void;
}

export default function RegisterForm() {
    const router = useRouter();

    // Register form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setSubmitted(true);

        if (
            firstName &&
            lastName &&
            username &&
            email &&
            password &&
            confirmPassword &&
            password === confirmPassword
        ) {
            setLoading(true);
            setError('');

            try {
                const userData: RegisterRequest = {
                    username: username,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                };

                const response = await registerUser(userData);

                if (response.ok) {
                    router.push('/home');
                } else {
                    const errRespData =
                        (await response.json()) as ErrRespFromBackend;
                    setError(errRespData.data.description);
                }
            } catch (err) {
                console.error('Registration error:', err);
                setError('An error occurred during registration');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-fluid"
            action="/api/auth/register"
            method="POST"
        >
            {error && (
                <Message severity="error" text={error} className="mb-3" />
            )}

            <div className="field mb-4">
                <label htmlFor="firstName" className="block mb-2">
                    First Name
                </label>
                <InputText
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={classNames({
                        'p-invalid': submitted && !firstName,
                    })}
                    placeholder="Enter your first name"
                />
                {submitted && !firstName && (
                    <small className="p-error">First name is required.</small>
                )}
            </div>

            <div className="field mb-4">
                <label htmlFor="lastName" className="block mb-2">
                    Last Name
                </label>
                <InputText
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={classNames({
                        'p-invalid': submitted && !lastName,
                    })}
                    placeholder="Enter your last name"
                />
                {submitted && !lastName && (
                    <small className="p-error">Last name is required.</small>
                )}
            </div>

            <div className="field mb-4">
                <label htmlFor="username" className="block mb-2">
                    Username
                </label>
                <InputText
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={classNames({
                        'p-invalid': submitted && !username,
                    })}
                    placeholder="Choose a username"
                />
                {submitted && !username && (
                    <small className="p-error">Username is required.</small>
                )}
            </div>

            <div className="field mb-4">
                <label htmlFor="email" className="block mb-2">
                    Email
                </label>
                <InputText
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={classNames({ 'p-invalid': submitted && !email })}
                    placeholder="Enter your email"
                />
                {submitted && !email && (
                    <small className="p-error">Email is required.</small>
                )}
            </div>

            <div className="field mb-4">
                <label htmlFor="password" className="block mb-2">
                    Password
                </label>
                <Password
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    toggleMask
                    className={classNames({
                        'p-invalid': submitted && !password,
                    })}
                    placeholder="Create a password"
                />
                {submitted && !password && (
                    <small className="p-error">Password is required.</small>
                )}
            </div>

            <div className="field mb-4">
                <label htmlFor="confirmPassword" className="block mb-2">
                    Confirm Password
                </label>
                <Password
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    toggleMask
                    feedback={false}
                    className={classNames({
                        'p-invalid':
                            submitted &&
                            (!confirmPassword || password !== confirmPassword),
                    })}
                    placeholder="Confirm your password"
                />
                {submitted && !confirmPassword && (
                    <small className="p-error">
                        Please confirm your password.
                    </small>
                )}
                {submitted &&
                    confirmPassword &&
                    password !== confirmPassword && (
                        <small className="p-error">
                            Passwords do not match.
                        </small>
                    )}
            </div>

            <Button
                type="submit"
                label={loading ? 'Registering...' : 'Register'}
                icon="pi pi-user-plus"
                disabled={loading}
                className="p-button-raised"
            />
        </form>
    );
}
