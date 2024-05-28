import React, {
	ComponentProps,
	PropsWithChildren,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Application } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { createContext } from '@sgty/kontext-react';

export type PixiAppCtx = {
	app: Application;
	viewport: Viewport;
};

const PixiContext = createContext(({ app, viewport }: Partial<PixiAppCtx>) => {
	return useMemo(() => ({ app, viewport, isReady: Boolean(app) }), [app]);
});

const WORLD_SIZE = 1000;

function Pixi({
	children,
	...rest
}: PropsWithChildren<ComponentProps<'canvas'>>) {
	const [ctx, setCtx] = useState<PixiAppCtx>();

	const ref = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const app = new Application();

		async function setupApp() {
			await app.init({
				canvas: ref.current!,
			});

			const viewport = new Viewport({
				events: app.renderer.events,
				worldWidth: WORLD_SIZE,
				worldHeight: WORLD_SIZE,
			});

			app.stage.addChild(viewport);

			app.start();

			return { app, viewport };
		}

		setupApp().then((ctx) => {
			setCtx(ctx);
		});

		return () => {
			app.destroy();
		};
	}, []);

	return (
		<>
			<canvas ref={ref} {...rest} />

			<PixiContext.Provider {...ctx}>{children}</PixiContext.Provider>
		</>
	);
}

export function Pixify<T extends React.ComponentType<any>>(Comp: T) {
	return (
		props: ComponentProps<T> & { PixiProps: ComponentProps<typeof Pixi> }
	) => {
		const { PixiProps, ...rest } = props;

		return (
			<Pixi {...PixiProps}>
				{/* @ts-ignore */}
				<Comp {...rest} />
			</Pixi>
		);
	};
}

export const usePixi = PixiContext.use;

export const usePixiEffect = (
	cb: (ctx: PixiAppCtx) => (() => void) | void,
	deps: any[]
) => {
	const { isReady, ...rest } = usePixi();

	useEffect(() => {
		if (!isReady) return;

		return cb(rest as PixiAppCtx);
	}, [isReady, ...deps]);
};

export default Pixi;
