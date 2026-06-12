<div align="center">

<img src="./src/assets/icons/fighter/pitling.png" width="60" height="80" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Pitling" />
<img src="./src/assets/icons/fighter/collector.png" width="80" height="80" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Collector" />
<img src="./src/assets/icons/fighter/mimic.png" width="80" height="80" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Mimic" />
<img src="./src/assets/icons/fighter/chest.png" width="80" height="80" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Chest" />
<img src="./src/assets/icons/fighter/dev.png" width="80" height="80" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Dev" />

# ⛏️ PITBOUND

**a turn-based tactical roguelike — somewhere between *Slice & Dice* and *Made in Abyss***  
powered entirely by web technologies (React · TypeScript · Pixi.js · Tailwind)

[![Status: Archived](https://img.shields.io/badge/status-archived-lightgrey?style=flat-square)]()

</div>

---

## 📖 Overview

Descend into an ever-shifting abyss. Navigate a procedurally generated vertical shaft — left and right paths branch at each depth. Choose your encounters: **battles** against monstrous creatures, **treasure** chambers (with the occasional mimic), or **rest** to recover your party.

Your fighters are built from modular **bricks** — body parts like hearts, claws, bones, brains, and eyes. Each brick has its own health and grants unique abilities. In combat, enemy bricks can be destroyed individually, crippling their capabilities. Manage your inventory, equip items, and survive as deep as you can go.

### World Events

| | |
|---|---|
| <img src="./src/assets/icons/ui/fight.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Fight" /> | **Battle** — face off against hostile fighters |
| <img src="./src/assets/icons/ui/treasure.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Treasure" /> | **Treasure** — find loot and equipment |
| <img src="./src/assets/icons/ui/map.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Empty" /> | **Empty** — a quiet spot on the descent |
| <img src="./src/assets/icons/ui/menu.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Party" /> | **Party** — rest and reorganise |

---

## 🎨 Art & Abilities

### Fighters

Characters and enemies are small pixel-art sprites (12–16 px):

<img src="./src/assets/icons/fighter/pitling.png" width="48" height="64" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Pitling" /> Pitling &nbsp;&nbsp;
<img src="./src/assets/icons/fighter/skull16.png" width="64" height="64" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Skull" /> Skull &nbsp;&nbsp;
<img src="./src/assets/icons/fighter/collector.png" width="64" height="64" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Collector" /> Collector &nbsp;&nbsp;
<img src="./src/assets/icons/fighter/mimic.png" width="64" height="64" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Mimic" /> Mimic &nbsp;&nbsp;
<img src="./src/assets/icons/fighter/chest.png" width="64" height="64" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Chest" /> Chest &nbsp;&nbsp;
<img src="./src/assets/icons/fighter/dummy16.png" width="64" height="64" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Dummy" /> Training Dummy &nbsp;&nbsp;
<img src="./src/assets/icons/fighter/dev.png" width="64" height="64" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Dev" /> Dev

### Bricks (Body Parts)

Your fighter is assembled from bricks — each with their own health and abilities:

<img src="./src/assets/icons/brick/heart.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Heart" /> Heart &nbsp;
<img src="./src/assets/icons/brick/bone.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Bone" /> Bone &nbsp;
<img src="./src/assets/icons/brick/claw.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Claw" /> Claw &nbsp;
<img src="./src/assets/icons/brick/brain.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Brain" /> Brain &nbsp;
<img src="./src/assets/icons/brick/eye.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Eye" /> Eye &nbsp;
<img src="./src/assets/icons/brick/flesh.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Flesh" /> Flesh &nbsp;
<img src="./src/assets/icons/brick/hand.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Hand" /> Hand &nbsp;
<img src="./src/assets/icons/brick/attack.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Attack" /> Attack &nbsp;
<img src="./src/assets/icons/brick/bag.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Bag" /> Bag &nbsp;
<img src="./src/assets/icons/brick/spike.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Spike" /> Spike &nbsp;
<img src="./src/assets/icons/brick/crit.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Crit" /> Crit &nbsp;
<img src="./src/assets/icons/brick/run.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Run" /> Run

### Abilities

Bricks grant abilities for use in and out of combat:

<img src="./src/assets/icons/ability/scratch.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Scratch" /> Scratch &nbsp;
<img src="./src/assets/icons/ability/slash.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Slash" /> Slash &nbsp;
<img src="./src/assets/icons/ability/hit.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Hit" /> Hit &nbsp;
<img src="./src/assets/icons/ability/kill.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Kill" /> Kill &nbsp;
<img src="./src/assets/icons/ability/heal.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Heal" /> Heal &nbsp;
<img src="./src/assets/icons/ability/move.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Move" /> Move &nbsp;
<img src="./src/assets/icons/ability/backstab.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Backstab" /> Backstab &nbsp;
<img src="./src/assets/icons/ability/cleave.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Cleave" /> Cleave &nbsp;
<img src="./src/assets/icons/ability/explosion.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Explosion" /> Explosion &nbsp;
<img src="./src/assets/icons/ability/pierce.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Pierce" /> Pierce &nbsp;
<img src="./src/assets/icons/ability/flee.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Flee" /> Flee &nbsp;
<img src="./src/assets/icons/ability/up.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Up" /> Up &nbsp;
<img src="./src/assets/icons/ability/down.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Down" /> Down

### Items

Equipment that can be slotted into brick inventories:

<img src="./src/assets/icons/item/sword.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Sword" /> Sword &nbsp;
<img src="./src/assets/icons/item/dagger.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Dagger" /> Dagger &nbsp;
<img src="./src/assets/icons/item/stick.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Stick" /> Stick &nbsp;
<img src="./src/assets/icons/item/windboot.png" width="32" height="32" style="image-rendering:pixelated;image-rendering:crisp-edges" alt="Windboot" /> Windboot

---

## 🧱 Tech Stack

| | |
|---|---|
| **Framework** | [React 18](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| **Bundler** | [Vite 5](https://vitejs.dev) |
| **Rendering** | [Pixi.js 8](https://pixijs.com) (WebGL + GLSL shaders) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) + [Framer Motion](https://www.framer.com/motion) |
| **Audio** | [Howler.js](https://howlerjs.com) |
| **Persistence** | [Dexie.js](https://dexie.org) (IndexedDB) |
| **Components** | [shadcn/ui](https://ui.shadcn.com) + [Storybook](https://storybook.js.org) |

---

## 🚦 Status

> **This project is currently not being actively developed.**  
> The last commit was July 2024. The codebase represents an early, playable prototype — feel free to explore, fork, or draw inspiration from it.

---

## ⚖️ Legalities

Although open-source, all pixel-art assets in this repository are protected under copyright.
