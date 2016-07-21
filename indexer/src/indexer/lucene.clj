(ns indexer.lucene
  (:require [clojure.string :refer [join lower-case]]
            [indexer.text-process :as text])
  (:import [org.apache.lucene.document
            Document LongPoint TextField Field$Store]
           org.apache.lucene.index.IndexWriter
           org.apache.lucene.index.IndexWriterConfig
           org.apache.lucene.analysis.en.EnglishAnalyzer
           org.apache.lucene.store.MMapDirectory))

(defn- make-path
  [index-path]
  (let [abs-path (.getAbsolutePath (java.io.File. index-path))]
    (java.nio.file.Paths/get
     (java.net.URI. (str "file:///" abs-path)))))

(defn- create-index-writer
  [index-path]
  (let [path (make-path index-path)
        dir (MMapDirectory. path)
        config (IndexWriterConfig. (EnglishAnalyzer.))]
    (IndexWriter. dir config)))

(defn- make-text-field [name value store?]
  (let [value (text/format-string value)
        store (if store? Field$Store/YES Field$Store/NO)]
    (TextField. name value store)))

(defn- make-document [entry]
  (doto (Document.)
    (.add (make-text-field"id" (:id entry) true))
    (.add (make-text-field "title" (:title entry) true))
    (.add (make-text-field "description" (:description entry) true))
    (.add (make-text-field "keywords" (join " " (:keywords entry)) true))
    (.add (make-text-field "manual_tags" (join " " (:manual_tags entry)) true))
    (.add (make-text-field "corpus" (:corpus entry) true))
    (.add (LongPoint. "timestamp" (long-array [(:timestamp entry)])))))

(defn- add-document [writer doc]
  (.addDocument ^IndexWriter writer doc))

(defn build-index
  [entries index-path]
  (with-open [writer (create-index-writer index-path)]
    (doseq [entry entries]
      (try
        (add-document writer (make-document entry))
        (catch Exception e
          (.printStackTrace e))))))
