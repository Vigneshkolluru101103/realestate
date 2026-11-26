import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": new URL("./src", import.meta.url).pathname
		}
	},
	server: {
		host: "0.0.0.0",
		port: 5174,
		strictPort: true,
		proxy: {
			"/api": {
				target: process.env.VITE_BACKEND_URL || "http://localhost:8001",
				changeOrigin: true,
				secure: false
			}
		}
	}
});
