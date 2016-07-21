(ns query-server.db
  (:require [clojure.java.jdbc :as j]
            [query-server.config :as conf]))


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

(def db (make-db (:db conf/config)))
(def index-table (:index-table (:db conf/config)))
(println db)

(defn make-query [tokens]
  (let [qstr (str "SELECT * FROM " index-table " LIMIT 10")
        values nil]
    [qstr]))

(defn query [qtokens]
  (let [sql-query (make-query qtokens)
        results (j/query db sql-query)]
    results))
