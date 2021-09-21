Date.prototype.stdTimezoneOffset = function()
{
	var jan = new Date(this.getFullYear(), 0, 1);
	var jul = new Date(this.getFullYear(), 6, 1);
	return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}
Date.prototype.printLocalTimezone = function()
{
	if (typeof moment !== "undefined")
	{
		var md = moment(this);
		return "GMT" + md.format("Z");
	}
	return '';
}
Date.prototype.relativeDate = function()
{
	if (typeof moment !== "undefined")
	{
		moment.locale('en');
		var md = moment(this);
		return md.fromNow();
	}
	return '';
}
Date.prototype.epochConverterLocaleString = function(disabletz)
{
	disabletz = disabletz || false;
	if (typeof moment === "undefined")
	{
		return this.toDateString() + " " + this.toTimeString();
	}
	moment.locale(locale);
	var md = moment(this);
	if (!md.isValid())
	{
		return 'Invalid input.';
	}
	var currentLocaleData = moment.localeData();
	var myLocaleData = moment.localeData(locale);
	var myFormat = ecFixFormat(myLocaleData.longDateFormat('LLLL'));
	if (md.format("SSS") != '000')
	{
		myFormat = myFormat.replace(":mm", ":mm:ss.SSS");
		myFormat = myFormat.replace(".mm", ".mm.ss.SSS");
	}
	else
	{
		myFormat = myFormat.replace(":mm", ":mm:ss");
		myFormat = myFormat.replace(".mm", ".mm.ss");
	}
	if (!disabletz)
	{
		myFormat += " [GMT]Z";
	}
	var customDate = md.format(myFormat);
	return customDate;
}
Date.prototype.epochConverterGMTString = function()
{
	if (typeof moment === "undefined")
	{
		return this.toUTCString();
	}
	moment.locale('en');
	var md = moment(this);
	if (!md.isValid())
	{
		return 'Invalid input.';
	}
	var myLocaleData = moment.localeData(locale);
	var myFormat = ecFixFormat(myLocaleData.longDateFormat('LLLL')).replace(/\[([^\]]*)\]/g, " ");
	if (md.format("SSS") != '000')
	{
		myFormat = myFormat.replace(":mm", ":mm:ss.SSS");
	}
	else
	{
		myFormat = myFormat.replace(":mm", ":mm:ss");
	}
	return md.utc().format(myFormat);
}
Date.prototype.epochConverterGMTDate = function()
{
	if (typeof locale == 'string' && locale.substring(0, 2) == 'en')
	{
		moment.locale(locale);
	}
	else
	{
		moment.locale('en');
	}
	var md = moment(this);
	if (!md.isValid())
	{
		return 'Invalid input.';
	}
	return md.utc().format('dddd, LL');
}

function getLocale()
{
	var locale = getQueryParams('locale');
	var al = [];
	if (typeof moment !== "undefined")
	{
		al = moment.locales();
	}
	if (locale && al.indexOf(locale.toLowerCase()) > -1)
		return locale.toLowerCase();
	locale = localStorage.getItem('ec_locale');
	if (locale && (al.indexOf(locale) > -1 || al.length === 0))
		return locale;
	locale = window.navigator.language || window.navigator.userLanguage || "en";
	return locale.toLowerCase();
}

function ecFixFormat(f)
{
	clockf = localStorage.getItem('ec_clockf');
	if (clockf === '12' && (f.indexOf('h') === -1))
	{
		f = f.replace(/H/g, "h");
		f = f + " A";
	}
	if (clockf === '24' && (f.indexOf('H') === -1))
	{
		f = f.replace(/h/g, "H");
		f = f.replace(/[Aa]/, "");
	}
	return f;
}

function cleanTimestamp(ts)
{
	if (!ts)
	{
		return "";
	}
	ts = ts.replace(/[`'"\s\,]+/g, '');
	if (ts.charAt(ts.length - 1) == "L")
	{
		ts = ts.slice(0, -1);
	}
	return ts;
}

function EpochToHuman()
{
	var iorg = $('#ecinput').val();
	var hr = "<br/>&nbsp;";
	var errormessage = "Sorry, this timestamp is not valid.<br/>Check your timestamp, strip letters and punctuation marks.";
	var outputtext = "";
	var notices = "";
	inputtext = cleanTimestamp(iorg);
	if (inputtext && inputtext != iorg.trim())
	{
		outputtext += "Converting " + inputtext + ":<br/>";
	}
	if ((inputtext.length === 0) || isNaN(inputtext))
	{
		if (isHex(inputtext))
		{
			inputtext = '0x' + inputtext;
		}
		else
		{
			$("#result1").html(errormessage + hr);
			return;
		}
	}
	if (inputtext.substring(0, 2) == '0x')
	{
		outputtext += "Converting <a href=\"/hex?q=" + inputtext.substring(2) + "\">hexadecimal timestamp</a> to decimal: " + parseInt(inputtext) + "<br/>";
	}
	inputtext = inputtext * 1;
	if (!Ax())
		inputtext -= inputtext;
	var epoch = inputtext;
	var cn = '';
	if (locale.substring(0, 2) == 'en')
	{
		cn = ' class="utcal"';
	}
	if ((inputtext >= 10E7) && (inputtext < 18E7))
	{
		notices += '<br/>Expected a more recent date? You are missing 1 digit.';
	}
	if ((inputtext >= 1E16) || (inputtext <= -1E16))
	{
		outputtext += "Assuming that this timestamp is in <b>nanoseconds (1 billionth of a second)</b>:<br/>";
		inputtext = Math.floor(inputtext / 1000000);
	}
	else if ((inputtext >= 1E14) || (inputtext <= -1E14))
	{
		outputtext += "Assuming that this timestamp is in <b>microseconds (1/1,000,000 second)</b>:<br/>";
		inputtext = Math.floor(inputtext / 1000);
	}
	else if ((inputtext >= 1E11) || (inputtext <= -3E10))
	{
		outputtext += "Assuming that this timestamp is in <b>milliseconds</b>:<br/>";
	}
	else
	{
		outputtext += "Assuming that this timestamp is in <b>seconds</b>:<br/>";
		if ((inputtext > 1E11) || (inputtext < -1E10))
		{
			notices += "<br>Remove the last 3 digits if you are trying to convert milliseconds.";
		}
		inputtext = (inputtext * 1000);
	}
	if (inputtext < -68572224E5)
	{
		notices += "<br/>Dates before 14 september 1752 (pre-Gregorian calendar) are not accurate.";
	}
	var datum = new Date(inputtext);
	if (isValidDate(datum))
	{
		var convertedDate = datum.epochConverterGMTString();
		var relativeDate = datum.relativeDate();
		outputtext += "<b" + cn + ">GMT</b>: " + convertedDate;
		outputtext += "<br/><b" + cn + ">Your time zone</b>: <span title=\"" + datum.toDateString() + " " + datum.toTimeString() + "\">" + datum.epochConverterLocaleString(1) + "</span>";
		if (typeof moment !== "undefined")
		{
			outputtext += " <a title=\"convert to other time zones\" href=\"https://www.epochconverter.com/timezones?q=" + epoch + "\">" + datum.printLocalTimezone() + "</a>";
			var md = moment(datum);
			if (md.isDST())
			{
				outputtext += ' <span class="help" title="daylight saving/summer time">DST</span>';
				if (datum.getFullYear() < 1908)
					notices += '<br/>DST (Daylight Saving Time) was first used around 1908.<br/>Your browser uses the current DST rules for all dates in history.';
			}
		}
		if (relativeDate)
		{
			outputtext += "<br/><b" + cn + ">Relative</b>: " + relativeDate.capitalize();
		}
		if (notices)
			outputtext += "<br/><br/>Note: " + notices;
	}
	else
	{
		outputtext += errormessage;
	}
	$("#result1").html(outputtext + hr);
}

function createHDate(idn)
{
	var id = '#' + idn;
	var d = "NaN";
	var a = $(id + '-result');
	var tz = $(id + ' select[name=tz]').val();
	var mm = $(id + ' [name=mm]').val();
	var dd = $(id + ' input[name=dd]').val();
	var hh = $(id + ' input[name=hh]').val();
	var mn = $(id + ' input[name=mn]').val();
	var ss = $(id + ' input[name=ss]').val();
	var yyyy = $(id + ' input[name=yyyy]').val();
	var warning = '<b>Please check your input.</b><br/>';
	if (yyyy.length === 0 || isNaN(yyyy))
	{
		a.html(warning + "Invalid year.");
		return d;
	}
	if (mm.length === 0 || isNaN(mm) || mm > 12)
	{
		a.html(warning + 'Invalid month.');
		return d;
	}
	if (dd.length === 0 || dd > 31)
	{
		a.html(warning + 'Invalid day.');
		return d;
	}
	if ($(id).data('clockf') === '12')
	{
		if (hh.length === 0 || hh > 12 || hh < 1)
		{
			a.html(warning + 'Invalid hour - go to <a href="/site/preferences/">preferences</a> for a 24h clock');
			return d;
		}
		var ampm = $(id + ' select[name=am]').val();
		if (ampm === 'pm')
		{
			hh = parseInt(hh) + 12;
			if (hh == 24)
				hh = 12;
		}
		if (ampm === 'am' && hh == 12)
		{
			hh = 0;
		}
	}
	else
	{
		if (hh.length === 0 || hh > 23 || hh < 0)
		{
			a.html(warning + 'Invalid hour.');
			return d;
		}
	}
	if (mn.length === 0 || mn > 59 || mn < 0)
	{
		a.html(warning + 'Invalid minute.');
		return d;
	}
	if (ss.lenght === 0 || ss > 59 || ss < 0)
	{
		a.html(warning + 'Invalid second.');
		return d;
	}
	var usedGMT = 0;
	if (tz == 2)
	{
		d = new Date(yyyy, mm - 1, dd, hh, mn, ss);
	}
	else
	{
		d = new Date(Date.UTC(yyyy, mm - 1, dd, hh, mn, ss));
		usedGMT = 1;
	}
	var hw = [d, usedGMT];
	return hw;
}

function HumanToEpochTZ()
{
	var hw = createHDate('hf');
	if (typeof hw !== 'object')
	{
		return;
	}
	var d = hw[0];
	var usedGMT = hw[1];
	var resulttext = "<b>Epoch timestamp</b>: " + (d.getTime() / 1000.0);
	resulttext += "<br/><span title='Used in Java, JavaScript'>Timestamp in milliseconds: " + d.getTime() + "</span>";
	resulttext += "<br/>" + (usedGMT ? '<b>' : '') + "Date and time (GMT)" + (usedGMT ? '</b>' : '') + ":  " + d.epochConverterGMTString();
	resulttext += "<br/>" + (usedGMT ? '' : '<b>') + "Date and time (your time zone)" + (usedGMT ? '' : '</b>') + ": " + d.epochConverterLocaleString();
	if (!Ax())
		return;
	$('#hf-result').html(resulttext);
}

function HumanToEpoch2(loop)
{
	loop = loop || 1;
	var strDate = $('input#rcinput').val();
	var mapDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Mon\,', 'Tue\,', 'Wed\,', 'Thu\,', 'Fri\,', 'Sat\,', 'Sun\,', 'Mon ', 'Tue ', 'Wed ', 'Thu ', 'Fri ', 'Sat ', 'Sun ', 'Sun\.', 'Mon\.', 'Tue\.', 'Wed\.', 'Thu\.', 'Fri\.', 'Sat\.', 'Sun\.'];
	if (loop == 2)
	{
		strDate = translateLocaleToEn(strDate);
	}
	strDate = stripAll(strDate, mapDays);
	strDate = strDate.replace(/[\,]/g, '');
	strDate = strDate.replace(/^\s+|\s+$/g, '');
	strDate = strDate.replace(/ +(?= )/g, '');
	strDate = strDate.replace(/^(\d+)\./, '$1');
	var ok = 0;
	var skipDate = 0;
	var content = "";
	var date = "";
	var format = "";
	var yr = 1970;
	var mnth = 1;
	var dy = 1;
	var hr = 0;
	var mn = 0;
	var sec = 0;
	var dmy = 1;
	if (!ok)
	{
		var dateTimeSplit = strDate.split(" ");
		var dateParts = dateTimeSplit[0].split("-");
		if (dateParts.length == 1)
			dateParts = dateTimeSplit[0].split(".");
		if (dateParts.length == 1)
		{
			dmy = 0;
			dateParts = dateTimeSplit[0].split("/");
		}
		if (dateParts.length == 1)
		{
			dmy = 1;
			if (dateTimeSplit.length > 2)
			{
				if (dateTimeSplit[2].split(":").length == 1)
				{
					strDate = strDate.replace(dateTimeSplit[0] + ' ' + dateTimeSplit[1] + ' ' + dateTimeSplit[2], dateTimeSplit[0] + '-' + dateTimeSplit[1] + '-' + dateTimeSplit[2]);
					dateTimeSplit = strDate.split(" ");
					dateParts = dateTimeSplit[0].split("-");
				}
			}
		}
		if (dateParts.length == 1)
		{
			dateParts = dateTimeSplit;
			if (dateTimeSplit.length > 3)
				timeParts = dateTimeSplit[4];
		}
		if (dateParts.length > 2)
		{
			if (dateParts[0] > 100)
			{
				yr = dateParts[0];
				mnth = parseMonth(dateParts[1]);
				dy = dateParts[2];
				format = "YMD";
			}
			else
			{
				if (dmy)
				{
					dy = dateParts[0];
					mnth = parseMonth(dateParts[1]);
					yr = dateParts[2];
					format = "DMY";
					if ((!parseFloat(mnth)) || (!parseFloat(dy)))
					{
						dy = dateParts[1];
						mnth = parseMonth(dateParts[0]);
						format = "MDY";
					}
				}
				else
				{
					mnth = parseMonth(dateParts[0]);
					dy = dateParts[1];
					yr = dateParts[2];
					format = "MDY";
					if ((!parseFloat(mnth)) || (!parseFloat(dy)))
					{
						dy = dateParts[0];
						mnth = parseMonth(dateParts[1]);
						format = "DMY";
					}
				}
			}
			ok = 1;
		}
		if (ok && dateTimeSplit[1])
		{
			var timeParts = dateTimeSplit[1].split(":");
			if (timeParts.length >= 2)
			{
				hr = timeParts[0];
				mn = timeParts[1];
			}
			if (timeParts.length >= 3)
			{
				sec = timeParts[2];
			}
			if ((dateTimeSplit[2] && dateTimeSplit[2].toLowerCase() == "pm") && (parseFloat(hr) < 12))
				hr = parseFloat(hr) + 12;
			if ((dateTimeSplit[2] && dateTimeSplit[2].toLowerCase() == "am") && (parseFloat(hr) == 12))
				hr = 0;
		}
	}
	if (!ok)
	{
		date = new Date(strDate);
		if (date.getFullYear() > 1900)
		{
			ok = 1;
			skipDate = 1;
		}
	}
	if (ok)
	{
		if (!skipDate)
		{
			if (mnth != parseFloat(mnth))
				mnth = parseMonth(mnth);
			if (yr < 30)
				yr = 2000 + parseFloat(yr);
			if (yr < 200)
				yr = 1900 + parseFloat(yr);
			var usedGMT = 0;
			if (((strDate.toUpperCase().indexOf('GMT') > 0) || (strDate.toUpperCase().indexOf('UTC') > 0)) && (strDate.toUpperCase().indexOf('GMT+') == -1) && (strDate.toUpperCase().indexOf('UTC+') == -1))
			{
				date = new Date(Date.UTC(yr, mnth - 1, dy, hr, mn, sec));
				usedGMT = 1;
			}
			else
			{
				date = new Date(yr, mnth - 1, dy, hr, mn, sec);
			}
		}
		content += "<b>Epoch timestamp</b>: " + (date.getTime() / 1000.0);
		content += "<br/><span title='Used in Java, JavaScript'>Timestamp in milliseconds: " + date.getTime() + "</span>";
		content += "<br/>" + (usedGMT ? '<b>' : '') + "Date and time (GMT)" + (usedGMT ? '</b>' : '') + ":  " + date.epochConverterGMTString();
		content += "<br/>" + (usedGMT ? '' : '<b>') + "Date and time (Your time zone)" + (usedGMT ? '' : '</b>') + ": " + date.epochConverterLocaleString();
	}
	if ((!content) || (date.getTime() != parseFloat(date.getTime())))
	{
		if (loop == 1)
		{
			HumanToEpoch2(2);
			return;
		}
		content = 'Sorry, can\'t parse this date.';
	}
	if (!Ax())
		return;
	$('#result3').html(content);
}

function secondsSince0(offset)
{
	var formname = "s2t";
	if (offset)
		formname += "2";
	var val = parseInt(document.getElementById(formname).value);
	val -= 62167219200;
	if (offset)
	{
		val += offset;
	}
	var datum = new Date(val * 1000);
	outputtext = "<b>GMT</b>: " + datum.epochConverterGMTString() + "<br/><b>Your time zone</b>: " + datum.epochConverterLocaleString();
	document.getElementById('result' + formname).innerHTML = outputtext;
}

function daysSince0(offset, count)
{
	var formname = "d2t";
	if (offset)
		formname += count;
	var val = parseInt(document.getElementById(formname).value);
	if (offset)
	{
		val = offset + val;
	}
	val = (val * 86400) - 62167219200;
	var datum = new Date(val * 1000);
	outputtext = "<b>Conversion result</b>: " + datum.epochConverterGMTDate();
	document.getElementById('result' + formname).innerHTML = outputtext;
}

function hexToHuman()
{
	var hex = document.getElementById('hextime').value;
	dec = parseInt(hex, 16);
	var datum = new Date(dec * 1000);
	outputtext = "<b>GMT</b>: " + datum.epochConverterGMTString() + "<br/><b>Your time zone</b>: " + datum.epochConverterLocaleString();
	outputtext += "<br/>Decimal timestamp/epoch: " + dec;
	document.getElementById('resulthex').innerHTML = outputtext;
}

function TimeCounter()
{
	var content = "";
	var tx = $("input#scinput").val();
	t = parseInt(cleanTimestamp(tx));
	if (t && t != tx)
	{
		content += "Converting " + t + ":<br/>";
	}
	var days = parseInt(t / 86400);
	t = t - (days * 86400);
	var hours = parseInt(t / 3600);
	t = t - (hours * 3600);
	var minutes = parseInt(t / 60);
	t = t - (minutes * 60);
	if (days)
		content += days + " days";
	if (hours || days)
	{
		if (days)
			content += ", ";
		content += hours + " hours, ";
	}
	content += minutes + " minutes and " + t + " seconds.";
	$("#result4").html(content);
	trck('Seconds');
}
var currentBeginEnd = "month";

function updateBe(a)
{
	if (a != currentBeginEnd)
	{
		if (a == "day")
		{
			document.br.mm.disabled = 0;
			document.br.dd.disabled = 0;
		}
		if (a == "month")
		{
			document.br.mm.disabled = 0;
			document.br.dd.disabled = 1;
		}
		if (a == "year")
		{
			document.br.mm.disabled = 1;
			document.br.dd.disabled = 1;
		}
		currentBeginEnd = a;
		beginEnd();
	}
}

function beginEnd()
{
	var tz = $('#br select[name=tz]').val();
	var a = $('#br-result');
	var be = $("#br input[name=cw]:checked").val();
	var m = $('#br input[name=mm]').val()
	var d = $('#br input[name=dd]').val()
	var y = $('#br input[name=yyyy]').val()
	if (be != "year" && ((m != parseInt(m, 10)) || m > 12))
	{
		a.html('<b>Please check your input.</b><br/>Invalid month: ' + m);
		return;
	}
	if (be == "day" && ((d != parseInt(d, 10)) || d > 31))
	{
		a.html('<b>Please check your input.</b><br/>Invalid day: ' + d);
		return;
	}
	if (y != parseInt(y, 10))
	{
		a.html('<b>Please check your input.</b><br/>Invalid year: ' + y);
		return;
	}
	var outputText = "<table class=\"infotable table-tool\"><thead><tr><th></th><th>Epoch</th><th>Date and time</th></tr></thead><tbody><tr><td>Start of " + be + ":&nbsp;</td><td>";
	var mon = 0;
	var day = 1;
	if (be != "year")
	{
		mon = m - 1;
	}
	if (be == "day")
	{
		day = d;
	}
	var startDate;
	if (tz == 2)
	{
		startDate = new Date(y, mon, day, 0, 0, 0);
	}
	else
	{
		startDate = new Date(Date.UTC(y, mon, day, 0, 0, 0));
	}
	if (be == "year")
		y++;
	if (be == "month")
		mon++;
	if (be == "day")
		day++;
	var endDate;
	if (tz == 2)
	{
		endDate = new Date(y, mon, day, 0, 0, -1);
	}
	else
	{
		endDate = new Date(Date.UTC(y, mon, day, 0, 0, -1));
	}
	outputText += (startDate.getTime() / 1000.0) + "</td><td>";
	if (tz == 2)
	{
		outputText += startDate.epochConverterLocaleString();
	}
	else
	{
		outputText += startDate.epochConverterGMTString();
	}
	outputText += "</td></tr>";
	outputText += "<tr><td>End of " + be + ":&nbsp;</td><td>";
	outputText += (endDate.getTime() / 1000.0) + "</td><td>";
	if (tz == 2)
	{
		outputText += endDate.epochConverterLocaleString();
	}
	else
	{
		outputText += endDate.epochConverterGMTString();
	}
	outputText += "</td></tr></tbody></table>";
	a.html(outputText);
}

function timerStart(o, t, clockid, inputid, trailing)
{
	o = o || 0;
	t = t || 1;
	timeout = t * 1000;
	if (timeout < 100)
	{
		timeout = 100;
	}
	if (timeout > 6000)
	{
		timeout = 6000;
	}
	clockid = clockid || "#ecclock";
	trailing = trailing || "";
	if ($(clockid).length != 0)
	{
		var el = $(clockid);
		el.data('running', 1);
		el.after('<div class="clocknotice"></div>');
		$(".clocknotice").hide();
		var epoch = getTime(o, t) + trailing;
		el.html(epoch);
		if (inputid)
			$(inputid).val(epoch);
		el.mouseover(function()
		{
			$(this).data('running', 0);
			$(this).next().html('<i class="fa fa-pause" aria-hidden="true"></i>').show();
			setTimeout(function()
			{
				$(".clocknotice").hide();
			}, 2000);
		});
		el.mouseout(function()
		{
			$(this).data('running', 1);
			$(this).next().html('').hide();
		});
		el.on('touchend', function()
		{
			if ($(this).data('running'))
			{
				$(this).data('running', 0);
			}
			else
			{
				$(this).data('running', 1);
			}
		});
		setInterval(function()
		{
			if (el.data('running'))
			{
				el.html(getTime(o, t) + trailing);
			}
		}, timeout);
	}
}

function getTime(o, t)
{
	o = o || 0;
	t = t || 1;
	if (o == "ymd")
	{
		if (typeof moment !== "undefined")
			return (moment().utc().format('YMMDDHHmmss')) + "Z";
		return "";
	}
	var hex = 0;
	if (o == "0x")
	{
		o = 0;
		hex = 1;
	}
	var res = Math.floor((o + (new Date().getTime() / 1000.0)) / t);
	if (hex)
		res = res.toString(16).toUpperCase();
	return res;
}

function initDateSelector(formid, dateonly)
{
	var id = '#' + formid;
	var sd = $(id).data('format');
	var ed = localStorage.getItem('ec_datef');
	if (ed && sd && ed !== sd)
	{
		if (sd === 'mdy')
		{
			var mi = $(id + '-d1').html();
			var di = $(id + '-d2').html();
			var yi = $(id + '-d3').html();
		}
		else
		{
			var yi = $(id + '-d1').html();
			var mi = $(id + '-d2').html();
			var di = $(id + '-d3').html();
		}
		if (ed === 'dmy')
		{
			$(id + '-h1').html('Day');
			$(id + '-d1').html(di);
			$(id + '-d1 .datesep').html('-');
			$(id + '-h2').html('Mon');
			$(id + '-d2').html(mi);
			$(id + '-d2 .datesep').html('-');
			$(id + '-h3').html('Yr');
			$(id + '-d3').html(yi);
			$(id + '-d3 .datesep').html('&nbsp;');
		}
		if (ed === 'mdy')
		{
			$(id + '-h1').html('Mon');
			$(id + '-d1').html(mi);
			$(id + '-d1 .datesep').html('/');
			$(id + '-h2').html('Day');
			$(id + '-d2').html(di);
			$(id + '-d2 .datesep').html('/');
			$(id + '-h3').html('Yr');
			$(id + '-d3').html(yi);
			$(id + '-d3 .datesep').html('&nbsp;');
		}
		if (ed === 'ymd')
		{
			$(id + '-h1').html('Yr');
			$(id + '-d1').html(yi);
			$(id + '-d1 .datesep').html('-');
			$(id + '-h2').html('Mon');
			$(id + '-d2').html(mi);
			$(id + '-d2 .datesep').html('-');
			$(id + '-h3').html('Day');
			$(id + '-d3').html(di);
			$(id + '-d3 .datesep').html('&nbsp;');
		}
		$(id).data('format', ed);
	}
	var n = new Date();
	var clockf = getClockPref();
	var tzpref = getTzPref();
	$(id).data('clockf', clockf);
	if (tzpref == 2)
	{
		$(id + ' input:text[name=yyyy]').val(n.getFullYear());
		$(id + ' input:text[name=mm]').val(n.getMonth() + 1);
		$(id + ' input:text[name=dd]').val(n.getDate());
		if (!dateonly)
			$(id + ' input:text[name=hh]').val(n.getHours());
	}
	else
	{
		$(id + ' input:text[name=yyyy]').val(n.getUTCFullYear());
		$(id + ' input:text[name=mm]').val(n.getUTCMonth() + 1);
		$(id + ' input:text[name=dd]').val(n.getUTCDate());
		if (!dateonly)
			$(id + ' input:text[name=hh]').val(n.getUTCHours());
	}
	if (!dateonly)
	{
		$(id + ' input:text[name=mn]').val(n.getUTCMinutes());
		$(id + ' input:text[name=ss]').val(n.getUTCSeconds());
		if (clockf == '12')
		{
			var h = n.getUTCHours();
			if (tzpref == 2)
			{
				h = n.getHours();
			}
			$(id + ' .ampm').show();
			if (h >= 12)
			{
				$(id + ' .ampm>select').val('pm');
				if (h > 12)
					$(id + ' input[name=hh]').val(h - 12);
			}
			else if (h == 0)
				$(id + ' input[name=hh]').val(12);
		}
		else
		{
			$(id + ' .ampm').hide();
		}
	}
	$(id).change(function()
	{
		if ($.trim($(id + '-result').html()))
		{
			$(id).submit();
		}
	});
}

function getTzPref()
{
	var tzpref = 1;
	if (localStorage.getItem('ec_tzpref') && localStorage.getItem('ec_tzpref') == 2)
		tzpref = 2;
	return tzpref;
}

function getClockPref()
{
	var clockf;
	if (localStorage.getItem('ec_clockf'))
	{
		clockf = localStorage.getItem('ec_clockf');
	}
	else
	{
		var controldate = new Date(1546365600000);
		cchecks = controldate.epochConverterGMTString().search(" PM");
		if (cchecks > -1)
		{
			clockf = '12';
		}
		else
		{
			clockf = '24';
		}
	}
	return clockf;
}

function homepageStart()
{
	timerStart(0, 1, "#ecclock", "#ecinput");
	initDateSelector('hf', 0);
	initDateSelector('br', 1)
	var today = new Date();
	$('#br input[name=dd]').prop('disabled', true);
	$('#fs input:text[name=DateTime]').val(today.toUTCString());
	clockf = getClockPref();
	if (clockf == '12')
	{
		$('#preferencelink').html('Prefer a 24-hour clock? Go to <a href="/site/preferences">preferences</a>.');
	}
	else
	{
		$('#preferencelink').html('Prefer a 12-hour clock? Go to <a href="/site/preferences">preferences</a>.');
	}
	$(document).keypress(function(e)
	{
		if (!$(e.target).is('input#ecinput, input#rcinput'))
		{
			if (!(e.ctrlKey || e.altKey || e.metaKey))
			{
				if (String.fromCharCode(e.which).match(/[echrsymdECHRSYMD]/))
					e.preventDefault();
				switch (e.which)
				{
					case 101:
					case 69:
						kp('ecinput');
						jumpTo('top');
						break;
					case 99:
					case 67:
						emptyFields();
						break;
					case 104:
					case 72:
						kp('hf-d1 input');
						jumpTo('top');
						break;
					case 114:
					case 82:
						kp('rcinput');
						jumpTo('fs');
						break;
					case 115:
					case 83:
						kp('scinput');
						jumpTo('tchead');
						break;
					case 121:
					case 89:
						$('#br input:radio[name=cw]:nth(0)').attr('checked', true);
						updateBe('year');
						kp('br input[name="yyyy"]');
						jumpTo('brhead');
						break;
					case 109:
					case 77:
						$('#br input:radio[name=cw]:nth(1)').attr('checked', true);
						updateBe('month');
						kp('br input[name="mm"]');
						jumpTo('brhead');
						break;
					case 100:
					case 68:
						$('#br input:radio[name=cw]:nth(2)').attr('checked', true);
						updateBe('day');
						kp('br input[name="dd"]');
						jumpTo('brhead');
						break;
				}
			}
		}
	});
	var q = getQueryParams("q");
	if (q && ((!isNaN(q)) || isHex(q)))
	{
		$("#ecinput").val(q);
		EpochToHuman();
	}
}

function timezoneStart()
{
	$(document).keypress(function(e)
	{
		if (!(e.ctrlKey || e.altKey || e.metaKey))
		{
			if (String.fromCharCode(e.which).match(/[a-zA-Z]/))
				e.preventDefault();
			switch (e.which)
			{
				case 101:
				case 69:
					kp('ecinput');
					jumpTo('top');
					break;
			}
		}
	});
}

function jumpTo(toid)
{
	var new_position = $('#' + toid).offset();
	window.scrollTo(new_position.left, new_position.top);
}

function emptyFields()
{
	$('input:text').val("");
	$(".resultbox").fadeOut('', function()
	{
		$(".resultbox").html('').show();
	});
}

function kp(id)
{
	$('#' + id).focus();
	$('#' + id).select();
}

function parseMonth(mnth)
{
	switch (mnth.toLowerCase())
	{
		case 'january':
		case 'jan':
		case 'enero':
			return 1;
		case 'february':
		case 'feb':
		case 'febrero':
			return 2;
		case 'march':
		case 'mar':
		case 'marzo':
			return 3;
		case 'april':
		case 'apr':
		case 'abril':
			return 4;
		case 'may':
		case 'mayo':
			return 5;
		case 'jun':
		case 'june':
		case 'junio':
			return 6;
		case 'jul':
		case 'july':
		case 'julio':
			return 7;
		case 'aug':
		case 'august':
		case 'agosto':
			return 8;
		case 'sep':
		case 'september':
		case 'septiembre':
		case 'setiembre':
			return 9;
		case 'oct':
		case 'october':
		case 'octubre':
			return 10;
		case 'nov':
		case 'november':
		case 'noviembre':
			return 11;
		case 'dec':
		case 'december':
		case 'diciembre':
			return 12;
	}
	return mnth;
}

function isValidDate(d)
{
	if (Object.prototype.toString.call(d) !== "[object Date]")
		return false;
	return !isNaN(d.getTime());
}

function isHex(h)
{
	var a = parseInt(h, 16);
	return (a.toString(16) === h.toLowerCase())
}

function Ax()
{
	var d = $(location).attr('hostname');
	if ((d.search(/sja/i) > 0) || (d.search(/hconverte/i) > 3) || d.search(/ogl/i) > 0)
	{
		return 1;
	}
	else
	{
		return 0;
	}
}

function UpdateTableHeaders()
{
	$(".persist-area").each(function()
	{
		var el = $(this),
			offset = el.offset(),
			scrollTop = $(window).scrollTop(),
			floatingHeader = $(".floatingHeader", this)
		if ((scrollTop > offset.top) && (scrollTop < offset.top + el.height()))
		{
			floatingHeader.css(
			{
				"visibility": "visible"
			});
		}
		else
		{
			floatingHeader.css(
			{
				"visibility": "hidden"
			});
		};
	});
}

function stripAll(str, mapDays)
{
	var re = new RegExp(mapDays.join("|"), "gi");
	return str.replace(re, '');
}

function replaceAll(str, mapObj)
{
	var keysstr = Object.keys(mapObj).join("|");
	if (!keysstr)
		return str;
	keysstr = keysstr.replace(/\./g, '\\.');
	var re = new RegExp(keysstr, "i");
	return str.replace(re, function(matched)
	{
		return mapObj[matched.toLowerCase()];
	});
}

function replaceArray1withArray2(str, a1, a2)
{
	var obj = {};
	for (var i = 0, l = a1.length; i < l; i++)
	{
		s = a1[i];
		t = a2[i];
		if (s != t)
		{
			obj[s.toLowerCase()] = t;
		}
	}
	str = replaceAll(str, obj);
	return str;
}

function translateLocaleToEn(str)
{
	if (typeof moment === "undefined")
		return str;
	if (locale.substring(0, 2) == 'en')
		return str;
	moment.locale(locale);
	monthsA = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	inA = moment.months();
	str = replaceArray1withArray2(str, inA, monthsA);
	inB = moment.monthsShort();
	str = replaceArray1withArray2(str, inB, monthsA);
	daysA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	inC = moment.weekdays();
	str = replaceArray1withArray2(str, inC, daysA);
	inD = moment.weekdaysShort();
	str = replaceArray1withArray2(str, inD, daysA);
	return str;
}

function trck(m)
{
	if (typeof ga === 'function')
	{
		ga('send', 'event', 'converter', 'click', m);
	}
}

function getQueryParams(qn)
{
	var qs = document.location.search;
	qs = qs.split('+').join(' ');
	var params = {},
		tokens, re = /[?&]?([^=]+)=([^&]*)/g;
	while (tokens = re.exec(qs))
	{
		if (decodeURIComponent(tokens[1]) == qn)
			return decodeURIComponent(tokens[2]);
	}
	return false;
}
String.prototype.capitalize = function()
{
	return this.charAt(0).toUpperCase() + this.slice(1);
}
var locale = 'en';
$(document).ready(function()
{
	locale = getLocale();
});
