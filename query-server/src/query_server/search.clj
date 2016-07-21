(ns query-server.search
  (:require [clojure.walk :refer [keywordize-keys]]
            [schema.core :as s]
            [query-server.config :as conf]
            [query-server.db :as db]
            [query-server.lucene :as lucene])
  (:import
   java.lang.Long
   java.util.Date
   java.util.StringTokenizer)
)

(s/defschema Echo
  {:query s/Str
   :tokens [s/Str]
   :timestamp Long
   })

(s/defschema Document
  {:id s/Str
   :url s/Str
   :source s/Str
   :title s/Str
   :description s/Str
   :corpus s/Str
   :keywords [s/Str]
   :manual_tags [s/Str]
   :timestamp Long
   })

(s/defschema Search
  {:query s/Str
   :timestamp Long
   :results [Document]})

(defn- tokenize [qstr]
  (loop [tokens []
         token-stream (StringTokenizer. qstr)]
    (if (.hasMoreTokens token-stream)
      (recur (conj tokens (.toLowerCase (.nextToken token-stream)))
             token-stream)
      tokens)))

(defn echo [qstr]
  (let [tokens (tokenize qstr)]
    {:query qstr
     :tokens tokens
     :timestamp (.getTime (Date.))}))

(def score-docs identity)
(def sort-docs identity)

(defn format-docs [docs] docs)

(defn format-resp [docs qstr]
  {:query qstr
   :results (format-docs docs)
   :timestamp (.getTime (Date.))})

(defn search-lucene [qstr]
  (let [ids (lucene/query qstr)]
    (if (seq ids)
      (-> (db/query-ids ids)
          score-docs
          sort-docs
          (format-resp qstr))
      (format-resp [] qstr))))

(defn search-pg [qstr]
  (let [tokens (tokenize qstr)]
    (-> qstr
        tokenize
        db/query
        score-docs
        sort-docs
        (format-resp qstr))))

(def search search-lucene)
