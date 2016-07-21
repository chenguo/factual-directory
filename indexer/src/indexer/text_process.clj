(ns indexer.text-process
  (:require [clojure.string :refer [join lower-case]]))

(defn combine-text-fields [entry]
  (let [basic-fields [(:id entry)
                      (:title entry)
                      (:description entry)
                      (:corpus entry)]]
    (clojure.string/join
     " "
     (concat (:keywords entry)
             (:manual_tags entry)
             basic-fields))))

(defn format-string [str]
  (if (nil? str)
    ""
    (lower-case str)))
