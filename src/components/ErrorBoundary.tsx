import { ReactNode, Component } from 'react';

export class ErrorBoundary extends Component<{
	fallback: ReactNode;
	children: ReactNode;
}> {
	state = { hasError: false };

	constructor(props: { fallback: ReactNode; children: ReactNode }) {
		super(props);
	}

	static getDerivedStateFromError(_error: Error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return this.props.fallback;
		}

		return this.props.children;
	}
}
