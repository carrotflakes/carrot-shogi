/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _vue = __webpack_require__(2);

	var _vue2 = _interopRequireDefault(_vue);

	var _positionJs = __webpack_require__(3);

	var _positionJs2 = _interopRequireDefault(_positionJs);

	var _aiJs = __webpack_require__(4);

	var _aiJs2 = _interopRequireDefault(_aiJs);

	var _componentsPieceVue = __webpack_require__(5);

	var _componentsPieceVue2 = _interopRequireDefault(_componentsPieceVue);

	var position = new _positionJs2["default"]();

	var LABEL_TABLE = {
		1: "王将",
		2: "飛車",
		3: "角行",
		4: "金将",
		5: "銀将",
		6: "桂馬",
		7: "香車",
		8: "歩兵",
		18: "竜王",
		19: "竜馬",
		21: "成銀",
		22: "成桂",
		23: "成香",
		24: "と金"
	};

	_vue2["default"].filter('position', function (piece) {
		var x = piece.x,
		    y = piece.y,
		    angle = piece.black ? 0 : 180;

		return "translate(" + x + ", " + y + ") rotate(" + angle + ")";
	});

	var appVm = new _vue2["default"]({
		el: "#app",
		data: {
			pieces: [],
			selectedPiece: null,
			lastMoveIndex: 0,
			unpromotedPiece: {
				label: "歩兵",
				x: -31,
				y: 31,
				black: true
			},
			promotedPiece: {
				label: "と金",
				x: 31,
				y: 31,
				black: true
			},
			promotionSelect: {
				show: false,
				x: 0,
				y: 0,
				fromIdx: 0,
				toIdx: 0
			}
		},
		methods: {
			init: function init() {
				this.selectedPiece = null;
				position = new _positionJs2["default"]();
				this.draw();
			},
			undo: function undo() {
				this.selectedPiece = null;
				position.unmove();
				this.draw();
			},
			draw: function draw() {
				var newPieces = [];
				for (var i = 0; i < position.board.length; ++i) {
					var sq = position.board[i],
					    label = LABEL_TABLE[sq & 31];
					if (label) {
						newPieces.push({
							label: label,
							black: !!(sq & 32),
							x: 100 + 2 + 41 * ((i - 11) % 10) + 20,
							y: 2 + 41 * ((i - 11) / 10 | 0) + 20,
							index: i,
							_uid: (i << 8) + sq
						});
					}
				}
				for (var i = 0; i < position.bPieces.length; ++i) {
					for (var j = 0; j < position.bPieces[i]; ++j) {
						newPieces.push({
							label: LABEL_TABLE[i + 2],
							black: true,
							x: 512 + 6 * j,
							y: 372 - 22 - i * 40,
							index: i ^ 128,
							_uid: (i << 8) + j
						});
					}
				}
				for (var i = 0; i < position.wPieces.length; ++i) {
					for (var j = 0; j < position.wPieces[i]; ++j) {
						newPieces.push({
							label: LABEL_TABLE[i + 2],
							black: false,
							x: 20 + 6 * j,
							y: 22 + i * 40,
							index: i ^ 128,
							_uid: (i << 8) + j
						});
					}
				}
				this.pieces = newPieces;

				var hl = position.history.length;
				this.lastMoveIndex = hl > 0 ? position.history[hl - 1].toIdx : 0;
			},
			move: function move(fromIdx, toIdx) {
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
						this.unpromotedPiece.label = LABEL_TABLE[position.board[fromIdx] & 15];
						this.unpromotedPiece.black = !!(position.player & 32), this.promotedPiece.label = LABEL_TABLE[position.board[fromIdx] & 15 | 16];
						this.promotedPiece.black = !!(position.player & 32), this.promotionSelect.show = true;
						this.promotionSelect.fromIdx = fromIdx;
						this.promotionSelect.toIdx = toIdx;
						this.promotionSelect.x = 102 + 41 * ((toIdx - 11) % 10) + 20;
						this.promotionSelect.y = 2 + 41 * ((toIdx - 11) / 10 | 0);
						break;
				}
			},
			move_: function move_(fromIdx, toIdx, promote) {
				if (fromIdx & 128) {
					position.move({
						fromIdx: fromIdx,
						toIdx: toIdx,
						from: 0,
						to: (fromIdx & 15) + 2 | position.player,
						capture: 0
					});
				} else {
					var from = position.board[fromIdx];
					position.move({
						fromIdx: fromIdx,
						toIdx: toIdx,
						from: from,
						to: promote ? from | 16 : from,
						capture: position.board[toIdx]
					});
				}

				this.draw();
				this.selectedPiece = null;
			},
			selectPiece: function selectPiece(event, piece) {
				if (this.selectedPiece === piece) {
					this.selectedPiece = null;
				} else if (this.selectedPiece && !(this.selectedPiece.index & 128) && !(piece.index & 128)) {
					this.move(this.selectedPiece.index, piece.index);
				} else if (piece.black === !!(position.player & 32)) {
					this.selectedPiece = piece;
				}
			},
			selectSquare: function selectSquare(event, x, y) {
				if (this.selectedPiece !== null) this.move(this.selectedPiece.index, 11 + 10 * y + x);
			},
			selectPromote: function selectPromote() {
				this.move_(this.promotionSelect.fromIdx, this.promotionSelect.toIdx, true);
				this.promotionSelect.show = false;
			},
			selectUnpromote: function selectUnpromote() {
				this.move_(this.promotionSelect.fromIdx, this.promotionSelect.toIdx, false);
				this.promotionSelect.show = false;
			},

			command: function command(cmd) {
				if (cmd === "allMoves") console.dir(position.allMoves());
				if (cmd === "ai") {
					var move = (0, _aiJs2["default"])(position);
					console.dir(move);
					position.move(move);
					this.draw();
				}
			}
		},
		components: {
			"piece": _componentsPieceVue2["default"]
		}
	});

	appVm.init();

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	module.exports = Vue;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Position = (function () {
		_createClass(Position, null, [{
			key: "MAX_MOVES_NUM_IN_A_POSITION",
			get: function get() {
				return 593;
			}
		}]);

		function Position() {
			_classCallCheck(this, Position);

			this.player = 32;
			this.board = new Uint8Array(111);
			this.bPieces = new Uint8Array(7);
			this.wPieces = new Uint8Array(7);
			this.history = [];

			for (var i = 0; i < 10; ++i) {
				this.board[i] = 128;
				this.board[i * 10 + 10] = 128;
				this.board[i + 101] = 128;
			}

			this.board[11 + 10 * 0 + 0] = 71;
			this.board[11 + 10 * 0 + 1] = 70;
			this.board[11 + 10 * 0 + 2] = 69;
			this.board[11 + 10 * 0 + 3] = 68;
			this.board[11 + 10 * 0 + 4] = 65;
			this.board[11 + 10 * 0 + 5] = 68;
			this.board[11 + 10 * 0 + 6] = 69;
			this.board[11 + 10 * 0 + 7] = 70;
			this.board[11 + 10 * 0 + 8] = 71;
			this.board[11 + 10 * 1 + 1] = 66;
			this.board[11 + 10 * 1 + 7] = 67;

			for (var i = 0; i < 9; ++i) {
				this.board[11 + 10 * 2 + i] = 72;
			}this.board[11 + 10 * 8 + 0] = 39;
			this.board[11 + 10 * 8 + 1] = 38;
			this.board[11 + 10 * 8 + 2] = 37;
			this.board[11 + 10 * 8 + 3] = 36;
			this.board[11 + 10 * 8 + 4] = 33;
			this.board[11 + 10 * 8 + 5] = 36;
			this.board[11 + 10 * 8 + 6] = 37;
			this.board[11 + 10 * 8 + 7] = 38;
			this.board[11 + 10 * 8 + 8] = 39;
			this.board[11 + 10 * 7 + 1] = 35;
			this.board[11 + 10 * 7 + 7] = 34;

			for (var i = 0; i < 9; ++i) {
				this.board[11 + 10 * 6 + i] = 40;
			}
		}

		_createClass(Position, [{
			key: "allMoves",
			value: function allMoves(ma, mi) {
				var board = this.board,
				    player = this.player,
				    opPlayer = player ^ 96,
				    pieces = player === 32 ? this.bPieces : this.wPieces,
				    fuUsed = 1 << 0;

				for (var i = 11; i < 101; ++i) {
					var sq = board[i],
					    promotable = player === 32 ? i < 40 : 70 < i,
					    j = undefined;

					if (!(sq & player)) continue;
					switch (sq & 31) {
						case 1:
							if (board[j = i - 11] === 0 || board[j] & opPlayer) {
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i - 10] === 0 || board[j] & opPlayer) {
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i - 9] === 0 || board[j] & opPlayer) {
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i - 1] === 0 || board[j] & opPlayer) {
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i + 1] === 0 || board[j] & opPlayer) {
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i + 9] === 0 || board[j] & opPlayer) {
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i + 10] === 0 || board[j] & opPlayer) {
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i + 11] === 0 || board[j] & opPlayer) {
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							break;
						case 18:
							if (board[j = i - 11] === 0 || board[j] & opPlayer) {
								if (promotable || (player === 32 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i - 9] === 0 || board[j] & opPlayer) {
								if (promotable || (player === 32 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i + 11] === 0 || board[j] & opPlayer) {
								if (promotable || (player === 32 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i + 9] === 0 || board[j] & opPlayer) {
								if (promotable || (player === 32 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
						case 2:
							for (j = i - 10; board[j] === 0; j -= 10) {
								if (promotable || (player === 32 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = 0;
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = 0;
							}
							if (board[j] & opPlayer) {
								if (promotable || (player === 32 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							for (j = i + 10; board[j] === 0; j += 10) {
								if (promotable || (player === 32 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = 0;
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = 0;
							}
							if (board[j] & opPlayer) {
								if (promotable || (player === 32 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							for (j = i - 1; board[j] === 0; j -= 1) {
								if (promotable) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = 0;
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = 0;
							}
							if (board[j] & opPlayer) {
								if (promotable) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							for (j = i + 1; board[j] === 0; j += 1) {
								if (promotable) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = 0;
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = 0;
							}
							if (board[j] & opPlayer) {
								if (promotable) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							break;
						case 19:
							if (board[j = i - 10] === 0 || board[j] & opPlayer) {
								if (promotable || (player === 32 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i + 10] === 0 || board[j] & opPlayer) {
								if (promotable || (player === 32 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i - 1] === 0 || board[j] & opPlayer) {
								if (promotable) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i + 1] === 0 || board[j] & opPlayer) {
								if (promotable) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
						case 3:
							for (j = i - 11; board[j] === 0; j -= 11) {
								if (promotable || (player === 32 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = 0;
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = 0;
							}
							if (board[j] & opPlayer) {
								if (promotable || (player === 32 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							for (j = i - 9; board[j] === 0; j -= 9) {
								if (promotable || (player === 32 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = 0;
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = 0;
							}
							if (board[j] & opPlayer) {
								if (promotable || (player === 32 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							for (j = i + 9; board[j] === 0; j += 9) {
								if (promotable || (player === 32 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = 0;
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = 0;
							}
							if (board[j] & opPlayer) {
								if (promotable || (player === 32 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							for (j = i + 11; board[j] === 0; j += 11) {
								if (promotable || (player === 32 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = 0;
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = 0;
							}
							if (board[j] & opPlayer) {
								if (promotable || (player === 32 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							break;
						case 4:
						case 21:
						case 22:
						case 23:
						case 24:
							if (board[j = i - 10] === 0 || board[j] & opPlayer) {
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i - 1] === 0 || board[j] & opPlayer) {
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i + 1] === 0 || board[j] & opPlayer) {
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i + 10] === 0 || board[j] & opPlayer) {
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (player === 32) {
								if (board[j = i - 11] === 0 || board[j] & opPlayer) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
								}
								if (board[j = i - 9] === 0 || board[j] & opPlayer) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
								}
							} else {
								if (board[j = i + 9] === 0 || board[j] & opPlayer) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
								}
								if (board[j = i + 11] === 0 || board[j] & opPlayer) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
								}
							}
							break;
						case 5:
							if (board[j = i - 11] === 0 || board[j] & opPlayer) {
								if (promotable || (player === 32 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i - 9] === 0 || board[j] & opPlayer) {
								if (promotable || (player === 32 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i + 9] === 0 || board[j] & opPlayer) {
								if (promotable || (player === 32 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i + 11] === 0 || board[j] & opPlayer) {
								if (promotable || (player === 32 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (player === 32) {
								if (board[j = i - 10] === 0 || board[j] & opPlayer) {
									if (promotable || j < 40) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
									}
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
								}
							} else {
								if (board[j = i + 10] === 0 || board[j] & opPlayer) {
									if (promotable || 70 < j) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
									}
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
								}
							}
							break;
						case 6:
							if (player === 32) {
								if (board[j = i - 21] === 0 || board[j] & opPlayer) {
									if (j < 40) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
									}
									if (30 < j) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
									}
								}
								if (board[j = i - 19] === 0 || board[j] & opPlayer) {
									if (j < 40) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
									}
									if (30 < j) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
									}
								}
							} else {
								if (board[j = i + 19] === 0 || board[j] & opPlayer) {
									if (70 < j) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
									}
									if (j < 80) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
									}
								}
								if (board[j = i + 21] === 0 || board[j] & opPlayer) {
									if (70 < j) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
									}
									if (j < 80) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
									}
								}
							}
							break;
						case 7:
							if (player === 32) {
								for (j = i - 10; board[j] === 0; j -= 10) {
									if (j < 40) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = 0;
									}
									if (20 < j) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = 0;
									}
								}
								if (board[j] & opPlayer) {
									if (j < 40) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
									}
									if (20 < j) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
									}
								}
							} else {
								for (j = i + 10; board[j] === 0; j += 10) {
									if (70 < j) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = 0;
									}
									if (j < 90) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = 0;
									}
								}
								if (board[j] & opPlayer) {
									if (70 < j) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
									}
									if (j < 90) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
									}
								}
							}
							break;
						case 8:
							if (player === 32) {
								if (board[j = i - 10] === 0 || board[j] & opPlayer) {
									if (j < 40) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
									}
									if (20 < j) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
									}
								}
							} else {
								if (board[j = i + 10] === 0 || board[j] & opPlayer) {
									if (70 < j) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 16;ma[mi++] = board[j];
									}
									if (j < 90) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
									}
								}
							}
							fuUsed |= 1 << i % 10;
							break;
					}
				}

				for (var i = 11; i < 101; ++i) {
					if (board[i] !== 0) continue;
					if (pieces[0]) {
						ma[mi++] = 128;ma[mi++] = i;mi++;ma[mi++] = 2 | player;mi++;
					}
					if (pieces[1]) {
						ma[mi++] = 129;ma[mi++] = i;mi++;ma[mi++] = 3 | player;mi++;
					}
					if (pieces[2]) {
						ma[mi++] = 130;ma[mi++] = i;mi++;ma[mi++] = 4 | player;mi++;
					}
					if (pieces[3]) {
						ma[mi++] = 131;ma[mi++] = i;mi++;ma[mi++] = 5 | player;mi++;
					}
				}
				if (player === 32) {
					if (pieces[4]) {
						for (var i = 31; i < 101; ++i) {
							if (board[i] === 0) {
								ma[mi++] = 132;ma[mi++] = i;mi++;ma[mi++] = 6 | 32;mi++;
							}
						}
					}
					for (var i = 21; i < 101; ++i) {
						if (board[i] !== 0) continue;
						if (pieces[5]) {
							ma[mi++] = 133;ma[mi++] = i;mi++;ma[mi++] = 7 | 32;mi++;
						}
						if (pieces[6] && !(fuUsed & 1 << i % 10)) {
							ma[mi++] = 134;ma[mi++] = i;mi++;ma[mi++] = 8 | 32;mi++;
						}
					}
				} else {
					if (pieces[4]) {
						for (var i = 11; i < 81; ++i) {
							if (board[i] === 0) {
								ma[mi++] = 132;ma[mi++] = i;mi++;ma[mi++] = 6 | 64;mi++;
							}
						}
					}
					for (var i = 11; i < 91; ++i) {
						if (board[i] !== 0) continue;
						if (pieces[5]) {
							ma[mi++] = 133;ma[mi++] = i;mi++;ma[mi++] = 7 | 64;mi++;
						}
						if (pieces[6] && !(fuUsed & 1 << i % 10)) {
							ma[mi++] = 134;ma[mi++] = i;mi++;ma[mi++] = 8 | 64;mi++;
						}
					}
				}

				return mi;
			}
		}, {
			key: "move",
			value: function move(_move) {
				var fromIdx = _move.fromIdx,
				    toIdx = _move.toIdx,
				    board = this.board,
				    player = this.player;

				if (fromIdx & 128) {
					board[toIdx] = _move.to;

					if (player & 32) this.bPieces[fromIdx & 127] -= 1;else this.wPieces[fromIdx & 127] -= 1;
				} else {
					board[toIdx] = _move.to;
					board[fromIdx] = 0;

					var capture = _move.capture;
					if (capture) {
						if (player & 32) this.bPieces[PIECES_INDEX_TABLE[capture & 15]] += 1;else this.wPieces[PIECES_INDEX_TABLE[capture & 15]] += 1;
					}
				}
				this.player = player ^ 96;
				this.history.push(_move);
			}
		}, {
			key: "unmove",
			value: function unmove() {
				var move = this.history.pop(),
				    fromIdx = move.fromIdx,
				    toIdx = move.toIdx,
				    board = this.board,
				    player = this.player ^= 96;

				if (fromIdx & 128) {
					board[toIdx] = 0;

					if (player & 32) this.bPieces[fromIdx & 127] += 1;else this.wPieces[fromIdx & 127] += 1;
				} else {
					board[fromIdx] = move.from;

					var capture = move.capture;
					if (capture) {
						board[toIdx] = capture;

						if (player & 32) this.bPieces[PIECES_INDEX_TABLE[capture & 15]] -= 1;else this.wPieces[PIECES_INDEX_TABLE[capture & 15]] -= 1;
					} else {
						board[toIdx] = 0;
					}
				}
			}
		}, {
			key: "move_",
			value: function move_(ma, mi) {
				var fromIdx = ma[mi],
				    toIdx = ma[mi + 1],
				    board = this.board,
				    player = this.player;

				if (fromIdx & 128) {
					board[toIdx] = ma[mi + 3];

					if (player & 32) this.bPieces[fromIdx & 127] -= 1;else this.wPieces[fromIdx & 127] -= 1;
				} else {
					board[toIdx] = ma[mi + 3];
					board[fromIdx] = 0;

					var capture = ma[mi + 4];
					if (capture) {
						if (player & 32) this.bPieces[PIECES_INDEX_TABLE[capture & 15]] += 1;else this.wPieces[PIECES_INDEX_TABLE[capture & 15]] += 1;
					}
				}
				this.player = player ^ 96;
			}
		}, {
			key: "unmove_",
			value: function unmove_(ma, mi) {
				var fromIdx = ma[mi],
				    toIdx = ma[mi + 1],
				    board = this.board,
				    player = this.player ^= 96;

				if (fromIdx & 128) {
					board[toIdx] = 0;

					if (player & 32) this.bPieces[fromIdx & 127] += 1;else this.wPieces[fromIdx & 127] += 1;
				} else {
					board[fromIdx] = ma[mi + 2];

					var capture = ma[mi + 4];
					if (capture) {
						board[toIdx] = capture;

						if (player & 32) this.bPieces[PIECES_INDEX_TABLE[capture & 15]] -= 1;else this.wPieces[PIECES_INDEX_TABLE[capture & 15]] -= 1;
					} else {
						board[toIdx] = 0;
					}
				}
			}
		}, {
			key: "canMove",
			value: function canMove(fromIdx, toIdx) {
				var moveArray = new Uint8Array(Position.MAX_MOVES_NUM_IN_A_POSITION * 5),
				    mi = this.allMoves(moveArray, 0),
				    result = 0;
				for (var i = 0; i < mi; i += 5) if (moveArray[i] == fromIdx && moveArray[i + 1] == toIdx) result |= moveArray[i + 2] === moveArray[i + 3] ? 1 : 2;
				return result;
			}
		}]);

		return Position;
	})();

	exports["default"] = Position;

	var PIECES_INDEX_TABLE = {
		2: 0,
		3: 1,
		4: 2,
		5: 3,
		6: 4,
		7: 5,
		8: 6
	};

	module.exports = Position;
	module.exports = exports["default"];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports["default"] = ai;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _positionJs = __webpack_require__(3);

	var _positionJs2 = _interopRequireDefault(_positionJs);

	var PIECE_SCORE_TABLE = new Uint16Array(24 + 1);
	PIECE_SCORE_TABLE[1] = 500;
	PIECE_SCORE_TABLE[2] = 50;
	PIECE_SCORE_TABLE[3] = 45;
	PIECE_SCORE_TABLE[4] = 30;
	PIECE_SCORE_TABLE[5] = 27;
	PIECE_SCORE_TABLE[6] = 18;
	PIECE_SCORE_TABLE[7] = 16;
	PIECE_SCORE_TABLE[8] = 10;
	PIECE_SCORE_TABLE[18] = 70;
	PIECE_SCORE_TABLE[19] = 65;
	PIECE_SCORE_TABLE[21] = 30;
	PIECE_SCORE_TABLE[22] = 30;
	PIECE_SCORE_TABLE[23] = 30;
	PIECE_SCORE_TABLE[24] = 30;

	var MAX_SEARCH_DEPTH = 5;

	var moveArray = new Uint8Array(_positionJs2["default"].MAX_MOVES_NUM_IN_A_POSITION * MAX_SEARCH_DEPTH * 5);

	function evalPosition(position) {
		var board = position.board,
		    bPieces = position.bPieces,
		    wPieces = position.wPieces,
		    score = 0;
		for (var i = 11; i < 101; ++i) {
			var sq = board[i];
			if (sq & 32) score += PIECE_SCORE_TABLE[sq & 31];else if (sq & 64) score -= PIECE_SCORE_TABLE[sq & 31];
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
		if (position.player === 64) score = -score;
		return score;
	}

	function sortMoves(position, moves) {}

	function search(position, depth, alpha, beta, mi) {
		if (depth === 0) return evalPosition(position);
		var mi2 = position.allMoves(moveArray, mi);
		//sortMoves(position, moves);

		for (var i = mi; i < mi2; i += 5) {
			position.move_(moveArray, i);
			var score = -search(position, depth - 1, -beta, -alpha, mi2);
			position.unmove_(moveArray, i);
			if (alpha < score) {
				alpha = score;
				if (beta <= alpha) return alpha;
			}
		}
		return alpha;
	}

	function ai(position) {
		var mi = position.allMoves(moveArray, 0);
		//sortMoves(position, moves);

		var bestMove = 0,
		    alpha = -4096;
		for (var i = 0; i < mi; i += 5) {
			position.move_(moveArray, i);
			var score = -search(position, 3, -4096, -alpha, mi);
			position.unmove_(moveArray, i);
			if (alpha < score) {
				bestMove = i;
				alpha = score;
			}
		}
		return {
			fromIdx: moveArray[bestMove + 0],
			toIdx: moveArray[bestMove + 1],
			from: moveArray[bestMove + 2],
			to: moveArray[bestMove + 3],
			capture: moveArray[bestMove + 4]
		};
	}

	module.exports = exports["default"];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(6)
	module.exports = __webpack_require__(10)
	module.exports.template = __webpack_require__(11)
	if (false) {
	(function () {
	var Vue = require("vue")
	var hotAPI = require("/home/yuki/program/carrot-shogi/node_modules/vue-loader/lib/hot-reload-api.js")
	hotAPI.install(Vue)
	if (!hotAPI.compatible) return
	var map = Vue.config._hotComponents
	var id = module.exports.hotID = "-!babel?optional[]=runtime!./../../node_modules/vue-loader/lib/selector.js?type=script&index=0!./piece.vue"
	module.hot.accept(["-!babel?optional[]=runtime!./../../node_modules/vue-loader/lib/selector.js?type=script&index=0!./piece.vue","-!vue-html!./../../node_modules/vue-loader/lib/selector.js?type=template&index=0!./piece.vue"], function () {
	var Ctor = map[id].Ctor
	Ctor.options = Vue.util.mergeOptions(Vue.options, require("-!babel?optional[]=runtime!./../../node_modules/vue-loader/lib/selector.js?type=script&index=0!./piece.vue"))
	Ctor.options.template = require("-!vue-html!./../../node_modules/vue-loader/lib/selector.js?type=template&index=0!./piece.vue")
	Ctor.linker = null
	map[id].instances.forEach(hotAPI.update)
	})
	})()
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(7);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(9)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/vue-loader/lib/selector.js?type=style&index=0!./piece.vue", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/vue-loader/lib/selector.js?type=style&index=0!./piece.vue");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(8)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 8 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = {
	  props: ["$data", "onClick"],
	  inherit: true
	};
	module.exports = exports["default"];

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = "<g class=\"piece\"\n\t\t v-attr=\"transform: $data | position\"\n\t\t v-on=\"click: onClick($event, $data)\">\n\t\t <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#pieceShape\"\n\t\t\t \t\tfill=\"{{$data === selectedPiece ? '#FFEACF' : '#F0C895'}}\"\n\t\t\t\t\tstroke=\"#5C4425\" />\n\t\t <text x=\"-7\" y=\"0\"  fill=\"#5C4425\" font-size=\"14px\">{{label[0]}}</text>\n\t\t <text x=\"-7\" y=\"14\" fill=\"#5C4425\" font-size=\"14px\">{{label[1]}}</text>\n\t</g>";

/***/ }
/******/ ]);