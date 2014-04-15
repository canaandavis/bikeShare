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

// Function to get ajaxRequest

function ajaxRequest(){
	
	return result;
}

// Function too add all locations to the DOM

function addResults(value){
	
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

			if (value === "all") {
				addToDOM(result);
			}
			else if (value === "campus") {
				$.each(result, function(i, item){

					if (isInCampus(item)) {
						var largeItem = showLarge(item);
						largeRow.append(largeItem);

						var smallItem = showSmall(item);
						smallRow.append(smallItem);
					}
				});
			}



			
		}
	});
}

// Function to update large item with info

function showLarge(item){
	var container = $('.template .large_item').clone();
	var forRent = item.bikes;
	var forReturn = item.free;
	var avblBox = container.find('.avbl_box').find('.box');
	var rtrnBox = container.find('.rtrn_box').find('.box');

	container.find('h1').text(item.name);
	container.find('.avbl').text(item.bikes);
	container.find('.rtrn').text(item.free);

	statusLargeItems(avblBox, forRent);
	statusLargeItems(rtrnBox, forReturn);

	return container;
}

// Function to update small item with info

function showSmall(item){
	var container = $('.template .small_item').clone();
	var forRent = item.bikes;
	var forReturn = item.free;
	var avblNum = container.find('.avbl');
	var rtrnNum = container.find('.rtrn');


	container.find('.small_head').text(item.name);
	container.find('.avbl').text(forRent);
	container.find('.rtrn').text(forReturn);

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
function addToDOM(result){
	$.each(result, function(i, item){
		var largeItem = showLarge(item);
		largeRow.append(largeItem);

		var smallItem = showSmall(item);
		smallRow.append(smallItem);
	});
}

// Function to check if item is in campus grid
function isInCampus(item){
	var campusCord = {
		south: 30277638,
		west: -97752770,
		north: 30296389,
		east: -97728051
	};

	if (item.lat > campusCord.south && item.lat < campusCord.north) {
		return true;
	}
	else {
		return false;
	}
}