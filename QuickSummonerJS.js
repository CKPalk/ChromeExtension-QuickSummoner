function getSummoner(name, serverCode) {
	var parsed_name = name.toLowerCase().replace(" ", "");

	var xmlhttp = new XMLHttpRequest();
	// https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/0xThoth?api_key=7d6ae555-333f-48af-b119-1b2fa5d415f9
	var url = 'https://' + serverCode + '.api.pvp.net/api/lol/' + serverCode + '/v1.4/summoner/by-name/' + parsed_name + '?api_key=7d6ae555-333f-48af-b119-1b2fa5d415f9';

	xmlhttp.open('GET', url);

	xmlhttp.onload = function() {
		var response = JSON.parse(xmlhttp.response);
		
		var summoner_result = response[parsed_name];
		var summoner_ID = summoner_result.id;
		var summoner_NAME = summoner_result.name;
		
		getRankedTier(summoner_ID, serverCode);
		getTopChamps(summoner_ID, serverCode);
		
		var summoner_LVL = summoner_result.summonerLevel;
		document.getElementById('content_summonerNAME').innerHTML = summoner_NAME;
		document.getElementById('content_summonerLVL').innerHTML = "Level " + summoner_LVL + "  ID: " + summoner_ID;
	}

	xmlhttp.send();
}

function getTopGameCounts(summonerID, serverCode) {
	var xmlhttp = new XMLHttpRequest();
	// https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/33011944/summary?&api_key=7d6ae555-333f-48af-b119-1b2fa5d415f9
	var url = 'https://' + serverCode + '.api.pvp.net/api/lol/' + serverCode + '/v1.3/stats/by-summoner/' + summonerID + '/summary?&api_key=7d6ae555-333f-48af-b119-1b2fa5d415f9';
	
	xmlhttp.open('GET', url);
	
	xmlhttp.onload = function() {
		var response = JSON.parse(xmlhttp.request);
		
		
	}
	xmlhttp.send();
}

function setPromoImg(game_num, game_outcome) {
	if (game_outcome == "L")
		document.getElementById('promo_game_' + game_num + '_img').src = "misc_icons/lost_promotion.png";
	if (game_outcome == "W")
		document.getElementById('promo_game_' + game_num + '_img').src = "misc_icons/won_promotion.png";
	if (game_outcome == "N")
		document.getElementById('promo_game_' + game_num + '_img').src = "misc_icons/unplayed_promotion.png";
		
	
}

function getRankedTier(summonerID, serverCode) {
	var xmlhttp = new XMLHttpRequest();
	// https://na.api.pvp.net/api/lol/na/v2.5/league/by-summoner/33011944/entry?api_key=7d6ae555-333f-48af-b119-1b2fa5d415f9
	var url = 'https://' + serverCode.toLowerCase() + '.api.pvp.net/api/lol/' + serverCode.toLowerCase() + '/v2.5/league/by-summoner/' + summonerID + '/entry?api_key=7d6ae555-333f-48af-b119-1b2fa5d415f9';
	xmlhttp.open('GET', url);
	xmlhttp.onload = function() {
		if (xmlhttp.status == 200) {
			var response = JSON.parse(xmlhttp.response);
			var summoner_result = response[summonerID][0];
			
			var summoner_TIER = summoner_result.tier;
			var summoner_DIVISION = summoner_result.entries[0].division;
			var summoner_LP = summoner_result.entries[0].leaguePoints;
			if (summoner_result.entries[0].hasOwnProperty('miniSeries')) {
				document.getElementById('series_text').innerHTML = "SERIES";
				var games_outcome = summoner_result.entries[0].miniSeries.progress;
				for (var i = 1; i <= 3; i++) {
					document.getElementById('promo_game_' + i).hidden = false;
					setPromoImg(i, games_outcome.charAt(i - 1));
				}
				if (summoner_result.entries[0].miniSeries.target == 3) {
					document.getElementById('promo_game_4').hidden = false;
					document.getElementById('promo_game_5').hidden = false;
					setPromoImg(4, games_outcome.charAt(3));
					setPromoImg(5, games_outcome.charAt(4));
				}
				else {
					document.getElementById('promo_game_4').hidden = true;
					document.getElementById('promo_game_5').hidden = true;
					setPromoImg(4, "N");
					setPromoImg(5, "N");
				}
			}
			else {
				for (var i = 1; i <= 5; i++) {
					setPromoImg(i, "N");
				}
				document.getElementById('promo_game_1').hidden = true;
				document.getElementById('promo_game_2').hidden = true;
				document.getElementById('promo_game_3').hidden = true;
				document.getElementById('promo_game_4').hidden = true;
				document.getElementById('promo_game_5').hidden = true;
				document.getElementById('series_text').innerHTML = "";
			}
			
			var summoner_LP_text = "";
			if (summoner_LP < 10)
				summoner_LP_text = summoner_LP + "";
			else if (summoner_LP >= 100) {
				for (var i = 0; i < summoner_LP.toString().length; i++) {
					summoner_LP_text += summoner_LP.toString().charAt(i);
					summoner_LP_text += "<br>";
				}
			}
			else
				summoner_LP_text = (Math.floor(summoner_LP / 10)) + "<br>" + (summoner_LP % 10);
				
			var LP_bar_height = 8;
			if (summoner_LP > 8) {
				LP_bar_height = Math.min(Math.round((summoner_LP / 100) * 90), 90);
			}
			var ranked_filename = "ranked_img/" + summoner_TIER + "_" + summoner_DIVISION + ".png";
			var ranked_text = summoner_TIER.charAt(0) + summoner_TIER.slice(1).toLowerCase() + " " + summoner_DIVISION;
			
			document.getElementById('content_summonerRANK_img').src = ranked_filename;
			document.getElementById('content_summonerRANK_text').innerHTML = ranked_text;
			document.getElementById('content_summonerLP_result').style.height = LP_bar_height + "px";
			if (24 < summoner_LP) {
				document.getElementById('content_summonerLP_result').innerHTML = summoner_LP_text;
				document.getElementById('content_summonerLP_low_result').innerHTML = "";
			}
			else {
				document.getElementById('content_summonerLP_result').innerHTML = "";
				document.getElementById('content_summonerLP_low_result').innerHTML = summoner_LP_text;
			}
			document.getElementById('content_window1').hidden = false;
			// document.getElementById('content_window2').hidden = false;
		}
		if (xmlhttp.status == 404) {
			for (var i = 1; i <= 5; i++) {
				setPromoImg(i, "N");
			}
			document.getElementById('promo_game_1').hidden = true;
			document.getElementById('promo_game_2').hidden = true;
			document.getElementById('promo_game_3').hidden = true;
			document.getElementById('promo_game_4').hidden = true;
			document.getElementById('promo_game_5').hidden = true;
			document.getElementById('series_text').innerHTML = "";
			document.getElementById('content_summonerRANK_img').src = "ranked_img/unknown.png";
			document.getElementById('content_summonerRANK_text').innerHTML = "Unranked";
			document.getElementById('content_summonerLP_low_result').innerHTML = "";
			document.getElementById('content_summonerLP_result').innerHTML = "";
			document.getElementById('content_summonerLP_result').style.height = "8px";
			document.getElementById('content_window1').hidden = false;
			// document.getElementById('content_window2').hidden = false;
		}
	}
	
	xmlhttp.send();
}

function getTopChamps(summoner_ID, serverCode) {
		var xmlhttp = new XMLHttpRequest();
		// https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/33011944/ranked?&api_key=7d6ae555-333f-48af-b119-1b2fa5d415f9
		var url = 'https://' + serverCode + '.api.pvp.net/api/lol/' + serverCode + '/v1.3/stats/by-summoner/' + summoner_ID + '/ranked?&api_key=7d6ae555-333f-48af-b119-1b2fa5d415f9';
		xmlhttp.open('GET', url);
		xmlhttp.onload = function() {
			if (xmlhttp.status == 200) {
				var response = JSON.parse(xmlhttp.response);
				var champions = response.champions;
				var champ1_index, champ2_index, champ3_index;
				var champCount = champions.length;
				
				var topValue = 0;
				for (var i = 0; i < champCount; i++) {
					if (champions[i].id != 0) {
						if (champions[i].stats.totalSessionsPlayed > topValue) {
							topValue = champions[i].stats.totalSessionsPlayed;
							champ1_index = i;
						}
					}
				}
				topValue = 0;
				for (var i = 0; i < champCount; i++) {
					if (i != champ1_index && champions[i].id != 0) {
						if (champions[i].stats.totalSessionsPlayed > topValue) {
							topValue = champions[i].stats.totalSessionsPlayed;
							champ2_index = i;
						}
					}
				}
				topValue = 0;
				for (var i = 0; i < champCount; i++) {
					if (i != champ1_index && i != champ2_index && champions[i].id != 0) {
						if (champions[i].stats.totalSessionsPlayed > topValue) {
							topValue = champions[i].stats.totalSessionsPlayed;
							champ3_index = i;
						}
					}
				}
				
				if (champ1_index) {
					var champ1 = champions[champ1_index];
					setChampStat(1 , champ1.id);
					setChampGameStats(1, champ1.stats.totalSessionsWon, champ1.stats.totalSessionsLost);
				}
				else {
					setChampStat(1 , 0);
					setChampGameStats(1, 0, 0);
				}
				
				if (champ2_index) {
					var champ2 = champions[champ2_index];
					setChampStat(2 , champ2.id);
					setChampGameStats(2, champ2.stats.totalSessionsWon, champ2.stats.totalSessionsLost);
				}
				else {
					setChampStat(2 , 0);
					setChampGameStats(2, 0, 0);
				}
				
				if (champ3_index) {
					var champ3 = champions[champ3_index];
					setChampStat(3 , champ3.id);
					setChampGameStats(3, champ3.stats.totalSessionsWon, champ3.stats.totalSessionsLost);
				}
				else {
					setChampStat(3 , 0);
					setChampGameStats(3, 0, 0);
				}
				
				
				
				for (var i = 0; i < champCount; i++) {
					addToChampPool(champions[i].id, champions[i].stats.totalSessionsWon, champions[i].stats.totalSessionsLost);
				}
			}
			else {
				document.getElementById('ChampStats').hidden = true;
				setChampStat(1 , 0);
				setChampStat(2 , 0);
				setChampStat(3 , 0);
			}
		}
		xmlhttp.send();
}

function addToChampPool(champID, champWINS, champLOSSES) {
	var xmlhttp = new XMLHttpRequest();
	var url = 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/' + champID + '?&api_key=7d6ae555-333f-48af-b119-1b2fa5d415f9';
	xmlhttp.open('GET', url);
	xmlhttp.onload = function() {
		var response = JSON.parse(xmlhttp.response);
		var champNAME = response.name;
		var champKEY = response.key.toUpperCase();
		
		var champSTAT = {};
		
		champSTAT.ID = champID;
		champSTAT.name = champNAME;
		champSTAT.wins = champWINS;
		champSTAT.losses = champLOSSES;
		
		ChampData[champKEY] = champSTAT;
	}
	xmlhttp.send();
}

function setChampGameStats(slot, total_won, total_lost) {
	if (total_won != 0 || total_lost != 0) {
		if (slot == 1) {
			topChamp1.wins = total_won;
			topChamp1.losses = total_lost;
		}
		if (slot == 2) {
			topChamp2.wins = total_won;
			topChamp2.losses = total_lost;
		}
		if (slot == 3) {
			topChamp3.wins = total_won;
			topChamp3.losses = total_lost;
		}
		document.getElementById('champ' + slot + '_game_wins').innerHTML = total_won;
		document.getElementById('champ' + slot + '_fill').innerHTML = "-";
		document.getElementById('champ' + slot + '_game_lost').innerHTML = total_lost;
	}
	else {
		document.getElementById('champ' + slot + '_game_wins').innerHTML = "";
		document.getElementById('champ' + slot + '_fill').innerHTML = "";
		document.getElementById('champ' + slot + '_game_lost').innerHTML = "";
	}
}

function setChampImage(slot, key) {
	if (key) {
		var filename = 'champ_img\\' + key + '.png';
		document.getElementById('champ' + slot + '_image').src = filename;
		
	}
	else
		document.getElementById('champ' + slot + '_image').src = "//:0";
	document.getElementById('ChampStats').hidden = false;
}

function setTopStats(slot, key) {
	if (key) {
		var champNAME;
		var champWINS;
		var champLOSSES;
		if (slot == 1) {
			champNAME = topChamp1.name;
			champWINS = topChamp1.wins;
			champLOSSES = topChamp1.losses;
		}
		else if (slot == 2) {
			champNAME = topChamp2.name;
			champWINS = topChamp2.wins;
			champLOSSES = topChamp2.losses;
		}
		else {
			champNAME = topChamp3.name;
			champWINS = topChamp3.wins;
			champLOSSES = topChamp3.losses;
		}
		
		document.getElementById('champ' + slot + '_name').innerHTML = champNAME;
		document.getElementById('champ' + slot + '_game_wins').innerHTML = champWINS;
		document.getElementById('champ' + slot + '_fill').innerHTML = "-";
		document.getElementById('champ' + slot + '_game_lost').innerHTML = champLOSSES;
	}
	else {
		document.getElementById('champ' + slot + '_name').innerHTML = "";
		document.getElementById('champ' + slot + '_game_wins').innerHTML = "";
		document.getElementById('champ' + slot + '_fill').innerHTML = "";
		document.getElementById('champ' + slot + '_game_lost').innerHTML = "";
	}
}

function setSearchedStats(slot, key) {
	if (key) {
		var champNAME = ChampData[key].name;
		var champWINS = ChampData[key].wins;
		var champLOSSES = ChampData[key].losses;
		
		document.getElementById('champ' + slot + '_name').innerHTML = champNAME;
		document.getElementById('champ' + slot + '_game_wins').innerHTML = champWINS;
		document.getElementById('champ' + slot + '_fill').innerHTML = "-";
		document.getElementById('champ' + slot + '_game_lost').innerHTML = champLOSSES;
	}
	else {
		document.getElementById('champ' + slot + '_name').innerHTML = "";
		document.getElementById('champ' + slot + '_game_wins').innerHTML = "";
		document.getElementById('champ' + slot + '_fill').innerHTML = "";
		document.getElementById('champ' + slot + '_game_lost').innerHTML = "";
	}
}

function setChampStat(slot, champ_ID) {
	if (champ_ID != 0) {
		var xmlhttp = new XMLHttpRequest();
		// https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/40?&api_key=7d6ae555-333f-48af-b119-1b2fa5d415f9
		var url = 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/' + champ_ID + '?&api_key=7d6ae555-333f-48af-b119-1b2fa5d415f9';
		xmlhttp.open('GET', url);
		xmlhttp.onload = function() {
			var response = JSON.parse(xmlhttp.response);
			document.getElementById('champ' + slot + '_name').innerHTML = response.name;
			
			if (slot == 1 && !topChamp1.hasOwnProperty("key")) {
				topChamp1.key = response.key;
				topChamp1.name = response.name;
			}
			if (slot == 2 && !topChamp2.hasOwnProperty("key")) {
				topChamp2.key = response.key;
				topChamp2.name = response.name;
			}
			if (slot == 3 && !topChamp3.hasOwnProperty("key")) {
				topChamp3.key = response.key;
				topChamp3.name = response.name;
			}
			
			setChampImage(slot, response.key);
		}
		xmlhttp.send();
	}
	else {
		document.getElementById('champ' + slot + '_image').src = "//:0";
		document.getElementById('champ' + slot + '_name').innerHTML = "";
	}
}

var server = "NA";
var ChampData = {};

var topChamp1 = {};
var topChamp2 = {};
var topChamp3 = {};

var searchChamp1 = {};
var searchChamp2 = {};
var searchChamp3 = {};

/* TODO:
*	total ranked games
*	ranked active light (on / off)
*	Alternative extension with only champ search and no top 3
*/

document.addEventListener('DOMContentLoaded', function() {
	var summoner_input_value = document.getElementById('summoner_input_value');
	var champion_input_value = document.getElementById('champion_input_value');
	summoner_input_value.focus();
	summoner_input_value.addEventListener('click', function() { this.value = ""; });
	summoner_input_value.addEventListener('keypress', function(e) {
		if (e.keyCode === 13) {
			// Zero All Data
			ChampData = {};
			topChamp1 = {};
			topChamp2 = {};
			topChamp3 = {};
			searchChamp1 = {};
			searchChamp2 = {};
			searchChamp3 = {};
			server = document.getElementById('server').value;
			var input = summoner_input_value.value.replace(" ", "");
			getSummoner(input, server);
			summoner_input_value.blur();
			champion_input_value.value = "";
		}
	});
	champion_input_value.addEventListener('keyup', function() {
		var input = champion_input_value.value.toUpperCase();
		if (input.length > 0) {
			searchChamp1 = {};
			searchChamp2 = {};
			searchChamp3 = {};
			for (var key in ChampData) {
				if (key.indexOf(input) > -1) {
					if (!searchChamp1.hasOwnProperty("key"))
						searchChamp1.key = key;
					else if (!searchChamp2.hasOwnProperty("key"))
						searchChamp2.key = key;
					else if (!searchChamp3.hasOwnProperty("key"))
						searchChamp3.key = key;
				}
			}
			
			setChampImage(1, searchChamp1.key);
			setSearchedStats(1, searchChamp1.key);
			
			setChampImage(2, searchChamp2.key);
			setSearchedStats(2, searchChamp2.key);
			
			setChampImage(3, searchChamp3.key);
			setSearchedStats(3, searchChamp3.key);
		}
		else {
			if (topChamp1.key) {
				setChampImage(1, topChamp1.key);
				setTopStats(1, topChamp1.key);
			}
			
			if (topChamp2.key) {
				setChampImage(2, topChamp2.key);
				setTopStats(2, topChamp2.key);
			}

			if (topChamp3.key) {
				setChampImage(3, topChamp3.key);
				setTopStats(3, topChamp3.key);
			}
		}
		// document.getElementById('champion_input_value').blur();
	});
});