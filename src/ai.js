"use strict";

import Position from "./position.js";


const PIECE_SCORE_TABLE = new Uint16Array(0b10000);
PIECE_SCORE_TABLE[0b0001] = 50;
PIECE_SCORE_TABLE[0b0010] = 45;
PIECE_SCORE_TABLE[0b0011] = 30;
PIECE_SCORE_TABLE[0b0100] = 27;
PIECE_SCORE_TABLE[0b0101] = 18;
PIECE_SCORE_TABLE[0b0110] = 16;
PIECE_SCORE_TABLE[0b0111] = 10;
PIECE_SCORE_TABLE[0b1000] = 500;
PIECE_SCORE_TABLE[0b1001] = 70;
PIECE_SCORE_TABLE[0b1010] = 65;
PIECE_SCORE_TABLE[0b1100] = 30;
PIECE_SCORE_TABLE[0b1101] = 30;
PIECE_SCORE_TABLE[0b1110] = 30;
PIECE_SCORE_TABLE[0b1111] = 30;

const MAX_SEARCH_DEPTH = 5;

const moveArray = new Uint8Array(Position.MAX_MOVES_NUM_IN_A_POSITION * MAX_SEARCH_DEPTH * 5);


function evalPosition(position) {
	var board = position.board,
	bPieces = position.bPieces,
	wPieces = position.wPieces,
	score = 0;
	for (let i = 11; i < 101; ++i) {
		let sq = board[i];
		if (sq & 0b010000)
			score += PIECE_SCORE_TABLE[sq & 0b1111];
		else if (sq & 0b100000)
			score -= PIECE_SCORE_TABLE[sq & 0b1111];
	}
	score += bPieces[0] * 60;
	score += bPieces[1] * 55;
	score += bPieces[2] * 45;
	score += bPieces[3] * 44;
	score += bPieces[4] * 28;
	score += bPieces[5] * 26;
	score += bPieces[6] * 15;
	score -= wPieces[0] * 60;
	score -= wPieces[1] * 55;
	score -= wPieces[2] * 45;
	score -= wPieces[3] * 44;
	score -= wPieces[4] * 28;
	score -= wPieces[5] * 26;
	score -= wPieces[6] * 15;
	return score;
}


function sortMoves(position, mi1, mi2) {
	while (mi1 < mi2) {
		if (moveArray[mi1+4] !== 0) {
			mi1 += 5;
		} else if (moveArray[mi2-1] === 0) {
			mi2 -= 5;
		} else {
			let tmp;
			mi2 -= 5;
			tmp = moveArray[mi1+0]; moveArray[mi1+0] = moveArray[mi2+0]; moveArray[mi2+0] = tmp;
			tmp = moveArray[mi1+1]; moveArray[mi1+1] = moveArray[mi2+1]; moveArray[mi2+1] = tmp;
			tmp = moveArray[mi1+2]; moveArray[mi1+2] = moveArray[mi2+2]; moveArray[mi2+2] = tmp;
			tmp = moveArray[mi1+3]; moveArray[mi1+3] = moveArray[mi2+3]; moveArray[mi2+3] = tmp;
			tmp = moveArray[mi1+4]; moveArray[mi1+4] = moveArray[mi2+4]; moveArray[mi2+4] = tmp;
		}
	}
}


function search(position, depth, alpha, beta, mi1) {
	if (depth === 0)
		return (position.player === 0b010000) ? evalPosition(position) : -evalPosition(position);

	var mi2 = position.allMoves(moveArray, mi1, depth === 1);
	sortMoves(position, mi1, mi2);

	for (let i = mi1; i < mi2; i += 5) {
		if ((moveArray[i+4] & 0b1111) === 0b1000)
			return 65000 + depth;

		position.doMoveFast(moveArray, i);
		let score = -search(position, depth-1, -beta, -alpha, mi2);
		position.undoMoveFast(moveArray, i);

		if (alpha < score) {
			alpha = score;
			if (beta <= alpha)
				return alpha;
		}
	}
	return alpha;
}


export default function ai(position, depth) {
	var mi = position.allMoves(moveArray, 0);
	sortMoves(position, 0, mi);

	var bestMove = -1,
	alpha = -65535;
	for (let i = 0; i < mi; i += 5) {
		if ((moveArray[i+4] & 0b1111) === 0b1000)
			return "check mated";

		position.doMoveFast(moveArray, i);
		let score = -search(position, depth-1, -65535, -alpha, mi);
		position.undoMoveFast(moveArray, i);

		if (alpha < score) {
			bestMove = i;
			alpha = score;
		}
	}

	if (bestMove === -1)
		return null;

	return {
		fromIdx: moveArray[bestMove+0],
		toIdx:   moveArray[bestMove+1],
		from:    moveArray[bestMove+2],
		to:      moveArray[bestMove+3],
		capture: moveArray[bestMove+4],
		score: alpha,
	};
}
