/* TODO
- Clean and Comment
*/

//global CaseInfo object
var CaseInfo = new Object();
var massFlag = 0;

//Good practice ato avoid magic numbers, -allows easy modification.
const PIE_CHART_OFFSET = 0.4;

//powershell variable replaced by values
$addCaseInfo;

var data;
var view;

//Load google things
google.charts.load('current', {'packages':['corechart', 'controls']});

//once loaded call drawChar
google.charts.setOnLoadCallback(drawLineChart);


function drawLineChart() 
{	
	//Might rename this function
	addHTML()
	
	data = new google.visualization.DataTable();
	//powershell variable replaced by values
	$data
	
	var chartwidth = $('#curve_chart').width();
	
	//Graph options
	var opts = {
		title: 'Case Worklog',
		interpolateNulls: true,
		width: chartwidth,
		height: 400,
		pointsVisible: true,
		chartArea:
		{
			width: chartwidth,
			left: 40,
		},
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
			maxValue: 8,
			minValue: 0
		},
		tooltip:
		{
			isHtml: true,
		},
		crosshair: 
		{ 
			trigger: 'selection',
			orientation: 'vertical' //draws a line showing points in the same week
		},
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
	google.visualization.events.addListener(wrapper, 'ready', onLineReady);
	
	getFilter();
}

//Insert a new checkbox in the correct place - Insertion sort O(n^2)
function addSorted(parentDiv,inWrapper)
{
	var kids = parentDiv.children;
	for (var i = 0; i < kids.length; i++)
	{
		if (kids[i].id > inWrapper.id || kids[i].id.slice(0,5) == "Other")
		{
			//needs to be this way round because kids updates live and the index i becomes the label
			parentDiv.insertBefore(inWrapper,kids[i]);
			return;
		}
	}
	//case for empty
	parentDiv.appendChild(inWrapper);
	
}

//This has to be JQuery-y otherwise it breaks any existing sliders
function createCollapse(tag)
{
	var parent = $('#controls');
	
	//Some bootstrap wizardry
	parent.append("\
<div class=\"card\">\
    <div class=\"card-header\" id=" + tag + "Header>\
        <button class=\"btn btn-secondary btn-block\" type=\"button\" data-toggle=\"collapse\" data-target=\"#" + tag + "Collapse\" aria-expanded=\"true\" aria-controls=\"" + tag + "Collapse\">\
            " + tag + "\
        </button>\
    </div>\
    <div id=\"" + tag + "Collapse\" class=\"collapse\">\
        <div class=\"card-body\" id=\"" + tag + "CollapseBody\">\
			<div class=text-center id=\"" + tag + "chart\"</div>\
        </div>\
    </div>\
 </div>");
}

//wrapper for incrementing value in col 1 by col 0 value
function incrementCount(data, property)
{
	//LOG console.log("+incrementCount");
	
	var limit = data.getNumberOfRows();
	for (var i = 0; i < limit; i++)
	{
		if (data.getValue(i,0) == property)
		{
			var t = data.getValue(i,1);
			data.setValue(i,1,t+1);
			return data;
		}
	}
	
	//LOG console.log("-incrementCount");
	return data;
}

function getOtherCount(data)
{
	//LOG console.log("+getOtherCount");
	
	var limit = data.getNumberOfRows();
	var total = 0;
	
	//sum all cases assigned to a tag	
	for (var i = 0; i < limit; i++)
	{
		total += data.getValue(i,1);
	}
	
	//CaseInfo has one property per case, giving us the actual total
	var otherCount = Object.keys(CaseInfo).length - total;
	
	//LOG console.log("Other: " + otherCount);
	
	//Other row is always row 0
	data.setValue(0,1,otherCount);
	
	//LOG console.log("-getOtherCount");
	
	return data;
}

//Generate the HTML from the data provided - filter collapses are generated dynamically
function addHTML()
{
	//Pre-made controls div
	var controls = document.getElementById('controls');
	
	//PieData is a Map of Tags (Result, Component) to DataViews containing their values
	var pieData = {};
	
	
	//Iterate Cases
	for (var caseNum in CaseInfo)
	{
		var caseObj = CaseInfo[caseNum];
	
		//Iterate properties of current case
		for (var tag in caseObj)
		{
			//Required fields do not need filters, skip them
			if (tag == "description" || tag == "caseLog" || tag == "color") continue;
			
			
			//Find existing div if it exists
			var currentDiv = document.getElementById(tag + "CollapseBody");
			//Can be null at this point
			
			//pieData doesn't yet contain a DataView for the tag found
			if (pieData[tag] == null)
			{				
				//LOG console.log("Created Data table for " + tag);
				
				pieData[tag] = new google.visualization.DataTable();
				
				pieData[tag].addColumn('string', tag);
				pieData[tag].addColumn('number', "cases");
		
				//tag hasn't been parsed yet, so a bootstrap collapse is added to the accordian for it.
				createCollapse(tag);
				
				//Re-assign variable as it must have been null
				currentDiv = document.getElementById(tag + "CollapseBody");

				//All catagories must have "Other" checkbox to match undefined
				pieData[tag].addRow(["Other",0]);	
				//This also allows us to know that other is row 0, rather than adding at the end
				
				//ButtonsDiv contains the multi buttons "all" and "none"
				buttonsDiv = document.createElement('Div');
				buttonsDiv.id = tag + "Buttons";
				buttonsDiv.className = "buttons";
				
				buttonsDiv.innerHTML = "<button onclick='setAll(\"" + tag + "\",true)' id=\"" + tag +"All\" class=\"btn btn-success\">ALL</button>"
				buttonsDiv.innerHTML += "<button onclick='setAll(\"" + tag + "\",false)' id=\"" + tag +"Clear\" class=\"btn btn-danger\">NONE</button>"
				
				//Appears below the pie chart.
				currentDiv.appendChild(buttonsDiv);
			}
			
			//Check if the filter has been created already, and if not create a row	

			//pieData[tag] is a DataTable, getDistinctViews returns a list of all unique values in column [p1],
			//includes is a javascript function to check if a list contains a passed value.
			if (!pieData[tag].getDistinctValues(0).includes(caseObj[tag]))
			{
				//If not already there, add a row for it.
				pieData[tag].addRow([caseObj[tag],0]);
			}
			
			//always increment the count value, row is initialised at 0
			pieData[tag] = incrementCount(pieData[tag], caseObj[tag]);				
		}
	}
	
	//Seperated for ease of reading
	drawPieCharts(pieData);
}

function drawPieCharts(pieData)
{
	//Similar to PieData, except PieChartWrappers maps the tag to a google chartWrapper object
	pieChartWrappers = {};
	
	//iterate tags
	for (var tag in pieData)
	{
		//other count is total - sum of other filter counts
		pieData[tag] = getOtherCount(pieData[tag]);
			
		//chart options
		var opts = {
			height:300,
			width:500,
			title: tag,
			legend:
			{
				position:'left'
			},
			slices: {}
		}
		//slices item is initialised empty to avoid null issues later.
	
		//Create the wrapper
		pieChartWrappers[tag] = new google.visualization.ChartWrapper({
			chartType: 'PieChart',
			dataTable: pieData[tag],
			options: opts,
			containerId: tag + "chart" //This will exist in the accordian already
		});
		
		//Have to pass a parameter to the ready function so it knowns where to attach the real listeners to
		google.visualization.events.addListener(pieChartWrappers[tag], 'ready', onPieReady(tag));
		
		function onPieReady(tag) 
		{
			//LOG console.log("ready event: " + tag);
			
			//there is a strange error related to passing onReady a parameter, moved it to the console rather than the ui.
			google.visualization.events.addListener(pieChartWrappers[tag], 'error', onPieError);
			google.visualization.events.addListener(pieChartWrappers[tag], 'select', onPieSelect);
		}
		
		//Moves Google errors to the console rather than the ui
		function onPieError(googleError) 
		{
			google.visualization.errors.removeError(googleError.id);
			console.log("Google Error: " + googleError.message);
		}
		
		//PieChart onclick - same for all pies as all need to be parsed by the filter
		function onPieSelect()
		{
			for (var tag in pieChartWrappers)
			{
				var selected = pieChartWrappers[tag].getChart().getSelection();
				
				//empty check
				if (Object.keys(selected).length > 0)
				{
					//options object for currently selected pie
					var offsets = pieChartWrappers[tag].getOption('slices');
					
					//console.log(tag + " : " + JSON.stringify(selected));
					//console.log(tag + " : " + JSON.stringify(opts));
					
					var slice = selected[0]["row"];
					
					//option might not exist yet, try to flip value
					try 
					{
						offsets[slice]["offset"] = abs(offsets[slice]["offset"] - PIE_CHART_OFFSET);
					}
					catch(error)
					{
						offsets[slice] = { "offset": PIE_CHART_OFFSET };
					}
					
					//Set new options
					pieChartWrappers[tag].setOption('slices',offsets);
					
					//Draw new pie with exploded sectors
					pieChartWrappers[tag].draw();
					
					
					//Clear selection to act like radio buttons
					pieChartWrappers[tag].getChart().setSelection([]);
					
					//Filter main graph after a selection has been made
					getFilter();
				}
			}
		}
		
		//Initial draw is all the way down here
		pieChartWrappers[tag].draw();
	}
}

//onSelect Listener can only be added once ready
function onLineReady()
{
	google.visualization.events.addListener(wrapper, 'select', onLineSelect);
}

function clearTabs()
{
	//Remove existing caseLogs
	$('#caseTabs').empty();
	$('#caseTabsContent').empty();
}

//Create new tab for a case
function newTab(color,number,description,caseLog,first)
{
	//Clickable tab added to list
	$('#caseTabs').append("<li class=\"nav-item\"><a class=\"nav-link" + (first ? " active" : "") + "\" id=\"tab_" + number + "\" data-toggle=\"tab\" href=\"#content_" + number + "\" role=\"tab\" aria-controls=\"content_" + number + "\" aria-selected=\"" + first + "\" style='color:#" + color + "'><b>" + number + "</a></li>");
	
	//Content div added and hidden if not first
	$('#caseTabsContent').append("<div class=\"tab-pane fade" +  (first ? " show active" : "") + "\" id=\"content_" + number + "\" role=\"tabpanel\" aria-labelledby=\"tab_" + number + "\"><div class=\"card\"><div class=\"card-header\"><h5>" + description + "</h5></div><div class=\"card-body\">" + caseLog + "</div></div>");
	
	//on click show tab
	$('#caseTabs a').on('click', function (e) 
	{		
		//prevent default click action
		e.preventDefault();
		
		$(this).tab('show');
	});
}

//Show CaseLog in div below. 
function onLineSelect()
{		
	//Clear the Case Info currently being displayed
	clearTabs();
	
	var selection = wrapper.getChart().getSelection();			
	
	//LOG console.log(selection);
	
	if (selection == null || selection[0] == null)
		return;
	
	// Point Clicked. This is non-trivial as multiple cases might have a point behind the one clicked,
	// but getSelection only returns the top one

	var row = selection[0].row;
	
	//This must be the view rather than the DataTable as otherwise the column will likely be wrong
	var val = view.getValue(row, selection[0].column);
	
	//loop limit
	var limit = view.getNumberOfColumns();
	
	var first = true;
	
	//If value in this row (week) is the same for another column(case) they share this point on the graph
	for (i = 2; i < limit; i+=3) //start = 2 for label and dummy columns, step is 3 for colour and tooltip columns
	{
		if (val == view.getValue(row, i))
		{
			caseNumber = view.getColumnLabel(i);
			//Create a tab in the caseInfo section.
			newTab(CaseInfo[caseNumber].color, caseNumber, CaseInfo[caseNumber].description, CaseInfo[caseNumber].caseLog, first);
			first = false //First flag allows first tag to be set as shown and the rest hidden.
		}
	}
}

//Get the values to search each tag for and filter the graph on them
function getFilter()
{	
	//LOG console.log("+GetFilter: " + (new Date).getTime());
	
	//Clear CaseLog
	clearTabs();
	
	//Object maps tags to the values to be included in the filter
	var values = {};
	
	for (var tag in pieChartWrappers)
	{
		//LOG console.log("Filtering " + tag);
		values[tag] = [];
		
		var offsets = pieChartWrappers[tag].getOption('slices');
		
		var tagDataTable = pieChartWrappers[tag].getDataTable();
		
		//Iterate over rows
		for (var i = 0; i < tagDataTable.getNumberOfRows(); i++)
		{
			//Skip if offset exists and is offset
			if (offsets[i] != undefined && offsets[i].offset == PIE_CHART_OFFSET)
			{			
				continue;
			}
			//Otherwise add to the include filter the value in column 0 of row i
			values[tag].push(pieChartWrappers[tag].getDataTable().getValue(i,0));
			
			//Can't just iterate over the offsets object, as undefined = include.
		}
	}
	
	//LOG console.log(values);
	
	//Build list of selected filters from checkboxes
	filterGraph(listFromResolution(values));
	
	//LOG console.log("-GetFilter: " + (new Date).getTime());
}

//Filter graph on resize as well
window.onresize = getFilter;


//If case matches one of each filter, push all case columns to the include list
function listFromResolution(values)
{	
	var list = [0,1]; //Columns 0 and 1 are always included so there will always be enough to draw a graph
	
	//Iterate over all cases in CaseInfo
	for (var caseNum in CaseInfo)
	{	
		//match flag - make sure the case matches all active filters
		var push = -1;
		
		//keys is the names of the properties (filters)
		var keys = Object.keys(values);
		
		//iterate over keys
		for (var i = 0; i < keys.length ; i++)
		{
			//property is the name of the filter we are checking
			var property = keys[i];
			
			//filter is the values to check for - i.e. the checkboxes that have been selected
			var filter = values[property];
			
			//Iterate over values to see if the case matches one
			for (var j = 0; j < filter.length; j++)
			{
				//Special case for "Other" checkbox - checks for cases where the value is undefined
				if (typeof CaseInfo[caseNum][property] === 'undefined' && filter[j].slice(0,5) == "Other")
				{
					//console.log(caseNum + " has no property: " + property + ", matching 'Other'");
					
					//Update push flag to i. If it falls behind the loop then the case has missed a filter
					push = i;
					
					//No need to check the rest of the filter values after a match
					break;
				}
				//If its not the "Other" checkbox then check the object property to see if it matches
				else if (CaseInfo[caseNum][property] == filter[j])
				{
					//console.log(caseNum + " matched property: " + property + " = " + filter[j]);
					
					//Update push flag to i. If it falls behind the loop then the case has missed a filter
					push = i;
					
					//No need to check the rest of the filter values after a match
					break;
				}
			}
			
			if (push != i) 
			{
				//Case has gone through a whole filter of values without matching, filtered out.
				//console.log(caseNum + " did not match property:" + property);
				break;
			}
		}
		//If the push flag is updated on every iteration of the loop the case passes the filter
		if (push == (keys.length - 1))
		{
			//Add to list of columns to include in the view
			list.push(caseNum);
			list.push(caseNum+'T'); //also push Tooltop column
			list.push(caseNum+'S'); //also push Style column
		}
	}
	//LOG console.log(list);
	return list;
}

//Re-Draw graph with only given columns
function filterGraph(columns)
{
	view = new google.visualization.DataView(data);
	
	//Include only the passed columns
	view.setColumns(columns);
	
	//Set the Graph Wrapper's view to the new filter
	wrapper.setView(view.toJSON());
	
	//update total of how many cases are visible
	$("#caseTotal").html("<h4> " + (view.getNumberOfColumns() - 2) / 3 + " Cases</h>");
	
	//Re-read screen width to auto resize graph
	wrapper.setOption('width',$('#curve_chart').width());
	
	wrapper.draw(document.getElementById('curve_chart'));
}

//Check or uncheck all checkboxes based on parameter
function setAll(name,value)
{
	//LOG console.log("+setAll");
	//LOG console.log(name + " " + value*PIE_CHART_OFFSET);
	
	var offsets = {} //pieChartWrappers[name].getOption('slices');
	
	var tagDataTable = pieChartWrappers[name].getDataTable();
	
	if (!value)
	{
		for (var i = 0; i < tagDataTable.getNumberOfRows(); i++)
		{
			offsets[i] = { 'offset': PIE_CHART_OFFSET };
		}
	}
	//LOG console.log(offsets);
	
	//Set new options
	pieChartWrappers[name].setOption('slices',offsets);
	
	//Draw new pie with exploded sectors
	pieChartWrappers[name].draw();
	
	//Clear selection
	pieChartWrappers[name].getChart().setSelection([]);
	
	//Filter the graph
	getFilter();
	
	massFlag = 0;
	//LOG console.log("-setAll");
}