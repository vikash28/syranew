angular.module('MetronicApp').controller('TodoController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        App.initAjax(); // initialize core components 
        
        $(".tr").jstree({
            "core" : {
                "themes" : {
                    "responsive": false
                }, 
                // so that create works
                "check_callback" : function(operation, node, node_parent, node_position, more) {
                	// operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
                    // in case of 'rename_node' node_position is filled with the new node name
                	 
                    if (operation === "move_node") {
                    	
                        return false; //only allow dropping inside nodes of type 'Parent'
                    }

                	return true;
                },
                'data':
               	 [{
                    "text": "Connection",
                    "icon": "fa icon-puzzle icon-state-success icon-lg",
                    "children": [{
                        "text": "Connection1",
                        "icon": "fa icon-paper-clip icon-state-success icon-lg",
                        "state": {
                            "selected": true
                        }
                    }, {
                        "text": "Connection1",
                        "icon": "fa icon-paper-clip icon-state-success icon-lg",
                        "children": [{
                            "text": "Connection1",
                            "icon": "fa icon-paper-clip icon-state-success icon-lg",
                            "state": {
                                "selected": true
                            }
                        }]
                    }, 
                    {
                        "text": "Connection2",
                        "icon": "fa icon-paper-clip icon-state-success icon-lg",
                    }, {
                        "text": "Connection3",
                        "icon": "fa icon-paper-clip icon-state-success icon-lg",
                    }, {
                        "text": "Connection4",
                        "icon": "fa icon-paper-clip icon-state-success icon-lg",
                        
                    }, {
                        "text": "Connection5",
                        "icon": "fa icon-paper-clip icon-state-success icon-lg",
                     
                    }]
                } 
            ]
        },
            "types" : {
                "default" : {
                    "icon" : "fa icon-settings icon-state-warning icon-lg"
                },
                "file" : {
                    "icon" : "fa fa-file icon-state-warning icon-lg"
                }
            },
            "state" : { "key" : "demo2" },
            "plugins" : [ "contextmenu", "dnd", "state", "types" ],
             
        });
 
        $("jstree ul").addClass("dropdown-menu pull-right");
        $("jstree li").addClass("badge badge-success");

    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = false;
});