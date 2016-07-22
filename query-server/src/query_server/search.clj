(ns query-server.search
  (:require [clojure.walk :refer [keywordize-keys]]
            [schema.core :as s]
            [index-searcher.core :as lucene]
            [query-server.config :as conf]
            [query-server.db :as db]
            [query-server.predict :as predict]
            )
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

(defn- text-score-map [lucene-matches]
  (persistent!
   (reduce (fn [m match]
             (assoc! m (:id match) (:score match)))
           (transient {})
           lucene-matches)))

(defn- attach-text-scores
  "Attach the Lucene text match score to each doc"
  [docs text-scores]
    (mapv #(assoc %1 :text-score (get text-scores (:id %))) docs))

(defn- score-docs [docs text-scores qstr timestamp]
  (println "qstr" qstr)
  (let [docs (attach-text-scores docs text-scores)]
    (mapv (fn [doc]
            (let [doc (assoc doc
                        :qstr qstr
                        :qtime timestamp
                        :itime (:timestamp doc))
                  score (predict/score-document doc)]
              (assoc doc :ml-score score)))
          docs)))

(defn- sort-docs
  "Sort descending by score"
  [docs]
  (let [docs (sort-by :text-score #(compare %2 %1) docs)]
    (println "score sample" (mapv :text-score (take 10 docs)))
    docs))

(defn- format-docs [docs]
  (mapv #(select-keys % (keys Document)) docs))

(defn- filter-docs [docs]
  (take 100 docs))

(defn- format-resp [docs qstr timestamp]
  {:query qstr
   :results (format-docs docs)
   :timestamp timestamp})

(def ^:private searcher
  (let [index-path (:document-index conf/config)]
    (lucene/create-index-searcher index-path)))
(println "Created searcher" searcher)

(defn- search-lucene [qstr timestamp]
  (let [sec-timestamp (int (/ timestamp 1000))
        fuzzy-qstr (lucene/fuzzify-qstr qstr)
        matches (lucene/query searcher fuzzy-qstr 50)]
    (if (seq matches)
      (let [text-scores (text-score-map matches)]
        (-> (mapv :id  matches)
            db/query-ids
            (score-docs text-scores qstr sec-timestamp)
            sort-docs
            filter-docs
            (format-resp qstr timestamp)))
        (format-resp [] qstr timestamp))))

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
