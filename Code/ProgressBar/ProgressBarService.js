milestonesModule.service("ProgressBarService", function(RootService, SettingsService, StatusBarService)
{
this.countdowns = RootService.countdowns;
this.currentCD = RootService.currentCD;
this.percentageLabel = { value: 0 };
this.countdownTimeRemainingText = { value: "" };

// These variables indicate to the controller that the countdown has ended and / or a milestone has been reached which affects the progress bar colour
this.countdownEnded = { value: false };
this.reachedMilestone = { value: false };


this.calculateMilestoneLabel = function(index)
{
	var startDate = this.countdowns[this.currentCD.index].startDate;
	var endDate = this.countdowns[this.currentCD.index].endDate;
	var milestoneDate = this.countdowns[this.currentCD.index].milestones[index].date;
	
	// By default each milestone marker on the progress bar will display X% (percentage until end date)
	if(SettingsService.markerIsPercentage() && endDate > startDate)
	{	
		// Calculating the milestone percentage and rounding it to one decimal point for presentation
		var milestonePercentage = ((milestoneDate - startDate) / (endDate - startDate)) * 100;
		milestonePercentage = Math.round(milestonePercentage * 10) / 10;
		
		return (milestonePercentage + "%");
	}
	// If the user has set the format to day number then each milestone marker will display Day X
	else if(SettingsService.markerIsNumber())
	{
		return SettingsService.phrases.value.Day + " " + (milestoneDate - startDate)/86400000;
	}
	// If the user has set the format to date then each milestone marker will display the date the milestone is reached
	else if(SettingsService.markerIsDate())
	{	
		return (milestoneDate.getDate() + "/" + (milestoneDate.getMonth()+1) + "/" + milestoneDate.getFullYear());
	}
	// If the user has set the format to name then each milestone marker will display the milestone name
	else if(SettingsService.markerIsName())
	{
		// If milestone name is empty return milestone X instead of empty string
		if(this.countdowns[this.currentCD.index].milestones[index].name.length == 0)
		{
			return "milestone " + (index + 1);
		}
		else
		{
			return this.countdowns[this.currentCD.index].milestones[index].name;
		}
	}
	
	// If non of the above values are provided then the day number is used by default in order to prevent a divide by zero error if endDate == startDate
	return SettingsService.phrases.value.Day + " " + (milestoneDate - startDate)/86400000;
}

this.calculateDaysRemainingText = function(remainingDays)
{
	return remainingDays == 1 ? remainingDays + " " + SettingsService.phrases.value.Day : remainingDays + " " + SettingsService.phrases.value.Days;
}

this.calculateWeeksRemainingText = function(remainingDays)
{
	if(remainingDays < 7)
	{
		return this.calculateDaysRemainingText(remainingDays);
	}
	else
	{
		var numberOfWeeks = Math.floor(remainingDays / 7); // number of whole weeks
		var numberOfDays = remainingDays % 7;		     // remaining days if any
		
		var message = numberOfWeeks == 1 ? numberOfWeeks + " " + SettingsService.phrases.value.Week : numberOfWeeks + " " + SettingsService.phrases.value.Weeks;
		
		// If there are no remaining days after the weeks then message is returned as it is
		if(numberOfDays == 0){ return message; }
		// Otherwise X days(s) remaining message is appended
		else
		{
			message = numberOfDays == 1 ? message + ", " + numberOfDays + " " + SettingsService.phrases.value.Day : message + ", " + numberOfDays + " " + SettingsService.phrases.value.Days;
		}
		
		return message;
	}
}

// This function calculates the countdown text above the progress that says X Months / Weeks / Days remaining etc
this.calculateTimeRemainingText = function()
{
	var startDate = this.countdowns[this.currentCD.index].startDate;
	var endDate = this.countdowns[this.currentCD.index].endDate;
	var currentDate = new Date();
	currentDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) );

	var countdown = this.countdowns[this.currentCD.index];
	var remainingDays = (endDate - currentDate)/86400000;
	
	// If the end date is before the current date then the time remaining text is capped at 0 days remaining
	if(remainingDays < 0)
	{
		this.countdownTimeRemainingText.value = "0 " + SettingsService.phrases.value.Days;
	}
	// If end date >= current date the appropriate time remaining text is calculated based on settings
	else
	{
		// Calculating remaining DAYS until end date
		if(SettingsService.timeIsDays())
		{	
			this.countdownTimeRemainingText.value = this.calculateDaysRemainingText(remainingDays);
		}
		// Calculating remaining WEEKS and DAYS until end date
		else if(SettingsService.timeIsWeeks())
		{
			this.countdownTimeRemainingText.value = this.calculateWeeksRemainingText(remainingDays);
		}
		// Calculating remaining MONTHS WEEKS and DAYS until end date
		else if(SettingsService.timeIsMonths())
		{
			if(remainingDays < 30)
			{
				this.countdownTimeRemainingText.value = this.calculateWeeksRemainingText(remainingDays);
			}
			else
			{
				var numberOfMonths = Math.floor(remainingDays / 30); // number of whole months
					var daysRemainder = remainingDays % 30;	// calculating the number of days left after you remove all months
				var numberOfWeeks = Math.floor(daysRemainder/7);	// weeks remaining
				var numberOfDays = daysRemainder%7;			// days remaining
				
				var message = numberOfMonths == 1 ? numberOfMonths + " " + SettingsService.phrases.value.Month : numberOfMonths + " " + SettingsService.phrases.value.Months;
				
				if(numberOfWeeks != 0)
				{
					message = numberOfWeeks == 1 ? message + ", " + numberOfWeeks + " " + SettingsService.phrases.value.Week : message + ", " + numberOfWeeks + " " + SettingsService.phrases.value.Weeks;
				}
				
				if(numberOfDays != 0)
				{
					message = numberOfDays == 1 ? message + ", " + numberOfDays + " " + SettingsService.phrases.value.Day : message + ", " + numberOfDays + " " + SettingsService.phrases.value.Days;
				}
				
				this.countdownTimeRemainingText.value = message;
			}
		}
		// Calculating remaining MONTHS and DAYS until end date
		else if(SettingsService.timeIsMonthDays())
		{
			if(remainingDays < 30)
			{
				this.countdownTimeRemainingText.value = this.calculateDaysRemainingText(remainingDays);
			}
			else
			{
				var numberOfMonths = Math.floor(remainingDays / 30); // number of whole months
				var numberOfDays = remainingDays % 30;	// calculating the number of days left after you remove all months
				
				var message = numberOfMonths == 1 ? numberOfMonths + " " + SettingsService.phrases.value.Month : numberOfMonths + " " + SettingsService.phrases.value.Months;
				
				if(numberOfDays != 0)
				{
					message = numberOfDays == 1 ? message + ", " + numberOfDays + " " + SettingsService.phrases.value.Day : message + ", " + numberOfDays + " " + SettingsService.phrases.value.Days;
				}
				
				this.countdownTimeRemainingText.value = message;
			}
		}
	}
	
	// If the user has entered a valid name for the countdown then this will be displayed in the time remaining text
	if(countdown.name != "")
	{
		this.countdownTimeRemainingText.value = this.countdownTimeRemainingText.value + " " + SettingsService.phrases.value.remainingUntil + " " + countdown.name;
	}
	else 	// Otherwise only the word "remaining" is displayed at the end of the countdown message
	{
		this.countdownTimeRemainingText.value = this.countdownTimeRemainingText.value + " " + SettingsService.phrases.value.Remaining;
	}
	
	// If the countdown has ended and the user has entered a valid end message then it will be displayed in place of the time remaining text
	if(remainingDays < 1 && countdown.endMessage != "")
	{
		this.countdownTimeRemainingText.value = countdown.endMessage;
	}
}

this.calculateCountdownDisplay = function()
{	
	var startDate = this.countdowns[this.currentCD.index].startDate;
	var endDate = this.countdowns[this.currentCD.index].endDate;
	var currentDate = new Date();
	console.log(currentDate.toUTCString());
	currentDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) );
	console.log(currentDate.toUTCString());
	
	// Calculating progress bar length and percentage label
	var progressBarLength = ((currentDate - startDate) / (endDate - startDate)) * 100;
	document.getElementById('innerProgressBar').style.width = progressBarLength + "%";
	// rounding down to one decimal place for the percentage label value
	this.percentageLabel.value = Math.round(progressBarLength * 10) / 10;

	// These values indicate when either the countdown has ended and / or a milestone is reached so that the progress bar turns green / blue
	this.reachedMilestone.value = false;
	this.countdownEnded.value = false;
	
	// If the progress bar has reached the end of the countdown the progress bar will turn green
	if(progressBarLength == 100)
	{
		this.countdownEnded.value = true;
	}
	
	// If the end date comes after the current date then the progress bar is capped at 100%
	if(progressBarLength > 100)
	{
		this.countdownEnded.value = true;
		
		// Progress bar graphic and percentage label capped at 100%
		document.getElementById('innerProgressBar').style.width = "100%";
		this.percentageLabel.value = 100;
	}
	
	// Hiding all 10 milestone markers and labels before displaying the milestone values on them
	var allMarkerHTML = document.getElementsByClassName('milestoneMarker');
	var allLabelHTML = document.getElementsByClassName('milestoneLabel');
	for(var i=0;i<allMarkerHTML.length;i++)
	{
		allMarkerHTML[i].style.display = "none";
		allLabelHTML[i].style.display = "none";
	}
	
	// Calculating the milestone marker positions and label text
	for(var i=0;i<this.countdowns[this.currentCD.index].milestones.length;i++)
	{
		var milestoneDate = this.countdowns[this.currentCD.index].milestones[i].date;
		
		// Positioning marker line
		var leftOffset = ((milestoneDate - startDate) / (endDate - startDate)) * 100;
		document.getElementById('milestoneMarker'+i).style.left = leftOffset + "%";
		document.getElementById('milestoneMarker'+i).style.display = "block";
		
		// Positioning marker text label
		document.getElementById('milestoneLabel'+i).style.left = leftOffset + "%";
		document.getElementById('milestoneLabel'+i).style.display = "block";
		
		// Filling milestone labels with either the milestone percentage, date, or day number
		document.getElementById('milestoneLabel'+i).innerHTML = this.calculateMilestoneLabel(i);
		
		// If the progress bar has reached a milestone marker then it will turn blue
		if(progressBarLength == leftOffset)
		{
			this.reachedMilestone.value = true;
		}
	}
	
	// Calculating the time remaining text
	this.calculateTimeRemainingText();

}
this.calculateCountdownDisplay();


this.selectMilestone = function(index)
{
	var milestones = this.countdowns[this.currentCD.index].milestones;
	
	// Do nothing if milestone index out of bounds
	if(index < 0 || index >= milestones.length){ return; }
	

	// Retrieving the corresponding milestone label and marker HTML elements to be modified
	var labelMarker = document.getElementById("milestoneMarker" + index); // This is the line that connects to the label
	var labelText = document.getElementById("milestoneLabel" + index);	 // This is the label that contains the milestone day
	var selected = labelMarker.classList.contains("standOutMarker");

	// Resetting the height of all markers before moving the selected marker
	for(var i=0;i<milestones.length;i++)
	{
		document.getElementById('milestoneMarker' + i).classList.remove("standOutMarker");
		document.getElementById('milestoneLabel' + i).classList.remove("standOutLabel");
	}
	
	// If the milestone is not selected then classes are added to the milestone marker and label HTML to make them drop down (and therefore standout)
	if(!selected)
	{
		labelMarker.classList.add("standOutMarker");
		labelText.classList.add("standOutLabel");
		
		// Displaying days until milestone in status bar
		StatusBarService.calculateStatusBarText(index);
	}
	// If the milestone is already selected this is reversed
	else
	{
		labelMarker.classList.remove("standOutMarker");
		labelText.classList.remove("standOutLabel");
		
		// Displaying default status bar text now that milestone is deselected
		StatusBarService.calculateStatusBarText(-1);
	}
}

});