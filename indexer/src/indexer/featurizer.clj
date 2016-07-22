(ns indexer.featurizer
  (:require [clojure.tools.cli :refer :all]
            [clojure.java.io :as io]
            [cheshire.core :as json]
            [featurize.core :as f]
            [index-searcher.core :as lucene]
            [indexer.config :as config]
            [indexer.db :as db])
  (:gen-class))

(defn- get-lucene-score [searcher doc]
  (let [qstr (:qstr doc)
        doc-id (:id doc)
        fuzzy-qstr (lucene/fuzzify-qstr qstr)
        id-scores (lucene/query searcher fuzzy-qstr 1000)]
    (some (fn [id-score]
            (when (= (:id id-score) doc-id)
              (:score id-score)))
          id-scores)))

(defn- featurize-rows [entries index-path]
  (let [searcher (lucene/create-index-searcher index-path)
        _ (println "Created searcher" searcher)]
    (mapv (fn [doc]
            (let [text-score (get-lucene-score searcher doc)]
              (f/featurize (assoc doc :text-score text-score))))
          entries)))

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
          index-entries (db/get-all-annotations (:db db-config))
          featurized-rows (featurize-rows index-entries (:document-index db-config))]
      (println "featurized" (count featurized-rows) "rows")
      (output-rows featurized-rows (:output arg-map)))))
