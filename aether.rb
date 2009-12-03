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
  '5' => 'AirportsAirlineServices',
  '7' => 'RoutesAirlineServices',
  '9a' => 'AirlinesLeavingAirport',
  '9b' => 'AirlinesEnteringAirport',
  '10' => 'DestinationsFromAirpot',
  '11' => 'AirportDistance',
  '12' => 'AirportTimeDifference',
  '16' => 'CostBetweenAirports',
  '19' => 'AirportAtMaxElevation',
  '20' => 'AirportAtMinElevation'
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
  # Build query
  query = queries[params[:id]]
  if query == nil
    return
  end
  
  # Call query, print results
  begin
    DB.query("CALL " + query)
    res = DB.use_result
    while row = res.fetch_row() do
      printf "%s, %s\n", row[0], row[1]
    end
    res.free
    DB.next_result
  rescue Mysql::Error => e  
    return
  end   
end