// Initialize Firebase
var config = {
  apiKey: "AIzaSyBiokieThyuS-4DxN1PWV6Ll22qTTHKTTE",
  authDomain: "train-scheduler-ba3e7.firebaseapp.com",
  databaseURL: "https://train-scheduler-ba3e7.firebaseio.com",
  storageBucket: "train-scheduler-ba3e7.appspot.com",
  messagingSenderId: "748468748920"
};
firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

var connectionsRef = database.ref();

// Set initial variables
var name = "";
var destination = "";
var frequency = 0;
var nextArrival = 0;
var firstTrainTime = 0;
var minAway = 0;

// Use moment js to convert time inputs

function mAway(){
	var currentTime = moment();
	
	var parsedTime = moment(firstTrainTime, "hh:mm A");
	console.log(parsedTime);

	var diffTime = currentTime.diff(moment(parsedTime), "minutes");
	console.log("Difference in time: " + diffTime);

	// Remainder
	var remainder = diffTime % frequency;
	console.log(remainder);
	
	// Minutes until train
	minAway = frequency - remainder;
	console.log("Minutes until train: " + minAway);

	return minAway;
};

function nextTrain(){

	nextArrival = moment().add(minAway, "minutes");
	return nextArrival.format("hh:mm A");
	console.log(nextArrival);
};
// Capture Button Click
$("#submit").on("click", function() {
	event.preventDefault();

	  // Grabbed values from text boxes
		name = $("#name").val().trim();
		destination = $("#destination").val().trim();
		firstTrainTime = $("#train-time").val().trim();
		console.log(firstTrainTime);
		frequency = $("#frequency").val().trim();
		console.log(frequency);

		minAway = mAway();
		nextArrival = nextTrain();
		console.log(nextArrival);

		  // Code for handling the push
		  database.ref().push({
		    name: name,
		    destination: destination,
		    time: nextArrival,
		    frequency: frequency,
		    min: minAway
		  });



	// Don't refresh the page!
	return false;

});

// Reference the database to add child elements
database.ref().on("child_added", function(snapshot) {
	// Logging our snapshot data
	console.log(snapshot);
	console.log(snapshot.val().name);
	console.log(snapshot.val().destination);
	console.log(snapshot.val().frequency);
	console.log(snapshot.val().time);
	console.log(snapshot.val().min);
	
	// Change the HTML to reflect
	var row = $("<tr>");
	row.append("<td>" + snapshot.val().name + "</td>");
	row.append("<td>" + snapshot.val().destination + "</td>");
	row.append("<td>" + snapshot.val().frequency + "</td>");
	row.append("<td>" + snapshot.val().time + "</td>");
	row.append("<td>" + snapshot.val().min + "</td>");

	$("#table").append(row);

	// Handle the errors

	}, function(errorObject) {

		console.log("Errors handled: " + errorObject.code);
});