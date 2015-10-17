"use strict"

export default class Position {

	static get MAX_MOVES_NUM_IN_A_POSITION() {
		return 593; // 593
	}

	constructor() {
		this.player = 0b0100000;
		this.board = new Uint8Array(111);
		this.bPieces = new Uint8Array(7);
		this.wPieces = new Uint8Array(7);
		this.history = [];

		for (let i = 0; i < 10; ++i) {
			this.board[i]       = 0b10000000;
			this.board[i*10+10] = 0b10000000;
			this.board[i+101]   = 0b10000000;
		}

		this.board[11 + 10 * 0 + 0] = 0b1000111;
		this.board[11 + 10 * 0 + 1] = 0b1000110;
		this.board[11 + 10 * 0 + 2] = 0b1000101;
		this.board[11 + 10 * 0 + 3] = 0b1000100;
		this.board[11 + 10 * 0 + 4] = 0b1000001;
		this.board[11 + 10 * 0 + 5] = 0b1000100;
		this.board[11 + 10 * 0 + 6] = 0b1000101;
		this.board[11 + 10 * 0 + 7] = 0b1000110;
		this.board[11 + 10 * 0 + 8] = 0b1000111;
		this.board[11 + 10 * 1 + 1] = 0b1000010;
		this.board[11 + 10 * 1 + 7] = 0b1000011;

		for (let i = 0; i < 9; ++i)
			this.board[11 + 10 * 2 + i] = 0b1001000;

		this.board[11 + 10 * 8 + 0] = 0b0100111;
		this.board[11 + 10 * 8 + 1] = 0b0100110;
		this.board[11 + 10 * 8 + 2] = 0b0100101;
		this.board[11 + 10 * 8 + 3] = 0b0100100;
		this.board[11 + 10 * 8 + 4] = 0b0100001;
		this.board[11 + 10 * 8 + 5] = 0b0100100;
		this.board[11 + 10 * 8 + 6] = 0b0100101;
		this.board[11 + 10 * 8 + 7] = 0b0100110;
		this.board[11 + 10 * 8 + 8] = 0b0100111;
		this.board[11 + 10 * 7 + 1] = 0b0100011;
		this.board[11 + 10 * 7 + 7] = 0b0100010;

		for (let i = 0; i < 9; ++i)
			this.board[11 + 10 * 6 + i] = 0b0101000;
	}

	allMoves(ma, mi) {
		var board = this.board,
		player = this.player,
		opPlayer = player ^ 0b1100000,
		pieces = player === 0b0100000 ? this.bPieces : this.wPieces,
		fuUsed = 1 << 0;

		for (let i = 11; i < 101; ++i) {
			let sq = board[i],
			promotable = player === 0b0100000 ? i < 40 : 70 < i,
			j;

			if (!(sq & player)) continue;
			switch(sq & 0b11111) {
			case 0b00001:
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
			case 0b10010:
				if (board[j=i-11] === 0 || board[j] & opPlayer) {
					if (promotable || (player === 0b0100000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				if (board[j=i-9] === 0 || board[j] & opPlayer) {
					if (promotable || (player === 0b0100000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				if (board[j=i+11] === 0 || board[j] & opPlayer) {
					if (promotable || (player === 0b0100000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				if (board[j=i+9] === 0 || board[j] & opPlayer) {
					if (promotable || (player === 0b0100000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
			case 0b00010:
				for (j = i - 10; board[j] === 0; j -= 10) {
					if (promotable || (player === 0b0100000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = 0; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = 0;
				}
				if (board[j] & opPlayer) {
					if (promotable || (player === 0b0100000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				for (j = i + 10; board[j] === 0; j += 10) {
					if (promotable || (player === 0b0100000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = 0; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = 0;
				}
				if (board[j] & opPlayer) {
					if (promotable || (player === 0b0100000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				for (j = i - 1; board[j] === 0; j -= 1) {
					if (promotable)
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = 0; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = 0;
				}
				if (board[j] & opPlayer) {
					if (promotable)
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				for (j = i + 1; board[j] === 0; j += 1) {
					if (promotable)
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = 0; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = 0;
				}
				if (board[j] & opPlayer) {
					if (promotable)
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				break;
			case 0b10011:
				if (board[j=i-10] === 0 || board[j] & opPlayer) {
					if (promotable || (player === 0b0100000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				if (board[j=i+10] === 0 || board[j] & opPlayer) {
					if (promotable || (player === 0b0100000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				if (board[j=i-1] === 0 || board[j] & opPlayer) {
					if (promotable)
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				if (board[j=i+1] === 0 || board[j] & opPlayer) {
					if (promotable)
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
			case 0b00011:
				for (j = i - 11; board[j] === 0; j -= 11) {
					if (promotable || (player === 0b0100000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = 0; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = 0;
				}
				if (board[j] & opPlayer) {
					if (promotable || (player === 0b0100000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				for (j = i - 9; board[j] === 0; j -= 9) {
					if (promotable || (player === 0b0100000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = 0; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = 0;
				}
				if (board[j] & opPlayer) {
					if (promotable || (player === 0b0100000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				for (j = i + 9; board[j] === 0; j += 9) {
					if (promotable || (player === 0b0100000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = 0; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = 0;
				}
				if (board[j] & opPlayer) {
					if (promotable || (player === 0b0100000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				for (j = i + 11; board[j] === 0; j += 11) {
					if (promotable || (player === 0b0100000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = 0; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = 0;
				}
				if (board[j] & opPlayer) {
					if (promotable || (player === 0b0100000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				break;
			case 0b00100:
			case 0b10101:
			case 0b10110:
			case 0b10111:
			case 0b11000:
				if (board[j=i-10] === 0 || board[j] & opPlayer)
				{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
				if (board[j=i-1]  === 0 || board[j] & opPlayer)
				{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
				if (board[j=i+1]  === 0 || board[j] & opPlayer)
				{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
				if (board[j=i+10] === 0 || board[j] & opPlayer)
				{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
				if (player === 0b0100000) {
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
			case 0b00101:
				if (board[j=i-11] === 0 || board[j] & opPlayer) {
					if (promotable || (player === 0b0100000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				if (board[j=i-9]  === 0 || board[j] & opPlayer) {
					if (promotable || (player === 0b0100000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				if (board[j=i+9]  === 0 || board[j] & opPlayer) {
					if (promotable || (player === 0b0100000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				if (board[j=i+11] === 0 || board[j] & opPlayer) {
					if (promotable || (player === 0b0100000 ? j < 40 : 70 < j))
					{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
					ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
				}
				if (player === 0b0100000) {
					if (board[j=i-10] === 0 || board[j] & opPlayer) {
						if (promotable || j < 40)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
						ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
					}
				} else {
					if (board[j=i+10] === 0 || board[j] & opPlayer) {
						if (promotable || 70 < j)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
						ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j];
					}
				}
				break;
			case 0b00110:
				if (player === 0b0100000) {
					if (board[j=i-21] === 0 || board[j] & opPlayer) {
						if (j < 40)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
						if (30 < j)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
					}
					if (board[j=i-19] === 0 || board[j] & opPlayer) {
						if (j < 40)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
						if (30 < j)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
					}
				} else {
					if (board[j=i+19] === 0 || board[j] & opPlayer) {
						if (70 < j)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
						if (j < 80)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
					}
					if (board[j=i+21] === 0 || board[j] & opPlayer) {
						if (70 < j)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
						if (j < 80)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
					}
				}
				break;
			case 0b00111:
				if (player === 0b0100000) {
					for (j = i - 10; board[j] === 0; j -= 10) {
						if (j < 40)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = 0; }
						if (20 < j)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = 0; }
					}
					if (board[j] & opPlayer) {
						if (j < 40)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
						if (20 < j)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
					}
				} else {
					for (j = i + 10; board[j] === 0; j += 10) {
						if (70 < j)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = 0; }
						if (j < 90)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = 0; }
					}
					if (board[j] & opPlayer) {
						if (70 < j)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
						if (j < 90)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
					}
				}
				break;
			case 0b01000:
				if (player === 0b0100000) {
					if (board[j=i-10] === 0 || board[j] & opPlayer) {
						if (j < 40)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
						if (20 < j)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq; ma[mi++] = board[j]; }
					}
				} else {
					if (board[j=i+10] === 0 || board[j] & opPlayer) {
						if (70 < j)
						{ ma[mi++] = i; ma[mi++] = j; ma[mi++] = sq; ma[mi++] = sq | 0b10000; ma[mi++] = board[j]; }
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
			{ ma[mi++] = 0b10000000; ma[mi++] = i; mi++; ma[mi++] = 0b00010 | player; mi++; }
			if (pieces[1])
			{ ma[mi++] = 0b10000001; ma[mi++] = i; mi++; ma[mi++] = 0b00011 | player; mi++; }
			if (pieces[2])
			{ ma[mi++] = 0b10000010; ma[mi++] = i; mi++; ma[mi++] = 0b00100 | player; mi++; }
			if (pieces[3])
			{ ma[mi++] = 0b10000011; ma[mi++] = i; mi++; ma[mi++] = 0b00101 | player; mi++; }
		}
		if (player === 0b0100000) {
			if (pieces[4]) {
				for (let i = 31; i < 101; ++i) {
					if (board[i] === 0)
					{ ma[mi++] = 0b10000100; ma[mi++] = i; mi++; ma[mi++] = 0b00110 | 0b0100000; mi++; }
				}
			}
			for (let i = 21; i < 101; ++i) {
				if (board[i] !== 0) continue;
				if (pieces[5])
				{ ma[mi++] = 0b10000101; ma[mi++] = i; mi++; ma[mi++] = 0b00111 | 0b0100000; mi++; }
				if (pieces[6] && !(fuUsed & 1 << i % 10))
				{ ma[mi++] = 0b10000110; ma[mi++] = i; mi++; ma[mi++] = 0b01000 | 0b0100000; mi++; }
			}
		} else {
			if (pieces[4]) {
				for (let i = 11; i < 81; ++i) {
					if (board[i] === 0)
					{ ma[mi++] = 0b10000100; ma[mi++] = i; mi++; ma[mi++] = 0b00110 | 0b1000000; mi++; }
				}
			}
			for (let i = 11; i < 91; ++i) {
				if (board[i] !== 0) continue;
				if (pieces[5])
				{ ma[mi++] = 0b10000101; ma[mi++] = i; mi++; ma[mi++] = 0b00111 | 0b1000000; mi++; }
				if (pieces[6] && !(fuUsed & 1 << i % 10))
				{ ma[mi++] = 0b10000110; ma[mi++] = i; mi++; ma[mi++] = 0b01000 | 0b1000000; mi++; }
			}
		}

		return mi;
	}

	move(move) {
		const fromIdx = move.fromIdx,
		toIdx = move.toIdx,
		board = this.board,
		player = this.player;

		if (fromIdx & 0b10000000) {
			board[toIdx] = move.to;

			if (player & 0b0100000)
				this.bPieces[fromIdx & 0b1111111] -= 1;
			else
				this.wPieces[fromIdx & 0b1111111] -= 1;
		} else {
			board[toIdx] = move.to;
			board[fromIdx] = 0b0000000;

			var capture = move.capture;
			if (capture) {
				if (player & 0b0100000)
					this.bPieces[PIECES_INDEX_TABLE[capture & 0b1111]] += 1;
				else
					this.wPieces[PIECES_INDEX_TABLE[capture & 0b1111]] += 1;
			}
		}
		this.player = player ^ 0b1100000;
		this.history.push(move);
	}

	unmove() {
		const move = this.history.pop(),
		fromIdx = move.fromIdx,
		toIdx = move.toIdx,
		board = this.board,
		player = this.player ^= 0b1100000;

		if (fromIdx & 0b10000000) {
			board[toIdx] = 0b0000000;

			if (player & 0b0100000)
				this.bPieces[fromIdx & 0b1111111] += 1;
			else
				this.wPieces[fromIdx & 0b1111111] += 1;
		} else {
			board[fromIdx] = move.from;

			var capture = move.capture;
			if (capture) {
				board[toIdx] = capture;

				if (player & 0b0100000)
					this.bPieces[PIECES_INDEX_TABLE[capture & 0b1111]] -= 1;
				else
					this.wPieces[PIECES_INDEX_TABLE[capture & 0b1111]] -= 1;
			} else {
				board[toIdx] = 0b0000000;
			}
		}
	}

	move_(ma, mi) {
		const fromIdx = ma[mi],
		toIdx = ma[mi+1],
		board = this.board,
		player = this.player;

		if (fromIdx & 0b10000000) {
			board[toIdx] = ma[mi+3];

			if (player & 0b0100000)
				this.bPieces[fromIdx & 0b1111111] -= 1;
			else
				this.wPieces[fromIdx & 0b1111111] -= 1;
		} else {
			board[toIdx] = ma[mi+3];
			board[fromIdx] = 0b0000000;

			var capture = ma[mi+4];
			if (capture) {
				if (player & 0b0100000)
					this.bPieces[PIECES_INDEX_TABLE[capture & 0b1111]] += 1;
				else
					this.wPieces[PIECES_INDEX_TABLE[capture & 0b1111]] += 1;
			}
		}
		this.player = player ^ 0b1100000;
	}

	unmove_(ma, mi) {
		const fromIdx = ma[mi],
		toIdx = ma[mi+1],
		board = this.board,
		player = this.player ^= 0b1100000;

		if (fromIdx & 0b10000000) {
			board[toIdx] = 0b0000000;

			if (player & 0b0100000)
				this.bPieces[fromIdx & 0b1111111] += 1;
			else
				this.wPieces[fromIdx & 0b1111111] += 1;
		} else {
			board[fromIdx] = ma[mi+2];

			var capture = ma[mi+4];
			if (capture) {
				board[toIdx] = capture;

				if (player & 0b0100000)
					this.bPieces[PIECES_INDEX_TABLE[capture & 0b1111]] -= 1;
				else
					this.wPieces[PIECES_INDEX_TABLE[capture & 0b1111]] -= 1;
			} else {
				board[toIdx] = 0b0000000;
			}
		}
	}

	canMove(fromIdx, toIdx) {
		var moveArray = new Uint8Array(Position.MAX_MOVES_NUM_IN_A_POSITION * 5),
		mi = this.allMoves(moveArray, 0),
		result = 0;
		for (var i = 0; i < mi; i += 5)
			if (moveArray[i] == fromIdx && moveArray[i+1] == toIdx)
				result |= moveArray[i+2] === moveArray[i+3] ? 1 : 2;
		return result;
	}

}


const PIECES_INDEX_TABLE = {
	0b0010: 0,
	0b0011: 1,
	0b0100: 2,
	0b0101: 3,
	0b0110: 4,
	0b0111: 5,
	0b1000: 6,
};


module.exports = Position;
