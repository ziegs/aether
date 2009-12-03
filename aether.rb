require 'rubygems'
require 'sinatra'
require 'haml'
require 'json'
require 'sass'
require 'compass'
require 'mysql'

# If you update the queries hash, make sure you update the object in aether.js!
queries0 = {
  '1' => 'AllAirports',
  '2' => 'AllAirlines',
  '3' => 'AllRoutes',
  '19' => 'AirportAtMaxElevation',
  '20' => 'AirportAtMinElevation'
}

queries1 = {
  '5' => 'AirportsAirlineServices',
  '7' => 'RoutesAirlineServices',
  '9a' => 'AirlinesLeavingAirport',
  '9b' => 'AirlinesEnteringAirport',
  '10' => 'DestinationsFromAirport',
}

queries2 = {
  '11' => 'AirportDistance',
  '12' => 'AirportTimeDifference',
  '16' => 'CostBetweenAirports',  
}

DB = Mysql::new("einstein.cs.jhu.edu", "mziegel", "xe0QuiuX", "aether_dev", 3306, nil, Mysql::CLIENT_MULTI_RESULTS)
DB.query_with_result=false

configure do
  Compass.configuration.parse(File.join(Sinatra::Application.root, 'config', 'compass.config'))
  
  set :public, File.join(Sinatra::Application.root, 'static')
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

get '/ar' do
  content_type 'text/json'
  json_result = [];
  
  num_params = params.size()-1
  
  # Choose query
  if num_params == 0
    query = queries0[params[:id]]
  elsif num_params == 1
    query = queries1[params[:id]]
  elsif num_params == 2
    query = queries2[params[:id]]
  end
  
  if query == nil
    return json_result.to_json()
  end
    
  # Call query, return all result tables in JSON form
  begin
    # Build query
    query = "CALL " + query + "(";
    if num_params >= 1
      query = query + "\"" + params[:p1] + "\""
    end
    if num_params >= 2
      query = query + ",\"" + params[:p2] + "\""
    end
    query = query + ");"
    print query
      
    DB.query(query)
    while DB.more_results?()
      rs = DB.use_result()
      rh = Array.new()
      while row = rs.fetch_hash() do
        rh.push(row)
      end
      json_result.push(rh)
      rs.free()
      DB.next_result()
    end
  rescue Mysql::Error => e  
    return
  end   
  
  return json_result.to_json();
end