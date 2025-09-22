import  { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import { useSweets } from "../hooks/use-sweet";
import { ShoppingCart, LogOut, User, Candy } from "lucide-react";

const DashboardLayout = ({}) => {
	const { user, logout, isAdmin } = useAuth();
	const { cart } = useSweets();
	const [showCart] = useState(false);

	const cartItemCount = cart.reduce(
		(total, item) => total + item.quantity,
		0
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
			{user && (
				<header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-pink-100">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between items-center h-16">
							<div className="flex items-center space-x-3">
								<div className="bg-gradient-to-r from-pink-400 to-purple-500 p-2 rounded-xl">
									<Candy className="h-6 w-6 text-white" />
								</div>
								<h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
									Sweet Shop
								</h1>
							</div>

							<div className="flex items-center space-x-4">
								<div className="flex items-center space-x-2 text-gray-700">
									<User className="h-4 w-4" />
									<span className="text-sm font-medium">
										{user.name}
									</span>
									{isAdmin && (
										<span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
											Admin
										</span>
									)}
								</div>

								{showCart && (
									<button
										// onClick={onCartClick}
										className="relative bg-gradient-to-r from-pink-500 to-purple-500 text-white p-2 rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
									>
										<ShoppingCart className="h-5 w-5" />
										{cartItemCount > 0 && (
											<span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
												{cartItemCount}
											</span>
										)}
									</button>
								)}

								<button
									onClick={logout}
									className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-xl transition-colors duration-200"
								>
									<LogOut className="h-5 w-5" />
								</button>
							</div>
						</div>
					</div>
				</header>
			)}

			<main className="flex-1">
				<Outlet />
			</main>
		</div>
	);
};

export default DashboardLayout;
