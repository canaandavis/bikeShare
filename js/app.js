$(document).ready(function(){
	addResults('all');

	$('.nav_button').on('click', function(){
		var value = $(this).val();
		console.log(value);
		lastUpdate=0;
		addResults(value);
		clicked = true;
	});

});

var lastUpdate = 0;
var largeRow = $('.large_row');
var smallRow = $('.small_row');
var globalValue;
var clicked = true;
var previousResultsHash = {};
var holdResults = {};

// Function too add all locations to the DOM

function addResults(value){
	globalValue = value;

	console.log("run: " + value);
	
	var result =
		$.ajax({
			url: "http://api.citybik.es/austin.json",
			dateType: "jsonp",
			type: "GET"
		})

	.done(function(result){
	var timeStamp = result[0].timestamp;

		if (lastUpdate === 0 || lastUpdate < timeStamp) {
			console.log("working");
			lastUpdate = timeStamp;
			largeRow.empty();
			smallRow.empty();
			holdResults = {};

			$.each(result, function(i, item){
				holdResults[item.name] = {bikes: item.bikes, free: item.free};

				if (isInArea(item, value)) {
					var largeItem = showLarge(item);
					largeRow.append(largeItem);

					var smallItem = showSmall(item);
					smallRow.append(smallItem);

					checkIfUpdate(largeItem, smallItem, item);

				}
			});
			fadeResultsIn();
			previousResultsHash = holdResults;
			timeNow();
		}
		setTimeout(function(){
			clicked = false;
			if (value === globalValue) {
				addResults(value);
			}
		}, 30000);
	});
}

// Function to update large item with info

function showLarge(item){
	var container = $('.template .large_item').clone();
	var forRent = item.bikes;
	var forReturn = item.free;
	var lat = item.lat / 1000000;
	var lng = item.lng / 1000000;
	var avblBox = container.find('.avbl_box').find('.box');
	var rtrnBox = container.find('.rtrn_box').find('.box');

	container.find('h1').text(item.name);
	container.find('.avbl').text(item.bikes);
	container.find('.rtrn').text(item.free);
	container.find('a').attr("href", "http://maps.google.com/?q=" + lat +"," + lng);

	statusLargeItems(avblBox, forRent);
	statusLargeItems(rtrnBox, forReturn);

	return container;
}

// Function to update small item with info

function showSmall(item){
	var container = $('.template .small_item').clone();
	var forRent = item.bikes;
	var forReturn = item.free;
	var lat = item.lat / 1000000;
	var lng = item.lng / 1000000;
	var avblNum = container.find('.avbl');
	var rtrnNum = container.find('.rtrn');


	container.find('.small_head').text(item.name);
	container.find('.avbl').text(forRent);
	container.find('.rtrn').text(forReturn);
	container.find('a').attr("href", "http://maps.google.com/?q=" + lat +"," + lng);

	statusSmallItems(avblNum, forRent);
	statusSmallItems(rtrnNum, forReturn);

	return container;
}

// Function to update color on large items

function statusLargeItems(item, num) {
	// if (num > 6) {
	// 	item.addClass('open_slots');
	// }
	// else 
	if (num <= 3){
		item.addClass('no_slots');
	}
}

// Function to update color on small items

function statusSmallItems(item, num) {
	// if (num > 6) {
	//	item.addClass('open_slots_small');
	// }
	// else 
	if (num <= 3) {
		item.addClass('no_slots_small');
	}
}

// Function to append each element to the DOM
function addToDOM(item){
	var largeItem = showLarge(item);
	largeRow.append(largeItem);

	var smallItem = showSmall(item);
	smallRow.append(smallItem);
}


// Function to check if item is in campus grid
function isInArea(item, value){
	var coordinates;

	if (value === "all") {
		return true;
	}
	else if (value === "campus"){
		coordinates = {
			south: 30277638,
			west: -97752770,
			north: 30296389,
			east: -97728051
		};
	}
	else if (value === "downtown") {
		coordinates = {
			north: 30277638,
			south: 30260236,
			east: -97736533,
			west: -97755952
		};
	}
	else if (value === "south") {
		coordinates = {
			north: 30266617,
			south: 30240840,
			east: -97745281,
			west:  -97783862
		};
	}
	else if (value === "east") {
		coordinates = {
			north: 30280478,
			south: 30247396,
			east: -97699200,
			west: -97734440
		};
	}
		
	if (item.lat >= coordinates.south && item.lat <= coordinates.north && item.lng <= coordinates.east && item.lng >= coordinates.west) {
		return true;
	}
	else {
		return false;
	}
}

// Functions to update results

	// Function to fade results out on update
	function fadeResultsOut(element) {
		$(element).find('.box, .number').fadeOut(1000);
	}
		
	// Function to fade results in on update
	function fadeResultsIn() {
		$('.item').find('.box, .number').fadeIn(1000);
	}

	// Logic to check if results have been updated and then apply fade functions

	function checkIfUpdate(largeItem, smallItem, objectItem) {
		if (previousResultsHash[objectItem.name] !== undefined && holdResults[objectItem.name].bikes !== previousResultsHash[objectItem.name].bikes) {
			console.log("changed : " + objectItem.name + " Previous: " + previousResultsHash[objectItem.name].bikes);
			fadeResultsOut(largeItem);
			fadeResultsOut(smallItem)
		}
	}

// Function to update time

function timeNow() {
	var result = moment().format('hh:mm:ss a | MMM-DD-YY');
	$('.footer').find('#updateTime')
	.text(result);
}
