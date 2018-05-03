
// Global Variables
var message_length = 225

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
		// Make a copy of the course description array
		//		0: Copy of program metadata
		//		1: {progName -> {course -> description}}
		var newJsonCourseDB = jQuery.extend(true, [], jsonCourseDB)
		var courseDescription = newJsonCourseDB[1]
		var programMetadata = newJsonCourseDB[0]


		/***************************************************************
		*
		* Filter out irrelevant data
		*
		***************************************************************/
		// Get selected grade option
		var selectedGrade = parseInt($(".select-cr-grade").val());
		
		// BY LOCATION: If one or more locations is selected 
		if ($(".select-cr-location").val() !== null ) {
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
		if ($(".select-cr-cat").val() !== null) {
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

			// may be worthwhile to check if either spanish lang are selected and neither Bar/Sal are
				// add Span text to lang warning
			// then check if either french lang are selected and neither Par/Peez are
				// add French text to lang warning
		
		if ($(".select-cr-location").val() !== null && $(".select-cr-cat").val() !== null) {

			var langResults = "";
			
			// Make array containing all selected locations and categories
			var locations = $(".select-cr-location").val();
			var categories = $(".select-cr-cat").val();

			if ( ($.inArray("FIELD17", categories) != -1 || $.inArray("FIELD18", categories) != -1) && ($.inArray("Salamanca", locations) == -1 && $.inArray("Barcelona", locations) == -1)) {
				langResults += "Only Barcelona and Salamanca offer courses in Spanish.";
			}

			if ( ($.inArray("FIELD15", categories) != -1 || $.inArray("FIELD16", categories) != -1) && ($.inArray("Paris", locations) == -1 && $.inArray("Montpellier", locations) == -1)) {
				langResults += "<br /> Only Paris and Montpellier offer courses in French.";
			}

		}
		
		/***************************************************************
		*
		* Display Program and Courses
		*
		***************************************************************/

		var textResults = "";
		console.log("These are the remaining programs and courses:");
		// Display all remaining courses in "PROGRAM : COURSE" format
		$.each(newJsonObject, function(index, value) {
			var progName = $.trim( newJsonObject[index]["progName"] );
			var progURL = $.trim( newJsonObject[index]["progUrl"] );
			var progGrades = null;
			var progDescription = null;
			var course_exist = false;
			var bannertxt = '';
			var coursetxt = '';

			// iterate through the course list
			$.each(newJsonObject[index]["courses"], function(i, v) {
				// Obtain all the relevant information

				var courseName = $.trim( newJsonObject[index]["courses"][i]["name"] );
				
				// Set up div and get course/program information
				coursetxt += '<div class="content-box">'
				console.log( progName + ": " + courseName);
				coursetxt += "<a href='http://www.oxbridgeprograms.com/Programs/" + progURL + "'>" + 
					progName + "</a> " + "<h6>" + courseName + "</h6>";


				// iteratively check the key in case of case sensitivity and truncate the description
				var desc = "<p> Course DNE </p>"
				for (course in courseDescription[ progName ]) {
					if (course.toLowerCase() === courseName.toLowerCase()){
						var temp = courseDescription[ progName ][ course ]
						if( temp.length > message_length )
							temp = temp.substring(0, message_length) + "..."
						desc = "<p>" + temp + "</p><br />";
					}
				}
				
				coursetxt += desc;
				coursetxt += "</div>";
				course_exist = true;
			});

			// Add the banner if the course exists
			
			if (course_exist) {
				// Find the appropriate program
				for (progSheet in programMetadata) {
					if ($.trim( programMetadata[progSheet]["progName"] ) === progName) {
						progGrades = eval( $.trim( programMetadata[progSheet]["grade"] ) );
						progDescription = $.trim( programMetadata[progSheet]["description"] );
					}
				}

				// For each program set up a banner
				// var imgUrl = 'img/' + progURL + '.jpg';
				var imgUrl = '/Portals/0/img/' + progURL + '.jpg';

				bannertxt+= '<div class="recommend-banner">';
				// Background image
				bannertxt+= '<img class="recommend-photo-banner" ' +'src="' + imgUrl +'">';
				// Program Title
				bannertxt+= '<div class="recommend-banner-title">' 
					+  '<h4 class="reverse" style="margin:0px;"">' 
					+ '<a class="reverse" href="http://www.oxbridgeprograms.com/Programs/' + progURL + '">' 
					+ progName + '</a>' + '</h4>'
					+ '</div>';
				// Program Grade
				bannertxt+= '<div class="recommend-banner-grade">' 
					+  '<h6 class="reverse" style="margin:0px;"">Grades: ' + Math.min(...progGrades)
					+ ' - ' + Math.max(...progGrades) +'</h6>'
					+ '</div>';
				// Program Description

				// Close out the banner
				bannertxt+= '</div>';
			}

			textResults += bannertxt + coursetxt;
		});
		
		if (textResults === "") {
			if (selectedGrade === 7) {
				$("#display-results").html("7th graders can attend our Oxbridge at UCLA Prep program.");
			} else if (selectedGrade === 8) {
				$("#display-results").html("8th graders can attend our Oxford and Cambridge Prep Programs in Europe and our Oxbridge at UCLA Prep Program in the United States.");
			} else if (selectedGrade === 9) {
				if ($(".select-cr-location").val() !== null) {
				    var locations = $(".select-cr-location").val();
				    if ($.inArray("Los Angeles", locations) != -1) {
					$("#display-results").html("9th graders can attend our progams in Oxford, Cambridge, Paris, Montpellier, Barcelona, and Salamanca.");   
				}
				}
			} else if (langResults != "") {
				$("#display-results").html(langResults);
			} else {
				$("#display-results").html("Please alter your search criteria...");
			}
		} else {
		$("#display-results").html(textResults);
		}
	}