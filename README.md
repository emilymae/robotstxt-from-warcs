# robotstxt-from-warcs

As part of Archives Unleashed 4.0 in June 2017 we explored how robots.txt can explored in existing web archives. 

We were motivated by the question: What do we miss when we respect robots.txt exclusions?

We focused on a sample colletion from the UK National Archives' UK Government Web Archives. 

Our method was to:
* Extract all robots.txt from the WARC collection using warcbase
* Apply the robots.txt retroactively to see what would not have been captured, by:
  * parsing the robots.txt exclusion rules with NodeJS,
  * applying the rules to the URIs and links in the WARC collection
* Compare the coverage of a collection adhering to vs. ignoring robots.txt

