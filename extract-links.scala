import org.warcbase.spark.matchbox.{ExtractDomain, ExtractLinks, RecordLoader}
import org.warcbase.spark.rdd.RecordRDD._

RecordLoader.loadArchives("/mnt/TNA-Dataset/2010electionsUK/post-election/decc.gov.uk/*.warc.gz",sc)
  .keepValidPages()
  .map(r => (r.getCrawlDate, ExtractLinks(r.getUrl, r.getContentString)))
  .flatMap(r => r._2.map(f => (r._1, f._1, f._2))) 
  .saveAsTextFile("/mnt/TNA-Dataset/robots/links-decc.gov.uk")