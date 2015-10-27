
var context = null;
export var AVAILABLE = false;

if ("AudioContext" in window) {
	context = new AudioContext();

	var gain = context.createGain();
	gain.gain.value = 0.05;
	gain.connect(context.destination);

	AVAILABLE = true;
}


export function gameStart() {
	if (!AVAILABLE)
		return;

	var time = context.currentTime + 0.01;
	var osc = context.createOscillator();
	osc.type="square";
	osc.frequency.value = 440;
	osc.connect(gain);
	osc.start(time);
	osc.frequency.setValueAtTime(440 * 4 / 3, time + 0.1);
	osc.frequency.setValueAtTime(440 * 3 / 2, time + 0.2);
	osc.stop(time + 0.3);
}

export function move() {
	if (!AVAILABLE)
		return;

	var time = context.currentTime + 0.01;
	var osc = context.createOscillator();
	osc.type="square";
	osc.frequency.value = 440;
	osc.connect(gain);
	osc.start(time);
	osc.stop(time + 0.1);
}

export function pipu() {
	if (!AVAILABLE)
		return;

	var time = context.currentTime + 0.01;
	var osc = context.createOscillator();
	osc.type="square";
	osc.frequency.value = 440;
	osc.connect(gain);
	osc.start(time);
	osc.frequency.setValueAtTime(220, time + 0.1);
	osc.stop(time + 0.2);
}

export function check() {
	if (!AVAILABLE)
		return;

	var time = context.currentTime + 0.01;
	var osc = context.createOscillator();
	osc.type="square";
	osc.frequency.value = 440 * 45 / 32;
	osc.connect(gain);
	osc.start(time);
	osc.frequency.setValueAtTime(440 * 9 / 8, time + 0.1);
	osc.stop(time + 0.2);
}

export function gameEnd() {
	if (!AVAILABLE)
		return;

	var time = context.currentTime + 0.01;
	var osc = context.createOscillator();
	osc.type="square";
	osc.frequency.value = 440;
	osc.connect(gain);
	osc.start(time);
	osc.frequency.setValueAtTime(440 * 4 / 3, time + 0.1);
	osc.frequency.setValueAtTime(440 * 3 / 2, time + 0.2);
	osc.frequency.setValueAtTime(440 * 9 / 5, time + 0.3);
	osc.frequency.setValueAtTime(440 * 2, time + 0.4);
	osc.stop(time + 0.6);
}
