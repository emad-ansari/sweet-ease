import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSweets } from "@/hooks/use-sweet";
import { sweetsAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Candy,
	Search,
	Filter,
	ShoppingCart,
	Plus,
	Edit,
	Trash2,
	Package,
	LogOut,
	Settings,
} from "lucide-react";

interface Sweet {
	id: string;
	name: string;
	category: string;
	price: number;
	quantity: number;
	createdAt: string;
	updatedAt: string;
	image?: string;
	description?: string;
}


function Dashboard() {
	const {isAdmin} = useAuth();
	const { sweets, loading, error, addSweet, updateSweet, deleteSweet } = useSweets();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [showAddForm, setShowAddForm] = useState(false);
	const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
	const [newSweet, setNewSweet] = useState<Partial<Sweet>>({
		name: "",
		category: "",
		price: 0,
		quantity: 0,
	});

	const categories = [
		"all",
		...Array.from(new Set(sweets.map((sweet) => sweet.category))),
	];

	const filteredSweets = sweets.filter((sweet) => {
		const matchesSearch =
			sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			sweet.category.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory =
			selectedCategory === "all" || sweet.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	const handleAddSweet = async () => {
		if (
			newSweet.name &&
			newSweet.category &&
			newSweet.price &&
			newSweet.quantity !== undefined
		) {
			try {
				await addSweet({
					name: newSweet.name,
					category: newSweet.category,
					price: newSweet.price,
					quantity: newSweet.quantity,
				});
				setNewSweet({
					name: "",
					category: "",
					price: 0,
					quantity: 0,
				});
				setShowAddForm(false);
			} catch (error) {
				console.error('Error adding sweet:', error);
			}
		}
	};

	const handleUpdateSweet = async () => {
		if (editingSweet) {
			try {
				await updateSweet(editingSweet.id, editingSweet);
				setEditingSweet(null);
			} catch (error) {
				console.error('Error updating sweet:', error);
			}
		}
	};

	const handleDeleteSweet = async (id: string) => {
		try {
			await deleteSweet(id);
		} catch (error) {
			console.error('Error deleting sweet:', error);
		}
	};

	const handleRestock = async (id: string, amount: number) => {
		try {
			await sweetsAPI.restock(id, amount);
			// The sweets will be refreshed automatically by the context
		} catch (error) {
			console.error('Error restocking sweet:', error);
		}
	};

	const handlePurchase = async (id: string) => {
		try {
			await sweetsAPI.purchase(id, 1);
			// The sweets will be refreshed automatically by the context
		} catch (error) {
			console.error('Error purchasing sweet:', error);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading sweets...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-500 text-xl mb-4">⚠️</div>
					<p className="text-red-600 mb-4">Error loading sweets: {error}</p>
					<Button onClick={() => window.location.reload()}>
						Retry
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white border-b">
				<div className="container mx-auto px-4 py-4 flex justify-between items-center">
					<div className="flex items-center gap-2">
						<Candy className="h-8 w-8 text-pink-500" />
						<div>
							<h1 className="text-xl font-semibold">
								SweetShop Dashboard
							</h1>
							<p className="text-sm text-gray-600">
								{/* Welcome back, {user.name}! */}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{isAdmin && (
							<Badge
								variant="secondary"
								className="bg-purple-100 text-purple-700"
							>
								Admin
							</Badge>
						)}
						<Button variant="ghost" size="sm">
							<Settings className="h-4 w-4" />
						</Button>
						<Button variant="ghost" size="sm" >
							<LogOut className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</header>

			<div className="container mx-auto px-4 py-6">
				{/* Search and Filter */}
				<div className="flex flex-col sm:flex-row gap-4 mb-6">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							placeholder="Search sweets..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-9"
						/>
					</div>
					<Select
						value={selectedCategory}
						onValueChange={setSelectedCategory}
					>
						<SelectTrigger className="w-full sm:w-48">
							<Filter className="h-4 w-4 mr-2" />
							<SelectValue placeholder="Filter by category" />
						</SelectTrigger>
						<SelectContent>
							{categories.map((category) => (
								<SelectItem key={category} value={category}>
									{category === "all"
										? "All Categories"
										: category}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{isAdmin && (
						<Button
							onClick={() => setShowAddForm(true)}
							className="bg-gradient-to-r from-pink-500 to-purple-500"
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Sweet
						</Button>
					)}
				</div>

				{/* Add Sweet Form */}
				{showAddForm && isAdmin && (
					<Card className="mb-6">
						<CardHeader>
							<CardTitle>Add New Sweet</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Input
									placeholder="Sweet name"
									value={newSweet.name}
									onChange={(e) =>
										setNewSweet({
											...newSweet,
											name: e.target.value,
										})
									}
								/>
								<Input
									placeholder="Category"
									value={newSweet.category}
									onChange={(e) =>
										setNewSweet({
											...newSweet,
											category: e.target.value,
										})
									}
								/>
								<Input
									type="number"
									placeholder="Price"
									value={newSweet.price}
									onChange={(e) =>
										setNewSweet({
											...newSweet,
											price: parseFloat(e.target.value),
										})
									}
								/>
								<Input
									type="number"
									placeholder="Stock"
									value={newSweet.quantity}
									onChange={(e) =>
										setNewSweet({
											...newSweet,
											quantity: parseInt(e.target.value),
										})
									}
								/>
								<Input
									placeholder="Description"
									value={newSweet.description}
									onChange={(e) =>
										setNewSweet({
											...newSweet,
											description: e.target.value,
										})
									}
									className="md:col-span-2"
								/>
							</div>
							<div className="flex gap-2 mt-4">
								<Button onClick={handleAddSweet}>
									Add Sweet
								</Button>
								<Button
									variant="outline"
									onClick={() => setShowAddForm(false)}
								>
									Cancel
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Edit Sweet Form */}
				{editingSweet && isAdmin && (
					<Card className="mb-6">
						<CardHeader>
							<CardTitle>Edit Sweet</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Input
									placeholder="Sweet name"
									value={editingSweet.name}
									onChange={(e) =>
										setEditingSweet({
											...editingSweet,
											name: e.target.value,
										})
									}
								/>
								<Input
									placeholder="Category"
									value={editingSweet.category}
									onChange={(e) =>
										setEditingSweet({
											...editingSweet,
											category: e.target.value,
										})
									}
								/>
								<Input
									type="number"
									placeholder="Price"
									value={editingSweet.price}
									onChange={(e) =>
										setEditingSweet({
											...editingSweet,
											price: parseFloat(e.target.value),
										})
									}
								/>
								<Input
									type="number"
									placeholder="Stock"
									value={editingSweet.quantity}
									onChange={(e) =>
										setEditingSweet({
											...editingSweet,
											quantity: parseInt(e.target.value),
										})
									}
								/>
								<Input
									placeholder="Description"
									value={editingSweet.description}
									onChange={(e) =>
										setEditingSweet({
											...editingSweet,
											description: e.target.value,
										})
									}
									className="md:col-span-2"
								/>
							</div>
							<div className="flex gap-2 mt-4">
								<Button onClick={handleUpdateSweet}>
									Update Sweet
								</Button>
								<Button
									variant="outline"
									onClick={() => setEditingSweet(null)}
								>
									Cancel
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Sweets Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{filteredSweets.map((sweet) => (
						<Card
							key={sweet.id}
							className="hover:shadow-lg transition-shadow"
						>
							<CardHeader className="pb-2">
								<div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg mb-2 flex items-center justify-center">
									<Candy className="h-12 w-12 text-pink-500" />
								</div>
								<CardTitle className="text-lg">
									{sweet.name}
								</CardTitle>
								<CardDescription>
									{sweet.description}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<Badge variant="outline">
											{sweet.category}
										</Badge>
										<span className="font-semibold">
											${sweet.price.toFixed(2)}
										</span>
									</div>

									<div className="flex items-center gap-2">
										<Package className="h-4 w-4 text-gray-500" />
										<span
											className={`text-sm ${
												sweet.quantity === 0
													? "text-red-500"
													: sweet.quantity < 10
													? "text-yellow-500"
													: "text-green-500"
											}`}
										>
											{sweet.quantity === 0
												? "Out of Stock"
												: `${sweet.quantity} in stock`}
										</span>
									</div>

									<div className="flex flex-col gap-2 pt-2">
										<Button
											size="sm"
											disabled={sweet.quantity === 0}
											onClick={() =>
												handlePurchase(sweet.id)
											}
											className="w-full"
										>
											<ShoppingCart className="h-4 w-4 mr-2" />
											{sweet.quantity === 0
												? "Out of Stock"
												: "Purchase"}
										</Button>

										{isAdmin && (
											<div className="flex gap-1">
												<Button
													size="sm"
													variant="outline"
													onClick={() =>
														setEditingSweet(sweet)
													}
													className="flex-1"
												>
													<Edit className="h-4 w-4" />
												</Button>
												<Button
													size="sm"
													variant="outline"
													onClick={() =>
														handleRestock(
															sweet.id,
															10
														)
													}
													className="flex-1"
												>
													<Plus className="h-4 w-4" />
												</Button>
												<Button
													size="sm"
													variant="outline"
													onClick={() =>
														handleDeleteSweet(
															sweet.id
														)
													}
													className="flex-1 text-red-500 hover:text-red-600"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{filteredSweets.length === 0 && (
					<div className="text-center py-12">
						<Candy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-600 mb-2">
							No sweets found
						</h3>
						<p className="text-gray-500">
							Try adjusting your search or filter criteria
						</p>
					</div>
				)}
			</div>
		</div>
	);
}


export default Dashboard;