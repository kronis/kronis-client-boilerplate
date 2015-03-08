var React = require('react');
var Router = require('react-router');
var Page1 = require('./page1.jsx');
var Page2 = require('./page2.jsx');
var Dashboard = require('./dashboard.jsx');
var NotFound = require('./notFound.jsx');

var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var App = React.createClass({
  mixins: [ Router.State ],
  render: function () {
    var isActive = function(name) {
      return this.isActive(name) ? 'active' : '';
    }.bind(this);

    return (
      <div>
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="#">Kronis boilerplate</a>
            </div>
            <div id="navbar" className="collapse navbar-collapse">
              <ul className="nav navbar-nav">
                <li className={isActive('app')}><Link to="app">Dashboard</Link></li>
                <li className={isActive('page1')}><Link to="page1">Page 1</Link></li>
                <li className={isActive('page2')}><Link to="page2">Page 2</Link></li>
              </ul>
            </div>
          </div>
        </nav>
        <RouteHandler/>
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="page1" handler={Page1} />
    <Route name="page2" handler={Page2} />
    <DefaultRoute handler={Dashboard} />
    <NotFoundRoute handler={NotFound} />
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('main-container'));
});
