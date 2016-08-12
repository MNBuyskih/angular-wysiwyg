var ExampleController = (function () {
    function ExampleController($timeout) {
        this.$timeout = $timeout;
        this.text = 'Lorem Impsum';
        this.showHref = false;
    }
    ExampleController.prototype.getHref = function ($deferred) {
        var _this = this;
        if (this.showHref)
            return $deferred.promise;
        this.$timeout(function () { return _this.showHref = true; });
        this.$defer = $deferred;
        return $deferred.promise;
    };
    ExampleController.prototype.submitHref = function () {
        if (this.$defer)
            this.$defer.resolve(this.href);
        this.showHref = false;
        this.href = '';
    };
    ExampleController.prototype.cancelHref = function () {
        if (this.$defer)
            this.$defer.reject();
        this.showHref = false;
        this.href = '';
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