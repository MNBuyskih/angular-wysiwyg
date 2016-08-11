#Usage

Include in your app

```javascript
    angular
        .module('MyModule', ['Wysiwyg'])
        .controller('MyController', function($scope){
            $scope.getHref = function ($deferred) {
                var message = prompt('href?', 'http://');
                message ? $deferred.resolve(message) : $deferred.reject();
                return $deferred.promise;
            };            
        });
```

and markup your html

```html
    <wysiwyg ng-model="vm.text">
        <wysiwyg-input></wysiwyg-input>
        <hr>
        <button wysiwyg-btn="bold"><strong>B</strong></button>
        <button wysiwyg-btn="italic"><i>I</i></button>
        <button wysiwyg-btn="underline"><U>U</U></button>
        <button wysiwyg-btn="createLink" prompt="getHref($deferred)">A</button>
        <button wysiwyg-btn="insertOrderedList">UL</button>
        <button wysiwyg-btn="insertUnorderedList">OL</button>
        <button wysiwyg-btn="removeFormat">Fx</button>
    </wysiwyg>
```

Use prompt attribute for commands requires values.

Enjoy!

[Full list of available commands](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand) 