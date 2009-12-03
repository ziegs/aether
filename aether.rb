require 'rubygems'
require 'sinatra'
require 'haml'
require 'json'
require 'sass'
require 'compass'
require 'mysql'

queries = {}
queries['1'] = 'AllAirports'
queries['2'] = 'AllAirlines'
queries['3'] = 'AllRoutes'
#queries['4'] = 'AllAirlines'
queries['5'] = 'AirportsAirlineServices'
#queries['6'] = 'AllAirlines'
queries['7'] = 'RoutesAirlineServices'
#queries['8'] = 'AllAirlines'
queries['9a'] = 'AirlinesLeavingAirport'
queries['9b'] = 'AirlinesEnteringAirport'
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
  print queries[params['id']]
end