milestonesModule.service("ConfigureService", function(RootService, SettingsService, ProgressBarService, StatusBarService)
{

this.countdowns = RootService.countdowns;
this.currentCD = RootService.currentCD;

this.errors = {messages: []};

this.saveCountdownsToStorage = function()
{
	if(this.countdownInputValid())
	{
		// Normalising the date values to midnight UTC before saving and calculating the progress bar
		var startDateBeforeHourReset = new Date(this.countdowns[this.currentCD.index].startDate);
		this.countdowns[this.currentCD.index].startDate = new Date( Date.UTC(startDateBeforeHourReset.getFullYear(), startDateBeforeHourReset.getMonth(), startDateBeforeHourReset.getDate()) );
		
		var endDateBeforeHourReset = new Date(this.countdowns[this.currentCD.index].endDate);
		this.countdowns[this.currentCD.index].endDate = new Date( Date.UTC(endDateBeforeHourReset.getFullYear(), endDateBeforeHourReset.getMonth(), endDateBeforeHourReset.getDate()) );
		
		for(var i=0;i<this.countdowns[this.currentCD.index].milestones.length;i++)
		{
			var milestoneDateBeforeHourReset = new Date(this.countdowns[this.currentCD.index].milestones[i].date);
			this.countdowns[this.currentCD.index].milestones[i].date = new Date( Date.UTC(milestoneDateBeforeHourReset.getFullYear(), milestoneDateBeforeHourReset.getMonth(), milestoneDateBeforeHourReset.getDate()) );
		}
		
		
		// Saving all countdowns to local browser storage
		localStorage.countdowns = JSON.stringify(this.countdowns);
		localStorage.currentCD = JSON.stringify(this.currentCD);
		
		ProgressBarService.calculateCountdownDisplay();
		StatusBarService.calculateStatusBarText();
		
		// Resetting the height of all markers after progress bar recalculation
		for(var i=0;i<this.countdowns[this.currentCD.index].milestones.length;i++)
		{
			document.getElementById('milestoneMarker' + i).classList.remove("standOutMarker");
			document.getElementById('milestoneLabel' + i).classList.remove("standOutLabel");
		}
		
		RootService.show.configure.window = false;
	}
}

this.addMilestone = function()
{
	var newMilestone = { name: "new milestone", date: new Date() };
	newMilestone.date = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) );
	
	// Up to 10 milestones can be added to a countdown
	if(this.countdowns[this.currentCD.index].milestones.length < 10)
	{
		this.countdowns[this.currentCD.index].milestones.push(newMilestone);
	}
}

this.deleteMilestone = function(index)
{
	if(this.countdowns[this.currentCD.index].milestones.length > 0)
	{
		this.countdowns[this.currentCD.index].milestones.splice(index, 1);
	}
}

// This method checks if all countdown input is correct
this.countdownInputValid = function()
{
	// Creating date variables used to check validity of input
	var startDate = new Date(this.countdowns[this.currentCD.index].startDate);
	startDate = new Date( Date.UTC(new Date(this.countdowns[this.currentCD.index].startDate).getFullYear(), new Date(this.countdowns[this.currentCD.index].startDate).getMonth(), new Date(this.countdowns[this.currentCD.index].startDate).getDate()) );
	
	var endDate = new Date(this.countdowns[this.currentCD.index].endDate);
	endDate = new Date( Date.UTC(new Date(this.countdowns[this.currentCD.index].endDate).getFullYear(), new Date(this.countdowns[this.currentCD.index].endDate).getMonth(), new Date(this.countdowns[this.currentCD.index].endDate).getDate()) );
	
	var currentDate = new Date();
	currentDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) );
	
	var startDatePlus5000Days = new Date(startDate);
	startDatePlus5000Days.setDate(startDatePlus5000Days.getDate() + 5000);
	var currentDateMinus5000Days = new Date(currentDate);
	currentDateMinus5000Days.setDate(currentDateMinus5000Days.getDate() - 5000);
	
	var countdownName = this.countdowns[this.currentCD.index].name;
	var countdownEndMessage = this.countdowns[this.currentCD.index].endMessage;
	
	// Clearing old messages
	this.errors.messages = [];
	
	var isValid = true;
	
	
	// isValid set to false if any constraints violated
	if( !(endDate > startDate) )
	{
		isValid = false;
		this.errors.messages.push({ text: "The end date (" + endDate.toDateString() + ") must come after the start date (" + startDate.toDateString() + ")."});
	}
	
	if( !(endDate <= startDatePlus5000Days) )
	{
		isValid = false;
		this.errors.messages.push({ text: "The end date (" + endDate.toDateString() + ") cannot be more than 5000 days after the start date (" + startDate.toDateString() + ")."});
	}
	
	// Checking the validity of date and name properties of each milestone
	for(var i=0;i<this.countdowns[this.currentCD.index].milestones.length;i++)
	{
		var milestoneDate = new Date(this.countdowns[this.currentCD.index].milestones[i].date);
		milestoneDate = new Date( Date.UTC(new Date(this.countdowns[this.currentCD.index].milestones[i].date).getFullYear(), new Date(this.countdowns[this.currentCD.index].milestones[i].date).getMonth(), new Date(this.countdowns[this.currentCD.index].milestones[i].date).getDate()) );
		
		var milestoneName = this.countdowns[this.currentCD.index].milestones[i].name;
		
		if( !(milestoneDate >= startDate) )
		{
			isValid = false;
			this.errors.messages.push({ text: "Milestone '" + milestoneName + "' date (" + milestoneDate.toDateString() + ") cannot be before start date (" + startDate.toDateString() + ")."});
		}
		
		if( !(milestoneDate <= endDate) && (endDate > startDate) ) // Error message not shown if end <= start as it would be redundant
		{
			isValid = false;
			this.errors.messages.push({ text: "Milestone '" + milestoneName + "' date (" + milestoneDate.toDateString() + ") cannot be after the end date (" + endDate.toDateString() + ")."});
		}
		
		if( !(milestoneName.length <= 100) )
		{
			var pluralS = milestoneName.length == 1 ? "" : "s";
			
			isValid = false;
			this.errors.messages.push({ text: "Milestone '" + milestoneName.substr(0, 100) + "' name cannot be longer than 100 characters, it is currently " + milestoneName.length + " character" + pluralS + " long."});
		}
	}

	if( !(startDate <= currentDate) )
	{
		isValid = false;
		this.errors.messages.push({ text: "The start date (" + startDate.toDateString() + ") cannot come after the current date."});
	}
	
	if( !(startDate >= currentDateMinus5000Days) )
	{
		isValid = false;
		this.errors.messages.push({ text: "The start date (" + startDate.toDateString() + ") cannot be more than 5000 days ago."});
	}
	
	if( !(countdownName.length <= 60) )
	{
		var pluralS = countdownName.length == 1 ? "" : "s";
		
		isValid = false;
		this.errors.messages.push({ text: "Countdown name over 60 character limit (currently " + countdownName.length + " character" + pluralS + "). Choose a shorter name."});
	}
	
	if( !(countdownEndMessage.length <= 60) )
	{
		var pluralS = countdownEndMessage.length == 1 ? "" : "s";
		
		isValid = false;
		this.errors.messages.push({ text: "Countdown end message over 60 character limit (currently " + countdownEndMessage.length + " character" + pluralS + "). Choose a shorter message."});
	}
	
	
	// if any constraints have been violated then the error dialog is populated with messages and displayed
	if(isValid == false)
	{
		
		RootService.show.configure.error = true;
	}
	else // otherwise if all constraints are followed the error dialog is hidden
	{
		RootService.show.configure.error = false;
	}
	
	return isValid;
}

});