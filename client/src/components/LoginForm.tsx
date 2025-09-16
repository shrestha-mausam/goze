// LoginForm.tsx
import { loginUser } from '@/lib/api.client';
import { ErrRespDataToFrontend } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import React, { useEffect, useState } from 'react';

interface LoginFormProps {
    onLoginSuccess?: () => void;
}

export default function LoginForm() {
    const router = useRouter();

    // Login form state
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberedUsername, setRememberedUsername] = useState('');

    // Load remembered username and checkbox state when component mounts
    useEffect(() => {
        // Load remembered username
        const rememberedUsername = localStorage.getItem('rememberedUsername');
        if (rememberedUsername) {
            setUsername(rememberedUsername);
            setRememberedUsername(rememberedUsername);
        }

        // Load remembered checkbox state
        const rememberMeCheckbox = localStorage.getItem('rememberMeCheckbox');
        if (rememberMeCheckbox === 'true') {
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        if (username && password) {
            setLoading(true);
            setError('');

            // Save username if "Remember Me" is checked
            if (rememberMe) {
                localStorage.setItem('rememberedUsername', username);
                localStorage.setItem('rememberMeCheckbox', 'true');
            } else {
                localStorage.removeItem('rememberedUsername');
                localStorage.removeItem('rememberMeCheckbox');
            }

            try {
                const response = await loginUser(username, password);
                if (response.ok) {
                    router.push('/home'); // redirect to home page
                } else {
                    const errRespDataToClient =
                        (await response.json()) as ErrRespDataToFrontend;
                    setError(errRespDataToClient.description);
                }
            } catch (err) {
                setError('Network error occurred');
            } finally {
                setLoading(false);
            }
        }
    };

    // Handle checkbox change
    const handleRememberMeChange = (checked: boolean) => {
        setRememberMe(checked);
        // Immediately save the checkbox state when it changes
        if (checked) {
            localStorage.setItem('rememberMeCheckbox', 'true');
        } else {
            localStorage.removeItem('rememberMeCheckbox');
        }
    };

    // Handle "Forget Me" button click
    const handleForgetMe = () => {
        localStorage.removeItem('rememberedUsername');
        localStorage.removeItem('rememberMeCheckbox');
        setUsername('');
        setRememberMe(false);
        setRememberedUsername('');
    };

    return (
        <form onSubmit={handleSubmit} className="p-fluid">
            <div className="field mb-4">
                <label htmlFor="username" className="block mb-2">
                    Username
                </label>
                <InputText
                    id="username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={classNames({
                        'p-invalid': submitted && !username,
                    })}
                    placeholder="Enter your username"
                />
                {submitted && !username && (
                    <small className="p-error">Username is required.</small>
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
                    feedback={false}
                    placeholder="Enter your password"
                />
                {submitted && !password && (
                    <small className="p-error">Password is required.</small>
                )}
            </div>

            <div className="field-checkbox mb-4">
                <Checkbox
                    inputId="rememberMe"
                    checked={rememberMe}
                    onChange={(e) =>
                        handleRememberMeChange(e.checked as boolean)
                    }
                />
                <label htmlFor="rememberMe" className="ml-2">
                    Remember me
                </label>
            </div>

            {rememberedUsername && (
                <Button
                    label="Forget saved username"
                    className="p-button-text p-button-sm"
                    onClick={handleForgetMe}
                />
            )}

            {error && (
                <Message severity="error" text={error} className="mb-3" />
            )}

            <Button
                type="submit"
                label={loading ? 'Logging in...' : 'Login'}
                icon="pi pi-sign-in"
                disabled={loading}
                className="p-button-raised"
            />

            <div className="mt-3 text-center">
                <Button
                    label="Forgot password?"
                    className="p-button-text p-button-sm p-0"
                    onClick={() =>
                        setError('Password reset functionality coming soon')
                    }
                />
            </div>
        </form>
    );
}
