(ns indexer.config
  (:require [cheshire.core :as json]))

(defn- read-json-file [path]
  (json/parse-string (slurp path) true))

(def read-config-file read-json-file)
