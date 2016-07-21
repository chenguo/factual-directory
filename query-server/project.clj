(defproject factual.directory/query-server "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [clj-time "0.11.0"] ; required due to bug in `lein-ring uberwar`
                 [metosin/compojure-api "1.1.1"]
                 [org.clojure/java.jdbc "0.6.2-alpha1"]
                 [org.postgresql/postgresql "9.4-1201-jdbc41"]]
  :ring {:handler query-server.handler/app}
  :uberjar-name "server.jar"
  :profiles {:dev {:dependencies [[javax.servlet/servlet-api "2.5"]]
                   :plugins [[lein-ring "0.9.7"]]}}
  :resource-paths ["resources/private"])
