import { Graphics } from 'pixi.js';
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
						const { x, y, radius, color } = node;

						const circle = new Graphics();

						nodesBelow.forEach((nb) => {
							const n2 = vec2.fromValues(x, y);
							const nb2 = vec2.fromValues(nb.x, nb.y);

							const d = vec2.dist(n2, nb2);
							// if (d < 250) {
							if (d < getDepthWorldWidth(depth, 150, 250)) {
								circle
									.setStrokeStyle({
										width: 3,
										color: 0xacacac,
									})
									.moveTo(x, y)
									.lineTo(nb.x, nb.y)
									.stroke();
							}
						});

						circle
							.circle(x, y, radius)
							.fill(color)
							.setStrokeStyle({
								width: 2,
								color: 0xffffff - color,
							})
							.circle(x, y, radius)
							.stroke();

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
								.setStrokeStyle({ color: 0xff0000, width: 2 })
								.circle(x, y, radius * 1.2)
								.circle(x, y, radius * 1.4)
								.stroke();
						}

						viewport.addChild(circle);
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
