#!/usr/bin/python
import sys
import re
import robotexclusionrulesparser
snip = "(<------- SNIP HERE -------->,"
sniplen = len(snip)
robots = dict()
# read robot file into associative array of robots indexed by domain
robot = None
with open(sys.argv[1], 'r') as infile:
    for line in infile:
        if snip in line:
            if robot is not None:
                rparser = robotexclusionrulesparser.RobotExclusionRulesParser()
                rparser.parse(robot)
                robots[domain] = rparser
                robot = None
            header = line[sniplen:].split(',')
            domain = header[0]
            # first line of robots.txt is in with context info 
            robot = header[-1]
        else:
            robot =  "".join([robot, line])
    # final robot
    rparser = robotexclusionrulesparser.RobotExclusionRulesParser()
    rparser.parse(robot)
    robots[domain] = rparser
positives = 0
negatives = 0
urltot = 0
domains = dict()
urls = dict()
with open(sys.argv[2], 'r') as urlfile, open("no.txt", "w") as negative, open("yes.txt", "w") as positive:
    for urlblock in urlfile:
        urltot = urltot + 1
        parts = urlblock.split("\t")
        domain = parts[0]
        domains[domain] = 1
        url = parts[1]
        urls[url] = 1
        if domain in robots:
            if robots[domain].is_allowed("dark_robots", url):
                positive.write(url)
                positives = positives + 1
            else:
                negative.write(url)
                negatives = negatives + 1
        else:  # no rules, so allowed
            positive.write(url)
            positives = positives + 1
print("Number of distinct robots.txt: " + str(len(robots)))
print("Number of distinct domains: " + str(len(domains)))
print("Number of distinct urls: " + str(len(urls)))
print("Total urls: " + str(urltot))
print("Negatives: " + str(negatives))
print("Positives: " + str(positives))#!/usr/bin/python
import sys
import re
import robotexclusionrulesparser
snip = "(<------- SNIP HERE -------->,"
sniplen = len(snip)
robots = dict()
# read robot file into associative array of robots indexed by domain
robot = None
with open(sys.argv[1], 'r') as infile:
    for line in infile:
        if snip in line:
            if robot is not None:
                rparser = robotexclusionrulesparser.RobotExclusionRulesParser()
                rparser.parse(robot)
                robots[domain] = rparser
                robot = None
            header = line[sniplen:].split(',')
            domain = header[0]
            # first line of robots.txt is in with context info 
            robot = header[-1]
        else:
            robot =  "".join([robot, line])
    # final robot
    rparser = robotexclusionrulesparser.RobotExclusionRulesParser()
    rparser.parse(robot)
    robots[domain] = rparser
positives = 0
negatives = 0
urltot = 0
domains = dict()
urls = dict()
with open(sys.argv[2], 'r') as urlfile, open("no.txt", "w") as negative, open("yes.txt", "w") as positive:
    for urlblock in urlfile:
        urltot = urltot + 1
        parts = urlblock.split("\t")
        domain = parts[0]
        domains[domain] = 1
        url = parts[1]
        urls[url] = 1
        if domain in robots:
            if robots[domain].is_allowed("dark_robots", url):
                positive.write(url)
                positives = positives + 1
            else:
                negative.write(url)
                negatives = negatives + 1
        else:  # no rules, so allowed
            positive.write(url)
            positives = positives + 1
print("Number of distinct robots.txt: " + str(len(robots)))
print("Number of distinct domains: " + str(len(domains)))
print("Number of distinct urls: " + str(len(urls)))
print("Total urls: " + str(urltot))
print("Negatives: " + str(negatives))
print("Positives: " + str(positives))
