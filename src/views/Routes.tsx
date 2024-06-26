import { Route } from 'wouter';
import MainMenu from './MainMenu';
import SavesView from './SavesView';
import SettingsView from './SettingsView';
import NewGameView from './NewGameView';
import GameView from './GameView';

function Routes() {
	return (
		<>
			<Route path='/' component={MainMenu} />
			<Route path='/settings' component={SettingsView} />
			<Route path='/new-game' component={NewGameView} />
			<Route path='/saves' component={SavesView} />
			<Route path='/saves/:slot' component={GameView} />
		</>
	);
}

export default Routes;
