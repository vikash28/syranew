/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
  "ui.router",
  "ui.bootstrap",
  "oc.lazyLoad",
  "ngSanitize",
  "ngMessages",
  "frontendServices",
  "spring-security-csrf-token-interceptor"
]).filter('excludeDeleted', function() {
  return function(input) {
    return _.filter(input, function(item) {
      return item.deleted == undefined || !item.deleted;
    });
  }
});

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
  $ocLazyLoadProvider.config({
    cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
  });
}]);

/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/
/**
`$controller` will no longer look for controllers on `window`.
The old behavior of looking on `window` for controllers was originally intended
for use in examples, demos, and toy apps. We found that allowing global controller
functions encouraged poor practices, so we resolved to disable this behavior by
default.

To migrate, register your controllers with modules rather than exposing them
as globals:

Before:

```javascript
function MyController() {
  // ...
}
```

After:

```javascript
angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

Although it's not recommended, you can re-enable the old behavior like this:

```javascript
angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
**/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
  // supported languages
  var settings = {
    layout: {
      pageSidebarClosed: false, // sidebar state
      pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
    },
    layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
    layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
  };

  $rootScope.settings = settings;

  return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
  $scope.$on('$viewContentLoaded', function() {
    Metronic.initComponents(); // init core components
    //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
  });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', 'UserService', '$timeout', function($scope, UserService, $timeout) {
  $scope.$on('$includeContentLoaded', function() {
    Layout.initHeader(); // init header
  });

  $scope.vm = {
    maxCaloriesPerDay: 2000,
    currentPage: 1,
    totalPages: 0,
    originalConnections: [],
    connections: [],
    isSelectionEmpty: true,
    errorMessages: [],
    infoMessages: []
  };

  updateUserInfo();

  function showErrorMessage(errorMessage) {
    clearMessages();
    $scope.vm.errorMessages.push({
      description: errorMessage
    });
  }

  function updateUserInfo() {
    UserService.getUserInfo()
      .then(function(userInfo) {
          $scope.vm.userName = userInfo.userName;
          $scope.vm.maxCaloriesPerDay = userInfo.maxCaloriesPerDay;
          $scope.vm.todaysCalories = userInfo.todaysCalories ? userInfo.todaysCalories : 'None';
        },
        function(errorMessage) {
          showErrorMessage(errorMessage);
        });
  }

  function markAppAsInitialized() {
    if ($scope.vm.appReady == undefined) {
      $scope.vm.appReady = true;
    }
  }

  function clearMessages() {
    $scope.vm.errorMessages = [];
    $scope.vm.infoMessages = [];
  }

  function showInfoMessage(infoMessage) {
    $scope.vm.infoMessages = [];
    $scope.vm.infoMessages.push({
      description: infoMessage
    });
    $timeout(function() {
      $scope.vm.infoMessages = [];
    }, 1000);
  }

  $scope.logout = function() {
    UserService.logout();
  }

}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', 'ConnectionService', '$state','$http', function($scope, ConnectionService, $state,$http) {
  $scope.$on('$includeContentLoaded', function() {
    Layout.initSidebar(); // init sidebar
  });

  //Populating the Folder Tree in sidebar
  $scope.connection;
  $scope.mapping;
  
  var data=function(){
		 alert(); 
	     ConnectionService.searchConnections().then(function(success) {
		    $scope.connection = success.connections;
		    //alert($scope.connection);
		  });
		
			$http.get("/mappingsview").success(function(response){
				$scope.mapping=response.mappingsViews;
			  
		  });
  };
  	
  	data();
  	$scope.reload=function(){
  		data();
   	};
  $scope.goTo = function(connection) {

    // Skip if it's a File upload
    if (connection.connectionType == "Local") {
      toastr["warning"]("Can not edit a uploaded file..", "Warning");
      return false;
    }

    $state.go('connectionDetail', {
      id: connection.id
    });
  };

}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('PageHeadController', ['$scope', function($scope) {
  $scope.$on('$includeContentLoaded', function() {
    Demo.init(); // init theme panel
  });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
  $scope.$on('$includeContentLoaded', function() {
    Layout.initFooter(); // init footer
  });
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  // Redirect any unmatched url
  $urlRouterProvider.otherwise("/connections");

  $stateProvider

  // Dashboard
    .state('dashboard', {
    url: "/dashboard.html",
    templateUrl: "views/dashboard.html",
    data: {
      pageTitle: 'Dashboard',
      pageSubTitle: 'statistics & reports'
    },
    controller: "DashboardController",
    resolve: {
      deps: ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load({
          name: 'MetronicApp',
          insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
          files: [
            'assets/global/plugins/morris/morris.css',
            'assets/admin/pages/css/tasks.css',

            'assets/global/plugins/morris/morris.min.js',
            'assets/global/plugins/morris/raphael-min.js',
            'assets/global/plugins/jquery.sparkline.min.js',

            'assets/admin/pages/scripts/index3.js',
            'assets/admin/pages/scripts/tasks.js',

            'js/controllers/DashboardController.js'
          ]
        });
      }]
    }
  })

  // Migration Wizard View
  .state('create_mappings', {
      url: "/create_mappings",
      templateUrl: "views/migrate.html",
      data: {
        pageTitle: 'Syra',
        pageSubTitle: 'ETL tool for Big Data'
      },
      controller: "DataMigrationController",
      resolve: {
        deps: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([{
            name: 'MetronicApp',
            insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
            files: [
              'assets/global/plugins/jstree/dist/themes/default/style.min.css',
              'assets/global/plugins/jstree/dist/themes/default/menu_tree_compare.css',
              'assets/global/plugins/bootstrap-toastr/toastr.min.css',
              'assets/global/plugins/select2/select2.css',
              'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',

              //'assets/global/plugins/bootstrap-growl/jquery.bootstrap-growl.min.js',

              'assets/global/plugins/bootstrap-toastr/toastr.min.js',
              'assets/global/plugins/bootbox/bootbox.min.js',
              'assets/global/plugins/select2/select2.min.js',
              'assets/global/plugins/datatables/all.min.js',

              'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
              'assets/global/plugins/jquery-validation/js/additional-methods.min.js',
              'assets/global/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js',
              'assets/global/plugins/jstree/dist/jstree.min.js',
              '//cdnjs.cloudflare.com/ajax/libs/jsPlumb/1.4.1/jquery.jsPlumb-1.4.1-all-min.js',

              'js/scripts/table-connections-migrate.js',
              'js/scripts/table-mappings.js',
              'js/scripts/common.js',
              'js/scripts/migrate.js',

              'assets/admin/pages/scripts/form-wizard2.js',
              'assets/admin/pages/scripts/ui-tree2.js',
              'js/controllers/DataMigrationController.js',
              'js/controllers/BasicConnectionsController.js'
            ]
          }]);
        }]
      }
    })
    
     //Edit Migration Wizard View
  .state('edit_mappings', {
      url: "/edit_mappings/:id",
      templateUrl: "views/migrate.html",
      data: {
        pageTitle: 'Syra',
        pageSubTitle: 'ETL tool for Big Data'
      },
      controller: "DataMigrationController",
      resolve: {
        deps: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([{
            name: 'MetronicApp',
            insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
            files: [
              'assets/global/plugins/jstree/dist/themes/default/style.min.css',
              'assets/global/plugins/jstree/dist/themes/default/menu_tree_compare.css',
              'assets/global/plugins/bootstrap-toastr/toastr.min.css',
              'assets/global/plugins/select2/select2.css',
              'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',

              //'assets/global/plugins/bootstrap-growl/jquery.bootstrap-growl.min.js',

              'assets/global/plugins/bootstrap-toastr/toastr.min.js',
              'assets/global/plugins/bootbox/bootbox.min.js',
              'assets/global/plugins/select2/select2.min.js',
              'assets/global/plugins/datatables/all.min.js',

              'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
              'assets/global/plugins/jquery-validation/js/additional-methods.min.js',
              'assets/global/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js',
              'assets/global/plugins/jstree/dist/jstree.min.js',
              '//cdnjs.cloudflare.com/ajax/libs/jsPlumb/1.4.1/jquery.jsPlumb-1.4.1-all-min.js',

              'js/scripts/table-connections-migrate.js',
              'js/scripts/table-mappings.js',
              'js/scripts/common.js',
              'js/scripts/migrate.js',

              'assets/admin/pages/scripts/form-wizard2.js',
              'assets/admin/pages/scripts/ui-tree2.js',
              'js/controllers/DataMigrationController.js',
              'js/controllers/BasicConnectionsController.js'
            ]
          }]);
        }]
      }
    })
    
    // Connections View
    .state('connections', {
      url: "/connections",
      templateUrl: "views/connections.html",
      data: {
        pageTitle: 'Syra',
        pageSubTitle: 'ETL tool for Big Data'
      },
      controller: "ConnectionsController",
      resolve: {
        deps: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([{
            name: 'angularFileUpload',
            files: [
              'assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
            ]
          }, {
            name: 'MetronicApp',
            insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
            files: [
              'assets/global/plugins/bootstrap-toastr/toastr.min.css',
              'assets/global/plugins/select2/select2.css',
              'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',

              'assets/global/plugins/bootstrap-toastr/toastr.min.js',
              'assets/global/plugins/bootbox/bootbox.min.js',
              'assets/global/plugins/select2/select2.min.js',
              'assets/global/plugins/datatables/all.min.js',

              'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
              'assets/global/plugins/jquery-validation/js/additional-methods.min.js',

              'js/scripts/common.js',
              'js/scripts/table-connections.js',

              'js/controllers/ConnectionsController.js'
            ]
          }]);
        }]
      }
    })

  //connection detail page controller for folder tree
  .state('connectionDetail', {
    url: "/connectionDetail/:id",
    templateUrl: "views/connectionsDetail.html",
    data: {
      pageTitle: 'Syra',
      pageSubTitle: 'ETL tool for Big Data'
    },
    controller: "ConnectionsController",
    resolve: {
      deps: ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load([{
          name: 'angularFileUpload',
          files: [
            'assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
          ]
        }, {
          name: 'MetronicApp',
          insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
          files: [
            'assets/global/plugins/bootstrap-toastr/toastr.min.css',
            'assets/global/plugins/select2/select2.css',
            'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',

            'assets/global/plugins/bootstrap-toastr/toastr.min.js',
            'assets/global/plugins/bootbox/bootbox.min.js',
            'assets/global/plugins/select2/select2.min.js',
            'assets/global/plugins/datatables/all.min.js',

            'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
            'assets/global/plugins/jquery-validation/js/additional-methods.min.js',

            'js/scripts/common.js',
            'js/scripts/table-connections.js',

            'js/controllers/ConnectionsController.js'
          ]
        }]);
      }]
    }
  })
  
   // Create Connections View
    .state('create_connections', {
      url: "/create_connections",
      templateUrl: "views/create-connections.html",
      data: {
        pageTitle: 'Syra',
        pageSubTitle: 'ETL tool for Big Data'
      },
      controller: "ConnectionsController",
      resolve: {
        deps: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([{
            name: 'angularFileUpload',
            files: [
              'assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
            ]
          }, {
            name: 'MetronicApp',
            insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
            files: [
              'assets/global/plugins/bootstrap-toastr/toastr.min.css',
              'assets/global/plugins/select2/select2.css',
              'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',

              'assets/global/plugins/bootstrap-toastr/toastr.min.js',
              'assets/global/plugins/bootbox/bootbox.min.js',
              'assets/global/plugins/select2/select2.min.js',
              'assets/global/plugins/datatables/all.min.js',

              'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
              'assets/global/plugins/jquery-validation/js/additional-methods.min.js',

              'js/scripts/common.js',
              'js/scripts/table-connections.js',

              'js/controllers/ConnectionsController.js'
            ]
          }]);
        }]
      }
    })


  // Mappings View
  .state('mappings', {
    url: "/mappings",
    templateUrl: "views/mappings.html",
    data: {
      pageTitle: 'Syra',
      pageSubTitle: 'ETL tool for Big Data'
    },
    controller: "MappingsController",
    resolve: {
      deps: ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load([{
          name: 'MetronicApp',
          insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
          files: [
            'assets/global/plugins/bootstrap-toastr/toastr.min.css',
            'assets/global/plugins/select2/select2.css',
            'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
            'assets/global/plugins/datatables/extensions/ColVis/css/dataTables.colVis.min.css',
            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css',
            'assets/global/plugins/jstree/dist/themes/default/style.min.css',
            'assets/global/plugins/jstree/dist/themes/default/menu_tree_compare.css',

            'assets/global/plugins/bootstrap-toastr/toastr.min.js',
            'assets/global/plugins/bootbox/bootbox.min.js',
            'assets/global/plugins/select2/select2.min.js',
            'assets/global/plugins/moment.min.js',
            'assets/global/plugins/datatables/all.min.js',
            'assets/global/plugins/datatables/extensions/ColVis/js/dataTables.colVis.min.js',
            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js',
            'assets/global/plugins/jstree/dist/jstree.min.js',

            'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
            'assets/global/plugins/jquery-validation/js/additional-methods.min.js',
            'assets/global/plugins/cronGen/cronGen.js',

            'js/scripts/common.js',
            'js/scripts/table-mappings.js',

            'js/controllers/MappingsController.js'
          ]
        }]);
      }]
    }
  })
  
//Mappings Detail View
  .state('mappingDetail', {
    url: "/mappingDetail/:id",
    templateUrl: "views/mappingsDetail.html",
    data: {
      pageTitle: 'Syra',
      pageSubTitle: 'ETL tool for Big Data'
    },
    controller: "MappingsDetailController",
    resolve: {
      deps: ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load([{
          name: 'MetronicApp',
          insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
          files: [
            'assets/global/plugins/bootstrap-toastr/toastr.min.css',
            'assets/global/plugins/select2/select2.css',
            'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
            'assets/global/plugins/datatables/extensions/ColVis/css/dataTables.colVis.min.css',
            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css',
            'assets/global/plugins/jstree/dist/themes/default/style.min.css',
            'assets/global/plugins/jstree/dist/themes/default/menu_tree_compare.css',

            'assets/global/plugins/bootstrap-toastr/toastr.min.js',
            'assets/global/plugins/bootbox/bootbox.min.js',
            'assets/global/plugins/select2/select2.min.js',
            'assets/global/plugins/moment.min.js',
            'assets/global/plugins/datatables/all.min.js',
            'assets/global/plugins/datatables/extensions/ColVis/js/dataTables.colVis.min.js',
            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js',
            'assets/global/plugins/jstree/dist/jstree.min.js',

            'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
            'assets/global/plugins/jquery-validation/js/additional-methods.min.js',
            'assets/global/plugins/cronGen/cronGen.js',

            'js/scripts/common.js',
            'js/scripts/table-mappings.js',

            'js/controllers/MappingsDetailController.js'
          ]
        }]);
      }]
    }
  })
  
  //Workflow's page
  .state('workflows', {
    url: "/workflows",
    templateUrl: "views/workflows.html",
    data: {
      pageTitle: 'Syra',
      pageSubTitle: 'ETL tool for Big Data'
    },
    controller: "WorkflowsController",
    resolve: {
      deps: ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load([{
          name: 'MetronicApp',
          insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
          files: [
            'assets/global/plugins/bootstrap-toastr/toastr.min.css',
            'assets/global/plugins/select2/select2.css',
            'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
            'assets/global/plugins/datatables/extensions/ColVis/css/dataTables.colVis.min.css',
            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css',
            'assets/global/plugins/jstree/dist/themes/default/style.min.css',
            'assets/global/plugins/jstree/dist/themes/default/menu_tree_compare.css',

            'assets/global/plugins/bootstrap-toastr/toastr.min.js',
            'assets/global/plugins/bootbox/bootbox.min.js',
            'assets/global/plugins/select2/select2.min.js',
            'assets/global/plugins/moment.min.js',
            'assets/global/plugins/datatables/all.min.js',
            'assets/global/plugins/datatables/extensions/ColVis/js/dataTables.colVis.min.js',
            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js',
            'assets/global/plugins/jstree/dist/jstree.min.js',

            'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
            'assets/global/plugins/jquery-validation/js/additional-methods.min.js',
            'assets/global/plugins/cronGen/cronGen.js',

            'js/scripts/common.js',
            'js/scripts/table-mappings.js',

            'js/controllers/WorkflowsController.js'
          ]
        }]);
      }]
    }
  })
}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
  $rootScope.$state = $state; // state to be accessed from view
}]);

/* Session expire notify*/
MetronicApp.factory("httpInterceptor", ["$q", "$window", "$log",function ($q, $window, $log) {
    return {
     "response": function (response) {
        var responseHeaders;
        responseHeaders = response.headers();
        if (responseHeaders["content-type"].indexOf("text/html") !== -1 && response.data
               && response.data.indexOf('<meta name="unauthorized" content="true">') !== -1) {
          $window.location.reload();
          return $q.reject(response);
        }
        return response;
      }
    };
 }
])
.config(["$httpProvider",function ($httpProvider) {
        $httpProvider.interceptors.push("httpInterceptor");
    }
]);