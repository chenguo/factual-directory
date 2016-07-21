(ns query-server.search
  (:require [schema.core :as s])
  (:import
   java.util.Date
   java.util.StringTokenizer)
)

(s/defschema Echo
  {:query s/Str
   :tokens [java.lang.String]
   :timestamp java.lang.Long
   })

(def Search Echo)

(defn- tokenize [qstr]
  (loop [tokens []
         token-stream (StringTokenizer. qstr)]
    (if (.hasMoreTokens token-stream)
      (recur (conj tokens (.nextToken token-stream))
             token-stream)
      tokens)))

(defn echo [qstr]
  (let [tokens (tokenize qstr)]
    {:query qstr
     :tokens tokens
     :timestamp (.getTime (Date.))}))

(defn search [qstr]
  (echo qstr))
