(ns query-server.predict
  (:require [cheshire.core :as json]
            [predict.predict :as predict]
            [query-server.config :as conf]
            [featurize.core :as featurize]))

(defn- read-model [config]
  (-> (:search-model config)
      slurp
      json/decode))

(defn- create-evaluator [config]
  (predict/create-evaluator (read-model config)))

(def ^:private evaluator
  (create-evaluator conf/config))

(defn score-document [doc]
  (let [row (featurize/featurize doc)
        score (.predict evaluator (:features row))]
    (println (mapv #(get % "value") (:features row)))
    (println (get score "score"))
    (get score "score")))
