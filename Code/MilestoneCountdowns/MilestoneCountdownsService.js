milestonesModule.service("MilestoneCountdownsService", function(RootService, SettingsService)
{

this.countdowns = RootService.countdowns;
this.currentCD = RootService.currentCD;

this.calculateMilestoneCountdowns = function()
{
	var startDate = this.countdowns[this.currentCD.index].startDate;
	var endDate = this.countdowns[this.currentCD.index].endDate;
	var currentDate = new Date();
	currentDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) );
	
	var milestones = this.countdowns[this.currentCD.index].milestones;
	
	// Calculating and displaying the progress and days remaining until each milestone in the countdown
	for(var i=0;i<milestones.length;i++)
	{
		// Percentage only calculated if there is > 0 days difference to prevent a divide by zero error
		var progressBarPercentage = 0;
		if( (milestones[i].date - startDate) != 0)
		{
			progressBarPercentage = ((currentDate - startDate) / (milestones[i].date - startDate)) * 100;
		}
		var remainingDaysUntilMilestone = (milestones[i].date - currentDate)/86400000;
		
		if(remainingDaysUntilMilestone > 0)
		{
			document.getElementById('milestone'+i+'Name').innerHTML = milestones[i].name.length == 0 ? "milestone " + (i+1) : milestones[i].name;
			document.getElementById('daysUntilMilestone'+i).innerHTML = remainingDaysUntilMilestone == 1 ? remainingDaysUntilMilestone + " " + SettingsService.phrases.value.Day : remainingDaysUntilMilestone + " " + SettingsService.phrases.value.Days;
			document.getElementById('milestone'+i+'ProgressBar').style.width = progressBarPercentage + "%";
		}
		// If remaining days until milestone is 0 or less the progress bar is capped at 100%
		else
		{
			document.getElementById('milestone'+i+'Name').innerHTML = milestones[i].name.length == 0 ? "milestone " + (i+1) : milestones[i].name;
			document.getElementById('daysUntilMilestone'+i).innerHTML = SettingsService.phrases.value.Completed;
			document.getElementById('milestone'+i+'ProgressBar').style.width = "100%";
		}
	}
}

});