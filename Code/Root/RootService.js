milestonesModule.service("RootService", function()
{
this.show =
{
	configure: {window: false, info: false, error: false},
	settings: {
			window: false,
			time: false,
			marker: false,
			languages: false,
			resetValues: false,
			resetSettings: false,
			resetToYear: false,
			backgrounds: {light: false, dark: false}
		   },
	statusBarDialog: false,
	countdownList: {window: false, add: false, confirmDelete: false},
	milestoneCountdowns: false,
	exportCountdown: false,
	importCountdown: { window: false, error: false, valueErrors: false }
}

this.icons =
{
	toggleOn: "Icons/toggleOn.svg",
	toggleOff: "Icons/toggleOff.svg"
}

//		Initialising COUNTDOWNS ARRAY and CURRENTCD variable
// Initialising the countdowns array with default values for the first countdown
this.countdowns =
[
	{
		startDate: new Date(),
		endDate: new Date(),
		endMessage: "",
		name: "",
		milestones: [{ name: "new milestone", date: new Date() }]
	}
];
this.countdowns[0].endDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 10) );
this.countdowns[0].startDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) );
this.countdowns[0].milestones[0].date = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) );

if(localStorage.countdowns !== undefined)
{
	this.countdowns = JSON.parse(localStorage.countdowns);
	
	// converting all date properties from a string type to a date type
	for(var i=0;i<this.countdowns.length;i++)
	{
		this.countdowns[i].startDate = new Date(this.countdowns[i].startDate);
		this.countdowns[i].startDate = new Date( Date.UTC(new Date(this.countdowns[i].startDate).getFullYear(), new Date(this.countdowns[i].startDate).getMonth(), new Date(this.countdowns[i].startDate).getDate()) );
		this.countdowns[i].endDate = new Date(this.countdowns[i].endDate);
		this.countdowns[i].endDate = new Date( Date.UTC(new Date(this.countdowns[i].endDate).getFullYear(), new Date(this.countdowns[i].endDate).getMonth(), new Date(this.countdowns[i].endDate).getDate()) );
		
		for(var j=0;j<this.countdowns[i].milestones.length;j++)
		{
			this.countdowns[i].milestones[j].date = new Date(this.countdowns[i].milestones[j].date);
			this.countdowns[i].milestones[j].date = new Date( Date.UTC(new Date(this.countdowns[i].milestones[j].date).getFullYear(), new Date(this.countdowns[i].milestones[j].date).getMonth(), new Date(this.countdowns[i].milestones[j].date).getDate()) );
		}
	}
}

// This variable keeps track of the current countdown being viewed and edited
this.currentCD = { index: 0 };
if(localStorage.currentCD !== undefined)
{
	this.currentCD.index = parseInt( JSON.parse(localStorage.currentCD).index );
}

this.countdownExportText = { value: ""};
this.importCountdownText = { value: ""};
this.importError = { value: ""};
this.importValueErrors = { messages: []};

this.exportCountdown = function()
{
	this.countdownExportText.value = JSON.stringify(this.countdowns[this.currentCD.index]);
}

this.importCountdown = function()
{
	// If the imported countdown text has the right fields and the values are valid then it is parsed and added to the countdowns array
	if( this.importedCountdownValid() )
	{
		// Parsing JSON text and converting date fields from string to date type
		var newCountdown = JSON.parse(this.importCountdownText.value);
		
		newCountdown.startDate = new Date(newCountdown.startDate);
		  newCountdown.startDate = new Date( Date.UTC(new Date(JSON.parse(this.importCountdownText.value).startDate).getFullYear(), new Date(JSON.parse(this.importCountdownText.value).startDate).getMonth(), new Date(JSON.parse(this.importCountdownText.value).startDate).getDate()) );
		
		newCountdown.endDate = new Date(newCountdown.endDate);
		  newCountdown.endDate = new Date( Date.UTC(new Date(JSON.parse(this.importCountdownText.value).endDate).getFullYear(), new Date(JSON.parse(this.importCountdownText.value).endDate).getMonth(), new Date(JSON.parse(this.importCountdownText.value).endDate).getDate()) );
		
		for(var i=0;i<newCountdown.milestones.length;i++)
		{
			newCountdown.milestones[i].date = new Date(newCountdown.milestones[i].date);
			newCountdown.milestones[i].date = new Date( Date.UTC(new Date(JSON.parse(this.importCountdownText.value).milestones[i].date).getFullYear(), new Date(JSON.parse(this.importCountdownText.value).milestones[i].date).getMonth(), new Date(JSON.parse(this.importCountdownText.value).milestones[i].date).getDate()) );
		}
		
		this.countdowns.push(newCountdown);
		
		// Clearing countdown text field and closing import window
		this.importCountdownText.value = "";
		this.show.importCountdown.window = false;
		
		return true;
	}
	else
	{
		return false;
	}
}

// This returns true if the imported countdown text has the correct fields and the values are valid
this.importedCountdownValid = function()
{
	if( this.importedCountdownStructureValid() )
	{
		return this.importedCountdownValuesValid();
	}
	else
	{
		return false;
	}
}

// This function verifies if the imported countdown has the correct fields
this.importedCountdownStructureValid = function()
{
	var isValid = true;
	
	// If the countdown text is empty then all other checks are skipped and the user is explicitly told to enter text
	if(this.importCountdownText.value.length == 0)
	{
		this.importError.value = "Countdown text empty. Paste exported countdown text into the text area.";
		this.show.importCountdown.error = true;
		
		return false;
	}
	
	// If the countdown text cannot be parsed as JSON then all other checks are skipped and the user is informed
	var importAsJSON = {};
	try
	{
		importAsJSON = JSON.parse(this.importCountdownText.value);
	}
	catch(e)
	{
		this.importError.value = "Countdown text does not contain valid JSON data. Copy the entire exported countdown text from the export window text area and try again.";
		this.show.importCountdown.error = true;
		
		return false;
	}
	
	
	// Object must have either 5 or 6 fields (the 6th is for a field called notified which will be implemented in a future version of milestones)
	if( !(Object.keys(importAsJSON).length == 5 || Object.keys(importAsJSON).length == 6) )
	{
		isValid = false;
	}
	
	// Object must have startDate field with valid date value
	if( !(importAsJSON.hasOwnProperty("startDate") && !isNaN(Date.parse(importAsJSON.startDate)) ) )
	{
		isValid = false;
	}
	
	// Object must have endDate field with valid date value
	if( !(importAsJSON.hasOwnProperty("endDate") && !isNaN(Date.parse(importAsJSON.endDate)) ) )
	{
		isValid = false;
	}
	
	// Object must have endMessage field
	if( !(importAsJSON.hasOwnProperty("endMessage")) )
	{
		isValid = false;
	}
	
	// Object must have name field
	if( !(importAsJSON.hasOwnProperty("name")) )
	{
		isValid = false;
	}
	
	// Object must have milestones field where the value is an array type
	if( !(importAsJSON.hasOwnProperty("milestones") && Array.isArray(importAsJSON.milestones) && importAsJSON.milestones.length <= 10) )
	{
		isValid = false;
	}
	// If there is a milestones property and it is an array then each object / milestone in the array is checked
	else
	{
		for(var i=0;i<importAsJSON.milestones.length;i++)
		{
			// Milestone object must have either 2 or 4 fields (the 3rd and 4th are for fields called notes and notified which will be implemented in a future version of milestones)
			if( !(Object.keys(importAsJSON.milestones[i]).length == 2 || Object.keys(importAsJSON.milestones[i]).length == 4) )
			{
				isValid = false;
			}
			
			// Milestone object must have name field
			if( !(importAsJSON.milestones[i].hasOwnProperty("name")) )
			{
				isValid = false;
			}
			
			// Milestone object must have date field with valid date value
			if( !(importAsJSON.milestones[i].hasOwnProperty("date") && !isNaN(Date.parse(importAsJSON.milestones[i].date)) ) )
			{
				isValid = false;
			}
		}
	}
	
	
	// If any error occurred an error message is set and false is returned to prevent the import
	if( !isValid )
	{
		this.importError.value = "The countdown text does not have the correct fields. Copy the entire exported countdown text from the export window text area and try again.";
		this.show.importCountdown.error = true;
		
		return false;
	}
	else
	{
		return true;
	}
	
	
}

// This function verifies if the imported countdown has valid values after the structure is verified
this.importedCountdownValuesValid = function()
{	
	var importAsJSON = JSON.parse(this.importCountdownText.value);
	
	// Creating date variables used to check validity of input
	var startDate = new Date(importAsJSON.startDate);
	startDate = new Date( Date.UTC(new Date(importAsJSON.startDate).getFullYear(), new Date(importAsJSON.startDate).getMonth(), new Date(importAsJSON.startDate).getDate()) );
	
	var endDate = new Date(importAsJSON.endDate);
	endDate = new Date( Date.UTC(new Date(importAsJSON.endDate).getFullYear(), new Date(importAsJSON.endDate).getMonth(), new Date(importAsJSON.endDate).getDate()) );
	
	var currentDate = new Date();
	currentDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) );
	
	var startDatePlus5000Days = new Date(startDate);
	startDatePlus5000Days.setDate(startDatePlus5000Days.getDate() + 5000);
	var currentDateMinus5000Days = new Date(currentDate);
	currentDateMinus5000Days.setDate(currentDateMinus5000Days.getDate() - 5000);
	
	var countdownName = importAsJSON.name;
	var countdownEndMessage = importAsJSON.endMessage;
	
	// Clearing old messages
	this.importValueErrors.messages = [];
	
	var isValid = true;
	
	
	// isValid set to false if any constraints violated
	if( !(endDate > startDate) )
	{
		isValid = false;
		this.importValueErrors.messages.push({ text: "The end date (" + endDate.toDateString() + ") must come after the start date (" + startDate.toDateString() + ")."});
	}
	
	if( !(endDate <= startDatePlus5000Days) )
	{
		isValid = false;
		this.importValueErrors.messages.push({ text: "The end date (" + endDate.toDateString() + ") cannot be more than 5000 days after the start date (" + startDate.toDateString() + ")."});
	}
	
	// Checking the validity of date and name properties of each milestone
	for(var i=0;i<importAsJSON.milestones.length;i++)
	{
		var milestoneDate = new Date(importAsJSON.milestones[i].date);
		    milestoneDate = new Date( Date.UTC(new Date(importAsJSON.milestones[i].date).getFullYear(), new Date(importAsJSON.milestones[i].date).getMonth(), new Date(importAsJSON.milestones[i].date).getDate()) );
		var milestoneName = importAsJSON.milestones[i].name;
		
		if( !(milestoneDate >= startDate) )
		{
			isValid = false;
			this.importValueErrors.messages.push({ text: "Milestone '" + milestoneName + "' date (" + milestoneDate.toDateString() + ") cannot be before start date (" + startDate.toDateString() + ")."});
		}
		
		if( !(milestoneDate <= endDate) && (endDate > startDate) ) // Error message not shown if end <= start as it would be redundant
		{
			isValid = false;
			this.importValueErrors.messages.push({ text: "Milestone '" + milestoneName + "' date (" + milestoneDate.toDateString() + ") cannot be after the end date (" + endDate.toDateString() + ")."});
		}
		
		if( !(milestoneName.length <= 100) )
		{
			var pluralS = milestoneName.length == 1 ? "" : "s";
			
			isValid = false;
			this.importValueErrors.messages.push({ text: "Milestone '" + milestoneName.substr(0, 100) + "' name cannot be longer than 100 characters, it is currently " + milestoneName.length + " character" + pluralS + " long."});
		}
	}

	if( !(startDate <= currentDate) )
	{
		isValid = false;
		this.importValueErrors.messages.push({ text: "The start date (" + startDate.toDateString() + ") cannot come after the current date."});
	}
	
	if( !(startDate >= currentDateMinus5000Days) )
	{
		isValid = false;
		this.importValueErrors.messages.push({ text: "The start date (" + startDate.toDateString() + ") cannot be more than 5000 days ago."});
	}
	
	if( !(countdownName.length <= 60) )
	{
		var pluralS = countdownName.length == 1 ? "" : "s";
		
		isValid = false;
		this.importValueErrors.messages.push({ text: "Countdown name over 60 character limit (currently " + countdownName.length + " character" + pluralS + "). Choose a shorter name."});
	}
	
	if( !(countdownEndMessage.length <= 60) )
	{
		var pluralS = countdownEndMessage.length == 1 ? "" : "s";
		
		isValid = false;
		this.importValueErrors.messages.push({ text: "Countdown end message over 60 character limit (currently " + countdownEndMessage.length + " character" + pluralS + "). Choose a shorter message."});
	}
	
	
	// if any constraints have been violated then the error dialog is populated with messages and displayed
	if(isValid == false)
	{
		this.show.importCountdown.valueErrors = true;
	}
	else // otherwise if all constraints are followed the error dialog is hidden
	{
		this.show.importCountdown.valueErrors = false;
	}
	
	return isValid;
}

});