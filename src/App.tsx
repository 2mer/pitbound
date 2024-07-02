import { Router } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import Routes from './views/Routes';
import { Suspense } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
	return (
		<div style={{ position: 'absolute', inset: 0 }}>
			<Router hook={useHashLocation}>
				<ErrorBoundary fallback={<div>Something broke 💀</div>}>
					<Suspense fallback={<div>Loading...</div>}>
						<Routes />
					</Suspense>
				</ErrorBoundary>
			</Router>
		</div>
	);
}

export default App;
