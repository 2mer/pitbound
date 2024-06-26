import { Router } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import Routes from './views/Routes';

function App() {
	return (
		<div style={{ position: 'absolute', inset: 0 }}>
			<Router hook={useHashLocation}>
				<Routes />
			</Router>
		</div>
	);
}

export default App;
