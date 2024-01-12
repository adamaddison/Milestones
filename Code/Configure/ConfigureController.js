milestonesModule.controller("configure-controller", function($scope, RootService, ConfigureService, SettingsService)
{

$scope.light = 0;
$scope.dark = 1;

$scope.show = RootService.show;
$scope.theme = SettingsService.theme;

$scope.countdowns = RootService.countdowns;
$scope.currentCD = RootService.currentCD;

$scope.errors = ConfigureService.errors;

$scope.countdownExportText = RootService.countdownExportText;


$scope.saveCountdown = function()
{	
	ConfigureService.saveCountdownsToStorage();
}

$scope.addMilestone = function()
{
	ConfigureService.addMilestone();
}

$scope.deleteMilestone = function(index)
{
	ConfigureService.deleteMilestone(index);
}

$scope.exportCountdown = function()
{
	RootService.exportCountdown();
	$scope.show.exportCountdown = true;
}

});