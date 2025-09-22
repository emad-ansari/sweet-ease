import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/signup";
import Login from "./pages/login";
import DashboardLayout from "./components/dahsboard-layout";
import Dashboard from "./pages/dashboard";
import "./index.css";
function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Register />} />
				<Route path="/login" element={<Login />} />
				<Route path="/dashboard" element={<DashboardLayout />}>
					<Route index element={<Dashboard />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
