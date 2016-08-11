import IDeferred = angular.IDeferred;
class ExampleController {
    text: string = 'Lorem Impsum';

    getHref($deferred: IDeferred<string>): IPromise<string> {
        let message = prompt('href?', 'http://');
        message ? $deferred.resolve(message) : $deferred.reject();

        return $deferred.promise;
    }

    onChange($value: string, $model: INgModelController) {
        console.log('Value changed: "%s", "%s"', $value, $model.$viewValue);
    }
}
angular
    .module('Example', ['Wysiwyg'])
    .controller('ExampleController', ExampleController);
