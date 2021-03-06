(ns indexer.db
    (:require [clojure.java.jdbc :as j]))

(extend-protocol j/IResultSetReadColumn
  org.postgresql.jdbc4.Jdbc4Array
  (result-set-read-column [pgobj metadata i]
    (vec (.getArray pgobj))))

(defn- make-subname [db-config]
  (str "//" (:host db-config) ":" (:port db-config) "/" (:database db-config)))

(defn- make-db [db-config]
  {:subprotocol "postgresql"
   :subname (make-subname db-config)
   :user (:user db-config)
   :password (:password db-config)})

(defn- make-query [db-config]
  [(str "SELECT * FROM " (:index-table db-config))])

(defn get-all-entries [db-config]
  (let [db (make-db db-config)
        sql-query (make-query db-config)]
    (j/query db sql-query)))

(defn- make-annotation-query [db-config]
  (let [index-table (:index-table db-config)
        query-table (:query-table db-config)
        annotation-table (:annotation-table db-config)]
    [(str "SELECT selected, index.id, query.qstr, title, url, keywords, manual_tags, description, source, corpus, "
          " cast(extract(epoch from query.timestamp) as integer) as qtime, "
          " cast(extract(epoch from index.timestamp) as integer) as itime "
          " FROM " annotation-table
          " INNER JOIN " index-table " ON (" index-table ".iid = " annotation-table ".iid)"
          " INNER JOIN " query-table " ON (" query-table ".qid = " annotation-table ".qid)")]))

(defn get-all-annotations [db-config]
  (let [db (make-db db-config)
        sql-query (make-annotation-query db-config)]
    (j/query db sql-query)))
