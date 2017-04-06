
import * as angular from 'angular'

var modSimditor = angular.module('angular-simditor', [])

var TOOLBAR_DEFAULT = [
    'title', 'bold', 'italic', 'underline', 
    'strikethrough', '|', 'ol', 'ul', 'blockquote', 
    'code', 'table', '|', 'link', 'image', 'hr', 
    '|', 'indent', 'outdent'
];

var defaultConfig = {
    toolbar: TOOLBAR_DEFAULT,
    locale: 'en-US',
    textarea: null,
    placeholder: '',
    defaultImage: 'images/image.png',
    params: {},
    upload: false,
    tabIndent: true,
    toolbar: true,
    toolbarFloat: true,
    toolbarFloatOffset: 0,
    toolbarHidden: false,
    pasteImage: false,
    cleanPaste: false
}

modSimditor

.component('ngSimditor', {
    require: { model: "?^ngModel" },
    bindings: {
        ngPaste: '&?'
    },
    controller: ['$scope', '$element', 'ngSimditor', function($scope, $element, ngSimditor)
    {
        var $ctrl = this
        var $el = $element

        $el.append('<div></div>')

        var toolbar = $scope.$eval($el.toolbar) || ngSimditor.config.toolbar;
        
        $ctrl.simditor = null

        function createEditor ()
        {
            Simditor.locale = ngSimditor.config.locale
            
            $ctrl.simditor  = new Simditor({
                textarea: $el.children()[0],
                placeholder: $el.placeholder || ngSimditor.config.placeholder,
                toolbar: toolbar,
                pasteImage: ngSimditor.config.pasteImage || false,
                defaultImage: $el.defaultImage || ngSimditor.config.pasteImage,
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

.provider('ngSimditor', function () {

    this.defaultConfig = defaultConfig;

    this.configure = function (config) {
        this.defaultConfig = angular.extend(this.defaultConfig, config)

        return this
    }

    this.setToolbar = function (toolbar) {
        this.defaultConfig.toolbar = toolbar

        return this
    }

    this.setLocale = function (lang) {
        this.defaultConfig.locale = lang

        return this
    }

    this.$get = function()
    {
        class ngSimditor {
            constructor (config) {
                this.config = config
            }

            configure(config){
                this.config = config
            }

            setToolbar(toolbar){
                this.config.toolbar = toolbar || []
            }
        }

        return new ngSimditor( this.defaultConfig )
    }

})
    
