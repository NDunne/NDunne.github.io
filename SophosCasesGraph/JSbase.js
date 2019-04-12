/* TODO
- CSS? Bootstrap? Tabs for caselog just generally more pretty
- animate button?
*/

//global CaseInfo object
var CaseInfo = new Object();
var massFlag = 0;

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
			maxValue: 6,
			minValue: 0
		},
		tooltip:
		{
			isHtml: true,
		},
		crosshair: 
		{ 
			trigger: 'selection',
			orientation: 'vertical'
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
	google.visualization.events.addListener(wrapper, 'ready', onReady);
	
	//Chart must always have a view for CaseLog functionality when filtered
	view = new google.visualization.DataView(data);
	wrapper.setView(view.toJSON());
	
	//Draw to html div with ID curve_chart
	wrapper.draw(document.getElementById('curve_chart'));
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

//Create a new slider for a filter that doesn't exist yet
function createCheckbox(parentDiv,property,value)
{
	var wrapper = document.createElement('label');
	wrapper.id = value + "Wrapper";
	wrapper.className = "wrapper";
	
	var newCheckBox = document.createElement('input');
	newCheckBox.type = "checkbox";
	newCheckBox.name = property + "Filter";
	newCheckBox.id = value;
	newCheckBox.checked = true;
	
	//Set as Bootstrap toggle type
	$(function() 
	{
		$(newCheckBox).bootstrapToggle(
		{
			on:value,
			off:value,
			onstyle:"success",
			offstyle:'danger',
			width: '130px',
			height: '60px',
			
		});
		
		$(newCheckBox).change(function( event ) 
		{			
			if (massFlag == 0)
			{
				//Generate new DataView
				getFilter();
			}
		})
	});
	
	wrapper.appendChild(newCheckBox);
		
	//Ensure alphabetical order	
	addSorted(parentDiv,wrapper);
}

//This has to be JQuery-y otherwise it breaks any existing sliders
function createCollapse(property)
{
	var parent = $('#controls');
	
	//Some bootstrap wizardry
	parent.append("\
<div class=\"card\">\
    <div class=\"card-header\" id=" + property + "Header>\
        <button class=\"btn btn-secondary btn-block\" type=\"button\" data-toggle=\"collapse\" data-target=\"#" + property + "Collapse\" aria-expanded=\"true\" aria-controls=\"" + property + "Collapse\">\
            " + property + "\
        </button>\
    </div>\
    <div id=\"" + property + "Collapse\" class=\"collapse\">\
        <div class=\"card-body\">\
			<div class=\"btn-group-toggle\" id=\"" + property + "CollapseBody\">\
			</div>\
        </div>\
    </div>\
 </div>");
}	

//Generate the HTML from the data provided - filter collapses are generated dynamically
function addHTML()
{
	var controls = document.getElementById('controls');
	
	//Iterate Cases
	for (var caseNum in CaseInfo)
	{
		var caseObj = CaseInfo[caseNum];
	
		for (var caseProp in caseObj)
		{
			//Required fields do not need filters
			if (caseProp == "description" || caseProp == "caseLog" || caseProp == "color") continue;
			
			//Find existing div if it exists
			var currentDiv = document.getElementById(caseProp + "CollapseBody");
			
			//If not create a new one
			if (currentDiv == null)
			{
				createCollapse(caseProp);
				//Re-assign variable
				currentDiv = document.getElementById(caseProp + "CollapseBody");

				//All catagories must have "Other" checkbox to match undefined
				createCheckbox(currentDiv, caseProp, "Other");	
			}
			else if(document.getElementById(caseProp + "Buttons") == null)
			{
				//Buttons are only created if there is more than 1 option
				buttonsDiv = document.createElement('Div');
				buttonsDiv.id = caseProp + "Buttons";
				buttonsDiv.className = "buttons";
				
				buttonsDiv.innerHTML = "<button onclick='setAll(\"" + caseProp + "Filter\",true)' id=\"" + caseProp +"All\" class=\"btn btn-success\">ALL</button>"
				buttonsDiv.innerHTML += "<button onclick='setAll(\"" + caseProp + "Filter\",false)' id=\"" + caseProp +"Clear\" class=\"btn btn-danger\">NONE</button>"
				
				currentDiv.appendChild(buttonsDiv);
			}
			
			//Check if the filter has been created already, and if not create a checkbox
			if (!currentDiv.contains(document.getElementById(caseObj[caseProp])))
			{
				createCheckbox(currentDiv, caseProp, caseObj[caseProp]);
			}	
		}
	}
}

//onSelect Listener can only be added once ready
function onReady()
{
	google.visualization.events.addListener(wrapper, 'select', onSelect);
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
function onSelect()
{		
	clearTabs();
	var selection = wrapper.getChart().getSelection();			
	
	console.log(selection);
	
	if (selection == null || selection[0] == null)
		return;
	if (selection[0].row == null)
	{
		//Legend clicked
		var caseNumber = view.getColumnLabel(selection[0].column);
		document.getElementById("CaseLog").innerHTML = "<p><b>" + caseNumber + ": " + CaseInfo[caseNumber].description +"</b><br>" + CaseInfo[caseNumber].caseLog + "<br></p>";
	}
	else
	{
		// Point Clicked. This is non-trivial as multiple cases might have a point behind the one clicked,
		//but getSelection only returns the top one
	
		var row = selection[0].row;
		
		//This must be the view rather than the DataTable as otherwise the column will likely be wrong
		var val = view.getValue(row, selection[0].column);
		
		//loop limit
		var limit = view.getNumberOfColumns();
		
		var first = true;
		
		//document.getElementById("CaseLog").innerHTML = "<p>";
		//If value in this row (week) is the same for another column(case) they share this point on the graph
		//+= 2 to skip over tooltip columns
		for (i = 2; i < limit; i+=3)
		{
			if (val == view.getValue(row, i))
			{
				caseNumber = view.getColumnLabel(i);
				//try
				//{
					//document.getElementById("CaseLog").innerHTML += "<span style='color:" + CaseInfo[caseNumber].color + "'><b>" + caseNumber + ":</span> " + CaseInfo[caseNumber].description +"</b><br>" + CaseInfo[caseNumber].caseLog + "<br></p>";
					newTab(CaseInfo[caseNumber].color, caseNumber, CaseInfo[caseNumber].description, CaseInfo[caseNumber].caseLog, first);
					first = false
				//}
				//catch(err) {} //Sometimes tries to read from tooltip columns, not sure why
			}
		}
	}
}

//If case matches one of each filter, push case number and case number tooltip to list of included columns
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
	//console.log(list);
	return list;
}

//Passed a string to find the columns for
function getFilter()
{	
	console.log("+GetFilter: " + (new Date).getTime());
	
	//Clear CaseLog
	clearTabs();
	
	//All checkboxes
	var checkboxes = $(":checkbox");
	
	var values = {};
	
	checkboxes.each( function() 
	{
		//Slice off [property]Filter
		var property = this.name.slice(0,-6);
		
		//Create new property
		if(values[property] == null)
		{
			//console.log("new property " + property);
			values[property] = [];
		}
		
		if(this.checked)
		{
			//console.log(property + ": " + this.id);
			values[property].push(this.id);
		}
	});
	
	console.log(values);
	
	//Build list of selected filters from checkboxes
	filterGraph(listFromResolution(values));
	
	console.log("-GetFilter: " + (new Date).getTime());
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
	//JQuery get all inputs by name
	var checkboxes = $("input[name='" + name + "']");

	massFlag = 1;
	
	checkboxes.each(function() 
	{
		//Triggers event on slider that is actually switching
		if ($(this).prop('checked') != value)
		{			
			
			//Set CB to checked and trigger event for filtering
			$(this).prop('checked', value).change();
			
		}
		//Bonus - don't sort if all clicked and nothing changes.
	});
	
	getFilter();
	
	massFlag = 0;
}