var UITree = function () {
	  
     var ajaxSourceTree = function() {

        $("#tree_source").jstree({
            "core" : {
                "themes" : {
                    "responsive": false
                }, 
                // so that create works
                "check_callback" : true,
				"multiple" : false,	
                'data' : ["No Tables or Source Metadata did not load properly"],
				'check_callback' : function (operation, node, node_parent, node_position, more) {
					// operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
					// in case of 'rename_node' node_position is filled with the new node name
					return false;
				}				
            },
			"dnd" : {
				"is_draggable" : function(node) {
					if (node[0].type == 'database') {
						return false;
					}
					return true;
				},
				"is_droppable" : function(node) {
					return false;
				}
			},			
            "types" : {
                "default" : {
                    "icon" : "fa fa-folder icon-state-warning icon-lg"
                },
                "database" : {
                    "icon" : "fa fa-database icon-lg"
                },
                "table" : {
                    "icon" : "fa fa-table icon-lg"
                },
                "column" : {
                    "icon" : "fa fa-square-o icon-lg"
                }
            },
			"contextmenu" : {
				"items" : function(node) {

					var items = {
						"RemoveMapping": {
							"separator_before": false,
							"separator_after": false,
							"label": "Remove Mapping",
							"action": function (obj) {
							
								jsPlumb.detach(jsPlumb.getConnections({source: node.id + "_anchor"})[0]);
							
							}
						}
					};
					
					// Check if Column has any mapping, otherwise remove the cmenu item
					if(jsPlumb.getConnections({source: node.id + "_anchor"}).length==0){
						delete items.RemoveMapping;
					}

					return items;				
				}
			},			
            "state" : { "key" : "sourceTreeKey" },
            "plugins" : [ "dnd", "types", "noselect", "contextmenu" ]
        });
    
    }

	var shownFlag = false;
	
    var ajaxDestinationTree = function() {
	
        $("#tree_destination").jstree({
            "core" : {
                "themes" : {
                    "responsive": false
                }, 
                // so that create works
                "check_callback" : true,
				"multiple" : false,
                'data' : ["No Tables or Destination Metadata did not load properly"],
				'check_callback' : function (operation, node, node_parent, node_position, more) {
					// operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
					// in case of 'rename_node' node_position is filled with the new node name
					
					var jsServerType = $(".btn-server-type.active").attr("btn-radio");
					var jsTargetServerType = $(".btn-target-server-type.active").attr("btn-radio");
					
					if (operation == 'move_node') {
						if (node.type == 'column' && node_parent.type == 'column'){
							return true;
						} else if(jsServerType == "'Hive'" && node.type == 'table' && node_parent.type == 'database') {
							// Check for duplicate tables on the Target
							if($("#" + node_parent.id).find("li[data-table-name='" 
									+ node.li_attr["data-table-name"] + "']").length > 0){
								if(!shownFlag){
									//FormWizard.notify("Table exists on the target..", "warning");
									toastr["warning"]("Table already exists on the target..", "Warning - Duplicate Table");
									shownFlag = true;
									setTimeout(function(){shownFlag=false;},5000);
								}
								return false;
							}
							return true;
						} else if((jsServerType == "'HDFS'" || jsServerType == "'Local'") 
								&& node.type == 'table' && node_parent.type == 'table') {
							return true;
						} else {
							return false;
						}
					} else if (operation == 'copy_node') {
						if (jsServerType == "'Hive'" && node.type == 'table' && node_parent.type == 'database'){
							return true;
						} else if((jsServerType == "'HDFS'" || jsServerType == "'Local'")
								&& node.type == 'table' && node_parent.type == 'table') {
							return false;
						} else {
							return false;
						}
					} else if (operation == 'rename_node') {

						var tree = $("#tree_destination").jstree(true);
					
						var flagNewNode = false;
						
						if((typeof node.li_attr["data-table-name"] == "undefined" 
							&& typeof node.li_attr["data-column-name"] == "undefined")
							|| node.li_attr["data-new-object"]){
							
							flagNewNode = true;
							
						}
						
						if(flagNewNode){
							
							if(node.type == "table"){

								var newTableName = node_position.trim().replace(/ /g,"_");
								var newNodeId = node.parent + "-" + newTableName;

								tree.set_id(node, newNodeId);
								tree.set_text(node, newTableName);
								
								// Table attributes with the new values
								node.li_attr = {
													"data-table-id": newNodeId,
													"data-table-name": newTableName,
													"data-new-object": true,
													// "data-output-format": table.outputFormat,
													// "data-table-type": table.tableType,
													// "data-input-format": table.inputFormat,
													// "data-field-delim": table.fieldDelim,
													// "data-data-location": table.dataLocation,
													// "data-create-time": table.createTime,
													// "data-owner": table.owner
												};

								// Table Anchor attributes
								node.a_attr = {"id": newNodeId + "_anchor" };
								
								// A new Table is getting created on the Tree!!
								$("#btnSaveTree").removeClass("hide");
								
							} else if (node.type == "column"){

								var tableName = tree.get_node(node.parent).li_attr["data-table-name"];
								var tableNameNew = tree.get_node(node.parent).li_attr["data-new-object"];

								var newColumnName = node_position.trim().replace(/ /g,"_");
								var newNodeId = node.parent + "-" + newColumnName;
								var newColType = node.li_attr["data-column-type"];

								tree.set_id(node, newNodeId);
								tree.set_text(node, newColumnName);
								
								// Update Column attributes with the new values
								node.li_attr = {
													"data-column-id": newNodeId,
													"data-column-name": newColumnName,
													"data-column-type": newColType,
													"data-new-object": true,														
													// "data-output-format": table.outputFormat,
													// "data-table-type": table.tableType,
													// "data-input-format": table.inputFormat,
													// "data-field-delim": table.fieldDelim,
													// "data-data-location": table.dataLocation,
													// "data-create-time": table.createTime,
													// "data-owner": table.owner
												};

								// Table Anchor attributes
								node.a_attr = {"id": newNodeId + "_anchor" };
								
								// Skip if the Table is getting built
								// Table will be saved with these new columns on btnSaveTree !!!!!
								
								if(!tableNameNew){

									// Create new column on Redshift
									// TODO - Need to add other Column types
									
									toastr["info"]("Creating column " + newColumnName 
											+ " on Redshift", "Column creation in progress..");

									if(jsTargetServerType == "'Redshift'"){
										var columnSchema = "ALTER TABLE " + tableName 
										+ " ADD COLUMN " + newColumnName + " " + newColType +";";

										var createRedshiftColumn = $.postJSON( "/Syra-1.0.0-BUILD-SNAPSHOT/QueryOnRedshift",{
											"hiveThriftServer": "",
											"s3AccessKey": "",
											"s3SecreteKey": "",
											"hiveTableName": "",
											"hiveTableSchema": "",
											"hiveTableDataLocation": "",
											"redshiftDBURL": $("input[name=redshiftDBURL]").val(),
											"redshiftUser": $("input[name=redshiftUser]").val(),
											"redshiftPassword": $("input[name=redshiftPassword]").val(),
											"seperator": "",
											"tmpDir": "",
											"redShiftQuery": columnSchema
										}, function(data){
											FormWizard.loadRedshiftTree();
											
											toastr["success"]("<b>A new Column <b>" + tableName + "." + newColumnName 
													+ "</b> successfully created on Redshift !!</b><br />", 
													"New column created successfully!!");
										});
									} else if(jsTargetServerType == "'Hive'"){
										var columnSchema = "ALTER TABLE " + tableName 
										+ " ADD COLUMNS (" + newColumnName + " " + newColType + ")";
										
										var createHiveColumn = $.postJSON( "/Syra-1.0.0-BUILD-SNAPSHOT/QueryOnHive",{
											"srcConnectionStr": "",
										    "destConnectionStr": $("input[name=hiveThriftServer2]").val(),
										    "srcUserName": "",
										    "destUserName": "",
										    "srcInputPath": "",
										    "srcTableName": "",
										    "destTableName": "",
										    "srcSchema": "",
										    "destSchema": columnSchema,
										    "srcSeperator": "",
										    "destSeperator": "",
											"s3AccessKey": $("input[name=s3AccessKey]").val(),
											"s3SecreteKey": $("input[name=s3SecreteKey]").val(),
										    "tmpDir": "",
										    "srcDataLocation": "",
										    "destDataLocation": ""
										}, function(data){
											FormWizard.loadHiveTree("#tree_destination");
											
											toastr["success"]("<b>A new Column <b>" + tableName + "." + newColumnName 
													+ "</b> successfully created on Hive !!</b><br />", 
													"New column created successfully!!");
										});
									}
								}
							}
													
						} else {
							
							// Declare required variables
							var renameSql = "", tableName = "", oldTableName = "";
							var newTableName = "", oldColumnName = "", newColumnName = "";
							
							if(node.type == "table"){
								oldTableName = node.li_attr["data-table-name"].trim();
								newTableName = node_position.trim().replace(/ /g,"_");

								// Check if the Table name is changed from old value
								if(oldTableName == newTableName) { 
									return;
								}

								tree.set_text(node, newTableName);
								renameSql = "ALTER TABLE " + oldTableName + " RENAME TO " + newTableName;
								
							} else if(node.type == "column"){
								tableName = tree.get_node(node.parent).li_attr["data-table-name"];
								columnType = node.li_attr["data-column-type"].trim();
								oldColumnName = node.li_attr["data-column-name"].trim();
								newColumnName = node_position.trim().replace(/ /g,"_");
								
								// Check if the column name is changed from old value
								if(oldColumnName == newColumnName) { 
									return;
								}

								tree.set_text(node, newColumnName);

								if(jsTargetServerType == "'Redshift'"){
								
									renameSql = "ALTER TABLE " + tableName 
									+ " RENAME COLUMN " + oldColumnName + " TO " + newColumnName;

								} else if(jsTargetServerType == "'Hive'"){
									
									// HDFS to Hive Column mapping !!
									// TODO Need to add other types
									// TODO make this conversion global ?!
									
									var hiveColumnTypes = {
											"text": "String",
											"BIGINT": "BIGINT",
											"BOOLEAN": "BOOLEAN",
											"DECIMAL": "DECIMAL",
											"FLOAT": "FLOAT",
											"SMALLINT": "SMALLINT",
											"DATE": "DATE",									
											"TIMESTAMP": "TIMESTAMP",									
											"STRING": "STRING"
									}
									
									renameSql = "ALTER TABLE " + tableName + " CHANGE " 
													+ oldColumnName + " " + newColumnName + " "
													+ hiveColumnTypes[columnType];
								
								}

							} else {
								// safe side, Database rename is already blocked, anyways!!
								return;
							}
							
							if(jsTargetServerType == "'Redshift'"){
								
								var redshiftQuery = $.postJSON( "/Syra-1.0.0-BUILD-SNAPSHOT/QueryOnRedshift",{
									"hiveThriftServer": "",
									"s3AccessKey": "",
									"s3SecreteKey": "",
									"hiveTableName": "",
									"hiveTableSchema": "",
									"hiveTableDataLocation": "",
									"redshiftDBURL": $("input[name=redshiftDBURL]").val(),
									"redshiftUser": $("input[name=redshiftUser]").val(),
									"redshiftPassword": $("input[name=redshiftPassword]").val(),
									"seperator": "",
									"tmpDir": "",
									"redShiftQuery": renameSql
								}, function(data){
									if(node.type == "table"){
										$("#"+node.id).attr("data-table-name",newTableName);
										FormWizard.loadRedshiftTree();
										toastr["info"]("Table rename - " + data[""], newTableName);
									}else if(node.type == "column"){
										$("#"+node.id).attr("data-column-name", newColumnName);
										FormWizard.loadRedshiftTree();
										toastr["info"]("Column rename - " + data[""], newColumnName);
									}
								});

							} else if(jsTargetServerType == "'Hive'"){
								
								var hiveQuery = $.postJSON( "/Syra-1.0.0-BUILD-SNAPSHOT/QueryOnHive",{
									"srcConnectionStr": "",
								    "destConnectionStr": $("input[name=hiveThriftServer2]").val(),
								    "srcUserName": "",
								    "destUserName": "",
								    "srcInputPath": "",
								    "srcTableName": "",
								    "destTableName": "",
								    "srcSchema": "",
								    "destSchema": renameSql,
								    "srcSeperator": "",
								    "destSeperator": "",
									"s3AccessKey": $("input[name=s3AccessKey]").val(),
									"s3SecreteKey": $("input[name=s3SecreteKey]").val(),
								    "tmpDir": "",
								    "srcDataLocation": "",
								    "destDataLocation": ""
								}, function(data){
									if(node.type == "table"){
										$("#"+node.id).attr("data-table-name",newTableName);
										
										FormWizard.loadHiveTree("#tree_destination");
										
										toastr["info"]("Table rename - " + data[""], newTableName);
									}else if(node.type == "column"){
										$("#"+node.id).attr("data-column-name", newColumnName);
										
										FormWizard.loadHiveTree("#tree_destination");
										
										toastr["info"]("Column rename - " + "success", newColumnName);
									}
								});
								
							}
						}
					}
					
					return true;
				}				
            },
			"dnd" : {
				"is_draggable" : function(node) {
					return false;
				}
			},
			"contextmenu" : {
				"items" : function(node) {
					
					// Return nothing if Tree failed to load
					if(node.type == "default"){
						return false;
					}
				
					var tree = $("#tree_destination").jstree(true);
					// The default set of all items
					var items = {
						"Create": {
							"separator_before": false,
							"separator_after": false,
							"label": "Create",
							"action": function (obj) {
								// Create node
								
								// Set Node type depending on parent!!
								if(node.type == "database"){
									// No changes on Table node creation
									var newNode = tree.create_node(node);
									
									tree.set_type(newNode, "table");
									
									// Edit node so user can enter text!!
									tree.edit(newNode);												

								} else if(node.type == "table"){
									// Column type selection
									
									var jsServerType = $(".btn-server-type.active").attr("btn-radio");
									var jsTargetServerType = $(".btn-target-server-type.active").attr("btn-radio");

									var colTypes; 
									
									var redshiftColTypes = '<form id="columnForm" action="">\
											<div class="form-group">\
											<label class="control-label col-sm-3">Column Type <span class="required">\
												* </span></label>\
											<div class="col-sm-9">\
												<select class="form-control input-large" name="columnType" id="columnType" required >\
													<option value="BIGINT">BIGINT</option>\
													<option value="BOOLEAN">BOOLEAN</option>\
													<option value="CHAR">CHAR</option>\
													<option value="DECIMAL">DECIMAL</option>\
													<option value="FLOAT">FLOAT</option>\
													<option value="INTEGER">INTEGER</option>\
													<option value="REAL">REAL</option>\
													<option value="SMALLINT">SMALLINT</option>\
													<option value="DATE">DATE</option>\
													<option value="TIMESTAMP">TIMESTAMP</option>\
													<option value="VARCHAR" selected>VARCHAR</option>\
												</select>\
												<span class="help-block">\
												Please select the Column type for this new Column.</span>\
											</div>\
										</div>\
									</form>';
									
									var hiveColTypes = '<form id="columnForm" action="">\
											<div class="form-group">\
											<label class="control-label col-sm-3">Column Type <span class="required">\
												* </span></label>\
											<div class="col-sm-9">\
												<select class="form-control input-large" name="columnType" id="columnType" required >\
													<option value="BIGINT">BIGINT</option>\
													<option value="BOOLEAN">BOOLEAN</option>\
													<option value="DECIMAL">DECIMAL</option>\
													<option value="FLOAT">FLOAT</option>\
													<option value="SMALLINT">SMALLINT</option>\
													<option value="DATE">DATE</option>\
													<option value="TIMESTAMP">TIMESTAMP</option>\
													<option value="STRING" selected>STRING</option>\
												</select>\
												<span class="help-block">\
												Please select the Column type for this new Column.</span>\
											</div>\
										</div>\
									</form>';
									
									if(jsTargetServerType == "'Redshift'"){
										colTypes = redshiftColTypes;
									} else if(jsTargetServerType == "'Hive'"){
										colTypes = hiveColTypes;
									}

									bootbox.confirm(colTypes, function(result) {
											if(result){
												var columnType = $("#columnType").val();
												
												setTimeout(function(){
													// Create column type node													
													var newNode = tree.create_node(node);
													
													tree.set_type(newNode, "column");

													// Set Column type
													tree.get_node(newNode).li_attr["data-column-type"] = columnType;														
													
													// Edit node so user can enter text!!
													tree.edit(newNode);
												}, 500);
											}
									});								
								}								
							}
						},
						"Rename": {
							"separator_before": false,
							"separator_after": false,
							"label": "Rename",
							"action": function (obj) {
								tree.edit(node);
							}
						},                         
						"Delete": {
							"separator_before": false,
							"separator_after": false,
							"label": "Delete",
							"action": function (obj) {						
								if(node.type == "table"){
									var tableName = node.li_attr["data-table-name"];
									var tableNameNew = node.li_attr["data-new-object"];
									
									bootbox.confirm("Are you sure you want to 'Delete' the table - '" + tableName + "' ?", function(result) {
										if(result){
											if(!tableNameNew){
												var jsServerType = $(".btn-server-type.active").attr("btn-radio");
												var jsTargetServerType = $(".btn-target-server-type.active").attr("btn-radio");
												
												if(jsTargetServerType == "'Redshift'"){
													var redshiftDropTable = $.postJSON( "/Syra-1.0.0-BUILD-SNAPSHOT/RedshiftDropTable",{
														"hiveThriftServer": $("input[name=hiveThriftServer]").val(),
														"s3AccessKey": $("input[name=s3AccessKey]").val(),
														"s3SecreteKey": $("input[name=s3SecreteKey]").val(),
														"hiveTableName": "",
														"hiveTableSchema": "",
														"hiveTableDataLocation": "",
														"redshiftDBURL": $("input[name=redshiftDBURL]").val(),
														"redshiftUser": $("input[name=redshiftUser]").val(),
														"redshiftPassword": $("input[name=redshiftPassword]").val(),
														"seperator": "",
														"tmpDir": "",
														"redShiftQuery": "drop table " + tableName
													}, function(data){
														toastr["info"]("Redshift Drop table - " + data[""], tableName);
														
														// Delete Tree Node on the UI
														tree.delete_node(node);
													});
												
												} else if(jsTargetServerType == "'Hive'"){
													var hiveQuery = $.postJSON( "/Syra-1.0.0-BUILD-SNAPSHOT/QueryOnHive",{
														"srcConnectionStr": "",
													    "destConnectionStr": $("input[name=hiveThriftServer2]").val(),
													    "srcUserName": "",
													    "destUserName": "",
													    "srcInputPath": "",
													    "srcTableName": "",
													    "destTableName": "",
													    "srcSchema": "",
													    "destSchema": "drop table " + tableName,
													    "srcSeperator": "",
													    "destSeperator": "",
														"s3AccessKey": $("input[name=s3AccessKey]").val(),
														"s3SecreteKey": $("input[name=s3SecreteKey]").val(),
													    "tmpDir": "",
													    "srcDataLocation": "",
													    "destDataLocation": ""
													}, function(data){
														toastr["info"]("Hive Drop table - " + data[""], tableName);
														
														// Delete Tree Node on the UI
														tree.delete_node(node);
													});
												}
													
											} else {
												// Just delete Tree Node on the UI and hide the Save button !!
												tree.delete_node(node);
												$("#btnSaveTree").addClass("hide");
											}
										}
									});
								} else if(node.type == "column"){
									var tableNode = tree.get_node(node.parent);
									
									var tableName = tableNode.li_attr["data-table-name"];
									var tableNameNew = tableNode.li_attr["data-new-object"];
									
									if(!tableNameNew){
										var columnName = node.li_attr["data-column-name"];
										
										bootbox.confirm("Are you sure you want to 'Delete' the column - '" + columnName + "' ?", function(result) {
										   if(result){
												var jsServerType = $(".btn-server-type.active").attr("btn-radio");
												var jsTargetServerType = $(".btn-target-server-type.active").attr("btn-radio");
												   
												if(jsTargetServerType == "'Redshift'"){

													var columnSchema = "ALTER TABLE " + tableName + " DROP COLUMN " + columnName + ";";

													var redshiftDropTable = $.postJSON( "/Syra-1.0.0-BUILD-SNAPSHOT/QueryOnRedshift",{
													"hiveThriftServer": "",
													"s3AccessKey": "",
													"s3SecreteKey": "",
													"hiveTableName": "",
													"hiveTableSchema": "",
													"hiveTableDataLocation": "",
													"redshiftDBURL": $("input[name=redshiftDBURL]").val(),
													"redshiftUser": $("input[name=redshiftUser]").val(),
													"redshiftPassword": $("input[name=redshiftPassword]").val(),
													"seperator": "",
													"tmpDir": "",
													"redShiftQuery": columnSchema
													}, function(data){
														toastr["info"]("Redshift Drop column - " + data[""], tableName + "." + columnName);
													
														// Delete Tree Node on the UI
														tree.delete_node(node);
													});
												
												} else if(jsTargetServerType == "'Hive'"){
													
													// Need to prepare the whole Column schema For HiveQL
													// Leaving out the column being deleted, scary!!
													// TODO - make this column schema creation global, used in form-wizard2.js
													
													var tableColumns = "";

													for (var child in tableNode.children_d) {
														var column = tree.get_node(tableNode.children_d[child]);
														// Skip the column being deleted
														if(column.li_attr["data-column-name"] == columnName){
															continue;
														}
														
														if(tableColumns!=""){
															tableColumns += ",";
														}
														tableColumns += column.li_attr["data-column-name"];
														
														if(jsTargetServerType == "'Redshift'"){
															
															tableColumns += " " + column.li_attr["data-column-type"];
															
														} else if(jsTargetServerType == "'Hive'"){
															
															// HDFS to Hive Column mapping !!
															// TODO Need to add other types
															
															var hiveColumnTypes = {
																	"text": "String",
																	"BIGINT": "BIGINT",
																	"BOOLEAN": "BOOLEAN",
																	"DECIMAL": "DECIMAL",
																	"FLOAT": "FLOAT",
																	"SMALLINT": "SMALLINT",
																	"DATE": "DATE",									
																	"TIMESTAMP": "TIMESTAMP",									
																	"STRING": "STRING"
															}
															
															tableColumns += " " + hiveColumnTypes[column.li_attr["data-column-type"]];
														}
													}													
												
													var columnSchema = "ALTER TABLE " + tableName + " REPLACE COLUMNS (" + tableColumns + ")";

													var hiveQuery = $.postJSON( "/Syra-1.0.0-BUILD-SNAPSHOT/QueryOnHive",{
													"srcConnectionStr": "",
													"destConnectionStr": $("input[name=hiveThriftServer2]").val(),
													"srcUserName": "",
													"destUserName": "",
													"srcInputPath": "",
													"srcTableName": "",
													"destTableName": "",
													"srcSchema": "",
													// TODO - Drop column syntax Not working on Hive
													"destSchema": columnSchema,
													"srcSeperator": "",
													"destSeperator": "",
													"s3AccessKey": $("input[name=s3AccessKey]").val(),
													"s3SecreteKey": $("input[name=s3SecreteKey]").val(),
													"tmpDir": "",
													"srcDataLocation": "",
													"destDataLocation": ""
													}, function(data){
														toastr["info"]("Hive  Drop column - " + "success", tableName + "." + columnName);
												
														// Delete Tree Node on the UI
														tree.delete_node(node);
													});
												}
											}
										});
									} else {
										// Just delete Tree Node on the UI
										tree.delete_node(node);
									}
								}
							}
						},
						"RemoveMapping": {
							"separator_before": true,
							"separator_after": false,
							"label": "Remove Mapping",
							"action": function (obj) {
							
								jsPlumb.detach(jsPlumb.getConnections({target: node.id + "_anchor"})[0]);
							
							}
						}
					};
					
					// Check if Column has any mapping, otherwise remove the cmenu item
					if(jsPlumb.getConnections({target: node.id + "_anchor"}).length==0){
						delete items.RemoveMapping;
					}

					// Remove create if it's a column OR already a table being created!!
					// Except the Table getting created !!!
					if (node.type == "column"){
						delete items.Create;
					}
					if (!$("#btnSaveTree").hasClass("hide")
							&& typeof node.li_attr["data-new-object"] == "undefined") {
						delete items.Create;
					}
					
					if (node.type == "database") {
						// Delete the "delete" menu item
						delete items.Rename;
						delete items.Delete;
					}

					return items;				
				}
			},			
            "types" : {
                "default" : {
                    "icon" : "fa fa-folder icon-state-warning icon-lg"
                },
                "database" : {
                    "icon" : "fa fa-database icon-lg"
                },
                "table" : {
                    "icon" : "fa fa-table icon-lg"
                },
                "column" : {
                    "icon" : "fa fa-square-o icon-lg"
                }
            },
            "state" : { "key" : "destinationTreeKey" },
            "plugins" : [ "dnd", "types", "contextmenu" ]
		});
	}

    return {
        //main function to initiate the module
        init: function () {
			$.jstree.plugins.nohover = function () { this.hover_node = jQuery.noop; };
			$.jstree.plugins.noselect = function () { this.select_node = jQuery.noop; };
		  
            ajaxSourceTree();
            ajaxDestinationTree();
		
        }

    };

}();