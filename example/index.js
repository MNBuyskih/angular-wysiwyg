var ExampleController = (function () {
    function ExampleController() {
        this.text = 'Lorem Impsum';
    }
    ExampleController.prototype.getHref = function ($deferred) {
        var message = prompt('href?', 'http://');
        message ? $deferred.resolve(message) : $deferred.reject();
        return $deferred.promise;
    };
    return ExampleController;
}());
angular
    .module('Example', ['Wysiwyg'])
    .controller('ExampleController', ExampleController);
//# sourceMappingURL=index.js.map