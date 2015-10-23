"use strict";

import Position from "./position.js";


const PIECE_SCORE_TABLE = new Uint16Array(0b10000);
PIECE_SCORE_TABLE[0b0001] = 65;
PIECE_SCORE_TABLE[0b0010] = 58;
PIECE_SCORE_TABLE[0b0011] = 47;
PIECE_SCORE_TABLE[0b0100] = 39;
PIECE_SCORE_TABLE[0b0101] = 25;
PIECE_SCORE_TABLE[0b0110] = 23;
PIECE_SCORE_TABLE[0b0111] = 10;
PIECE_SCORE_TABLE[0b1000] = 500;
PIECE_SCORE_TABLE[0b1001] = 95;
PIECE_SCORE_TABLE[0b1010] = 84;
PIECE_SCORE_TABLE[0b1100] = 45;
PIECE_SCORE_TABLE[0b1101] = 45;
PIECE_SCORE_TABLE[0b1110] = 45;
PIECE_SCORE_TABLE[0b1111] = 46;

const MAX_SEARCH_DEPTH = 8;

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
	score += bPieces[0] * 70;
	score += bPieces[1] * 62;
	score += bPieces[2] * 54;
	score += bPieces[3] * 50;
	score += bPieces[4] * 27;
	score += bPieces[5] * 25;
	score += bPieces[6] * 12;
	score -= wPieces[0] * 70;
	score -= wPieces[1] * 62;
	score -= wPieces[2] * 54;
	score -= wPieces[3] * 50;
	score -= wPieces[4] * 27;
	score -= wPieces[5] * 25;
	score -= wPieces[6] * 12;
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

	if (depth === 1) {
		var mi2 = position.allMoves(moveArray, mi1, true),
		scoreBase = (position.player === 0b010000) ? evalPosition(position) : -evalPosition(position);

		for (let i = mi1; i < mi2; i += 5) {
			var score = scoreBase + PIECE_SCORE_TABLE[moveArray[i+4] & 0b1111];
			if (alpha < score) {
				alpha = score;
				if (beta <= alpha)
					return alpha;
			}
		}

		return alpha;
	}

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
	alpha = -65535; //var r = position.count < 15; //  + (r ? Math.random() * 3 - 1 | 0 : 0)
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
