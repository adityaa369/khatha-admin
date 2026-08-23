"use client";
import React, { useState } from 'react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await res.json();
            if (data.success) {
                window.location.href = '/';
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Please ensure backend is reachable.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">
            <div className="max-w-md w-full bg-white p-8 sm:p-10 border border-gray-200 rounded-xl shadow-2xl">
                
                <div className="flex justify-center mb-6">
                    {/* Brand Logo Placeholder */}
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">K</span>
                    </div>
                </div>

                <h1 className="text-2xl font-extrabold mb-2 text-center text-gray-900">Khatha Operations</h1>
                <p className="text-sm text-gray-500 text-center mb-8">Secure administrative access</p>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 text-sm" role="alert">
                        <p className="font-bold">Authentication Error</p>
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white focus:ring-2 focus:ring-black focus:border-black outline-none transition" 
                            placeholder="operator@khatha.app"
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Master Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white focus:ring-2 focus:ring-black focus:border-black outline-none transition" 
                            placeholder="••••••••"
                            required 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={"w-full bg-black text-white font-bold py-3 rounded-lg transition-colors " + (isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800')}
                    >
                        {isLoading ? 'Verifying Credentials...' : 'Authenticate'}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <p className="text-xs text-gray-400">
                        Protected by Khatha Zero-Trust Infrastructure.<br/>
                        Unauthorized access is strictly monitored.
                    </p>
                </div>
            </div>
        </div>
    );
}
