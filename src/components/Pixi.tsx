import React, {
	ComponentProps,
	PropsWithChildren,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Application, ApplicationOptions } from 'pixi.js';
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
	ApplicationProps = {},
	...rest
}: PropsWithChildren<ComponentProps<'canvas'>> & {
	ApplicationProps?: Partial<ApplicationOptions>;
}) {
	const [ctx, setCtx] = useState<PixiAppCtx>();

	const ref = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const app = new Application();

		async function setupApp() {
			await app.init({
				canvas: ref.current!,
				antialias: true,
				...ApplicationProps,
			});

			const viewport = new Viewport({
				events: app.renderer.events,
				worldWidth: WORLD_SIZE,
				worldHeight: WORLD_SIZE,
			});

			app.stage.addChild(viewport);

			app.start();

			app.renderer.on('resize', (width: number, height: number) => {
				viewport.resize(width, height, WORLD_SIZE, WORLD_SIZE);
			});

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

export function createPixi(
	opts: Partial<ApplicationOptions> = {},
	setup: (ctx: PixiAppCtx) => void = () => {}
) {
	const Ctx = createContext(() => {
		const [ctx, setCtx] = useState<PixiAppCtx>();

		const ref = useRef<HTMLCanvasElement>(null);

		useEffect(() => {
			const app = new Application();

			async function setupApp() {
				await app.init({
					canvas: ref.current!,
					antialias: true,
					...opts,
				});

				const viewport = new Viewport({
					events: app.renderer.events,
					worldWidth: WORLD_SIZE,
					worldHeight: WORLD_SIZE,
				});

				app.stage.addChild(viewport);

				app.start();

				app.renderer.on('resize', (width: number, height: number) => {
					viewport.resize(width, height, WORLD_SIZE, WORLD_SIZE);
				});

				return { app, viewport };
			}

			setupApp().then((ctx) => {
				setCtx(ctx);
				setup(ctx);
			});

			return () => {
				app.destroy();
			};
		}, []);

		return useMemo(
			() => ({
				...ctx,
				ref,
			}),
			[ctx]
		);
	});

	const usePixiEffect = (
		cb: (ctx: PixiAppCtx) => (() => void) | void,
		deps: any[]
	) => {
		const ctx = Ctx.use();
		const { app } = ctx;

		useEffect(() => {
			if (!app) return;

			return cb(ctx as PixiAppCtx);
		}, [app, ...deps]);
	};

	const usePixiResize = (
		cb: (ctx: PixiAppCtx, e: { width: number; height: number }) => void,
		deps: any[]
	) => {
		const ctx = Ctx.use();
		const { app } = ctx;

		useEffect(() => {
			if (!app) return;

			function handleResize(width: number, height: number) {
				cb(ctx as PixiAppCtx, { width, height });
			}

			app.renderer.on('resize', handleResize);

			return () => {
				if (app.renderer) {
					app.renderer.off('resize', handleResize);
				}
			};
		}, [app, ...deps]);
	};

	const usePixiResizeEffect = (
		cb: (ctx: PixiAppCtx) => (() => void) | void,
		deps: any[]
	) => {
		const [hash, setHash] = useState('');

		usePixiEffect(cb, [...deps, hash]);

		usePixiResize((_, e) => {
			setHash(e.width + '_' + e.height);
		}, []);
	};

	return {
		...Ctx,

		Canvas: (props: ComponentProps<'canvas'>) => {
			const { ref, app } = Ctx.use();

			useEffect(() => {
				if (!app) return;

				const resizeObserver = new ResizeObserver((_) => {
					app.resize();
				});

				resizeObserver.observe(app.canvas);
			}, [app]);

			return <canvas ref={ref} {...props} />;
		},

		useEffect: usePixiEffect,
		useResize: usePixiResize,
		useResizeEffect: usePixiResizeEffect,
	};
}
