// Initialize Select2 on the relevant elements
	$(document).ready(function() {
			$(".select-cr-location").select2({
				dropdownParent: $('#form-cr')
			});
			$(".select-cr-cat").select2({
				dropdownParent: $('#form-cr')
			});
			$(".select-cr-grade").select2({
				dropdownParent: $('#form-cr')
			});
	});

	// Upon pressing the submit button
	function myFunction() {
		// Make a copy of the program array
		var newJsonObject = jQuery.extend(true, [], jsonObject);
		// Get selected grade option
		var selectedGrade = parseInt($(".select-cr-grade").val());
		
		// BY LOCATION: If one or more locations is selected 
		if ($(".select-cr-location").val() == null ) {
			// Make array containing all selected locations
			var locations = $(".select-cr-location").val();
			// Iterate through the entire array of programs
			for (var i = 0; i < newJsonObject.length; i++) {
				// For each program, iterate through the selected locations array
				for (var j = 0; j < locations.length; j++) {
					// If the current program location matches the current selected location
					if (newJsonObject[i].location == locations[j]) {
						// Leave the location for loop, keep current program in newJsonObject and check next program
						break;
					} else {
						// If already iterated through all selected locations and none matched current program location
						if (j === locations.length - 1) {
							// Remove the current program from newJsonObject
							newJsonObject.splice(i, 1);
							i--;
						}
					}
				}
			}
		}
		
		// BY GRADE: Iterate through remaining array of programs
		for (var i = 0; i <newJsonObject.length; i++) {
			// Check if the selected grade exists in current program's grade array
			var toSplice = $.inArray(selectedGrade, newJsonObject[i]["grade"]);
			if (toSplice == -1) {
				// If selected grade doesn't exist in grade array, remove that program
				newJsonObject.splice(i, 1);
				i--;
			}
		}
		
		// BY CATEGORY: If one or more categories is selected
		if ($(".select-cr-cat").val() == null) {
			// Make array containing all selected categories
			var categories = $(".select-cr-cat").val();
			// Iterate through remaining array of programs
			$.each(newJsonObject, function(index, value) {
				// For each program, iterate through courses
				for (var i = 0; i < newJsonObject[index]['courses'].length; i++) {
					// For each program's course, iterate through selected categories 
					for (var j = 0; j < categories.length; j++) {
						// If the current category is STEM and either FIELD 6, 9 or 11 is selected (fall under stem classification)
						if (categories[j] === "STEM" && (newJsonObject[index]['courses'][i]["FIELD6"] === "x" || newJsonObject[index]['courses'][i]["FIELD9"] === "x" || newJsonObject[index]['courses'][i]["FIELD11"] === "x")) {
							// Leave that category for loop, keep current course and check next course
							break;
						// If the current program's course is selected for the current category
						} else if (newJsonObject[index]['courses'][i][categories[j]] === "x") {
							// Leave the category for loop, keep current course and check next course
							break;
						} else {
							// If already iterated through all selected categories and none were selected for current category
							if (j === categories.length - 1) {
								// Remove the current course from program, move on to next course
								newJsonObject[index]["courses"].splice(i, 1);
								i--;
							}
						} 
					}
				}
			});
		} 
		
		var textResults = "<br /> <br />";

		console.log("These are the remaining programs and courses:");
		// Display all remaining courses in "PROGRAM : COURSE" format
		$.each(newJsonObject, function(index, value) {
			$.each(newJsonObject[index]["courses"], function(i, v) {
				console.log(newJsonObject[index]["progName"] + ": " + newJsonObject[index]["courses"][i]["name"]);
				textResults += "<a href='http://oxbridge2017.drinkcaffeine.com/Programs/" + newJsonObject[index]["progUrl"] + "'>" + 
					newJsonObject[index]["progName"] + "</a>: " + newJsonObject[index]["courses"][i]["name"] + "<br />";
			});
		});
		
		$("#display-results").html(textResults);
	}
