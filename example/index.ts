import IDeferred = angular.IDeferred;
class ExampleController {
    text: string = 'Lorem Impsum';

    getHref($deferred: IDeferred<string>): IPromise<string> {
        let message = prompt('href?', 'http://');
        message ? $deferred.resolve(message) : $deferred.reject();

        return $deferred.promise;
    }
}
angular
    .module('Example', ['Wysiwyg'])
    .controller('ExampleController', ExampleController);
