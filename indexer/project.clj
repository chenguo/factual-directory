(defproject factual.directory/indexer "0.1.0-SNAPSHOT"
  :description "Generate searchable indexes for Factual Directory"
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [org.clojure/java.jdbc "0.6.2-alpha1"]
                 [org.clojure/tools.cli "0.3.5"]
                 [cheshire "5.6.3"]
                 [org.postgresql/postgresql "9.4-1201-jdbc41"]
                 [org.apache.lucene/lucene-core "6.1.0"]
                 [org.apache.lucene/lucene-analyzers-common "6.1.0"]]
  :main indexer.core)
