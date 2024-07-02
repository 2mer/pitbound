import { StagePixiOverlay } from './StagePixiOverlay';
import { Assets, Container, Sprite, Texture } from 'pixi.js';
import { Cursor } from '@/types/Cursor';
import { subs } from '@/utils/Subs';
import HookComponent from './HookComponent';
import ScrollContext from './ScrollContext';
import ArrowIcon from '@/assets/icons/ui/cursor.png';
import useConst from '@/hooks/useConst';

Assets.load(ArrowIcon);

const CursorComponent = HookComponent(({ cursor }: { cursor: Cursor }) => {
	const { ref: scrollRef } = ScrollContext.use();
	const pos = useConst(() => ({ x: 0, y: 0 }));
	const scroll = useConst(() => ({ x: 0, y: 0 }));

	StagePixiOverlay.useEffect(
		({ app }) => {
			const scroller = scrollRef.current!;

			const container = new Container();

			const arrowSprite = Sprite.from(ArrowIcon);
			arrowSprite.width = 32;
			arrowSprite.height = 32;
			arrowSprite.texture.baseTexture.scaleMode = 'nearest';

			const sprite = new Sprite();

			sprite.x = 16;
			sprite.y = 16;

			function updateScroll() {
				scroll.x = scroller.scrollLeft;
				scroll.y = scroller.scrollTop;
			}

			function handleMouseMove(e: MouseEvent) {
				const b = app.canvas.getBoundingClientRect();
				pos.x = e.clientX - b.left;
				pos.y = e.clientY - b.top;
				updateScroll();
				container.x = pos.x;
				container.y = pos.y;
			}

			function handleMouseScroll() {
				pos.x += scroller.scrollLeft - scroll.x;
				pos.y += scroller.scrollTop - scroll.y;
				container.x = pos.x;
				container.y = pos.y;
				updateScroll();
			}

			function handleCursorSlot() {
				const isEmpty = cursor.slot.isEmpty();
				sprite.texture = Texture.from(cursor.slot.item.icon);
				sprite.width = 32;
				sprite.height = 32;
				sprite.texture.baseTexture.scaleMode = 'nearest';

				container.alpha = isEmpty ? 0 : 1;
				container.x = pos.x;
				container.y = pos.y;
			}

			document.body.addEventListener('mousemove', handleMouseMove);
			scroller.addEventListener('scroll', handleMouseScroll);

			const cleanup = subs(cursor.slot.events, {
				itemPlaced: handleCursorSlot,
				itemRemoved: handleCursorSlot,
			});

			container.addChild(arrowSprite);
			container.addChild(sprite);
			app.stage.addChild(container);

			handleCursorSlot();

			return () => {
				document.body.removeEventListener('mousemove', handleMouseMove);
				scroller.removeEventListener('scroll', handleMouseScroll);
				cleanup();

				if (app.stage) {
					app.stage.removeChild(container);
				}

				container.destroy({ children: true });
			};
		},
		[cursor]
	);
});

export default CursorComponent;
