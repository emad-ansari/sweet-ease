import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import { Candy, Mail, Lock, Eye, EyeOff } from "lucide-react";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error] = useState("");
	const [loading] = useState(false);
	const { } = useAuth();
	const navigate = useNavigate();
	const onLoging = async () => {
		navigate("/dashboard");
	};

	const fillDemo = (type: "admin" | "customer") => {
		if (type === "admin") {
			setEmail("admin@sweetshop.com");
			setPassword("admin123");
		} else {
			setEmail("customer@sweetshop.com");
			setPassword("customer123");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				<div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-pink-200">
					<div className="text-center mb-8">
						<div className="bg-gradient-to-r from-pink-400 to-purple-500 p-4 rounded-2xl inline-block mb-4">
							<Candy className="h-12 w-12 text-white" />
						</div>
						<h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
							Welcome Back
						</h2>
						<p className="text-gray-600 mt-2">
							Sign in to your sweet account
						</p>
					</div>

					{error && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
							{error}
						</div>
					)}

					<div className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Email Address
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
									placeholder="Enter your email"
									required
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Password
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
								<input
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
									placeholder="Enter your password"
									required
								/>
								<button
									type="button"
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5" />
									) : (
										<Eye className="h-5 w-5" />
									)}
								</button>
							</div>
						</div>

						<button
							type="submit"
							disabled={loading}
							onClick={() => onLoging()}
							className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Signing In..." : "Sign In"}
						</button>
					</div>

					<div className="mt-6 space-y-3">
						<div className="text-center text-sm text-gray-600">
							Demo Accounts:
						</div>
						<div className="flex space-x-2">
							<button
								onClick={() => fillDemo("admin")}
								className="flex-1 bg-purple-100 text-purple-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors duration-200"
							>
								Admin Demo
							</button>
							<button
								onClick={() => fillDemo("customer")}
								className="flex-1 bg-pink-100 text-pink-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-pink-200 transition-colors duration-200"
							>
								Customer Demo
							</button>
						</div>
					</div>

					<div className="mt-8 text-center">
						<p className="text-gray-600">
							Don't have an account?{" "}
							<Link
								to="/"
								className="text-pink-600 hover:text-pink-700 font-semibold transition-colors duration-200"
							>
								Sign up
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
