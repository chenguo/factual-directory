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
