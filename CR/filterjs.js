
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
		* Build object with relevant information
		*
		***************************************************************/

		var filtered_list = {};
		$.each(newJsonObject, function(index, value) {
			var progName = $.trim( newJsonObject[index]["progName"] );
			var courseDescrip = null;
			var courseName = null;

			$.each(newJsonObject[index]["courses"], function(i, v) {
				courseName = $.trim( newJsonObject[index]["courses"][i]["name"]);

				// Find the appropriate program
				courseDescrip = "Course DNE";
				for (course in courseDescription[ progName ]) {
					if (course.toLowerCase() === courseName.toLowerCase()){
						courseDescrip = courseDescription[ progName ][ course ];
					}
				}

				// Add the program/course/description
				if( !( courseName in filtered_list ) ) {
					var temp = {};
					temp[progName] = courseDescrip;
					filtered_list[ courseName ] = temp;
				} else {
					filtered_list[ courseName ][ progName ] = courseDescrip;
				}

			});
		});
		
		/***************************************************************
		*
		* Courses --> Program --> Description
		*
		***************************************************************/

		var textResults = '<div id="course-table">';
		var cid = 0;
		var UID = new Date().valueOf();
		console.log("These are the remaining programs and courses:");
		Object.keys( filtered_list ).sort().forEach(function(key, value) {
			console.log( key );

			// Panel group
			textResults += '<div class="panel-group" id="custom-accordion-program-' + cid + '">';
			// Styling container
			textResults += '<div class="panel panel-default">';

			// Header
			textResults += '<div class="panel-heading"> <h4 class="panel-title">';
	        // Enter in the course title
	        textResults += '<a data-toggle="collapse" data-parent="#custom-accordion-program-'+ cid
	        	+ '" href="#custom-collapse-program-'+ cid +'" class="collapsed" aria-expanded="false">'
	        	+ key
	        	+ '</a>';
	        // Header end
	        textResults += '</h4> </div>';

	       	// Add description boxes
	       	textResults += '<div id="custom-collapse-program-'+cid+'" class="panel-collapse collapse" aria-expanded="false" tabindex="-1" style="height:0px;">';
	       	textResults += '<div class="panel-body">';

	       	//iteratively put in the content:
	       	for (var prog in filtered_list[ key ]) {
	       		UID += 1;
	       		textResults += '<div class="bs-example"><div class="panel-group" id="accordion-program-'+cid+'-'+UID+'">'
      				+ '<div class="panel panel-default">'
         			+ '<div class="panel-heading">'
            		+ '<h4 class="panel-title">'
            		+ '<a data-toggle="collapse" data-parent="#collapse-program-'+cid
            		+ '" href="#collapse-program-'+cid+'-'+UID+'" class="" aria-expanded="true">';
            	textResults += prog;
            	textResults += '</a></h4></div>';
            	textResults += '<div id="collapse-program-'+cid+'-'+UID+'" class="panel-collapse in collapse" aria-expanded="true" tabindex="-1" style="">'
            		+ '<div class="panel-body">'
                	+ '<p class="Pa13">';
                textResults += filtered_list[ key ][ prog ];
                textResults += '</p></div></div></div></div></div>';
	       	}

	       	textResults += '</div></div>';

	        // Styling container end
	        textResults += '</div>';
	        // Panel group end
	        textResults += '</div>';
	        cid += 1;
       	});
       	textResults += '</div>';
		
		if (textResults === '<div id="course-table"></div>') {
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