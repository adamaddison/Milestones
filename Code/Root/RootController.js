milestonesModule.controller("root-controller", function($scope, RootService, SettingsService)
{

$scope.light = 0;
$scope.dark = 1;
$scope.theme = SettingsService.theme;

$scope.show = RootService.show;

});