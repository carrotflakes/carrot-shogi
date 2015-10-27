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

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _vue = __webpack_require__(2);

	var _vue2 = _interopRequireDefault(_vue);

	var _positionJs = __webpack_require__(3);

	var _positionJs2 = _interopRequireDefault(_positionJs);

	var _aiJs = __webpack_require__(5);

	var ai = _interopRequireWildcard(_aiJs);

	var _bitsJs = __webpack_require__(4);

	var bits = _interopRequireWildcard(_bitsJs);

	var _soundJs = __webpack_require__(6);

	var sound = _interopRequireWildcard(_soundJs);

	var _positionBookJs = __webpack_require__(7);

	var positionBook = _interopRequireWildcard(_positionBookJs);

	var _componentsPieceVue = __webpack_require__(8);

	var _componentsPieceVue2 = _interopRequireDefault(_componentsPieceVue);

	var LABEL_TABLE = {
		1: "飛車",
		2: "角行",
		3: "金将",
		4: "銀将",
		5: "桂馬",
		6: "香車",
		7: "歩兵",
		8: "玉将",
		9: "竜王",
		10: "竜馬",
		12: "成銀",
		13: "成桂",
		14: "成香",
		15: "と金"
	};

	var position = new _positionJs2["default"]();

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
					promoted: false
				},
				promotedPiece: {
					label: "と金",
					x: 31,
					y: 31,
					black: true,
					promoted: true
				}
			},
			aiParameter: {
				time: 300,
				searchDepth: 5,
				randomness: 5
			},
			soundAvailable: sound.AVAILABLE,
			sound: true,
			enableDebug: false,
			debugInfo: {
				hash: null,
				check: null,
				count: null,
				thinkTime: null,
				thinkTimeTotal: 0,
				thinkTimeSampleCount: 0,
				thinkScore: null,
				expectedMoves: null,
				allMovesCount: null,
				positionList: positionBook.list
			}
		},
		methods: {
			init: function init() {
				this.gameMode = null;
				this.gameResult = null;
			},
			matta: function matta() {
				if (this.gameMode === null || this.gameResult !== null || position.count < 2) return;

				this.selectedPiece = null;
				position.undoMove();
				position.undoMove();
				this.promotionSelect.show = false;
				this.draw();
			},
			undo: function undo() {
				if (position.count === 0) return;

				this.gameResult = null;
				this.selectedPiece = null;
				position.undoMove();
				this.promotionSelect.show = false;
				this.draw();
			},
			reset: function reset() {
				this.gameMode = this.gameResult = null;
				this.sound && sound.move();
			},
			draw: function draw() {
				var newPieces = [];
				for (var i = 0; i < position.board.length; ++i) {
					var sq = position.board[i],
					    label = LABEL_TABLE[sq & 15];
					if (label) {
						newPieces.push({
							label: label,
							black: !!(sq & 16),
							x: 100 + 2 + 41 * ((i - 11) % 10) + 20,
							y: 2 + 41 * ((i - 11) / 10 | 0) + 20,
							index: i,
							promoted: !!((sq & 15) !== 8 && sq & 8),
							_uid: (i << 8) + sq
						});
					}
				}
				for (var i = 0; i < position.bPieces.length; ++i) {
					for (var j = 0; j < position.bPieces[i]; ++j) {
						newPieces.push({
							label: LABEL_TABLE[i + 1],
							black: true,
							x: 496 + 4 * j + 48 * (i % 2),
							y: 372 - 22 - (i / 2 | 0) * 40,
							index: i,
							promoted: false,
							_uid: (1 << 16) + (i << 8) + j
						});
					}
				}
				for (var i = 0; i < position.wPieces.length; ++i) {
					for (var j = 0; j < position.wPieces[i]; ++j) {
						newPieces.push({
							label: LABEL_TABLE[i + 1],
							black: false,
							x: 20 + 4 * j + 48 * (i % 2),
							y: 22 + (i / 2 | 0) * 40,
							index: i,
							promoted: false,
							_uid: (2 << 16) + (i << 8) + j
						});
					}
				}
				this.pieces = newPieces;

				this.lastMoveIndex = position.count > 0 ? position.history[position.count - 1].toIdx : 0;

				this.debugInfo.hash = bits.print54(position.hash);
				this.debugInfo.check = position.check;
				this.debugInfo.count = position.count;
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
						this.promotionSelect.unpromotedPiece.label = LABEL_TABLE[position.board[fromIdx] & 7];
						this.promotionSelect.unpromotedPiece.black = position.player === 16, this.promotionSelect.promotedPiece.label = LABEL_TABLE[position.board[fromIdx] & 7 | 8];
						this.promotionSelect.promotedPiece.black = position.player === 16, this.promotionSelect.show = true;
						this.promotionSelect.fromIdx = fromIdx;
						this.promotionSelect.toIdx = toIdx;
						this.promotionSelect.x = 102 + 41 * ((toIdx - 11) % 10) + 20;
						this.promotionSelect.y = 2 + 41 * ((toIdx - 11) / 10 | 0);
						break;
				}
			},
			move_: function move_(fromIdx, toIdx, promote) {
				var _this = this;

				if (fromIdx & 120) {
					var from = position.board[fromIdx];
					position.doMove({
						fromIdx: fromIdx,
						toIdx: toIdx,
						from: from,
						to: promote ? from | 8 : from,
						capture: position.board[toIdx]
					});
				} else {
					position.doMove({
						fromIdx: fromIdx,
						toIdx: toIdx,
						from: 0,
						to: fromIdx + 1 | position.player,
						capture: 0
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

				if (this.gameMode === "sente" | this.gameMode === "gote" && position.player === 32) window.setTimeout(function () {
					return _this.moveByAI();
				}, 100);
			},
			moveByAI: function moveByAI(after) {
				if (this.gameMode === null) return;

				var startTime = new Date().getTime();
				var move = ai.think(position, +this.aiParameter.searchDepth, +this.aiParameter.randomness, +this.aiParameter.time);
				var time = new Date().getTime() - startTime;
				this.debugInfo.thinkTime = time;
				this.debugInfo.thinkTimeTotal += time;
				this.debugInfo.thinkTimeSampleCount += 1;
				this.debugInfo.thinkScore = move.score;
				this.debugInfo.expectedMoves = ai.getExpectedMoves(position);
				this.debugInfo.allMovesCount = ai.getAllMovesCount();
				if (move.depth) this.aiParameter.searchDepth = move.depth;

				if (move === null) {
					this.gameResult = ["あなたの勝ちです?"];
					return;
				}
				position.doMove(move);
				ai.settle(position);

				this.promotionSelect.show = false;
				this.draw();

				var judgeResult = position.judge();
				if (judgeResult) {
					this.gameEnd(judgeResult.winner, judgeResult.reason || "");
					return;
				}

				this.sound && sound[position.check ? "check" : "move"]();

				if (after instanceof Function) after();
			},
			gameEnd: function gameEnd(winner, message) {
				var reason = message ? "[" + message + "]" : "";
				if (winner === null) {
					this.gameResult = ["引き分けです", reason];
				} else {
					switch (this.gameMode) {
						case "sente":
						case "gote":
							this.gameResult = [winner === "black" ? "あなたの勝ちです" : "あなたの負けです", reason];
							break;
						case "free":
							this.gameResult = [winner === "black" ? "先手の勝ちです" : "後手の勝ちです", reason];
							break;
					}
				}
				this.sound && sound.gameEnd();
			},
			gameStart: function gameStart(mode) {
				var _this2 = this;

				if (["sente", "gote", "free"].indexOf(mode) === -1) return;

				this.gameMode = mode;
				this.selectedPiece = null;
				position = new _positionJs2["default"]();
				this.promotionSelect.show = false;
				this.gameResult = null;
				this.draw();
				this.sound && sound.gameStart();

				if (this.gameMode === "gote") {
					position.player ^= 48;
					window.setTimeout(function () {
						return _this2.moveByAI();
					}, 300);
				}
			},
			selectPiece: function selectPiece(event, piece) {
				if (this.gameMode === null) return;

				if (this.selectedPiece === piece) {
					this.selectedPiece = null;
				} else if (this.selectedPiece && this.selectedPiece.index & 120 && piece.index & 120) {
					this.move(this.selectedPiece.index, piece.index);
				} else if (piece.black === !!(position.player & 16)) {
					this.selectedPiece = piece;
				}
			},
			selectSquare: function selectSquare(event, x, y) {
				if (this.gameMode === null) return;

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
			initPosition: function initPosition(id) {
				position = positionBook.getPosition(id);

				this.gameMode = "free";
				this.promotionSelect.show = false;
				this.gameResult = null;
				this.draw();
				this.sound && sound.gameStart();
			},
			printBoard: function printBoard() {
				console.log(position.toString());
			},
			selfMatch: function selfMatch() {
				var _this3 = this;

				this.gameMove = "free";
				var f = function f() {
					return setTimeout(_this3.moveByAI.bind(_this3, f), 500);
				};
				setTimeout(f, 100);
			},
			hoge: function hoge() {
				console.dir(ai.think1(position, +this.aiParameter.searchDepth).sort(function (x, y) {
					return x[2] === y[2] ? 0 : x[2] < y[2] ? 1 : -1;
				}));
			}
		},
		components: {
			"piece": _componentsPieceVue2["default"]
		}
	});

	appVm.aiParameter.searchDepth = +getUrlParameter("sd", appVm.aiParameter.searchDepth);
	appVm.aiParameter.randomness = +getUrlParameter("rn", appVm.aiParameter.randomness);
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

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	module.exports = Vue;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _bitsJs = __webpack_require__(4);

	var bits = _interopRequireWildcard(_bitsJs);

	var Position = (function () {
		_createClass(Position, null, [{
			key: "MAX_MOVES_NUM_IN_A_POSITION",
			get: function get() {
				return 593;
			}
		}]);

		function Position(position) {
			_classCallCheck(this, Position);

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

				for (var _i = 0; _i < 7; ++_i) {
					this.bPieces[_i] = position.bPieces[_i], this.wPieces[_i] = position.wPieces[_i];
				}for (var _i2 = 0; _i2 < 111; ++_i2) {
					this.board[_i2] = position.board[_i2];
				}
			} else {
				this.player = 16;
				this.bKing = 11 + 10 * 8 + 4;
				this.wKing = 11 + 10 * 0 + 4;
				this.hash1 = 0;
				this.hash2 = ~new Date().getTime();
				this.history = [];
				this.check = false;

				for (var _i3 = 0; _i3 < 10; ++_i3) {
					this.board[_i3] = 64;
					this.board[_i3 * 10 + 10] = 64;
					this.board[_i3 + 101] = 64;
				}

				this.board[11 + 10 * 0 + 0] = 38;
				this.board[11 + 10 * 0 + 1] = 37;
				this.board[11 + 10 * 0 + 2] = 36;
				this.board[11 + 10 * 0 + 3] = 35;
				this.board[11 + 10 * 0 + 4] = 40;
				this.board[11 + 10 * 0 + 5] = 35;
				this.board[11 + 10 * 0 + 6] = 36;
				this.board[11 + 10 * 0 + 7] = 37;
				this.board[11 + 10 * 0 + 8] = 38;
				this.board[11 + 10 * 1 + 1] = 33;
				this.board[11 + 10 * 1 + 7] = 34;

				for (var _i4 = 0; _i4 < 9; ++_i4) {
					this.board[11 + 10 * 2 + _i4] = 39;
				}this.board[11 + 10 * 8 + 0] = 22;
				this.board[11 + 10 * 8 + 1] = 21;
				this.board[11 + 10 * 8 + 2] = 20;
				this.board[11 + 10 * 8 + 3] = 19;
				this.board[11 + 10 * 8 + 4] = 24;
				this.board[11 + 10 * 8 + 5] = 19;
				this.board[11 + 10 * 8 + 6] = 20;
				this.board[11 + 10 * 8 + 7] = 21;
				this.board[11 + 10 * 8 + 8] = 22;
				this.board[11 + 10 * 7 + 1] = 18;
				this.board[11 + 10 * 7 + 7] = 17;

				for (var _i5 = 0; _i5 < 9; ++_i5) {
					this.board[11 + 10 * 6 + _i5] = 23;
				}
			}
		}

		_createClass(Position, [{
			key: "allMoves",
			value: function allMoves(ma, mi, exceptDrops) {
				var board = this.board,
				    player = this.player | 0,
				    opPlayer = player ^ 48,
				    fuUsed = 1 << 0;

				for (var i = 11; i < 100; i = i + 1 | 0) {
					var sq = board[i] | 0;

					if (!(sq & player)) continue;

					var promotable = player === 16 ? i < 40 : 70 < i,
					    j = undefined;
					switch (sq & 15) {
						case 7:
							if (player === 16) {
								if (board[j = i - 10] === 0 || board[j] & opPlayer) {
									if (j < 40) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
									}
									if (20 < j) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
									}
								}
							} else {
								if (board[j = i + 10] === 0 || board[j] & opPlayer) {
									if (70 < j) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
									}
									if (j < 90) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
									}
								}
							}
							fuUsed |= 1 << i % 10;
							break;
						case 9:
							if (board[j = i - 11] === 0 || board[j] & opPlayer) {
								if (promotable || (player === 16 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i - 9] === 0 || board[j] & opPlayer) {
								if (promotable || (player === 16 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i + 11] === 0 || board[j] & opPlayer) {
								if (promotable || (player === 16 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i + 9] === 0 || board[j] & opPlayer) {
								if (promotable || (player === 16 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
						case 1:
							for (j = i - 10; board[j] === 0; j -= 10) {
								if (promotable || (player === 16 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = 0;
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = 0;
							}
							if (board[j] & opPlayer) {
								if (promotable || (player === 16 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							for (j = i + 10; board[j] === 0; j += 10) {
								if (promotable || (player === 16 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = 0;
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = 0;
							}
							if (board[j] & opPlayer) {
								if (promotable || (player === 16 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							for (j = i - 1; board[j] === 0; j -= 1) {
								if (promotable) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = 0;
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = 0;
							}
							if (board[j] & opPlayer) {
								if (promotable) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							for (j = i + 1; board[j] === 0; j += 1) {
								if (promotable) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = 0;
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = 0;
							}
							if (board[j] & opPlayer) {
								if (promotable) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							break;
						case 10:
							if (board[j = i - 10] === 0 || board[j] & opPlayer) {
								if (promotable || (player === 16 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i + 10] === 0 || board[j] & opPlayer) {
								if (promotable || (player === 16 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i - 1] === 0 || board[j] & opPlayer) {
								if (promotable) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i + 1] === 0 || board[j] & opPlayer) {
								if (promotable) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
						case 2:
							for (j = i - 11; board[j] === 0; j -= 11) {
								if (promotable || (player === 16 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = 0;
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = 0;
							}
							if (board[j] & opPlayer) {
								if (promotable || (player === 16 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							for (j = i - 9; board[j] === 0; j -= 9) {
								if (promotable || (player === 16 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = 0;
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = 0;
							}
							if (board[j] & opPlayer) {
								if (promotable || (player === 16 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							for (j = i + 9; board[j] === 0; j += 9) {
								if (promotable || (player === 16 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = 0;
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = 0;
							}
							if (board[j] & opPlayer) {
								if (promotable || (player === 16 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							for (j = i + 11; board[j] === 0; j += 11) {
								if (promotable || (player === 16 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = 0;
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = 0;
							}
							if (board[j] & opPlayer) {
								if (promotable || (player === 16 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							break;
						case 3:
						case 12:
						case 13:
						case 14:
						case 15:
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
							if (player === 16) {
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
						case 4:
							if (board[j = i - 11] === 0 || board[j] & opPlayer) {
								if (promotable || (player === 16 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i - 9] === 0 || board[j] & opPlayer) {
								if (promotable || (player === 16 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i + 9] === 0 || board[j] & opPlayer) {
								if (promotable || (player === 16 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (board[j = i + 11] === 0 || board[j] & opPlayer) {
								if (promotable || (player === 16 ? j < 40 : 70 < j)) {
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
								}
								ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
							}
							if (player === 16) {
								if (board[j = i - 10] === 0 || board[j] & opPlayer) {
									if (promotable || j < 40) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
									}
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
								}
							} else {
								if (board[j = i + 10] === 0 || board[j] & opPlayer) {
									if (promotable || 70 < j) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
									}
									ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
								}
							}
							break;
						case 5:
							if (player === 16) {
								if (board[j = i - 21] === 0 || board[j] & opPlayer) {
									if (j < 40) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
									}
									if (30 < j) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
									}
								}
								if (board[j = i - 19] === 0 || board[j] & opPlayer) {
									if (j < 40) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
									}
									if (30 < j) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
									}
								}
							} else {
								if (board[j = i + 19] === 0 || board[j] & opPlayer) {
									if (70 < j) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
									}
									if (j < 80) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
									}
								}
								if (board[j = i + 21] === 0 || board[j] & opPlayer) {
									if (70 < j) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
									}
									if (j < 80) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
									}
								}
							}
							break;
						case 6:
							if (player === 16) {
								for (j = i - 10; board[j] === 0; j -= 10) {
									if (j < 40) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = 0;
									}
									if (20 < j) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = 0;
									}
								}
								if (board[j] & opPlayer) {
									if (j < 40) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
									}
									if (20 < j) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
									}
								}
							} else {
								for (j = i + 10; board[j] === 0; j += 10) {
									if (70 < j) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = 0;
									}
									if (j < 90) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = 0;
									}
								}
								if (board[j] & opPlayer) {
									if (70 < j) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq | 8;ma[mi++] = board[j];
									}
									if (j < 90) {
										ma[mi++] = i;ma[mi++] = j;ma[mi++] = sq;ma[mi++] = sq;ma[mi++] = board[j];
									}
								}
							}
							break;
						case 8:
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
					}
				}

				if (exceptDrops) return mi;

				var pieces = player === 16 ? this.bPieces : this.wPieces;
				for (var i = 11; i < 100; ++i) {
					if (board[i] !== 0) continue;
					if (pieces[0]) {
						ma[mi++] = 0;ma[mi++] = i;mi++;ma[mi++] = 1 | player;ma[mi++] = 0;
					}
					if (pieces[1]) {
						ma[mi++] = 1;ma[mi++] = i;mi++;ma[mi++] = 2 | player;ma[mi++] = 0;
					}
					if (pieces[2]) {
						ma[mi++] = 2;ma[mi++] = i;mi++;ma[mi++] = 3 | player;ma[mi++] = 0;
					}
					if (pieces[3]) {
						ma[mi++] = 3;ma[mi++] = i;mi++;ma[mi++] = 4 | player;ma[mi++] = 0;
					}
				}
				if (player === 16) {
					if (pieces[4]) {
						for (var i = 31; i < 100; ++i) {
							if (board[i] === 0) {
								ma[mi++] = 4;ma[mi++] = i;mi++;ma[mi++] = 5 | 16;ma[mi++] = 0;
							}
						}
					}
					for (var i = 21; i < 100; ++i) {
						if (board[i] !== 0) continue;
						if (pieces[5]) {
							ma[mi++] = 5;ma[mi++] = i;mi++;ma[mi++] = 6 | 16;ma[mi++] = 0;
						}
						if (pieces[6] && !(fuUsed & 1 << i % 10)) {
							ma[mi++] = 6;ma[mi++] = i;mi++;ma[mi++] = 7 | 16;ma[mi++] = 0;
						}
					}
				} else {
					if (pieces[4]) {
						for (var i = 11; i < 81; ++i) {
							if (board[i] === 0) {
								ma[mi++] = 4;ma[mi++] = i;mi++;ma[mi++] = 5 | 32;ma[mi++] = 0;
							}
						}
					}
					for (var i = 11; i < 91; ++i) {
						if (board[i] !== 0) continue;
						if (pieces[5]) {
							ma[mi++] = 5;ma[mi++] = i;mi++;ma[mi++] = 6 | 32;ma[mi++] = 0;
						}
						if (pieces[6] && !(fuUsed & 1 << i % 10)) {
							ma[mi++] = 6;ma[mi++] = i;mi++;ma[mi++] = 7 | 32;ma[mi++] = 0;
						}
					}
				}

				return mi;
			}
		}, {
			key: "allEvasionMove",
			value: function allEvasionMove(ma, mi, exceptDrops) {
				var board = this.board,
				    player = this.player,
				    opPlayer = player ^ 48,
				    king = player === 16 ? this.bKing : this.wKing,
				    fu = 7 | player,
				    fuUsed = 1 << 0;

				for (var i = 11; i < 100; ++i) if (board[i] === fu) fuUsed |= 1 << i % 10;

				// 玉を逃がす or 玉で王手している駒を取る

				// 王手している駒を取る 玉以外で
				// 動かして合駒
				// 打って合駒
			}
		}, {
			key: "doMove",
			value: function doMove(move) {
				var fromIdx = move.fromIdx,
				    toIdx = move.toIdx,
				    to = move.to,
				    board = this.board,
				    player = this.player;

				var hashCountTableKey = this.hash1 & 0x7FFFFF;
				this.hashCountTable[hashCountTableKey >>> 1] += 1 << (hashCountTableKey & 1) * 4;

				if (fromIdx & 120) {
					board[toIdx] = to;
					board[fromIdx] = 0;

					if (to === 24) this.bKing = toIdx;else if (to === 40) this.wKing = toIdx;

					var capture = move.capture;
					if (capture) {
						if (player === 16) this.bPieces[(capture & 7) - 1] += 1;else this.wPieces[(capture & 7) - 1] += 1;

						this.hash1 ^= HASH_SEEDS[move.from | fromIdx << 6] ^ HASH_SEEDS[to | toIdx << 6] ^ HASH_SEEDS[capture | toIdx << 6] ^ HASH_SEEDS[capture];
						this.hash2 ^= HASH_SEEDS[move.from << 7 | fromIdx] ^ HASH_SEEDS[to << 7 | toIdx] ^ HASH_SEEDS[capture << 7 | toIdx] ^ HASH_SEEDS[capture << 7];
					} else {
						this.hash1 ^= HASH_SEEDS[move.from | fromIdx << 6] ^ HASH_SEEDS[to | toIdx << 6];
						this.hash2 ^= HASH_SEEDS[move.from << 7 | fromIdx] ^ HASH_SEEDS[to << 7 | toIdx];
					}
				} else {
					board[toIdx] = to;

					if (player === 16) this.bPieces[fromIdx] -= 1;else this.wPieces[fromIdx] -= 1;

					this.hash1 ^= HASH_SEEDS[to | toIdx << 6] ^ HASH_SEEDS[to];
					this.hash2 ^= HASH_SEEDS[to << 7 | toIdx] ^ HASH_SEEDS[to << 7];
				}
				this.player = player ^ 48;
				this.history.push(move);
				this.check = this.inCheck();
			}
		}, {
			key: "undoMove",
			value: function undoMove() {
				var move = this.history.pop(),
				    fromIdx = move.fromIdx,
				    toIdx = move.toIdx,
				    to = move.to,
				    board = this.board,
				    player = this.player ^= 48;

				if (fromIdx & 120) {
					board[fromIdx] = move.from;

					if (to === 24) this.bKing = fromIdx;else if (to === 40) this.wKing = fromIdx;

					var capture = move.capture;
					if (capture) {
						board[toIdx] = capture;

						if (player === 16) this.bPieces[(capture & 7) - 1] -= 1;else this.wPieces[(capture & 7) - 1] -= 1;

						this.hash1 ^= HASH_SEEDS[move.from | fromIdx << 6] ^ HASH_SEEDS[to | toIdx << 6] ^ HASH_SEEDS[capture | toIdx << 6] ^ HASH_SEEDS[capture];
						this.hash2 ^= HASH_SEEDS[move.from << 7 | fromIdx] ^ HASH_SEEDS[to << 7 | toIdx] ^ HASH_SEEDS[capture << 7 | toIdx] ^ HASH_SEEDS[capture << 7];
					} else {
						board[toIdx] = 0;

						this.hash1 ^= HASH_SEEDS[move.from | fromIdx << 6] ^ HASH_SEEDS[to | toIdx << 6];
						this.hash2 ^= HASH_SEEDS[move.from << 7 | fromIdx] ^ HASH_SEEDS[to << 7 | toIdx];
					}
				} else {
					board[toIdx] = 0;

					if (player === 16) this.bPieces[fromIdx] += 1;else this.wPieces[fromIdx] += 1;

					this.hash1 ^= HASH_SEEDS[to | toIdx << 6] ^ HASH_SEEDS[to];
					this.hash2 ^= HASH_SEEDS[to << 7 | toIdx] ^ HASH_SEEDS[to << 7];
				}

				var hashCountTableKey = this.hash1 & 0x7FFFFF;
				this.hashCountTable[hashCountTableKey >>> 1] -= 1 << (hashCountTableKey & 1) * 4;

				this.check = this.inCheck();
			}
		}, {
			key: "doMoveFast",
			value: function doMoveFast(ma, mi) {
				var fromIdx = ma[mi] | 0,
				    toIdx = ma[mi + 1] | 0,
				    to = ma[mi + 3] | 0,
				    board = this.board,
				    player = this.player | 0;

				if (fromIdx & 120) {
					board[toIdx] = to;
					board[fromIdx] = 0;

					if (to === 24) this.bKing = toIdx;else if (to === 40) this.wKing = toIdx;

					var capture = ma[mi + 4];
					if (capture) {
						if (player === 16) this.bPieces[(capture & 7) - 1] += 1;else this.wPieces[(capture & 7) - 1] += 1;

						this.hash1 ^= HASH_SEEDS[ma[mi + 2] | fromIdx << 6] ^ HASH_SEEDS[to | toIdx << 6] ^ HASH_SEEDS[capture | toIdx << 6] ^ HASH_SEEDS[capture];
						this.hash2 ^= HASH_SEEDS[ma[mi + 2] << 7 | fromIdx] ^ HASH_SEEDS[to << 7 | toIdx] ^ HASH_SEEDS[capture << 7 | toIdx] ^ HASH_SEEDS[capture << 7];
					} else {
						this.hash1 ^= HASH_SEEDS[ma[mi + 2] | fromIdx << 6] ^ HASH_SEEDS[to | toIdx << 6];
						this.hash2 ^= HASH_SEEDS[ma[mi + 2] << 7 | fromIdx] ^ HASH_SEEDS[to << 7 | toIdx];
					}
				} else {
					board[toIdx] = to;

					if (player === 16) this.bPieces[fromIdx] -= 1;else this.wPieces[fromIdx] -= 1;

					this.hash1 ^= HASH_SEEDS[to | toIdx << 6] ^ HASH_SEEDS[to];
					this.hash2 ^= HASH_SEEDS[to << 7 | toIdx] ^ HASH_SEEDS[to << 7];
				}
				this.player = player ^ 48;
			}
		}, {
			key: "undoMoveFast",
			value: function undoMoveFast(ma, mi) {
				var fromIdx = ma[mi] | 0,
				    toIdx = ma[mi + 1] | 0,
				    to = ma[mi + 3] | 0,
				    board = this.board,
				    player = this.player ^= 48;

				if (fromIdx & 120) {
					board[fromIdx] = ma[mi + 2];

					if (to === 24) this.bKing = fromIdx;else if (to === 40) this.wKing = fromIdx;

					var capture = ma[mi + 4];
					if (capture) {
						board[toIdx] = capture;

						if (player === 16) this.bPieces[(capture & 7) - 1] -= 1;else this.wPieces[(capture & 7) - 1] -= 1;

						this.hash1 ^= HASH_SEEDS[ma[mi + 2] | fromIdx << 6] ^ HASH_SEEDS[to | toIdx << 6] ^ HASH_SEEDS[capture | toIdx << 6] ^ HASH_SEEDS[capture];
						this.hash2 ^= HASH_SEEDS[ma[mi + 2] << 7 | fromIdx] ^ HASH_SEEDS[to << 7 | toIdx] ^ HASH_SEEDS[capture << 7 | toIdx] ^ HASH_SEEDS[capture << 7];
					} else {
						board[toIdx] = 0;

						this.hash1 ^= HASH_SEEDS[ma[mi + 2] | fromIdx << 6] ^ HASH_SEEDS[to | toIdx << 6];
						this.hash2 ^= HASH_SEEDS[ma[mi + 2] << 7 | fromIdx] ^ HASH_SEEDS[to << 7 | toIdx];
					}
				} else {
					board[toIdx] = 0;

					if (player === 16) this.bPieces[fromIdx] += 1;else this.wPieces[fromIdx] += 1;

					this.hash1 ^= HASH_SEEDS[to | toIdx << 6] ^ HASH_SEEDS[to];
					this.hash2 ^= HASH_SEEDS[to << 7 | toIdx] ^ HASH_SEEDS[to << 7];
				}
			}
		}, {
			key: "isEffectedSquare",
			value: function isEffectedSquare(index, player) {
				var board = this.board,
				    sq;
				if (player === 16) {
					if ((sq = board[index + 11]) & 16 && 63004 >>> (sq & 15) & 1 || (sq = board[index + 9]) & 16 && 63004 >>> (sq & 15) & 1 || (sq = board[index + 10]) & 16 && 63194 >>> (sq & 15) & 1 || (sq = board[index - 1]) & 16 && 62986 >>> (sq & 15) & 1 || (sq = board[index + 1]) & 16 && 62986 >>> (sq & 15) & 1 || (sq = board[index - 10]) & 16 && 62986 >>> (sq & 15) & 1 || (sq = board[index - 9]) & 16 && 1556 >>> (sq & 15) & 1 || (sq = board[index - 11]) & 16 && 1556 >>> (sq & 15) & 1 || board[index + 21] === 21 || board[index + 19] === 21) return true;
					for (var i = index + 10; board[i] === 0; i += 10);
					if (board[i] === 22 || (board[i] & 55) === 17) return true;
					for (var i = index + 1; board[i] === 0; i += 1);
					if ((board[i] & 55) === 17) return true;
					for (var i = index - 1; board[i] === 0; i -= 1);
					if ((board[i] & 55) === 17) return true;
					for (var i = index - 10; board[i] === 0; i -= 10);
					if ((board[i] & 55) === 17) return true;
					for (var i = index + 11; board[i] === 0; i += 11);
					if ((board[i] & 55) === 18) return true;
					for (var i = index + 9; board[i] === 0; i += 9);
					if ((board[i] & 55) === 18) return true;
					for (var i = index - 9; board[i] === 0; i -= 9);
					if ((board[i] & 55) === 18) return true;
					for (var i = index - 11; board[i] === 0; i -= 11);
					if ((board[i] & 55) === 18) return true;
				} else {
					if ((sq = board[index - 11]) & 32 && 63004 >>> (sq & 15) & 1 || (sq = board[index - 9]) & 32 && 63004 >>> (sq & 15) & 1 || (sq = board[index - 10]) & 32 && 63194 >>> (sq & 15) & 1 || (sq = board[index - 1]) & 32 && 62986 >>> (sq & 15) & 1 || (sq = board[index + 1]) & 32 && 62986 >>> (sq & 15) & 1 || (sq = board[index + 10]) & 32 && 62986 >>> (sq & 15) & 1 || (sq = board[index + 9]) & 32 && 1556 >>> (sq & 15) & 1 || (sq = board[index + 11]) & 32 && 1556 >>> (sq & 15) & 1 || board[index - 21] === 37 || board[index - 19] === 37) return true;
					for (var i = index - 10; board[i] === 0; i -= 10);
					if (board[i] === 38 || (board[i] & 55) === 33) return true;
					for (var i = index - 1; board[i] === 0; i -= 1);
					if ((board[i] & 55) === 33) return true;
					for (var i = index + 1; board[i] === 0; i += 1);
					if ((board[i] & 55) === 33) return true;
					for (var i = index + 10; board[i] === 0; i += 10);
					if ((board[i] & 55) === 33) return true;
					for (var i = index - 11; board[i] === 0; i -= 11);
					if ((board[i] & 55) === 34) return true;
					for (var i = index - 9; board[i] === 0; i -= 9);
					if ((board[i] & 55) === 34) return true;
					for (var i = index + 9; board[i] === 0; i += 9);
					if ((board[i] & 55) === 34) return true;
					for (var i = index + 11; board[i] === 0; i += 11);
					if ((board[i] & 55) === 34) return true;
				}
				return false;
			}
		}, {
			key: "inCheck",
			value: function inCheck() {
				if (this.player === 16) return this.isEffectedSquare(this.bKing, 32);else return this.isEffectedSquare(this.wKing, 16);
			}
		}, {
			key: "inIgnoreCheck",
			value: function inIgnoreCheck() {
				var mi = this.allMoves(moveArray, 0, true);
				for (var _i6 = 0; _i6 < mi; _i6 += 5) {
					if ((moveArray[_i6 + 4] & 15) === 8) return true;
				}return false;
			}
		}, {
			key: "inCheckMate",
			value: function inCheckMate() {
				var mi1 = this.allMoves(moveArray, 0);
				for (var _i7 = 0; _i7 < mi1; _i7 += 5) {
					this.doMoveFast(moveArray, _i7);

					var mi2 = this.allMoves(moveArray, mi1, true),
					    flg = false;
					for (var j = mi1; j < mi2; j += 5) {
						if ((moveArray[j + 4] & 15) === 8) {
							flg = true;
							break;
						}
					}

					this.undoMoveFast(moveArray, _i7);

					if (!flg) return false;
				}
				return true;
			}
		}, {
			key: "judge",
			value: function judge() {
				var hashCountTableKey = this.hash1 & 0x7FFFFF;
				if ((this.hashCountTable[hashCountTableKey >>> 1] >>> ((hashCountTableKey & 1) << 2) & 15) >= 3) {
					var _history = this.history.concat(),
					    count = 4,
					    black = true,
					    white = true,
					    hash = this.hash;

					while (true) {
						if (this.player !== 16) black &= this.check;else white &= this.check;
						if (this.hash === hash && --count === 0 || this.count === 0) break;
						this.undoMove();
					}

					while (_history[this.count]) this.doMove(_history[this.count]);

					if (count === 0) {
						if (black | white) {
							return {
								winner: black ? "white" : "black",
								reason: "連続王手の千日手"
							};
						} else {
							return {
								winner: null,
								reason: "千日手"
							};
						}
					}
				}

				if (this.inIgnoreCheck()) {
					return {
						winner: this.player === 16 ? "black" : "white",
						reason: "王手放置"
					};
				}

				if (this.inCheckMate()) {
					if (this.history[this.count - 1].fromIdx === 6) {
						return {
							winner: this.player === 16 ? "black" : "white",
							reason: "打ち歩詰め"
						};
					} else {
						return {
							winner: this.player !== 16 ? "black" : "white",
							reason: null
						};
					}
				}

				return null;
			}
		}, {
			key: "canMove",
			value: function canMove(fromIdx, toIdx) {
				var mi = this.allMoves(moveArray, 0),
				    result = 0;
				for (var i = 0; i < mi; i += 5) if (moveArray[i] === fromIdx && moveArray[i + 1] === toIdx) result |= moveArray[i + 2] === moveArray[i + 3] ? 1 : 2;
				return result;
			}
		}, {
			key: "toString",
			value: function toString() {
				var ret = "";
				var PIECE_TABLE = ["　", "飛", "角", "金", "銀", "桂", "香", "歩", "玉", "竜", "馬", "？", "全", "圭", "杏", "と"];
				for (var y = 0; y < 9; ++y) {
					for (var x = 0; x < 9; ++x) {
						var sq = this.board[11 + 10 * y + x];
						ret += (sq & 32 ? "v" : " ") + PIECE_TABLE[sq & 15];
					}
					ret += "\n";
				}
				ret += "△:";
				for (var i = 6; 0 <= i; --i) {
					if (this.wPieces[i] === 0) continue;
					ret += PIECE_TABLE[i + 1];
					if (1 < this.wPieces[i]) ret += this.wPieces[i];
				}
				ret += "\n";
				ret += "▲:";
				for (var i = 6; 0 <= i; --i) {
					if (this.bPieces[i] === 0) continue;
					ret += PIECE_TABLE[i + 1];
					if (1 < this.bPieces[i]) ret += this.bPieces[i];
				}
				return ret;
			}
		}, {
			key: "moveHash1",
			value: function moveHash1(ma, mi) {
				var fromIdx = ma[mi] | 0,
				    shiftedToIdx = ma[mi + 1] << 6,
				    to = ma[mi + 3] | 0;

				if (fromIdx & 120) {
					var capture = ma[mi + 4];
					if (capture) {
						return this.hash1 ^ HASH_SEEDS[ma[mi + 2] | fromIdx << 6] ^ HASH_SEEDS[to | shiftedToIdx] ^ HASH_SEEDS[capture | shiftedToIdx] ^ HASH_SEEDS[capture];
					} else {
						return this.hash1 ^ HASH_SEEDS[ma[mi + 2] | fromIdx << 6] ^ HASH_SEEDS[to | shiftedToIdx];
					}
				} else {
					return this.hash1 ^ HASH_SEEDS[to | shiftedToIdx] ^ HASH_SEEDS[to];
				}
			}
		}, {
			key: "moveHash2",
			value: function moveHash2(ma, mi) {
				var fromIdx = ma[mi] | 0,
				    toIdx = ma[mi + 1] | 0,
				    shiftedTo = ma[mi + 3] << 7;

				if (fromIdx & 120) {
					var capture = ma[mi + 4];
					if (capture) {
						return this.hash2 ^ HASH_SEEDS[ma[mi + 2] << 7 | fromIdx] ^ HASH_SEEDS[shiftedTo | toIdx] ^ HASH_SEEDS[capture << 7 | toIdx] ^ HASH_SEEDS[capture << 7];
					} else {
						return this.hash2 ^ HASH_SEEDS[ma[mi + 2] << 7 | fromIdx] ^ HASH_SEEDS[shiftedTo | toIdx];
					}
				} else {
					return this.hash2 ^ HASH_SEEDS[shiftedTo | toIdx] ^ HASH_SEEDS[shiftedTo];
				}
			}
		}, {
			key: "decodeMove",
			value: function decodeMove(src, ma, mi) {
				ma[mi + 0] = src & 0x7F;
				ma[mi + 1] = src >>> 7 & 0x7F;
				if (ma[mi + 0] & 120) {
					ma[mi + 2] = this.board[ma[mi + 0]];
					ma[mi + 3] = ma[mi + 2] | src >>> 14 << 3;
					ma[mi + 4] = this.board[ma[mi + 1]];
				} else {
					ma[mi + 3] = ma[mi + 0] + 1 | this.player;
					ma[mi + 4] = 0;
				}
			}
		}, {
			key: "effect",
			value: function effect(index) {
				var board = this.board,
				    sq,
				    score = 0;
				if ((sq = board[index + 11]) & 16 && 63004 >>> (sq & 15) & 1) score += 1;else if (sq & 32 && 1556 >>> (sq & 15) & 1) score -= 1;
				if ((sq = board[index + 9]) & 16 && 63004 >>> (sq & 15) & 1) score += 1;else if (sq & 32 && 1556 >>> (sq & 15) & 1) score -= 1;
				if ((sq = board[index + 10]) & 16 && 63194 >>> (sq & 15) & 1) score += 1;else if (sq & 32 && 62986 >>> (sq & 15) & 1) score -= 1;
				if ((sq = board[index - 1]) & 16 && 62986 >>> (sq & 15) & 1) score += 1;else if (sq & 32 && 62986 >>> (sq & 15) & 1) score -= 1;
				if ((sq = board[index + 1]) & 16 && 62986 >>> (sq & 15) & 1) score += 1;else if (sq & 32 && 62986 >>> (sq & 15) & 1) score -= 1;
				if ((sq = board[index - 10]) & 16 && 62986 >>> (sq & 15) & 1) score += 1;else if (sq & 32 && 63194 >>> (sq & 15) & 1) score -= 1;
				if ((sq = board[index - 9]) & 16 && 1556 >>> (sq & 15) & 1) score += 1;else if (sq & 32 && 63004 >>> (sq & 15) & 1) score -= 1;
				if ((sq = board[index - 11]) & 16 && 1556 >>> (sq & 15) & 1) score += 1;else if (sq & 32 && 63004 >>> (sq & 15) & 1) score -= 1;
				if (board[index + 21] === 21) score += 1;
				if (board[index + 19] === 21) score += 1;
				if (board[index - 21] === 37) score -= 1;
				if (board[index - 19] === 37) score -= 1;

				return score;
			}
		}, {
			key: "count",
			get: function get() {
				return this.history.length;
			}
		}, {
			key: "hash",
			get: function get() {
				return (this.hash1 & 0x3FFFFF) * 0x80000000 + (this.hash2 & 0x7FFFFFFF);
			}
		}], [{
			key: "encodeMove",
			value: function encodeMove(ma, mi) {
				return ma[mi + 0] | ma[mi + 1] << 7 | (ma[mi + 3] & 8) << 11;
			}
		}]);

		return Position;
	})();

	exports["default"] = Position;

	var moveArray = new Uint8Array(2 * Position.MAX_MOVES_NUM_IN_A_POSITION * 5);

	var HASH_SEEDS = new Int32Array(100 * 64);
	for (var i = 0; i < HASH_SEEDS.length; ++i) HASH_SEEDS[i] = bits.random.next32();
	module.exports = exports["default"];

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.xor54 = xor54;
	exports.make54 = make54;
	exports.print32 = print32;
	exports.print54 = print54;

	function xor54() {
		var minus = 0,
		    lbs = 0,
		    rbs = 0;

		for (var _len = arguments.length, xs = Array(_len), _key = 0; _key < _len; _key++) {
			xs[_key] = arguments[_key];
		}

		for (var i = 0; i < xs.length; ++i) {
			if (xs[i] < 0) {
				xs[i] += 0x20000000000000;
				minus ^= 1;
			}
			lbs ^= xs[i] / 0x80000000;
			rbs ^= xs[i] & 0x7FFFFFFF;
		}

		lbs *= 0x80000000;
		if (minus) return -0x20000000000000 + lbs + rbs;else return lbs + rbs;
	}

	function make54(a, b) {
		if (a & 0x200000) {
			if (b < 0) {
				return -0x20000000000000 + (a & 0x1FFFFF) * 0x100000000 + (b + 0x100000000);
			} else {
				return -0x20000000000000 + (a & 0x1FFFFF) * 0x100000000 + b;
			}
		} else {
			if (b < 0) {
				return (a & 0x1FFFFF) * 0x100000000 + (b + 0x100000000);
			} else {
				return (a & 0x1FFFFF) * 0x100000000 + b;
			}
		}
	}

	function print32(x) {
		if (0 <= x) return (new Array(32).join("0") + x.toString(2)).slice(-32);else return (new Array(32).join("0") + (x + Math.pow(2, 32)).toString(2)).slice(-32);
	}

	function print54(x) {
		if (0 <= x) return (new Array(54).join("0") + x.toString(2)).slice(-54);else return "1" + (new Array(53).join("0") + (x + Math.pow(2, 53)).toString(2)).slice(-53);
	}

	var random = {
		x: 123456789,
		y: 362436069,
		z: 521288629,
		w: 88675123,
		next32: function next32() {
			var t = this.x ^ this.x << 11;
			this.x = this.y;
			this.y = this.z;
			this.z = this.w;
			return this.w = this.w ^ this.w >>> 19 ^ t ^ t >>> 8;
		}
	};
	exports.random = random;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.think = think;
	exports.think_ = think_;
	exports.settle = settle;
	exports.getExpectedMoves = getExpectedMoves;
	exports.getAllMovesCount = getAllMovesCount;
	exports.think1 = think1;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _positionJs = __webpack_require__(3);

	var _positionJs2 = _interopRequireDefault(_positionJs);

	var PIECE_SCORE_TABLE = new Uint16Array(16);
	PIECE_SCORE_TABLE[1] = 65;
	PIECE_SCORE_TABLE[2] = 58;
	PIECE_SCORE_TABLE[3] = 47;
	PIECE_SCORE_TABLE[4] = 39;
	PIECE_SCORE_TABLE[5] = 25;
	PIECE_SCORE_TABLE[6] = 23;
	PIECE_SCORE_TABLE[7] = 10;
	PIECE_SCORE_TABLE[8] = 1000;
	PIECE_SCORE_TABLE[9] = 95;
	PIECE_SCORE_TABLE[10] = 84;
	PIECE_SCORE_TABLE[12] = 46;
	PIECE_SCORE_TABLE[13] = 45;
	PIECE_SCORE_TABLE[14] = 45;
	PIECE_SCORE_TABLE[15] = 42;

	var HAND_PIECE_SCORE_TABLE = new Uint16Array([0, 71, 61, 52, 44, 27, 25, 11]);

	var MAX_SEARCH_DEPTH = 10;

	var moveArray = new Uint8Array(_positionJs2["default"].MAX_MOVES_NUM_IN_A_POSITION * MAX_SEARCH_DEPTH * 5);
	var moveScoreArray = new Int16Array(_positionJs2["default"].MAX_MOVES_NUM_IN_A_POSITION);

	var positionTableSize = 1 << 24;
	var positionTable = new DataView(new ArrayBuffer(positionTableSize * 10));
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
		for (var i = 11; i < 101; ++i) {
			var sq = board[i];
			if (sq & 16) score += PIECE_SCORE_TABLE[sq & 15];else if (sq & 32) score -= PIECE_SCORE_TABLE[sq & 15];
		}
		score += bPieces[0] * 71;
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
		if (moveArray[mi] & 120) {
			return -PIECE_SCORE_TABLE[moveArray[mi + 2] & 15] + PIECE_SCORE_TABLE[moveArray[mi + 3] & 15] + PIECE_SCORE_TABLE[moveArray[mi + 4] & 15] + HAND_PIECE_SCORE_TABLE[moveArray[mi + 4] & 7];
		} else {
			return PIECE_SCORE_TABLE[moveArray[mi + 3] & 15] + -HAND_PIECE_SCORE_TABLE[moveArray[mi + 3] & 7];
		}
	}

	function moveOrdering(mi1, mi2) {
		while (mi1 < mi2) {
			if (moveArray[mi1 + 4] !== 0 || (moveArray[mi1 + 2] ^ moveArray[mi1 + 3]) === 8) {
				mi1 += 5;
			} else if (!(moveArray[mi2 - 1] !== 0 || (moveArray[mi2 - 3] ^ moveArray[mi2 - 2]) === 8)) {
				mi2 -= 5;
			} else {
				var tmp = undefined;
				mi2 -= 5;
				tmp = moveArray[mi1 + 0];moveArray[mi1 + 0] = moveArray[mi2 + 0];moveArray[mi2 + 0] = tmp;
				tmp = moveArray[mi1 + 1];moveArray[mi1 + 1] = moveArray[mi2 + 1];moveArray[mi2 + 1] = tmp;
				tmp = moveArray[mi1 + 2];moveArray[mi1 + 2] = moveArray[mi2 + 2];moveArray[mi2 + 2] = tmp;
				tmp = moveArray[mi1 + 3];moveArray[mi1 + 3] = moveArray[mi2 + 3];moveArray[mi2 + 3] = tmp;
				tmp = moveArray[mi1 + 4];moveArray[mi1 + 4] = moveArray[mi2 + 4];moveArray[mi2 + 4] = tmp;
			}
		}
	}

	function moveOrderingUseCache(mi1, mi2, position, scoreDefault) {
		var size = (mi2 - mi1) / 5 | 0,
		    min = 32768,
		    max = -32768;

		for (var i = 0, mi = mi1; i < size; i += 1, mi += 5) {
			var address = (position.moveHash1(moveArray, mi) & positionTableSize - 1) * 10,
			    score;

			if (positionTable.getInt32(address) === position.moveHash2(moveArray, mi)) score = -positionTable.getInt16(address + 6);else score = scoreDefault;

			moveScoreArray[i] = score;
			if (score < min) min = score;
			if (max < score) max = score;
		}

		max = Math.min(max, 1000);
		min = Math.max(min, -1000);

		var pivot = max + min >> 1,
		    mi = mi1 | 0,
		    tmp;

		while (pivot < max - 3) {
			var l = 0,
			    r = size - 1;
			while (true) {
				while (pivot < moveScoreArray[l]) l += 1;
				while (moveScoreArray[r] <= pivot) r -= 1;
				if (l > r) break;

				tmp = moveScoreArray[l];moveScoreArray[l] = moveScoreArray[r];moveScoreArray[r] = tmp;

				mi1 = mi + l * 5;mi2 = mi + r * 5;
				tmp = moveArray[mi1 + 0];moveArray[mi1 + 0] = moveArray[mi2 + 0];moveArray[mi2 + 0] = tmp;
				tmp = moveArray[mi1 + 1];moveArray[mi1 + 1] = moveArray[mi2 + 1];moveArray[mi2 + 1] = tmp;
				tmp = moveArray[mi1 + 2];moveArray[mi1 + 2] = moveArray[mi2 + 2];moveArray[mi2 + 2] = tmp;
				tmp = moveArray[mi1 + 3];moveArray[mi1 + 3] = moveArray[mi2 + 3];moveArray[mi2 + 3] = tmp;
				tmp = moveArray[mi1 + 4];moveArray[mi1 + 4] = moveArray[mi2 + 4];moveArray[mi2 + 4] = tmp;
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
		if (depth === 0) return scoreBase;

		var hashCountTableKey = position.hash1 & 0x7FFFFF;
		if ((position.hashCountTable[hashCountTableKey >>> 1] >>> ((hashCountTableKey & 1) << 2) & 15) >= 3) {
			if ((checkHistory & 0x5555) === 0x5555) return 32600;
			if ((checkHistory & 0xAAAA) === 0xAAAA) return -32600;
			return 0;
		}

		var bestScore = alpha;

		var address = (position.hash1 & positionTableSize - 1) * 10;
		if (positionTable.getInt32(address + 0) === position.hash2) {
			var cDepth = positionTable.getInt8(address + 4),
			    cBestMove = positionTable.getInt16(address + 8);

			if (position.board[cBestMove & 0x7F] & position.player && depth <= cDepth) {
				var cCut = positionTable.getInt8(address + 5),
				    cScore = positionTable.getInt16(address + 6);

				if (cCut === 0) return cScore;
				if (cCut === 1) {
					if (beta <= bestScore) return cScore;
				} else {
					if (beta <= cScore) return cScore;
				}
			} else {
				cDepth = 0;
				cBestMove = 0;
			}
		}

		if (depth === 1) {
			if (scoreBase + 100 <= bestScore) return bestScore;
			if (beta <= scoreBase) return scoreBase;

			var mi2 = position.allMoves(moveArray, mi1, true);
			allMovesCount += 1;

			for (var i = mi1; i < mi2; i += 5) {
				var score = scoreBase + PIECE_SCORE_TABLE[moveArray[i + 4] & 15];
				if (bestScore < score) {
					bestScore = score;
					if (beta <= bestScore) return bestScore;
				}
			}

			return bestScore;
		} else {
			var bestMove = 0,
			    kingHead = position.player === 16 ? position.wKing + 10 : position.bKing - 10;
			checkHistory = checkHistory << 1 | position.inCheck();

			findBestMove: {
				if (cBestMove) {
					position.decodeMove(cBestMove, moveArray, mi1);

					position.doMoveFast(moveArray, mi1);
					var score = -search(position, -(scoreBase + evalMove(mi1)), depth - 1, -beta, -bestScore, mi1 + 5, checkHistory);
					position.undoMoveFast(moveArray, mi1);

					if (moveArray[mi1] === 6 && moveArray[mi1 + 1] === kingHead && score === 32700 + depth - 2) score = -score;

					if (bestScore < score) {
						bestMove = mi1;
						bestScore = score;
						if (beta <= bestScore) break findBestMove;
					}
				}

				var mi2 = position.allMoves(moveArray, mi1, depth <= 2);
				allMovesCount += 1;

				if (3 <= cDepth) moveOrderingUseCache(mi1, mi2, position, scoreBase - 1000);else moveOrdering(mi1, mi2);

				for (var i = mi1; i < mi2; i += 5) {
					if ((moveArray[i + 4] & 15) === 8) {
						bestScore = 32700 + depth;
						break findBestMove;
					}

					position.doMoveFast(moveArray, i);
					var score = -search(position, -(scoreBase + evalMove(i)), depth - 1, -beta, -bestScore, mi2, checkHistory);
					position.undoMoveFast(moveArray, i);

					if (moveArray[i] === 6 && moveArray[i + 1] === kingHead && score === 32700 + depth - 2) score = -score;

					if (bestScore < score) {
						bestMove = i;
						bestScore = score;
						if (beta <= bestScore) break findBestMove;
					}
				}
			}

			positionTable.setInt32(address + 0, position.hash2);
			positionTable.setInt8(address + 4, depth);
			positionTable.setInt8(address + 5, alpha < bestScore ? bestScore < beta ? 0 : 1 : -1);
			positionTable.setInt16(address + 6, bestScore);
			positionTable.setInt16(address + 8, _positionJs2["default"].encodeMove(moveArray, bestMove));

			return bestScore;
		}
	}

	function think(position, depth) {
		var randomness = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

		var address = (position.hash1 & positionTableSize - 1) * 10,
		    cDepth = 0;
		if (positionTable.getInt32(address + 0) === position.hash2) {
			cDepth = positionTable.getInt8(address + 4);
			var cBestMove = positionTable.getInt16(address + 8);

			if (!(position.board[cBestMove & 0x7F] & position.player)) cBestMove = 0;
		}

		var mi = position.allMoves(moveArray, 0, false);
		allMovesCount = 1;

		if (3 <= cDepth) moveOrderingUseCache(0, mi, position, -30000);else moveOrdering(0, mi);

		var bestMove = -1,
		    bestScore = -32767,
		    scoreBase = evalPosition(position) * (position.player === 16 ? 1 : -1),
		    checkHistory = makeCheckHistory(position),
		    kingHead = position.player === 16 ? position.wKing + 10 : position.bKing - 10;

		for (var i = 0; i < mi; i += 5) {
			if ((moveArray[i + 4] & 15) === 8) return "check mated";

			position.doMoveFast(moveArray, i);
			var score = -search(position, -(scoreBase + evalMove(i)), depth - 1, -32767, -bestScore, mi, checkHistory);
			position.undoMoveFast(moveArray, i);

			if (moveArray[i] === 6 && moveArray[i + 1] === kingHead && score === 32700 + depth - 2) score = -score;

			score -= Math.random() * (randomness + 1) | 0;

			if (bestScore < score) {
				bestMove = i;
				bestScore = score;
			}
		}

		if (bestMove === -1) return null;

		var address = (position.hash1 & positionTableSize - 1) * 10;
		positionTable.setInt32(address + 0, position.hash2);
		positionTable.setInt8(address + 4, depth);
		positionTable.setInt8(address + 5, 0);
		positionTable.setInt16(address + 6, bestScore);
		positionTable.setInt16(address + 8, _positionJs2["default"].encodeMove(moveArray, bestMove));

		return {
			fromIdx: moveArray[bestMove + 0],
			toIdx: moveArray[bestMove + 1],
			from: moveArray[bestMove + 2],
			to: moveArray[bestMove + 3],
			capture: moveArray[bestMove + 4],
			score: bestScore
		};
	}

	function think_(position, maxDepth) {
		var randomness = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
		var timeLimit = arguments.length <= 3 || arguments[3] === undefined ? 1000 : arguments[3];

		var startTime = new Date().getTime();

		var address = (position.hash1 & positionTableSize - 1) * 10,
		    cDepth = 0;
		if (positionTable.getInt32(address + 0) === position.hash2) {
			cDepth = positionTable.getInt8(address + 4);
			var cBestMove = positionTable.getInt16(address + 8);

			if (!(position.board[cBestMove & 0x7F] & position.player)) cBestMove = 0;
		}

		var mi = position.allMoves(moveArray, 0, false);
		allMovesCount = 1;

		if (3 <= cDepth) moveOrderingUseCache(0, mi, position, -30000);else moveOrdering(0, mi);

		for (var depth = Math.max(3, cDepth + 0); depth <= maxDepth; ++depth) {
			var bestMove = -1,
			    bestScore = -32767,
			    scoreBase = evalPosition(position) * (position.player === 16 ? 1 : -1),
			    checkHistory = makeCheckHistory(position),
			    kingHead = position.player === 16 ? position.wKing + 10 : position.bKing - 10;

			for (var i = 0; i < mi; i += 5) {
				if ((moveArray[i + 4] & 15) === 8) throw new Error("check mated");

				position.doMoveFast(moveArray, i);
				var score = -search(position, -(scoreBase + evalMove(i)), depth - 1, -32767, -bestScore, mi, checkHistory);
				position.undoMoveFast(moveArray, i);

				if (moveArray[i] === 6 && moveArray[i + 1] === kingHead && score === 32700 + depth - 2) score = -score;

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

		if (bestMove === -1) return null;

		var address = (position.hash1 & positionTableSize - 1) * 10;
		positionTable.setInt32(address + 0, position.hash2);
		positionTable.setInt8(address + 4, depth);
		positionTable.setInt8(address + 5, 0);
		positionTable.setInt16(address + 6, bestScore);
		positionTable.setInt16(address + 8, _positionJs2["default"].encodeMove(moveArray, bestMove));

		return {
			fromIdx: moveArray[bestMove + 0],
			toIdx: moveArray[bestMove + 1],
			from: moveArray[bestMove + 2],
			to: moveArray[bestMove + 3],
			capture: moveArray[bestMove + 4],
			score: bestScore,
			depth: maxDepth
		};
	}

	function settle(position) {
		// for avoiding sennichite
		var hashCountTableKey = position.hash1 & 0x7FFFFF;
		if ((position.hashCountTable[hashCountTableKey >>> 1] >>> ((hashCountTableKey & 1) << 2) & 15) >= 1) clearPositionTable(position, 4, 0);
	}

	function clearPositionTable(position, depth, mi1) {
		var address = (position.hash1 & 0xFFFFFF) * 10;

		if (positionTable.getInt32(address) !== position.hash2) return;

		positionTable.setInt32(address, 0);

		if (depth === 0) return;

		var mi2 = position.allMoves(moveArray, mi1, false);
		for (var i = mi1; i < mi2; i += 5) {
			position.doMoveFast(moveArray, i);
			clearPositionTable(position, depth - 1, mi2);
			position.undoMoveFast(moveArray, i);
		}
	}

	function movePos(idx) {
		return ["１", "２", "３", "４", "５", "６", "７", "８", "９"][9 - idx % 10] + ["一", "二", "三", "四", "五", "六", "七", "八", "九"][(idx / 10 | 0) - 1];
	}

	function getExpectedMoves_(position, mi, seq, hashHistory) {
		var PIECE_TABLE = ["　", "飛", "角", "金", "銀", "桂", "香", "歩", "玉", "竜", "馬", "？", "全", "圭", "杏", "と"];

		mi = mi | 0;

		if (hashHistory.indexOf(position.hash1) !== -1) return;

		var address = (position.hash1 & 0xFFFFFF) * 10;
		var bestMove = positionTable.getInt16(address + 8);

		if (positionTable.getInt32(address + 0) === position.hash2 && position.board[bestMove & 0x7F] & position.player) {
			position.decodeMove(bestMove, moveArray, mi);

			if (moveArray[mi + 0] & 120) {
				seq.push((position.player === 16 ? "▲" : "△") + movePos(moveArray[mi + 1]) + PIECE_TABLE[moveArray[mi + 3] & 15] + "(" + (10 - moveArray[mi + 0] % 10) + (moveArray[mi + 0] / 10 | 0) + ")");
			} else {
				seq.push((position.player === 16 ? "▲" : "△") + movePos(moveArray[mi + 1]) + PIECE_TABLE[moveArray[mi + 3] & 15] + "打");
			}

			hashHistory.push(position.hash1);
			position.doMoveFast(moveArray, mi);
			getExpectedMoves_(position, mi + 5, seq, hashHistory);
			position.undoMoveFast(moveArray, mi);
		}

		return seq;
	}

	function getExpectedMoves(position) {
		return getExpectedMoves_(position, 0, [], []).join("");
	}

	function makeCheckHistory(position) {
		var history = position.history.concat(),
		    ret = 0;

		for (var i = 0; i < 32 && position.count; ++i) {
			ret |= position.check << i;
			position.undoMove();
		}

		while (history[position.count]) position.doMove(history[position.count]);

		return ret;
	}

	function getAllMovesCount() {
		return allMovesCount;
	}

	function think1(position, depth) {
		var randomness = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

		var mi = position.allMoves(moveArray, 0, false);
		moveOrdering(0, mi);

		var ret = [];

		var bestMove = -1,
		    bestScore = -32767,
		    scoreBase = evalPosition(position) * (position.player === 16 ? 1 : -1),
		    checkHistory = makeCheckHistory(position),
		    kingHead = position.player === 16 ? position.wKing + 10 : position.bKing - 10;

		for (var i = 0; i < mi; i += 5) {
			if ((moveArray[i + 4] & 15) === 8) return "check mated";

			position.doMoveFast(moveArray, i);
			var score = -search(position, -(scoreBase + evalMove(i)), depth - 1, -32767, 32767, mi, checkHistory);
			position.undoMoveFast(moveArray, i);

			if (moveArray[i] === 6 && moveArray[i + 1] === kingHead && score === 32700 + depth - 2) score = -score;

			ret.push([moveArray[i + 0], moveArray[i + 1], score]);
		}

		return ret;
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.gameStart = gameStart;
	exports.move = move;
	exports.pipu = pipu;
	exports.check = check;
	exports.gameEnd = gameEnd;

	var context = null;
	var AVAILABLE = false;

	exports.AVAILABLE = AVAILABLE;
	if ("AudioContext" in window) {
		context = new AudioContext();

		var gain = context.createGain();
		gain.gain.value = 0.05;
		gain.connect(context.destination);

		exports.AVAILABLE = AVAILABLE = true;
	}

	function gameStart() {
		if (!AVAILABLE) return;

		var time = context.currentTime + 0.01;
		var osc = context.createOscillator();
		osc.type = "square";
		osc.frequency.value = 440;
		osc.connect(gain);
		osc.start(time);
		osc.frequency.setValueAtTime(440 * 4 / 3, time + 0.1);
		osc.frequency.setValueAtTime(440 * 3 / 2, time + 0.2);
		osc.stop(time + 0.3);
	}

	function move() {
		if (!AVAILABLE) return;

		var time = context.currentTime + 0.01;
		var osc = context.createOscillator();
		osc.type = "square";
		osc.frequency.value = 440;
		osc.connect(gain);
		osc.start(time);
		osc.stop(time + 0.1);
	}

	function pipu() {
		if (!AVAILABLE) return;

		var time = context.currentTime + 0.01;
		var osc = context.createOscillator();
		osc.type = "square";
		osc.frequency.value = 440;
		osc.connect(gain);
		osc.start(time);
		osc.frequency.setValueAtTime(220, time + 0.1);
		osc.stop(time + 0.2);
	}

	function check() {
		if (!AVAILABLE) return;

		var time = context.currentTime + 0.01;
		var osc = context.createOscillator();
		osc.type = "square";
		osc.frequency.value = 440 * 45 / 32;
		osc.connect(gain);
		osc.start(time);
		osc.frequency.setValueAtTime(440 * 9 / 8, time + 0.1);
		osc.stop(time + 0.2);
	}

	function gameEnd() {
		if (!AVAILABLE) return;

		var time = context.currentTime + 0.01;
		var osc = context.createOscillator();
		osc.type = "square";
		osc.frequency.value = 440;
		osc.connect(gain);
		osc.start(time);
		osc.frequency.setValueAtTime(440 * 4 / 3, time + 0.1);
		osc.frequency.setValueAtTime(440 * 3 / 2, time + 0.2);
		osc.frequency.setValueAtTime(440 * 9 / 5, time + 0.3);
		osc.frequency.setValueAtTime(440 * 2, time + 0.4);
		osc.stop(time + 0.6);
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.getPosition = getPosition;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _positionJs = __webpack_require__(3);

	var _positionJs2 = _interopRequireDefault(_positionJs);

	var BOOK = {
		"千日手": {
			bPieces: [[23, 9], [95, 8]],
			wPieces: [[11, 6], [12, 5], [21, 8], [22, 4], [31, 7], [32, 7]],
			bHandPieces: [0, 0, 0, 1, 0, 0, 0],
			wHandPieces: [0, 0, 0, 1, 0, 0, 0]
		},
		"連続王手の千日手": {
			bPieces: [[27, 15], [37, 9], [68, 4], [95, 8]],
			wPieces: [[19, 6], [24, 1], [38, 7], [39, 8], [49, 7]],
			bHandPieces: [0, 0, 0, 0, 0, 0, 0],
			wHandPieces: [0, 0, 0, 0, 0, 0, 0]
		},
		"打ち歩詰め": {
			bPieces: [[68, 3], [95, 8]],
			wPieces: [[38, 4], [39, 7], [47, 7], [48, 7], [49, 8]],
			bHandPieces: [0, 0, 0, 0, 0, 0, 1],
			wHandPieces: [0, 0, 0, 0, 0, 0, 0]
		},
		"打ち歩詰めじゃない": {
			bPieces: [[68, 3], [78, 5], [95, 8]],
			wPieces: [[38, 7], [39, 7], [47, 7], [48, 4], [49, 8]],
			bHandPieces: [0, 0, 0, 0, 0, 0, 1],
			wHandPieces: [0, 0, 0, 0, 0, 0, 0]
		},
		"最多合法手": {
			bPieces: [[11, 1], [23, 8], [25, 4], [27, 4], [28, 4], [35, 2], [92, 6], [94, 6], [96, 6]],
			wPieces: [[29, 8]],
			bHandPieces: [1, 1, 1, 1, 1, 1, 1],
			wHandPieces: [0, 0, 3, 0, 3, 0, 17]
		},
		"先後同型": {
			bPieces: [[58, 7], [61, 7], [63, 7], [64, 7], [65, 4], [66, 7], [67, 7], [69, 7], [72, 7], [73, 4], [75, 7], [77, 5], [83, 3], [85, 3], [88, 1], [91, 6], [92, 5], [93, 8], [99, 6]],
			wPieces: [[52, 7], [49, 7], [47, 7], [46, 7], [45, 4], [44, 7], [43, 7], [41, 7], [38, 7], [37, 4], [35, 7], [33, 5], [27, 3], [25, 3], [22, 1], [19, 6], [18, 5], [17, 8], [11, 6]],
			bHandPieces: [0, 1, 0, 0, 0, 0, 0],
			wHandPieces: [0, 1, 0, 0, 0, 0, 0]
		},
		"次の一手1.1": {
			bPieces: [[54, 7], [61, 7], [65, 7], [72, 7], [73, 2], [75, 4], [76, 7], [77, 7], [78, 7], [79, 7], [83, 1], [85, 3], [87, 4], [88, 8], [91, 6], [92, 5], [96, 3], [98, 5], [99, 6]],
			wPieces: [[11, 6], [12, 5], [16, 3], [18, 5], [19, 6], [23, 1], [24, 4], [25, 3], [27, 8], [32, 7], [34, 7], [35, 2], [36, 7], [37, 4], [38, 7], [39, 7], [41, 7], [45, 7], [47, 7]],
			bHandPieces: [0, 0, 0, 0, 0, 0, 1],
			wHandPieces: [0, 0, 0, 0, 0, 0, 1]
		},
		"次の一手1.54": {
			bPieces: [[27, 10], [49, 7], [57, 1], [67, 4], [71, 7], [72, 7], [74, 7], [75, 7], [77, 7], [82, 8], [91, 6], [98, 5]],
			wPieces: [[11, 6], [18, 5], [19, 6], [23, 3], [29, 8], [31, 7], [35, 7], [38, 7], [53, 4], [54, 7], [63, 5], [95, 3]],
			bHandPieces: [1, 1, 2, 0, 1, 1, 3],
			wHandPieces: [0, 0, 0, 2, 0, 0, 5]
		},
		"次の一手2.10": {
			bPieces: [[16, 15], [47, 7], [63, 7], [64, 7], [65, 7], [66, 7], [68, 7], [69, 7], [72, 7], [73, 4], [75, 4], [81, 7], [82, 8], [83, 3], [92, 5], [98, 5], [99, 6]],
			wPieces: [[12, 5], [18, 5], [19, 6], [21, 1], [25, 3], [27, 4], [28, 8], [31, 6], [34, 7], [36, 3], [38, 7], [43, 7], [46, 7], [49, 7], [52, 7], [61, 7], [97, 9]],
			bHandPieces: [0, 1, 1, 0, 0, 1, 0],
			wHandPieces: [0, 1, 0, 1, 0, 0, 1]
		},
		"難問次の一手": {
			bPieces: [[36, 1], [56, 3], [58, 7], [63, 7], [66, 7], [71, 7], [72, 7], [74, 7], [82, 8], [83, 3], [91, 6], [92, 5]],
			wPieces: [[11, 6], [12, 5], [16, 3], [18, 5], [25, 4], [28, 8], [38, 7], [41, 7], [42, 7], [43, 7], [45, 7], [47, 7], [49, 6], [54, 7], [75, 13], [99, 9]],
			bHandPieces: [0, 2, 0, 1, 0, 0, 0],
			wHandPieces: [0, 0, 1, 2, 0, 1, 5]
		}
	};

	var list = Object.keys(BOOK);

	exports.list = list;

	function getPosition(id) {
		var bPieces = BOOK[id].bPieces,
		    wPieces = BOOK[id].wPieces,
		    bHandPieces = BOOK[id].bHandPieces,
		    wHandPieces = BOOK[id].wHandPieces;
		var position = new _positionJs2["default"]();
		for (var y = 0; y < 9; ++y) for (var x = 0; x < 9; ++x) position.board[11 + 10 * y + x] = 0;
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = bPieces[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var piece = _step.value;

				position.board[piece[0]] = piece[1] | 16;
				if (piece[1] === 8) position.bKing = piece[0];
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator["return"]) {
					_iterator["return"]();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = wPieces[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var piece = _step2.value;

				position.board[piece[0]] = piece[1] | 32;
				if (piece[1] === 8) position.wKing = piece[0];
			}
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
					_iterator2["return"]();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}

		for (var i in bHandPieces) position.bPieces[i] = bHandPieces[i];
		for (var i in wHandPieces) position.wPieces[i] = wHandPieces[i];

		position.check = position.inCheck();
		return position;
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(9)
	module.exports = __webpack_require__(13)
	module.exports.template = __webpack_require__(14)
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(10);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(12)(content, {});
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(11)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 11 */
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
/* 12 */
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
/* 13 */
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
/* 14 */
/***/ function(module, exports) {

	module.exports = "<g class=\"piece\"\n\t\t v-attr=\"transform: $data | position\"\n\t\t v-on=\"click: onClick($event, $data)\">\n\t\t <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#pieceShape\"\n\t\t\t \t\tfill=\"{{$data === selectedPiece ? '#FFEACF' : '#F0C895'}}\"\n\t\t\t\t\tstroke=\"#A3783D\" />\n\t\t <text x=\"-7\" y=\"0\"  font-size=\"14px\" v-attr=\"fill: promoted ? '#AC0C15' : '#4A361B'\">{{label[0]}}</text>\n\t\t <text x=\"-7\" y=\"14\" font-size=\"14px\" v-attr=\"fill: promoted ? '#AC0C15' : '#4A361B'\">{{label[1]}}</text>\n\t</g>";

/***/ }
/******/ ]);