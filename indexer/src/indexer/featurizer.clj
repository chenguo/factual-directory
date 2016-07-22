(ns indexer.featurizer
  (:require [clojure.tools.cli :refer :all]
            [clojure.java.io :as io]
            [cheshire.core :as json]
            [indexer.config :as config]
            [indexer.db :as db])
  (:gen-class))


(defn generate-features [annotation]
  (println "annot" annotation)
  (let [label (:selected annotation)
        qstr (:qstr annotation)
        title (:title annotation)
        url (:url annotation)
        desc (:description annotation)
        source (:source annotation)
        tag (:manual_tags annotation)
        keywords (:keywords annotation)
        timestamp (:timestamp annotation)
        corpus (:corpus annotation)]
    (merge


)))

(defn- apply-label [features label]
  (assoc features :label label))

(defn- apply-meta [features annotation]
  (assoc features :meta
         (select-keys annotation [:qstr :timestamp])))

(defn- feature-map->vector [feature-map]
  (mapv (fn [[k v]] {:name k :value v})
        feature-map))

(defn- format-features [features annotation]
  (-> {:feautres (feature-map->vector features)}
      (apply-label (:selected annotation))
      (apply-meta annotation)))

(defn featurize [annotation]
  (-> annotation
      generate-features
      (format-features annotation)))

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
          featurized-rows (mapv featurize (take 3 index-entries))]
      (println "featurized" (count featurized-rows) "rows")
      (output-rows featurized-rows (:output arg-map)))))
