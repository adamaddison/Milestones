milestonesModule.service("SettingsService", function(RootService)
{

this.countdowns = RootService.countdowns;
this.currentCD = RootService.currentCD;

// variable and values for language
this.languages =
{
	English: { index: 0, text: "English"},
	Francais: { index: 1, text: "Francais"},
	Deutsch: { index: 2, text: "Deutsch"},
	Espanol: { index: 3, text: "Español"},
	Portugues: { index: 4, text: "Português"},
	Italiano: { index: 5, text: "Italiano"}
}
this.language = { value: this.languages.English };
if(localStorage.language !== undefined){ this.language = JSON.parse(localStorage.language); }
var englishPhrases = 
{
	Days: "Days",
	Day: "Day",
	Weeks: "Weeks",
	Week: "Week",
	Months: "Months",
	Month: "Month",
	Remaining: "Remaining",
	remainingUntil: "Remaining Until",
	Completed: "Completed",
	sinceStart: "since start",
	milestoneCountdowns: "Milestone Countdowns",
	statusBarMessage: "Status Bar Message",
	milestonesCompletedToday: "Milestones Completed Today"
}
var frenchPhrases = 
{
	Days: "Jours",
	Day: "Jour",
	Weeks: "Semaines",
	Week: "Semaine",
	Months: "Mois",
	Month: "Mois",
	Remaining: "Restant",
	remainingUntil: "Restant Jusqu'à",
	Completed: "Terminé",
	sinceStart: "depuis le début",
	milestoneCountdowns: "Comptes à rebours d'jalon",
	statusBarMessage: "Message de la Barre d'État",
	milestonesCompletedToday: "Jalons Terminées Aujourd'hui"
}
var germanPhrases = 
{
	Days: "Tage",
	Day: "Tag",
	Weeks: "Wochen",
	Week: "Woche",
	Months: "Monate",
	Month: "Monat",
	Remaining: "Verbleibende",
	remainingUntil: "Verbleibende Bis",
	Completed: "Abgeschlossen",
	sinceStart: "seit dem start",
	milestoneCountdowns: "Meilenstein Countdowns",
	statusBarMessage: "Statusleiste Meldung",
	milestonesCompletedToday: "Meilensteine Heute Abgeschlossen"
}
var spanishPhrases = 
{
	Days: "Días",
	Day: "Día",
	Weeks: "Semanas",
	Week: "Semana",
	Months: "Meses",
	Month: "Mes",
	Remaining: "Restantes",
	remainingUntil: "Restantes Hasta",
	Completed: "Terminado",
	sinceStart: "desde el comienzo",
	milestoneCountdowns: "Cuenta atrás de hitos",
	statusBarMessage: "Mensaje de la Barra de Estado",
	milestonesCompletedToday: "Hitos Terminado Hoy"
}
var portuguesePhrases = 
{
	Days: "Dias",
	Day: "Dia",
	Weeks: "Semanas",
	Week: "Semana",
	Months: "Meses",
	Month: "Mês",
	Remaining: "Restantes",
	remainingUntil: "Restantes até",
	Completed: "Concluído",
	sinceStart: "desde o começo",
	milestoneCountdowns: "Contagem regressiva de marco",
	statusBarMessage: "Mensagem da Barra de Status",
	milestonesCompletedToday: "Marcos Concluídos Hoje"
}
var italianPhrases = 
{
	Days: "Giorni",
	Day: "Giorno",
	Weeks: "Settimane",
	Week: "Settimana",
	Months: "Mesi",
	Month: "Mese",
	Remaining: "Rimanenti",
	remainingUntil: "Rimanenti fino a",
	Completed: "Completato",
	sinceStart: "dall'inizio",
	milestoneCountdowns: "Conto alla rovescia pietra miliare",
	statusBarMessage: "Messaggio Nella Barra di Stato",
	milestonesCompletedToday: "Pietra Miliares Completati Oggi"
}

// Initialising the phrases object to the correct language (this is used to display the same messages in the selected language)
this.phrases = {value: englishPhrases};
if(this.language.value.index == this.languages.English.index)
{
	this.phrases = {value: englishPhrases};
}
else if(this.language.value.index == this.languages.Francais.index)
{
	this.phrases = {value: frenchPhrases};
}
else if(this.language.value.index == this.languages.Deutsch.index)
{
	this.phrases = {value: germanPhrases};
}
else if(this.language.value.index == this.languages.Espanol.index)
{
	this.phrases = {value: spanishPhrases};
}
else if(this.language.value.index == this.languages.Portugues.index)
{
	this.phrases = {value: portuguesePhrases};
}
else if(this.language.value.index == this.languages.Italiano.index)
{
	this.phrases = {value: italianPhrases};
}


// variable and values for time remaining and milestone marker formats
this.formats = 
{
	time:
	{
		days: {index: 0, text: "Days"},
		weeks: {index: 1, text: "Weeks and Days"},
		months: {index: 2, text: "Months, Weeks, and Days"},
		monthsdays: {index: 3, text: "Months and Days"}
	},
	marker:
	{
		percentage: {index: 0, text: "Percentage"},
		number: {index: 1, text: "Day Number"},
		date: {index: 2, text: "Date"},
		name: {index: 3, text: "Name"}
	}
};
this.format =
{
	time: this.formats.time.days,
	marker: this.formats.marker.percentage
};
if(localStorage.format !== undefined){ this.format = JSON.parse(localStorage.format); }

// variable and values for theme
this.light = 0;
this.dark = 1;
this.theme = { value: this.light };
if(localStorage.theme !== undefined && JSON.parse(localStorage.theme).value !== undefined){ this.theme = JSON.parse(localStorage.theme); } // contains the current theme
// Initialising the theme if auto theme mode is on
this.autoThemeSetting = { value: false };
if(localStorage.autoThemeSetting !== undefined){ this.autoThemeSetting = JSON.parse(localStorage.autoThemeSetting); }
// variable and values for light mode and dark mode backgrounds
this.backgrounds =
{
	default: "default",
	boatHouse: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Herrsching_am_Ammersee_Bootshaus_351.jpg",
	oldBuilding: "https://upload.wikimedia.org/wikipedia/commons/5/57/Building_in_Floyd_Bennett_Field_%2840715h%29.jpg",
	londonEye: "https://upload.wikimedia.org/wikipedia/commons/6/6c/London_Eye_at_night_2.jpg",
	canal: "https://upload.wikimedia.org/wikipedia/commons/6/66/Bamberg_Bavaria_80_.jpg",
	skiResort: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Gunzesried_Bavaria_Germany_Konraedler-Hof-01.jpg",
	houses: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Thurnau%2C_Marktplatz_10%2C_006.jpg",
	custom: "custom"
};
this.customBackgroundImage = { value: "" };
if(localStorage.customBackgroundImage !== undefined){ this.customBackgroundImage.value = localStorage.customBackgroundImage; }
this.background = { light: this.backgrounds.default, dark: this.backgrounds.default }; // contains the current background
if(localStorage.background !== undefined){ this.background = JSON.parse(localStorage.background); }


// This function changes the background to either a default white / black colour, a preset image URL, or custom image URL
this.changeBackground = function(backgroundURL)
{
	// Assigning the backgroundURL to the light / dark mode background property as appropriate
	if(RootService.show.settings.backgrounds.light)
	{
		this.background.light = backgroundURL;
	}
	if(RootService.show.settings.backgrounds.dark)
	{
		this.background.dark = backgroundURL;
	}
	
	// If the light mode background is being modified and the current theme is light the current background on display is updated	
	if(RootService.show.settings.backgrounds.light)
	{
		if(this.theme.value == this.light && backgroundURL == this.backgrounds.default)
		{
			document.body.style.backgroundImage = "none";
			document.body.style.backgroundColor = "white";
		}
		else if((this.theme.value == this.light || this.background.dark == this.backgrounds.custom) && backgroundURL == this.backgrounds.custom)
		{
			document.body.style.backgroundImage = 'url(' + this.customBackgroundImage.value + ')';
		}
		else if(this.theme.value == this.light)
		{
			document.body.style.backgroundImage = 'url(' + backgroundURL + ')';
		}
	}
	// If the dark mode background is being modified and the current theme is dark the current background on display is updated	
	else if(RootService.show.settings.backgrounds.dark)
	{
		if(this.theme.value == this.dark && backgroundURL == this.backgrounds.default)
		{
			document.body.style.backgroundImage = "none";
			document.body.style.backgroundColor = "black";
		}
		else if((this.theme.value == this.dark || this.background.light == this.backgrounds.custom) && backgroundURL == this.backgrounds.custom)
		{
			document.body.style.backgroundImage = 'url(' + this.customBackgroundImage.value + ')';
		}
		else if(this.theme.value == this.dark)
		{
			document.body.style.backgroundImage = 'url(' + backgroundURL + ')';
		}
	}
	
	// Saving the custom background image if it has been set
	localStorage.customBackgroundImage = this.customBackgroundImage.value;
	
	// Hiding backgrounds pane
	RootService.show.settings.backgrounds.light = false;
	RootService.show.settings.backgrounds.dark = false;
}

// This function initialises the theme on load to the correct value if auto theme is enabled
this.initialiseTheme = function()
{
	// Automatically setting the theme to dark or light depending on the time of day if auto theme is enabled
	if(this.autoThemeSetting.value)
	{
		// Creating variables to represent the hours 18:00, 00:00, and 06:00, as well as the current time
		var currentTime = new Date();
		var evening = new Date();
		    evening.setHours(18, 0, 0);
		var morning = new Date();
		    morning.setHours(6, 0, 0);
		var midnight = new Date();
		    midnight.setHours(0, 0, 0);
			
		// This boolean represents if the current time is between 00:00 - 06:00
		var midnightToMorning = (currentTime.getHours() >= midnight.getHours() && currentTime.getHours() < morning.getHours());
		
		// This boolean represents if the current time is between 18:00 - 00:00
		var eveningToMidnight = (currentTime.getHours() >= evening.getHours() && currentTime.getHours() < 24);
			
		// It will set the theme to dark mode if the time is between 18:00 - 06:00
		if(eveningToMidnight || midnightToMorning)
		{
			this.theme.value = this.dark;
		}
		// Otherwise if the time is between 06:00 - 18:00 light mode is used
		else
		{
			this.theme.value = this.light;
		}
	}
}
this.initialiseTheme();

// This function sets the current light / dark mode background in the body element during start up and when the theme is changed
this.initialiseBackground = function()
{	
	// Initialising the current background (depending on theme)
	if(this.theme.value == this.light)
	{
		RootService.show.settings.backgrounds.light = true;
		this.changeBackground(this.background.light);
	}
	else
	{
		RootService.show.settings.backgrounds.dark = true;
		this.changeBackground(this.background.dark);
	}
}
this.initialiseBackground();


// Changes language variable to another languages value and also changes the value of phrases variable
this.changeLanguage = function(language)
{
	switch(language)
	{
		case this.languages.English.index: this.phrases.value = englishPhrases; this.language.value = this.languages.English; break;
		case this.languages.Francais.index: this.phrases.value = frenchPhrases; this.language.value = this.languages.Francais; break;
		case this.languages.Deutsch.index: this.phrases.value = germanPhrases; this.language.value = this.languages.Deutsch; break;
		case this.languages.Espanol.index: this.phrases.value = spanishPhrases; this.language.value = this.languages.Espanol; break;
		case this.languages.Portugues.index: this.phrases.value = portuguesePhrases; this.language.value = this.languages.Portugues; break;
		case this.languages.Italiano.index: this.phrases.value = italianPhrases; this.language.value = this.languages.Italiano; break;
	}
	
	RootService.show.settings.languages = false;
}

// This saves all settings variables to HTML local storage so that they persist between sessions
this.saveSettings = function(hideSettings = true)
{
	localStorage.format = JSON.stringify(this.format);
	localStorage.customBackgroundImage = this.customBackgroundImage.value;
	localStorage.background = JSON.stringify(this.background);
	localStorage.theme = JSON.stringify(this.theme);
	localStorage.autoThemeSetting = JSON.stringify(this.autoThemeSetting);
	localStorage.language = JSON.stringify(this.language);
	
	if(hideSettings)
	{
		RootService.show.settings.window = false;
		RootService.show.configure.window = true;
	}
}

// This function resets all settings back to their default values
this.resetSettings = function()
{
	this.format.time = this.formats.time.days;
	this.format.marker = this.formats.marker.percentage;
	this.background.light = this.backgrounds.default;
	this.background.dark = this.backgrounds.default;
	this.customBackgroundImage.value = "";
	this.theme.value = this.light;
	this.autoThemeSetting.value = false;
	this.changeLanguage(this.languages.English.index);
	
	this.saveSettings(false);
	
	RootService.show.settings.resetSettings = false;
	
	this.initialiseBackground();
}

// This function resets all countdown and milestone values back to their defaults
this.resetValues = function()
{
	this.countdowns[this.currentCD.index].startDate = new Date();
	this.countdowns[this.currentCD.index].startDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) );
	
	this.countdowns[this.currentCD.index].endDate = new Date();
	this.countdowns[this.currentCD.index].endDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 10) );
	
	this.countdowns[this.currentCD.index].name = "";
	this.countdowns[this.currentCD.index].endMessage = "";
	
	// Resetting name and date values of all milestones back to default
	for(var i=0;i<this.countdowns[this.currentCD.index].milestones.length;i++)
	{
		this.countdowns[this.currentCD.index].milestones[i].name = "new milestone";
		
		this.countdowns[this.currentCD.index].milestones[i].date = new Date();
		this.countdowns[this.currentCD.index].milestones[i].date = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) );
	}
}

// This function resets start date to start of the year and end date to end of the year and the other countdown and milestone values reset to default
this.resetToYear = function()
{
	var currentDate = new Date();
	currentDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) );
	
	this.countdowns[this.currentCD.index].startDate = new Date();
	this.countdowns[this.currentCD.index].startDate = new Date( Date.UTC(currentDate.getFullYear(), 0, 1) );
	
	this.countdowns[this.currentCD.index].endDate = new Date();
	this.countdowns[this.currentCD.index].endDate = new Date( Date.UTC(currentDate.getFullYear()+1, 0, 1) );
	
	this.countdowns[this.currentCD.index].name = "";
	this.countdowns[this.currentCD.index].endMessage = "";
	
	// Resetting name and date values of all milestone back to default
	for(var i=0;i<this.countdowns[this.currentCD.index].milestones.length;i++)
	{
		this.countdowns[this.currentCD.index].milestones[i].name = "new milestone";
		
		this.countdowns[this.currentCD.index].milestones[i].date = new Date();
		this.countdowns[this.currentCD.index].milestones[i].date = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) );
	}
}

// These functions return a boolean indicating whether or not the time / marker format has a particular value
this.timeIsDays = function()
{
	return this.format.time.index == this.formats.time.days.index;
}
this.timeIsWeeks = function()
{
	return this.format.time.index == this.formats.time.weeks.index;
}
this.timeIsMonths = function()
{
	return this.format.time.index == this.formats.time.months.index;
}
this.timeIsMonthDays = function()
{
	return this.format.time.index == this.formats.time.monthsdays.index;
}

this.markerIsPercentage = function()
{
	return this.format.marker.index == this.formats.marker.percentage.index;
}
this.markerIsNumber = function()
{
	return this.format.marker.index == this.formats.marker.number.index;
}
this.markerIsDate = function()
{
	return this.format.marker.index == this.formats.marker.date.index;
}
this.markerIsName = function()
{
	return this.format.marker.index == this.formats.marker.name.index;
}

});