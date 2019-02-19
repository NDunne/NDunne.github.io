class Case
{
	#Case number WINEP - #####
	$number
	
	#Short description
	$description
	
	#Concat all case info from notes
	$caseLog
	
	#Current week count
	$weekCount
	
	#Maps [W#] -> [#W] Week number to number of weeks worked on.
	$workLog
	
	#Create new case from first note
	Case($num, $desc, $initCaseLog, $initWeek)
	{
		"CONSTRUCTOR"
		$this.number = $num
		$num
		$this.description = $desc
		$desc
		$this.caseLog = "<b>W" + $initWeek + ":</b> " + $initCaseLog
		
		$this.weekCount = 1
		$this.workLog = @{}
		$this.workLog["W$($initWeek - 1)"] = 0
		$this.workLog["W$initWeek"] = $this.weekCount
	}
	
	#Append log to existing case and update worklog
	Add($newCaseLog, $week)
	{
		$this.caseLog = $this.caseLog + "<br><br><b>W" + $week + ":</b> " + $newCaseLog
		$this.weekCount += 1
		$this.workLog["W$week"] = $this.weekCount
	}
}

Function toHTML($cases_map)
{
	$data = "data.addColumn({type:'string', role:'domain', label:'Week'});"
	
	$sortedEnum = $($cases_map.GetEnumerator() | sort -Property name)
	
	foreach( $k in $sortedEnum.Name)
	{
		$data = $data + "`ndata.addColumn({type:'number', role:'data', label:'" + $k + "'});`ndata.addColumn({type:'string', role:'tooltip', label:'" + $k + "T'});"
	}
	$i = 1
	
	$data = $data + "`n" + "data. addRows(["
	do
	{
		$data = $data + "`n['$i'"
		$addCaseInfo = ""
		foreach($case in $sortedEnum)
		{	
			$val = $case.value.workLog["W$i"]
			
			if ($val -eq $null) {
				$val = "null"
				$tooltip = "''"
			}
			else
			{
				$tooltip = "'" + $case.value.number + ": " + $case.value.description + "'"
			}
			$data = $data + "," + $val + "," + $tooltip
			$addCaseInfo = $addCaseInfo + "CaseInfo['" + $case.value.number + "'] = ['" + $case.value.description + "','" + $case.value.caseLog + "']`n"
		}
		$data = $data + "],"
		$i++
	}
	while($i -lt 35)
	$data = $data + "]);"
	
	#todo https://developers.google.com/chart/interactive/docs/customizing_tooltip_content
	# tooltip action to show case log in another div
	
	$pwd = Get-Location
	$base = [IO.File]::ReadAllText("$pwd\base.html") 

	$page = $base.replace('$addCaseInfo', $addCaseInfo).replace('$str',$data)
	
	$page | Out-File CasesGraph.html -Encoding UTF8
	Invoke-Item CasesGraph.html
}

Function main
{
	#Map [Case Number] -> [Case Object]
	$cases_map = @{} 

	$pwd = Get-Location
	
	$files = (Get-ChildItem "$pwd\Keep\" | Where-Object {$_.Name -match "W.*"}).Name -replace "W([0-9]) ", "W0`$1 "
	
	$files = $files | Sort-Object
	#Get all files sorted and excluding non related files
	
	foreach ($file in $files)
	{	
		$file = $file -replace "W0([0-9]) ", "W`$1 "
		
		$URI = "file:\\\$pwd\Keep\$file"
		$HTML = Invoke-WebRequest $URI
		#parse as HTML
		
		$f = $file -match 'W([0-9]+) '
		if ($f)
		{
			$week = $matches[1]
		}
		
		$found = $HTML.RawContent -match '<div class="content">(.*?)</div>'
		#Get Content tag text
		
		if ($found)
		{
			$content = $matches[1]
			$s_content = $content -split "(<br>)+? *- " #Split case notes on line breaks and hyphen bullet points
			
			foreach ($case in $s_content)
			{
				
				if ($case -eq "<br>") { continue } #Skip delimiters
				$f2 = $case -match '(?: - )*([0-9]+) \*(.*?)\* (.*)'
				#Match Case number, description in * * and contents
				
				if ($f2)
				{
					$CaseNum = $matches[1]
					if ($cases_map[$CaseNum] -eq $null)
					{
						#Create object if doesn't exist
						$cases_map[$CaseNum] = New-Object -TypeName Case -ArgumentList $CaseNum,$matches[2],$matches[3],$week
					}
					else
					{
						#Add to existing object
						$cases_map[$CaseNum].add($matches[3],$week)
					}
				}
			}
		}		
	}
	toHTML($cases_map)
	#Read-Host -Prompt "Press Enter to Exit"
}

main