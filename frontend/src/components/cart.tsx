import React from "react";
import { useSweets } from "../hooks/use-sweet";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";

interface CartProps {
	onBack: () => void;
}

const Cart: React.FC<CartProps> = ({ onBack }) => {
	const { cart, updateCartQuantity, removeFromCart, purchaseCart } =
		useSweets();

	const total = cart.reduce(
		(sum, item) => sum + item.sweet.price * item.quantity,
		0
	);

	const handlePurchase = () => {
		purchaseCart();
		onBack();
	};

	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="flex items-center mb-8">
				<button
					onClick={onBack}
					className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 mr-4 border border-pink-100"
				>
					<ArrowLeft className="h-5 w-5 text-gray-600" />
				</button>
				<div>
					<h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
						Shopping Cart
					</h1>
					<p className="text-gray-600 mt-2">
						{cart.length} {cart.length === 1 ? "item" : "items"} in
						your cart
					</p>
				</div>
			</div>

			{cart.length === 0 ? (
				<div className="text-center py-16">
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 border border-pink-100 max-w-md mx-auto">
						<div className="text-6xl mb-4">🛒</div>
						<h3 className="text-xl font-semibold text-gray-800 mb-2">
							Your cart is empty
						</h3>
						<p className="text-gray-600 mb-6">
							Add some delicious sweets to get started!
						</p>
						<button
							onClick={onBack}
							className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
						>
							Continue Shopping
						</button>
					</div>
				</div>
			) : (
				<div className="space-y-6">
					{/* Cart Items */}
					<div className="space-y-4">
						{cart.map((item) => (
							<div
								key={item.sweet.id}
								className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-pink-100"
							>
								<div className="flex items-center space-x-4">
									<img
										src={item.sweet.image}
										alt={item.sweet.name}
										className="w-20 h-20 object-cover rounded-xl"
									/>

									<div className="flex-1">
										<h3 className="text-lg font-semibold text-gray-800">
											{item.sweet.name}
										</h3>
										<p className="text-gray-600 text-sm">
											${item.sweet.price.toFixed(2)} each
										</p>
										<p className="text-pink-600 font-semibold">
											$
											{(
												item.sweet.price * item.quantity
											).toFixed(2)}
										</p>
									</div>

									<div className="flex items-center space-x-3">
										<button
											onClick={() =>
												updateCartQuantity(
													item.sweet.id,
													item.quantity - 1
												)
											}
											className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors duration-200"
										>
											<Minus className="h-4 w-4" />
										</button>
										<span className="text-lg font-semibold w-8 text-center">
											{item.quantity}
										</span>
										<button
											onClick={() =>
												updateCartQuantity(
													item.sweet.id,
													item.quantity + 1
												)
											}
											disabled={
												item.quantity >=
												item.sweet.quantity
											}
											className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg transition-colors duration-200"
										>
											<Plus className="h-4 w-4" />
										</button>
									</div>

									<button
										onClick={() =>
											removeFromCart(item.sweet.id)
										}
										className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors duration-200"
									>
										<Trash2 className="h-4 w-4" />
									</button>
								</div>
							</div>
						))}
					</div>

					{/* Cart Summary */}
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-pink-100">
						<div className="flex items-center justify-between mb-6">
							<span className="text-xl font-semibold text-gray-800">
								Total: ${total.toFixed(2)}
							</span>
							<span className="text-sm text-gray-600">
								{cart.reduce(
									(sum, item) => sum + item.quantity,
									0
								)}{" "}
								items
							</span>
						</div>

						<div className="flex space-x-4">
							<button
								onClick={onBack}
								className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors duration-200"
							>
								Continue Shopping
							</button>
							<button
								onClick={handlePurchase}
								className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
							>
								<ShoppingBag className="h-5 w-5" />
								<span>Purchase</span>
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Cart;
