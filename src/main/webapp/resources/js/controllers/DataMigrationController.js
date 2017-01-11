'use strict';

var btnServerType;

/* Setup general page controller */
MetronicApp.controller('DataMigrationController', ['$rootScope', '$scope', 'settings', '$http', '$timeout', 'MappingService', 'FolderService','$stateParams','ConnectionService',
						function($rootScope, $scope, settings, $http, $timeout, MappingService, FolderService,$stateParams,ConnectionService) {
   var id=$stateParams.id;
  
   
	$scope.$on('$viewContentLoaded', function() {   
    	// initialize core components
    	Metronic.initAjax();
		
		Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_migrate')); // set profile link active in sidebar menu
		
		// set sidebar closed and body solid layout mode
		$rootScope.settings.layout.pageAutoScrollOnLoad = 1500;
		$rootScope.settings.layout.pageSidebarClosed = true;

		/* SETUP FOLDERS TREE POPOVER NO STATE ?!! */
		TableMappings.initFolders(FolderService, false);		

		$scope.connectionType = "Hive";		
		$scope.serverType = "Hive";
		$scope.targetServerType = "Redshift";
		
		$scope.sourceSelected = "NO";
		$scope.targetSelected = "NO";
		btnServerType = $(".btn-server-type");
		
		$(".btn-source-conn").on('click',function(){
			$("#myModal_source_connections").modal();
		});

		$(".btn-target-conn").on('click',function(){
			$("#myModal_target_connections").modal();
		});
		
		$(".btn-target-conn").addClass("disabled");

		
		$('#tableSourceConnections tbody').on( 'click', '.use', function () {
			//var $tr = $(this).closest("tr");			
			//setupSelectedConnection($tr);
			$("#myModal_source_connections").modal('hide');
		});
		$('#tableTargetConnections tbody').on( 'click', '.use', function () {
			//var $tr = $(this).closest("tr");			
			//setupSelectedConnection($tr);
			$("#myModal_target_connections").modal('hide');
		});

		$('#tableSourceConnections tbody').on( 'click', 'tr', function () {
			setupSelectedSourceConnection($(this));
		});	

		$('#tableTargetConnections tbody').on( 'click', 'tr', function () {
			setupSelectedTargetConnection($(this));
		});
		
		$('#sourceConnId').change(function () {
			var row = $('#tableSourceConnections tr#conn-' + this.value);
			setupSelectedSourceConnection(row);			
		});		

		$('#targetConnId').change(function () {
			var row = $('#tableTargetConnections tr#conn-' + this.value);
			setupSelectedTargetConnection(row);			
		});		

		var setupSelectedSourceConnection = function($tr, connectionObj){
						
			var me = setInterval(function(){
				try{
					// Remove all existing connections
					jsPlumb.detachEveryConnection();

					clearInterval(me);
						if(connectionObj){
							setTimeout(function(){
								//set mapping tab directly
								$('#form_wizard_1').bootstrapWizard('next');
								$('#form_wizard_1').bootstrapWizard('next');
							},1000);
						}
					}catch(ex){
				}
			},1000);
						
			var row;
			var connection;
			
			if($tr){
				row = connSourceTable.row($tr);
				connection = row.data();
			}
			
			if(connectionObj){
				connection = connectionObj;
			}
			
			if(connection.connectionType == "Redshift"){
				toastr["warning"]("Sorry!! <b>Redshift</b> currently not support as Source..", "Coming soon..");
				return false;
			} else if(connection.connectionType == "Hive"){
				$("input[name='hiveThriftServer']").val(connection.hiveThriftServer);
			} else if(connection.connectionType == "HDFS"){
				$("input[name='hdfsConnectionString']").val(connection.hdfsConnectionString);
				$("input[name='hdfsPath']").val(connection.hdfsPath);
				$("input[name='hdfsAccessUser']").val(connection.hdfsAccessUser);
				$("input[name='hdfsFieldDelim']").val(connection.hdfsFieldDelim);
			} else if(connection.connectionType == "Local"){
				$("input[name='s3FileName']").val(connection.connectionName);
				$("input[name='s3FileUrl']").val(connection.s3FileUrl);
				if(connectionObj){
					$("input[name='s3FieldDelim']").val(connection.seperator);
				}
			}

			if($tr){
				connSourceTable.$('tr.selected').removeClass('selected');
				$tr.addClass('selected');
	
				connSourceTable.$('i').removeClass('fa-star').addClass("fa-star-o");
				$tr.find("i").removeClass("fa-star-o").addClass('fa-star');
			}
			
			$scope.serverType = connection.connectionType;
			
			$("#sourceConnId").val(connection.id)
			
			$timeout(function() {
				btnServerType.scope().$apply();
				$scope.sourceSelected = "YES";
				//Metronic.scrollTo(btnServerType);
			});		
		};
		
		$scope.$watch("sourceSelected", function(newValue, oldValue){
			$('#form_wizard_1').find('.button-next').hide();

			if(newValue == "YES"){
				$('#form_wizard_1').find('.button-next').show();
			}
		});

		$scope.$watch("targetSelected", function(newValue, oldValue){
			$('#form_wizard_1').find('.button-next').hide();

			if(newValue == "YES"){
				$('#form_wizard_1').find('.button-next').show();
			}
		});

		var setupSelectedTargetConnection = function($tr, connectionObj){
			var me = setInterval(function(){
				try{
					// Remove all existing connections
					jsPlumb.detachEveryConnection();

					clearInterval(me);
				  }catch(ex){
				}
			},1000);
		
			var row;
			var connection;
			
			if($tr){
				row = connTargetTable.row($tr);
				connection = row.data();
			}
			
			if(connectionObj){
				connection = connectionObj;
			}
	
			
			if(connection.connectionType != "Redshift" 
				&& connection.connectionType != "Hive"){
				
				toastr["warning"]("Sorry!! Only <b>Redshift</b> or <b>Hive</b> is currently support as a Target..", "Coming soon..");
				return false;
				
			} 
			
			if(connection.connectionType == "Redshift"){
				$("input[name='redshiftDBURL']").val(connection.redshiftDbUrl);
				$("input[name='redshiftUser']").val(connection.redshiftUser);
				$("input[name='redshiftPassword']").val(connection.redshiftPassword);
				$("input[name='s3AccessKey']").val(connection.s3AccessKey);
				$("input[name='s3SecreteKey']").val(connection.s3SecreteKey);
				$("input[name='hdfsTmpDir']").val(connection.hdfsTempDir);
			} else if(connection.connectionType == "Hive"){
				$("input[name='hiveThriftServer2']").val(connection.hiveThriftServer);
			}

			if($tr){
				connTargetTable.$('tr.selected').removeClass('selected');
				$tr.addClass('selected');
	
				connTargetTable.$('i').removeClass('fa-star').addClass("fa-star-o");
				$tr.find("i").removeClass("fa-star-o").addClass('fa-star');
			}
			
			$scope.targetServerType = connection.connectionType;
			
			$("#targetConnId").val(connection.id)
			
			$timeout(function() {
				$scope.targetSelected = "YES";
			});		
	
			//Metronic.scrollTo($("#redshiftTitle"));
		};
		
		//Edit mapping
		if(id){
		
			
			setTimeout(function(){					
				var targetCol=[];
				var sourceCol=[];
				$scope.tree_source=[];
				$scope.tree_target=[];
				$scope.sourceConn=[];
				$scope.targetConn=[];
				$scope.count=0;

				
						MappingService.searchMappings().then(function(response){
						var mappingsData=response.mappings;
						var map= mappingsData.find(function(data) {
							 if (data.id == id) {
						            return true;
						      }
						});
						
						//scope for save the mapping
						$scope.map=map;
							
						//Populate the save mapping form
						$("input[name='mappingName']").val(map.mappingName);
						$('#tree_folders').jstree("deselect_all");
						$('#tree_folders').jstree("select_node",map.folderId);

						$scope.editTitle=map.mappingName;
						//Getting Existing connection data
						var mappings=JSON.parse(map.mappings);
					
						// Setting source & target connection details
						 ConnectionService.searchConnections().then(function(response){
								
								var connectionData=response.connections;
								var connSource= connectionData.find(function(data) {
									if (data.id == map.sourceConnId) {
									       return true;
									}
								});
								var connTarget= connectionData.find(function(data) {
									if (data.id == map.targetConnId) {
									       return true;
									 }
								});
			
								connSource.seperator=mappings[0].seperator;
								setupSelectedSourceConnection('',connSource);
								setupSelectedTargetConnection('',connTarget);
								
					    		// Creating mappings
								for(var j=0;j<mappings.length;j++)
								{
									var mappingsJSON=mappings[j];
		
									var	mapRuleData=mappingsJSON.mappingrules;
										
										if(mapRuleData){
											var mapRules=[];
											mapRules=mapRuleData.split(",");
											var sourceCon=true;
											
											//Get the source and target column based on '-'
											angular.forEach(mapRules, function(data){
												if(data.split("-").length==2&&sourceCon==true){
													sourceCol.push(data.split("-")[0]);
													targetCol.push(data.split("-")[1]);
													
													sourceCon=false;
													
												}
												else if(sourceCon==false){
													targetCol.push(data);
												}
												else{
													sourceCol.push(data);
												}
												
											});
									     }
									
										if(connSource.connectionType == "Hive"&&connTarget.connectionType=="Redshift"){
												if(mapRuleData){
													for(var i=0;i<sourceCol.length;i++){
														 $scope.sourceConn.push("source_"+mappingsJSON.hiveThriftServer.slice(mappingsJSON.hiveThriftServer.lastIndexOf('/')+1)+"-"+mappingsJSON.hiveTableName+"-"+sourceCol[i] + "_anchor");
														 $scope.targetConn.push(connTarget.connectionType+"-"+mappingsJSON.destTableName+"-"+targetCol[i] + "_anchor");
													}
													$scope.tree_source.push("source_"+mappingsJSON.hiveThriftServer.slice(mappingsJSON.hiveThriftServer.lastIndexOf('/')+1)+"-"+mappingsJSON.hiveTableName+"_anchor");
													$scope.tree_target.push(connTarget.connectionType+"-"+mappingsJSON.destTableName+"_anchor");
													
												}
												else{
													sourceConn.push("source_"+mappingsJSON.hiveThriftServer.slice(mappingsJSON.hiveThriftServer.lastIndexOf('/')+1)+"-"+mappingsJSON.hiveTableName+"_anchor");
													$scope.targetConn.push(connTarget.connectionType+"-"+mappingsJSON.destTableName+"_anchor");
												}
											}
											else if(connSource.connectionType == "Hive"&&connTarget.connectionType=="Hive"){
												$scope.sourceConn.push("source_"+mappingsJSON.srcConnectionStr.slice(mappingsJSON.srcConnectionStr.lastIndexOf('/')+1)+"-"+mappingsJSON.srcTableName+"_anchor");
												$scope.targetConn.push("target_"+mappingsJSON.srcConnectionStr.slice(mappingsJSON.srcConnectionStr.lastIndexOf('/')+1)+"-"+mappingsJSON.destTableName+"_anchor");
											}
											else if(connSource.connectionType=="Local"){
												$scope.sourceConn.push("Local-File_anchor");
												$scope.targetConn.push(connTarget.connectionType+"-"+mappingsJSON.tableName+"_anchor");
											}
											else if(connSource.connectionType == "HDFS"){
												$scope.sourceConn.push("HDFS-File_anchor");
												$scope.targetConn.push(connTarget.connectionType+"-"+mappingsJSON.tableName+"_anchor");
											}
										}
						
								$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
									var target = $(e.target).attr("href") // activated tab
									if(target=='#tab3'){
									   if(jsPlumb.getConnections().length==0){
										   $scope.count=0;
									   }
									   $scope.count++;
								
									   if($scope.count==1){
										   $timeout(function(){
												
											   if(mapRuleData){
													for(var i=0;i<$scope.tree_source.length;i++){
														 $("#tree_source").jstree("open_node",$("#"+$scope.tree_source[i]));
														 $("#tree_destination").jstree("open_node",$("#"+$scope.tree_target[i]));
													}
												 }
												 for(var i=0;i<$scope.sourceConn.length;i++){
													 syraJsPlumb.EditConnection($scope.sourceConn[i],$scope.targetConn[i]);
												 }
											
										   },1000);
										}
									}
								});						
						 });		
	
					});
				},1000);
			}
    });
	
	$scope.changeSource = function(){
		$scope.sourceSelected = "NO";
	}

	$scope.changeTarget = function(){
		$scope.targetSelected = "NO";
	}
	
	function showInfoMessage(infoMessage, infoTitle) {
		toastr["info"](infoMessage, infoTitle);
	}

	function showErrorMessage(errorMessage) {
		toastr["error"](errorMessage, "Error");
	}
	
	// Schedule Form validation
    var form = $("#mapping_form");
    var error = $('.alert-danger', form);
    var success = $('.alert-success', form);
    
     
    syraCommon.validateConnectionForm(form);
    
	$scope.save = function () {
        success.hide();
        error.hide();
		
		if(form.valid() == false){
			return false;
		}
		
		var mapping = {};
				
		var mappingName = $("input[name='mappingName']").val();
		var ref = $('#tree_folders').jstree(true);
		var node = ref.get_node(ref.get_selected());
		var folderId = node.id;

		if (mappingName === null || mappingName == ""){
			toastr["warning"]("Please enter a valid Mapping name to continue..");
		} else if (folderId === null || folderId === "") {
			toastr["warning"]("Please select a valid Folder to continue..");
		} else {
			mapping.mappingName = mappingName;
			
			//Update the edit mapping details
			if(id){
				mapping.id = $scope.map.id;
			}
			else{
				mapping.id = null;
			}

			mapping.folderId = folderId;
			mapping.selected = false;
			mapping.new = true;
			mapping.sourceConnId = $("#sourceConnId").val();
			mapping.targetConnId = $("#targetConnId").val();
			mapping.s3FieldDelim = $(".form-wizard input[name=s3FieldDelim]").val();
			
			// Call FormWizard.migrate(with FALSE) to get only mappings !!
			mapping.mappings = JSON.stringify(FormWizard.migrate(false));
			
			var mappings = [mapping];
			
			MappingService.saveMappings(mappings).then(function (response) {
				if($scope.map.id){
					showInfoMessage("Mapping editated successfully..", "New Mapping");
				}
				else{
					showInfoMessage("New Mapping created successfully..", "New Mapping");
				}
				$('#form_wizard_1').find('.button-savemappings').addClass("disabled");
			},
			function (errorMessage) {
				showErrorMessage(errorMessage);
			});

			$("#myModal_save_mapping").modal('hide');			
		}
	};	
	
	
}]);
