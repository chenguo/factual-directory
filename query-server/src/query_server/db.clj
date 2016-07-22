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

(def ^:private db (make-db (:db conf/config)))
(def ^:private index-table (:index-table (:db conf/config)))
(def ^:private query-table (:query-table (:db conf/config)))
(def ^:private annotation-table (:annotation-table (:db conf/config)))
(println db)

(defn- make-query [tokens]
  (let [qstr (str "SELECT * FROM " index-table " LIMIT 10")
        values nil]
    [qstr]))

(defn query [qtokens]
  (let [sql-query (make-query qtokens)
        results (j/query db sql-query)]
    results))

(defn- make-id-query [ids]
  (let [place-holders (clojure.string/join "," (repeat (count ids) "?"))
        qstr (str "SELECT id, url, source, title, keywords, manual_tags, description, corpus, "
                  "cast(extract(epoch from timestamp) as integer) as timestamp "
                  "FROM " index-table " WHERE id IN (" place-holders ")")]
    (concat [qstr] ids)))

(defn query-ids [ids]
  (let [sql-query (make-id-query ids)
        results (j/query db sql-query)]
    results))

(defn- make-timestamp-query [query timestamp]
  (let [qstr (str "INSERT INTO " query-table " (timestamp, qstr) VALUES (to_timestamp(?),?)")
        sec-timestamp (int (/ timestamp 1000))]
    [qstr sec-timestamp query]))

(defn save-search [qstr timestamp]
  (let [sql-query (make-timestamp-query qstr timestamp)]
    (j/query db sql-query)))

(defn- save-selected [query timestamp selected]
  "Entry may already be present, so do insert then update"
  (let [sec-timestamp (int (/ timestamp 1000))
        with-query (str "WITH qid AS (SELECT qid FROM query WHERE "
                        " qstr = ? AND timestamp = to_timestamp(?)), "
                        "iid AS (SELECT iid FROM index WHERE id = ?)")
        qstr (str with-query " INSERT INTO " annotation-table " (qid, selected, iid) VALUES "
                  "((SELECT qid FROM qid), true, (SELECT iid FROM iid))")]
    (try (j/query db [qstr query sec-timestamp selected])
         (catch Exception e))
    (let [qstr (str with-query " UPDATE " annotation-table " SET selected = true WHERE "
                    "qid = (SELECT qid FROM qid) AND iid = (SELECT iid FROM iid)")]
      (try (j/query db [qstr query sec-timestamp selected])
           (catch Exception e)))))

(defn- save-unselected
  "If this has a collision (i.e. already marked selected)
   just let it fail"
  [query timestamp id]
  (let [sec-timestamp (int (/ timestamp 1000))
        qstr (str "WITH qid AS (SELECT qid FROM query WHERE qstr = ? AND timestamp = to_timestamp(?)), "
                  "iid AS (SELECT iid FROM index WHERE id = ?) "
                  "INSERT INTO " annotation-table " (qid, selected, iid) VALUES "
                  "((SELECT qid FROM qid), false, (SELECT iid from iid))")]
    (try (j/query db [qstr query sec-timestamp id])
         (catch Exception e))))

(defn save-search-feedback
  "Store user interaction with search results. Save
   the selected result and a sample of unselected results.
   Note because the user can select multiple things from
   results, the IDs here may be already present in the DB.

   We can update an unselected entry to selected, but we
   should never update a selected entry to unselected."
  [qstr timestamp selected unselected-ids]
  (save-selected qstr timestamp selected)
  (doseq [unsel-id unselected-ids]
    (save-unselected qstr timestamp unsel-id)))
