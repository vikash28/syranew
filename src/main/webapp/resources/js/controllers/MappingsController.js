'use strict';

/* Setup Mappings page controller */
MetronicApp.controller('MappingsController', ['$rootScope', '$scope', 'settings', '$http' , 'MappingService', 
						'ScheduleService', 'FolderService', 'UserService', '$timeout', function ($rootScope, $scope, settings, 
							$http, MappingService, ScheduleService, FolderService, UserService, $timeout) {
	$scope.mappingData = {};
	
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        Metronic.initAjax();
		
		$("#cron").cronGen();
		
        $(".date").datetimepicker({
            autoclose: true,
            isRTL: Metronic.isRTL(),
            format: "dd MM yyyy hh:ii",
            pickerPosition: (Metronic.isRTL() ? "bottom-right" : "bottom-left")
        });		

		Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_mappings')); // set mappings link active in sidebar menu
		
		// set sidebar closed and body solid layout mode
		$rootScope.settings.layout.pageAutoScrollOnLoad = 1500;
		$rootScope.settings.layout.pageSidebarClosed = true;
		
		/* SETUP FOLDERS TREE POPOVER with State flag required ?!! */
		TableMappings.initFolders(FolderService, false);
	
		$('#folderspop').on("click", function(event){
			event.preventDefault();
			
			var $popover = $("#foldersPopover");
			
			$popover.css("left", $("#folderspop").position().left + $("#folderspop").width() - 275);
			
			if($popover.is(":visible")){
				$popover.fadeOut();
			} else {
				$popover.fadeIn();
			}
		});
		
		$('#foldersShowAll').on("click", function(event){
			event.preventDefault();

			mappingTable
			.search('')			
			.columns('')
			.search('')
			.draw();
			
			var $popover = $("#foldersPopover");			
			if($popover.is(":visible")){
				$popover.fadeOut();
			}
			
			$("#folderName").text("Folders");	
		});
		
		/* $(document).mouseup(function (e)
{
			var container = $("#foldersPopover");

			if (!container.is(e.target) // if the target of the click isn't the container...
				&& container.has(e.target).length === 0) // ... nor a descendant of the container
			{
				container.fadeOut();
			}
		}); */
		
		/* $('#folderspop').popover({
			html: true,
			content: function() {
				return $('#foldersdiv').html();
			}
		}); */

		/* SETUP FOLDERS TREE POPOVER ?!! */
				
		$('#tableMappings tbody').on( 'click', '.schedule', function () {
			var row = mappingTable.row($(this).closest("tr"));
			$scope.mappingData = row.data();
			
			// Reset Workflow Parent dropdown according to selected Mapping
			$('#wfParent').find("*").remove();

			$('#wfParent').append($('<option>', {
				value: "-1",
				text: ""
			}));
			
			mappingTable.rows().eq(0).each( function ( index ) {
				var that = mappingTable.row( index );			 
				var data = that.data();
				
				if(row.data().id == data.id){
					return;
				}
				
				$('#wfParent').append($('<option>', {
					value: data.mappingName + ":::#" + data.id,
					text: data.mappingName
				}));
			});
			
			$("#myModal_newschedule_title").text("Create New Schedule - " + row.data().mappingName);			
			$("#myModal_newschedule").modal({keyboard: false});
		});

		$('#tableMappings tbody').on( 'click', '.run', function () {
			var row = mappingTable.row($(this).closest("tr"));
			var mapping = row.data();
			
			$scope.run(mapping);
		});

		$('#tableMappings tbody').on( 'click', '.delete', function () {
			var $tbody = $(this);
			bootbox.confirm("Are you sure you want to delete this Mapping? all associated Schedules will be deleted !!", function(result) {
			   if(result){
					var row = mappingTable.row($tbody.closest("tr"));
					var mappingId = row.data().id;

					$scope.delete(mappingId);
					
					row.remove().draw();
			   }
			}); 
		});

		$('.useFolder').on('click', function () {
			var ref = $('#tree_folders').jstree(true);
			var node = ref.get_node(ref.get_selected());
			
			mappingTable
				.columns( 9 )
				.search( node.id )
				.draw();
			
			$("#folderName").text(node.text);
			$("#foldersPopover").fadeOut();
		});		
		
		$('#tableMappings tbody').on( 'click', '.list', function () {
			var row = mappingTable.row($(this).closest("tr"));
			var mapping = row.data();
			
			$scope.listSchedules(mapping);
		});

		$('#tableScheduleList tbody').on( 'click', '.pauseSchedule', function () {
			var $tbody = $(this);
			bootbox.confirm("Are you sure you want to Pause this Schedule?", function(result) {
			   if(result){
					var row = scheduleTable.row($tbody.closest("tr"));
					var triggerName = row.data().triggerName;
					
					$scope.pauseSchedule(triggerName);
				}
			}); 
		});

		$('#tableScheduleList tbody').on( 'click', '.resumeSchedule', function () {
			var $tbody = $(this);
			bootbox.confirm("Are you sure you want to Resume this Schedule?", function(result) {
			   if(result){
					var row = scheduleTable.row($tbody.closest("tr"));
					var triggerName = row.data().triggerName;
					
					$scope.resumeSchedule(triggerName);
				}
			}); 
		});

		$('#tableScheduleList tbody').on( 'click', '.deleteSchedule', function () {
			var $tbody = $(this);
			bootbox.confirm("Are you sure you want to Delete this Schedule?", function(result) {
			   if(result){
					var row = scheduleTable.row($tbody.closest("tr"));
					var triggerName = row.data().triggerName;
					
					$scope.deleteSchedule(triggerName);
				}
			}); 
		});
		
		$('#tableScheduleList tbody').on( 'click', '.showlogSchedule', function () {
			var $tbody = $(this);
			var row = scheduleTable.row($tbody.closest("tr"));
			var triggerName = row.data().triggerName;
						
			$("#ajaxJobFormSchedulerLog #logName").val(triggerName);
			$("#ajaxJobFormSchedulerLog #logType").val("TRIGGER");
			schedulerLogTable.ajax.reload();
		});
		
		$('.reload-schedules').click(function(){
			scheduleTable.ajax.reload();		
		});
		
		$('.reload-schedulelogs').click(function(){
			schedulerLogTable.ajax.reload();		
		});
		
		$("#myModal_newschedule .nav > li > a").on("click",function(e){
			// Disable Tab clicks inside Modal!!
			e.preventDefault();
		});

		function setupEditForm(mapping){
			// Setup Edit form
			
			$("input[name=mappingName]").val(mapping.mappingName);
			$("input[name=mappingType]").val(mapping.mappingType);
			$("input[name=hiveThriftServer]").val(mapping.hiveThriftServer);
			$("input[name=hdfsConnectionString]").val(mapping.hdfsConnectionString);
			$("input[name=hdfsPath]").val(mapping.hdfsPath);
			$("input[name=hdfsAccessUser]").val(mapping.hdfsAccessUser);
			$("input[name=hdfsFieldDelim]").val(mapping.hdfsFieldDelim);
			$("input[name=redshiftDbUrl]").val(mapping.redshiftDbUrl);
			$("input[name=redshiftUser]").val(mapping.redshiftUser);
			$("input[name=redshiftPassword]").val(mapping.redshiftPassword);
			$("input[name=s3AccessKey]").val(mapping.s3AccessKey);
			$("input[name=s3SecreteKey]").val(mapping.s3SecreteKey);
			$("input[name=hdfsTempDir]").val(mapping.hdfsTempDir);
			
			$scope.mappingType = mapping.mappingType;
			
			$timeout(function() {
				// anything you want can go here and will safely be run on the next digest.
				$(".btn-server-type").scope().$apply();
			});
		}
	});
	
	$scope.vm = {
		originalMappings: [],
		mappings: [],
		isSelectionEmpty: true,
		errorMessages: [],
		infoMessages: []
	};
	
	//updateUserInfo();
	loadMappingData();

	function showErrorMessage(errorMessage) {
		clearMessages();
		$scope.vm.errorMessages.push({description: errorMessage});
		toastr["error"](errorMessage, "Error");
	}
	
	function updateUserInfo() {
		UserService.getUserInfo()
			.then(function (userInfo) {
				$scope.vm.userName = userInfo.userName;
			},
			function (errorMessage) {
				showErrorMessage(errorMessage);
			});
	}

	function markAppAsInitialized() {
		if ($scope.vm.appReady == undefined) {
			$scope.vm.appReady = true;
		}
	}

	function loadMappingData() {
		MappingService.searchMappings()
			.then(function (data) {

				$scope.vm.errorMessages = [];

				$scope.vm.originalMappings = _.map(data.mappings, function (mapping) {
					return mapping;
				});

				$scope.vm.mappings = _.cloneDeep($scope.vm.originalMappings);

				_.each($scope.vm.mappings, function (mapping) {
					mapping.selected = false;
				});

				if ($scope.vm.mappings && $scope.vm.mappings.length == 0) {
					// showInfoMessage("No results found.");
				}
			},
			function (errorMessage) {
				showErrorMessage(errorMessage);
				markAppAsInitialized();
			});
	}
	
	function clearMessages() {
		$scope.vm.errorMessages = [];
		$scope.vm.infoMessages = [];
	}

	function showInfoMessage(infoMessage, infoTitle) {
		/*$scope.vm.infoMessages = [];
		$scope.vm.infoMessages.push({description: infoMessage});
		$timeout(function () {
			$scope.vm.infoMessages = [];
		}, 1000);*/
		$("#myModal_newmapping").modal("hide");
		$("#myModal_newschedule").modal("hide");
		toastr["info"](infoMessage, infoTitle);
	}

	// Schedule Form validation
    var form = $("#scheduleForm");
    var error = $('.alert-danger', form);
    var success = $('.alert-success', form);
    
    syraCommon.validateConnectionForm(form);	
    
	$scope.selectionChanged = function () {
		$scope.vm.isSelectionEmpty = !_.any($scope.vm.mappings, function (mapping) {
			return mapping.selected && !mapping.deleted;
		});
	};

	$scope.add = function () {
		// Check if already a row created
		if($scope.vm.mappings.length>0 && $scope.vm.mappings[0].id==null){
			return false;
		}
		$scope.vm.mappings.unshift({
			id: null,
			mappingName: null,
			mappingType: null,
			hiveThriftServer: null,
			hdfsConnectionString: null,
			hdfsPath: null,
			hdfsAccessUser: null,
			hdfsFieldDelim: null,
			redshiftDbUrl: null,
			redshiftUser: null,
			redshiftPassword: null,
			s3AccessKey: null,
			s3SecreteKey: null,
			hdfsTempDir: null,
			s3FileUrl: null,
			selected: false,
			new: true
		});
	};

	$scope.delete = function (id) {
		var deletedMappingIds = _.chain($scope.vm.mappings)
			.filter(function (mapping) {
				return mapping.id == id;
			})
			.map(function (mapping) {
				return mapping.id;
			})
			.value();

		MappingService.deleteMappings(deletedMappingIds)
			.then(function () {
				clearMessages();
				showInfoMessage("Mapping deleted succesfully.", "Delete");

				_.remove($scope.vm.mappings, function(mapping) {
					return mapping.selected;
				});

				$scope.selectionChanged();
				//updateUserInfo();

			},
			function () {
				clearMessages();
				$scope.vm.errorMessages.push({description: "deletion failed."});
			});
	};

	$scope.reset = function () {
		//$scope.vm.mappings = $scope.vm.originalMappings;
		
		// Hitting Reset while creating a new Conn
		//console.log($('#connId').val());
		if($('#connId').val()!="-1"){
			loadMappingData();
		}
		
		// Save - Reset Mapping is done, now reset to -1 so hitting Reset button will not hit Server repeatedly
		if($('#connId').val()=="-2"){
			$('#connId').val("-1");
		}
		
		// Magic - just trigger change on hidden connId !!
		$('#connId').trigger("change");
	};

	$scope.resetSchedule = function () {
		$("#scheduleForm")[0].reset();
		$('.date').data("date","");
		$('.date').val("");
	};

	function getNotNew(mappings) {
		return  _.chain(mappings)
			.filter(function (mapping) {
				return !mapping.new;
			})
			.value();
	}
	
	function setupNewDirtyMapping(mapping){
		
		// Continue if a Mapping is getting created via S3 File Upload!!
		if(mapping.mappingType == "Local"){
			return;
		}
		
		mapping.mappingName = $("input[name=mappingName]").val();
		mapping.mappingType = $("input[name=mappingType]").val();
		mapping.hiveThriftServer = $("input[name=hiveThriftServer]").val();
		mapping.hdfsConnectionString = $("input[name=hdfsConnectionString]").val();
		mapping.hdfsPath = $("input[name=hdfsPath]").val();
		mapping.hdfsAccessUser = $("input[name=hdfsAccessUser]").val();
		mapping.hdfsFieldDelim = $("input[name=hdfsFieldDelim]").val();
		mapping.redshiftDbUrl = $("input[name=redshiftDbUrl]").val();
		mapping.redshiftUser = $("input[name=redshiftUser]").val();
		mapping.redshiftPassword = $("input[name=redshiftPassword]").val();
		mapping.s3AccessKey = $("input[name=s3AccessKey]").val();
		mapping.s3SecreteKey = $("input[name=s3SecreteKey]").val();
		mapping.hdfsTempDir = $("input[name=hdfsTempDir]").val();	
	}

	function prepareMappingsDto(mappings) {
		return  _.chain(mappings)
			.map(function (mapping) {
				return {
					id: mapping.id,
					mappingName: mapping.mappingName,
					mappingType: mapping.mappingType,
					hiveThriftServer: mapping.hiveThriftServer,
					hdfsConnectionString: mapping.hdfsConnectionString,
					hdfsPath: mapping.hdfsPath,
					hdfsAccessUser: mapping.hdfsAccessUser,
					hdfsFieldDelim: mapping.hdfsFieldDelim,
					redshiftDbUrl: mapping.redshiftDbUrl,
					redshiftUser: mapping.redshiftUser,
					redshiftPassword: mapping.redshiftPassword,
					s3AccessKey: mapping.s3AccessKey,
					s3SecreteKey: mapping.s3SecreteKey,
					hdfsTempDir: mapping.hdfsTempDir,
					s3FileUrl: mapping.s3FileUrl,
					version: mapping.version
				}
			})
			.value();
	}

	$scope.save = function () {

		var maybeDirty = prepareMappingsDto(getNotNew($scope.vm.mappings));

		var original = prepareMappingsDto(getNotNew($scope.vm.originalMappings));

		var connId = $("#connId").val();
		
		var dirty = [];
		
		// Check if hidden mapping ID is set from the Data table
		if(connId != -1){
			dirty = _.filter(maybeDirty).filter(function (mapping) {
			
				if(mapping.id != connId){
					return false;
				}

				var originalMapping = _.filter(original, function (orig) {
					return orig.id === mapping.id;
				});

				if (originalMapping.length == 1) {
					originalMapping = originalMapping[0];
				}
				setupNewDirtyMapping(mapping);

				return originalMapping && ( originalMapping.mappingName != mapping.mappingName ||
					originalMapping.mappingType != mapping.mappingType || originalMapping.hiveThriftServer != mapping.hiveThriftServer ||
					originalMapping.hdfsMappingString != mapping.hdfsMappingString || originalMapping.hdfsPath != mapping.hdfsPath ||
					originalMapping.hdfsAccessUser != mapping.hdfsAccessUser || originalMapping.hdfsFieldDelim != mapping.hdfsFieldDelim || 
					originalMapping.redshiftDbUrl != mapping.redshiftDbUrl || originalMapping.redshiftUser != mapping.redshiftUser  || 
					originalMapping.redshiftPassword != mapping.redshiftPassword || originalMapping.s3AccessKey != mapping.s3AccessKey || 
					originalMapping.s3SecreteKey != mapping.s3SecreteKey || originalMapping.hdfsTempDir != mapping.hdfsTempDir )
			});
		}

		var newItems = _.filter($scope.vm.mappings, function (mapping) {
			
			// Setup the new mapping data using jQ !!
			
			if(mapping.new){
				setupNewDirtyMapping(mapping);
			}
			
			return mapping.new;
		});

		var saveAll = prepareMappingsDto(newItems);
		saveAll = saveAll.concat(dirty);

		$scope.vm.errorMessages = [];

		// save all new items plus the ones that where modified
		MappingService.saveMappings(saveAll).then(function () {
				//$scope.search();
				if(connId == -1){
					showInfoMessage("New Mapping created successfully..", "New Mapping");
					$('#connId').val("-2");
				} else {
					showInfoMessage("Changes saved successfully..", "Edit mapping");
				}
				$scope.reset();
				mappingTable.ajax.reload();
			},
			function (errorMessage) {
				showErrorMessage(errorMessage);
			});

	};

	$scope.saveSchedule = function () {
        success.hide();
        error.hide();
		
		if(form.valid() == false){
			return false;
		}		
		
		var mapping = $scope.mappingData;
		var schedules = [{
			jobName: mapping.mappingName + ":::#" + mapping.id,
			triggerName: $("#scheduleName").val() + ":::#" + mapping.id,
			cron: $("#cron").val(),
			startAt: $(".form_startat").data("date"),
			endAt: $(".form_endat").data("date")
		}];
		
		if($("#tab_workflow").is(":visible")){
			var schedule = schedules[0];
			
			schedule.jobDataEx = JSON.stringify({
						wfJobName: mapping.mappingName + ":::#" + mapping.id,
						wfTriggerName: $("#scheduleName").val() + ":::#" + mapping.id,
						wfParent: $("#wfParent").val(),
						wfPriority: $("#wfPriority").val(),
						wfParentExec: $("#wfParentExec").is(":checked"),
						triggerPrecheckFile: $("#triggerPrecheckFile").val()
					});
			
		} else {
			var schedule = schedules[0];

			schedule.jobDataEx = JSON.stringify({
						triggerPrecheckFile: $("#triggerPrecheckFile").val()
					});
		}
		
		ScheduleService.saveSchedules(schedules).then(function () {
				showInfoMessage("Schedule created successfully!!", "Create Schedule success");
				$scope.resetSchedule();
				scheduleTable.ajax.reload();
			},
			function (errorMessage) {
				showErrorMessage(errorMessage);
			});

	};
	
	$scope.listSchedules = function (mapping) {
		var jobName = mapping.mappingName + ":::#" + mapping.id;
		
		$("#myModal_schedulelist_title").text("Schedules - " + mapping.mappingName);
		
		$("#ajaxJobForm #jobName").val(jobName);
		scheduleTable.ajax.reload();

		$("#ajaxJobFormSchedulerLog #logName").val(jobName);
		$("#ajaxJobFormSchedulerLog #logType").val("JOB");
		schedulerLogTable.ajax.reload();

		$("#myModal_schedulelist").modal({keyboard: false});
		
		/*ScheduleService.searchSchedules(jobName).then(function () {
				//$scope.reset();
			},
			function (errorMessage) {
				showErrorMessage(errorMessage);
			});*/
	};

	$scope.pauseSchedule = function (triggerName) {
		ScheduleService.pauseSchedule(triggerName).then(function () {
				showInfoMessage("Schedule Paused successfully !!", "Pause");
				scheduleTable.ajax.reload();
			},
			function (errorMessage) {
				showErrorMessage(errorMessage);
			});
	};

	$scope.resumeSchedule = function (triggerName) {
		ScheduleService.resumeSchedule(triggerName).then(function () {
				showInfoMessage("Schedule Resumed successfully !!", "Resume");
				scheduleTable.ajax.reload();
			},
			function (errorMessage) {
				showErrorMessage(errorMessage);
			});
	};

	$scope.deleteSchedule = function (triggerName) {

		ScheduleService.deleteSchedule(triggerName)
			.then(function () {
				clearMessages();
				showInfoMessage("Schedule Deleted successfully !!", "Delete");
				scheduleTable.ajax.reload();
			},
			function () {
				clearMessages();
				$scope.vm.errorMessages.push({description: "deletion failed."});
			});
	};	
	
	$scope.run = function(mapping){
		var jsonArray = JSON.parse(mapping.mappings);
		
		// Loop through all Mappings and run one by one..
		
		for(var index in jsonArray){
			var jsonData = jsonArray[index];
			
			toastr["info"]("<b>Migrating " + mapping.sourceConnectionType + "." + jsonData.tableName + " to Redshift</b>", "Migrating to Redshift..");
			
			if(mapping.sourceConnectionType == "Hive" && mapping.targetConnectionType == "Redshift"){
			
				// Check if it's a Table or Column migration!
				// ColMigration will have mappingrules property !!
				if(jsonData.mappingrules){
					var hiveToRedshiftCall = $.postJSON( "/Syra-1.0.0-BUILD-SNAPSHOT/HiveToRedshiftMapping", jsonData, function(data){
						toastr["success"]("<b>Selected columns from " + mapping.sourceConnectionType + "." + jsonData.tableName + " successfully migrated to Redshift !!</b>", "Migration Successful !!");
					});
				} else {
					var hiveToRedshiftCall = $.postJSON( "/Syra-1.0.0-BUILD-SNAPSHOT/HiveToRedshift", jsonData, function(data){
						toastr["success"]("<b>Table " + mapping.sourceConnectionType + "." + jsonData.tableName + " successfully migrated to Redshift !!</b>", "Migration Successful !!");								
					});
				}
			} else if(mapping.sourceConnectionType == "Hive" && mapping.targetConnectionType == "Hive"){
				
				// Check if it's a Table or Column migration!
				// ColMigration will have mappingrules property !!
				if(jsonData.mappingrules){
					// TODO - Hive to Hive individual columns mapping, API pending
					
					var hiveToHiveCall = $.postJSON( "/Syra-1.0.0-BUILD-SNAPSHOT/HiveToHive", jsonData, function(data){
						toastr["success"]("<b>Selected columns from " + mapping.sourceConnectionType + "." + jsonData.destTableName + " successfully migrated to Hive !!</b>", "Migration Successful !!");
					});
				} else {
					var hiveToHiveCall = $.postJSON( "/Syra-1.0.0-BUILD-SNAPSHOT/HiveToHive", jsonData, function(data){
						toastr["success"]("<b>Table " + mapping.sourceConnectionType + "." + jsonData.destTableName + " successfully migrated to Hive !!</b>", "Migration Successful !!");								
					});
				}
			} else if (mapping.sourceConnectionType == "HDFS" && mapping.targetConnectionType == "Redshift"){
				var hdfsToRedshiftCall = $.postJSON( "/Syra-1.0.0-BUILD-SNAPSHOT/HdfsToRedshift", jsonData, function(data){
					toastr["success"]("<b>Table " + mapping.sourceConnectionType + "." + jsonData.tableName + " successfully migrated to Redshift !!</b>", "Migration Successful !!");								
				});		
			} else if (mapping.sourceConnectionType == "Local" && mapping.targetConnectionType == "Redshift"){
				var localToRedshiftCall = $.postJSON( "/Syra-1.0.0-BUILD-SNAPSHOT/LocalToRedshift", jsonData, function(data){
					toastr["success"]("<b>Table " + mapping.sourceConnectionType + "." + jsonData.tableName + " successfully migrated to Redshift !!</b>", "Migration Successful !!");
				});
			}
		}
	}

}]);

