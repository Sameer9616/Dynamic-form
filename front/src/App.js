import React from "react";
import { Toaster } from "react-hot-toast";
import RouteList from "./Routes";

const App = () => {
	return (
		<>
			<Toaster
				position="top-center"
				reverseOrder={false}
			/>
			<RouteList />
		</>
	);
};

export default App;
