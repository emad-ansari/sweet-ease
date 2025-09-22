import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";
import { type User } from "../types";
import { authAPI } from "../lib/api";

interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<boolean>;
	register: (
		email: string,
		password: string,
		name: string
	) => Promise<boolean>;
	logout: () => void;
	isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);

	// Check for existing auth token on app load
	useEffect(() => {
		const token = localStorage.getItem('authToken');
		const userData = localStorage.getItem('userData');
		
		if (token && userData) {
			try {
				const parsedUser = JSON.parse(userData);
				setUser(parsedUser);
			} catch (error) {
				console.error('Error parsing user data:', error);
				localStorage.removeItem('authToken');
				localStorage.removeItem('userData');
			}
		}
	}, []);

	const login = async (email: string, password: string): Promise<boolean> => {
		try {
			const response = await authAPI.login(email, password);
			
			// Store token and user data
			localStorage.setItem('authToken', response.token);
			localStorage.setItem('userData', JSON.stringify(response.user));
			
			setUser(response.user);
			return true;
		} catch (error) {
			console.error('Login error:', error);
			return false;
		}
	};

	const register = async (
		email: string,
		password: string,
		name: string
	): Promise<boolean> => {
		try {
			const response = await authAPI.register(email, password, name);
			
			// Store token and user data
			localStorage.setItem('authToken', response.token);
			localStorage.setItem('userData', JSON.stringify(response.user));
			
			setUser(response.user);
			return true;
		} catch (error) {
			console.error('Registration error:', error);
			return false;
		}
	};

	const logout = () => {
		localStorage.removeItem('authToken');
		localStorage.removeItem('userData');
		setUser(null);
	};

	const isAdmin = user?.isAdmin || false;

	return (
		<AuthContext.Provider
			value={{ user, login, register, logout, isAdmin }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
