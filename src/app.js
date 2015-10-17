import Vue from "vue";
import Position from "./position.js";
import ai from "./ai.js";
import pieceComponent from "./components/piece.vue";


const LABEL_TABLE = {
	0b00001: "王将",
	0b00010: "飛車",
	0b00011: "角行",
	0b00100: "金将",
	0b00101: "銀将",
	0b00110: "桂馬",
	0b00111: "香車",
	0b01000: "歩兵",
	0b10010: "竜王",
	0b10011: "竜馬",
	0b10101: "成銀",
	0b10110: "成桂",
	0b10111: "成香",
	0b11000: "と金",
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
		promotionSelect: {
			show: false,
			x: 0,
			y: 0,
			fromIdx: 0,
			toIdx: 0,
		},
	},
	methods: {
		init() {
			this.selectedPiece = null;
			position = new Position();
			this.promotionSelect.show = false;
			this.draw();
		},
		undo() {
			this.selectedPiece = null;
			position.unmove();
			this.promotionSelect.show = false;
			this.draw();
		},
		draw() {
			var newPieces = [];
			for (let i = 0; i < position.board.length; ++i) {
				let sq = position.board[i],
				label = LABEL_TABLE[sq & 0b11111];
				if (label) {
					newPieces.push({
						label: label,
						black: !!(sq & 0b0100000),
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
						label: LABEL_TABLE[i + 2],
						black: true,
						x: 512 + 6 * j,
						y: 372 - 22 - i * 40,
						index: i ^ 0b10000000,
						_uid: (1 << 16) + (i << 8) + j,
					});
				}
			}
			for (let i = 0; i < position.wPieces.length; ++i) {
				for (let j = 0; j < position.wPieces[i]; ++j) {
					newPieces.push({
						label: LABEL_TABLE[i + 2],
						black: false,
						x: 20 + 6 * j,
						y: 22 + i * 40,
						index: i ^ 0b10000000,
						_uid: (2 << 16) + (i << 8) + j,
					});
				}
			}
			this.pieces = newPieces;

			var hl = position.history.length;
			this.lastMoveIndex = hl > 0 ? position.history[hl-1].toIdx : 0;
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
				this.unpromotedPiece.label = LABEL_TABLE[position.board[fromIdx] & 0b1111];
				this.unpromotedPiece.black = !!(position.player & 0b0100000),
				this.promotedPiece.label = LABEL_TABLE[position.board[fromIdx] & 0b1111 | 0b10000];
				this.promotedPiece.black = !!(position.player & 0b0100000),
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
				position.move({
					fromIdx,
					toIdx,
					from: 0,
					to: (fromIdx & 0b1111) + 2 | position.player,
					capture: 0,
				});
			} else {
				let from = position.board[fromIdx];
				position.move({
					fromIdx,
					toIdx,
					from: from,
					to: promote ? from | 0b10000 : from,
					capture: position.board[toIdx],
				});
			}

			this.draw();
			this.selectedPiece = null;
		},
		selectPiece(event, piece) {
			if (this.selectedPiece === piece) {
				this.selectedPiece = null;
			} else if (this.selectedPiece &&
								 !(this.selectedPiece.index & 0b10000000) &&
								 !(piece.index & 0b10000000)) {
				this.move(this.selectedPiece.index, piece.index);
			} else if (piece.black === !!(position.player & 0b0100000)) {
				this.selectedPiece = piece;
			}
		},
		selectSquare(event, x, y) {
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

		command(cmd) {
			if (cmd === "allMoves")
				console.dir(position.allMoves());
			if (cmd === "ai") {
				var move = ai(position, searchDepth);
				position.move(move);
				this.promotionSelect.show = false;
				this.draw();
			}
		},
	},
	components: {
		"piece": pieceComponent,
	},
});


searchDepth = +getUrlParameter("sd", searchDepth);
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
