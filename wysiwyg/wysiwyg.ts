import INgModelController = angular.INgModelController;
import ITimeoutService = angular.ITimeoutService;
import IQService = angular.IQService;
import IPromise = angular.IPromise;
import IScope = angular.IScope;

class Wysiwyg {
    model: INgModelController;
    onChange: (args: {$value: string, $model: INgModelController}) => void;
    onFocus: () => void;
    onBlur: () => void;
    private $element: HTMLElement;

    constructor(private $timeout: ITimeoutService) {
    }

    exec(commandName: string, value?: string) {
        document.execCommand(commandName, false, value);
    }

    setElement($element: HTMLElement) {
        this.$element = $element;
        this.$element.addEventListener('input', () => {
            this.model.$setViewValue(this.$element.innerHTML);
            this.onChange && this.onChange({$value: this.model.$viewValue, $model: this.model});
        });
        this.$element.addEventListener('focus', () => this.onFocus && this.onFocus());
        this.$element.addEventListener('blur', () => this.onBlur && this.onBlur());

        this.focus();
    }

    focus() {
        this.$element.focus();
    }

    $onInit() {
        this.$timeout(() => {
            this.$element.innerHTML = this.model.$viewValue
        });
    }

    saveSelection(): Range {
        if (window.getSelection) {
            let sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) return sel.getRangeAt(0);
        } else if (document['selection'] && document['selection'].createRange) {
            return document['selection'].createRange();
        }

        return null;
    }

    restoreSelection(range: Range) {
        if (range) {
            if (window.getSelection) {
                let sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (document['selection'] && range['select']) {
                range['select']();
            }
        }
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

angular
    .module('Wysiwyg', [])
    .component('wysiwyg', {
        controller: Wysiwyg,
        controllerAs: 'vm',
        transclude: true,
        require: {model: '^ngModel'},
        bindings: {
            onChange: '&',
            onFocus: '&',
            onBlur: '&',
        },
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
                        let selRange = $wysiwyg.saveSelection();
                        $scope.prompt({$deferred: $q.defer()}).then((value) => {
                            $wysiwyg.restoreSelection(selRange);
                            $wysiwyg.exec($scope.command, value);
                        });
                    } else {
                        $wysiwyg.focus();
                        $wysiwyg.exec($scope.command);
                    }
                });
            }
        };
    })
;