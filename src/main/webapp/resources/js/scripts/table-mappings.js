var mappingTable;
var scheduleTable;
var schedulerLogTable;

var TableMappings = function () {
	 
    var initTable = function () {

        var table = $('#tableMappings');
        
        // Find the target table name based on various source/target types
        var targetTableName = function(targetConnectionType, mappings){
			// Check if it's an empty array !!
			if(!mappings){
				return "-";
			}

			// Continue as normal case
			if(targetConnectionType == "Redshift"){
				if(mappings.destTableName){
					return mappings.destTableName;
				} else if(mappings.hiveTableName){
					return mappings.hiveTableName;
				} else {
					return mappings.tableName;
				}
			} else if(targetConnectionType == "Hive"){
				if(mappings.destTableName){
					return mappings.destTableName;
				}	
			}
			
			return "";
        }
        
        // Format the values in case of multiple mappings are selected by the user
        var concatValues = function(mappingsArray, key, targetConnectionType){
        	if(mappingsArray.length == 1){
        		if(!targetConnectionType){
        			return mappingsArray[0][key];
        		} else {
        			return targetTableName(targetConnectionType, mappingsArray[0]);        			
        		}
        	} else {
        		var value = "";
        		
	        	for(var index in mappingsArray){
	        		if(index > 0){
	        			value += " | "
	        		}
	        		
	        		if(!targetConnectionType){
	        			value += mappingsArray[index][key];
	        		} else {
	        			value += targetTableName(targetConnectionType, mappingsArray[index]);        			
	        		}
	        	}
	        	
	        	return value;
        	}
        	
        	return "";
        }

		/* Formatting function for row details - Mapping details */
		var format = function ( d ) {
			// `d` is the original data object for the row			
			var mappingsArray = JSON.parse(d.mappings);
			var mappings = mappingsArray[0];
						
			var detailsRow = '';
			
			// Check if it's an empty array !!
			if(!mappings){
				return "Sorry, no data could be fetched for this mapping.";
			}
			
			// Continue as normal case			
			if(d.sourceConnectionType == "Hive" && d.targetConnectionType == "Redshift"){
				detailsRow = '<table class="detailsRow">'+
					'<th colspan="2">Source</th>'+
					'<tr>'+
						'<td>Hive Thrift Server: </td>'+
						'<td>'+mappings.hiveThriftServer+'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>Hive Table Data Location: </td>'+
						'<td>'+concatValues(mappingsArray, "hiveTableDataLocation")+'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>Hive Table: </td>'+
						'<td>'+concatValues(mappingsArray, "hiveTableName")+'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>Separator: </td>'+
						'<td>'+concatValues(mappingsArray, "seperator")+'</td>'+
					'</tr>'+
				'</table>';
			} else if(d.sourceConnectionType == "Hive" && d.targetConnectionType == "Hive"){
				detailsRow = '<table class="detailsRow">'+
					'<th colspan="2">Source</th>'+
					'<tr>'+
						'<td>Hive Thrift Server: </td>'+
						'<td>'+mappings.srcConnectionStr+'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>Hive Table Data Location: </td>'+
						'<td>'+concatValues(mappingsArray, "srcDataLocation")+'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>Hive Table: </td>'+
						'<td>'+concatValues(mappingsArray, "srcTableName")+'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>Separator: </td>'+
						'<td>'+concatValues(mappingsArray, "srcSeperator")+'</td>'+
					'</tr>'+
				'</table>';
			} else if(d.sourceConnectionType == "HDFS" && d.targetConnectionType == "Redshift"){
				detailsRow = '<table class="detailsRow">'+
					'<th colspan="2">Source</th>'+
					'<tr>'+
						'<td>HDFS Connection String: </td>'+
						'<td>'+mappings.hdfsFileName+'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>HDFS Path: </td>'+
						'<td>'+mappings.hdfs+'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>HDFS Access User: </td>'+
						'<td>'+mappings.hdfsAccessUser+'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>Separator: </td>'+
						'<td>'+mappings.seperator+'</td>'+
					'</tr>'+
				'</table>';
			} else if(d.sourceConnectionType == "Local" && d.targetConnectionType == "Redshift"){
				detailsRow = '<table class="detailsRow">'+
					'<th colspan="2">Source</th>'+
					'<tr>'+
						'<td>S3 File Path: </td>'+
						'<td>'+mappings.localS3FilePath+'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>Separator: </td>'+
						'<td>'+mappings.seperator+'</td>'+
					'</tr>'+
				'</table>';
			}
			
			// TODO - what if Target other than Redshift?
			if(d.targetConnectionType == "Redshift"){
				detailsRow = detailsRow + 
					'<table class="detailsRow">'+
						'<th colspan="2">Target</th>'+
						'<tr>'+
							'<td>Redshift DB URL: </td>'+
							'<td>'+mappings.redshiftDBURL+'</td>'+
						'</tr>'+
						'<tr>'+
							'<td>Redshift User: </td>'+
							'<td>'+mappings.redshiftUser+'</td>'+
						'</tr>'+
						'<tr>'+
							'<td>Redshift Password: </td>'+
							'<td>*****</td>'+
						'</tr>'+
						'<tr>'+
							'<td>S3 Access Key: </td>'+
							'<td>'+mappings.s3AccessKey+'</td>'+
						'</tr>'+
						'<tr>'+
							'<td>S3 Secret Key: </td>'+
							'<td>*****</td>'+
						'</tr>'+
						'<tr>'+
							'<td>HDFS Temp Directory: </td>'+
							'<td>'+mappings.tmpDir+'</td>'+
						'</tr>'+
						'<tr>'+
							'<td>Redshift Table: </td>'+
							'<td>'+concatValues(mappingsArray, "targetTable", "Redshift")+'</td>'+
						'</tr>'+
					'</table>';
			} else if(d.targetConnectionType == "Hive"){
				detailsRow = detailsRow +
					'<table class="detailsRow">'+
						'<th colspan="2">Target</th>'+
						'<tr>'+
							'<td>Hive Thrift Server: </td>'+
							'<td>'+mappings.destConnectionStr+'</td>'+
						'</tr>'+
						'<tr>'+
							'<td>Hive Table Data Location: </td>'+
							'<td>'+concatValues(mappingsArray, "destDataLocation")+'</td>'+
						'</tr>'+
						'<tr>'+
							'<td>Hive Table: </td>'+
							'<td>'+concatValues(mappingsArray, "destTableName")+'</td>'+
						'</tr>'+
						'<tr>'+
							'<td>Separator: </td>'+
							'<td>'+concatValues(mappingsArray, "destSeperator")+'</td>'+
						'</tr>'+
				'</table>';
			}
			
			return detailsRow;
		};
		
        /* Fixed header extension: http://datatables.net/extensions/keytable/ */
		
        oMappingTable = table.dataTable({

            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "No data available in table",
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "No entries found",
                "infoFiltered": "(filtered from _MAX_ total entries)",
                "lengthMenu": "Show _MENU_ entries",
                "search": "Search:",
                "zeroRecords": "No matching records found"
            },
			
			stateSave: false,
			
			ajax: {
				url: "/Syra/mappingsview/",
				type: 'GET',
				"dataSrc": "mappingsViews"
				
			},
			columns: [
				{
					className: "details-control",
					orderable : false,
					data: null,
					defaultContent: '<i class="fa fa-plus-square-o" />'
				},
				{ data: "mappingName", className: "font-green-seagreen" },
				{ data: "folderName", className: "font-green-seagreen" },
				{ data: "sourceConnectionType", className: "font-green-seagreen" },
				{ data: "sourceConnectionName", className: "font-green-seagreen" },
				{ data: "targetConnectionType", className: "font-green-seagreen" },
				{ data: "targetConnectionName", className: "font-green-seagreen" },
				{ data: null, className: "font-green-seagreen", defaultContent: '' },
				{
					data: null,
					className: "center font-green-seagreen",
					defaultContent: '<a class="btn default btn-xs run purple" href="javascript:;"><i class="fa fa-play"></i>Run</a>' +
					' <a class="btn default btn-xs delete red" href="javascript:;"><i class="fa fa-trash"></i>Delete</a>' +
					' <a class="btn default btn-xs schedule blue" href="javascript:;"><i class="fa fa-calendar"></i>Schedule</a>' + 
					' <a class="btn default btn-xs list green" href="javascript:;"><i class="fa fa-calendar"></i>List Schedules</a>'
				},
				{ data: "folderId", className: "font-green-seagreen" },
			],
			"fnCreatedRow": function( nRow, aData, iDataIndex ) {
				$(nRow).attr("id","mapping-" + aData.id);
			},
            "order": [
                [1, 'asc']
            ],
            "lengthMenu": [
                [5, 10, 15, 20, -1],
                [5, 10, 15, 20, "All"] // change per page values here
            ],
            "pageLength": 5, // set the initial value,
            "columnDefs": [{  // set default column settings
                'orderable': false,
                'searchable': false,
				'width': '375px',
                'targets': [8]
            },{
				// Dynamically setup URL column based on Server type !!

                // The `data` parameter refers to the data for the cell (defined by the
                // `data` option, which defaults to the column being worked with, in
                // this case `data: 0`.
                "render": function ( data, type, row ) {
					var mappingsArray = JSON.parse(row.mappings);
					
					// Check if it's an array
					// New mappings will be always array
					if(mappingsArray.length > 1){
						return "Multiple mappings";
					}

					var mappings = mappingsArray[0];
					
					return targetTableName(row.targetConnectionType, mappings);
					
                },
                "targets": 7
            },
            {
                "targets": [ 9 ],
                "visible": false
            }]
        });

		// No Column reordering is needed
        // var oTableColReorder = new $.fn.dataTable.ColReorder( oTable );

        var tableWrapper = $('#tableMappings_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper
        tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        var tableColumnToggler = $('#mappings_column_toggler');
		
		mappingTable = oMappingTable.DataTable();
		
		// Add event listener for opening and closing details
		$('#tableMappings tbody').on('click', 'td.details-control', function () {
			var tr = $(this).closest('tr');
			var icon = $(this).children('i');
			var row = mappingTable.row( tr );
	 
			if ( row.child.isShown() ) {
				// This row is already open - close it
				row.child.hide();
				tr.removeClass('shown');
				icon.addClass("fa-plus-square-o").removeClass("fa-minus-square-o");
			}
			else {
				// Open this row
				row.child( format(row.data()) ).show();
				tr.addClass('shown');
				icon.addClass("fa-minus-square-o").removeClass("fa-plus-square-o");
			}
		});

		mappingTable.columns().eq(0).each( function ( index ) {
			var that = mappingTable.columns( index );
			
			if(!that.visible()[0]){
				var check = $('input[type="checkbox"][data-column="'+ index + '"]', tableColumnToggler);
				check.prop("checked",false);
				check.parent().removeClass("checked");
			}
		});
		
        /* handle show/hide columns*/
        $('input[type="checkbox"]', tableColumnToggler).change(function () {
            /* Get the DataTables object again - this is not a recreation, just a get of the object */
            var iCol = parseInt($(this).attr("data-column"));
            var bVis = oMappingTable.fnSettings().aoColumns[iCol].bVisible;
            oMappingTable.fnSetColumnVis(iCol, (bVis ? false : true));
        });
    }

    var initScheduleTable = function () {

        var table = $('#tableScheduleList');

        oScheduleTable = table.dataTable({

            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "No data available in table",
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "No entries found",
                "infoFiltered": "(filtered from _MAX_ total entries)",
                "lengthMenu": "Show _MENU_ entries",
                "search": "Search:",
                "zeroRecords": "No matching records found"
            },
			
			ajax: {
				url: "/Syra/schedule/",
				type: 'GET',
				"dataSrc": "schedules",
				data: function ( d ) { return $('#ajaxJobForm').serialize(); }
			},
			columns: [
				{ data: "triggerName", className: "font-green-seagreen" },
				{ data: "cron", className: "font-green-seagreen" },
				{ data: "cronEx", className: "font-green-seagreen" },
				{ data: "startAtEx", className: "font-green-seagreen" },
				{ data: "endAtEx", className: "font-green-seagreen" },
				{ data: "", className: "font-green-seagreen" },
				{ data: "triggerState", className: "font-green-seagreen" },
				{
					data: null,
					className: "center font-green-seagreen",
					defaultContent: '<a class="btn default btn-xs pauseSchedule" href="javascript:;"><i class="fa fa-pause"></i>Pause</a> <a class="btn default btn-xs purple resumeSchedule" href="javascript:;"><i class="fa fa-play"></i>Resume</a> <a class="btn default btn-xs green showlogSchedule" href="javascript:;"><i class="fa fa-file-text-o"></i>Log</a> <a class="btn default btn-xs deleteSchedule red" href="javascript:;"><i class="fa fa-trash"></i>Delete</a> '
				}
			],
			"fnCreatedRow": function( nRow, aData, iDataIndex ) {
				var $that = $(nRow);
				$that.attr("id","schedule-" + aData.triggerName);
				
				if(aData.triggerState.contains("PAUSED")){
					$that.find(".pauseSchedule").hide();
				} else {
					$that.find(".resumeSchedule").hide();
				}
			},
            "order": [
                [0, 'asc']
            ],
            "lengthMenu": [
                [5, 10, 15, 20, -1],
                [5, 10, 15, 20, "All"] // change per page values here
            ],
            "pageLength": 5, // set the initial value,
            "columnDefs": [{  // set default column settings
                'orderable': false,
                'searchable': false,
				'width': '250px',
                'targets': [7]
            },{
				// Dynamically setup URL column based on Server type !!

                // The `data` parameter refers to the data for the cell (defined by the
                // `data` option, which defaults to the column being worked with, in
                // this case `data: 0`.
                "render": function ( data, type, row ) {
                    return data.substr(0,data.lastIndexOf(":::"));
                },
                "targets": [0]
            },{
                "render": function ( data, type, row ) {
					if(row.jobDataEx && JSON.parse(row.jobDataEx).wfParent){
						return "";
					} else {
						return data;
					}
                },
                "targets": [1,3]
            },{
                "render": function ( data, type, row ) {
					if(row.jobDataEx && JSON.parse(row.jobDataEx).wfParent){
						var d = JSON.parse(row.jobDataEx).wfParent;
						
						return "After " + d.substr(0,d.lastIndexOf(":::"));
					} else {
						return data;
					}
                },
                "targets": [2]
            },{
                "render": function ( data, type, row ) {
					if(row.jobDataEx && JSON.parse(row.jobDataEx).triggerPrecheckFile){
						return JSON.parse(row.jobDataEx).triggerPrecheckFile;
					} else {
						return "";
					}
                },
                "targets": [5]
            }]
        });

		// No Column reordering is needed
        // var oTableColReorder = new $.fn.dataTable.ColReorder( oTable );

        var tableWrapper = $('#tableScheduleList_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper
        tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
		
		scheduleTable = oScheduleTable.DataTable();
    }	

    var initSchedulerLogTable = function () {
	
        var table = $('#tableSchedulerLogList');
		$.fn.dataTable.moment( 'DD MMMM YYYY HH:mm Z' );

        oSchedulerLogTable = table.dataTable({

            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "No data available in table",
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "No entries found",
                "infoFiltered": "(filtered from _MAX_ total entries)",
                "lengthMenu": "Show _MENU_ entries",
                "search": "Search:",
                "zeroRecords": "No matching records found"
            },
			
			ajax: {
				url: "/Syra/schedulerlog/",
				type: 'GET',
				"dataSrc": "schedulerLogs",
				data: function ( d ) { return $('#ajaxJobFormSchedulerLog').serialize(); }
			},
			columns: [
				{ data: "timestmpEx", className: "font-green-seagreen" },
				{ data: "triggerName", className: "font-green-seagreen" },
				{ data: "levelString", className: "font-green-seagreen" },
				{ data: "startMsg", className: "font-green-seagreen" },
				{ data: "resultMsg", className: "font-green-seagreen" }
			],
			"fnCreatedRow": function( nRow, aData, iDataIndex ) {
				$(nRow).attr("id","schedulerlog-" + aData.triggerName);
			},
            "order": [
                [0, 'desc']
            ],
            "lengthMenu": [
                [5, 10, 15, 20, -1],
                [5, 10, 15, 20, "All"] // change per page values here
            ],
            "pageLength": 5, // set the initial value,
            "columnDefs": [ {
				// Dynamically setup URL column based on Server type !!

                // The `data` parameter refers to the data for the cell (defined by the
                // `data` option, which defaults to the column being worked with, in
                // this case `data: 0`.
                "render": function ( data, type, row ) {
                	//fix for data null error
                	if(data===null){
                		return data;
                	}
                	else if(data.indexOf(":::")!=-1){
						return data.substr(0,data.lastIndexOf(":::"));
					} else {
						return data;
					}
                },
                "targets": [1,3]
            },{
				"width": "300px",
                "targets": [3,4]				
			}]
        });

		// No Column reordering is needed
        // var oTableColReorder = new $.fn.dataTable.ColReorder( oTable );

        var tableWrapper = $('#tableSchedulerLogList_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper
        tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
				
		schedulerLogTable = oSchedulerLogTable.DataTable();
    }	

     var ajaxFoldersTree = function(FolderService, stateFlag) {
	 	
		$.ajax({
		  url: "/Syra/folder"
		})
		.done(function( data ) {
			var folders = [];
			
			var root = {
						"id": -1,
						"parent": "#",
						"text": "Syra", 
						"state": {
							"opened" : true,
							"disabled" : false,
							"selected" : true
						}
			};
			
			folders = data.folders;
			
			// Add root on the server response !!
			folders.unshift(root);
			
			// Don't need state plug-in on the Migration wizard !!
			var pluginsArr;
			
			if(stateFlag){
				pluginsArr = [ "state", "types", "contextmenu" ];
			} else{
				pluginsArr = [ "types", "contextmenu" ];
			}
								
			$("#tree_folders").jstree({
				"core" : {
					"themes" : {
						"responsive": false,
					}, 
					// so that create works
					"check_callback" : true,
					"multiple" : false,	
					'data' : ["Default"],
					'check_callback' : function (operation, node, node_parent, node_position, more) {
						// operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
						// in case of 'rename_node' node_position is filled with the new node name
												
						if (operation == 'rename_node') {
							var tree = $("#tree_folders").jstree(true);
							var folderName = node_position.trim();
														
							var flagNewNode = false;
							
							// jsTree new nodes are alphanumeric, >0 returns false !!
							if(!(node.id > 0)){
								flagNewNode = true;
							}
							
							if(!flagNewNode && folderName == node.text){
								return false;
							}
							
							var folders = [{
								id: flagNewNode ? null : node.id,
								parentId: node.parent,
								folderName: folderName
							}];
							
							var savedFolder = FolderService.saveFolders(folders).then(function (data) {
								if(flagNewNode){
									toastr["success"]("<b>A new Folder - <b>" + folderName + "</b> successfully created !!</b><br />", 
										"New Folder created successfully!!");

									// Set the node id to mark it's created							
									tree.set_id(node, data[0].id);										
								} else {
									toastr["success"]("<b>Folder - <b>" + folderName + "</b> renamed successfully !!</b><br />", 
										"Folder renamed successfully!!");								
								}
							},
							function (errorMessage) {
								toastr["error"](errorMessage, "Error");
							});							
						}
						
						return true;
					},
				  'data' : folders
				},		
				"types" : {
					"default" : {
						"icon" : "fa fa-folder icon-state-warning icon-lg"
					}
				},
				"contextmenu" : {
					"items" : function(node) {
					
						var tree = $("#tree_folders").jstree(true);
						// The default set of all items
						var items = {
							"Create": {
								"separator_before": false,
								"separator_after": false,
								"label": "Create",
								"action": function (obj) {
									// Create node
									var newNode = tree.create_node(node);
									
									// Edit node so user can enter text!!
									tree.edit(newNode);
								}
							},
							"Rename": {
								"separator_before": false,
								"separator_after": false,
								"label": "Rename",
								"action": function (obj) {
									tree.edit(node);
								}
							}
						};
											
						if (node.id == "-1") {
							// Delete the "rename" menu item
							delete items.Rename;
						}

						return items;				
					}
				},			
				"state" : { "key" : "folders" },
				"plugins" : pluginsArr
			});	

			setTimeout(function(){
				var ref = $('#tree_folders').jstree(true);
				/*var node = ref.get_node(ref.get_selected());
				$("#folderName").text(node.text);*/
			}, 0);
		});
    }
	
    return {

        //main function to initiate the module
        init: function () {
            if (!jQuery().dataTable) {
                return;
            }

            	initTable();
    			initScheduleTable();
    			initSchedulerLogTable();            	
       	
        },
		initFolders: function(FolderService, stateFlag){
			ajaxFoldersTree(FolderService, stateFlag);
		}

    };

}();