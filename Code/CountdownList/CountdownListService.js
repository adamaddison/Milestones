milestonesModule.service("CountdownListService", function(RootService, ConfigureService)
{

this.countdowns = RootService.countdowns;
this.currentCD = RootService.currentCD;

this.show = RootService.show;

this.switchCountdown = function(newIndex)
{
	if(newIndex >= 0 && newIndex < this.countdowns.length)
	{
		this.currentCD.index = newIndex;
		ConfigureService.saveCountdownsToStorage();
		
		this.show.countdownList.window = false;
		this.show.milestoneCountdowns = false;
	}
}

this.addCountdown = function()
{
	if(this.countdowns.length < 10)
	{
		// Creating new countdown object with default values
		var newCountdown =
		{
			startDate: new Date(),
			endDate: new Date(),
			endMessage: "",
			name: "",
			milestones: [{ name: "new milestone", date: new Date() }]
		};
		
		// Initialising date values and setting to 0000 UTC
		newCountdown.endDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 10) );
		newCountdown.startDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) );
		newCountdown.milestones[0].date = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) );
		
		// Adding countdown object to overall array
		this.countdowns.push(newCountdown);
		
		// Switching to newly created countdown
		this.switchCountdown(this.countdowns.length-1);
	}
}

this.deleteCountdown = function(index)
{
	// Selected countdown only deleted if there is more than one countdown
	if(this.countdowns.length > 1)
	{
		this.countdowns.splice(index, 1);
		
		this.show.countdownList.confirmDelete = false;
		
		// Switching to first countdown after deletion
		this.switchCountdown(0);
	}
}

});