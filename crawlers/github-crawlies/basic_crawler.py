import base64
import requests
import time 


API_ENDPOINT = 'https://api.github.com/orgs/factual/repos'
TOKEN = open('.token.txt', 'r').read()

def parse_repos():
  next_page_url = API_ENDPOINT
  while next_page_url is not None:
    results = get_response(next_page_url)
    next_page_url = get_next_page_url(results)
    for result in results.json():
      yield get_search_obj(result)

def get_search_obj(json):
  return {
    'id': 'factualgithub:' + json['name']
    'url': json['html_url'],
    'keywords': json['name'].split('-'),
    'title': json['full_name'],
    'description': json['description'],
    'corpus': get_readme(json['url']),
    'manual_tags': [],
    'timestamp': int(time.time())
  }

def get_readme(repo_api_url):
  readme_api_url = repo_api_url + '/readme'
  readme_response = get_response(readme_api_url)
  readme_results = readme_response.json()
  if readme_results.get('encoding', '') == 'base64':
    return base64.b64decode(readme_results.get('content', ''))
  else:
    return ''

def get_response(url):
  return requests.get(url, auth=('', TOKEN))

def get_next_page_url(result):
  header_links = map(parse_header_link, result.headers['Link'].split(', '))
  for link, relation in header_links:
    if relation == 'next':
      return link
  return None

def parse_header_link(header_link):
  link, relation = header_link.split('; ')
  return link.strip('<>'), relation[4:].strip('"')

