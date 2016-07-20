require 'json'
require 'net/http'
require 'uri'
require "factual_country_ids"

BASE_PATH = "hdfs://dev/apps/extract/poi"
INDEX_API = "http://localhost:3000"
URL_PREFIX = "http://stitch-dev.corp.factual.com/hdfs-redirect?hdfs_path="
DEFAULT_KEYWORDS = ["prod", "production", "build"]


def format_country(country)
  country_name = country.gsub(/scarecrow/i, '')
  # Add spacing
  country_name.gsub(/([a-z])([A-Z])/, '\1 \2')
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
      country = file_info[0]
      file_name = file_info[1]
      if is_prod_build(file_name)
        files << {
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

def make_desc(version, country)
  return "#{version} production build for #{country}"
end

def make_index(build)
  version = get_build_version(build[:build_name])
  hawaiian_name = get_build_hw_name(build[:build_name])
  keywords = [build[:country], version, hawaiian_name].reject(&:nil?)
  return {
    :id => build[:build_name],
    :url => get_build_url(build[:build_path]),
    :keywords => keywords + DEFAULT_KEYWORDS,
    :description => make_desc(version, build[:country])
  }
end

def index_builds(builds)
  builds.map do |build|
    index = make_index(build)
  end
end

def post_indexes(indexes)
  uri = URI.parse(INDEX_API + '/indexes')
  http = Net::HTTP.new(uri.host, uri.port)
  req = Net::HTTP::Post.new(uri.request_uri, 'Content-Type' => 'application/json')
  req.body = "{\"foo\":1}"
  req.body = JSON.generate(indexes)
  resp = http.request(req)
  puts resp
  puts resp.body
end

if __FILE__ == $0
  builds = list_files()
  indexes = index_builds(builds)
  post_indexes(indexes)
end
