require 'rubygems'
require 'sinatra'
require 'haml'
require 'json'
require 'sass'
require 'compass'
require 'mysql'

DB = Mysql::new("localhost", "parker", "det.ps", "aether", 3306, nil, Mysql::CLIENT_MULTI_RESULTS)
DB.query_with_result=false

queries = {}
queries['1'] = ['AllAirports',0]
queries['2'] = ['AllAirlines',0]
queries['3'] = ['AllRoutes',0]
#queries['4'] = 'AllAirlines'
queries['5'] = ['AirportsAirlineServices',1]
#queries['6'] = 'AllAirlines'
queries['7'] = ['RoutesAirlineServices',1]
#queries['8'] = 'AllAirlines'
queries['9a'] = ['AirlinesLeavingAirport',1]
queries['9b'] = ['AirlinesEnteringAirport',1]
queries['10'] = 'DestinationsFromAirport'
queries['11'] = 'AirportDistance'
queries['12'] = 'AirportTimeDifference'
#queries['13'] = 'AllAirlines'
#queries['14'] = 'AllAirlines'
#queries['15'] = 'AllAirlines'
queries['16'] = 'CostBetweenAirports'
#queries['17'] = 'AllAirlines'
#queries['18'] = 'AllAirlines'
queries['19'] = 'AirportAtMaxElevation'
queries['20'] = 'AirportAtMinElevation'

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