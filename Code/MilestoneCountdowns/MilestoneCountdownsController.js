milestonesModule.controller("milestone-countdowns-controller", function($scope, RootService, MilestoneCountdownsService, SettingsService)
{

$scope.languages = SettingsService.languages;
$scope.language = SettingsService.language;
$scope.phrases = SettingsService.phrases;

$scope.countdowns = RootService.countdowns;
$scope.currentCD = RootService.currentCD;

$scope.show = RootService.show;
$scope.theme = SettingsService.theme;

});