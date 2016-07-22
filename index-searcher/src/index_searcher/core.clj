(ns index-searcher.core
  (:import java.util.StringTokenizer
           org.apache.lucene.document.Document
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

(defn create-index-searcher
  [index-path]
  (let [directory (MMapDirectory. (make-path index-path))
        reader (DirectoryReader/open directory)]
    (IndexSearcher. reader)))

(defn tokenize [qstr]
  (loop [tokens []
         token-stream (StringTokenizer. qstr)]
    (if (.hasMoreTokens token-stream)
      (recur (conj tokens (.toLowerCase (.nextToken token-stream)))
             token-stream)
      tokens)))

(defn fuzzify-qstr
  [qstr]
  (let [tokens (tokenize qstr)]
    (->> (tokenize qstr)
         (mapcat #(vector % #_(str % "~") (str % "*")))
         (clojure.string/join " "))))

(def ^:private parser (SimpleQueryParser. (EnglishAnalyzer.) "_search"))

(def ^:private ^:const max-search-docs 10000)

(defn query [searcher qstr limit]
  (let [query (.parse parser qstr)
        docs (.search searcher query (min limit max-search-docs))]
    (mapv (fn [score-doc]
            (let [doc-n (.doc score-doc)
                  doc (.doc searcher doc-n)]
              {:id (.stringValue (.getField doc "id"))
               :score (.score score-doc)}))
          (.scoreDocs docs))))
