(ns query-server.lucene
  (:require [query-server.config :as conf])
  (:import org.apache.lucene.document.Document
           org.apache.lucene.index.DirectoryReader
           org.apache.lucene.store.MMapDirectory
           org.apache.lucene.analysis.en.EnglishAnalyzer
           org.apache.lucene.queryparser.simple.SimpleQueryParser
           org.apache.lucene.search.IndexSearcher))


(defn- make-path
  [index-path]
  (let [abs-path (.getAbsolutePath (java.io.File. index-path))]
    (java.nio.file.Paths/get
     (java.net.URI. (str "file:///" abs-path)))))

(defn- create-index-searcher
  [index-path]
  (let [directory (MMapDirectory. (make-path index-path))
        reader (DirectoryReader/open directory)]
    (IndexSearcher. reader)))

(def ^:private searcher (create-index-searcher (:document-index conf/config)))
(println "Loaded searcher" searcher)

(def ^:private parser (SimpleQueryParser. (EnglishAnalyzer.) "_search"))

(defn query [qstr]
  (let [query (.parse parser qstr)
        docs (.search searcher query 100)]
    (println "qstr" qstr "matchs" (.totalHits docs))
    (mapv (fn [score-doc]
            (let [doc-n (.doc score-doc)
                  doc (.doc searcher doc-n)]
              (.stringValue (.getField doc "id"))))
          (.scoreDocs docs))))
