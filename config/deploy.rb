set :application, "aether"
set :repository,  "git://github.com/ziegs/aether.git"
set :deploy_to, "/var/aether"

set :scm, :git
set :deploy_via, :remote_cache
set :use_sudo, false
# Or: `accurev`, `bzr`, `cvs`, `darcs`, `git`, `mercurial`, `perforce`, `subversion` or `none`

role :web, "aether.acm.jhu.edu"                          # Your HTTP server, Apache/etc
role :app, "aether.acm.jhu.edu"                          # This may be the same as your `Web` server
#role :db, "einstein.cs.jhu.edu", :primary => true

# If you are using Passenger mod_rails uncomment this:
# if you're still using the script/reapear helper you will need
# these http://github.com/rails/irs_process_scripts

namespace :deploy do
  [:start, :stop].each do |t|
      desc "#{t} task is a no-op with mod_rails"
      task t, :roles => :app do ; end
  end
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
  end
end