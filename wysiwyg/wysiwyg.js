var Wysiwyg = (function () {
    function Wysiwyg($timeout) {
        this.$timeout = $timeout;
    }
    Wysiwyg.prototype.exec = function (commandName, value) {
        document.execCommand(commandName, false, value);
    };
    Wysiwyg.prototype.setElement = function ($element) {
        var _this = this;
        this.$element = $element;
        this.$element.addEventListener('input', function () {
            _this.model.$setViewValue(_this.$element.innerHTML);
            _this.onChange && _this.onChange({ $value: _this.model.$viewValue, $model: _this.model });
        });
        this.$element.addEventListener('focus', function () { return _this.onFocus && _this.onFocus(); });
        this.$element.addEventListener('blur', function () { return _this.onBlur && _this.onBlur(); });
        this.focus();
    };
    Wysiwyg.prototype.focus = function () {
        this.$element.focus();
    };
    Wysiwyg.prototype.$onInit = function () {
        var _this = this;
        this.$timeout(function () {
            _this.$element.innerHTML = _this.model.$viewValue;
        });
    };
    Wysiwyg.prototype.saveSelection = function () {
        if (window.getSelection) {
            var sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount)
                return sel.getRangeAt(0);
        }
        else if (document['selection'] && document['selection'].createRange) {
            return document['selection'].createRange();
        }
        return null;
    };
    Wysiwyg.prototype.restoreSelection = function (range) {
        if (range) {
            if (window.getSelection) {
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
            else if (document['selection'] && range['select']) {
                range['select']();
            }
        }
    };
    return Wysiwyg;
}());
var WysiwygInput = (function () {
    function WysiwygInput($element) {
        this.$element = $element;
    }
    WysiwygInput.prototype.$onInit = function () {
        this.wysiwyg.setElement(this.$element.find('div')[0]);
    };
    return WysiwygInput;
}());
angular
    .module('Wysiwyg', [])
    .component('wysiwyg', {
    controller: Wysiwyg,
    controllerAs: 'vm',
    transclude: true,
    require: { model: '^ngModel' },
    bindings: {
        onChange: '&',
        onFocus: '&',
        onBlur: '&',
    },
    template: "<div ng-transclude class=\"wysiwyg\"></div>"
})
    .component('wysiwygInput', {
    controller: WysiwygInput,
    controllerAs: 'vm',
    require: { wysiwyg: '^wysiwyg' },
    template: "<div contenteditable=\"true\" class=\"wysiwyg-input\"></div>"
})
    .directive('wysiwygBtn', function ($q) {
    return {
        restrict: 'A',
        scope: { command: '@wysiwygBtn', prompt: '&?' },
        require: '^wysiwyg',
        link: function ($scope, $element, $attributes, $wysiwyg) {
            $element.on('click', function (e) {
                e.preventDefault();
                if ($scope.prompt) {
                    var selRange_1 = $wysiwyg.saveSelection();
                    $scope.prompt({ $deferred: $q.defer() }).then(function (value) {
                        $wysiwyg.restoreSelection(selRange_1);
                        $wysiwyg.exec($scope.command, value);
                    });
                }
                else {
                    $wysiwyg.focus();
                    $wysiwyg.exec($scope.command);
                }
            });
        }
    };
});
//# sourceMappingURL=wysiwyg.js.map