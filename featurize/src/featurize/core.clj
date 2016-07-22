(ns featurize.core
  (:require [clojure.set :as set]
            [primitive-math :as pm])
  (:import java.util.StringTokenizer
           opennlp.tools.stemmer.PorterStemmer))

(defn- tokenize [s]
  (loop [tokens []
         token-stream (StringTokenizer. s)]
    (if (.hasMoreTokens token-stream)
      (recur (conj tokens (.toLowerCase (.nextToken token-stream)))
             token-stream)
      tokens)))

(defn- url-tokenize [s]
  (clojure.string/split s #"[^a-zA-Z0-9]"))

(def ^:private stem
  (let [stemmer (PorterStemmer.)]
    (fn [tokens]
      (mapv #(.stem stemmer ^String %) tokens))))

(def ^:const true-val 1.0)
(def ^:const false-val 0.0)

(defn- source-features [source]
  {(keyword (str "source_" source)) true-val})

(defn- token-match [qtoks ftoks]
  (reduce (fn [m qtok]
            (let [matches (filter #(= qtok %) ftoks)]
              (assoc m qtok (count matches))))
          {}
          qtoks))

(defn- safe-div [nom denom]
  (if (pm/not== denom (double 0))
    (pm// nom denom)
    0.0))

(defn- token-set-match [qtoks ftoks]
  (let [match-map (token-match qtoks ftoks)
        match-vals (vals match-map)
        total-matches (double (reduce + match-vals))
        nftoks (double (count ftoks))
        nqtoks (double (count qtoks))
        distinct-matches (double (count (filter #(> % 0) match-vals)))]
    {:matches total-matches
     :match-rate (safe-div total-matches nftoks)
     :distinct-matches distinct-matches
     :distinct-match-rate (safe-div distinct-matches nqtoks)}))

(defn- field-token-match [qstr-tokens qstr-stemmed field annotation tokenizer stemmer]
  (if-let [field-val (get annotation field)]
    (let [fname (name field)
          field-tokens (tokenizer field-val)
          match-stats (token-set-match qstr-tokens field-tokens)
          field-stemmed (stemmer field-tokens)
          stemmed-match-stats (token-set-match qstr-stemmed field-stemmed)]
      (persistent!
       (reduce (fn [m [k v]]
                 (let [stem-key (keyword (str fname "-" (name k) "-stem"))]
                   (assoc! m stem-key v)))
               (reduce (fn [m [k v]]
                         (assoc! m (keyword (str fname "-" (name k))) v))
                       (transient {})
                       match-stats)
               stemmed-match-stats)))))

(defn- time-delta
  "t1 is expected to be more recent than t2"
  [^double t1 ^double t2]
  (when (pm/> t1 t2)
    (pm/- t1 t2)))

(defn generate-features [annotation]
  (let [qstr (:qstr annotation)
        qstr-tokens (tokenize qstr)
        qstr-stemmed (stem qstr-tokens)
        url (:url annotation)
        query-time (:qtime annotation)
        doc-time (:itime annotation)
        field-featurizer (fn [field tokenizer stemmer]
                           (field-token-match qstr-tokens qstr-stemmed field
                                              annotation tokenizer stemmer))]
    (merge
     {:text-score (:text-score annotation)
      :time-elapsed (time-delta (:qtime annotation) (:itime annotation))
      }
     (source-features (:source annotation))
     (field-featurizer :title tokenize stem)
     (field-featurizer :description tokenize stem)
     (field-featurizer :manual_tags identity stem)
     (field-featurizer :keywords identity stem)
     (field-featurizer :corpus tokenize stem)
     (field-featurizer :url url-tokenize stem)
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
  (-> {:features (feature-map->vector features)}
      (apply-label (:selected annotation))
      (apply-meta annotation)))

(defn featurize [annotation]
  (-> annotation
      generate-features
      (format-features annotation)))
