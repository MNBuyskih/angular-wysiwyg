var ExampleController = (function () {
    function ExampleController() {
        this.text = 'Lorem Impsum';
    }
    ExampleController.prototype.getHref = function ($deferred) {
        var message = prompt('href?', 'http://');
        message ? $deferred.resolve(message) : $deferred.reject();
        return $deferred.promise;
    };
    ExampleController.prototype.onChange = function ($value, $model) {
        console.log('Value changed: "%s", "%s"', $value, $model.$viewValue);
    };
    ExampleController.prototype.onFocus = function () {
        console.log('focus');
    };
    ExampleController.prototype.onBlur = function () {
        console.log('blur');
    };
    return ExampleController;
}());
angular
    .module('Example', ['Wysiwyg'])
    .controller('ExampleController', ExampleController);
//# sourceMappingURL=index.js.map