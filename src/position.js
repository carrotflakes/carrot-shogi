"use strict";

import * as bits from "./bits.js";


export default class Position {

	static get MAX_MOVES_NUM_IN_A_POSITION() {
		return 593;
	}

	constructor(position) {
		this.board = new Uint8Array(111);
		this.bPieces = new Uint8Array(7);
		this.wPieces = new Uint8Array(7);
		this.hashCountTable = new Int8Array(1 << 22);

		if (position instanceof Position) {
			this.player = position.player;
			this.bKing = position.bKing;
			this.wKing = position.wKing;
			this.hash1 = position.hash1;
			this.hash2 = position.hash2;
			this.history = position.history.concat();
			this.check = position.check;

			for (let i = 0; i < 7; ++i)
				this.bPieces[i] = position.bPieces[i], this.wPieces[i] = position.wPieces[i];
			for (let i = 0; i < 111; ++i)
				this.board[i] = position.board[i];
		} else {
			this.player = 0b010000;
			this.bKing = 11 + 10 * 8 + 4;
			this.wKing = 11 + 10 * 0 + 4;
			this.hash1 = 0;
			this.hash2 = ~new Date().getTime();
			this.history = [];
			this.check = false;

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
	}

	allMoves(ma, mi, exceptDrops) {
		var board = this.board,
		player = this.player | 0,
		opPlayer = player ^ 0b110000,
		fuUsed = 1 << 0;

		for (var i = 11; i < 100; i=i+1|0) {
			let sq = board[i] | 0;

			if (!(sq & player)) continue;

			let promotable = player === 0b010000 ? i < 40 : 70 < i, j;
			switch(sq & 0b1111) {
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
			}
		}

		if (exceptDrops)
			return mi;

		var pieces = player === 0b010000 ? this.bPieces : this.wPieces;
		for (var i = 11; i < 100; ++i) {
			if (board[i] !== 0) continue;
			if (pieces[0])
			{ ma[mi++] = 0; ma[mi++] = i; mi++; ma[mi++] = 0b0001 | player; ma[mi++] = 0; }
			if (pieces[1])
			{ ma[mi++] = 1; ma[mi++] = i; mi++; ma[mi++] = 0b0010 | player; ma[mi++] = 0; }
			if (pieces[2])
			{ ma[mi++] = 2; ma[mi++] = i; mi++; ma[mi++] = 0b0011 | player; ma[mi++] = 0; }
			if (pieces[3])
			{ ma[mi++] = 3; ma[mi++] = i; mi++; ma[mi++] = 0b0100 | player; ma[mi++] = 0; }
		}
		if (player === 0b010000) {
			if (pieces[4]) {
				for (var i = 31; i < 100; ++i) {
					if (board[i] === 0)
					{ ma[mi++] = 4; ma[mi++] = i; mi++; ma[mi++] = 0b0101 | 0b010000; ma[mi++] = 0; }
				}
			}
			for (var i = 21; i < 100; ++i) {
				if (board[i] !== 0) continue;
				if (pieces[5])
				{ ma[mi++] = 5; ma[mi++] = i; mi++; ma[mi++] = 0b0110 | 0b010000; ma[mi++] = 0; }
				if (pieces[6] && !(fuUsed & 1 << i % 10))
				{ ma[mi++] = 6; ma[mi++] = i; mi++; ma[mi++] = 0b0111 | 0b010000; ma[mi++] = 0; }
			}
		} else {
			if (pieces[4]) {
				for (var i = 11; i < 81; ++i) {
					if (board[i] === 0)
					{ ma[mi++] = 4; ma[mi++] = i; mi++; ma[mi++] = 0b0101 | 0b100000; ma[mi++] = 0; }
				}
			}
			for (var i = 11; i < 91; ++i) {
				if (board[i] !== 0) continue;
				if (pieces[5])
				{ ma[mi++] = 5; ma[mi++] = i; mi++; ma[mi++] = 0b0110 | 0b100000; ma[mi++] = 0; }
				if (pieces[6] && !(fuUsed & 1 << i % 10))
				{ ma[mi++] = 6; ma[mi++] = i; mi++; ma[mi++] = 0b0111 | 0b100000; ma[mi++] = 0; }
			}
		}

		return mi;
	}

	allEvasionMove(ma, mi, exceptDrops) {
		var board = this.board,
		player = this.player,
		opPlayer = player ^ 0b110000,
		king = player === 0b010000 ? this.bKing : this.wKing,
		fu = 0b0111 | player,
		fuUsed = 1 << 0;

		for (var i = 11; i < 100; ++i)
			if (board[i] === fu)
				fuUsed |= 1 << i % 10;

    // 玉を逃がす or 玉で王手している駒を取る
		
    // 王手している駒を取る 玉以外で
    // 動かして合駒
    // 打って合駒
	}

	doMove(move) {
		const fromIdx = move.fromIdx,
		toIdx = move.toIdx,
		to = move.to,
		board = this.board,
		player = this.player;

		var hashCountTableKey = this.hash1 & 0x7FFFFF;
		this.hashCountTable[hashCountTableKey >>> 1] += 1 << (hashCountTableKey & 1) * 4;

		if (fromIdx & 0b1111000) {
			board[toIdx] = to;
			board[fromIdx] = 0b000000;

			if (to === 0b011000)
				this.bKing = toIdx;
			else if (to === 0b101000)
				this.wKing = toIdx;

			var capture = move.capture;
			if (capture) {
				if (player === 0b010000)
					this.bPieces[(capture & 0b111) - 1] += 1;
				else
					this.wPieces[(capture & 0b111) - 1] += 1;

				this.hash1 ^= HASH_SEEDS[move.from | fromIdx << 6] ^
					HASH_SEEDS[to | toIdx << 6] ^
					HASH_SEEDS[capture | toIdx << 6] ^
					HASH_SEEDS[capture];
				this.hash2 ^= HASH_SEEDS[move.from << 7 | fromIdx] ^
					HASH_SEEDS[to << 7 | toIdx] ^
					HASH_SEEDS[capture << 7 | toIdx] ^
					HASH_SEEDS[capture << 7];
			} else {
				this.hash1 ^= HASH_SEEDS[move.from | fromIdx << 6] ^
					HASH_SEEDS[to | toIdx << 6];
				this.hash2 ^= HASH_SEEDS[move.from << 7 | fromIdx] ^
					HASH_SEEDS[to << 7 | toIdx];
			}
		} else {
			board[toIdx] = to;

			if (player === 0b010000)
				this.bPieces[fromIdx] -= 1;
			else
				this.wPieces[fromIdx] -= 1;

			this.hash1 ^= HASH_SEEDS[to | toIdx << 6] ^
				HASH_SEEDS[to];
			this.hash2 ^= HASH_SEEDS[to << 7 | toIdx] ^
				HASH_SEEDS[to << 7];
		}
		this.player = player ^ 0b110000;
		this.history.push(move);
		this.check = this.inCheck();
	}

	undoMove() {
		const move = this.history.pop(),
		fromIdx = move.fromIdx,
		toIdx = move.toIdx,
		to = move.to,
		board = this.board,
		player = this.player ^= 0b110000;

		if (fromIdx & 0b1111000) {
			board[fromIdx] = move.from;

			if (to === 0b011000)
				this.bKing = fromIdx;
			else if (to === 0b101000)
				this.wKing = fromIdx;

			var capture = move.capture;
			if (capture) {
				board[toIdx] = capture;

				if (player === 0b010000)
					this.bPieces[(capture & 0b111) - 1] -= 1;
				else
					this.wPieces[(capture & 0b111) - 1] -= 1;

				this.hash1 ^= HASH_SEEDS[move.from | fromIdx << 6] ^
					HASH_SEEDS[to | toIdx << 6] ^
					HASH_SEEDS[capture | toIdx << 6] ^
					HASH_SEEDS[capture];
				this.hash2 ^= HASH_SEEDS[move.from << 7 | fromIdx] ^
					HASH_SEEDS[to << 7 | toIdx] ^
					HASH_SEEDS[capture << 7 | toIdx] ^
					HASH_SEEDS[capture << 7];
			} else {
				board[toIdx] = 0b000000;

				this.hash1 ^= HASH_SEEDS[move.from | fromIdx << 6] ^
					HASH_SEEDS[to | toIdx << 6];
				this.hash2 ^= HASH_SEEDS[move.from << 7 | fromIdx] ^
					HASH_SEEDS[to << 7 | toIdx];
			}
		} else {
			board[toIdx] = 0b000000;

			if (player === 0b010000)
				this.bPieces[fromIdx] += 1;
			else
				this.wPieces[fromIdx] += 1;

			this.hash1 ^= HASH_SEEDS[to | toIdx << 6] ^
				HASH_SEEDS[to];
			this.hash2 ^= HASH_SEEDS[to << 7 | toIdx] ^
				HASH_SEEDS[to << 7];
		}

		var hashCountTableKey = this.hash1 & 0x7FFFFF;
		this.hashCountTable[hashCountTableKey >>> 1] -= 1 << (hashCountTableKey & 1) * 4;

		this.check = this.inCheck();
	}

	doMoveFast(ma, mi) {
		const fromIdx = ma[mi] | 0,
		toIdx = ma[mi+1] | 0,
		to = ma[mi+3] | 0,
		board = this.board,
		player = this.player | 0;

		if (fromIdx & 0b1111000) {
			board[toIdx] = to;
			board[fromIdx] = 0b000000;

			if (to === 0b011000)
				this.bKing = toIdx;
			else if (to === 0b101000)
				this.wKing = toIdx;

			var capture = ma[mi+4];
			if (capture) {
				if (player === 0b010000)
					this.bPieces[(capture & 0b111) - 1] += 1;
				else
					this.wPieces[(capture & 0b111) - 1] += 1;

				this.hash1 ^= HASH_SEEDS[ma[mi+2] | fromIdx << 6] ^
					HASH_SEEDS[to | toIdx << 6] ^
					HASH_SEEDS[capture | toIdx << 6] ^
					HASH_SEEDS[capture];
				this.hash2 ^= HASH_SEEDS[ma[mi+2] << 7 | fromIdx] ^
					HASH_SEEDS[to << 7 | toIdx] ^
					HASH_SEEDS[capture << 7 | toIdx] ^
					HASH_SEEDS[capture << 7];
			} else {
				this.hash1 ^= HASH_SEEDS[ma[mi+2] | fromIdx << 6] ^
					HASH_SEEDS[to | toIdx << 6];
				this.hash2 ^= HASH_SEEDS[ma[mi+2] << 7 | fromIdx] ^
					HASH_SEEDS[to << 7 | toIdx];
			}
		} else {
			board[toIdx] = to;

			if (player === 0b010000)
				this.bPieces[fromIdx] -= 1;
			else
				this.wPieces[fromIdx] -= 1;

			this.hash1 ^= HASH_SEEDS[to | toIdx << 6] ^
				HASH_SEEDS[to];
			this.hash2 ^= HASH_SEEDS[to << 7 | toIdx] ^
				HASH_SEEDS[to << 7];
		}
		this.player = player ^ 0b110000;
	}

	undoMoveFast(ma, mi) {
		const fromIdx = ma[mi] | 0,
		toIdx = ma[mi+1] | 0,
		to = ma[mi+3] | 0,
		board = this.board,
		player = this.player ^= 0b110000;

		if (fromIdx & 0b1111000) {
			board[fromIdx] = ma[mi+2];

			if (to === 0b011000)
				this.bKing = fromIdx;
			else if (to === 0b101000)
				this.wKing = fromIdx;

			var capture = ma[mi+4];
			if (capture) {
				board[toIdx] = capture;

				if (player === 0b010000)
					this.bPieces[(capture & 0b111) - 1] -= 1;
				else
					this.wPieces[(capture & 0b111) - 1] -= 1;

				this.hash1 ^= HASH_SEEDS[ma[mi+2] | fromIdx << 6] ^
					HASH_SEEDS[to | toIdx << 6] ^
					HASH_SEEDS[capture | toIdx << 6] ^
					HASH_SEEDS[capture];
				this.hash2 ^= HASH_SEEDS[ma[mi+2] << 7 | fromIdx] ^
					HASH_SEEDS[to << 7 | toIdx] ^
					HASH_SEEDS[capture << 7 | toIdx] ^
					HASH_SEEDS[capture << 7];
			} else {
				board[toIdx] = 0b000000;

				this.hash1 ^= HASH_SEEDS[ma[mi+2] | fromIdx << 6] ^
					HASH_SEEDS[to | toIdx << 6];
				this.hash2 ^= HASH_SEEDS[ma[mi+2] << 7 | fromIdx] ^
					HASH_SEEDS[to << 7 | toIdx];
			}
		} else {
			board[toIdx] = 0b000000;

			if (player === 0b010000)
				this.bPieces[fromIdx] += 1;
			else
				this.wPieces[fromIdx] += 1;

			this.hash1 ^= HASH_SEEDS[to | toIdx << 6] ^
				HASH_SEEDS[to];
			this.hash2 ^= HASH_SEEDS[to << 7 | toIdx] ^
				HASH_SEEDS[to << 7];
		}
	}

	isEffectedSquare(index, player) {
		var board = this.board, sq;
		if (player === 0b010000) {
			if ((sq = board[index+11]) & 0b010000 && 0b1111011000011100 >>> (sq & 0b1111) & 1 ||
					(sq = board[index+ 9]) & 0b010000 && 0b1111011000011100 >>> (sq & 0b1111) & 1 ||
					(sq = board[index+10]) & 0b010000 && 0b1111011011011010 >>> (sq & 0b1111) & 1 ||
					(sq = board[index- 1]) & 0b010000 && 0b1111011000001010 >>> (sq & 0b1111) & 1 ||
					(sq = board[index+ 1]) & 0b010000 && 0b1111011000001010 >>> (sq & 0b1111) & 1 ||
					(sq = board[index-10]) & 0b010000 && 0b1111011000001010 >>> (sq & 0b1111) & 1 ||
					(sq = board[index- 9]) & 0b010000 && 0b0000011000010100 >>> (sq & 0b1111) & 1 ||
					(sq = board[index-11]) & 0b010000 && 0b0000011000010100 >>> (sq & 0b1111) & 1 ||
					board[index+21] === 0b010101 || board[index+19] === 0b010101)
				return true;
			for (var i = index + 10; board[i] === 0; i += 10);
			if (board[i] === 0b010110 || (board[i] & 0b110111) === 0b010001) return true;
			for (var i = index +  1; board[i] === 0; i +=  1);
			if ((board[i] & 0b110111) === 0b010001) return true;
			for (var i = index -  1; board[i] === 0; i -=  1);
			if ((board[i] & 0b110111) === 0b010001) return true;
			for (var i = index - 10; board[i] === 0; i -= 10);
			if ((board[i] & 0b110111) === 0b010001) return true;
			for (var i = index + 11; board[i] === 0; i += 11);
			if ((board[i] & 0b110111) === 0b010010) return true;
			for (var i = index +  9; board[i] === 0; i +=  9);
			if ((board[i] & 0b110111) === 0b010010) return true;
			for (var i = index -  9; board[i] === 0; i -=  9);
			if ((board[i] & 0b110111) === 0b010010) return true;
			for (var i = index - 11; board[i] === 0; i -= 11);
			if ((board[i] & 0b110111) === 0b010010) return true;
		} else {
			if ((sq = board[index-11]) & 0b100000 && 0b1111011000011100 >>> (sq & 0b1111) & 1 ||
					(sq = board[index- 9]) & 0b100000 && 0b1111011000011100 >>> (sq & 0b1111) & 1 ||
					(sq = board[index-10]) & 0b100000 && 0b1111011011011010 >>> (sq & 0b1111) & 1 ||
					(sq = board[index- 1]) & 0b100000 && 0b1111011000001010 >>> (sq & 0b1111) & 1 ||
					(sq = board[index+ 1]) & 0b100000 && 0b1111011000001010 >>> (sq & 0b1111) & 1 ||
					(sq = board[index+10]) & 0b100000 && 0b1111011000001010 >>> (sq & 0b1111) & 1 ||
					(sq = board[index+ 9]) & 0b100000 && 0b0000011000010100 >>> (sq & 0b1111) & 1 ||
					(sq = board[index+11]) & 0b100000 && 0b0000011000010100 >>> (sq & 0b1111) & 1 ||
					board[index-21] === 0b100101 || board[index-19] === 0b100101)
				return true;
			for (var i = index - 10; board[i] === 0; i -= 10);
			if (board[i] === 0b100110 || (board[i] & 0b110111) === 0b100001) return true;
			for (var i = index -  1; board[i] === 0; i -=  1);
			if ((board[i] & 0b110111) === 0b100001) return true;
			for (var i = index +  1; board[i] === 0; i +=  1);
			if ((board[i] & 0b110111) === 0b100001) return true;
			for (var i = index + 10; board[i] === 0; i += 10);
			if ((board[i] & 0b110111) === 0b100001) return true;
			for (var i = index - 11; board[i] === 0; i -= 11);
			if ((board[i] & 0b110111) === 0b100010) return true;
			for (var i = index -  9; board[i] === 0; i -=  9);
			if ((board[i] & 0b110111) === 0b100010) return true;
			for (var i = index +  9; board[i] === 0; i +=  9);
			if ((board[i] & 0b110111) === 0b100010) return true;
			for (var i = index + 11; board[i] === 0; i += 11);
			if ((board[i] & 0b110111) === 0b100010) return true;
		}
		return false;
	}

	inCheck() {
		if (this.player === 0b010000)
			return this.isEffectedSquare(this.bKing, 0b100000);
		else
			return this.isEffectedSquare(this.wKing, 0b010000);
	}

	inIgnoreCheck() {
		var mi = this.allMoves(moveArray, 0, true);
		for (let i = 0; i < mi; i += 5)
			if ((moveArray[i+4] & 0b1111) === 0b1000)
				return true;
		return false;
	}

	inCheckMate() {
		var mi1 = this.allMoves(moveArray, 0);
		for (let i = 0; i < mi1; i += 5) {
			this.doMoveFast(moveArray, i);

			let mi2 = this.allMoves(moveArray, mi1, true),
			flg = false;
			for (let j = mi1; j < mi2; j += 5) {
				if ((moveArray[j+4] & 0b1111) === 0b1000) {
					flg = true;
					break;
				}
			}

			this.undoMoveFast(moveArray, i);

			if (!flg)
				return false;
		}
		return true;
	}

	judge() {
		var hashCountTableKey = this.hash1 & 0x7FFFFF;
		if (((this.hashCountTable[hashCountTableKey >>> 1] >>> ((hashCountTableKey & 1) << 2)) & 0b1111) >= 3) {
			let history = this.history.concat(),
			count = 4,
			black = true, white = true,
			hash = this.hash;

			while (true) {
				if (this.player !== 0b010000)
					black &= this.check;
				else
					white &= this.check;
				if (this.hash === hash && --count === 0 || this.count === 0)
					break;
				this.undoMove();
			}

			while (history[this.count])
				this.doMove(history[this.count]);

			if (count === 0) {
				if (black | white) {
					return {
						winner: black ? "white" : "black",
						reason: "連続王手の千日手",
					};
				} else {
					return {
						winner: null,
						reason: "千日手",
					};
				}
			}
		}

		if (this.inIgnoreCheck()) {
			return {
				winner: this.player === 0b010000 ? "black" : "white",
				reason: "王手放置",
			};
		}

		if (this.inCheckMate()) {
			if (this.history[this.count-1].fromIdx === 6) {
				return {
					winner: this.player === 0b010000 ? "black" : "white",
					reason: "打ち歩詰め",
				};
			} else {
				return {
					winner: this.player !== 0b010000 ? "black" : "white",
					reason: null,
				};
			}
		}

		return null;
	}

	canMove(fromIdx, toIdx) {
		var mi = this.allMoves(moveArray, 0),
		result = 0;
		for (var i = 0; i < mi; i += 5)
			if (moveArray[i] === fromIdx && moveArray[i+1] === toIdx)
				result |= (moveArray[i+2] === moveArray[i+3]) ? 1 : 2;
		return result;
	}

	get count() {
		return this.history.length;
	}

	get hash() {
		return (this.hash1 & 0x3FFFFF) * 0x80000000 + (this.hash2 & 0x7FFFFFFF);
	}

	toString() {
		var ret = "";
		const PIECE_TABLE = ["　", "飛", "角", "金", "銀", "桂", "香", "歩",
												 "玉", "竜", "馬", "？", "全", "圭", "杏", "と"];
		for (var y = 0; y < 9; ++y) {
			for (var x = 0; x < 9; ++x) {
				var sq = this.board[11 + 10 * y + x];
				ret += (sq & 0b100000 ? "v" : " ") + PIECE_TABLE[sq & 0b1111];
			}
			ret += "\n";
		}
		ret += "△:";
		for (var i = 6; 0 <= i; --i) {
			if (this.wPieces[i] === 0)
				continue;
			ret += PIECE_TABLE[i+1];
			if (1 < this.wPieces[i])
				ret += this.wPieces[i];
		}
		ret += "\n";
		ret += "▲:";
		for (var i = 6; 0 <= i; --i) {
			if (this.bPieces[i] === 0)
				continue;
			ret += PIECE_TABLE[i+1];
			if (1 < this.bPieces[i])
				ret += this.bPieces[i];
		}
		return ret;
	}


	moveHash1(ma, mi) {
		const fromIdx = ma[mi] | 0,
		shiftedToIdx = ma[mi+1] << 6,
		to = ma[mi+3] | 0;

		if (fromIdx & 0b1111000) {
			const capture = ma[mi+4];
			if (capture) {
				return this.hash1 ^
					HASH_SEEDS[ma[mi+2] | fromIdx << 6] ^
					HASH_SEEDS[to | shiftedToIdx] ^
					HASH_SEEDS[capture | shiftedToIdx] ^
					HASH_SEEDS[capture];
			} else {
				return this.hash1 ^
					HASH_SEEDS[ma[mi+2] | fromIdx << 6] ^
					HASH_SEEDS[to | shiftedToIdx];
			}
		} else {
			return this.hash1 ^
				HASH_SEEDS[to | shiftedToIdx] ^
				HASH_SEEDS[to];
		}
	}

	moveHash2(ma, mi) {
		const fromIdx = ma[mi] | 0,
		toIdx = ma[mi+1] | 0,
		shiftedTo = ma[mi+3] << 7;

		if (fromIdx & 0b1111000) {
			const capture = ma[mi+4];
			if (capture) {
				return this.hash2 ^
					HASH_SEEDS[ma[mi+2] << 7 | fromIdx] ^
					HASH_SEEDS[shiftedTo| toIdx] ^
					HASH_SEEDS[capture << 7 | toIdx] ^
					HASH_SEEDS[capture << 7];
			} else {
				return this.hash2 ^
					HASH_SEEDS[ma[mi+2] << 7 | fromIdx] ^
					HASH_SEEDS[shiftedTo | toIdx];
			}
		} else {
			return this.hash2 ^
				HASH_SEEDS[shiftedTo | toIdx] ^
				HASH_SEEDS[shiftedTo];
		}
	}

	static encodeMove(ma, mi) {
		return ma[mi+0] | ma[mi+1] << 7 | (ma[mi+3] & 0b1000) << 11;
	}

	decodeMove(src, ma, mi) {
		ma[mi+0] = src & 0x7F;
		ma[mi+1] = src >>> 7 & 0x7F;
		if (ma[mi+0] & 0b1111000) {
			ma[mi+2] = this.board[ma[mi+0]];
			ma[mi+3] = ma[mi+2] | src >>> 14 << 3;
			ma[mi+4] = this.board[ma[mi+1]];
		} else {
			ma[mi+3] = ma[mi+0] + 1 | this.player;
			ma[mi+4] = 0;
		}
	}

	effect(index) {
		var board = this.board, sq, score = 0;
		if ((sq = board[index+11]) & 0b010000 && 0b1111011000011100 >>> (sq & 0b1111) & 1)
			score += 1;
		else if (sq & 0b100000 && 0b0000011000010100 >>> (sq & 0b1111) & 1)
			score -= 1;
		if ((sq = board[index+ 9]) & 0b010000 && 0b1111011000011100 >>> (sq & 0b1111) & 1)
			score += 1;
		else if (sq & 0b100000 && 0b0000011000010100 >>> (sq & 0b1111) & 1)
			score -= 1;
		if ((sq = board[index+10]) & 0b010000 && 0b1111011011011010 >>> (sq & 0b1111) & 1)
			score += 1;
		else if (sq & 0b100000 && 0b1111011000001010 >>> (sq & 0b1111) & 1)
			score -= 1;
		if ((sq = board[index- 1]) & 0b010000 && 0b1111011000001010 >>> (sq & 0b1111) & 1)
			score += 1;
		else if (sq & 0b100000 && 0b1111011000001010 >>> (sq & 0b1111) & 1)
			score -= 1;
		if ((sq = board[index+ 1]) & 0b010000 && 0b1111011000001010 >>> (sq & 0b1111) & 1)
			score += 1;
		else if (sq & 0b100000 && 0b1111011000001010 >>> (sq & 0b1111) & 1)
			score -= 1;
		if ((sq = board[index-10]) & 0b010000 && 0b1111011000001010 >>> (sq & 0b1111) & 1)
			score += 1;
		else if (sq & 0b100000 && 0b1111011011011010 >>> (sq & 0b1111) & 1)
			score -= 1;
		if ((sq = board[index- 9]) & 0b010000 && 0b0000011000010100 >>> (sq & 0b1111) & 1)
			score += 1;
		else if (sq & 0b100000 && 0b1111011000011100 >>> (sq & 0b1111) & 1)
			score -= 1;
		if ((sq = board[index-11]) & 0b010000 && 0b0000011000010100 >>> (sq & 0b1111) & 1)
			score += 1;
		else if (sq & 0b100000 && 0b1111011000011100 >>> (sq & 0b1111) & 1)
			score -= 1;
		if (board[index+21] === 0b010101)
			score += 1;
		if (board[index+19] === 0b010101)
			score += 1;
		if (board[index-21] === 0b100101)
			score -= 1;
		if (board[index-19] === 0b100101)
			score -= 1;

		return score;
	}

}


const moveArray = new Uint8Array(2 * Position.MAX_MOVES_NUM_IN_A_POSITION * 5);


const HASH_SEEDS = new Int32Array(100 * 64);
for (var i = 0; i < HASH_SEEDS.length; ++i)
	HASH_SEEDS[i] = bits.random.next32();
