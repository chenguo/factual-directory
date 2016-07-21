(defproject factual.directory/query-server "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [clj-time "0.11.0"] ; required due to bug in `lein-ring uberwar`
                 [metosin/compojure-api "1.1.1"]
                 [org.clojure/java.jdbc "0.6.2-alpha1"]
                 [org.postgresql/postgresql "9.4-1201-jdbc41"]
                 [org.apache.lucene/lucene-core "6.1.0"]
                 [org.apache.lucene/lucene-analyzers-common "6.1.0"]
                 [org.apache.lucene/lucene-queryparser "6.1.0"]]
  :ring {:handler query-server.handler/app
         :port 4000}
  :uberjar-name "server.jar"
  :profiles {:dev {:dependencies [[javax.servlet/servlet-api "2.5"]]
                   :plugins [[lein-ring "0.9.7"]]}}
  :resource-paths ["resources/private"])
