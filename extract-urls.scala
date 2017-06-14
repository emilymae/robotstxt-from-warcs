import org.warcbase.spark.matchbox.{ExtractDomain, ExtractLinks, RecordLoader}
import org.warcbase.spark.rdd.RecordRDD._

RecordLoader.loadArchives("/mnt/TNA-Dataset/2010electionsUK/post-election/*/*.warc.gz",sc)
  .map(r => (r.getCrawlDate, r.getDomain, r.getUrl))
  .saveAsTextFile("/mnt/TNA-Dataset/robots/urls-all")