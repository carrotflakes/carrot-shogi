import Vue from "vue";
import Position from "./position.js";
import ai from "./ai.js";
import * as sound from "./sound.js";
import pieceComponent from "./components/piece.vue";


const LABEL_TABLE = {
	0b0001: "飛車",
	0b0010: "角行",
	0b0011: "金将",
	0b0100: "銀将",
	0b0101: "桂馬",
	0b0110: "香車",
	0b0111: "歩兵",
	0b1000: "玉将",
	0b1001: "竜王",
	0b1010: "竜馬",
	0b1100: "成銀",
	0b1101: "成桂",
	0b1110: "成香",
	0b1111: "と金",
};

var position = new Position();
var searchDepth = 4;


Vue.filter('position', function (piece) {
	var x = piece.x,
	y = piece.y,
	angle = piece.black ? 0 : 180;

  return `translate(${x}, ${y}) rotate(${angle})`;
});

var appVm = new Vue({
	el: "#app",
	data: {
		pieces: [],
		selectedPiece: null,
		lastMoveIndex: 0,
		gameMode: null,
		gameResult: null,
		promotionSelect: {
			show: false,
			x: 0,
			y: 0,
			fromIdx: 0,
			toIdx: 0,
			unpromotedPiece: {
				label: "歩兵",
				x: -31,
				y: 31,
				black: true,
			},
			promotedPiece: {
				label: "と金",
				x: 31,
				y: 31,
				black: true,
			},
		},
		sound: true,
		enableDebug: false,
		debugInfo: {
			hash1: null,
			check: null,
			thinkTime: null,
			thinkScore: null,
		},
	},
	methods: {
		init() {
			this.gameMode = null;
			this.gameResult = null;
		},
		matta() {
			if (this.gameMode === null || this.gameResult !== null || position.count < 2)
				return;

			this.selectedPiece = null;
			position.undoMove();
			position.undoMove();
			this.promotionSelect.show = false;
			this.draw();
		},
		draw() {
			var newPieces = [];
			for (let i = 0; i < position.board.length; ++i) {
				let sq = position.board[i],
				label = LABEL_TABLE[sq & 0b1111];
				if (label) {
					newPieces.push({
						label: label,
						black: !!(sq & 0b010000),
						x: 100 + 2 + 41 * ((i - 11) % 10) + 20,
						y: 2 + 41 * ((i - 11) / 10 | 0) + 20,
						index: i,
						_uid: (i << 8) + sq,
					});
				}
			}
			for (let i = 0; i < position.bPieces.length; ++i) {
				for (let j = 0; j < position.bPieces[i]; ++j) {
					newPieces.push({
						label: LABEL_TABLE[i + 1],
						black: true,
						x: 496 + 4 * j,
						y: 372 - 22 - i * 40,
						index: i ^ 0b10000000,
						_uid: (1 << 16) + (i << 8) + j,
					});
				}
			}
			for (let i = 0; i < position.wPieces.length; ++i) {
				for (let j = 0; j < position.wPieces[i]; ++j) {
					newPieces.push({
						label: LABEL_TABLE[i + 1],
						black: false,
						x: 20 + 4 * j,
						y: 22 + i * 40,
						index: i ^ 0b10000000,
						_uid: (2 << 16) + (i << 8) + j,
					});
				}
			}
			this.pieces = newPieces;

			this.lastMoveIndex = position.count > 0 ? position.history[position.count - 1].toIdx : 0;

			this.debugInfo.hash1 =
				(new Array(32+1).join("0") + (position.hash1 < 0 ? position.hash1 + Math.pow(2,32) : position.hash1).toString(2)).slice(-32);
			this.debugInfo.check = position.check;
		},
		move(fromIdx, toIdx) {
			if (fromIdx === toIdx) {
				this.selectedPiece = null;
				return;
			}
			switch (position.canMove(fromIdx, toIdx)) {
			case 1:
				this.move_(fromIdx, toIdx, false);
				break;
			case 2:
				this.move_(fromIdx, toIdx, true);
				break;
			case 3:
				this.promotionSelect.unpromotedPiece.label = LABEL_TABLE[position.board[fromIdx] & 0b111];
				this.promotionSelect.unpromotedPiece.black = position.player === 0b010000,
				this.promotionSelect.promotedPiece.label   = LABEL_TABLE[position.board[fromIdx] & 0b111 | 0b1000];
				this.promotionSelect.promotedPiece.black   = position.player === 0b010000,
				this.promotionSelect.show = true;
				this.promotionSelect.fromIdx = fromIdx;
				this.promotionSelect.toIdx = toIdx;
				this.promotionSelect.x = 102 + 41 * ((toIdx - 11) % 10) + 20;
				this.promotionSelect.y = 2 + 41 * ((toIdx - 11) / 10 | 0);
				break;
			}
		},
		move_(fromIdx, toIdx, promote) {
			if (fromIdx & 0b10000000) {
				position.doMove({
					fromIdx,
					toIdx,
					from: 0,
					to: (fromIdx & 0b111) + 1 | position.player,
					capture: 0,
				});
			} else {
				let from = position.board[fromIdx];
				position.doMove({
					fromIdx,
					toIdx,
					from: from,
					to: promote ? from | 0b1000 : from,
					capture: position.board[toIdx],
				});
			}

			this.draw();
			this.selectedPiece = null;

			var judgeResult = position.judge();
			if (judgeResult) {
				this.gameEnd(judgeResult.winner, judgeResult.reason || "");
				return;
			}

			this.sound && sound[position.check ? "check" : "move"]();

			if ((this.gameMode === "sente" | this.gameMode === "gote") && position.player === 0b100000)
				window.setTimeout(() => this.moveByAI(), 100);
		},
		moveByAI() {
			if (this.gameMode === null)
				return;

			var startTime = new Date().getTime();
			var move = ai(position, searchDepth);
			this.debugInfo.thinkTime = new Date().getTime() - startTime;
			this.debugInfo.thinkScore = move.score;

			if (move === null) {
				this.gameResult = "あなたの勝ちです?";
				return;
			}
			position.doMove(move);

			this.promotionSelect.show = false;
			this.draw();

			var judgeResult = position.judge();
			if (judgeResult) {
				this.gameEnd(judgeResult.winner, judgeResult.reason || "");
				return;
			}

			this.sound && sound[position.check ? "check" : "move"]();
		},
		gameEnd(winner, message) {
			if (winner === null) {
					this.gameResult = "引き分けです " + message;
			} else {
				switch (this.gameMode) {
				case "sente":
				case "gote":
					this.gameResult = (winner === "black" ? "あなたの勝ちです" : "あなたの負けです") + " " + message;
					break;
				case "free":
					this.gameResult = (winner === "black" ? "先手の勝ちです" : "後手の勝ちです") + " " + message;
					break;
				}
			}
			this.sound && sound.gameEnd();
		},
		gameStart(mode) {
			if (["sente", "gote", "free"].indexOf(mode) === -1)
				return;

			this.gameMode = mode;
			this.selectedPiece = null;
			position = new Position();
			this.promotionSelect.show = false;
			this.gameResult = null;
			this.draw();
			this.sound && sound.gameStart();

			if (this.gameMode === "gote") {
				position.player ^= 0b110000;
				window.setTimeout(() => this.moveByAI(), 300);
			}
		},
		selectPiece(event, piece) {
			if (this.gameMode === null)
				return;

			if (this.selectedPiece === piece) {
				this.selectedPiece = null;
			} else if (this.selectedPiece &&
								 !(this.selectedPiece.index & 0b10000000) &&
								 !(piece.index & 0b10000000)) {
				this.move(this.selectedPiece.index, piece.index);
			} else if (piece.black === !!(position.player & 0b010000)) {
				this.selectedPiece = piece;
			}
		},
		selectSquare(event, x, y) {
			if (this.gameMode === null)
				return;

			if (this.selectedPiece !== null)
				this.move(this.selectedPiece.index, 11 + 10 * y + x);
		},
		selectPromote() {
			this.move_(this.promotionSelect.fromIdx, this.promotionSelect.toIdx, true);
			this.promotionSelect.show = false;
		},
		selectUnpromote() {
			this.move_(this.promotionSelect.fromIdx, this.promotionSelect.toIdx, false);
			this.promotionSelect.show = false;
		},
	},
	components: {
		"piece": pieceComponent,
	},
});


searchDepth = +getUrlParameter("sd", searchDepth);
appVm.enableDebug = !!getUrlParameter("debug", false);
appVm.init();


function getUrlParameter(key, def) {
	var str = location.search.split("?");
	if (str.length < 2) {
		return def || "";
	}

	var params = str[1].split("&");
	for (var i = 0; i < params.length; i++) {
		var keyVal = params[i].split("=");
		if (keyVal[0] === key && keyVal.length === 2) {
			return decodeURIComponent(keyVal[1]);
		}
	}
	return def !== undefined ? def : "";
};
