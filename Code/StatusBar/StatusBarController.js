milestonesModule.controller("statusbar-controller", function($scope, RootService, SettingsService, StatusBarService)
{
$scope.light = 0;
$scope.dark = 1;

$scope.show = RootService.show;
$scope.theme = SettingsService.theme;

$scope.languages = SettingsService.languages;
$scope.language = SettingsService.language;
$scope.phrases = SettingsService.phrases;

$scope.statusBarText = StatusBarService.statusBarText;

});