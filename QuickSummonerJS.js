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
				if (summoner_result.entries[0].miniSeries.target > 2) {
					document.getElementById('promo_game_4').hidden = false;
					document.getElementById('promo_game_5').hidden = false;
					setPromoImg(4, games_outcome.charAt(3));
				}
				else {
					document.getElementById('promo_game_4').hidden = true;
					document.getElementById('promo_game_5').hidden = true;
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
			var summoner_LP_text;
			if (summoner_LP == 100)
				summoner_LP_text = "1<br>0<br>0";
			else
				summoner_LP_text = (Math.floor(summoner_LP / 10)) + "<br>" + (summoner_LP % 10);
				
			var LP_bar_height = 8;
			if (summoner_LP > 8) {
				LP_bar_height = Math.round((summoner_LP / 100) * 90);
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
			document.getElementById('content_window2').hidden = false;
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
			document.getElementById('content_summonerRANK_img').src = "ranked_img/unknown.png";
			document.getElementById('content_summonerRANK_text').innerHTML = "Unranked";
			document.getElementById('content_summonerLP_result').style.height = "8px";
			document.getElementById('content_summonerLP_result').innerHTML = "";
			document.getElementById('content_window1').hidden = false;
			document.getElementById('content_window2').hidden = false;
		}
	}
	
	xmlhttp.send();
}

/*
function getMatchHistory(summonerID) {
	var xmlhttp = new XMLHttpRequest();
	var url = 'https://na.api.pvp.net/api/lol/na/v2.2/matchhistory/' + summonerID + '?api_key=7d6ae555-333f-48af-b119-1b2fa5d415f9';
	
	xmlhttp.open('GET', url);
	
	xmlhttp.onload = function() {
		var server_response = JSON.parse(xmlhttp.response);
		var match_id = server_response.matches[0].matchId;
		var match_outcome = server_response.matches[0].participants[0].stats.winner;
		if (match_outcome) {
			document.getElementById('match0_outcome').textContent = "You won your last game.";
		} 
		else {
			document.getElementById('match0_outcome').textContent = "You lost your last game.";
		}
		document.getElementById('content').hidden = false;
	}
	
	xmlhttp.send();
} 
*/
var server = "NA";
document.addEventListener('DOMContentLoaded', function() {
	var summoner_input_value = document.getElementById('summoner_input_value');

	document.getElementById('summoner_input_value').addEventListener('keypress', function(e) {
		if (e.keyCode === 13) {
			server = document.getElementById('server').value;
			var input = summoner_input_value.value;
			getSummoner(input, server);
			document.getElementById('summoner_input_value').blur();
		}
	});
});