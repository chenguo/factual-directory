require 'date'
require 'json'
require 'net/http'
require 'openssl'

BASE_URL = "https://wiki.corp.factual.com/rest/api"
LIMIT = 5

def get_data(url, user, pw)
  uri = URI.parse(url)
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true
  http.verify_mode = OpenSSL::SSL::VERIFY_NONE
  req = Net::HTTP::Get.new(uri.request_uri)
  req.basic_auth(user, pw)
  resp = http.request(req)
  puts JSON.parse(resp.body)
end

def crawl(url)
  get_data(url)


end

def get_pw(user)
  puts "LDAP password for #{user}:"
  pw = STDIN.noecho(&:gets)
  return pw
end


if __FILE__ == $0
  puts ARGV.length
  if ARGV.length != 1
    warn "No username provided"
    exit 1
  end
  user = ARGV[0]
  pw = get_pw(user)
  warn user
  warn pw
  start_url = BASE_URL + "/content?limit=#{LIMIT}"
  #crawl(start_url, user, pw)

end
