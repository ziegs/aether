#!/usr/bin/env ruby

require 'rubygems'
require 'mysql'

database = ARGV[0]
user = ARGV[1]
pass = ARGV[2]
dbase = ARGV[3]

db = Mysql.new database, user, pass, dbase, 3306, nil, Mysql::CLIENT_MULTI_RESULTS

airlines = Hash.new
airports = Hash.new
routes = Array.new

res = db.query("SELECT * FROM Airlines")
res.each_hash do |row|
  airlines[row['IATA']] = row
  airlines[row['ICAO']] = row
end
res.free

res = db.query("SELECT * FROM Airports")
res.each_hash do |row|
  airports[row['IATA']] = row
  airports[row['ICAO']] = row
end
res.free

res = db.query("SELECT * FROM Routes")
res.each_hash do |row|
  routes.push(row)
end
res.free

routes.each do |route|
  if route["AirlineID"] == nil then
    acode = routes["Airline"]
    airline = airlines[acode]
    route["AirlineID"] = airlines["ID"]
    puts "Found route missing airline #{acode}"
  end
end