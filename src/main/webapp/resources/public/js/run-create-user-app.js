///////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Defines the javascript files that need to be loaded and their dependencies.
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////

require.config({
    paths: {
        angular: '../../bower_components/angular/angular.min',
        angularMessages: '../../bower_components/angular-messages/angular-messages.min',
        csrfInterceptor: '../../bower_components/spring-security-csrf-token-interceptor/dist/spring-security-csrf-token-interceptor.min',
        lodash: "../../bower_components/lodash/dist/lodash.min",
        editableTableWidgets: 'editable-table-widgets',
        common: 'common',
        createUserApp: 'new-user'
    },
	waitSeconds: 0,	
    shim: {
        angular: {
            exports: "angular"
        },
        csrfInterceptor: {
            deps: ['angular']
        },
        angularMessages: {
            deps: ['angular']
        },
        editableTableWidgets: {
            deps: ['angular', 'lodash']
        },
        common: {
          deps: ['angular', 'csrfInterceptor', 'angularMessages','editableTableWidgets']
        },
        createUserApp: {
            deps: [ 'common']
        }
    }
});

require(['createUserApp'], function () {

    angular.bootstrap(document.getElementById('createUserApp'), ['newUserApp']);

});