"use strict";


export function xor54(...xs) {
	var minus = 0, lbs = 0, rbs = 0;

	for (var i = 0; i < xs.length; ++i) {
		if (xs[i] < 0) {
			xs[i] += 0x20000000000000;
			minus ^= 1;
		}
		lbs ^= xs[i] / 0x80000000;
		rbs ^= xs[i] & 0x7FFFFFFF;
	}

	lbs *= 0x80000000;
	if (minus)
		return -0x20000000000000 + lbs + rbs;
	else
		return lbs + rbs;
}

export function make54(a, b) {
	if (a & 0x200000) {
		if (b < 0) {
			return -0x20000000000000 + (a & 0x1FFFFF) * 0x100000000 + (b + 0x100000000);
		} else {
			return -0x20000000000000 + (a & 0x1FFFFF) * 0x100000000 + b;
		}
	} else {
		if (b < 0) {
			return (a & 0x1FFFFF) * 0x100000000 + (b + 0x100000000);
		} else {
			return (a & 0x1FFFFF) * 0x100000000 + b;
		}
	}
}

export function print32(x) {
	if (0 <= x)
		return (new Array(32).join("0") + x.toString(2)).slice(-32);
	else
		return (new Array(32).join("0") + (x + Math.pow(2,32)).toString(2)).slice(-32);
}

export function print54(x) {
	if (0 <= x)
		return (new Array(54).join("0") + x.toString(2)).slice(-54);
	else
		return "1" + (new Array(53).join("0") + (x + Math.pow(2,53)).toString(2)).slice(-53);
}


export var random = {
	x: 123456789,
	y: 362436069,
	z: 521288629,
	w: 88675123,
	next32() {
		var t = this.x ^ (this.x << 11);
		this.x = this.y;
		this.y = this.z;
		this.z = this.w;
		return this.w = this.w ^ (this.w >>> 19) ^ t ^ (t >>> 8);
	},
};
