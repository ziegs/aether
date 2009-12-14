#!/usr/bin/env ruby

require 'rubygems'
require 'mysql'

database = ARGV[0]
user = ARGV[1]
pass = ARGV[2]
dbase = ARGV[3]

db = Mysql.new database, user, pass, dbase, 3306, nil, Mysql::CLIENT_MULTI_RESULTS

puts "Connected to database."

airlines = Hash.new
airports = Hash.new
routes = Array.new

puts "Importing airlines..."
res = db.query("SELECT * FROM Airlines")
res.each_hash do |row|
  airlines[row['IATA']] = row
  airlines[row['ICAO']] = row
end
res.free

puts "..done.\nImporting airports..."
res = db.query("SELECT * FROM Airports")
res.each_hash do |row|
  airports[row['IATA']] = row
  airports[row['ICAO']] = row
end
res.free

puts "..done.\nImporting routes..."
res = db.query("SELECT * FROM Routes")
res.each_hash do |row|
  routes.push(row)
end
res.free
puts "..done.\nFinding missing data..."
routes.each do |route|
  if route["AirlineID"] == nil then
    acode = route["Airline"]
    airline = airlines[acode]
    if airline == nil then
      puts "Found route with non-extant airline #{acode}"
    else
      route["AirlineID"] = airline["ID"]
    end
    puts "Found route missing airline #{acode}"
  end
  if route["SourceID"] == nil then
    scode = route["Source"]
    source = airports[scode]
    if source == nil then
      puts "Found route with non-extant source #{scode}"
    else
      route["SourceID"] = source["ID"]
    end
    puts "Found route missing airport source #{scode}"
  end
  if route["DestID"] == nil then
    dcode = route["Dest"]
    dest = airports[dcode]
    if dest == nil then
      puts "Found route with non-extant dest #{dcode}"
    else
      route["DestID"] = dest["ID"]
    end
    puts "Found route missing airport dest #{dcode}"
  end
end