# https://accounts.google.com/b/0/DisplayUnlockCaptcha

<#
TODO
- Search by: CaseID, Component, contents??
- Tick boxes for component?
- Favourite cases?
- Case result be data driven rather than magic
- Store map of 'Tags' and reference in ticket as ###Name:Value###
- Look into keep api and replace with powershell? javascript???
#>

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
	
	#Maps [Tag] -> Value - Initially for Result but can be expanded for Component, Favourite etc.
	$tags = @{}
	
	#Hex for colour to draw as
	$color
	
	static $mostWeeks = 0
	
	#Create new case from first note
	Case($num, $desc, $initCaseLog, $initWeek, [hashtable]$newTags)
	{
		"CONSTRUCTOR"
		$this.number = $num

		$this.description = $desc

		$this.caseLog = "<b>W" + $initWeek + ":</b> " + $initCaseLog
		
		$this.weekCount = 1
		
		#On creation 0 weeks of work have been done the week before. This allows all cases to be a line on the graph rather than a single point.
		$this.workLog = @{}
		$this.workLog["W$($initWeek - 1)"] = 0
		$this.workLog["W$initWeek"] = $this.weekCount
		
		#Set the line colour for this case here so it doesn't need to be re-calculated on every re-draw
		$this.GetColor()

		#Add new tags to object
		foreach($tag in $newTags.keys)
		{
			"$tag => $($newTags[$tag])"
			$this.tags[$tag] = $newTags[$tag]
		}
	}
	
	#Append log to existing case and update worklog
	Add($newCaseLog, $week, $newTags)
	{
		$this.caseLog = $this.caseLog + "<br><br><b>W" + $week + ":</b> " + $newCaseLog
		$this.weekCount += 1
		
		if ($this.weekCount -gt [Case]::mostWeeks)
		{
			[Case]::mostWeeks = $this.weekCount
		}
		
		$this.workLog["W$week"] = $this.weekCount

		#Update existing tags or add new ones (PS does this automatically 
		foreach($tag in $newTags.keys)
		{
			$this.tags[$tag] = $newTags[$tag]
		}
	}
	
	#Sha1 hash the case number and use the first 6 characters as the colour for the line
	GetColor()
	{
		#I stole this from stack overflow
		$bytes = [system.Text.Encoding]::UTF8.GetBytes($this.number)
		$algorithm = [System.Security.Cryptography.HashAlgorithm]::Create('SHA1')
		$StringBuilder = New-Object System.Text.StringBuilder 
	  
		$algorithm.ComputeHash($bytes) | ForEach-Object { 
			$null = $StringBuilder.Append($_.ToString("x2")) 
		}	 
		$this.color = $StringBuilder.ToString().Substring(0,6) 
	}
}

Function toWebpage
{
	$cases_map = $args[0]

	#$data is a javascript string that will be added to the base html file
	#it contains the dataTable for the charts api
	$data = "data.addColumn({type:'string', role:'domain', label:'Week'});"
	
	#The graph legend is in addition order, so sort here to ensure they are sensibly ordered.
	$sortedEnum = $($cases_map.GetEnumerator() | sort -Property name)
	
	#Add a column to the data table for each case. Each case also has a tooltip column with label '[Case#]T'.
	foreach( $k in $sortedEnum.Name)
	{
		#Actual Data
		$data = $data + "`ndata.addColumn({type:'number', role:'data', label:'" + $k + "'});"
		#Tooltip
		$data = $data + "`ndata.addColumn({type:'string', role:'tooltip', label:'" + $k + "T'});"
		#Line Colour
		$data = $data + "`ndata.addColumn({type:'string', role:'style', label:'" + $k + "S'});"
	}
	
	#i starts at 0 for cases that begin in W1
	$i = 0
	
	#Each row is a week. A Cell corresponds to a case and a week, and denotes how many weeks of work have been done on the case.
	#Nulls are currently interpolated, might fill out to give flat sections later
	$data = $data + "`n" + "data. addRows(["
	do
	{
		#First column is week number
		$data = $data + "`n['$i'"
		
		#Cases sorted by case number. This doesn't matter now the legend is hidden but I might need it in the future.
		foreach($case in $sortedEnum)
		{	
			
			$val = $case.value.workLog["W$i"]
			
			if ($val -eq $null) {
				#Value must be null string not actually null as it will be run as JS
				$val = "null"
				$tooltip = "''"
			}
			else
			{
				#tooltip shows on hover over the graph line
				$tooltip = "'" + $case.value.number + ": " + $case.value.description + "'"
			}
			#add two cells to the current row - the data then the tooltip for the current case.
			
			$data = $data + "," + $val + "," + $tooltip + "," + "'color: #" + $case.value.color + ";'"
		}
		#Close data row
		$data = $data + "],"
		$i++
	}
	while($i -lt 52)
	$data = $data + "]);"
	
	#Initially I had this in the loop above then realised I didn't need to do it 52 times :/
	
	#CaseInfo is extra data not contained in the graph - the CaseLog and result mapped by caseNumber
	$addCaseInfo = ""
	foreach($case in $sortedEnum)
	{	
		#Create CaseInfo item, Case number maps to a list containing Description (tooltip), CaseLog String as HTML and result.
		$addCaseInfo = $addCaseInfo + "CaseInfo['" + $case.value.number + "'] = ['" + $case.value.description + "','" + $case.value.caseLog + "','" + $case.value.tags["Result"] + "']`n"
	}
	
	#Read base HTML file
	$pwd = Get-Location
	$JSbase = [IO.File]::ReadAllText("$pwd\JSbase.js") 

	#Replace variables
	$JSout = $JSbase.replace('$addCaseInfo', $addCaseInfo).replace('$data',$data).replace('$mostWeeks',[Case]::mostWeeks)
	
	#Write Out as UTF8 to prevent powershell wide chars
	$JSout | Out-File CasesGraphJS.js -Encoding UTF8

	Invoke-Item CasesGraph.html #open html file with default reader (browser).
}

Function parseWeek
{
	$cases_map = $args[0]
	$week = $args[1]
	$text = $args[2]

	$s_content = $text -split "(<br>)+? *- " #Split case notes on line breaks and hyphen bullet points
			
	foreach ($case in $s_content)
	{
		if ($case -eq "<br>") { continue } #Skip delimiters
	
		$f2 = $case -match '(?: - )*([0-9]+) \*(.*?)\* (.*)' #Brackets return to matches variable in case you forgot. (?: ...) groups but doesn't return.
		#Match Case number, description in * * and contents
		
		if ($f2)
		{				
			$CaseNum = $matches[1]
			$CaseDesc = $matches[2]
			$CaseLog = $matches[3]
			
			$CaseTags = @{}
			
			while($CaseLog -match '###(.*?):(.*?)###') #Get tag if it exisits
			{			
				#Repeatedly find tags in case and remove until there are no more.
				$CaseTags[$matches[1]] = $matches[2]
				[regex]$pattern = '###.*?:.*?###'
				$CaseLog = $pattern.replace($CaseLog, '', 1) #Remove only first instance instead of all.
			}
			if ($cases_map[$CaseNum] -eq $null)
			{
				#Create object if doesn't exist
				
				if ($CaseTags["Result"] -eq $null)
				{
					$CaseTags["Result"] = "Unresolved"
				}
				$cases_map[$CaseNum] = New-Object -TypeName Case -ArgumentList ($CaseNum, $CaseDesc, $CaseLog, $week, $CaseTags)
			}
			else
			{
				#Add to existing object
				$cases_map[$CaseNum].add($CaseLog,$week,$CaseTags)
			}
		}
	}
}

Function pause ($message)
{
    # Check if running Powershell ISE
    if ($psISE)
    {
        Add-Type -AssemblyName System.Windows.Forms
        [System.Windows.Forms.MessageBox]::Show("$message")
    }
    else
    {
        Write-Host "$message" -ForegroundColor Yellow
        $x = $host.ui.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}

Function main
{
	#Map [Case Number] -> [Case Object]
	$cases_map = @{} 
	
	#Exit after 5 failed attempts
	$attempts = 5
	
	do
	{
		#Prevent console error on cancel/exit
		try
		{
			$cred = Get-Credential
		}
		catch
		{
			"Get-Credential Cancelled"
			return
		}
		
		if ($cred -eq $null)
		{
			#Credentials not filled out
			"Error getting credentials, null"
		}
		else
		{
			#Build command only if $cred is not null
			$command = ".\pyScraper.py " + $cred.UserName + " " + $cred.GetNetworkCredential().Password
		
			#Runs command to execute little python api caller - requires gkeepapi python library
			$Raw = Invoke-Expression $command
			
			if ($Raw -match '^Success')
			{
				Write-Host "Login Succesful" -ForegroundColor Green
				break
			}
			if ($Raw -match "<class 'gkeepapi.exception.LoginException'>")
			{
				if ($Raw -match "BadAuthentication")
				{
					Write-Host "Login Details Incorrect"  -ForegroundColor Red
					
				}
				elseif ($Raw -match "NeedsBrowser")
				{
					#Google requires this check to prevent too much automation
					Start-Process -FilePath "https://accounts.google.com/b/0/DisplayUnlockCaptcha"
					pause("Press Enter once Captcha is accepted...")
					"Re-trying Login..."
					#Once accepted it persists for a few minutes
					$Raw = Invoke-Expression $command
					if ($Raw -match 'Success')
					{
						#Login details must be incorrect to get this error, so no need to check for error
						Write-Host "Login Succesful" -ForegroundColor Green
						break
					}
				}
			}
		}
		$attempts -= 1
		Write-Host $attempts "Attempts remaining"
	}
	while($attempts -gt 0)
	
	if ($attempts -eq 0)
	{
		"Too many failed login attempts"
		return
	}
	
	$buf = ""
	$key = ""
	
	foreach ($line in $Raw)
	{
		if ($line -match 'W([1-9][0-9]*):')
		{
			if ($key -ne "")
			{
				parseWeek $cases_map $key $buf
			}
			
			$buf = ""
			$key = $matches[1]
		}
		else
		{
			$buf = $buf + "<br>" + $line
		}
	}
	parseWeek $cases_map $key $buf
	toWebpage $cases_map
}

main