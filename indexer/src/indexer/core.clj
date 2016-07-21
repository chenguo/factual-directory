(ns indexer.core
  (:require [clojure.tools.cli :refer :all]
            [cheshire.core :as json]
            [indexer.db :as db]
            [indexer.lucene :as lucene])
  (:gen-class))

(defn read-json-file [path]
  (json/parse-string (slurp path) true))

(defn -main [& args]
  (let [[arg-map _ usage]
        (cli args
             ["--config" "JSON file of DB configs"]
             ["--output" "Path to output index"])]
    (when-not (every? arg-map [:config :output])
      (println usage)
      (System/exit 1))
    (let [db-config (read-json-file (:config arg-map))
          index-entries (db/get-all-entries db-config)]
      (println "read" (count index-entries) "index entries")
      (lucene/build-index index-entries "test-index"))))
