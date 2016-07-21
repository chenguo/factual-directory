(ns indexer.text-process
  (:require [clojure.string :refer [join lower-case]]))


(defn format-string [str]
  (if (nil? str)
    ""
    (lower-case str)))
