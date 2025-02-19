milestonesModule.controller("milestone-countdowns-controller", function($scope, RootService, MilestoneCountdownsService, SettingsService)
{

$scope.languages = SettingsService.languages;
$scope.language = SettingsService.language;
$scope.phrases = SettingsService.phrases;

$scope.countdowns = RootService.countdowns;
$scope.currentCD = RootService.currentCD;

$scope.show = RootService.show;
$scope.theme = SettingsService.theme;

// Pane UI will be made wider if the language is Portuguese, Italian, or Russian so the title fits
$scope.makePaneWiderForLang = function()
{
	if(SettingsService.language.value.index == SettingsService.languages.Portugues.index ||
	   SettingsService.language.value.index == SettingsService.languages.Italiano.index ||
	   SettingsService.language.value.index == SettingsService.languages.Russkiy.index)
	{
		return true;
	}
	
	return false;
}

});