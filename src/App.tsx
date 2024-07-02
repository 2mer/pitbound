import { Router } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import Routes from './views/Routes';
import { Suspense } from 'react';

function App() {
	return (
		<div style={{ position: 'absolute', inset: 0 }}>
			<Router hook={useHashLocation}>
				<Suspense fallback={<div>Loading...</div>}>
					<Routes />
				</Suspense>
			</Router>
		</div>
	);
}

export default App;
