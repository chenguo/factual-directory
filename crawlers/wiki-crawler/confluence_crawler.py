import requests
import time
from bs4 import BeautifulSoup as Soup

CRAWL_SOURCE = 'confluencecrawler'
INDEX_API = 'http://10.20.10.146:3000/indexes'
USER, PASS = open('.credentials.txt', 'r').read().split(', ')
HOST = "http://wiki.corp.factual.com"
SEARCH_PARAMS = {
  'limit': 100,
  'expand': 'space,body.export_view'
}
DEFAULT_KEYWORDS = ['confluence', 'wiki']
SEEN = set()

def do_parse():
  index_buffer = []
  responses = []
  for index in get_indexes():
    index_buffer.append(index)
    if len(index_buffer) > 1000:
      responses.append(requests.post(INDEX_API, json=index_buffer))
      print responses[-1].status_code, responses[-1].text
      index_buffer = []
  responses.append(requests.post(INDEX_API, json=index_buffer))
  return responses

def test_parse():
  for index in get_indexes():
    print index['url'], index['title']

def get_indexes():
  next_page_url = "/rest/api/content?expand=space%2Cbody.export_view%2Cdescription&limit=100&start=100"
  num_indexes = 0
  while next_page_url is not None:
    result = get(next_page_url).json()
    next_page_url = get_next_page(result)
    for res in result['results']:
      num_indexes += 1
      yield make_index(res)
  print 'saw {0} indexes'.format(num_indexes)

def make_index(json):
  corpus = Soup(json['body']['export_view']['value']).text.split()
  url = json['_links']['webui']
  if url in SEEN:
    print url
  SEEN.add(url)
  return {
    'id': 'confluence:' + url,
    'url': HOST + url,
    'keywords': [json['space']['key'], json['space']['name']] + DEFAULT_KEYWORDS,
    'title': json['title'],
    'description': ' '.join(corpus[:20]),
    'corpus': ' '.join(corpus),
    'manual_tags': [],
    'timestamp': int(time.time()),
    'source': CRAWL_SOURCE
  }

def get_next_page(json):
  return json['_links'].get('next')

def get(endpoint):
  return requests.get(HOST + endpoint, auth=(USER, PASS))

def parse_wiki_page(soup):
  pass 

def get_titles(soup):
  return [title.text for title in soup.find_all('h1')]

# if __name__ == '__main__':
#   print do_parse()
