
var context = null;
export var AVAILABLE = false;

if ("AudioContext" in window) {
	context = new AudioContext();

	var gain = context.createGain();
	gain.gain.value = 0.05;
	gain.connect(context.destination);

	AVAILABLE = true;
}


export function pirori() {
	if (context === null)
		return;

	var time = context.currentTime + 0.05;
	var osc = context.createOscillator();
	osc.type="square";
	osc.frequency.value = 440;
	osc.connect(gain);
	osc.start(time);
	osc.frequency.setValueAtTime(550, time + 0.1);
	osc.frequency.setValueAtTime(660, time + 0.2);
	osc.stop(time + 0.3);
}

export function pi() {
	if (context === null)
		return;

	var time = context.currentTime + 0.05;
	var osc = context.createOscillator();
	osc.type="square";
	osc.frequency.value = 440;
	osc.connect(gain);
	osc.start(time);
	osc.stop(time + 0.1);
}

export function pipu() {
	if (context === null)
		return;

	var time = context.currentTime + 0.05;
	var osc = context.createOscillator();
	osc.type="square";
	osc.frequency.value = 440;
	osc.connect(gain);
	osc.start(time);
	osc.frequency.setValueAtTime(220, time + 0.1);
	osc.stop(time + 0.2);
}
