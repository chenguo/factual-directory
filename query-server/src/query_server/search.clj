(ns query-server.search
  (:require [clojure.walk :refer [keywordize-keys]]
            [schema.core :as s]
            [index-searcher.core :as lucene]
            [query-server.config :as conf]
            [query-server.db :as db])
  (:import java.lang.Long
           java.util.Date))

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

(defn echo [qstr]
  (let [tokens (lucene/tokenize qstr)]
    {:query qstr
     :tokens tokens
     :timestamp (.getTime (Date.))}))

(defn- save-qstr [qstr timestamp]
  ; Swallow exceptions
  (try
    (db/save-search qstr timestamp)))

(def ^:private score-docs identity)
(def ^:private sort-docs identity)

(defn- format-docs [docs]
  (mapv #(select-keys % (keys Document)) docs))

(defn- format-resp [docs qstr timestamp]
  {:query qstr
   :results (format-docs docs)
   :timestamp timestamp})

(def ^:private searcher
  (let [index-path (:document-index conf/config)]
    (lucene/create-index-searcher index-path)))
(println "Created searcher" searcher)

(defn- search-lucene [qstr timestamp]
  (let [fuzzy-qstr (lucene/fuzzify-qstr qstr)
        matches (lucene/query searcher fuzzy-qstr)]
    (if (seq matches)
      (-> (mapv :id  (take 50 matches))
          db/query-ids
          score-docs
          sort-docs
          (format-resp qstr timestamp))
      (format-resp [] qstr timestamp))))

(defn- search-pg [qstr timestamp]
  (-> qstr
      lucene/tokenize
      db/query
      score-docs
      sort-docs
      (format-resp qstr timestamp)))

(defn search [qstr]
  (let [timestamp (.getTime (Date.))]
    (future (save-qstr qstr timestamp))
    (search-lucene qstr timestamp)))

(s/defschema Feedback
  {:query s/Str
   :timestamp Long
   :selected s/Str
   :ids [s/Str]})

(defn- save-feedback [f]
  (let [selected (:selected f)
        other-results (take-while #(not= selected %) (:ids f))
        ;; Store only 3 of the bad results
        store-results (take 3 other-results)]
    (db/save-search-feedback (:query f) (:timestamp f) selected store-results)))

(defn feedback [f]
  (future (save-feedback f))
  {})
