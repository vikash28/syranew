var syraJsPlumb = function () {
	
	//restrict vakata library call
	var initVakata=false;
	
	// Common settings among all connections.
	var common = {
	  anchors : ["Right", "Left"],
	  endpoints : ["Blank", "Blank"],
	  overlays : [[ "Arrow", { location:1 } ], [ "Arrow", { location:1 } ]],
	  paintStyle : { lineWidth:4, strokeStyle:"#A0A0A0" },
	  // When clicking on the connector, scroll to the target.
	  hoverPaintStyle : { strokeStyle:"#Fa5a5a", lineWidth:4 },
	  endpointHoverStyle : { fillStyle:"#00ff00" }
	};

	var addConnection = function (sourceAnchor, targetAnchor){
		jsPlumb.connect({
			source: sourceAnchor,
			target: targetAnchor,
		}, common)
		.bind("contextmenu", function(component, originalEvent) {
			/*alert("context menu on component " + component.id);
			originalEvent.preventDefault();

			var connid = component.id;
			alert("Connection ID " + connid);
			return false;*/
		})
		 .bind("click", function(conn) {
		  // On first click, scroll to the target. On second click, scroll
		  // to the source.
		  if (!conn['menu_tree_compare-clicks']) {
			conn['menu_tree_compare-clicks'] = 1;
		  }
		  else {
			conn['menu_tree_compare-clicks'] += 1;
		  }
		  if (conn['menu_tree_compare-clicks'] % 2) {
			var scroll_target = $("#" + conn.targetId);
		  }
		  else {
			var scroll_target = $("#" + conn.sourceId);
		  }
		  jQuery('html, body').animate({
			scrollTop: scroll_target.offset().top - 50
		  }, 1000);

		  // Remove the highlight class from the other elements.
		  $('.jstree-container-ul a').not("#" + conn.sourceId).not("#" + conn.targetId).removeClass('menu_tree_compare-highlight');

		  // Add the highlight class to the source & target.
		  $("#" + conn.sourceId).addClass('menu_tree_compare-highlight');
		  $("#" + conn.targetId).addClass('menu_tree_compare-highlight');

		  // Repaint the connections as the highlighting changes the size
		  // of the highlighted elements.
		  jsPlumb.repaintEverything();
		});	
	}

	var init = function () {

		$(document).ready(function(){
			
			// Handle drag and drop of elements between source and target trees !!
			
			// .off() is to make sure the event is not attached multiple times !!
			//$(document).off("dnd_stop.vakata");
			if(initVakata==false){

			// .on() attaching the DnD event for the trees
			$(document).on('dnd_stop.vakata', function(e, data) {
				var ref = $('#tree_source').jstree(true);
				var sourceNode = ref.get_node(data.element);
				var sourceType = sourceNode.type;
				var $s = $(data.event);
				var $sourceNode = $s.closest('.jstree-node');
				
				var ref2 = $('#tree_destination').jstree(true);
				var targetNode = ref2.get_node(data.event.target);
				var targetType = targetNode.type;
				
				var $t = $(data.event.target);
				var $targetNode = $t.closest('.jstree-node');
				var $targetAnchor = $t.closest('.jstree-anchor');
				
				var jsServerType = $(".btn-server-type.active").attr("btn-radio");
								
				// Check if it's allowed source / target
				if((jsServerType == "'Hive'" && sourceType == "column" && targetType == "column") ||
					((jsServerType == "'HDFS'" || jsServerType == "'Local'") && sourceType == "table" && targetType == "table")){
				
					// Check if the Target table already exists in Target Database or created using DnD
					if($targetNode.attr("id").indexOf("j2_") == -1){
					
						// Check if the Target Column already has a mapping
						if(!$targetAnchor.hasClass("_jsPlumb_endpoint_anchor_")){
						
							// Check if the parent table has any mappings with other source tables
							// Currently we can only import from one table at a time
							
							// Get current transaction's source table name
							var sourceTableName = sourceNode.parent;
							
							// Get current target table node and children
							var targetTable = ref2.get_node(targetNode.parent);
		
							// Loop through current table							
							for(var child in targetTable.children_d){
		
								// Check for existing connection
								var connections = jsPlumb.getConnections({
								  target : targetTable.children_d[child] + '_anchor',
								});
																
								if(connections.length>0){
								
									// Check source node's parent name
									var prevSourceTableName = ref.get_node(connections[0].sourceId).parent;
									
									if(sourceTableName!=prevSourceTableName){
										toastr["warning"]("Target table has existing mapping(s) with another 'source' table..", "Target can't have mappings from multiple sources");
										
										return false;
									}
									
									// If the source table name differs from current source table name do NOT allow
		
								}
							}
							
							// create the actual connection after all validations!!
				
							addConnection(data.element.id, $targetAnchor.attr("id"));
							
						} else {
							toastr["warning"]("This column has an existing mapping, please remove it and try again..", "Duplicate Mapping");
						}
					} else {
						toastr["warning"]("This table does not exist on target. We can not create Column mappings until the Table gets created on target..","Table does not exist in Redshift");
					}
				}
			});
			initVakata=true;
		}		
			$('#tree_destination').on("copy_node.jstree", function (e, data) {
				// All the validations are handled on check_callback function
				// Only allowed copy option is the entire table to a database
				
				addConnection(data.original.id + "_anchor", (data.node.id + ""));
		    });
			
			// Set up container.
		    jsPlumb.Defaults.Container = $('#tab3');
		
		    // Make sure we hide the connections of the children when closing a node.
		    $('#tree_source').on("close_node.jstree", function (e, data) {
		      for (var child in data.node.children_d) {
				jsPlumb.select({source:data.node.children_d[child] + '_anchor'}).each(function(conn){
					if(conn.isVisible()){
						jsPlumb.hide(data.node.children_d[child] + '_anchor');
					}
				});
		      }		  
			  jsPlumb.repaintEverything();		  
		    });
		
		    $('#tree_destination').on("close_node.jstree", function (e, data) {
		      for (var child in data.node.children_d) {
				jsPlumb.select({target:data.node.children_d[child] + '_anchor'}).each(function(conn){
					if(conn.isVisible()){
						jsPlumb.hide(data.node.children_d[child] + '_anchor');
					}
				});
		      }
			  jsPlumb.repaintEverything();
		    });
		
		    // Show the connections of the children again.
		    $('.jstree').on("after_open.jstree", function (e, data) {
				jsPlumb.repaintEverything();
		    });
		
		    /* Show the connections of the children again.
		    $('#tree_destination').on("after_open.jstree", function (e, data) {
				// Reset Anchor IDs to match copied node ID
				$("#"+data.node.id).parent().children("li").each(function(index,elem){
					$(elem).children("a").attr("id",($(elem).attr("id") + "_anchor"));
				});
		
				jsPlumb.repaintEverything();
		    });*/
		
		    // After closing and opening a node, its child connections will be
		    // "broken", ie pointing to the wrong source/target. We will detach
		    // them, change the IDs, and create new ones.
		    $('.jstree').on("open_node.jstree", function (e, data) {
		      for (var child in data.node.children_d) {
		
		        // We don't know whether this is in the source or the target, so
		        // look in both.
		        var broken_connections_source = jsPlumb.getConnections({
		          source : data.node.children_d[child] + '_anchor',
		        });
		        var broken_connections_target = jsPlumb.getConnections({
		          target : data.node.children_d[child] + '_anchor',
		        });
		        var broken_connections = broken_connections_source.concat(broken_connections_target);
		
		        for (var conn in broken_connections) {
		          // Remove the broken connection.
		          jsPlumb.detach(broken_connections[conn]);
		
		          // Make a new connection.
		          addConnection(broken_connections[conn].sourceId, broken_connections[conn].targetId);
		
				  /* Vasanth - WITH OUT CHANGING IDS itself ITS WORKING
		
					  // Remove the broken connection.
					  var source_name = broken_connections[conn].sourceId.replace("_anchor", "");
					  var target_name = broken_connections[conn].targetId.replace("_anchor", "");
		
					  jsPlumb.detach(broken_connections[conn]);
				  
					  // Temporarily rename the source and the target.
					  var new_source_name = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Math.floor(Math.random() * 1000000);
					  var new_target_name = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Math.floor(Math.random() * 1000000);
		
					  var source_node = $('#tree_source').jstree(true).get_node(source_name);
					  var target_node = $('#tree_destination').jstree(true).get_node(target_name);
		
					  // We change the ID because using the old ID means the connectors
					  // go to the top left of the screen.
					  $('#' + source_name + '_anchor').attr('id', new_source_name + '_anchor');
					  $('#tree_source').jstree(true).set_id(source_node, new_source_name);
					  source_node.li_attr.id = new_source_name;
					  source_node.a_attr.id = new_source_name + '_anchor';
		
					  $('#' + target_name + '_anchor').attr('id', new_target_name + '_anchor');
					  $('#tree_destination').jstree(true).set_id(target_node, new_target_name);
					  target_node.li_attr.id = new_target_name;
					  target_node.a_attr.id = new_target_name + '_anchor';
					  
		
					  // Make a new connection.
					  addConnection(new_source_name + '_anchor', new_target_name + '_anchor');
		
				  */
		        }
		      }
		    });		
			
		});
		
		// Just Pulsate the Save button !!
		
		(function($) {
		$.fn.pulsate = function(options) {
		    var defaults = {
		        fadeIn: 1000,
		        fadeInDelay: 150,
		        fadeOut: 1000,
		        fadeOutDelay: 5000            
		    };
		
		    var settings = $.extend({}, defaults, options);
		
		    function fadeOutIn(element) {
		        $(element || this).delay(settings.fadeOutDelay)
		            .fadeOut(settings.fadeOut)
		            .delay(settings.fadeInDelay)
		            .fadeIn(settings.fadeIn, fadeOutIn);
		    }           
		
		    return this.each(function() {
		       fadeOutIn(this); 
		    });
		};    
		})(jQuery);
		
		$(document).ready(function(){
			$('#btnSaveTree').pulsate();
		});
	}
    
    return {

        //main function to initiate the module
        init: function () {

            if (!jsPlumb) {
                return;
            }
            init();
            
        },
        EditConnection:function(source,target){
        	if(!jsPlumb){
        		return
        	}
        	if(source&&target){
        		addConnection(source,target);
            }

        }

    };    
}()