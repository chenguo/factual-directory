(ns indexer.featurizer
  (:require [clojure.tools.cli :refer :all]
            [clojure.java.io :as io]
            [cheshire.core :as json]
            [featurize.core :as f]
            [indexer.config :as config]
            [indexer.db :as db])
  (:gen-class))

(defn- output-rows [rows output-file]
  (with-open [wrtr (io/writer output-file)]
    (doseq [row rows]
      (.write wrtr (str (json/encode row) "\n")))))

(defn -main [& args]
  (let [[arg-map _ usage]
        (cli args
             ["--config" "JSON file of DB configs"]
             ["--output" "Path to output features"])]
    (when-not (every? arg-map [:config :output])
      (println usage)
      (System/exit 1))
    (let [db-config (config/read-config-file (:config arg-map))
          index-entries (db/get-all-annotations db-config)
          featurized-rows (mapv f/featurize index-entries)]
      (println "featurized" (count featurized-rows) "rows")
      (output-rows featurized-rows (:output arg-map)))))
