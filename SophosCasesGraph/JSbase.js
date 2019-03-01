//Load google things
google.charts.load('current', {'packages':['corechart', 'controls']});

//once loaded call drawChar
google.charts.setOnLoadCallback(drawChart);

//global CaseInfo object
var CaseInfo = new Object();

//powershell variable replaced by values
$addCaseInfo;

var data;
var view;

function drawChart() 
{		
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
			position: 'top',
			maxLines: 10
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
		document.getElementById("CaseLog").innerHTML = "<p><b>" + caseNumber + ": " + CaseInfo[caseNumber][0] +"</b><br>" + CaseInfo[caseNumber][1] + "<br></p>";
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
		
		console.log(val);
		//If value in this row (week) is the same for another column(case) they share this point on the graph
		//+= 2 to skip over tooltip columns
		for (i = 1; i < limit; i+=3)
		{
			console.log("== " + view.getValue(row, i));
			if (val == view.getValue(row, i))
			{
				caseNumber = view.getColumnLabel(i);
				try
				{
					document.getElementById("CaseLog").innerHTML += "<b>" + caseNumber + ": " + CaseInfo[caseNumber][0] +"</b><br>" + CaseInfo[caseNumber][1] + "<br></p>";
				}
				catch(err) {} //Sometimes tries to read from tooltip columns, not sure why
			}
		}
	}
}

//If case has passed result, push case number and case number tooltip to list of included columns
function listFromResolution(filters)
{
	var list = [0];
	for (var key in CaseInfo)
	{
		for (var i = 0; i < filters.length; i++)
		{
			if (CaseInfo[key][2] == filters[i])
			{
				list.push(key);
				list.push(key+'T'); //also push Tooltop column
				list.push(key+'S'); //also push Style column
			}
		}
	}
	return list;
}

//Passed a string to find the columns for
function getFilter()
{
	var filters = [];
	var checkboxes = document.getElementsByName("filter");
	
	//Build list of selected filters from checkboxes
	for (var i = 0; i < checkboxes.length; i++)
	{
		if(checkboxes[i].checked)
		{
			filters.push(checkboxes[i].value);
		}
	}
	
	//Don't redraw if none selected - the api wouldn't redraw anyway only show an error on top
	if (filters.length > 0)
		filterGraph(listFromResolution(filters));
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
function setAll(value)
{
	var checkboxes = document.getElementsByName("filter");
	for (var i = 0; i < checkboxes.length; i++)
	{
		checkboxes[i].checked = value;
	}		
}

//Re-Draw graph with no filter - save on big loop selecting all
function showAll()
{
	setAll(true)
	view = new google.visualization.DataView(data);
	wrapper.setView(view.toJSON());
	
	wrapper.draw(document.getElementById('curve_chart'));
}
	