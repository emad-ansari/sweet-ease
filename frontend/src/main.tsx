import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./hooks/use-auth.tsx";
import { SweetProvider } from "./hooks/use-sweet.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthProvider>
			<SweetProvider>
				<App />
			</SweetProvider>
		</AuthProvider>
	</StrictMode>
);
