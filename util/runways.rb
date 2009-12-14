#!/usr/bin/env ruby

require 'rubygems'
require 'mysql'
require 'csv'

airport_file = ARGV[0]
runway_file = ARGV[1]

airports = {}

CSV::Reader.parse(File.open(airport_file, 'rb')) do |row|
  airport = {:ident => row[1], :iata => row[13], :runways => 0}
  airports[row[0]] = airport
end

CSV::Reader.parse(File.open(runway_file, 'rb')) do |row|
  airport_id = row[1]
  airport = airports[airport_id]
  airport[:runways] += 1
end

airports.each_value do |airport|
  aname = airport[:iata]  || airport[:ident]
  if aname.length > 4 || aname.length < 3 then # throw out bad codes
    next
  else
    num = airport[:runways]
    num = num > 0 ? num : 1
    puts "UPDATE Airports SET NumRunways=#{num} WHERE (IATA = `#{aname}` OR ICAO = `#{aname}`);"
  end
end