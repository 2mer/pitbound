import { Route } from 'wouter';
import MainMenu from './MainMenu';
import { lazy } from 'react';

const LazySettingsView = lazy(() => import('./SettingsView'));
const LazyNewGameView = lazy(() => import('./NewGameView'));
const LazySavesView = lazy(() => import('./SavesView'));
const LazyGameView = lazy(() => import('./GameView'));

function Routes() {
	return (
		<>
			<Route path='/' component={MainMenu} />
			<Route path='/settings' component={LazySettingsView} />
			<Route path='/new-game' component={LazyNewGameView} />
			<Route path='/saves' component={LazySavesView} />
			<Route path='/saves/:slot' component={LazyGameView} />
		</>
	);
}

export default Routes;
