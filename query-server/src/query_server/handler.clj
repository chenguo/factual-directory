(ns query-server.handler
  (:require [compojure.api.sweet :refer :all]
            [ring.util.http-response :refer :all]
            [query-server.search :as search]))

(def app
  (api
   (GET "/search" []
        :query-params [qstr :- String]
        :return search/Search
        :summary "Handle search query"
        (ok (search/search qstr)))

   (GET "/echo" []
        :query-params [qstr :- String]
        :return search/Echo
        :summary "Echo search query"
        (ok (search/echo qstr)))))
