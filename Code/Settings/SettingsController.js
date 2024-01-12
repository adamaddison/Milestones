milestonesModule.controller("settings-controller", function($scope, RootService, SettingsService, ConfigureService)
{

$scope.show = RootService.show;
$scope.icons = RootService.icons;

$scope.languages = SettingsService.languages;
$scope.language = SettingsService.language;
$scope.phrases = SettingsService.phrases;

$scope.changeLanguage = function(language)
{
	console.log("before sc: " + $scope.language.value.text);
	SettingsService.changeLanguage(language);
	console.log("after sc: " + $scope.language.value.text);
}

$scope.formats = SettingsService.formats;
$scope.format = SettingsService.format;

$scope.themeTick = "Icons/tickedTheme.svg";
$scope.themeNoTick = "Icons/untickedTheme.svg";
$scope.on = "Icons/toggleOn.svg";
$scope.off = "Icons/toggleOff.svg";

$scope.light = 0;
$scope.dark = 1;
$scope.theme = SettingsService.theme;
$scope.autoThemeSetting = SettingsService.autoThemeSetting;
$scope.initialiseTheme = function()
{
	SettingsService.initialiseTheme();
}

$scope.background = SettingsService.background;
$scope.backgrounds = SettingsService.backgrounds;
$scope.customBgThumbnailPlaceholder = "Icons/customBackgroundThumbnailPlaceholder.svg";
$scope.customBackgroundImage = SettingsService.customBackgroundImage;
$scope.changeBackground = function(backgroundURL)
{
	SettingsService.changeBackground(backgroundURL);
}
$scope.initialiseBackground = function()
{
	SettingsService.initialiseBackground();
}

$scope.saveSettings = function()
{
	SettingsService.saveSettings();
}

$scope.resetSettings = function()
{
	SettingsService.resetSettings();
}

$scope.resetToYear = function()
{
	SettingsService.resetToYear();

	ConfigureService.saveCountdownsToStorage();
	$scope.show.settings.resetToYear = false;
}

$scope.resetValues = function()
{
	SettingsService.resetValues();
	
	ConfigureService.saveCountdownsToStorage();
	$scope.show.settings.resetValues = false;
}


});