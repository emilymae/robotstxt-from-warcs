// Archives Unleased 4.0 London 13/06/2017
// Team robots

const fs = require('fs');
const readline = require('readline');
const robotsParser = require('robots-parser');
const urlParser = require('url');

const robotsFile = 'robots-small.txt';
const URLFile = 'urls-decc';
const linksFile = 'links-inside-corpus-decc';

const rl = readline.createInterface({
    input: fs.createReadStream(robotsFile)
});

///// Part 1 : Parse the robots.txt file exported from warcbase

// This is the first field inside the spark-exported robots.txt file
// This makes the parsing a bit more robust
var snip = '<------- SNIP HERE -------->';

var robots = {};
var lastRecord = {};

function addLine(line) {
    if (line.indexOf(snip) >= 0) {
        if (lastRecord.domain) {
            robots[lastRecord.domain] = lastRecord.robots;
        }
        lastRecord = {}
        var spl = line.split(',');
        lastRecord.domain = spl[1];
        lastRecord.robots = spl[3];
    } else {
        if (line.lastIndexOf(')') === line.length - 1) {
            line = line.substr(0, line.length - 1);
        }
        lastRecord.robots += "\n" + line;
    }
}

function constructParsers(d2r) {
    var out = {}
    for (o in d2r) {
        out[o] = {};
        // Our robots-parser seems to distinguish between protocols and not apply
        // rules from the http://xxxx/robots.txt to the https://xxxx/ site
        // So just use two parsers
        // TODO : use 1 parser and reformat URLs when they are tested
        out[o]['http:'] = robotsParser('http://' + o + '/robots.txt', d2r[o]);
        out[o]['https:'] = robotsParser('https://' + o + '/robots.txt', d2r[o]);
    }
    return out;
}

rl.on('line', (line) => {
    var p = line.indexOf(')(');
    if (p > 0) {
        var parts = line.split(')(');
        addLine(part[0]);
        addLine(part[1])
    } else {
        addLine(line);
    }
});

rl.on('close', () => {
    // add the last lastRecord
    robots[lastRecord.domain] = lastRecord.robots;
    // Construct the robots.txt parser objects, indexed by hostname and protocol
    var d2r = constructParsers(robots);

    filterFile(URLFile, d2r)
    filterLinksFile(linksFile, d2r)
})

///////// Part 2 : Apply the robots-parsers

function isAllowed(url, d2r, hostname) {
    const myURL = urlParser.parse(url);
    if (d2r[myURL.hostname]) {
        if (d2r[myURL.hostname][myURL.protocol]) {
            var ret = (d2r[myURL.hostname][myURL.protocol].isAllowed(url, 'darkrobots/0.1'))
            if (ret === undefined || ret) {
                // undefined means the robots-parser doesn't feel responsible for this URL
                return true;
            } else {
                return false;
            }
        } else {
            // There can be other URLs in the file with e.g. dns: protocol. 
            // We assume that robots.txt doesn't apply to them
            return true;
        }
    } else {
        // We have no parser for this hostname. This means that we don't have a robots.txt for that host
        return true;
    }
}

function filterFile(fname, d2r, onlyStats) {
    // fname is the name of a file with the format :
    // host TAB URL
    // per line
    // d2r is the domain2robots-parser object constructed previously
    // This function returns all blocked URLs
    const rl = readline.createInterface({
        input: fs.createReadStream(fname)
    });
    // Counters : Total, allowed, disallowed
    var c = { tot: 0, a: 0, d: 0 };
    // Hash for host names to count the number of different hosts in the URL file
    var hostsSeen = {};
    rl.on('line', (line) => {
        var parts = line.split("\t");
        c.tot++;
        hostsSeen[parts[0]] = 1;
        if (isAllowed(parts[1], d2r, parts[0])) {
            //console.log(parts[1])
            c.a++;
        } else {
            if (!onlyStats) {
                console.log(parts[1])
            }
            c.d++;
        }
    });
    rl.on('close', () => {
        if (!onlyStats) {
            return;
        }
        // Output the statistics
        console.dir(c);
        var f = 0;
        for (var o in hostsSeen) {
            f++;
        }
        console.log('hosts seen', f);
        f = 0;
        for (o in d2r) {
            f++;
        }
        console.log('hosts with robots', f)
    })
}

function filterLinksFile(fname, d2r, onlyStats) {
    // fname is the name of a file with the format :
    // SourceURL TAB TargetURL
    // per line
    // d2r is the domain2robots-parser object constructed previously
    // This function returns all blocked URL combinations
    const rl = readline.createInterface({
        input: fs.createReadStream(fname)
    });
    // Statistics: total, allowed, disallowed, 
    // blocked because the source URL would have been blocked by its robots.txt
    // blocked because the target URL would have been blocked by its robots.txt
    var c = { tot: 0, a: 0, d: 0, sourceBlocked: 0, targetBlocked: 0 }
    rl.on('line', (line) => {
        var parts = line.split("\t");
        c.tot++;
        if (isAllowed(parts[0], d2r)) {
            if (isAllowed(parts[1], d2r)) {
                c.a++;
            } else {
                c.d++;
                c.targetBlocked++;
                if (!onlyStats) {
                    console.log(line);
                }
            }
        } else {
            if (!onlyStats) {
                console.log(line);
            }
            c.sourceBlocked++;
            if (isAllowed(parts[1], d2r)) {
                c.d++;
            } else {
                c.targetBlocked++;
                c.d++;
            }
        }
    })
    rl.on('close', () => {
        if (onlyStats) {
            console.dir(c);
        }
    })
}