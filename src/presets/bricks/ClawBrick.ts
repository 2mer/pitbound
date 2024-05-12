import Icon from '@/assets/icons/brick/claw.png';
import { HandBrick } from "./HandBrick";
import { playSound } from '@/utils/SoundPlayer';

export class ClawBrick extends HandBrick {
	name = 'Claw';
	image = Icon;

	public onClick(): void {
		super.onClick();

		const enemies = this.stage.getEnemies(this.fighter).values();

		enemies.forEach(enemy => {
			const firstBrick = enemy.getLivingBricks().at(-1);
			if (firstBrick) {
				firstBrick.damage({ attacker: this.fighter, amount: this.$attacker.attack });
			}
		})

		if (enemies.length > 0) {
			playSound('hurt');
		}

		this.$usable.use();
		this.fighter.update();
	}
}