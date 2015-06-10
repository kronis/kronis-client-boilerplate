var mailFunction = function() {
    console.log('Mail page')
};

var indexFunction = function() {
    console.log('Index page')
};
var contactsFunction = function(hash, department, id) {
    /* Get some data... */
    if (this.isActiveRoute()) {
        // Do something
    }
};
var beforeFunction = function() {
    return true;
};
debugger;
var router = new Router();
router.addRoute('', indexFunction);
router.addRoute('mail', mailFunction);
router.addRoute(/^contacts\/((?:hr|dev))\/(\d+)/, contactsFunction);
router.setBeforeRoute(beforeFunction);
router.executeMultipleRoutes(true);
router.start();
