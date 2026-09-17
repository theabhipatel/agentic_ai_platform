import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth.api";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const data = await login({
                email,
                password,
            });

            localStorage.setItem(
                "accessToken",
                data.token
            );

            console.log("data ==>", data)

            navigate("/");
        } catch (error: any) {
            setError(
                error.response?.data?.error ||
                "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <div className="flex min-h-screen items-center justify-center px-4">

                <div className="w-full max-w-md">

                    {/* Logo */}
                    <div className="mb-8 flex flex-col items-center">

                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-2xl shadow-indigo-500/20">
                            <svg
                                width="25"
                                height="25"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 3v3" />
                                <path d="M12 18v3" />
                                <path d="M3 12h3" />
                                <path d="M18 12h3" />
                                <path d="m5.64 5.64 2.12 2.12" />
                                <path d="m16.24 16.24 2.12 2.12" />
                                <path d="m5.64 18.36 2.12-2.12" />
                                <path d="m16.24 7.76 2.12-2.12" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        </div>

                        <h1 className="text-xl font-semibold tracking-tight">
                            AI Agent
                        </h1>

                        <p className="mt-1 text-sm text-white/35">
                            Sign in to continue
                        </p>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border border-white/[0.08] bg-[#0d0d0d] p-6 shadow-2xl shadow-black/30">

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >

                            {/* Email */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-white/50">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="you@example.com"
                                    required
                                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-indigo-500/50 focus:bg-white/[0.04]"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-white/50">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="••••••••"
                                    required
                                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-indigo-500/50 focus:bg-white/[0.04]"
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="rounded-xl border border-red-500/10 bg-red-500/[0.05] px-3 py-2.5 text-xs text-red-400">
                                    {error}
                                </div>
                            )}

                            {/* Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="h-11 w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition hover:from-violet-400 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading
                                    ? "Signing in..."
                                    : "Sign in"}
                            </button>
                        </form>
                    </div>

                    {/* Signup */}
                    <p className="mt-6 text-center text-xs text-white/30">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-indigo-400 transition hover:text-indigo-300"
                        >
                            Create account
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Login;