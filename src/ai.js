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
PIECE_SCORE_TABLE[0b1000] = 1000;
PIECE_SCORE_TABLE[0b1001] = 95;
PIECE_SCORE_TABLE[0b1010] = 84;
PIECE_SCORE_TABLE[0b1100] = 46;
PIECE_SCORE_TABLE[0b1101] = 45;
PIECE_SCORE_TABLE[0b1110] = 45;
PIECE_SCORE_TABLE[0b1111] = 42;

const HAND_PIECE_SCORE_TABLE = new Uint16Array([0, 71, 61, 52, 44, 27, 25, 11]);


const MAX_SEARCH_DEPTH = 10;

const moveArray = new Uint8Array(Position.MAX_MOVES_NUM_IN_A_POSITION *
																 MAX_SEARCH_DEPTH * 5);
const moveScoreArray = new Int16Array(Position.MAX_MOVES_NUM_IN_A_POSITION);

const positionTableSize = 1 << 24;
const positionTable = new DataView(new ArrayBuffer(positionTableSize * 10));
/*
 * positionTable entry
 * - hash2    | 32 bit | offset  0
 * - depth    |  8 bit | offset  4
 * - cut      |  8 bit | offset  5
 * - score    | 16 bit | offset  6
 * - bestMove | 16 bit | offset  8
 * total 10 byte
 */


var allMovesCount = 0;


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
	score += bPieces[0] * 71
	score += bPieces[1] * 61;
	score += bPieces[2] * 52;
	score += bPieces[3] * 44;
	score += bPieces[4] * 27;
	score += bPieces[5] * 25;
	score += bPieces[6] * 11;
	score -= wPieces[0] * 71;
	score -= wPieces[1] * 61;
	score -= wPieces[2] * 52;
	score -= wPieces[3] * 44;
	score -= wPieces[4] * 27;
	score -= wPieces[5] * 25;
	score -= wPieces[6] * 11;
	return score;
}


function evalMove(mi) {
	mi = mi | 0;
	if (moveArray[mi] & 0b1111000) {
		return -PIECE_SCORE_TABLE[moveArray[mi+2] & 0b1111] +
			PIECE_SCORE_TABLE[moveArray[mi+3] & 0b1111] +
			PIECE_SCORE_TABLE[moveArray[mi+4] & 0b1111] +
			HAND_PIECE_SCORE_TABLE[moveArray[mi+4] & 0b0111];
	} else {
		return PIECE_SCORE_TABLE[moveArray[mi+3] & 0b1111] +
			-HAND_PIECE_SCORE_TABLE[moveArray[mi+3] & 0b0111];
	}
}


function moveOrdering(mi1, mi2) {
	while (mi1 < mi2) {
		if (moveArray[mi1+4] !== 0 || (moveArray[mi1+2] ^ moveArray[mi1+3]) === 0b1000) {
			mi1 += 5;
		} else if (!(moveArray[mi2-1] !== 0 || (moveArray[mi2-3] ^ moveArray[mi2-2]) === 0b1000)) {
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


function moveOrderingUseCache(mi1, mi2, position, scoreDefault) {
	var size = (mi2 - mi1) / 5 | 0,
	min = 32768, max = -32768;

	for (var i = 0, mi = mi1; i < size; i += 1, mi += 5) {
		var address = (position.moveHash1(moveArray, mi) & positionTableSize - 1) * 10,
		score;

		if (positionTable.getInt32(address) === position.moveHash2(moveArray, mi))
			score = -positionTable.getInt16(address + 6);
		else
			score = scoreDefault;

		moveScoreArray[i] = score;
		if (score < min)
			min = score;
		if (max < score)
			max = score;
	}

	max = Math.min(max, 1000);
	min = Math.max(min, -1000);

	var pivot = (max + min) >> 1,
	mi = mi1 | 0,
	tmp;

  while (pivot < max - 3) {
    var l = 0, r = size-1;
    while (true) {
      while (pivot < moveScoreArray[l])
        l += 1;
      while (moveScoreArray[r] <= pivot)
        r -= 1;
      if (l > r)
        break;

      tmp = moveScoreArray[l]; moveScoreArray[l] = moveScoreArray[r]; moveScoreArray[r] = tmp;

			mi1 = mi + l * 5; mi2 = mi + r * 5;
			tmp = moveArray[mi1+0]; moveArray[mi1+0] = moveArray[mi2+0]; moveArray[mi2+0] = tmp;
			tmp = moveArray[mi1+1]; moveArray[mi1+1] = moveArray[mi2+1]; moveArray[mi2+1] = tmp;
			tmp = moveArray[mi1+2]; moveArray[mi1+2] = moveArray[mi2+2]; moveArray[mi2+2] = tmp;
			tmp = moveArray[mi1+3]; moveArray[mi1+3] = moveArray[mi2+3]; moveArray[mi2+3] = tmp;
			tmp = moveArray[mi1+4]; moveArray[mi1+4] = moveArray[mi2+4]; moveArray[mi2+4] = tmp;
    }
    pivot = (max - pivot >> 1) + pivot;
    size = l;
  }
}
moveOrderingUseCache = moveOrdering;
//moveOrderingUseCache = function() {};
//moveOrderingUseCache = moveOrdering = function() {};
//moveOrdering = function() {};


function search(position, scoreBase, depth, alpha, beta, mi1, checkHistory) {
	if (depth === 0)
		return scoreBase;

	var hashCountTableKey = position.hash1 & 0x7FFFFF;
	if (((position.hashCountTable[hashCountTableKey >>> 1] >>> ((hashCountTableKey & 1) << 2)) & 0b1111) >= 3) {
		if ((checkHistory & 0x5555) === 0x5555)
			return  32600;
		if ((checkHistory & 0xAAAA) === 0xAAAA)
			return -32600;
		return 0;
	}

	var bestScore = alpha;

	var address = (position.hash1 & positionTableSize - 1) * 10;
	if (positionTable.getInt32(address+0) === position.hash2) {
		var cDepth = positionTable.getInt8(address+4),
		cBestMove = positionTable.getInt16(address+8);

		if (position.board[cBestMove & 0x7F] & position.player &&
				depth <= cDepth) {
			var cCut = positionTable.getInt8(address+5),
			cScore = positionTable.getInt16(address+6);

			if (cCut === 0)
				return cScore;
			if (cCut === 1) {
				if (beta <= bestScore)
					return cScore;
			} else {
				if (beta <= cScore)
					return cScore;
			}
		} else {
			cDepth = 0;
			cBestMove = 0;
		}
	}

	if (depth === 1) {
		if (scoreBase + 100 <= bestScore)
			return bestScore;
		if (beta <= scoreBase)
			return scoreBase;

		var mi2 = position.allMoves(moveArray, mi1, true);
		allMovesCount += 1;

		for (var i = mi1; i < mi2; i += 5) {
			var score = scoreBase + PIECE_SCORE_TABLE[moveArray[i+4] & 0b1111];
			if (bestScore < score) {
				bestScore = score;
				if (beta <= bestScore)
					return bestScore;
			}
		}

		return bestScore;
	} else {
		var bestMove = 0,
		kingHead = position.player === 0b010000 ? position.wKing + 10 : position.bKing - 10;
		checkHistory = checkHistory << 1 | position.inCheck();

		findBestMove: {
			if (cBestMove) {
				position.decodeMove(cBestMove, moveArray, mi1);

				position.doMoveFast(moveArray, mi1);
				var score = -search(position, -(scoreBase + evalMove(mi1)),
														depth-1, -beta, -bestScore, mi1 + 5, checkHistory);
				position.undoMoveFast(moveArray, mi1);

				if (moveArray[mi1] === 6 &&
						moveArray[mi1+1] === kingHead &&
						score === 32700 + depth - 2)
					score = -score;

				if (bestScore < score) {
					bestMove = mi1;
					bestScore = score;
					if (beta <= bestScore)
						break findBestMove;
				}
			}

			var mi2 = position.allMoves(moveArray, mi1, depth <= 2);
			allMovesCount += 1;

			if (3 <= cDepth)
				moveOrderingUseCache(mi1, mi2, position, scoreBase - 1000);
			else
				moveOrdering(mi1, mi2);

			for (var i = mi1; i < mi2; i += 5) {
				if ((moveArray[i+4] & 0b1111) === 0b1000) {
					bestScore = 32700 + depth;
					break findBestMove;
				}

				position.doMoveFast(moveArray, i);
				var score = -search(position, -(scoreBase + evalMove(i)),
														depth-1, -beta, -bestScore, mi2, checkHistory);
				position.undoMoveFast(moveArray, i);

				if (moveArray[i] === 6 &&
						moveArray[i+1] === kingHead &&
						score === 32700 + depth - 2)
					score = -score;

				if (bestScore < score) {
					bestMove = i;
					bestScore = score;
					if (beta <= bestScore)
						break findBestMove;
				}
			}
		}

		positionTable.setInt32(address+0, position.hash2);
		positionTable.setInt8 (address+4, depth);
		positionTable.setInt8 (address+5, alpha < bestScore ? (bestScore < beta ? 0 : 1) : -1);
		positionTable.setInt16(address+6, bestScore);
		positionTable.setInt16(address+8, Position.encodeMove(moveArray, bestMove));

		return bestScore;
	}
}


export function think(position, depth, randomness = 0) {
	var address = (position.hash1 & positionTableSize - 1) * 10,
	cDepth = 0;
	if (positionTable.getInt32(address+0) === position.hash2) {
		cDepth = positionTable.getInt8(address+4);
		var cBestMove = positionTable.getInt16(address+8);

		if (!(position.board[cBestMove & 0x7F] & position.player))
			cBestMove = 0;
	}


	var mi = position.allMoves(moveArray, 0, false);
	allMovesCount = 1;

	if (3 <= cDepth)
		moveOrderingUseCache(0, mi, position, -30000);
	else
		moveOrdering(0, mi);

	var bestMove = -1,
	bestScore = -32767,
	scoreBase = evalPosition(position) * (position.player === 0b010000 ? 1 : -1),
	checkHistory = makeCheckHistory(position),
	kingHead = position.player === 0b010000 ? position.wKing + 10 : position.bKing - 10;

	for (var i = 0; i < mi; i += 5) {
		if ((moveArray[i+4] & 0b1111) === 0b1000)
			return "check mated";

		position.doMoveFast(moveArray, i);
		var score = -search(position, -(scoreBase + evalMove(i)),
												depth-1, -32767, -bestScore, mi, checkHistory);
		position.undoMoveFast(moveArray, i);

		if (moveArray[i] === 6 &&
		moveArray[i+1] === kingHead &&
		score === 32700 + depth - 2)
			score = -score;

		score -= Math.random() * (randomness + 1) | 0;

		if (bestScore < score) {
			bestMove = i;
			bestScore = score;
		}
	}

	if (bestMove === -1)
		return null;

	var address = (position.hash1 & positionTableSize - 1) * 10;
	positionTable.setInt32(address+0, position.hash2);
	positionTable.setInt8 (address+4, depth);
	positionTable.setInt8 (address+5, 0);
	positionTable.setInt16(address+6, bestScore);
	positionTable.setInt16(address+8, Position.encodeMove(moveArray, bestMove));

	return {
		fromIdx: moveArray[bestMove+0],
		toIdx:   moveArray[bestMove+1],
		from:    moveArray[bestMove+2],
		to:      moveArray[bestMove+3],
		capture: moveArray[bestMove+4],
		score: bestScore,
	};
}

export function think_(position, maxDepth, randomness = 0, timeLimit = 1000) {
	var startTime = new Date().getTime();


	var address = (position.hash1 & positionTableSize - 1) * 10,
	cDepth = 0;
	if (positionTable.getInt32(address+0) === position.hash2) {
		cDepth = positionTable.getInt8(address+4);
		var cBestMove = positionTable.getInt16(address+8);

		if (!(position.board[cBestMove & 0x7F] & position.player))
			cBestMove = 0;
	}


	var mi = position.allMoves(moveArray, 0, false);
	allMovesCount = 1;

	if (3 <= cDepth)
		moveOrderingUseCache(0, mi, position, -30000);
	else
		moveOrdering(0, mi);


	for (var depth = Math.max(3, cDepth + 0); depth <= maxDepth; ++depth) {
		var bestMove = -1,
		bestScore = -32767,
		scoreBase = evalPosition(position) * (position.player === 0b010000 ? 1 : -1),
		checkHistory = makeCheckHistory(position),
		kingHead = position.player === 0b010000 ? position.wKing + 10 : position.bKing - 10;

		for (var i = 0; i < mi; i += 5) {
			if ((moveArray[i+4] & 0b1111) === 0b1000)
				throw new Error("check mated");

			position.doMoveFast(moveArray, i);
			var score = -search(position, -(scoreBase + evalMove(i)),
													depth-1, -32767, -bestScore, mi, checkHistory);
			position.undoMoveFast(moveArray, i);

			if (moveArray[i] === 6 &&
					moveArray[i+1] === kingHead &&
					score === 32700 + depth - 2)
				score = -score;

			score -= Math.random() * (randomness + 1) | 0;

			if (bestScore < score) {
				bestMove = i;
				bestScore = score;
			}
		}

		//if (timeLimit <= new Date().getTime() - startTime)
		//	break;

		moveOrderingUseCache(0, mi, position, -30000);
	}

	if (bestMove === -1)
		return null;

	var address = (position.hash1 & positionTableSize - 1) * 10;
	positionTable.setInt32(address+0, position.hash2);
	positionTable.setInt8 (address+4, depth);
	positionTable.setInt8 (address+5, 0);
	positionTable.setInt16(address+6, bestScore);
	positionTable.setInt16(address+8, Position.encodeMove(moveArray, bestMove));

	return {
		fromIdx: moveArray[bestMove+0],
		toIdx:   moveArray[bestMove+1],
		from:    moveArray[bestMove+2],
		to:      moveArray[bestMove+3],
		capture: moveArray[bestMove+4],
		score: bestScore,
		depth: maxDepth,
	};
}


export function settle(position) {
	// for avoiding sennichite
	var hashCountTableKey = position.hash1 & 0x7FFFFF;
	if (((position.hashCountTable[hashCountTableKey >>> 1] >>> ((hashCountTableKey & 1) << 2)) & 0b1111) >= 1)
		clearPositionTable(position, 4, 0);
}


function clearPositionTable(position, depth, mi1) {
	var address = (position.hash1 & 0xFFFFFF) * 10;

	if (positionTable.getInt32(address) !== position.hash2)
		return;

	positionTable.setInt32(address, 0);

	if (depth === 0)
		return;

	var mi2 = position.allMoves(moveArray, mi1, false);
	for (var i = mi1; i < mi2; i += 5) {
		position.doMoveFast(moveArray, i);
		clearPositionTable(position, depth - 1, mi2);
		position.undoMoveFast(moveArray, i);
	}
}


function movePos(idx) {
	return ["１", "２", "３", "４", "５", "６", "７", "８", "９"][9 - idx % 10] +
		["一", "二", "三", "四", "五", "六", "七", "八", "九"][(idx / 10 | 0) - 1];
}


function getExpectedMoves_(position, mi, seq, hashHistory) {
	const PIECE_TABLE = ["　", "飛", "角", "金", "銀", "桂", "香", "歩",
											 "玉", "竜", "馬", "？", "全", "圭", "杏", "と"];

	mi = mi | 0;

	if (hashHistory.indexOf(position.hash1) !== -1)
		return;

	var address = (position.hash1 & 0xFFFFFF) * 10;
	var bestMove  = positionTable.getInt16(address+8);

	if (positionTable.getInt32(address+0) === position.hash2 &&
			position.board[bestMove & 0x7F] & position.player) {
		position.decodeMove(bestMove, moveArray, mi);

		if (moveArray[mi+0] & 0b1111000) {
			seq.push((position.player === 0b010000 ? "▲" : "△") +
							 movePos(moveArray[mi+1]) +
							 PIECE_TABLE[moveArray[mi+3] & 0b1111] +
							 "(" + (10 - moveArray[mi+0] % 10) + (moveArray[mi+0] / 10 | 0) + ")");
		} else {
			seq.push((position.player === 0b010000 ? "▲" : "△") +
							 movePos(moveArray[mi+1]) +
							 PIECE_TABLE[moveArray[mi+3] & 0b1111] + "打");
		}

		hashHistory.push(position.hash1);
		position.doMoveFast(moveArray, mi);
		getExpectedMoves_(position, mi + 5, seq, hashHistory);
		position.undoMoveFast(moveArray, mi);
	}

	return seq;
}


export function getExpectedMoves(position) {
	return getExpectedMoves_(position, 0, [], []).join("");
}


function makeCheckHistory(position) {
	var history = position.history.concat(),
	ret = 0;

	for (var i = 0; i < 32 && position.count; ++i) {
		ret |= position.check << i;
		position.undoMove();
	}

	while (history[position.count])
		position.doMove(history[position.count]);

	return ret;
}


export function getAllMovesCount() {
	return allMovesCount;
}


export function think1(position, depth, randomness = 1) {
	var mi = position.allMoves(moveArray, 0, false);
	moveOrdering(0, mi);

	var ret = [];

	var bestMove = -1,
	bestScore = -32767,
	scoreBase = evalPosition(position) * (position.player === 0b010000 ? 1 : -1),
	checkHistory = makeCheckHistory(position),
	kingHead = position.player === 0b010000 ? position.wKing + 10 : position.bKing - 10;

	for (var i = 0; i < mi; i += 5) {
		if ((moveArray[i+4] & 0b1111) === 0b1000)
			return "check mated";

		position.doMoveFast(moveArray, i);
		var score = -search(position, -(scoreBase + evalMove(i)),
												depth-1, -32767, 32767, mi, checkHistory);
		position.undoMoveFast(moveArray, i);

		if (moveArray[i] === 6 && moveArray[i+1] === kingHead && score === 32700 + depth - 2)
			score = -score;

		ret.push([moveArray[i+0], moveArray[i+1], score]);
	}

	return ret;
}
