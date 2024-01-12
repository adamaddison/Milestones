milestonesModule.controller("progressbar-controller", function($scope, RootService, ConfigureService, SettingsService, ProgressBarService, MilestoneCountdownsService)
{

$scope.show = RootService.show;
$scope.countdowns = RootService.countdowns;
$scope.currentCD = RootService.currentCD;

$scope.light = 0;
$scope.dark = 1;
$scope.theme = SettingsService.theme;

$scope.formats = SettingsService.formats;
$scope.format = SettingsService.format;

$scope.percentageLabel = ProgressBarService.percentageLabel;
$scope.countdownTimeRemainingText = ProgressBarService.countdownTimeRemainingText;

$scope.countdownEnded = ProgressBarService.countdownEnded;
$scope.reachedMilestone = ProgressBarService.reachedMilestone;

$scope.showMilestoneCountdowns = function()
{
	MilestoneCountdownsService.calculateMilestoneCountdowns();
	$scope.show.milestoneCountdowns = true;
}

$scope.selectMilestone = function(index)
{
	ProgressBarService.selectMilestone(index);
}

});