var interval,
	nyanStorage = new nyanStorage(),
	themeMode = (nyanStorage.isAvailable('theme')) ? "light" : nyanStorage.get('theme'),
	isAlreadyCache = (sessionStorage.profilers == null) ? false : true,
	dataChart = [];
var Service = {
	alert: function(message) {
		$('#alert').text(message);
	}
}

var available = ["ETH/USDT","LTC/USDT","BCH/USDT","BTC/USDT","ETH/BTC","ZEC/USDT","DASH/USDT","XRP/USDT","ETC/USDT","STR/USDT","LTC/BTC","BCH/BTC","XMR/USDT","DASH/BTC","DOGE/BTC","NXT/USDT","GAS/BTC","XRP/BTC","ZEC/BTC","BTS/BTC","XMR/BTC","OMG/BTC","ETC/BTC","LSK/BTC","BELA/BTC","SC/BTC","STR/BTC","CLAM/BTC","XEM/BTC","DGB/BTC","STRAT/BTC","EMC2/BTC","GAME/BTC","ZRX/BTC","DCR/BTC","REP/USDT","NEOS/BTC","VTC/BTC","ZEC/ETH","FCT/BTC","CVC/BTC","MAID/BTC","NXT/BTC","NXC/BTC","OMG/ETH","SYS/BTC","ARDR/BTC","GNO/BTC","GNT/BTC","STEEM/BTC","OMNI/BTC","LBC/BTC","ZRX/ETH","AMP/BTC","BCN/BTC","NAV/BTC","FLDC/BTC","ETC/ETH","XCP/BTC","BCH/ETH","VIA/BTC","REP/BTC","BURST/BTC","SJCX/BTC","XBC/BTC","GNO/ETH","BLK/BTC","EXP/BTC","BTCD/BTC","LTC/XMR","POT/BTC","PASC/BTC","GNT/ETH","VRC/BTC","FLO/BTC","SBD/BTC","XPM/BTC","RADS/BTC","BCY/BTC","XVC/BTC","LSK/ETH","PINK/BTC","PPC/BTC","NMC/BTC","GRC/BTC","RIC/BTC","NOTE/BTC","NAUT/BTC","ZEC/XMR","HUC/BTC","CVC/ETH","REP/ETH","DASH/XMR","STEEM/ETH","BTM/BTC","NXT/XMR","BTCD/XMR","BLK/XMR","BCN/XMR","MAID/XMR"];
var selecteds = [];
var selected = 1;

if (themeMode == "dark") {
	$('body').css({background: "#30303d", color: "#FFF"});
}

$('#mode').val(themeMode);

if (!nyanStorage.isAvailable('coins')) {
	nyanStorage.put('coins', available);
} else {
	available = nyanStorage.get('coins');
}

available.forEach(function(coin, index) {
    for (var i = 1; i <= 4; i++) {
    	var sel = document.getElementById('select-chart-' + i);
    	var fragment = document.createDocumentFragment();
    	var opt = document.createElement('option');
	    opt.innerHTML = coin.replace('USDT', 'USD');
	    opt.value = coin.split('/').reverse().join('_');
	    if (i == selected) {
	    	selecteds.push(available[selected - 1].split('/').reverse().join('_'));
	    	selected++;
	    }
	    fragment.appendChild(opt);
		sel.appendChild(fragment);
    }
});
var charts = [],
	profiles = [];

if (isAlreadyCache) {
	var Profiles = JSON.parse(sessionStorage.profilers);

	Profiles.forEach(function(select, $index) {
		$('#select-chart-' + ($index + 1)).val(select.value);

		initializeChart(select.value, 15, $index, ($index + 1), false, themeMode);
	});
} else {
	selecteds.forEach(function(select, $index) {
		var title = select.split('_').reverse().join('/').replace('USDT', 'USD');
		$('#select-chart-' + ($index + 1)).val(select);

		initializeChart(select, 15, $index, ($index + 1), false, themeMode);
		profiles.push({
			id: ($index + 1),
			value: select,
			title: title
		});
	});
	setTimeout(function() {
		sessionStorage.profilers = JSON.stringify(profiles);
		isAlreadyCache = true;
	}, 800);
}

$('#mode').change(function(event) {
	var modeS = $(this).val();
	themeMode = modeS;

	if (modeS == "dark") {
		$('body').css({background: "#30303d", color: "#FFF"});
	} else {
		$('body').removeAttr('style');
	}
	
	nyanStorage.put('theme', modeS);

	var profiles = JSON.parse(sessionStorage.profilers);
	profiles.forEach(function(profile, $index) {
		$('#select-chart-' + ($index + 1)).val(profile.value);

		initializeChart(profile.value, 15, $index, ($index + 1), true, themeMode);
	});
});

$('[id^=select-chart-]').change(function(event) {
	var id = event.target.id.split('-')[2],
		title = $(this).val().split('_').reverse().join('/').replace('USDT', 'USD');

	if (isAlreadyCache) {
		var profiles = JSON.parse(sessionStorage.profilers);
		for (var i in profiles) {
			var profile = profiles[i];

			if (profile.id == id) {
				profiles[i].title = title,
				profiles[i].value = $(this).val()
			}
		}

		sessionStorage.profilers = JSON.stringify(profiles);
	}

	initializeChart($(this).val(), 15, (id - 1), id, true, themeMode);
});

function initializeChart(coin, timeout, index, id, update, theme) {
	var curss = coin.split('_')[0];
	if (curss == "BTC") {
		$.ajax({
			url: "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD",
			crossdomain: true,
			method: "GET",
			cache: true
		}).then(function(res) {
			if (update) charts[index].clear();
			charts[index] = AmCharts.makeChart("chartdiv-" + id, generateOptions(true, coin, timeout, res.USD));
		});
	} else {
		if (update) charts[index].clear();
		charts[index] = AmCharts.makeChart("chartdiv-" + id, generateOptions(false, coin, timeout, null));
	}
}

function generateOptions(isBTC, coin, timeout, curs) {
	var Coin = coin.split('_').reverse().join('/').replace('USDT', 'USD');
	Coin = (isBTC) ? (Coin + " (USD Rate)") : Coin;

	return {
		type: "serial",
		theme: themeMode,
		addClassNames: true,
		titles: [
			{
				text: Coin,
				size: 18
			}
		],
		dataLoader: {
			url: "https://poloniex.com/public?command=returnOrderBook&currencyPair=" + coin + "&depth=40",
			format: "json",
			reload: timeout,
			postProcess: function (data) {
				// Function to process (sort and calculate cummulative volume)
				function processData(list, type, desc) {

					// Convert to data points
					for (var i = 0; i < list.length; i++) {
						list[i] = {
							value: Number(list[i][0]),
							volume: Number(list[i][1]),
						}
					}

					// Sort list just in case
					list.sort(function (a, b) {
						if (a.value > b.value) {
							return 1;
						} else if (a.value < b.value) {
							return -1;
						} else {
							return 0;
						}
					});

					// Calculate cummulative volume
					if (desc) {
						for (var i = list.length - 1; i >= 0; i--) {
							if (i < (list.length - 1)) {
								list[i].totalvolume = list[i + 1].totalvolume + list[i].volume;
							} else {
								list[i].totalvolume = list[i].volume;
							}
							var dp = {};
							if (isBTC) {
								dp["value"] = list[i].value * curs;
							} else {
								dp["value"] = list[i].value;
							}
							dp[type + "volume"] = list[i].volume;
							dp[type + "totalvolume"] = list[i].totalvolume;
							res.unshift(dp);
						}
					} else {
						for (var i = 0; i < list.length; i++) {
							if (i > 0) {
								list[i].totalvolume = list[i - 1].totalvolume + list[i].volume;
							} else {
								list[i].totalvolume = list[i].volume;
							}
							var dp = {};
							if (isBTC) {
								dp["value"] = list[i].value * curs;
							} else {
								dp["value"] = list[i].value;
							}
							dp[type + "volume"] = list[i].volume;
							dp[type + "totalvolume"] = list[i].totalvolume;
							res.push(dp);
						}
					}

				}

				// Init
				var res = [];
				processData(data.bids, "bids", true);
				processData(data.asks, "asks", false);

				return res;
			}
		},
		graphs: [{
			id: "bids",
			fillAlphas: 0.1,
			lineAlpha: 1,
			lineThickness: 2,
			lineColor: "#0f0",
			type: "step",
			valueField: "bidstotalvolume",
			balloonFunction: balloon
		}, {
			id: "asks",
			fillAlphas: 0.1,
			lineAlpha: 1,
			lineThickness: 2,
			lineColor: "#f00",
			type: "step",
			valueField: "askstotalvolume",
			balloonFunction: balloon
		}, {
			lineAlpha: 0,
			fillAlphas: 0.2,
			lineColor: "#000",
			type: "column",
			clustered: false,
			valueField: "bidsvolume",
			showBalloon: false
		}, {
			lineAlpha: 0,
			fillAlphas: 0.2,
			lineColor: "#000",
			type: "column",
			clustered: false,
			valueField: "asksvolume",
			showBalloon: false
		}],
		categoryField: "value",
		chartCursor: {},
		chartCursor: {
			textAlign: "left"
		},
		valueAxes: [{
			title: "Volume"
		}],
		categoryAxis: {
			title: "Price (BTC/ETH)",
			minHorizontalGap: 100,
			startOnAxis: true,
			showFirstLabel: false,
			showLastLabel: false
		},
		categoryAxis: {
			enabled: true
		},
		export: {
			enabled: true
		}
	}
}
function changeMode() {
	
}


function balloon(item, graph) {
	var txt;
	if (graph.id == "asks") {
		txt = "Ask: <strong>" + formatNumber(item.dataContext.value, graph.chart, 6) + "</strong><br />" +
			"Total volume: <strong>" + formatNumber(item.dataContext.askstotalvolume, graph.chart, 4) + "</strong><br />" +
			"Volume: <strong>" + formatNumber(item.dataContext.asksvolume, graph.chart, 4) + "</strong>";
	} else {
		txt = "Bid: <strong>" + formatNumber(item.dataContext.value, graph.chart, 6) + "</strong><br />" +
			"Total volume: <strong>" + formatNumber(item.dataContext.bidstotalvolume, graph.chart, 4) + "</strong><br />" +
			"Volume: <strong>" + formatNumber(item.dataContext.bidsvolume, graph.chart, 4) + "</strong>";
	}
	return txt;
}
function formatNumber(val, chart, precision) {
	return AmCharts.formatNumber(
		val, {
			precision: precision ? precision : chart.precision,
			decimalSeparator: chart.decimalSeparator,
			thousandsSeparator: chart.thousandsSeparator
		}
	);
}
$('#addCoinForm').submit(function(event) {
	event.preventDefault();

	processAddCoin();
	return false;
});

function processAddCoin() {
	var coinValue = $('#coin-name').val(),
		error = false;

	if (coinValue.indexOf('/') === -1) {
		showAlert("Error, format error. harus ada \"/\"");
	} else {
		var coins = nyanStorage.get('coins');
		
		for (var i in coins) {
			var coin = coins[i];

			if (coin == coinValue) {
				error = true;
				showAlert("Error, coin sudah ada");
			}
		}

		if (!error) {	
			coins.push(coinValue);
			nyanStorage.put('coins', coins);

			$('.select-chart option').remove();

			for (var i = 1; i <= 4; i++) {
				var sel = document.getElementById('select-chart-' + i);
				
				coins.forEach(function(coin, index) {
			    	var fragment = document.createDocumentFragment();
			    	var opt = document.createElement('option');
				    opt.innerHTML = coin.replace('USDT', 'USD');
				    opt.value = coin.split('/').reverse().join('_');
				    fragment.appendChild(opt);
					sel.appendChild(fragment);
				});
			}

			setTimeout(function() {
				var Profiles = JSON.parse(sessionStorage.profilers);

				Profiles.forEach(function(select, $index) {
					$('#select-chart-' + ($index + 1)).val(select.value);
				});
			}, 500);

			$('#alert-msg').hide();
			$('#saveModal').modal('hide');
		}
	}
}
function showAlert(message) {
	$('#alert--msg').text(message);
	$('#alert-msg').show();
}

$('#addButton').click(function(event) {
	event.preventDefault();

	$('#saveModal').modal('show');
});