require 'date'
require 'json'
require 'net/http'
require 'uri'
require "factual_country_ids"

BASE_PATH = "hdfs://dev/apps/extract/poi"
INDEX_API = "http://localhost:3000"
URL_PREFIX = "http://stitch-dev.corp.factual.com/hdfs-redirect?hdfs_path="
DEFAULT_KEYWORDS = ["prod", "production", "build"]
CRAWLER_ID = "hdfs_build"


def format_country(country)
  country_name = country.gsub(/scarecrow/i, '')
  # Add spacing
  country_name.gsub(/([a-z])([A-Z])/, '\1 \2')
end

def extract_timestamp(ls_line)
  pieces = ls_line.split(/\s/)
  date = pieces[-3]
  time = pieces[-2]
  d = DateTime.strptime("#{date} #{time}", "%Y-%m-%d %H:%M")
  return d.to_time.to_i
end

def extract_file_path(ls_line)
  pieces = ls_line.split(/\s/)
  build_path = pieces[-1]
  return build_path
end

def extract_build_name(build_path)
  match = /([^\/]+)\/output\/(.*)/.match(build_path)
  if !match.nil?
    country = format_country(match[1])
    return [country, match[2]]
  end
end

def is_prod_build(build_name)
  pattern = /^\d+_.*_batchsummary_.*-\d+\.\d+$/
  return !pattern.match(build_name).nil?
end

def list_files()
  output = `hadoop fs -ls /apps/extract/poi/*/output`
  files = []
  output.split("\n").each do |line|
    file_path = extract_file_path(line)
    file_info = extract_build_name(file_path)
    if !file_info.nil?
      timestamp = extract_timestamp(line)
      country = file_info[0]
      file_name = file_info[1]
      if is_prod_build(file_name)
        files << {
          :timestamp => timestamp,
          :country => country,
          :build_name => file_name,
          :build_path => file_path
        }
      end
    end
  end
  return files
end

def get_build_url(build_path)
  url = URL_PREFIX + build_path
end

def get_build_version(build_name)
  match = /(\d+.\d+$)/.match(build_name)
  if match
    return match[1]
  end
end

def get_build_hw_name(build_name)
  match = /-([^aeiou][aeiou][^aeiou][aeiou][^aeiou][aeiou])-/.match(build_name)
  if match
    return match[1]
  end
end

def make_keywords(country, version, hawaiian_name)
  begin
    dataset = Factual_Country_Ids.get_dataset(country)
    view_stable = Factual_Country_Ids.get_view_stable(country)
    view_edge = Factual_Country_Ids.get_view_edge(country)
    cc = Factual_Country_Ids.get_code(country)
  rescue
  end
  return [country, version, hawaiian_name, dataset, view_stable, view_edge, cc].reject(&:nil?)
end

def make_desc(version, country)
  return "#{country} #{version} production build"
end

def make_index(build)
  version = get_build_version(build[:build_name])
  hawaiian_name = get_build_hw_name(build[:build_name])
  keywords = make_keywords(build[:country], version, hawaiian_name)
  return {
    :id => build[:build_name],
    :url => get_build_url(build[:build_path]),
    :keywords => keywords + DEFAULT_KEYWORDS,
    :description => make_desc(version, build[:country]),
    :timestamp => build[:timestamp],
    :source => CRAWLER_ID
  }
end

def index_builds(builds)
  builds.map do |build|
    index = make_index(build)
  end
end

def clean_indexes()
  uri = URI.parse(INDEX_API + '/indexes/source/' + CRAWLER_ID)
  http = Net::HTTP.new(uri.host, uri.port)
  req = Net::HTTP::Delete.new(uri.request_uri)
  resp = http.request(req)
  puts resp.body
end

def post_indexes(indexes)
  uri = URI.parse(INDEX_API + '/indexes')
  http = Net::HTTP.new(uri.host, uri.port)
  req = Net::HTTP::Post.new(uri.request_uri, 'Content-Type' => 'application/json')
  req.body = "{\"foo\":1}"
  req.body = JSON.generate(indexes)
  resp = http.request(req)
  puts resp
  puts "Status #{resp.code}"
  puts resp.body
end

if __FILE__ == $0
  builds = list_files()
  indexes = index_builds(builds)
  clean_indexes()
  post_indexes(indexes)
end
