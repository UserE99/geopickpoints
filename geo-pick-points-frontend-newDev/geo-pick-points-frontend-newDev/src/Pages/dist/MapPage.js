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
exports.__esModule = true;
var react_1 = require("react");
var react_google_maps_1 = require("@vis.gl/react-google-maps");
var react_router_dom_1 = require("react-router-dom");
var WebSocketSetup_1 = require("../utils/WebSocketSetup");
var MapPage = function () {
    var _a = react_1.useState(null), game = _a[0], setGame = _a[1];
    var _b = react_1.useState(false), isPopupOpen = _b[0], setIsPopupOpen = _b[1];
    var _c = react_1.useState(false), isMessageOpen = _c[0], setIsMessageOpen = _c[1];
    var _d = react_1.useState([]), pois = _d[0], setPois = _d[1];
    var _e = react_1.useState(null), positionPlayer = _e[0], setPositionPlayer = _e[1];
    var _f = react_1.useState(null), openIndex = _f[0], setOpenIndex = _f[1];
    var _g = react_1.useState(new Map()), scores = _g[0], setScores = _g[1]; // State to hold the scores for each team
    var mapCenter = { lat: 52.545986, lng: 13.353410 };
    var _h = react_1.useState(null), message = _h[0], setMessage = _h[1];
    var location = react_router_dom_1.useLocation();
    var _j = location.state || {}, dataGameInstance = _j.dataGameInstance, playerID = _j.playerID, teamID = _j.teamID;
    var _k = WebSocketSetup_1["default"]("" + process.env.REACT_APP_WEBSOCKET_URL), messages = _k.messages, sendMessage = _k.sendMessage;
    var playerId = playerID;
    var teamIds = teamID;
    var poiStates = []; //runs parallel to Pois. 0: Not Claimed, 1: Claimed by opponent, 2: claimed by my team
    var setPoiStates = function () { return __awaiter(void 0, void 0, void 0, function () {
        var poiResponse, poiList, playerResponse, player, teamId, teamResponse, myTeam, allTeams, _i, teamIds_1, singleTeamId, teamResponse_1, oneTeam, index, _a, poiList_1, poiId, _b, allTeams_1, team, _c, poiList_2, poiId, error_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 12, , 13]);
                    return [4 /*yield*/, fetch((process.env.REACT_APP_REST_API_URL + "game/pois/" + dataGameInstance.meta.arg.gameId), {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })];
                case 1:
                    poiResponse = _d.sent();
                    if (!poiResponse.ok)
                        return [2 /*return*/];
                    return [4 /*yield*/, poiResponse.json()];
                case 2:
                    poiList = _d.sent();
                    poiStates = Array(poiList.length).fill(0);
                    return [4 /*yield*/, fetch((process.env.REACT_APP_REST_API_URL + "player/" + playerId), {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })];
                case 3:
                    playerResponse = _d.sent();
                    if (!playerResponse.ok) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, playerResponse.json()];
                case 4:
                    player = _d.sent();
                    teamId = player.teamId;
                    return [4 /*yield*/, fetch((process.env.REACT_APP_REST_API_URL + "team/team/" + teamId), {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })];
                case 5:
                    teamResponse = _d.sent();
                    if (!teamResponse.ok)
                        return [2 /*return*/];
                    return [4 /*yield*/, teamResponse.json()
                        //console.log(JSON.stringify(myTeam, null, 2));
                    ];
                case 6:
                    myTeam = _d.sent();
                    allTeams = [];
                    _i = 0, teamIds_1 = teamIds;
                    _d.label = 7;
                case 7:
                    if (!(_i < teamIds_1.length)) return [3 /*break*/, 11];
                    singleTeamId = teamIds_1[_i];
                    return [4 /*yield*/, fetch((process.env.REACT_APP_REST_API_URL + "team/team/" + singleTeamId), {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })];
                case 8:
                    teamResponse_1 = _d.sent();
                    if (!teamResponse_1.ok)
                        return [2 /*return*/];
                    return [4 /*yield*/, teamResponse_1.json()];
                case 9:
                    oneTeam = _d.sent();
                    allTeams.push(oneTeam);
                    _d.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 7];
                case 11:
                    index = 0;
                    for (_a = 0, poiList_1 = poiList; _a < poiList_1.length; _a++) {
                        poiId = poiList_1[_a];
                        for (_b = 0, allTeams_1 = allTeams; _b < allTeams_1.length; _b++) {
                            team = allTeams_1[_b];
                            //console.log(team.poiId)
                            if (team.poiId.includes(poiId)) {
                                poiStates[index] = 1;
                            }
                        }
                        index++;
                    }
                    index = 0;
                    for (_c = 0, poiList_2 = poiList; _c < poiList_2.length; _c++) {
                        poiId = poiList_2[_c];
                        if (myTeam.poiId.includes(poiId)) {
                            poiStates[index] = 2;
                        }
                        index++;
                    }
                    console.log(poiStates);
                    return [3 /*break*/, 13];
                case 12:
                    error_1 = _d.sent();
                    console.log("Error while fetching poi Data" + error_1);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    }); };
    var claimPoint = function (poi) { return __awaiter(void 0, void 0, void 0, function () {
        var payload, claimResponse, responseData, responseData, errorData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    { }
                    setPoiStates();
                    setOpenIndex(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    payload = {
                        teamIds: teamIds,
                        playerId: playerId,
                        positionPlayer: positionPlayer
                    };
                    console.log(payload);
                    return [4 /*yield*/, fetch((process.env.REACT_APP_REST_API_URL + "poi/claim/" + poi.id), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            }, body: JSON.stringify(payload)
                        })];
                case 2:
                    claimResponse = _a.sent();
                    if (!claimResponse.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, claimResponse.json()];
                case 3:
                    responseData = _a.sent();
                    setMessage(responseData.message);
                    return [3 /*break*/, 8];
                case 4:
                    if (!(claimResponse.status == 300)) return [3 /*break*/, 6];
                    return [4 /*yield*/, claimResponse.json()];
                case 5:
                    responseData = _a.sent();
                    setMessage(responseData.message);
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, claimResponse.json()];
                case 7:
                    errorData = _a.sent();
                    console.error("Error claiming POI:", errorData);
                    _a.label = 8;
                case 8:
                    setTimeout(function () { return setMessage(null); }, 3000);
                    return [3 /*break*/, 10];
                case 9:
                    error_2 = _a.sent();
                    console.error("Failed to claim POI:", error_2);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); };
    var calculateScore = function (teamId) { return __awaiter(void 0, void 0, void 0, function () {
        var fetchString, teamResponse, team, poiIdArray, totalScore_1, pois_1, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    fetchString = process.env.REACT_APP_REST_API_URL + "team/team/" + teamId;
                    return [4 /*yield*/, fetch(fetchString)];
                case 1:
                    teamResponse = _a.sent();
                    if (!teamResponse.ok) {
                        throw new Error("failed to fetch Team");
                    }
                    return [4 /*yield*/, teamResponse.json()];
                case 2:
                    team = _a.sent();
                    poiIdArray = team.poiId;
                    totalScore_1 = 0;
                    return [4 /*yield*/, Promise.all(poiIdArray.map(function (poiId) { return __awaiter(void 0, void 0, void 0, function () {
                            var response, poi;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, fetch(process.env.REACT_APP_REST_API_URL + "poi/" + teamId + "/" + poiId)];
                                    case 1:
                                        response = _a.sent();
                                        if (!response.ok) {
                                            throw new Error("Failed to fetch POI with ID: " + poiId);
                                        }
                                        return [4 /*yield*/, response.json()];
                                    case 2:
                                        poi = _a.sent();
                                        return [2 /*return*/, poi.punkte];
                                }
                            });
                        }); }))];
                case 3:
                    pois_1 = _a.sent();
                    totalScore_1 = pois_1.reduce(function (acc, points) { return acc + points; }, 0);
                    setScores(function (prevScores) { return new Map(prevScores.set(teamId.toString(), totalScore_1)); });
                    //console.log("Score: " + totalScore)
                    return [2 /*return*/, totalScore_1];
                case 4:
                    error_3 = _a.sent();
                    console.error("Error calculating score:", error_3);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleViewTeamsClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var i, _i, teamIds_2, team, score, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsPopupOpen(function (prev) { return !prev; });
                    i = 1;
                    _i = 0, teamIds_2 = teamIds;
                    _a.label = 1;
                case 1:
                    if (!(_i < teamIds_2.length)) return [3 /*break*/, 7];
                    team = teamIds_2[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, calculateScore(team)];
                case 3:
                    score = _a.sent();
                    console.log("Score for Team " + i + ":", score);
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    console.error("Error calculating score for team " + i + ":", error_4);
                    return [3 /*break*/, 5];
                case 5:
                    i++;
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var navigate = react_router_dom_1.useNavigate();
    var handleEndGame = function () { return __awaiter(void 0, void 0, void 0, function () {
        var i, _i, teamIds_3, team, score, error_5, response, player, gameOver;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 1;
                    _i = 0, teamIds_3 = teamIds;
                    _a.label = 1;
                case 1:
                    if (!(_i < teamIds_3.length)) return [3 /*break*/, 7];
                    team = teamIds_3[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, calculateScore(team)];
                case 3:
                    score = _a.sent();
                    console.log("Score for Team " + i + ":", score);
                    return [3 /*break*/, 5];
                case 4:
                    error_5 = _a.sent();
                    console.error("Error calculating score for team " + i + ":", error_5);
                    return [3 /*break*/, 5];
                case 5:
                    i++;
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [4 /*yield*/, fetch(process.env.REACT_APP_REST_API_URL + "player/" + playerId)];
                case 8:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 9];
                    console.error("player mit id: " + playerId + " nicht gefunden");
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, response.json()];
                case 10:
                    player = _a.sent();
                    if (player.host) {
                        gameOver = function () {
                            sendMessage({
                                type: "gameOver"
                            });
                        };
                        gameOver();
                    }
                    else {
                        setMessage("only the Host can end the game early");
                        setTimeout(function () { return setMessage(null); }, 3000);
                    }
                    _a.label = 11;
                case 11: return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        var handleMessages = function () { return __awaiter(void 0, void 0, void 0, function () {
            var _i, messages_1, msg, i, _a, teamIds_4, team, score, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, messages_1 = messages;
                        _b.label = 1;
                    case 1:
                        if (!(_i < messages_1.length)) return [3 /*break*/, 10];
                        msg = messages_1[_i];
                        if (!(msg.type === "gameOver")) return [3 /*break*/, 9];
                        i = 1;
                        _a = 0, teamIds_4 = teamIds;
                        _b.label = 2;
                    case 2:
                        if (!(_a < teamIds_4.length)) return [3 /*break*/, 8];
                        team = teamIds_4[_a];
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, calculateScore(team)];
                    case 4:
                        score = _b.sent();
                        console.log("Score for Team " + i + ":", score);
                        return [3 /*break*/, 6];
                    case 5:
                        error_6 = _b.sent();
                        console.error("Error calculating score for team " + i + ":", error_6);
                        return [3 /*break*/, 6];
                    case 6:
                        i++;
                        _b.label = 7;
                    case 7:
                        _a++;
                        return [3 /*break*/, 2];
                    case 8:
                        navigate("/gameOver", { state: { dataGameInstance: dataGameInstance, playerID: playerID, teamID: teamID, scores: scores } });
                        _b.label = 9;
                    case 9:
                        _i++;
                        return [3 /*break*/, 1];
                    case 10: return [2 /*return*/];
                }
            });
        }); };
        handleMessages();
    }, [messages]);
    react_1.useEffect(function () {
        var fetchGame = function () { return __awaiter(void 0, void 0, void 0, function () {
            var responseGame, gameData, poiIdArray, pois_2, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, fetch((process.env.REACT_APP_REST_API_URL + "game/"))];
                    case 1:
                        responseGame = _a.sent();
                        if (!responseGame.ok) {
                            throw new Error("Failed to fetch game");
                        }
                        return [4 /*yield*/, responseGame.json()];
                    case 2:
                        gameData = _a.sent();
                        poiIdArray = gameData.poilId;
                        if (!Array.isArray(poiIdArray)) {
                            throw new Error("poiId is not an array or does not exist");
                        }
                        return [4 /*yield*/, Promise.all(poiIdArray.map(function (id) { return __awaiter(void 0, void 0, void 0, function () {
                                var response;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, fetch(process.env.REACT_APP_REST_API_URL + ("poi/" + id))];
                                        case 1:
                                            response = _a.sent();
                                            if (!response.ok) {
                                                throw new Error("Failed to fetch data for ID: " + id);
                                            }
                                            return [2 /*return*/, response.json()];
                                    }
                                });
                            }); }))];
                    case 3:
                        pois_2 = _a.sent();
                        setGame(gameData);
                        setPois(pois_2);
                        return [3 /*break*/, 5];
                    case 4:
                        error_7 = _a.sent();
                        console.error("Error fetching game:", error_7);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchGame();
        if (navigator.geolocation) {
            var watchId_1 = navigator.geolocation.watchPosition(function (position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                setPositionPlayer({ lat: latitude, lng: longitude });
            }, function (error) {
                console.error("Error watching position:", error);
            }, {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000
            });
            return function () { return navigator.geolocation.clearWatch(watchId_1); };
        }
        else {
            console.error("Geolocation not supported");
        }
    }, []); // Only run once on component mount
    return (react_1["default"].createElement(react_google_maps_1.APIProvider, { apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "" },
        isPopupOpen && (react_1["default"].createElement("div", { style: {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                zIndex: 1000,
                borderStyle: "solid",
                borderColor: process.env.REACT_APP_COLOR_SECONDARY,
                width: "auto",
                display: 'inline-block'
            } },
            react_1["default"].createElement("h2", null, "Teams"),
            react_1["default"].createElement("ul", { style: {
                    listStyleType: 'none',
                    padding: 0,
                    margin: 0
                } }, Array.from(scores).map(function (_a, index) {
                var teamName = _a[0], score = _a[1];
                return (react_1["default"].createElement("li", { key: index },
                    react_1["default"].createElement("p", null,
                        "Team ",
                        index + 1,
                        ": ",
                        score,
                        " Points")));
            })),
            react_1["default"].createElement("button", { style: {
                    background: 'red',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '5px',
                    fontSize: '16px'
                }, onClick: function () { return setIsPopupOpen(false); } }, "Close"))),
        react_1["default"].createElement("div", { style: { height: "100vh" } },
            react_1["default"].createElement(react_google_maps_1.Map, { defaultZoom: 17, defaultCenter: mapCenter, mapId: process.env.REACT_APP_GOOGLE_MAPS_MAP_ID || "", zoomControl: false, streetViewControl: false },
                react_1["default"].createElement("button", { style: {
                        position: 'absolute',
                        bottom: '10%',
                        right: '5%',
                        padding: '10px 20px',
                        backgroundColor: process.env.REACT_APP_COLOR_PRIMARY,
                        color: process.env.REACT_APP_COLOR_SECONDARY,
                        cursor: 'pointer',
                        borderRadius: '5px',
                        fontSize: '16px',
                        border: "solid",
                        borderStyle: "solid",
                        borderColor: process.env.REACT_APP_COLOR_SECONDARY
                    }, onClick: handleViewTeamsClick }, "View Teams"),
                react_1["default"].createElement("button", { style: {
                        position: 'absolute',
                        bottom: '10%',
                        left: '5%',
                        padding: '10px 20px',
                        backgroundColor: process.env.REACT_APP_COLOR_SECONDARY,
                        color: process.env.REACT_APP_COLOR_PRIMARY,
                        cursor: 'pointer',
                        borderRadius: '5px',
                        fontSize: '16px',
                        border: "solid",
                        borderStyle: "solid",
                        borderColor: process.env.REACT_APP_COLOR_PRIMARY
                    }, onClick: handleEndGame }, "End Game"),
                message && (react_1["default"].createElement("div", { style: {
                        position: 'absolute',
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bottom: "15%",
                        textAlign: "center",
                        padding: '10px 20px',
                        backgroundColor: process.env.REACT_APP_COLOR_PRIMARY,
                        color: process.env.REACT_APP_COLOR_SECONDARY,
                        borderRadius: '5px',
                        fontSize: '16px',
                        border: "solid",
                        borderStyle: "solid",
                        borderColor: process.env.REACT_APP_COLOR_SECONDARY
                    } }, message)),
                pois.map(function (poi, index) { return (react_1["default"].createElement(react_google_maps_1.AdvancedMarker, { key: poi.id, position: { lat: poi.lat, lng: poi.long }, onClick: function () { return setOpenIndex(index); } },
                    react_1["default"].createElement(react_google_maps_1.Pin, { background: poiStates[index] === 2 ? '#4CAF50' :
                            poiStates[index] === 1 ? '#F44336' :
                                '#FFC107', borderColor: "#0F2C3B", glyphColor: "#0F2C3B" }),
                    openIndex === index && (react_1["default"].createElement(react_google_maps_1.InfoWindow, { position: { lat: poi.lat, lng: poi.long }, onCloseClick: function () { return setOpenIndex(null); } },
                        react_1["default"].createElement("div", null,
                            react_1["default"].createElement("h3", null, poi.name),
                            react_1["default"].createElement("p", null, poi.beschreibung),
                            react_1["default"].createElement("p", null,
                                "Points: ",
                                poi.punkte),
                            react_1["default"].createElement("button", { style: {
                                    background: process.env.REACT_APP_COLOR_PRIMARY,
                                    color: process.env.REACT_APP_COLOR_SECONDARY,
                                    padding: "10px 20px",
                                    border: "solid",
                                    borderColor: process.env.REACT_APP_COLOR_SECONDARY,
                                    cursor: "pointer",
                                    borderRadius: "5px",
                                    fontSize: "16px"
                                }, onClick: function () { return claimPoint(poi); } }, "CLAIM")))))); }),
                positionPlayer && (react_1["default"].createElement(react_google_maps_1.AdvancedMarker, { position: positionPlayer },
                    react_1["default"].createElement(react_google_maps_1.Pin, { background: "white" })))))));
};
exports["default"] = MapPage;
