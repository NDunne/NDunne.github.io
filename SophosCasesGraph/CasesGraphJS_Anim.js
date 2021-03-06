﻿/* TODO

- animate rows maybe rather than columns
*/

//global CaseInfo object
CaseInfo = new Object();
massFlag = 0;

//powershell variable replaced by values
CaseInfo['00000'] = {description:'Health Trails Tool', caseLog:'<b>W5:</b> Creating a C++/.NET tool to view and query JSON objects created by SophosHealth in a GUI. <br><br><b>W6:</b>  Functional now, but more to do<br>~ Groups Health Events by various categories<br>~ Sorts<br>~ View data<br><br><b>W7:</b> Added setup batch file to install C++ redistributale, and create reg keys to allow context right-click launch for sdu root and Trails folder.<br>Also updated UI to show a table of a child events when parent is clicked. More css is required tho!<br>', color:'693410', Result:'Suggested Fix'};
CaseInfo['00001'] = {description:'Case Grapher', caseLog:'<b>W32:</b> Working on powershell/javascript to parse case notes into progress graph using google charts api. Clicking on graph shows case history, and now all cases below the point clicked (this is not in the api as far as I can see). Powershell is used to take html notes files and compress cases into objects, then tabulate in javascript and draw with google charts. Output is a single html file that is easily transported and opened on any computer. <br><br><b>W33:</b> Working in Javascript to allow filtering of the graph using DataView class from Google charts API. Also commited to github for easier working. <br><br>Added button to filter and changed caseLog grouping to always pull from a view as it didn&#x27;t work when filtered before, due to reading row/column from the original dataTable when the columns don&#x27;t line up any more. Also implemented CaseLog info when clicking on the legend.<br><br><b>W34:</b> Trying to scrape data from webpage instead of manual takeout, by creating a browser instance and interacting with html elements via powershell, but its not easy as nothing has an id :/ Moving to a python 3rd party api with strong results. The format received is different so having to alter main though. It seems to be working after some fiddling to get everything in the right order, but I don&#x27;t think the description is right?<br><br>Managed to get it working with the scraper and very happy with it. Did have to add a credentials section and handling for various cases including cancel, wrong password, google captcha required and correct. Also, swapped the buttons in HTML out for checkboxes and updated the onclick functions to handle this. Currently the implementation isn&#x27;t great {O(n^2)} but meh I can&#x27;t think of a better way immediately, seeing as the filtering has to be pure javascript and can&#x27;t go back to powershell.<br><br>Its now hosted live on github so I hope I dont get in trouble for having my notes public... I also added a style column to the table for each line, and set the line colour based on the SHA1 hash of the case number, meaning it can stay constant when re-filtering (by default column number defines colour). The styling is supposed to be section specific though, so the legend has the wrong colours. Don&#x27;t think there is an easy workaround here so it&#x27;s hidden for now.<br><br>Next up: make it pretty! Tabs for cases being shown, a help section on how to read the graph now there is no Legend, maybe some CSS<br><br><b>W38:</b> Swapped the result tag for a tagging system where any word can be applied as a key:value pair. to support this the JS map now contains an object with K:V pairs rather than an array requiring context. This means that any new word used as a key in a case note will generate a new row of checkboxes (based on the order they are found), and can be filtered using it. New values for that tag are also data driven rather than pre-defined. Also allowed the graph to draw empty when there are no matches, and re-wrote the filtering system to be less stupid. Should probably add an &quot;other&quot; checkbox by default as now if a case does not have a value for a checkbox it is gone as soon as you filter.<br><br><b>W39:</b> using more bootstrap for the filters, struggling to not have it sort the graph 18 times (performance noticable) when clicking all buttons as each slider receives a change event. Also component - other is broken somehow.<br>Fixed the performance issue by having the onChange listener check a global flag to see if it was changed by a mass button, and not call the filter if it was. The mass buttons then call the filter separately so it is always called once. I also added tabs for the caselog, which took a while as I didn&#x27;t know html ids cannot start with a number.', color:'9d97a5', Result:'Suggested Fix'};
CaseInfo['12724'] = {description:'Detection of &#x27;both&#x27; location takes 5 minutes', caseLog:'<b>W21:</b> Logs suggest system is waiting for a lot of DNS queries to time out, as each adapter has multiple ip addresses, and each one is retried 3 times, taking 12 seconds each time. In code found a reg key to alter retry number, requested cx change to 1 to lower delay?  ', color:'c6a3d2', Result:'Expected', Component:'Client Firewall'};
CaseInfo['13785'] = {description:'Only one confirmation dialogue with attaching files to email for ~3s', caseLog:'<b>W4:</b> Initially believed to be caching action and retrieving incorrect cached action, dug through *lots* of data control code to determine key. Issue appears to actually be with repeat acknowledgement suppressor, meant to be for the same action and file in a short time. Equality operator of Acknowledgement objects reference attribute SourceFilename not set in DataControlRequest objects where Check Type is File Open (which attaching to email does). <br><br>Confirmed behaviour is the same with other File Open actions. Confirmed lack of string in local values by breaking in with debugger, comparing FileOpen locals to FileCopy (which displays all acknowledgement dialogues). FileOpen has blank strings where FileCopy has the full file path. Suggested a 1 line fix based on similar operation in the caching logic.  <br>Potential Workaround of setting old Ack. timeouts to 0 not configurable :/', color:'3b1503', Result:'Suggested Fix', Component:'Data Control'};
CaseInfo['13854'] = {description:'Wifi adapter device instance ID script', caseLog:'<b>W1:</b> Wrote powershell script to help Emile with this case. Retrieves instance ID from active Wifi adapter device.<br>', color:'3e115a', Result:'Transferred'};
CaseInfo['14171'] = {description:'SSPService crashing infrequently', caseLog:'<b>W4:</b> Logging generally unhelpful, dumps give stack trace. Code analysis allows crashing code to be exercised, does not crash every time, possible deadlock with spinlock timeout? <br><br><b>W5:</b> Update: Primary cause of crashes (for which dumps were provided) turns out to be duplicate. Recommended workaround from other ticket, investigation continues for non-duplicate crashes  ', color:'9884ac', Result:'Known Bug', Component:'SSP Service'};
CaseInfo['14202'] = {description:'Multiple Emails from single Virus detections', caseLog:'<b>W4:</b> (OPM) - Confirmed with original dev that multiple log detections is sometimes expected as shell extensions can open file on double click, and Windows indexer etc. Noted events are written as JSON to a folder for SMTPConsumer to send out, dug into smtp consumer. Noted events are batched until queue is idle, 25 events are batched or user attached to batch changes. Shell extensions where accessing file as both current User &amp; System, and switch resulted in email sent, so worst case new email for every shell extension (if alternating). Confirmed behaviour by accessing file (via &gt;runas) with dummy user after double click but before cleanup and observing seperate email.<br>Suggested System user not trigger new batch, as System events can be generated by a user action.  ', color:'94bd71', Result:'New Bug', Component:'SMTP Consumer'};
CaseInfo['14566'] = {description:'Spreadsheets flagged as &quot;Script/Markup&quot;', caseLog:'<b>W2:</b> Data Control policy flags .xlsx files as &quot;Script/Markup&quot; type. Issue believed to be browser specific so assigned to WINEP, however proved that issue only occurs on IE download as IE is the only one to perform a Data Control scan on download, other browsers do not perform file open action. <br>Uploading .xlsx files to all browsers but Edge (not supported) resulted in a flag, due to XML content of extracted archive.  ', color:'4f12d0', Result:'Expected', Component:'Data Control'};
CaseInfo['14780'] = {description:'Edge failing to access intranet sites', caseLog:'<b>W1:</b> With Sophos Web Intelligence Filter (swi_fc) running Edge cannot connect to intranet sites. Reg key allows access, not created with swi_fc. Added url to Intranet zone to work around, and raised ticket with Microsoft inquiring about new behaviour.  ', color:'3cb106', Result:'Transferred', Component:'Web Intelligence'};
CaseInfo['14813'] = {description:'Timed Web Controls not taking effect', caseLog:'<b>W1:</b> Schedule on web controls reverting to base policy, but only when multiple schedules exist. One schedule results expected behaviour. Discovered bug in control LUA, unavoidable return on first FOR Loop iteration, corrected to only return on TRUE. LUA change released: 2018.31<br><br>function Policy:matchTimeRange(request, schedules)<br>     trace(&#x27;matchTimeRange()&#x27;)<br>     û Sunday 1, Monday 2 ...<br>     local wday = tostring(request.wday)<br>     for _, s in ipairs(schedules) do<br>         if s[wday] then<br>             trace (&#x27; - Policy day matches current day [&#x27;.. wday ..&#x27;]&#x27;)<br>             return IsBetweenTimes (request.time, s.from, s.to)<br>         else<br>             trace (&#x27; - Policy day does not match current day [&#x27;.. wday ..&#x27;]&#x27;)<br>             return false<br>         end<br>     end<br>     return false<br> end<br>Should be:<br><br>function Policy:matchTimeRange(request, schedules)<br>    trace(&#x27;matchTimeRange()&#x27;)<br>    -- Sunday 1, Monday 2 ...<br>    local wday = tostring(request.wday)<br>    for _, s in ipairs(schedules) do<br>        if s[wday] then<br>            trace (&#x27; - Policy day matches current day [&#x27;.. wday ..&#x27;]&#x27;)<br>            if IsBetweenTimes(request.time, s.from, s.to) then<br>                return true<br>            end<br>        else<br>            trace (&#x27; - Policy day does not match current day [&#x27;.. wday ..&#x27;]&#x27;)<br>            return false<br>        end<br>    end<br>    return false<br>end<br><br> To prevent immediate false return if first schedule found in the list does not match current time.  ', color:'77b9f7', Result:'Suggested Fix', Component:'Web Control'};
CaseInfo['14870'] = {description:'Build times increased', caseLog:'<b>W1:</b> Control Flow Guard enabled processes taking longer with Sophos Endpoint Defence running - reproduced through small script to call 1000 enabled and not enabled processes. Attributed to slow memory region enumeration.  ', color:'666d71', Result:'Known Bug', Component:'Endpoint Defense'};
CaseInfo['14952'] = {description:'IE hanging on some downloads', caseLog:'<b>W2:</b> Related to previous, found some data loss prevention rules caused a hang in IE when a DLP scan was performed. Tool analysis with ConanCli.exe showed text extraction of some files was very slow and resulted in massive output file, leading to subsequent slow Regex checks. Raised CPISSUE ticket on slow SAVI text extraction and found workaround for cx.<br><br><b>W3:</b> Update: CPISSUE returns SAVI not behaving unexpectedly, found workaround from old ticket that DLP is not applied to user created folders underneath C:\Users\[Username]. Suggested Cx create folder here and download to it if frequently experiencing the hang.  ', color:'89e74f', Result:'Workaround', Component:'Data Control'};
CaseInfo['14996'] = {description:'Lack of USB Block Notifications', caseLog:'<b>W3:</b> When USB devices are blocked, a notification of why the device is not working is only given the first time. Used call stack of registry calls from sdcservice to identify cpp function responsible for the check when a notification is given. Identified build version with Credential Checker and Ballista (warehouse manager), and attached Visual Studio to process to add breakpoints and break on 2 potential functions. Call path of function revealed difference between when a new device is converted from unblocked to blocked and inserting a previously blocked device. File history on Perforce showed dev who implemented change, discussed and resolved as initially intentional behaviour. MRB decided to implement cx expected functionality by alerting the user (max 1 per minute) but alert to central.  ', color:'0e0c92', Result:'Feature Request', Component:'Device Control'};
CaseInfo['15037'] = {description:'SAV install failing on Custom action', caseLog:'<b>W2:</b> SAV install custom action referenced Reg key that was never created, as installer deemed that it already existed from presence of files from previous version. Created .msi with Wix to show total reg keys was related to size of registry table, and compare successful logs to failed ones from cx. Sophos Auto Updater removed by new installer, so couldn&#x27;t update previous version. Solution: find cached .msi from upgrade attempt and re-run with force overwrite flags to ensure old files are not ignored (untested).<br><br><b>W3:</b> Update: Cached .msi files did not exist, but deleting stale registry keys resolved error.  ', color:'5646f6', Result:'Environment Issue', Component:'Installer'};
CaseInfo['15302'] = {description:'2 USB sticks not blocked by DevC', caseLog:'<b>W7:</b> Device Control USB blanket ignoring certain device. explicit exemption also ignores them. Initially believed to be policy issue as explicit exceptions not appearing in machine.xml, however this is expected. Verbose sdcservice logs required as it appears the monitoring thread always fails to stop because it is not running when the service is stopped. No indication of why the service is stopped, or when the thread stops as the service reports starting correctly.<br><br><b>W8:</b> UPDATE: new logs provided, EnableDisable does start and run correctly, occasionally stopped by unidentified new thread (No PML), but ApplyConfig is no-where to be seen.<br><br><b>W11:</b> Storage control is reported as &quot;not requried&quot; when starting, meaning no devicetypes in the config list of type &quot;storage&quot; are marked as &quot;Blocked&quot; or &quot;ReadOnly&quot;. Need to revisit strange AlertOnly policy behaviour. In Machine xml the DisabledDeviceListManager shows devices of other types under &quot;alertOnly devices&quot;, &quot;DisabledDevices&quot; is empty. No reference to any storage devices. Interestingly in cx logs &quot;Removable Device&quot; is in Japanese while others are not.<br>Returned to initial SDU to check MCS logs. Policy arrives appearing correct, however some exclusions do not have an &quot;access&quot; attribute. Experimentation shows that this causes a policy to be processed without error, but not pushed to DEVCAdapter or machine.xml. Generated a policy XML from theirs without erroneous lines, and asked cx to drop into Persist folder to apply. Should allow USB devices to be blocked at least. Need to talk to Central on why the policy is coming down wrong.<br><br><b>W13:</b> confirmed details for Japanese office, waiting on reply <br><br><b>W14:</b> recreating policy resolved issue. Opened CESG-4688 to investigate exclusions arriving without access level in policy.  ', color:'994f32', Result:'Environment Issue', Component:'Device Control'};
CaseInfo['15413'] = {description:'Winsock catalog unexpected update', caseLog:'<b>W8:</b> Other applications failing to reconnect automatically on sleep exit, identified as conflict with Stormshield, where Windows sockets are re assigned by swi on start, and change is not pushed back to the winsock catalog.  Logs show when SLP checks itself (on start and every hour) it initally fails to bind a socket (access Denied), causing a re-install - leading to re-allocation of Winsock catalogue on startup. Access Denied is not inherent as the process is able to re validate after re-install. <br><br><b>W11:</b> Stormshield devs reported issue is no longer occurring with latest update after receiving knowledge of the cause of the issue. Confirmed to the cx that the issue is still possible, but very unlikely and only on Windows 7.  ', color:'c1d6e0', Result:'Environment Issue', Component:'Web Intelligence'};
CaseInfo['15452'] = {description:'Delay saving office files to NAS', caseLog:'<b>W6:</b> Slow save to NAS. Setting up trial version to reproduce. Unable to succesfully create test cluster, ProcMon analysis shows several other processes, including some Symantec, running during save delay. <br><br><b>W7:</b> Priority raised. Another ticket came up for delay in FileScanner related to Symantec PGP desktop encryption, potentially related? Each PML shows certain instructions hanging for up to 30s, but not consistent which one. Some are Excel operations with no Sophos in the stack! Researched OpLocks, recommended cx disable them to see if there is any improvement.<br><br><b>W11:</b> seen by Emile, confirmed as bug with lease oplocks by Dell KBA, cx refusing to contact Dell despite this being recommended action. ', color:'c9f526', Result:'Environment Issue'};
CaseInfo['15532'] = {description:'productState possible values', caseLog:'<b>W6:</b> Research possible values for &quot;productState&quot; from <br><br>&#x27;Get-WmiObject -Namespace root\securitycenter2 -class antivirusproduct&#x27;<br><br>Very undocumented! Found to be a combination of Windows constants, passed to product management to decide if the information should be made public to cx<br><br><b>W11:</b> powershell script reports status of components. Modify to apply only to Sophos?<br><br><b>W12:</b> Case revisited, confirmed previous findings and generated powershell to break down value. First byte remains a mystery. Sophos Enum sets values 0,1 and WMI enum sets 4,8 but result is always 5. unable to disable AV/AS separately so difficult to determine root. Modified Powershell to show compenents and also breakdown value of productState. ', color:'c67f45', Result:'Expected'};
CaseInfo['15616'] = {description:'Live Protection stopping fax service', caseLog:'<b>W14:</b> New logs/PML/Wireshark. Cx claims Live Protection is causing issue, however wireshark shows no DNS queries (SW: SXL). Nothing clear in ProcMon or logs to indicate a failure. License key obtained from VIA-FAX vendors, but unable to replicate. Requested logging from Fax service.<br><br><b>W15:</b> issue is reproducible by enabling Malicious Traffic Detection and enabling Connection Tracking. Newest logs and PML match inital PML, with parent process stopping after 1 minute. VSI-FAX logs support this showing all child processes failing to start, therefore the parent stops itself, however the children do start in a procmon. Discovered inter-process communication through UDP-DCERPC protocol in working PML, which seems to be each process reporting itself as started to the parent. These packets are never received by the parent (blocked by MTD as related to privilege escalation exploit?), so it stops itself and leaves the 4 child processes running but not doing anything. One of these is still bound to 192.168.0.1, causing the next time the service starts to stop immediately as unable to bind to the port. This is what the second WireShark and PML were of. <br><br><b>W16:</b> Confirmed a change in MTD driver 1.7 to ignore loopback traffic alleviates the issue. New info is that MTD always drops an intercepted packet, and re-injects a copy if it is allowed, so potentially this copy is not sufficient for the parent process to accept, as the event is not returned to central as a block/drop. ', color:'62b47f', Result:'New Bug', Component:'NetAV (MTD)'};
CaseInfo['15728'] = {description:'Unexpected DatC alert from NTFS FileStream', caseLog:'<b>W12:</b> Cx provided significant reproduction detail for 7 cases. Case 1 is simplest repros easily. Many other cases relate to policy not applying between users, e.g. log in test, lock, log in with un-managed account and DLP still applies, or using runas to execute as another user. This relates to policy, only one set of policy is stored locally, so new user policy must be pulled down before coming into effect. Potentially an issue with MCSAgent receiving 503 instead of new policy for upwards of 20 minutes after switching user account a lot though.<br>$Quota:$Q filestream is blocked as cx explained. In logs $Q for non removable drives is marked Not a File so no DatC check, unless exclusion &quot;*\$Extend\$Quota*&quot; applied, when it *is* scanned and allowed. The filestream itself is not significant, as creation of a dummy filestream (set-content -Path E:\dummy.csv -Stream dummyStream) is similarly blocked on creation. Same process for file on fixed disk reports &quot;zero length file&quot;.<br><br><b>W13:</b> Found a global exclusion that works, but the same exclusion doesn&#x27;t seem to help as just on the DLP policy rule. Emailed Ian Fry for assistance.<br><br><b>W14:</b> potentially found a modification to factory.xml that excludes from data control only. Perhaps a permanent addition? Modification returned to cx to test. DatC check is DestinationOnly so only Process Exclusions apply.<br><br><b>W15:</b> Cx has confirmed that the InterCheck Exclusion in factory.xml worked as expected, so passed the change to MRB for review. NB: factory.xml was from an old sdu, so needed to be updated by cx as it broke device control.  ', color:'97d5d8', Result:'Suggested Fix', Component:'Data Control'};
CaseInfo['16251'] = {description:'Slow first boot non-persistent VDIs', caseLog:'<b>W29:</b> Older case, ETL trace casts doubt on initial analysis as it seems unlikely that Real Time Internet almost solves the problem when disabled, and also MTD. Timings are definitely not fixed like a set timeout.', color:'b7b4ac', Result:'Unresolved'};
CaseInfo['16337'] = {description:'Slow xls file folder copy to server', caseLog:'<b>W17:</b> initially had lots of logging, but too many variables. Narrowed to disabling On-Access on the client as the cause of the slowdown, noticable by enabling and disabling mid copy. Collected etl trace.<br><br><b>W31:</b> Issue resolved for customer without further input. ', color:'91af3a', Result:'Environment Issue'};
CaseInfo['16385'] = {description:'PUA not restored with Dell Encryption', caseLog:'<b>W15:</b> Cx provided software but it requires a management console. Logs show Checkhash() is failing so requested SSP BPALOGGING, and also &#x27;failed to restore threat_id&#x27; which is reproducible by deleting/encrypting a .dat file in SafeStore folder. Tried EAP SNTP driver, no change.<br><br><b>W16:</b> Cx provided safestore folder for attempted repro of restore. Actually used SQL to query which process had threats marked restore_failed and which blobs these belonged to<br><br>select name, size, type from BlobPropertyTable natural join BlobTable where objectid in (select objectid from ThreatObjectTable where status = &#x27;restore_failed&#x27;) group by name, size;<br><br>select value from StringPropertyTable where type = &#x27;name&#x27; and objectid in (select objectid from ThreatObjectTable where status = &#x27;restore_failed&#x27;) group by value<br>:pskill64 - process failing to restore<br><br>select value from StringPropertyTable where type=&#x27;name&#x27; and objectid in (select objectid from BlobPropertyTable where blobid in (select blobid from BlobPropertyTable where objectid in (select objectid from ThreatObjectTable where status = &#x27;restore_failed&#x27;)) group by objectid) group by value;<br>: pskill64.exe - process with data sharing a blob with one failing to restore. phew<br><br>select threatguid, objectguid, ThreatObjectTable.objectid, value from ThreatObjectTable inner join StringPropertyTable on ThreatObjectTable.objectid = StringPropertyTable.objectid where StringPropertyTable.type = &#x27;name&#x27; order by threatguid<br>:cross reference with logs <br><br><b>W17:</b> Error message suggests file contents has changed. Emailed Stephen Wassell for advice.<br><br><b>W19:</b> ssr64 tool is able to restore all files tested except pskill64.exe which has a CSC redirect path as the location. not sure why this causes all to not be restored ', color:'31a963', Result:'Unresolved', Component:'Safestore'};
CaseInfo['16477'] = {description:'Japanese Server 2012 installer text garbled', caseLog:'<b>W17:</b> Debugged to find font load, as copying resource files to desired location works around issue. Windows API comes back ok, but it seems an object constructor isn&#x27;t assigning a value correctly. Debug build is required to debug properly as compiler optimisations mess with local values. Eventually decided that this case was not worth the time investment. ', color:'7069b6', Result:'Unresolved', Component:'Installer'};
CaseInfo['16527'] = {description:'Japanese new Error Message', caseLog:'<b>W16:</b> Upgrade from 10.8.1 to .2 caused new (benign) SAVI error message in logs. Looked through SAVI changelists and found nothing of note, and was also unable to replicate. Requested PML/verbose SAV log. <br><br><b>W17:</b> ThreatDetectionEngine.cpp line 880 loops through a set of processers having them check the file. On my machine SED complains that the file is Pending Delete, so the loop breaks and never reaches the VirusEngineAdapter&#x27;s CheckThis() function. On the Cx&#x27;s machine, SED reports &quot;not interested&quot; in the file, as they have non-Sync enabled, which allows repro of the issue. From comparing logs, on 10.8.1 the loop breaks on a scan PreProcessor because of the access denied, only logs at debug and skips the VirusEngine. From 10.8.2 a change allowed the loop to continue from this condition, meaning the VirusEngine does scan the file, and logs the access denied at Critical Level which the cxis seeing. CL: 2773892  ', color:'2a8965', Result:'Expected', Component:'Anti-Virus Service'};
CaseInfo['16554'] = {description:'Clean High Disk IO', caseLog:'<b>W16:</b> Cx had high disk I/O from clean on reboot. Unlinked ticket same customer showed they had a significant number of HMPA detections happening very frequently, each one queuing a system scan. Clean does allow 5s for more files to arrive, but if a scan is queued during one in progress it begins immediately straight after. Scans on 100GB of data are disk intensive surprisingly.  ', color:'14b022', Result:'Expected', Component:'Clean'};
CaseInfo['16598'] = {description:'MTD causes VOIP to drop calls', caseLog:'<b>W17:</b> Initial PML analysis suggested root cause may be the same as 15616, as lots of UDP sends without receives. Requested cxdisabled connection tracking, which did alleviate the issue, however the UDP traffic appears to be the same after. Requested more data.<br><br><b>W19:</b> Suggested for cx to try MTD v1.7 on the server as it shouldn&#x27;t conflict wih 1.5 service. Packets are changing order causing the server to cancel calls. More loopback traffic observed on working PML, therefore hoping for loopback exclusion to fix.<br><br><b>W20:</b> 1.7 Driver resolved the issue, however it is not officially released for Server yet. Recommended cx revert to a policy without MTD until March release. Cx also requested clarification on which exclusions they could remove.  ', color:'c10338', Result:'Known Bug', Component:'NetAV (MTD)'};
CaseInfo['16624'] = {description:'2GB+ upload fails on sendthisfile.com', caseLog:'<b>W18:</b> Initial repro - Chrome, Firefox, Edge all failed at ~28% with Sophos, all succeeded without. Found old case with change to add filter buffer limit and prevent timeout which resolves when enabled, so passed on to cx. Repro does seem to involve captcha though which only applies to free/trial accounts - cx is paid.<br><br><b>W28:</b> Remote Access: showed issue, excluded ips of file servers, installed wireshark and enabled logging (restart services) and it works. Uninstalled wireshark (rebooted), disabled logging (restart services) still works. Different UI (that I see) on other machine also still works. Seems to be related to 32bit process memory limit of 2GB. Observed the UI reach 100% once the whole file is loaded into memory by swi_fc, then memory usage begins to decline. Once it hits 0 the file is sent. Cancelling the send also does not immediately clear swi_fc&#x27;s memory, it persists for a while, then begins to drop at a steady rate. This means that after cancelling a request that was routed through swi_fc even a smaller request could cause the issue by pushing usage over 2gb. It seems that Windows 1809 allows IP exclusions to not be routed through swi_fc, so the cx can try upgrading, combined with IP exclusions for all the fileservers, to get around the issue. The only reason this is an issue is because send this file uploads with a single post request, rather than breaking the file down, so the whole file must be loaded into memory by swi_fc before it can be sent.  ', color:'b513c4', Result:'Environment Issue', Component:'Web Intelligence'};
CaseInfo['16665'] = {description:'Safestore restore failed', caseLog:'<b>W18:</b> Priority case, return code is &quot;Internal Error Occurred&quot;, very unspecific - many places this can be thrown from. Located source files but not project, allowing debug up to last function in PML before delete process begins. Identified which call the INTERNAL_ERROR comes from, on the 74th iteration of a decompression loop, a zlib function inflate() which returns BUF_ERROR - buffer not full or overfull. All returns except OK and END_STREAM result in INTERNAL ERROR being thrown here, which is fatal.<br><br>bp safestore64!decryptAndDecompressFile+0x3a7 &quot;j poi(fsize)&lt;0x2cdb694; &#x27;gc&#x27; &quot;<br>: Conditional breakpoint before function call to break before iteration where error occurs (fsize=0x2cc694) - otherwise continue (gc)<br><br>found inflate source, created D: drive, investigation continues.<br><br><b>W19:</b> Cx provided example file for testing, and issue is reproducible not just on Server 2012 but Win10 RS2 as well. Ticket mentioned pyInstaller package, so create executable from SuperOX py script, which is flagged as malware by ML but also restores successfully. Debugging compression process now on Win10.<br><br><b>W21:</b> Went to speak to Stephen Wassell who informed that Budapest is responsible for this functionality. Emailed Balßzs Zsiga who concurred there is an issue with the handling of the error, and suggested I raise a CPISSUE. Also, recommended to try setting the return value in the debugger (I had to learn how to interact with memory during debugging for this) and change the error code to not be INTERNAL_ERROR. When resumed the file restores successfully.  ', color:'a67085', Result:'New Bug', Component:'Safestore'};
CaseInfo['16666'] = {description:'Tesco unable to print', caseLog:'<b>W17:</b> Tesco software (winXP) is unable to create a BMP file for printing labels. If the file exists it can modify, and if SAVservice is disabled it can create. Exclusions are ineffective. Process Monitor running allows the file to be created successfully (filter driver issue?)<br><br><b>W18:</b> Disabled all Sophos functionality and recreated with procmon, managed to get an error code - 0xc000005a STATUS_INVALID_OWNER meaning the process cannot set the desired file owner. Same error message as a pop up when copying files into the folder. Noticed that D:\Program Files\  and subdirectories belong to an unresolved domain account, and setting to local admin resolves the issue. As yet unclear what the filter driver is doing to cause the file to be saved with this account as the owner, as when it works the local admin owns the .bmp file.<br><br><b>W19:</b> Used ApiMonitor to inspect NTCreateFile call - seems identical except one fails, but security  descriptor is NULL - default. <br><br><b>W22:</b> Still attempting to debug but the embedded OS is so far unsuccessful. Installed Windows XP of the same version, and POSReady7 next version to attempt to replicate. On all 3: Created new drive, created new admin, created new folder as admin and deleted account (owner is unresolved SID), then created file in folder. Cx OS failed as normal, and both others were successful indicating OS is likely significant. Unable to uninstall from Cx VM, or get clean POSReady2009 install so can&#x27;t rule out other software, but no filter drivers on Cx VM other than SR.<br><br><b>W27:</b> Product Management agreed the defect is not going to be fixed. ', color:'2f545f', Result:'Environment Issue'};
CaseInfo['16734'] = {description:'ESH Crash', caseLog:'<b>W19:</b> Seems from inital stack compared to source that the issue is a previous windows update is stored without a date, so when sorted on date an access violation is thrown. Subsequent dump stacks do not support this however, and cx reports that disabling the Windows Update service (which should cause the previous update enumeration to be skipped) does not rectify the issue. Cx recreated user profile and this resolved.  ', color:'c2f8b0', Result:'Environment Issue', Component:'Endpoint Self-Help'};
CaseInfo['16765'] = {description:'Options not re-enabled after override', caseLog:'<b>W20:</b> Repro steps provided by L3 turned out to be for similar behaviour to cx reported issue that is not unexpected. Cx logs show AppC, DatC and Internet scanning never report true, despite receiving new policy. Can repro the UI behaviour, where these functionalities do slide back to on automatically, but after policy the functionality is as expected. The slider becomes expected after tabbing to a different page and back. SAV adapter settings do not update live however<br><br><b>W22:</b> Confirmed with cx that issue is confined to the UI and the functionality is still there, therefore downgraded ticket from critical to major. Still unable to repro, but investigated source of status - McsAgent &lt;- SAVAdapter via AdapterCrossTalk interface. Unsure if able to reproduce, there does seem to be some behaviour where SAV adaptor sliders do not refresh live, but on my machine as soon as policy arrives  and the tab is refreshed the sliders return.<br><br><b>W23:</b> Confirmed with Trace logs that some adaptor properties do report false after receiving policy, but MCSAgent trace does not log inside the SAV adapter, this requires a debug version. Lots of digging through source trying to identify where the value comes from. It seems multiple adaptor dlls are involved so unlikely that the settings not enabled are truly random. <br><br><b>W39:</b> RA with Cx and GES, confirmed there is an issue, cx reports almost always with internet slider not any possible. Hips is sometimes also broken. It does seem that GES can reproduce but I cannot - Azim to clone his VM for me.', color:'525d6b', Result:'Unresolved', Component:'User Interface'};
CaseInfo['16828'] = {description:'Certain Exchange 2016 autoExclusion', caseLog:'<b>W19:</b> found old proposal ticket, emailed Nick Barefoot (reporter) who confirmed the work is indefinitely paused. Linked KBA recommending exclusions though.  ', color:'c8089c', Result:'Expected', Component:'Auto-Exclusions'};
CaseInfo['16842'] = {description:'PPT saving slowly Win10 v. Win7', caseLog:'<b>W19:</b> May be clone of issue solved in engine 2.1.4. Requested ETL trace and repro file if upgrade does not solve.<br><br><b>W20:</b> cx uploaded files along with fresh logs. Confirmed onPrem with engine 3.73 SAVservice is scanning for over a minute, Central with engine 3.74 has no significant delay. File does also contain emf data which is mentioned in the initial issue ticket. Requested cx to check veex.dll version, and retest once upgraded, as release is between Nov 20th &amp; Dec 4th.  ', color:'dba9c1', Result:'Known Bug', Component:'Anti-Virus Service'};
CaseInfo['16852'] = {description:'Some DLP events not reported', caseLog:'<b>W20:</b> Initial analysis was Destination Only scans were not being reported, as all events in &quot;broken&quot; computer were DO, however cx reports they are aware of this limitation, and performing the same test (copy file from desktop to USB with explorer) is reported differently on different machines. Logs do not support this, so requested more with verbose SAV and PML. ', color:'1ce49e', Result:'Unresolved', Component:'Data Control'};
CaseInfo['16857'] = {description:'ESH UC not showing status correctly', caseLog:'<b>W20:</b> Exists old ticket where UC logs rotate so last status can&#x27;t be found, but this has been fixed and status is now in xml file. Cx&#x27;s xml is present and correct, and even if it wasn&#x27;t there ESH would fall back to logs which contain a success event as most recent. Error case seems to be that file exists but ESH can&#x27;t retrieve the data from it for some reason? Requested PML/fresh sdu of ESH refresh.<br><br><b>W21:</b> Logs obtained, status still good in current.xml file and in logs, but PML shows access denied. Seems UpdateCache and MessageRelay folders don&#x27;t have User group read permission when installed, so assume the cx is running ESH on a non-admin account? There already exists a KBA stating that ESH must be run as admin. Issue resolved by correcting permissions on UpdateCache/MessageRelay folders.  ', color:'a280e1', Result:'Environment Issue', Component:'Endpoint Self-Help'};
CaseInfo['16859'] = {description:'Install fails S1 with proxy', caseLog:'<b>W26:</b> same setup on other machines doesn&#x27;t fail. On this one, proxy is system on others it isn&#x27;t. Setup scenario and doesn&#x27;t inherently fail. Will try to recreate situation with powershell.<br><br><b>W27:</b> built exe to replicate WinHTTP process just for fun. Used Message Analyser on the etl trace from netsh instead of perfmon, logging is pretty detailed. The WinHttp section of a working log is the same, however normally the WebIO api is used next and it is absent from the cx&#x27;s log. WinHttp is is statically linked to WebIO. MUI is related to translation, so installed on DE machine to see which are used. Only &quot;winnlsres.dll&quot;. Removing all permissions on this file gives same errors as for cx.<br><br><b>W32:</b> Cx provided PML of install, target machine is actually a 2012RS2 server which requires C:\Windows\SysWOW64\en-US\KERNELBASE.dll.mui and is not found on CX server. Taking ownership and renaming this file causes the same error as Customer, and running sfc \scannow copies backup from C:\Windows\System32\en-US and resolves. Proxy confirmed not related.  ', color:'3d3503', Result:'Environment Issue', Component:'Installer'};
CaseInfo['16879'] = {description:'SSP StandAlone Install fail', caseLog:'<b>W20:</b> installer cannot read existing registry key, access denied. Same for user trying to delete as admin. PML doesn&#x27;t seem to capture issue, but does show other AV &#x27;bytefence&#x27; running, requested to try without and gather PML. ', color:'ca0860', Result:'Unresolved', Component:'Installer'};
CaseInfo['16988'] = {description:'Delay saving Office docs to NAS', caseLog:'<b>W21:</b> Initally suspected oplocks like previous case, but SMB traffic is not SMB2, so not supported. PML and Wireshark don&#x27;t line up, but suspicious of apparent 40s hang on close file, and found similar looking hang in wireshark, waiting for AndX Request response. Cx originally said 10-60s delay, so requested Wireshark &amp; PML of delay and not-delayed replication.<br><br><b>W32:</b> Temporary file close is held up by file size query for copy detection, almost certainly a timeout as 40s is very consistent. Same operation later on Book1.xlsx does not hang. New Wireshark still doesn&#x27;t line up with the procmon, but attempting analysis anyway. Cx says the issue only occurs for this NAS not for any remote share, and protocol is SMB1 might be significant? Repro is unlikely. Registry key from 17886 that disables copy detection check might be useful to them tho. <br><br><b>W35:</b> Finally have matching Wireshark and PML. They confirm suspicions but its unclear what is expected as I&#x27;m not that familar with SMB, and standard fileshares now use SMB2. Set up a W2003 server as a fileshare, so it uses SMB and enabled NTLM on the client, but still no delay, unsure why transfer is re-authenticating and why it is timing out (?).<br><br>Found this:<br>Servers checks if the response is properly computed by contacting the domain controller.<br>And I believe the NAS is not in a domain, so maybe this is what times out? It seems this DC communications happens between NTLMSSP_AUTH and response rather than NTLMSSP_NEGOTIATE and NTLMSSP_CHALLENGE, but worth looking at traffic that is not smb.<br><br><b>W36:</b> Managed to enable NTMLSSP on both client and fileserver, trying to join 2003 server to domain so that the authentication can work.Something called Samba is potentially also involved but this needs more looking at.<br><br><b>W37:</b> Enabling NTLMSSP on 2003 shows that we are causing NTLM to reauthenticate somehow, but it doesn&#x27;t take 40s to respond with a challenge. Two paths here: Why does it re-authenticate at all, and why does it take 40s. Seeing as I can reproduce the authentication I will pursue this primarily. Not actually &quot;Re-authenticating&quot; but authenticating a new virtual circuit. Seems to be triggered by the rename action, and can reproduce with rename in powershell. No delay still though.<br><br><b>W38:</b> Disabling onWrite removes the new virtual circuit. ', color:'69c88e', Result:'Unresolved'};
CaseInfo['16995'] = {description:'Safestore config', caseLog:'<b>W21:</b> Cx wanted to change safestore limit so files over 50mb are not deleted. Functionality exists in API but not available for cx, clean to add reg keys and allow this config.  ', color:'392201', Result:'Feature Request', Component:'Safestore'};
CaseInfo['17157'] = {description:'DLP working for admin but not user', caseLog:'<b>W22:</b> from PML the user account has folder redirection enabled, so the file is actually being transferred from a remote share. The cx has remote files disabled for on-access in Threat-Protection policy, which when tested also applies to DLP, so copying straight from remote share to browser does not flag if local only is selected.  ', color:'e00dfb', Result:'Environment Issue', Component:'Data Control'};
CaseInfo['17232'] = {description:'DevC 20% CPU Usage', caseLog:'<b>W23:</b> Cx has 200+ Drives connected to NAS, controlled by disk organisation software, and every time QueryDevicePolicy() is called for a certain device the whole list is enumerated to find the ID of the one requested, which takes a lot of time. I created 15 virtual hard drives for a similar machine, and could create exactly the same logs with all the same &quot;errors&quot; in expected use. The enumeration of drives to get the ID does take 1-2 seconds every time for them, and this probably the cause of the slowdown.  ', color:'d9cb0b', Result:'Environment Issue', Component:'Device Control'};
CaseInfo['17279'] = {description:'3rd Party SW unresponsive with sophos', caseLog:'<b>W24:</b> Component isolation unclear, only complete uninstall works. dump/PML shows HMPA and Detours dll still loaded so asked to try unloading.<br><br><b>W26:</b> Sage paperless remains hanging even after appInitDlls are disabled, and no sophos is loaded in dump. In house repro is likely not possible, so probably will have remote access.<br><br><b>W30:</b> Resolved for Cx with update to Sage 3rd part software. ', color:'1b4eb7', Result:'Environment Issue'};
CaseInfo['17289'] = {description:'Admin signout when disabling settings with TP', caseLog:'<b>W23:</b> UI flicks back to home when disabling ML or OA with TP enabled. Logs show &quot;password is invalid&quot;, but further investigation is impossible as TP must be enabled and passwords are hidden in the logs. Attempting to build UI version where passwords are not hidden! Found build machine in buildcfg and used builder python script to meet dependencies. Also had to find a non-production version of MCS so it would accept non-release certificate, but after the logs show empty password field. <br><br><b>W24:</b> Debugging the release versions without tamper protection to see how far back the empty tokenFor Property comes from. Seems to still be empty at RequestHandler entry point. Seems as though after an adapter change to the CORE adaptor ClearAuthentication is called which calls authenticate with an empty password. This seems to be as result of an oversight, where clearing Authentication was required after a change to the SED adapter, then TP was moved to the CORE adapter but this logic was left in. Raised Bug ticket to fix.  ', color:'12c4fd', Result:'New Bug', Component:'User Interface'};
CaseInfo['17319'] = {description:'Unitrends USB hang', caseLog:'<b>W24:</b> Software driver seems to cause explorer to hang when accessing a USB. Previous similar case resolved as cx upgraded and no longer required driver. Current cx apparently upgraded, and uninstall/reinstalled but still has driver. Only one machine seems to have installed the driver in house, server 2016 on Hyper-V. Unsure what logging we need to progress.<br><br><b>W27:</b> Managed to create Hyper-V setup inside windows 10 vm, and connect a physical USB. Installed Unitrends but no driver. Repeated with Server 2016 VM and delay is evident. In their logs function RetrieveBitmapOnInit hangs until sophos is disabled, the reports tracking not enabled.<br><br><b>W28:</b> Unitrends logs show hang from when device is first connected until SAVservice is disabled, then it can be accessed. tried taking a dump during hang, and enabling logging on the 3rd party driver - but nothing is clearer. Requested contact at Unitrends. <br><br><b>W31:</b> Customer has removed the driver causing the issue as it is only required for Hyper-V, but the issue still exists. No contact from Unitrends. ', color:'0caa2f', Result:'Environment Issue', Component:'Anti-Virus Service'};
CaseInfo['17344'] = {description:'Memory leak non-paged pool server 2012', caseLog:'<b>W24:</b> poolmon shows highest usage is for Sg01 pool tag - which is SophosED.sys . Looked into investigating leaks with Performance analyser, and found should be looking for AIFO (Alloc inside Free Outside) in ETL. Sg01 has none and HMPA frees more than it allocates in the duration of the trace, no significant increase is visible. Requested cx run typeperf command to trace pool sizes against time, to see when best time to gather another trace is. Update: Performance counter names translated on German Systems, wrote some powershell to run the command with translated values from the registry. UPDATE: had to add ability to persist a parameter through translation, e.g. \Process(system)\...<br><br><b>W27:</b> Translated typeperf command worked and cx managed to collect file. Trend is not consistently rising unfortunately, shows several small jumps that could be responsible. Requested repeats to see if there is a timing pattern and SDU to look for possible triggers.<br><br><b>W28:</b> cx provided more csvs and an ETL, but they are basically useless as they don&#x27;t show any kind of growth. Asked them to do it again.<br><br><b>W29:</b> Latest Typeperfs do show trend up. Previous trace was irrelevant and falls into normal usage, new traces line up very well by time, seemingly stepping up every so often. Looked into scheduled tasks and can&#x27;t see a smoking gun, but requested ETL at 10am day after reboot and a new SDU. Cx provided 10am WPA trace, seems to be in initial stage of the graph, before midnight when it begins to grow. Queried if cx rebooted recently<br><br><b>W30:</b> new trace shows HMPA pool at very high usage, and small increase (~5MB) with robocopy in the stack. Initial poolmon indicated Sg01 (SED) but usage was only 95MB rather than 3GB. Need a poolmon after longer to indite HMPA.', color:'e44bff', Result:'Unresolved'};
CaseInfo['17374'] = {description:'Excel File slow save', caseLog:'<b>W24:</b> file in question has cells with data defined in another file. Created a test file and data file, where all data in test.xlsx comes from data.xlsx. data was ~3.5s to save regardless of Sophos state, test was ~7.5s with OA off and 11s with it on, so potentially there is an issue. SAV doesn&#x27;t scan the referenced file when the host is saved however. In the cx&#x27;s procmon SAV holds the file for ~25s before allowing excel to save it, in mine ~2s. On Access logs have a lot of &quot;QueryFileName: Call to GetFileNameInformation failed with status: 80000005.&quot; - as yet unsure if this is relevant. This was looked at and found to be a duplicate by Rade over Christmas.  ', color:'709489', Result:'Transferred'};
CaseInfo['17382'] = {description:'Install with Kaseya fails 401', caseLog:'<b>W26:</b> Deployment via Kaseya fails as getDeploymentInfo() responds &quot;Access Denied&quot;. Traffic is encrypted TLS so cannot see request/response details in the wireshark. SophosSetup.exe allows parameters, and using cx&#x27;s id and mgmt server URL I can reproduce the 401 error. 401 in this case can mean malformed JSON, or missing/invalid cx id. Swapping mgmt server for default fixes, so location is probably wrong. <br><br><b>W27:</b> Learnt that partner deployment provides &quot;blank&quot; installer so no preset arguments for install parameters - they have to be set. Having the cx run the installer without arguments is impossible. Most likely that management server from csv is wrong, however cx says it is correct from the CSV. The authentication is the same for both MCS servers, and it is unlikely that changing the server malforms the content, therefore have passed case to CESG.<br><br><b>W28:</b> To absolutely everyone&#x27;s surprise the cx can&#x27;t read and the server was wrong.  ', color:'f6efec', Result:'Environment Issue', Component:'Installer'};
CaseInfo['17557'] = {description:'Powerpoint hang when opening/saving', caseLog:'<b>W29:</b> Possibly related to fix in engine 3.74 as cx has seen &quot;improvement&quot;, but nothing definitive. They still have cryptoguard which would cause some delay backing up the file to a temp location. Since upgrading they haven&#x27;t gathered any new verbose logs so we&#x27;ll need those if there is an issue, and the etl trace seems to  have been gathered incorrectly. ', color:'61561c', Result:'No Response'};
CaseInfo['17584'] = {description:'PTP Devices not allowed by exclusion', caseLog:'<b>W28:</b> Seems to be excess &amp;amp; that doesn&#x27;t get converted to the symbol, confirmed this on german VM using phone as PTP device. Looking at first detection event, and received policy it seems central is adding extra amp;s, as if the exclusion came down as it is sent up it would exclude correctly.<br><br><b>W29:</b> verified new cx as same issue for Asim.<br><br><b>W35:</b> New case 18416 looks to be the same, just confirming then will link.  ', color:'d66749', Result:'Transferred', Component:'Device Control'};
CaseInfo['17595'] = {description:'failed standalone install', caseLog:'<b>W28:</b> Logs and PML don&#x27;t really match up - reaching different stages and exiting with different codes. Also have Win7 pml with no SDU. Requested matching log and pml from win10 and win7 machines.<br><br><b>W29:</b> During install a temporary file is created (successfully from the PML), then attempted to be opened with of:stream. The file is not created again in the PML and the error message indicated the open failed, despite the file existing. Created test exe to run suspect winapis on cx computer. Emile has taken over case.  ', color:'788d24', Result:'Transferred', Component:'Installer'};
CaseInfo['17610'] = {description:'Chrome Crash with SLD', caseLog:'<b>W28:</b> Server does not need to be locked down, just installed, crash occurs around when RES dlls are loaded into process, and error code is 0xc0000135 - DLL not found. Requested reduced altitude PML of crash with and without server locked down. <br><br><b>W29:</b> New logs from cx. SLD driver is only injected if process is trusted? logs from cx seem to match when file is not trusted. When file is trusted logs look different on admin user, maybe this is why admin user is ok and normal user fails for cx? Process is untrusted as it is run as user, then why does the dll get loaded? Why do their dlls not get loaded when SLD is not installed? <br><br><b>W30:</b> passed back to Toby with Qs for Ivanti (3rd party dev). Experimented with SLD to see under what conditions a process is &quot;trusted&quot; and has SLD dlls injected. <br><br><b>W34:</b>  3rd party required to progress and Cx has not responded. ', color:'7753c4', Result:'No Response', Component:'Lock Down'};
CaseInfo['17706'] = {description:'Hips blocking VMware profiles', caseLog:'<b>W29:</b> Have RSDebug log but PML is corrupted. Not much to be gather in the PML other than the reg keys are accessed. As HIPS is confirmed as the culprit transferred to labs. ', color:'a4d0c9', Result:'Transferred'};
CaseInfo['17783'] = {description:'Mem leak opening and closing file', caseLog:'<b>W30:</b> Cx provided batch file to replicate but could not reproduce locally, cx stopped responding.<br><br><b>W34:</b> No response in 3 weeks, and never able to reproduce in house even with customer python script. ', color:'ea64d6', Result:'No Response'};
CaseInfo['17886'] = {description:'Slow DLL copy', caseLog:'<b>W31:</b> determined that remote folder AV is not relevant, repeat copies after initial are at normal speed suggests caching issue. PML stack analysis suggests remote file copies are normally scanned locally and checksummed to identify, then the remote copy checksum matches so they do not need to be scanned again (at great cost). Cx PML shows remote checksum doesn&#x27;t match for certain dlls, therefore file is scanned in remote location, seems to be because local scan does not generate a checksum. Default local checksum setting is &quot;auto&quot; can be set to &quot;on&quot; and seems to resolve the issue if the file is scanned locally. Cx PML shows local file is cached so recommended they clear cache as well.<br><br><b>W32:</b> Cx confirmed that enabling local checksumming dropped copy duration from 20 mins to 12 seconds (7 seconds pre-Sophos), however would like an explanation for &quot;70% performance hit&quot;. It is likely there is nothing more we can do, but asked for a new PML anyway.<br><br><b>W34:</b> Some confusion as I used &quot;resolved&quot; to mean &quot;resolved by workaround&quot;. Clarified that the XML change was a workaround and we are still investigating the issue. Spoke to Rade as to why the scan is happening and he suggested that as they are Potentially Executable they shouldn&#x27;t be remote scanned anyway. Trying to ascertain reason for scan. Copied the IsPeFile function into an executable and ran with dll, established that it is not classified as PE because it is a .NET assembly.<br><br>Rade: &quot;The reason is that such assemblies, if they are &#x27;pure&#x27; .NET assemblies, can be loaded by the .NET loader without help from the OS loader, and this means they are opened &#x27;for read&#x27; rather than &#x27;for execute&#x27;.&quot;<br><br>Another thing Rade mentioned is that CopyDetection doesn&#x27;t currently work on Central because of interference from the SED driver which has higher altitude. Seeing as the dlls are not technically &quot;potentially executable&quot; They should be scanned, unless they have been copied in which case only the source (local) needs to be copied.<br>Finally need to check when JIT scan is used and when scan is done in line (causing delay). 5s (12s from 7s) is due to remote checksum but this does help the intercheck manager from not having to scan the file.<br><br>Suggested that the Cx use the registry key rather than the xml change or whatever their preference is.  ', color:'b93d1c', Result:'New Bug', Component:'Anti-Virus Service'};
CaseInfo['17922'] = {description:'SD card reader explorer hang', caseLog:'<b>W32:</b> Explorer hangs when SD card is inserted into built in reader, when browsing contents or sometimes just browsing C (?) Running DISKPART alleviates. Cx confirmed issue is specific to a certain laptop model, which has unique driver to other similar models tested. SavOnAccess.sys seems at fault as unloading/stopping savservice alleviates.<br><br>Used WINDBG to inspect a force crash memory dump during the hang, and the SavOnAccess driver is in the stack of one of the explorer threads:<br>savonaccess!GetSectorSize+0x96  <br>savonaccess!IsDiskReadable+0xb3  <br>savonaccess!CheckDisk+0x3e <br>savonaccess!FileChecker::IsFloppyDisabled+0xac <br>savonaccess!FileChecker::PreCreateChecks+0x2fa <br>savonaccess!AntiVirusPreCreate+0x324 <br>savonaccess!PreCreate+0x54<br>Which needs investigating.<br><br><b>W33:</b> Read a lot about IRP and how it works with drivers, and looked into the stack from the dump. The driver is still waiting on a pending IRP request for IOCTL_DISK_GET_DRIVE_GEOMETRY as part of the boot sector check of the new drive. This IRP request comes back pending and seems to remain pending indefinitely until diskpart is able to free it somehow? In the explorer Thread there are 2 active IRPS:<br>one of which has current stack frame <br><br>[IRP_MJ_DEVICE_CONTROL(e), N/A(0)] <br>\Driver\Disk	volmgr!VmpRefCountCompletionRoutine		<br>Args: 00000018 00000000 0x70000 00000000<br>	<br>Arg 3 is IOCTL and !ioctldecode 0x70000 = IOCTL_DISK_GET_DRIVE_GEOMETRY    <br><br>So on the right lines. <br><br>Maria assisted on day 2 and suggested I look for other threads with the same Wait Start TickCount i.e. began waiting at the same time, as the stack for the thread I found had symbols for all the functions, so not 3rd party. Found a system thread with exactly the same wait start, and &quot;RtsPer&quot; in the stack - no symbols. This is &quot;RealTek RTS PCIE READER Driver&quot; the maker of the sd card reader. <br><br>Written a usermode process to create the same irp request for either a passed drive letter or for all drives. It seems to interfere with running VMs causing bluescreen/lack of OS and requiring image restore. Added a warning to this effect and a confirmation line allowing bail.<br><br><b>W34:</b> Cx provided an SDU from an unaffected dell model. It does have an rtsper.sys driver present, however of a slightly different version number. Looking into the device ids the device is actually different, and the version of rtsper.sys is up to date for both according to driveridentifier.com. The size is also very different, so I have to assume that although the drivers have the same name they are not alike, and that is why one works and one does not. <br>Requested that the cx reach out to Dell/Realtek to find out what the system thread in the dump is waiting for.', color:'e92411', Result:'Unresolved'};
CaseInfo['17965'] = {description:'Missing Exchange auto-exclusions', caseLog:'<b>W31:</b> detects exchange 2010 correctly but only 1 mailbox db out of 9 is auto excluded. Inspected lua this comes from and this info is from Get-MailboxDatabase ps command. Static debugging suggests the following operations do not account for this being a list of paths rather than a single path. <br>Set up a Domain Controller VM with Exchange server 2010 and confirmed the bug occurs with 2 mailboxes, then created a C executable to run a lua file (on Github). I wrote lua to run a powershell command to get Exchange config then interpret it in the same way as the Sophos code, but simplifying some parameters etc. and see the issue is as expected. Subsequent values overwrite the previous ones as they write to the same key. Modified the code to append to a list and handle the list correctly later on, then tested and submitted a CSRV ticket.  <br><br><b>W35:</b> New case 18417 looks to be the same, just confirming then will link. ', color:'35710e', Result:'Suggested Fix', Component:'Auto-Exclusions'};
CaseInfo['18352'] = {description:'Peripheral Control interfering with FSLogic', caseLog:'<b>W34:</b> 3rd party (FSLogic) says that Sophos is preventing them from mounting a virtual hard disk from a remote location, as part of login to &quot;profile container&quot;. Can see sharing violation on the VHD file, but device control doesn&#x27;t seem involved and SavService is still setting up. Attempting to setup repro.<br><br>Think the repro is set up although it doesn&#x27;t seem to affect anything (?) only errors in the log, but they are the same errors.<br><br><b>W35:</b> Setting up SEC endpoint (for the first time) to test with SEC Peripheral control. Had to disable the endpoint firewall to allow communication, and Peripheral control is active now. No errors in FSLogix logs when using alert only. Used PSexec to take a remote PML of the login covering an error. Reproduced without On Access to compare, but still hard to see Sophos involvement. Also, am able to mount VHD from same remote location using DiskPart.<br><br>Issue does not occur with alert only, or blocking device types other than &quot;removable storage&quot;. Also asserted that the sharing violations early on are not relevant as they also occur in working case. Seems the issue happens during System interactions with the file - the 3rd party do have drivers, some of which sit lower than ours. Eliminated two SavOnAccess reads that return File Lock Conflict by disabling functionality. Between create and attach everything in the procmon succeeds then the file is deleted.<br><br>Might try to create an .exe that creates and mounts a remote vhd.<br><br><b>W36:</b> Thought I could use apimon to identify windows api calls, but can&#x27;t seem to run remotely. Instead, created c++ .exe using apis I could find, and reproduce the issue with the attach api call -  confirming that no drivers etc. are required. However, I changed something and now it won&#x27;t reproduce =( . Managed to see the repro once on day 2, unsure what conditions caused it.<br><br>So, the error message can be obtained with SAV-Service and dcservice stopped, and SavOnAccess unloaded, but not with sophos uninstalled. In this case it always fails twice then succeeds, even when using the disk management gui. Comparing the pmls can see that after the attach there are system queries that lack the partmgr and CLASSPNP drivers in the stack for failing attempts and have them for succeeding attempts. Why?<br>Confirmed with a clean install that VHD can be attached without device control, and once enabled the 3rd attach succeeds.<br><br>Reading about SCSI upper filter as the working run creates the key with upper filter set to partmgr whereas the failing ones report name not found. Not found the connection yet, but failing attempts also use DrvInst.exe to install drivers so we can insert out sdccoinstaller dll. Removing the reference to out dll causes it to still fail, so the presence of DrvInst would seem to be the issue? How do we cause this and why does this mean the attach fails.<br><br>Managed to find out how to break a working registry to reproduce the issue on demand. SCSI Enum key has instance sub keys, and if they have a partmgr parameter it will succeed if the device is assigned that instance id. Deleting all of these subkeys allows up to 3 to be created wrong.<br><br>BREAKTHROUGH might be a Microsoft issue. The DrvInst process is triggered by the existence of the guid in the CoDeviceInstallers key, which we create for sdccoinstaller.dll. Creating this key (empty) without Sophos installed causes the same issue. If existing broken instance keys exists, they are fixed by removing this value, so no need to delete broken instanceid keys as system. Without the coinstaller devC does work, but some devices might not be blocked until next restart, recommended the cxcontact MS and don&#x27;t block removable storage devices, or delete the key if necessary.<br>', color:'38587c', Result:'Unresolved', Component:'Device Control'};
CaseInfo['18403'] = {description:'On Access slows file copying', caseLog:'<b>W38:</b> Another slow copy case, this time lots and lots of different files and types copying locally. Customer has been unable to narrow down a particular file or location, and the extra time is equal to the time to right click scan the files. Seems to be copyDetect being broken by SED again, but because it is local enabling local checksumming doesn&#x27;t help because the source file is not scanned to generate a checksum, only the target. As a test asked them to swap the drivers but definitely don&#x27;t leave it like that, as that would confirm SED&#x27;s interference. ', color:'45218e', Result:'Unresolved', Component:'Anti-Virus Service'};
CaseInfo['18760'] = {description:'File save takes excessively longer when SED is loaded', caseLog:'<b>W37:</b> Looks a bunch like oplocks to me - oplockBreakWait is 35s and read by SED hangs 35s before a system action relating to acknowledging smb2 lease oplock. Requested cx reduce the breakWait time and see if save time corresponds. <br><br><b>W38:</b> The command didn&#x27;t help :/ Can see SED driver is trying to read the file and waiting 35s to be able to do it so it just seems so likely to me that it is... maybe the config needs to be on the endpoint not the server? Requested PML and Wireshark from client.', color:'889f31', Result:'Unresolved', Component:'Endpoint Defense'};
CaseInfo['18795'] = {description:'DLP events not going back to Central', caseLog:'<b>W37:</b> The crux of this case was destination only checks again - copy without using explorer cannot be checked, so is blocked by default without a notification, as it isn&#x27;t certain that the file contained sensitive data. GES was thrown off by lots of health events in the Error folder, as the customer seems to have deleted the trails folder, and that is where they are moved to if the transfer from Incoming to Trail fails. I used my own HealthGUI tool for this case :)  <br><br><b>W38:</b> I thought the checks that are important were not destination only, and GES just decided to pull one out when summarising instead of the one that matches the PML... So the cx is dragging a file onto the USB and no notification goes to central. I thought I was reproducing this, but turns out the date and time on my VM was incorrect so they had expired. Customer provided trails but no MCS event is created. MCS does work as a device control notification is sent, but when the data control event occurs MCS does nothing. Trying to acertain why no event is received but not exactly sure what the trigger is.<br><br>Turns out, the events are destination only, and DO allow events don&#x27;t contain the &quot;without explorer string&quot; but I should have realised from the fact there is no rule. No central is correct but the copy is definitely with explorer so why DO? Turns out the customer has Secure Boot enabled which prevents detours from loading, and forces all checks to be DO. There is already a KBA for this incompatibility. ', color:'f10999', Result:'Known Bug', Component:'Data Control'};
CaseInfo['18823'] = {description:'USB Fails to be re-enabled', caseLog:'<b>W37:</b> Debug DeviceControl.txt just reports &quot;device should not be disabled&quot; but doesn&#x27;t attempt to enable. Before debug the initial attempt to re-enable shows error -5, which is internal and defined in DevConResult.cpp as Error_Internal. This isn&#x27;t very descriptive, but narrows down to a function in the DevConProxy - Which is supposed to simply launch the devCon process with the correct parameters. <br>In the initial email the Cx mentions the device is visible but not functional, which suggests it is not disabled, as then it would disappear. Can they enable with sdcDevCon.exe manually? ', color:'33ca1f', Result:'Unresolved', Component:'Device Control'};
CaseInfo['19000'] = {description:'SNTP failed install', caseLog:'<b>W39:</b> sntp driver reports &quot;insufficient system resources, fails to start causing service to also fail on dependency and get cleaned up. Not much online documentation on causes for this error message, and not a lot logged or captured by pml.<br>Separately trying to establish if the the driver goes into the driverentry routine at the start of our code. Noticed that after sntp.sys is loaded by System it reads some registry keys that seem to be left over from a previous install, and never does start our code, so suggested these keys be deleted after running the removal script, and retry the install.', color:'044f99', Result:'Unresolved'};
;

//Load google things
google.charts.load('current', {'packages':['corechart']});

//once loaded call drawChar
google.charts.setOnLoadCallback(loadCallback);

function loadCallback() 
{	
	//addHTML()
	
	window.onload = drawChart();
	window.onresize = drawChart();
	
	var testCases = {};
	
	testCases['00002'] = {work:[0,1,2,null,null],tooltip:'testcase1',color:'33ca1f'};
	testCases['00003'] = {work:[null,0,1,2,3,null],tooltip:'testcase3',color:'abcdef'};
	testCases['00065'] = {work:[0,1,null,2,null],tooltip:'testcase5',color:'bbccaa'};
	testCases['00789'] = {work:[null,0,1,2,null,3,4,5,6,7,8,9],tooltip:'testcase9',color:'123456'};
	
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
		animation:{
			duration: 300,
			startup: true,
		},
	};
	
	var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
	
	var data = {};
	console.log(data);
	data = new google.visualization.DataTable();
	//powershell variable replaced by values
	console.log("INIT\n");
	console.log("Rows: " + data.getNumberOfRows() + "\nColumns: " + data.getNumberOfColumns());
	data.addColumn({type:'string', role:'domain', label:'Week'});
	data.addColumn({type:'number', role:'data', label:'dummy'});
	
	//onSelect Listener can only be added once ready
	function onReady()
	{
		console.log("Ready");
		
		/* if( index < 53)
		{
			addRow(index);
			index++;
		//google.visualization.events.addListener(chart, 'select', onSelect);
		} */
	}
	
	var addButton = document.getElementById('b1');
    var removeButton = document.getElementById('b2');
	var index = 0;
	var keys = Object.keys(testCases);
	
	for (var i in keys)
	{
		var key = keys[i]
		console.log("add columns");
		data.addColumn({type:'number', role:'data', label:key});
		data.addColumn({type:'string', role:'tooltip', label:key+'T'});
		data.addColumn({type:'string', role:'style', label:key+'S'});	
	}
	
	drawChart();
	
    function drawChart() {
      // Disabling the buttons while the chart is drawing.
      chart.draw(data, opts);
    }
	
	function addRow(week)
	{
		console.log("+addRow " + week);
		
		var row = [week.toString(),null];
		
		for (var i in keys)
		{
			var key = keys[i]
			caseObj = testCases[key];
			var w = caseObj.work[index];
			
			if (w != null)
			{
				row.push(w);
				row.push(caseObj.tooltip);
				row.push('color: #'+caseObj.color);
			}
			else
			{
				row.push(null);
				row.push(null);
				row.push(null);
			}
		}
		console.log(row);
		data.addRow(row);
		google.visualization.events.addListener(chart, 'ready', onReady);
		drawChart();
		console.log("-addRow " + week);
	}
	
	addButton.onclick = function() {
		
		while(index<53)
		{
			console.log("set:" + index);
			setTimeout(function() 
			{
				console.log("run:" + index); //index passed by reference so doesn't work
				addRow(index);
				
			}, index*300);
			index++;
		}
    }
}

//Show CaseLog in div below. 
function onSelect()
{		
	clearTabs();
	var selection = chart.getSelection();			
	
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
	
	document.getElementById('curve_chart').innerhtml = "<div class=\"d-flex align-items-center\"><strong>Loading Graph...</strong><div class=\"spinner-border ml-auto\" role=\"status\" aria-hidden=\"true\"></div></div>";
	
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
	//wrapper.setView(view.toJSON());
	
	//wrapper.draw(document.getElementById('curve_chart'));
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
