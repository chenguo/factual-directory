(defproject factual.directory/featurize "0.0.2-SNAPSHOT"
  :description "Featurize Factual Directory search annotations"
  :repositories {"releases"
                 {:url "http://maven.corp.factual.com/nexus/content/repositories/releases"
                  :sign-releases false}
                 "snapshots"
                 {:url "http://maven.corp.factual.com/nexus/content/repositories/snapshots"
                  :sign-releases false}
                 "public" "http://maven.corp.factual.com/nexus/content/groups/public/"}
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [cheshire "5.6.3"]
                 [org.apache.lucene/lucene-core "6.1.0"]
                 [org.apache.lucene/lucene-analyzers-common "6.1.0"]
                 [org.apache.opennlp/opennlp-tools "1.6.0"]]
  :profiles {:uberjar {:aot :all}}
  :main indexer.core
  :aot :all)
