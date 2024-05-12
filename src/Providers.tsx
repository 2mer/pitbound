import { PropsWithChildren } from 'react';
import { theme } from './theme';
import { ThemeProvider } from 'styled-components';
import { TooltipProvider } from './components/ui/tooltip';

function Providers({ children }: PropsWithChildren<{}>) {
	return (
		<ThemeProvider theme={theme}>
			<TooltipProvider delayDuration={0}>{children}</TooltipProvider>
		</ThemeProvider>
	);
}

export default Providers;
