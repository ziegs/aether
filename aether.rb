#!/usr/bin/env ruby

require 'rubygems'
require 'sinatra'
require 'haml'
require 'json'
require 'sass'
require 'compass'
require 'mysql'

# If you update the queries hash, make sure you update the object in aether.js!
queries = {
  '1' => 'AllAirports',
  '2' => 'AllAirlines',
  '3' => 'AllRoutes',
  '4' => 'AirlinesBetweenCities',
  '5' => 'AirportsAirlineServices',
  '7' => 'RoutesAirlineServices',
  '8' => 'ShortestFlight',
  '9a' => 'AirlinesLeavingAirport',
  '9b' => 'AirlinesEnteringAirport',
  '10' => 'DestinationsFromAirport',
  '11' => 'AirportDistance',
  '12' => 'AirportTimeDifference',
  '16' => 'CostBetweenAirports',  
  '18' => 'CheapestFlight',
  '19' => 'AirportAtMaxElevation',
  '20' => 'AirportAtMinElevation',
  '21' => 'AllAirportsInCountry'
}

num_params = {
  'AllAirports' => 0,
  'AllAirlines' => 0,
  'AllRoutes' => 0,
  'AirlinesBetweenCities' => 2,
  'AirportAtMaxElevation' => 0,
  'AirportAtMinElevation' => 0,
  'AirportsAirlineServices' => 1,
  'RoutesAirlineServices' => 1,
  'AirlinesLeavingAirport' => 1,
  'AirlinesEnteringAirport' => 1,
  'DestinationsFromAirport' => 1,
  'AirportDistance' => 2,
  'AirportTimeDifference' => 2,
  'CostBetweenAirports' => 2,
  'AllAirportsInCountry' => 1,
  'ShortestFlight' => 2,
  'CheapestFlight' => 2
}

DB = Mysql.new "einstein.cs.jhu.edu", "mziegel", "xe0QuiuX", "aether_dev", 3306, nil, Mysql::CLIENT_MULTI_RESULTS
DB.query_with_result=false

configure do
  Compass.configuration.parse(File.join(Sinatra::Application.root, 'config', 'compass.config'))
  
  set :public, File.join(Sinatra::Application.root, 'public')
  set :haml, { :format => :html5 }
  set :sass, Compass.sass_engine_options
end

get '/stylesheets/:name.css' do
  content_type 'text/css', :charset => 'utf-8'
  sass(:"stylesheets/#{params[:name]}", Compass.sass_engine_options )
end

get '/' do
  haml :index
end

# General query action request
get '/ar' do
  content_type 'text/json'
  json_result = Hash.new
  
  hash_names = {
    1 => 'headers',
    2 => 'records',
    3 => 'map_points',
    4 => 'map_routes'
  }

  query = queries[params[:id]]  
  param_length = num_params[query]
  if query == nil
    return json_result.to_json
  end
  
  sql_params = Array.new
  1.upto(param_length) { |i| sql_params.push(params[("p#{i}").to_sym]) }
  
  # Call query, return all result tables in JSON form
  # Return headers:{header1 ... headern} records:{SELECT *} map_points: {aiport_id, lat, long} map_routes:{lat, long, lat, long}
  begin
    # Build query
    query = "CALL " + query + "("
    query += sql_params.join ', '
    query += ")"
    print query
    
    table_num = 1;
    DB.query(query)
    while DB.more_results?
      rs = DB.use_result
      rh = Array.new
      table_num = table_num + 1
      while row = rs.fetch_hash do
        rh.push(row)
      end
      rs.free
      DB.next_result
      json_result[hash_names[table_num]] = rh
    end
    
    while table_num < 4
      table_num = table_num + 1
      json_result[hash_names[table_num]] = Array.new
    end
  rescue Mysql::Error => e  
    return {}.to_json
  end
  json_result.to_json
end

# Airline or Airport request
get '/ir' do
  content_type 'text/json'
  table = ""
  case params[:qid]
  when 'airport'
    table = "Airports"
  when 'airline'
    table = "Airlines"
  else
    return {}.to_json
  end
  id = params[:aid]
  begin
    DB.query("SELECT * FROM #{table} WHERE #{table}.ID = #{id} LIMIT 1")
    result = DB.use_result
    ret = result.fetch_hash()
    result.free
    if ret == nil 
      return {}.to_json
    end
    return ret.to_json
  rescue Mysql::Error => e
    return {}.to_json
  end
end

# Route requests
get '/rr' do
  content_type = 'text/json'
  airline_id = params[:aid]
  source_id = params[:src]
  dest_id = params[:dst]
  begin
    DB.query("SELECT * FROM Routes WHERE Routes.AirlineID = #{airline_id}" + 
      " AND Routes.SourceID = #{source_id} AND Routes.DestID = #{dest_id}")
    result = DB.use_result
    ret = result.fetch_hash()
    result.free
    if ret == nil 
      return {}.to_json
    end
    return ret.to_json
  rescue Mysql::Error => e
    return {}.to_json
  end
end
