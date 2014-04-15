$(document).ready(function(){
	$('.nav_button').on('click', function(){
		var value = $(this).val();
		console.log(value);
		lastUpdate=0;
		addResults(value);
	});
	
});

var lastUpdate = 0;
var largeRow = $('.large_row');
var smallRow = $('.small_row');
var globalValue;

// Function to get ajaxRequest

function ajaxRequest(){
	
	return result;
}

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

			$.each(result, function(i, item){
				if (isInArea(item, value)) {
					var largeItem = showLarge(item);
					largeRow.append(largeItem);

					var smallItem = showSmall(item);
					smallRow.append(smallItem);
				}
			});
		}
		setTimeout(function(){
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
	// 	item.addClass('open_slots_small');
	// }
	// else 
	if (num <= 3) {
		item.addClass('no_slots_small')
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