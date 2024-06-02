import { Container, Graphics, Sprite } from 'pixi.js';
import HookComponent from './HookComponent';
import { Pixify, usePixiEffect } from './Pixi';
import { R1, R2 } from '@/utils/PRandom';
import { mix } from '@/utils/Math';
import { vec2 } from 'gl-matrix';
import { StageContext } from './StageComponent';
import { World } from '@/types/World';

export interface WorldState {
	age: number;

	position: {
		depth: number;
		horizontalIndex: number;
	};

	capability: {
		vision: {
			up: number;
			down: number;
		};
	};
}

interface DashedLineOptions {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	dashLength: number;
	gapLength: number;
}

function drawDashedLine(graphics: Graphics, options: DashedLineOptions): void {
	const { x1, y1, x2, y2, dashLength, gapLength } = options;

	const deltaX = x2 - x1;
	const deltaY = y2 - y1;
	const lineLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
	const dashCount = Math.floor(lineLength / (dashLength + gapLength));
	const dashX = (deltaX / lineLength) * dashLength;
	const dashY = (deltaY / lineLength) * dashLength;
	const gapX = (deltaX / lineLength) * gapLength;
	const gapY = (deltaY / lineLength) * gapLength;

	let currentX = x1;
	let currentY = y1;

	for (let i = 0; i < dashCount; i++) {
		graphics.moveTo(currentX, currentY);
		currentX += dashX;
		currentY += dashY;
		graphics.lineTo(currentX, currentY);
		currentX += gapX;
		currentY += gapY;
	}
	// Draw the last segment if necessary
	graphics.moveTo(currentX, currentY);
	graphics.lineTo(x2, y2);
}

function getDepthNodes(world: World, depth: number) {
	if (depth < 0) return [];
	// const minNodes = 9;
	// const maxNodes = 24;
	const widthPerNode = 200;
	const depthHeight = 150;
	const minWorldWidth = 700;
	const maxWorldWidth = 2500;

	const depthWidth = getDepthWorldWidth(depth, minWorldWidth, maxWorldWidth);
	const nodesInDepth = Math.floor(
		(depthWidth / widthPerNode) * mix(0.8, 1.3, R1(depth))
	);
	// const depthNodeAmplifier = 1 + (depthWidth / maxWorldWidth) * 0.5;

	// const nodesInDepth = mixi(
	// 	minNodes,
	// 	maxNodes,
	// 	R1(depth * depthNodeAmplifier)
	// );
	const remainderWidth = maxWorldWidth - depthWidth;

	const nodes = [];

	for (let nodeIndex = 0; nodeIndex < nodesInDepth; nodeIndex++) {
		const radius = mix(10, 25, R2(nodeIndex, depth * nodesInDepth));

		// const color = 0xffffff * R2(radius * depth, nodeIndex);

		const event = world.getEventAt({ depth, horizontalIndex: nodeIndex });

		const color = event.color.rgbNumber();

		const offsetX = mix(
			-25,
			25,
			R2(nodeIndex * 1253.86423, depth * -9728.12846)
		);

		const offsetY = mix(
			-25,
			25,
			R2(depth * 1253.86423, nodeIndex * -9728.12846)
		);

		const x =
			nodeIndex * (depthWidth / (nodesInDepth - 1)) +
			offsetX +
			remainderWidth / 2;
		const y = depth * depthHeight + offsetY;

		nodes.push({ x, y, radius, color, event });
	}

	return nodes;
}

function getDepthWorldWidth(depth: number, min: number, max: number) {
	const d = depth / 100;
	const depthProgress =
		((Math.sin(d * 5) * 50 + Math.cos(d * 25) * 25 + Math.cos(d * 50) * 5) /
			(50 + 25 + 5) +
			1) /
		2;
	return mix(min, max, depthProgress);
}

const NodeMapComponent = Pixify(
	HookComponent(() => {
		const stage = StageContext.use();
		const { world } = stage;

		// setup
		usePixiEffect(({ app, viewport }) => {
			app.resizeTo = app.canvas;
			viewport
				.wheel({ smooth: 3 })
				.pinch()
				.drag()
				.decelerate({ friction: 0.9 })
				.clampZoom({ maxScale: 2, minScale: 0.1 });
		}, []);

		usePixiEffect(
			({ viewport }) => {
				const capabilities = stage.getCapabilities();

				const minIndex = Math.max(
					0,
					world.position.depth - capabilities.vision.up
				);
				const maxIndex =
					world.position.depth + capabilities.vision.down;

				for (let depth = minIndex; depth <= maxIndex; depth++) {
					const nodes = getDepthNodes(world, depth);
					const nodesBelow = getDepthNodes(world, depth + 1);

					nodes.forEach((node, index) => {
						const { x, y, radius, color, event } = node;

						const nodeContainer = new Container();

						const circle = new Graphics();
						const sprite = Sprite.from(event.image);

						nodeContainer.addChild(circle);
						nodeContainer.addChild(sprite);

						sprite.texture.baseTexture.scaleMode = 'nearest';

						nodesBelow.forEach((nb) => {
							const n2 = vec2.fromValues(x, y);
							const nb2 = vec2.fromValues(nb.x, nb.y);

							const d = vec2.dist(n2, nb2);

							if (d < getDepthWorldWidth(depth, 150, 250)) {
								circle.setStrokeStyle({
									width: 3,
									color: 0xacacac,
								});

								drawDashedLine(circle, {
									x1: x,
									y1: y,
									x2: nb.x,
									y2: nb.y,
									dashLength: 20,
									gapLength: 10,
								});

								circle.stroke();
							}
						});

						circle.circle(x, y, radius).fill(0);

						sprite.anchor.set(0.5, 0.5);
						sprite.width = radius * 1.2;
						sprite.height = radius * 1.2;
						sprite.position.set(x, y);

						sprite.tint = event.isComplete() ? 0xacacac : color;

						sprite.eventMode = 'none';
						circle.cursor = 'pointer';
						circle.eventMode = 'static';

						circle.on('click', () => {
							if (!world.canMove()) return;

							world.moveTo({ depth, horizontalIndex: index });
						});

						if (
							depth === world.position.depth &&
							index === world.position.horizontalIndex
						) {
							circle
								.setStrokeStyle({ color: 0xac00ff, width: 2 })
								.circle(x, y, radius * 2)
								.circle(x, y, radius * 2.4)
								.stroke();
						}

						viewport.addChild(nodeContainer);
					});

					if (depth === world.position.depth) {
						const currentNode =
							nodes[world.position.horizontalIndex];

						viewport.moveCenter(currentNode.x, currentNode.y);
					}
				}
			},
			[world]
		);
	})
);

export default NodeMapComponent;
