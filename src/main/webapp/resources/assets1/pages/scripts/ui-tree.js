function customMenu(node) {
	//alert(angular.toJson(node,true));
	//alert(node.parent);
   //Show a different label for renaming files and folders
	if (node.parent == '#') { //If node is a folder
		 var items = {
			      "Create" : {
			          "label" : "Create",
			          "action" : function () {  alert(); }
			      }
			   };
		   }
	else
	{
	var items = {
      "Edit" : {
          "label" : "Edit",
          "action" : function () {  alert(); }
      },
      "delete" : {
         "label" : "Delete",
         "action" : function () { alert(); }
      }
     };
	}
   
   return items;
}

var UITree = function () {

    var handleSample1 = function () {
    	
     
        $('#tree_1').jstree({
            "core" : {
                "themes" : {
                    "responsive": false
                }            
            },
            "types" : {
                "default" : {
                    "icon" : "fa fa-folder icon-state-warning icon-lg"
                },
                "file" : {
                    "icon" : "fa fa-file icon-state-warning icon-lg"
                }
            },
            "plugins": ["types"]
        });

        // handle link clicks in tree nodes(support target="_blank" as well)
        $('#tree_1').on('select_node.jstree', function(e,data) { 
            var link = $('#' + data.selected).find('a');
            if (link.attr("href") != "#" && link.attr("href") != "javascript:;" && link.attr("href") != "") {
                if (link.attr("target") == "_blank") {
                    link.attr("href").target = "_blank";
                }
                document.location.href = link.attr("href");
                return false;
            }
        });
    }

    var handleSample2 = function () {
        $('#tree_2').jstree({
            'plugins': ["wholerow", "checkbox", "types"],
            'core': {
                "themes" : {
                    "responsive": false
                },    
                'data': [{
                        "text": "Same but with checkboxes",
                        "children": [{
                            "text": "initially selected",
                            "state": {
                                "selected": true
                            }
                        }, {
                            "text": "custom icon",
                            "icon": "fa fa-warning icon-state-danger"
                        }, {
                            "text": "initially open",
                            "icon" : "fa fa-folder icon-state-default",
                            "state": {
                                "opened": true
                            },
                            "children": ["Another node"]
                        }, {
                            "text": "custom icon",
                            "icon": "fa fa-warning icon-state-warning"
                        }, {
                            "text": "disabled node",
                            "icon": "fa fa-check icon-state-success",
                            "state": {
                                "disabled": true
                            }
                        }]
                    },
                    "And wholerow selection"
                ]
            },
            "types" : {
                "default" : {
                    "icon" : "fa fa-folder icon-state-warning icon-lg"
                },
                "file" : {
                    "icon" : "fa fa-file icon-state-warning icon-lg"
                }
            }
        });
    }

    

     var ajaxTreeSample = function() {

        $("#tree_4").jstree({
            "core" : {
                "themes" : {
                    "responsive": false
                }, 
                // so that create works
                "check_callback" : true,
                'data' : {
                    'url' : function (node) {
                      return '../demo/jstree_ajax_data.php';
                    },
                    'data' : function (node) {
                      return { 'parent' : node.id };
                    }
                }
            },
            "types" : {
                "default" : {
                    "icon" : "fa fa-folder icon-state-warning icon-lg"
                },
                "file" : {
                    "icon" : "fa fa-file icon-state-warning icon-lg"
                }
            },
            "state" : { "key" : "demo3" },
            "plugins" : [ "dnd", "state", "types" ]
        });
    
    }


    return {
        //main function to initiate the module
        init: function () {

            handleSample1();
            handleSample2();
            contextualMenuSample();
            ajaxTreeSample();

        }

    };

}();

if (App.isAngularJsApp() === false) {
    jQuery(document).ready(function() {    
       UITree.init();
    });
}