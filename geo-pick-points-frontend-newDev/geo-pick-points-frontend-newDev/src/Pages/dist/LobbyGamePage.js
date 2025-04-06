"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var react_bootstrap_1 = require("react-bootstrap");
var react_router_dom_1 = require("react-router-dom");
var JoinTeamGame_1 = require("../actions/JoinTeamGame");
var copied_link_png_1 = require("../layout/image/copied-link.png");
var copy_link_png_1 = require("../layout/image/copy-link.png");
var ShareDiaglog_1 = require("../components/ShareDiaglog");
var WebSocketSetup_1 = require("../utils/WebSocketSetup");
var react_router_dom_2 = require("react-router-dom");
function LobbyGamePage() {
    var _this = this;
    var location = react_router_dom_1.useLocation();
    var _a = location.state, nickName = _a.nickName, teamID = _a.teamID, playerID = _a.playerID, codeInvite = _a.codeInvite;
    var _b = react_1.useState(null), joinedTeamID = _b[0], setJoinedTeamID = _b[1];
    var _c = react_1.useState(null), teamJoinMessage = _c[0], setTeamJoinMessage = _c[1];
    var _d = react_1.useState([]), dataTeam = _d[0], setDataTeam = _d[1];
    var _e = react_1.useState(true), loading = _e[0], setLoading = _e[1];
    var _f = react_1.useState(null), error = _f[0], setError = _f[1];
    var dispatch = react_redux_1.useDispatch();
    var _g = react_1.useState([]), players = _g[0], setPlayers = _g[1]; // Alle Spieler
    var _h = react_1.useState([]), filteredPlayers = _h[0], setFilteredPlayers = _h[1]; // Gefilterte Spieler
    var isGameStarted = react_redux_1.useSelector(function (state) { return state.gameStatus.isGameStarted; });
    //console.log("Is the game started in LobbyGamePage?", isGameStarted);
    var _j = WebSocketSetup_1["default"]("ws://localhost:3443"), messages = _j.messages, sendMessage = _j.sendMessage;
    console.log("NickName in LobbyGamePage?", nickName);
    react_1.useEffect(function () {
        console.log("isGameStarted has changed:", isGameStarted);
    }, [isGameStarted]);
    react_1["default"].useEffect(function () {
        console.log('LobbyGamePage:in Lobby Game..... isGameStarted =', isGameStarted);
    }, [isGameStarted]);
    // Fetch team data from backend on component mount
    react_1.useEffect(function () {
        var fetchTeamData = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, teams, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, 4, 5]);
                        return [4 /*yield*/, fetch("http://localhost:3443/api/team/" + codeInvite)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Failed to fetch team data");
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        teams = _a.sent();
                        setDataTeam(teams);
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Error fetching team data:", error_1);
                        setError("Could not load teams. Please try again.");
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchTeamData();
    }, [playerID]);
    react_1.useEffect(function () {
        var fetchPlayerData = function () { return __awaiter(_this, void 0, void 0, function () {
            var teamIds, responses, playersData, allPlayers, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(dataTeam.length > 0)) return [3 /*break*/, 3];
                        teamIds = dataTeam.map(function (team) { return team._id; });
                        return [4 /*yield*/, Promise.all(teamIds.map(function (teamId) {
                                return fetch("http://localhost:3443/api/player/team/" + teamId);
                            }))];
                    case 1:
                        responses = _a.sent();
                        return [4 /*yield*/, Promise.all(responses.map(function (response) {
                                if (!response.ok) {
                                    throw new Error("Failed to fetch player data");
                                }
                                return response.json();
                            }))];
                    case 2:
                        playersData = _a.sent();
                        allPlayers = playersData.flat();
                        setPlayers(allPlayers);
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        console.error("Error fetching player data:", error_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchPlayerData();
    }, [dataTeam]);
    // Spieler filtern
    react_1.useEffect(function () {
        if (dataTeam.length > 0 && players.length > 0) {
            var filtered = players.filter(function (player) {
                return dataTeam.some(function (team) { return team._id === player.teamId; });
            });
            setFilteredPlayers(filtered);
        }
    }, [dataTeam, players]);
    // WebSocket: Listen to join/leave events
    var navigate = react_router_dom_2.useNavigate();
    react_1.useEffect(function () {
        messages.forEach(function (msg) {
            if (msg.type === "join") {
                setFilteredPlayers(function (prevPlayers) {
                    var isAlreadyAdded = prevPlayers.some(function (player) { return player.id === msg.playerId; });
                    if (isAlreadyAdded) {
                        return prevPlayers; // Spieler nicht erneut hinzufügen
                    }
                    return __spreadArrays(prevPlayers, [{ id: msg.playerId, nickName: msg.playerName, teamId: msg.teamId }]);
                });
            }
            else if (msg.type === "leave") {
                setFilteredPlayers(function (prevPlayers) {
                    return prevPlayers.filter(function (player) { return player.id !== msg.playerId; });
                });
            }
            else if (msg.type === "loadMap") {
                navigate("/map", { state: {} });
            }
        });
    }, [messages]);
    console.log("messages....+++", messages);
    // Handle join/unjoin logic
    var handleJoinOrUnjoinTeam = function (teamName, teamId, teamNum) {
        console.log("teamName..... in Un join", teamName, teamId, teamNum);
        if (joinedTeamID === teamId) {
            sendMessage({
                type: "leave",
                playerId: playerID,
                playerName: nickName,
                teamId: teamId
            });
            dispatch(JoinTeamGame_1.unjoinTeam({ teamId: teamId, playerID: playerID }));
            setJoinedTeamID(null);
            setTeamJoinMessage("You have unjoined : " + teamName + " Team " + teamNum);
            setFilteredPlayers(function (prev) { return prev.filter(function (player) { return player.id !== playerID; }); });
        }
        else {
            sendMessage({
                type: "join",
                playerId: playerID,
                playerName: nickName,
                teamId: teamId
            });
            console.log("teamName..... in join", nickName, playerID, teamId);
            dispatch(JoinTeamGame_1.joinInTeam({ nickName: nickName, playerID: playerID, teamId: teamId }));
            setJoinedTeamID(teamId);
            setTeamJoinMessage("You have joined :" + teamName + " Team " + teamNum);
            setFilteredPlayers(function (prev) { return __spreadArrays(prev, [
                { id: playerID, nickName: nickName, teamId: teamId }
            ]); });
        }
    };
    console.log("NickName in LobbyGamePage?3333", nickName);
    return (react_1["default"].createElement("div", { className: "container mt-5" },
        react_1["default"].createElement("h2", null,
            "Lobby Host : ",
            nickName,
            " , you are here in the lobby game."),
        teamJoinMessage && react_1["default"].createElement(react_bootstrap_1.Alert, { variant: "success" }, teamJoinMessage),
        error && react_1["default"].createElement(react_bootstrap_1.Alert, { variant: "danger" }, error),
        loading ? (react_1["default"].createElement("p", null, "Loading teams...")) : (react_1["default"].createElement(JoinTeamGame, { joinedTeamID: joinedTeamID, dataTeam: dataTeam, onJoinOrUnjoinTeam: handleJoinOrUnjoinTeam, isGameStarted: isGameStarted, filteredPlayers: filteredPlayers }))));
}
// Component to List and Join Teams
function JoinTeamGame(_a) {
    var joinedTeamID = _a.joinedTeamID, dataTeam = _a.dataTeam, onJoinOrUnjoinTeam = _a.onJoinOrUnjoinTeam, isGameStarted = _a.isGameStarted, filteredPlayers = _a.filteredPlayers;
    //button share
    var _b = react_1.useState(false), isCopied = _b[0], setIsCopied = _b[1];
    var _c = react_1.useState(false), showShareDialog = _c[0], setShowShareDialog = _c[1];
    var handleCopyLink = function () {
        if (dataTeam.length > 0 && dataTeam[0].shareUrl) {
            navigator.clipboard.writeText(dataTeam[0].shareUrl);
            setIsCopied(true);
            setTimeout(function () { return setIsCopied(false); }, 3000);
        }
    };
    var handelnShowShareDialog = function () {
        setShowShareDialog(true);
    };
    var handleClose = function () {
        setShowShareDialog(false);
    };
    return (react_1["default"].createElement("div", { className: "container mt-5" },
        react_1["default"].createElement("div", { className: "card" },
            react_1["default"].createElement("div", { className: "card-header text-primary" },
                react_1["default"].createElement("h4", null, "Select your Teams")),
            react_1["default"].createElement("div", { className: "text-center my-4" },
                react_1["default"].createElement("h5", null, "Invite QR Code"),
                dataTeam.length > 0 && dataTeam[0].qaCode && (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement("img", { src: dataTeam[0].qaCode, alt: "Team QR Code", style: { width: "200px", border: "1px solid gray", padding: "10px" } }))),
                react_1["default"].createElement("div", null,
                    dataTeam.length > 0 && dataTeam[0].shareUrl && (dataTeam[0].codeInvite),
                    " "),
                dataTeam.length > 0 && dataTeam[0].shareUrl && (react_1["default"].createElement("div", null,
                    react_1["default"].createElement("h5", { style: { marginTop: "1.5rem" } }, "Links to share"),
                    react_1["default"].createElement("div", { style: { border: "1px solid white" } },
                        react_1["default"].createElement("a", { href: dataTeam[0].shareUrl }, dataTeam[0].shareUrl)),
                    react_1["default"].createElement(react_bootstrap_1.Button, { variant: "primary", style: { margin: "0.5rem" }, onClick: handleCopyLink, disabled: isCopied }, isCopied ? (react_1["default"].createElement(react_1["default"].Fragment, null,
                        react_1["default"].createElement("img", { src: copied_link_png_1["default"], alt: "check icon", style: { width: "30px", height: "30px" } }),
                        "Copied!")) : (react_1["default"].createElement(react_1["default"].Fragment, null,
                        react_1["default"].createElement("img", { src: copy_link_png_1["default"], alt: "copy icon", style: { width: "30px", height: "30px" } })))),
                    react_1["default"].createElement("button", { className: "btn  btn-warning ", style: { margin: "0.5rem" }, onClick: handelnShowShareDialog }, " share ")))),
            react_1["default"].createElement("div", { className: "card-body row" }, dataTeam.length > 0 ? (dataTeam.map(function (item, index) {
                // Filtere die Spieler, die zum aktuellen Team gehören
                var playersInCurrentTeam = filteredPlayers.filter(function (player) { return player.teamId === item._id; });
                return (react_1["default"].createElement(react_bootstrap_1.Card, { key: index, className: "flex-shrink-0", style: { width: '18rem', border: "1px solid gray", margin: "0.5rem" } },
                    react_1["default"].createElement(react_bootstrap_1.CardBody, null,
                        react_1["default"].createElement(react_bootstrap_1.CardTitle, null,
                            item.name,
                            " Team ",
                            index + 1),
                        react_1["default"].createElement(react_bootstrap_1.ListGroup, null,
                            react_1["default"].createElement(react_bootstrap_1.ListGroupItem, null,
                                react_1["default"].createElement("strong", null, "Host Name:"),
                                " ",
                                item.players.map(function (player, idx) { return (react_1["default"].createElement("span", { key: player.id },
                                    player.nickName,
                                    idx < item.players.length - 1 ? ", " : "")); }),
                                " "),
                            react_1["default"].createElement(react_bootstrap_1.ListGroupItem, null,
                                react_1["default"].createElement("strong", null, "Players List:"),
                                react_1["default"].createElement("ul", null, playersInCurrentTeam.length > 0 ? (playersInCurrentTeam.map(function (player) { return (react_1["default"].createElement("li", { key: player.id }, player.nickName)); })) : (react_1["default"].createElement("li", { style: { color: "Tomato" } }, "No players in this team")))))),
                    react_1["default"].createElement(react_bootstrap_1.Button, { variant: joinedTeamID === item._id ? "danger" : "primary", onClick: function () { return onJoinOrUnjoinTeam(item.name, item._id, index + 1); }, disabled: joinedTeamID !== null && joinedTeamID !== item._id }, joinedTeamID === item._id ? "Unjoin" : "Join Team")));
            })) : (react_1["default"].createElement("p", { style: { color: "Tomato" } }, "No teams available")))),
        react_1["default"].createElement(ShareDiaglog_1["default"], { show: showShareDialog, onClose: handleClose, shareUrl: dataTeam.length > 0 && dataTeam[0].shareUrl ? dataTeam[0].shareUrl : "" }),
        react_1["default"].createElement(react_bootstrap_1.Button, { variant: isGameStarted ? "success" : "secondary", className: "mt-3", disabled: !isGameStarted }, isGameStarted ? "Game Started!" : "Wait for Host To Start Game ...")));
}
exports["default"] = LobbyGamePage;
