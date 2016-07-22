(defproject factual.directory/query-server "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :repositories {"releases"
                 {:url "http://maven.corp.factual.com/nexus/content/repositories/releases"
                  :sign-releases false}
                 "snapshots"
                 {:url "http://maven.corp.factual.com/nexus/content/repositories/snapshots"
                  :sign-releases false}
                 "public" "http://maven.corp.factual.com/nexus/content/groups/public/"}
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [clj-time "0.11.0"] ; required due to bug in `lein-ring uberwar`
                 [metosin/compojure-api "1.1.1"]
                 [org.clojure/java.jdbc "0.6.2-alpha1"]
                 [org.postgresql/postgresql "9.4-1201-jdbc41"]
                 [factual.directory/index-searcher "0.0.1-SNAPSHOT"]
                 [factual.directory/featurize "0.0.2-SNAPSHOT"]
                 [factual/prediction-tools "0.3.0-SNAPSHOT"]]
  :ring {:handler query-server.handler/app
         :port 4000}
  :uberjar-name "server.jar"
  :profiles {:dev {:dependencies [[javax.servlet/servlet-api "2.5"]]
                   :plugins [[lein-ring "0.9.7"]]}}
  :resource-paths ["resources/private"])
