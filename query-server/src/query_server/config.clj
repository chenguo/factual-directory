(ns query-server.config
  (:require [cheshire.core :as json]
            [clojure.java.io :as io]))

(def ^:const config-file "config.json")

(defn- load-config
  [cfg-file]
  (try
    (-> cfg-file
        io/resource
        slurp
        (json/decode true))
    (catch Exception e
      (print "Failed to load config file" config-file)
      (throw e))))

(def config (load-config config-file))
