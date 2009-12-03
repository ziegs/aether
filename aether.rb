require 'rubygems'
require 'sinatra'
require 'haml'
require 'json'
require 'sass'
require 'compass'
require 'mysql'

queries = {}
queries['1'] = 'shelton'
queries['2'] = 'zeigelbaum'

configure do
  Compass.configuration.parse(File.join(Sinatra::Application.root, 'config', 'compass.config'))

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
  print params['id']
end