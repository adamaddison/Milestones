milestonesModule.controller("countdown-list-controller", function($scope, RootService, SettingsService, CountdownListService)
{

$scope.light = 0;
$scope.dark = 1;

$scope.countdowns = RootService.countdowns;
$scope.currentCD = RootService.currentCD;

$scope.show = RootService.show;
$scope.theme = SettingsService.theme;

$scope.plus = "Icons/plus.svg";
$scope.plusDisabled = "Icons/plusGreyedOut.svg";

$scope.countdownToDelete = { index: 0 };

$scope.importCountdownText = RootService.importCountdownText;
$scope.importError = RootService.importError;
$scope.importValueErrors = RootService.importValueErrors;

$scope.switchCountdown = function(index)
{
	CountdownListService.switchCountdown(index);
}

$scope.addCountdown = function(yearToYear = false)
{
	CountdownListService.addCountdown(yearToYear);
}

$scope.deleteCountdown = function()
{
	CountdownListService.deleteCountdown($scope.countdownToDelete.index);
}

$scope.importCountdown = function()
{
	var imported = RootService.importCountdown();
	if(imported)
	{
		// Switching to newly imported countdown if import successful
		CountdownListService.switchCountdown($scope.countdowns.length-1);
	}
}

});