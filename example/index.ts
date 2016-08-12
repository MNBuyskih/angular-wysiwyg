import IDeferred = angular.IDeferred;
class ExampleController {
    text: string = 'Lorem Impsum';
    href: string;
    showHref: boolean = false;
    $defer: IDeferred<string>;

    constructor(protected $timeout: ITimeoutService) {
    }

    getHref($deferred: IDeferred<string>): IPromise<string> {
        if (this.showHref) return $deferred.promise;
        this.$timeout(() => this.showHref = true);
        this.$defer = $deferred;
        return $deferred.promise;
    }

    submitHref() {
        if (this.$defer) this.$defer.resolve(this.href);
        this.showHref = false;
        this.href = '';
    }

    cancelHref() {
        if (this.$defer) this.$defer.reject();
        this.showHref = false;
        this.href = '';
    }

    onChange($value: string, $model: INgModelController) {
        console.log('Value changed: "%s", "%s"', $value, $model.$viewValue);
    }

    onFocus() {
        console.log('focus');
    }

    onBlur() {
        console.log('blur');
    }
}
angular
    .module('Example', ['Wysiwyg'])
    .controller('ExampleController', ExampleController);
