(ns featurize.core
  (:import java.util.StringTokenizer
           opennlp.tools.stemmer.PorterStemmer))

(defn- tokenize [s]
  (loop [tokens []
         token-stream (StringTokenizer. s)]
    (if (.hasMoreTokens token-stream)
      (recur (conj tokens (.toLowerCase (.nextToken token-stream)))
             token-stream)
      tokens)))

(defn generate-features [annotation]
  (let [label (:selected annotation)
        qstr (:qstr annotation)
        qstr-tokens (tokenize qstr)
        qstr-stemmed ()
        title (:title annotation)
        url (:url annotation)
        desc (:description annotation)
        source (:source annotation)
        tag (:manual_tags annotation)
        keywords (:keywords annotation)
        timestamp (:timestamp annotation)
        corpus (:corpus annotation)]
    (merge

)))

(defn- apply-label [features label]
  (assoc features :label label))

(defn- apply-meta [features annotation]
  (assoc features :meta
         (select-keys annotation [:qstr :timestamp])))

(defn- feature-map->vector [feature-map]
  (mapv (fn [[k v]] {:name k :value v})
        feature-map))

(defn- format-features [features annotation]
  (-> {:feautres (feature-map->vector features)}
      (apply-label (:selected annotation))
      (apply-meta annotation)))

(defn featurize [annotation]
  (-> annotation
      generate-features
      (format-features annotation)))
