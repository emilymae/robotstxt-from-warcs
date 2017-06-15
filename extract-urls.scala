import org.warcbase.spark.matchbox.{ExtractDomain, ExtractLinks, RecordLoader}
import org.warcbase.spark.rdd.RecordRDD._

/*
 * Extracts all URLs from a collection of WARCs
 * TODO: Consider filtering by HTTP return code 2xx results
 */
RecordLoader.loadArchives("/mnt/TNA-Dataset/2010electionsUK/post-election/*/*.warc.gz",sc)
  .map(r => (r.getCrawlDate, r.getDomain, r.getUrl))
  .saveAsTextFile("/mnt/TNA-Dataset/robots/urls-all")