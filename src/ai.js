"use strict";

import Position from "./position.js";


const PIECE_SCORE_TABLE = new Uint16Array(0b11000 + 1);
PIECE_SCORE_TABLE[0b00001] = 500;
PIECE_SCORE_TABLE[0b00010] = 50;
PIECE_SCORE_TABLE[0b00011] = 45;
PIECE_SCORE_TABLE[0b00100] = 30;
PIECE_SCORE_TABLE[0b00101] = 27;
PIECE_SCORE_TABLE[0b00110] = 18;
PIECE_SCORE_TABLE[0b00111] = 16;
PIECE_SCORE_TABLE[0b01000] = 10;
PIECE_SCORE_TABLE[0b10010] = 70;
PIECE_SCORE_TABLE[0b10011] = 65;
PIECE_SCORE_TABLE[0b10101] = 30;
PIECE_SCORE_TABLE[0b10110] = 30;
PIECE_SCORE_TABLE[0b10111] = 30;
PIECE_SCORE_TABLE[0b11000] = 30;

const MAX_SEARCH_DEPTH = 5;

const moveArray = new Uint8Array(Position.MAX_MOVES_NUM_IN_A_POSITION * MAX_SEARCH_DEPTH * 5);


function evalPosition(position) {
	var board = position.board,
	bPieces = position.bPieces,
	wPieces = position.wPieces,
	score = 0;
	for (let i = 11; i < 101; ++i) {
		let sq = board[i];
		if (sq & 0b0100000)
			score += PIECE_SCORE_TABLE[sq & 0b11111];
		else if (sq & 0b1000000)
			score -= PIECE_SCORE_TABLE[sq & 0b11111];
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
	if (position.player === 0b1000000)
		score = -score;
	return score;
}


function sortMoves(position, moves) {
}


function search(position, depth, alpha, beta, mi) {
	if (depth === 0)
		return evalPosition(position);
	var mi2 = position.allMoves(moveArray, mi);
	//sortMoves(position, moves);

	for (let i = mi; i < mi2; i += 5) {
		position.move_(moveArray, i);
		let score = -search(position, depth-1, -beta, -alpha, mi2);
		position.unmove_(moveArray, i);
		if (alpha < score) {
			alpha = score;
			if (beta <= alpha)
				return alpha;
		}
	}
	return alpha;
}


export default function ai(position) {
	var mi = position.allMoves(moveArray, 0);
	//sortMoves(position, moves);

	var bestMove = 0,
	alpha = -4096;
	for (let i = 0; i < mi; i += 5) {
		position.move_(moveArray, i);
		let score = -search(position, 3, -4096, -alpha, mi);
		position.unmove_(moveArray, i);
		if (alpha < score) {
			bestMove = i;
			alpha = score;
		}
	}
	return {
		fromIdx: moveArray[bestMove+0],
		toIdx:   moveArray[bestMove+1],
		from:    moveArray[bestMove+2],
		to:      moveArray[bestMove+3],
		capture: moveArray[bestMove+4],
	};
}
