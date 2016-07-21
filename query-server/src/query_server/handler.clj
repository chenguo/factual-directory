(ns query-server.handler
  (:require [compojure.api.sweet :refer :all]
            [schema.core :as s]
            [ring.util.http-response :refer :all]
            [query-server.search :as search]))

(def app
  (api
   (GET "/search" []
        :query-params [qstr :- String]
        :return search/Search
        :summary "Handle search query"
        (ok (search/search qstr)))

   (POST "/search/feedback" []
         :body [feedback search/Feedback] ;search/Feedback]
         :summary "Handle search user interaction feedback"
         (ok (search/feedback feedback)))

   (GET "/echo" []
        :query-params [qstr :- String]
        :return search/Echo
        :summary "Echo search query"
        (ok (search/echo qstr)))))
