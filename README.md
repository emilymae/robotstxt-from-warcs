# robotstxt-from-warcs

As part of [Archives Unleashed 4.0](http://archivesunleashed.com/au4-0-british-invasion/) at the British Library in June 2017 we explored how [robots.txt](http://www.robotstxt.org/) can explored in existing web archives. 

As creators of web archives, we were motivated by the question: What do miss when we respect robots.txt exclusions?

Our approach to studying the impact of robots.txt is to look at a collection that had ignored robots.txt exclusions and try to understand what would not be captured if the crawler adhered to robots.txt. We focused on a sample collection from the UK National Archives' UK Government Web Archives 2010 Elections. 

Our method was to:
* Extract all robots.txt from the WARC collection using [warcbase](https://github.com/lintool/warcbase)
* Extract URLs and links from the WARC collection
* Apply the robots.txt retroactively to see what would not have been captured, by:
  * parsing the robots.txt exclusion rules with NodeJS [robots-parser](https://github.com/samclarke/robots-parser)
  * applying the rules to the URLs and links in the WARC collection
* Compare the coverage of a collection adhering to vs. ignoring robots.txt

We hope to extend this work to different collections in order to further understand the impact of robots.txt, and how it can or should be approached in web archiving practice.



## Technical

### Prerequisites

* A working spark + warcbase-installation (se the [warcbase GitHub page](https://github.com/lintool/warcbase))
* Some WARC-files from a harvest where robots.txt has *not* been obeyed
* bash and (Python|Node.js)

### Rough how-to

1. Apply the 3 `.scala`-scripts to a collection of WARC-files
1. Use the bash-scripts `all_urls.sh`, `all_links.sh` and `inside_corpus_links.sh` on the outputs from the scala-scripts (see [SCRIPTS.md](SCRIPTS.md) for details)
1. Run the output from the bash-scripts through either `nodejs/index.js` or `obey_all_robots.py` to get statistics and a list of links with robots.txt being applied
1. Use the bash-scripts `domain_links.sh` and `robots_or_not.sh` to generate aggregates for use with gephi or a similar graph-visualization tool
