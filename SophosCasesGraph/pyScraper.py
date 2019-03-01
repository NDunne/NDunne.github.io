import webbrowser
import gkeepapi
import html
import sys
import re

def main():
	keep = gkeepapi.Keep()
	try:
		keep.login(sys.argv[1],sys.argv[2])
	except Exception as e:
		print(type(e))
		print (e.args)
		return

	gnotes = keep.all()

	out = ""

	for gnote in gnotes:	
		match = re.match("^W[1-9][0-9]*",gnote.title)
		
		if (match != None):
			
			out = "\n" + match.group() + ": \n" + html.escape(gnote.text) + out
			
	print("Success" + out)
	
if __name__ == "__main__":
	main()