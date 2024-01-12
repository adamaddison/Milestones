milestonesModule.service("StatusBarService", function(RootService, SettingsService)
{

this.countdowns = RootService.countdowns;
this.currentCD = RootService.currentCD;

this.statusBarText = { value: "" };

this.calculateStatusBarText = function(index = -1)
{
	var currentDate = new Date();
	currentDate.setUTCHours(0, 0, 0, 0);
	currentDate.setFullYear(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
	
	var milestones = this.countdowns[this.currentCD.index].milestones;
	
	// If no milestone is selected then days since start + days to next milestone are displayed
	if(index == -1)
	{
		var startDate = this.countdowns[this.currentCD.index].startDate;
		var endDate = this.countdowns[this.currentCD.index].endDate;
		
		// Calculating days since start of countdown and adding this to the status bar text
		var daysSinceStart = (currentDate - startDate)/86400000;
		this.statusBarText.value = daysSinceStart + " " + (daysSinceStart == 1 ? SettingsService.phrases.value.Day : SettingsService.phrases.value.Days) + " " + SettingsService.phrases.value.sinceStart
		
		// These variables hold the name and date of the next soonest milestone that happens in the future
		var nextSoonestMilestoneName = -1;
		var nextSoonestMilestoneDate = -1;
		
		// Initialising the next soonest milestone name and date with a milestone that happens in the future
		for(var i=0;i<milestones.length;i++)
		{ 	
			if(milestones[i].date > currentDate)
			{
				var nextSoonestMilestoneName = milestones[i].name;
				var nextSoonestMilestoneDate = milestones[i].date;
			}
		}
		
		 // Something will only be displayed if a future milestone was found (the name will be -1 if no future milestones were found)
		if(nextSoonestMilestoneName != -1)
		{
			// Going through every milestone and searching for the one that has the smallest date value (while still also happening in the future)
			for(var i=0;i<milestones.length;i++)
			{
				// if the current milestone has a smaller date value and has not yet been reached then it is assigned as the new soonest milestone
				if(milestones[i].date < nextSoonestMilestoneDate && milestones[i].date > currentDate)
				{
					nextSoonestMilestoneName = milestones[i].name;
					nextSoonestMilestoneDate = milestones[i].date;	
				}
			}
			
			var daysUntilMilestone = (nextSoonestMilestoneDate - currentDate)/86400000;
			
			this.statusBarText.value = this.statusBarText.value + " - " + daysUntilMilestone + " " + (daysUntilMilestone == 1 ? SettingsService.phrases.value.Day : SettingsService.phrases.value.Days) + " " +SettingsService.phrases.value.remainingUntil + " " + nextSoonestMilestoneName
		}
		
		// If the progress bar is at a milestone then that is indicated in the status bar text
		for(var i=0;i<milestones.length;i++)
		{	
			if(milestones[i].date.getTime() == currentDate.getTime())
			{
				this.statusBarText.value = this.statusBarText.value + " - " + milestones[i].name + " " + SettingsService.phrases.value.Completed;
			}
		}
	}
	// If a milestone is selected then days until selected milestone is displayed
	else if(index >= 0)
	{
		var milestone = this.countdowns[this.currentCD.index].milestones[index];
		
		var daysUntilMilestone = (milestone.date - currentDate)/86400000;
		
		if(daysUntilMilestone > 0)
		{
			this.statusBarText.value = daysUntilMilestone + " " + (daysUntilMilestone == 1 ? SettingsService.phrases.value.Day : SettingsService.phrases.value.Days) + " " + SettingsService.phrases.value.remainingUntil + " " + milestone.name;
		}
		// If milestone is reached then <milestone name> Completed is returned
		else
		{
			this.statusBarText.value = milestone.name + ": " + SettingsService.phrases.value.Completed;
		}
	}
}
this.calculateStatusBarText();

});