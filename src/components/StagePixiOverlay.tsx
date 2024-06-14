import { createPixi } from './Pixi';

export const StagePixiOverlay = createPixi(
	{ backgroundAlpha: 0 },
	({ app }) => {
		app.resizeTo = app.canvas;
	}
);
