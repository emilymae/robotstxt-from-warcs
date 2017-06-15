import org.warcbase.spark.matchbox._
import org.warcbase.spark.rdd.RecordRDD._
import StringUtils._
import org.warcbase.data.WarcRecordUtils

/*
 * Extracts all robots.txts from a collection of WARCs
 * TODO: Make the filter regexp-based so that all 2xx-codes are considered valid and not just 200.
 */
val links = RecordLoader.loadArchives("/mnt/TNA-Dataset/2010electionsUK/post-election/*/*.warc.gz",sc)
.keepUrlPatterns(Set("https?://[^/]*/robots.txt".r))
.filter(r => (r.getContentString.contains("HTTP/1.1 200") || r.getContentString.contains("HTTP/1.0 200") || r.getContentString.contains("HTTP/2.0 200")))
.keepMimeTypes(Set("text/plain"))
.map(r=>("<------- SNIP HERE -------->", r.getDomain, r.getCrawlDate, RemoveHttpHeader(r.getContentString)))
.saveAsTextFile("/mnt/TNA-Dataset/robots/robots-all")