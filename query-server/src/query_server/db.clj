(ns query-server.db
  (:require [clojure.java.jdbc :as j]
            [query-server.db-config :refer [db-config]]))


(extend-protocol j/IResultSetReadColumn
  org.postgresql.jdbc4.Jdbc4Array
  (result-set-read-column [pgobj metadata i]
    (vec (.getArray pgobj))))

(defn- make-subname [db-config]
  (str "//" (:hostname db-config) ":" (:port db-config) "/" (:database db-config)))

(def db
  {:subprotocol "postgresql"
   :subname (make-subname db-config)
   :user (:username db-config)
   :password (:password db-config)})

(defn make-query [tokens]
  (let [qstr (str "SELECT * FROM " (:index-table db-config) " LIMIT 10")
        values nil]
    [qstr]))

(defn query [qtokens]
  (let [sql-query (make-query qtokens)
        results (j/query db sql-query)]
    results))
