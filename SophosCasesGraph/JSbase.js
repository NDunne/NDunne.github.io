//global CaseInfo object
var CaseInfo = new Object();

//powershell variable replaced by values
$addCaseInfo;

var data;
var view;

//Load google things
google.charts.load('current', {'packages':['corechart', 'controls']});

//once loaded call drawChar
google.charts.setOnLoadCallback(drawChart);

function drawChart() 
{	
	addHTML()
	
	data = new google.visualization.DataTable();
	//powershell variable replaced by values
	$data
	
	//Graph options
	var opts = {
		title: 'Case Worklog',
		interpolateNulls: true,
		height: 600,
		pointsVisible: true,
		series: 
		{
			'00001': { color: '#000000' }
		},
		legend: 
		{ 
			position: 'none'
		},
		hAxis: 
		{ 
			title: 'Week Number',
			showTextEvery: 1,
			allowContainerBoundaryTextCufoff: false
		},
		vAxis: 
		{ 
			title: 'Weeks spent on Case',
			minValue: $mostWeeks,
			//This should come from the data
		},
		tooltip:
		{
			isHtml: true,
		}
	};
	
	//Define chart type with wrapper
	wrapper = new google.visualization.ChartWrapper(
	{	
		chartType: 'LineChart',
		dataTable: data,
		options: opts,
		containerId: 'vis',
	});
	
	//Once ready event is fired the onReady function is called
	google.visualization.events.addListener(wrapper, 'ready', onReady);
	
	//Chart must always have a view for CaseLog functionality when filtered
	view = new google.visualization.DataView(data);
	wrapper.setView(view.toJSON());
	
	//Draw to html div with ID curve_chart
	wrapper.draw(document.getElementById('curve_chart'));
}

function addHTML()
{
	
	var controls = document.getElementById('controls');
	
	for (var caseNum in CaseInfo)
	{
		var caseObj = CaseInfo[caseNum];
	
		for (var caseProp in caseObj)
		{
			if (caseProp == "description" || caseProp == "caseLog") continue;
			
			var currentDiv = document.getElementById(caseProp + "Div");
			
			if (currentDiv == null)
			{
				currentDiv = document.createElement('Div');
				currentDiv.id = caseProp + "Div";
				currentDiv.className = "checkboxes";
				currentDiv.innerHTML = "<span><b>" + caseProp + "</b></span><br>";
				controls.appendChild(currentDiv);
								
				buttonsDiv = document.createElement('Div');
				buttonsDiv.id = caseProp + "Buttons";
				buttonsDiv.className = "buttons";
				
				buttonsDiv.innerHTML = "<button onclick='showAll(\"" + caseProp + "Filter\")' id=\"" + caseProp +"All\">ALL</button>"
				buttonsDiv.innerHTML += "<button onclick='setAll(\"" + caseProp + "Filter\",false)' id=\"" + caseProp +"Clear\">NONE</button>"
				
				controls.appendChild(buttonsDiv);
			}
			
			if (!currentDiv.contains(document.getElementById(caseObj[caseProp])))
			{
				var newCheckBox = document.createElement('input');
				newCheckBox.type = "checkbox";
				newCheckBox.name = caseProp + "Filter";
				newCheckBox.id = caseObj[caseProp];
				newCheckBox.value = caseObj[caseProp];
				newCheckBox.onclick = function() {getFilter()};
				newCheckBox.checked="checked";
				
				var newLabel = document.createElement('label');
				newLabel.for = caseObj[caseProp];
				newLabel.innerHTML = caseObj[caseProp];
				
				currentDiv.appendChild(newCheckBox);
				currentDiv.appendChild(newLabel);	
			}	
		}
	}
}

//onSelect Listener can only be added once ready
function onReady()
{
	google.visualization.events.addListener(wrapper, 'select', onSelect);
}

//Show CaseLog in div below. 
function onSelect()
{		
	selection = wrapper.getChart().getSelection();			
	
	if (selection == null || selection[0] == null)
		return;
	if (selection[0].row == null)
	{
		//Legend clicked
		caseNumber = view.getColumnLabel(selection[0].column);
		document.getElementById("CaseLog").innerHTML = "<p><b>" + caseNumber + ": " + CaseInfo[caseNumber].description +"</b><br>" + CaseInfo[caseNumber].caseLog + "<br></p>";
	}
	else
	{
		// Point Clicked. This is non-trivial as multiple cases might have a point behind the one clicked,
		//but getSelection only returns the top one
	
		row = selection[0].row;
		
		//This must be the view rather than the DataTable as otherwise the column will likely be wrong
		val = view.getValue(row, selection[0].column);
		
		//loop limit
		limit = view.getNumberOfColumns();
		
		document.getElementById("CaseLog").innerHTML = "<p>";
		//If value in this row (week) is the same for another column(case) they share this point on the graph
		//+= 2 to skip over tooltip columns
		for (i = 1; i < limit; i+=3)
		{
			if (val == view.getValue(row, i))
			{
				caseNumber = view.getColumnLabel(i);
				try
				{
					document.getElementById("CaseLog").innerHTML += "<b>" + caseNumber + ": " + CaseInfo[caseNumber].description +"</b><br>" + CaseInfo[caseNumber].caseLog + "<br></p>";
				}
				catch(err) {} //Sometimes tries to read from tooltip columns, not sure why
			}
		}
	}
}

//If case has passed result, push case number and case number tooltip to list of included columns
function listFromResolution(values)
{	
	var list = [0];
	for (var key in CaseInfo)
	{
		console.log("Case: " + key);
		
		var pushed = 0;
		
		var keys = Object.keys(values);
		
		for (var i = 0; i < keys.length ; i++)
		{
			var keep = 0;
			var property = keys[i];
			var filter = values[property];
			
			for (var j = 0; j < filter.length; j++)
			{
				if (CaseInfo[key][property] == filter[j])
				{
					console.log(property + " matched filter " + filter[j]); 
					if (pushed == 0)
					{
						console.log("Adding");
						list.push(key);
						list.push(key+'T'); //also push Tooltop column
						list.push(key+'S'); //also push Style column
					
						pushed = 1;
					}
					keep = 1;
				}
			}
			if (pushed == 1 && keep == 0)
			{
				pushed = 0;
				console.log("No match for property " + property + ", removing"); 
				list.pop();
				list.pop();
				list.pop();
			}
			if (pushed == 0) break;
		}
	}
	console.log(list);
	return list;
}

//Passed a string to find the columns for
function getFilter()
{
	var values = {};
	var checkboxDivs = document.getElementsByClassName("checkboxes");
	
	var filterCount = 0;
	
	console.log(checkboxDivs);
	
	for (var i = 0; i < checkboxDivs.length; i++)
	{
		var div = checkboxDivs[i];
		var property = div.id.slice(0,-3);
		
		values[property] = []
		
		var checkboxes = div.children;
		
		console.log(checkboxes);
		
		for (var j = 0; j < checkboxes.length; j++)
		{
			if(checkboxes[j].checked)
			{
				values[property].push(checkboxes[j].value);
				filterCount++;
			}
		}
		
	}
	//Build list of selected filters from checkboxes
	
	
	//Don't redraw if none selected - the api wouldn't redraw anyway only show an error on top
	if (filterCount > 0)
		filterGraph(listFromResolution(values));
}

//Re-Draw graph with only given columns
function filterGraph(columns)
{
	view = new google.visualization.DataView(data);
	view.setColumns(columns);
	wrapper.setView(view.toJSON());
	
	wrapper.draw(document.getElementById('curve_chart'));
}

//Check or uncheck all checkboxes based on parameter
function setAll(name,value)
{
	var checkboxes = document.getElementsByName(name);
	for (var i = 0; i < checkboxes.length; i++)
	{
		checkboxes[i].checked = value;
	}		
}

//Re-Draw graph with no filter - save on big loop selecting all
function showAll(name)
{
	setAll(name,true)
	//view = new google.visualization.DataView(data);
	//wrapper.setView(view.toJSON());
	
	//wrapper.draw(document.getElementById('curve_chart'));
}