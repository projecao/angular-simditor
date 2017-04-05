
import * as angular from 'angular'

var modSimditor = angular.module('angular-simditor', [])

var TOOLBAR_DEFAULT = [
    'title', 'bold', 'italic', 'underline', 
    'strikethrough', '|', 'ol', 'ul', 'blockquote', 
    'code', 'table', '|', 'link', 'image', 'hr', 
    '|', 'indent', 'outdent'
];

modSimditor.component('ngSimditor', {
    require: { model: "?^ngModel" },
    bindings: {
        ngPaste: '&?'
    },
    controller: ['$scope', '$element', function($scope, $element)
    {
        var $ctrl = this
        var $el = $element

        $el.append('<div></div>')

        var toolbar = $scope.$eval($el.toolbar) || TOOLBAR_DEFAULT;
        
        $ctrl.simditor = null

        function createEditor ()
        {
            $ctrl.simditor  = new Simditor({
                textarea: $el.children()[0],
                placeholder: $el.placeholder || '',
                toolbar: toolbar,
                pasteImage: false,
                defaultImage: $el.defaultImage || '',
                upload: location.search === '?upload' ? {
                    url: '/upload'
                } : false
            });

            on('valuechanged', function(e, src){
                $ctrl.model.$setViewValue(e.target.getValue())
            })

            on('pasting', function(e, $pasteContent){
                if($pasteContent.find('img') > 0) return
            })
        }

        function on(event, fn) 
        {
            $ctrl.simditor.on(event, fn)
        }

        $ctrl.$onInit = function()
        {
            createEditor()

            $ctrl.model.$render = function(e){
                $ctrl.simditor.setValue(
                    $ctrl.model.$viewValue
                )
            }
        }

        $ctrl.onDestroy = function()
        {
            $ctrl.simditor.destroy()
        }
    }]
})
    
