import requests
from dateutil import parser
import datetime
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
  next_page_url = "/rest/api/content?expand=space%2Cbody.export_view%2Chistory.lastUpdated&limit=100"
  num_indexes = 0
  while next_page_url is not None:
    response = get(next_page_url)
    if response.status_code == 200:
      result = response.json()
      next_page_url = get_next_page(result)
      for res in result['results']:
        num_indexes += 1
        yield make_index(res)
    else:
      print response.text, next_page_url
      break
  print 'saw {0} indexes'.format(num_indexes)

def make_index(json):
  corpus = ' '.join(remove_comments(Soup(json['body']['export_view']['value']).findAll(text=True))).split()
  url = json['_links']['webui']
  last_updated = parser.parse(json['history']['lastUpdated']['when'])
  return {
    'id': 'confluence:' + url,
    'url': HOST + url,
    'keywords': [json['space']['key'], json['space']['name']] + DEFAULT_KEYWORDS,
    'title': json['title'],
    'description': ' '.join(corpus[:20]),
    'corpus': ' '.join(corpus),
    'manual_tags': [],
    'timestamp': get_epoch_seconds(last_updated),
    'source': CRAWL_SOURCE
  }

def get_next_page(json):
  return json['_links'].get('next')

def get(endpoint):
  return requests.get(HOST + endpoint, auth=(USER, PASS))

def get_epoch_seconds(t):
  return int((t.replace(tzinfo=None) - datetime.datetime(1970, 1, 1)).total_seconds())

def remove_comments(text):
  return [string for string in text if not string.startswith('/*')]

if __name__ == '__main__':
  print do_parse()
