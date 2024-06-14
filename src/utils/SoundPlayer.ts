import { Howl } from 'howler';

function loadSound(name: string) {
	return new Howl({
		src: [`sounds/${name}.wav`]
	})
}

const sounds = {
	die: loadSound('die'),
	hurt: loadSound('hurt'),
	click: loadSound('click'),
	flee: loadSound('flee'),
} as const;

export function playSound(name: keyof typeof sounds) {
	sounds[name].play();
}