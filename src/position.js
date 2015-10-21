"use strict";

export default class Position {

	static get MAX_MOVES_NUM_IN_A_POSITION() {
		return 593;
	}

	constructor() {
		this.player = 0b010000;
		this.board = new Uint8Array(111);
		this.bPieces = new Uint8Array(7);
		this.wPieces = new Uint8Array(7);
		this.hash1 = 0;
		this.history = [];
		this.hash1Counts = {};

		for (let i = 0; i < 10; ++i) {
			this.board[i]       = 0b1000000;
			this.board[i*10+10] = 0b1000000;
			this.board[i+101]   = 0b1000000;
		}

		this.board[11 + 10 * 0 + 0] = 0b100110;
		this.board[11 + 10 * 0 + 1] = 0b100101;
		this.board[11 + 10 * 0 + 2] = 0b100100;
		this.board[11 + 10 * 0 + 3] = 0b100011;
		this.board[11 + 10 * 0 + 4] = 0b101000;
		this.board[11 + 10 * 0 + 5] = 0b100011;
		this.board[11 + 10 * 0 + 6] = 0b100100;
		this.board[11 + 10 * 0 + 7] = 0b100101;
		this.board[11 + 10 * 0 + 8] = 0b100110;
		this.board[11 + 10 * 1 + 1] = 0b100001;
		this.board[11 + 10 * 1 + 7] = 0b100010;

		for (let i = 0; i < 9; ++i)
			this.board[11 + 10 * 2 + i] = 0b100111;

		this.board[11 + 10 * 8 + 0] = 0b010110;
		this.board[11 + 10 * 8 + 1] = 0b010101;
		this.board[11 + 10 * 8 + 2] = 0b010100;
		this.board[11 + 10 * 8 + 3] = 0b010011;
		this.board[11 + 10 * 8 + 4] = 0b011000;
		this.board[11 + 10 * 8 + 5] = 0b010011;
		this.board[11 + 10 * 8 + 6] = 0b010100;
		this.board[11 + 10 * 8 + 7] = 0b010101;
		this.board[11 + 10 * 8 + 8] = 0b010110;
		this.board[11 + 10 * 7 + 1] = 0b010010;
		this.board[11 + 10 * 7 + 7] = 0b010001;

		for (let i = 0; i < 9; ++i)
			this.board[11 + 10 * 6 + i] = 0b010111;
	}

	allMoves(ma, mi) {
		var board = this.board,
		player = this.player,
		opPlayer = player ^ 0b110000,
		pieces = player === 0b010000 ? this.bPieces : this.wPieces,
		fuUsed = 1 << 0;

		for (let i = 11; i < 101; ++i) {
			let sq = board[i],
			promotable = player === 0b010000 ? i < 40 : 70 < i,
			j;

			if (!(sq & player)) continue;
			switch(sq & 0b1111) {
			case 0b1000:
				if (board[j=i-11] === 0 || board[j] & opPlayer)
				{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
				if (board[j=i-10] === 0 || board[j] & opPlayer)
				{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
				if (board[j=i-9]  === 0 || board[j] & opPlayer)
				{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
				if (board[j=i-1]  === 0 || board[j] & opPlayer)
				{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
				if (board[j=i+1]  === 0 || board[j] & opPlayer)
				{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
				if (board[j=i+9]  === 0 || board[j] & opPlayer)
				{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
				if (board[j=i+10] === 0 || board[j] & opPlayer)
				{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
				if (board[j=i+11] === 0 || board[j] & opPlayer)
				{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
				break;
			case 0b1001:
				if (board[j=i-11] === 0 || board[j] & opPlayer) {
					if (promotable || (player === 0b010000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				if (board[j=i-9] === 0 || board[j] & opPlayer) {
					if (promotable || (player === 0b010000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				if (board[j=i+11] === 0 || board[j] & opPlayer) {
					if (promotable || (player === 0b010000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				if (board[j=i+9] === 0 || board[j] & opPlayer) {
					if (promotable || (player === 0b010000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
			case 0b0001:
				for (j = i - 10; board[j] === 0; j -= 10) {
					if (promotable || (player === 0b010000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = 0; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = 0;
				}
				if (board[j] & opPlayer) {
					if (promotable || (player === 0b010000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				for (j = i + 10; board[j] === 0; j += 10) {
					if (promotable || (player === 0b010000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = 0; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = 0;
				}
				if (board[j] & opPlayer) {
					if (promotable || (player === 0b010000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				for (j = i - 1; board[j] === 0; j -= 1) {
					if (promotable)
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = 0; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = 0;
				}
				if (board[j] & opPlayer) {
					if (promotable)
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				for (j = i + 1; board[j] === 0; j += 1) {
					if (promotable)
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = 0; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = 0;
				}
				if (board[j] & opPlayer) {
					if (promotable)
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				break;
			case 0b1010:
				if (board[j=i-10] === 0 || board[j] & opPlayer) {
					if (promotable || (player === 0b010000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				if (board[j=i+10] === 0 || board[j] & opPlayer) {
					if (promotable || (player === 0b010000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				if (board[j=i-1] === 0 || board[j] & opPlayer) {
					if (promotable)
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				if (board[j=i+1] === 0 || board[j] & opPlayer) {
					if (promotable)
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
			case 0b0010:
				for (j = i - 11; board[j] === 0; j -= 11) {
					if (promotable || (player === 0b010000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = 0; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = 0;
				}
				if (board[j] & opPlayer) {
					if (promotable || (player === 0b010000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				for (j = i - 9; board[j] === 0; j -= 9) {
					if (promotable || (player === 0b010000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = 0; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = 0;
				}
				if (board[j] & opPlayer) {
					if (promotable || (player === 0b010000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				for (j = i + 9; board[j] === 0; j += 9) {
					if (promotable || (player === 0b010000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = 0; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = 0;
				}
				if (board[j] & opPlayer) {
					if (promotable || (player === 0b010000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				for (j = i + 11; board[j] === 0; j += 11) {
					if (promotable || (player === 0b010000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = 0; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = 0;
				}
				if (board[j] & opPlayer) {
					if (promotable || (player === 0b010000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				break;
			case 0b0011:
			case 0b1100:
			case 0b1101:
			case 0b1110:
			case 0b1111:
				if (board[j=i-10] === 0 || board[j] & opPlayer)
				{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
				if (board[j=i-1]  === 0 || board[j] & opPlayer)
				{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
				if (board[j=i+1]  === 0 || board[j] & opPlayer)
				{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
				if (board[j=i+10] === 0 || board[j] & opPlayer)
				{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
				if (player === 0b010000) {
					if (board[j=i-11] === 0 || board[j] & opPlayer)
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
					if (board[j=i-9]  === 0 || board[j] & opPlayer)
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
				} else {
					if (board[j=i+9]  === 0 || board[j] & opPlayer)
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
					if (board[j=i+11] === 0 || board[j] & opPlayer)
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
				}
				break;
			case 0b0100:
				if (board[j=i-11] === 0 || board[j] & opPlayer) {
					if (promotable || (player === 0b010000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				if (board[j=i-9]  === 0 || board[j] & opPlayer) {
					if (promotable || (player === 0b010000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				if (board[j=i+9]  === 0 || board[j] & opPlayer) {
					if (promotable || (player === 0b010000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				if (board[j=i+11] === 0 || board[j] & opPlayer) {
					if (promotable || (player === 0b010000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				if (player === 0b010000) {
					if (board[j=i-10] === 0 || board[j] & opPlayer) {
						if (promotable || j < 40)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
						ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
					}
				} else {
					if (board[j=i+10] === 0 || board[j] & opPlayer) {
						if (promotable || 70 < j)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
						ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
					}
				}
				break;
			case 0b0101:
				if (player === 0b010000) {
					if (board[j=i-21] === 0 || board[j] & opPlayer) {
						if (j < 40)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
						if (30 < j)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
					}
					if (board[j=i-19] === 0 || board[j] & opPlayer) {
						if (j < 40)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
						if (30 < j)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
					}
				} else {
					if (board[j=i+19] === 0 || board[j] & opPlayer) {
						if (70 < j)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
						if (j < 80)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
					}
					if (board[j=i+21] === 0 || board[j] & opPlayer) {
						if (70 < j)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
						if (j < 80)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
					}
				}
				break;
			case 0b0110:
				if (player === 0b010000) {
					for (j = i - 10; board[j] === 0; j -= 10) {
						if (j < 40)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = 0; }
						if (20 < j)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = 0; }
					}
					if (board[j] & opPlayer) {
						if (j < 40)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
						if (20 < j)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
					}
				} else {
					for (j = i + 10; board[j] === 0; j += 10) {
						if (70 < j)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = 0; }
						if (j < 90)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = 0; }
					}
					if (board[j] & opPlayer) {
						if (70 < j)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
						if (j < 90)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
					}
				}
				break;
			case 0b0111:
				if (player === 0b010000) {
					if (board[j=i-10] === 0 || board[j] & opPlayer) {
						if (j < 40)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
						if (20 < j)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
					}
				} else {
					if (board[j=i+10] === 0 || board[j] & opPlayer) {
						if (70 < j)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b1000; ma[mi++] = board[j]; }
						if (j < 90)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
					}
				}
				fuUsed |= 1 << i % 10;
				break;
			}
		}

		for (let i = 11; i < 101; ++i) {
			if (board[i] !== 0) continue;
			if (pieces[0])
			{ ma[mi++] = 0b10000000; ma[mi++] = i; mi++; ma[mi++] = 0b0001 | player; ma[mi++] = 0; }
			if (pieces[1])
			{ ma[mi++] = 0b10000001; ma[mi++] = i; mi++; ma[mi++] = 0b0010 | player; ma[mi++] = 0; }
			if (pieces[2])
			{ ma[mi++] = 0b10000010; ma[mi++] = i; mi++; ma[mi++] = 0b0011 | player; ma[mi++] = 0; }
			if (pieces[3])
			{ ma[mi++] = 0b10000011; ma[mi++] = i; mi++; ma[mi++] = 0b0100 | player; ma[mi++] = 0; }
		}
		if (player === 0b010000) {
			if (pieces[4]) {
				for (let i = 31; i < 101; ++i) {
					if (board[i] === 0)
					{ ma[mi++] = 0b10000100; ma[mi++] = i; mi++; ma[mi++] = 0b0101 | 0b010000; ma[mi++] = 0; }
				}
			}
			for (let i = 21; i < 101; ++i) {
				if (board[i] !== 0) continue;
				if (pieces[5])
				{ ma[mi++] = 0b10000101; ma[mi++] = i; mi++; ma[mi++] = 0b0110 | 0b010000; ma[mi++] = 0; }
				if (pieces[6] && !(fuUsed & 1 << i % 10))
				{ ma[mi++] = 0b10000110; ma[mi++] = i; mi++; ma[mi++] = 0b0111 | 0b010000; ma[mi++] = 0; }
			}
		} else {
			if (pieces[4]) {
				for (let i = 11; i < 81; ++i) {
					if (board[i] === 0)
					{ ma[mi++] = 0b10000100; ma[mi++] = i; mi++; ma[mi++] = 0b0101 | 0b100000; ma[mi++] = 0; }
				}
			}
			for (let i = 11; i < 91; ++i) {
				if (board[i] !== 0) continue;
				if (pieces[5])
				{ ma[mi++] = 0b10000101; ma[mi++] = i; mi++; ma[mi++] = 0b0110 | 0b100000; ma[mi++] = 0; }
				if (pieces[6] && !(fuUsed & 1 << i % 10))
				{ ma[mi++] = 0b10000110; ma[mi++] = i; mi++; ma[mi++] = 0b0111 | 0b100000; ma[mi++] = 0; }
			}
		}

		return mi;
	}

	move(move) {
		const fromIdx = move.fromIdx,
		toIdx = move.toIdx,
		to = move.to,
		board = this.board,
		player = this.player;
		this.hash1Counts[this.hash1] = (this.hash1Counts[this.hash1] | 0) + 1;

		if (fromIdx & 0b10000000) {
			board[toIdx] = to;

			if (player === 0b010000)
				this.bPieces[fromIdx & 0b1111111] -= 1;
			else
				this.wPieces[fromIdx & 0b1111111] -= 1;

			this.hash1 ^= (to * (222630977 + (9 << (toIdx & 0b1111)) + toIdx)) ^
				((to & 0b1111) * (0b1010111010111 << (player & 0b10000)));
		} else {
			board[toIdx] = to;
			board[fromIdx] = 0b000000;

			var capture = move.capture;
			if (capture) {
				if (player === 0b010000)
					this.bPieces[(capture & 0b111) - 1] += 1;
				else
					this.wPieces[(capture & 0b111) - 1] += 1;

				this.hash1 ^= (move.from * (222630977 + (9 << (fromIdx & 0b1111)) + fromIdx)) ^
					(to * (222630977 + (9 << (toIdx & 0b1111)) + toIdx)) ^
					(capture * (222630977 + (9 << (toIdx & 0b1111)) + toIdx)) ^
					((capture & 0b1111) * (0b1010111010111 << (player & 0b10000)));
			} else {
				this.hash1 ^= (move.from * (222630977 + (9 << (fromIdx & 0b1111)) + fromIdx)) ^
					(to * (222630977 + (9 << (toIdx & 0b1111)) + toIdx));
			}
		}
		this.player = player ^ 0b110000;
		this.history.push(move);
	}

	unmove() {
		const move = this.history.pop(),
		fromIdx = move.fromIdx,
		toIdx = move.toIdx,
		to = move.to,
		board = this.board,
		player = this.player ^= 0b110000;

		if (fromIdx & 0b10000000) {
			board[toIdx] = 0b000000;

			if (player === 0b010000)
				this.bPieces[fromIdx & 0b1111111] += 1;
			else
				this.wPieces[fromIdx & 0b1111111] += 1;

			this.hash1 ^= (to * (222630977 + (9 << (toIdx & 0b1111)) + toIdx)) ^
				((to & 0b1111) * (0b1010111010111 << (player & 0b10000)));
		} else {
			board[fromIdx] = move.from;

			var capture = move.capture;
			if (capture) {
				board[toIdx] = capture;

				if (player === 0b010000)
					this.bPieces[(capture & 0b111) - 1] -= 1;
				else
					this.wPieces[(capture & 0b111) - 1] -= 1;

				this.hash1 ^= (move.from * (222630977 + (9 << (fromIdx & 0b1111)) + fromIdx)) ^
					(to * (222630977 + (9 << (toIdx & 0b1111)) + toIdx)) ^
					(capture * (222630977 + (9 << (toIdx & 0b1111)) + toIdx)) ^
					((capture & 0b1111) * (0b1010111010111 << (player & 0b10000)));
			} else {
				board[toIdx] = 0b000000;

				this.hash1 ^= (move.from * (222630977 + (9 << (fromIdx & 0b1111)) + fromIdx)) ^
					(to * (222630977 + (9 << (toIdx & 0b1111)) + toIdx));
			}
		}
		this.hash1Counts[this.hash1] -= 1;
	}

	move_(ma, mi) {
		const fromIdx = ma[mi],
		toIdx = ma[mi+1],
		to = ma[mi+3],
		board = this.board,
		player = this.player;

		if (fromIdx & 0b10000000) {
			board[toIdx] = to;

			if (player === 0b010000)
				this.bPieces[fromIdx & 0b1111111] -= 1;
			else
				this.wPieces[fromIdx & 0b1111111] -= 1;

			this.hash1 ^= (to * (222630977 + (9 << (toIdx & 0b1111)) + toIdx)) ^
				((to & 0b1111) * (0b1010111010111 << (player & 0b10000)));
		} else {
			board[toIdx] = to;
			board[fromIdx] = 0b000000;

			var capture = ma[mi+4];
			if (capture) {
				if (player === 0b010000)
					this.bPieces[(capture & 0b111) - 1] += 1;
				else
					this.wPieces[(capture & 0b111) - 1] += 1;

				this.hash1 ^= (ma[mi+2] * (222630977 + (9 << (fromIdx & 0b1111)) + fromIdx)) ^
					(ma[mi+2] * (222630977 + (9 << (toIdx & 0b1111)) + toIdx)) ^
					(capture * (222630977 + (9 << (toIdx & 0b1111)) + toIdx)) ^
					((capture & 0b1111) * (0b1010111010111 << (player & 0b10000)));
			} else {
				this.hash1 ^= (ma[mi+2] * (222630977 + (9 << (fromIdx & 0b1111)) + fromIdx)) ^
					(to * (222630977 + (9 << (toIdx & 0b1111)) + toIdx));
			}
		}
		this.player = player ^ 0b110000;
	}

	unmove_(ma, mi) {
		const fromIdx = ma[mi],
		toIdx = ma[mi+1],
		to = ma[mi+3],
		board = this.board,
		player = this.player ^= 0b110000;

		if (fromIdx & 0b10000000) {
			board[toIdx] = 0b000000;

			if (player === 0b010000)
				this.bPieces[fromIdx & 0b1111111] += 1;
			else
				this.wPieces[fromIdx & 0b1111111] += 1;

			this.hash1 ^= (to * (222630977 + (9 << (toIdx & 0b1111)) + toIdx)) ^
				((to & 0b1111) * (0b1010111010111 << (player & 0b10000)));
		} else {
			board[fromIdx] = ma[mi+2];

			var capture = ma[mi+4];
			if (capture) {
				board[toIdx] = capture;

				if (player === 0b010000)
					this.bPieces[(capture & 0b111) - 1] -= 1;
				else
					this.wPieces[(capture & 0b111) - 1] -= 1;

				this.hash1 ^= (ma[mi+2] * (222630977 + (9 << (fromIdx & 0b1111)) + fromIdx)) ^
					(ma[mi+2] * (222630977 + (9 << (toIdx & 0b1111)) + toIdx)) ^
					(capture * (222630977 + (9 << (toIdx & 0b1111)) + toIdx)) ^
					((capture & 0b1111) * (0b1010111010111 << (player & 0b10000)));
			} else {
				board[toIdx] = 0b000000;

				this.hash1 ^= (ma[mi+2] * (222630977 + (9 << (fromIdx & 0b1111)) + fromIdx)) ^
					(to * (222630977 + (9 << (toIdx & 0b1111)) + toIdx));
			}
		}
	}

	isIgnoreCheck() {
		var moveArray = new Uint8Array(Position.MAX_MOVES_NUM_IN_A_POSITION * 5),
		mi = this.allMoves(moveArray, 0);
		for (var i = 0; i < mi; i += 5)
			if ((moveArray[i+4] & 0b1111) === 0b1000)
				return true;;
		return false;
	}

	isSennichite() {
		return this.hash1Counts[this.hash1] === 3;
	}

	canMove(fromIdx, toIdx) {
		var moveArray = new Uint8Array(Position.MAX_MOVES_NUM_IN_A_POSITION * 5),
		mi = this.allMoves(moveArray, 0),
		result = 0;
		for (var i = 0; i < mi; i += 5)
			if (moveArray[i] === fromIdx && moveArray[i+1] === toIdx)
				result |= (moveArray[i+2] === moveArray[i+3]) ? 1 : 2;
		return result;
	}

}


module.exports = Position;
