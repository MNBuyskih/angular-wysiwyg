import INgModelController = angular.INgModelController;
import ITimeoutService = angular.ITimeoutService;
import IQService = angular.IQService;
import IPromise = angular.IPromise;
import IScope = angular.IScope;

class Wysiwyg {
    model: INgModelController;
    private $element: HTMLElement;

    constructor(private $timeout: ITimeoutService) {
    }

    exec(commandName: string, value?: string) {
        document.execCommand(commandName, false, value);
    }

    setElement($element: HTMLElement) {
        this.$element = $element;
    }

    $onInit() {
        this.$timeout(() => {
            this.$element.innerHTML = this.model.$viewValue
        });
    }
}

class WysiwygInput {
    wysiwyg: Wysiwyg;

    constructor(private $element: JQuery) {

    }

    $onInit() {
        this.wysiwyg.setElement(this.$element.find('div')[0]);
    }
}

class WysiwygBtn {
    wysiwyg: Wysiwyg;
    protected command: string;
    protected prompt: (args: {$deferred: IDeferred<string>}) => IPromise<string>;

    constructor(public $q: IQService) {
    }

    exec() {
        if (this.prompt) {
            this.prompt({$deferred: this.$q.defer()}).then((value) => this.wysiwyg.exec(this.command, value));
        } else {
            this.wysiwyg.exec(this.command);
        }
    }
}

interface WysiwygBtnScope extends IScope {
    command: string;
    prompt: ($deferred: IDeferred<string>)=>IPromise<string>;
}

angular
    .module('Wysiwyg', [])
    .component('wysiwyg', {
        controller: Wysiwyg,
        controllerAs: 'vm',
        transclude: true,
        require: {model: '^ngModel'},
        template: `<div ng-transclude class="wysiwyg"></div>`
    })
    .component('wysiwygInput', {
        controller: WysiwygInput,
        controllerAs: 'vm',
        require: {wysiwyg: '^wysiwyg'},
        template: `<div contenteditable="true" class="wysiwyg-input"></div>`
    })
    .directive('wysiwygBtn', function ($q: IQService) {
        return {
            restrict: 'A',
            scope: {command: '@wysiwygBtn', prompt: '&?'},
            require: '^wysiwyg',
            link($scope, $element, $attributes, $wysiwyg: Wysiwyg){
                $element.on('click', (e) => {
                    e.preventDefault();

                    if ($scope.prompt) {
                        $scope.prompt({$deferred: $q.defer()}).then((value) => $wysiwyg.exec($scope.command, value));
                    } else {
                        $wysiwyg.exec($scope.command);
                    }
                });
            }
        };
    })
;