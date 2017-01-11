var FormWizard = function() {


  return {
    //main function to initiate the module
    init: function() {
      if (!jQuery().bootstrapWizard) {
        return;
      }

      function format(state) {
        if (!state.id) return state.text; // optgroup
        return "<img class='flag' src='../../assets/global/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;
      }

      var form = $("#submit_form");
      var error = $('.alert-danger', form);
      var success = $('.alert-success', form);

      syraCommon.validateConnectionForm(form);

      var displayConfirm = function() {
        $('#tab4 .form-control-static', form).each(function() {
          var input = $('[name="' + $(this).attr("data-display") + '"]', form);
          if (input.is(":radio")) {
            input = $('[name="' + $(this).attr("data-display") + '"]:checked', form);
          }
          if (input.is(":text") || input.is("textarea")) {
            $(this).html(input.val());
          } else if (input.is("select")) {
            $(this).html(input.find('option:selected').text());
          } else if (input.is(":radio") && input.is(":checked")) {
            $(this).html(input.attr("data-title"));
          } else if ($(this).attr("data-display") == 'payment[]') {
            var payment = [];
            $('[name="payment[]"]:checked', form).each(function() {
              payment.push($(this).attr('data-title'));
            });
            $(this).html(payment.join("<br>"));
          }
        });
      }

      $(".form-wizard li .step").on("click", function(event) {
        event.preventDefault();
       });

      var handleTitle = function(tab, navigation, index) {
        var total = navigation.find('li').length;
        var current = index + 1;
        // set wizard title
        var editTitle=$('.step-title', $('#form_wizard_1')).text();
        if(editTitle.indexOf('-')+1){
        	var Title=editTitle.substr(editTitle.indexOf('-')+1);
        }
        if(Title){
        	$('.step-title', $('#form_wizard_1')).text('Step ' + (index + 1) + ' of ' + total+ ' - ' + Title);
        }
        else{
        	$('.step-title', $('#form_wizard_1')).text('Step ' + (index + 1) + ' of ' + total);
        }
        	// set done steps
        jQuery('li', $('#form_wizard_1')).removeClass("done");
        var li_list = navigation.find('li');
        for (var i = 0; i < index; i++) {
          jQuery(li_list[i]).addClass("done");
        }

        if (index == 2 && current == 3) {
          // If existing Mappings present
          	if (jsPlumb.getConnections().length != 0) {
	            bootbox.confirm("Are you sure you want to reset all existing mappings?", function(result) {
	              if (result) {
	                jsPlumb.detachEveryConnection();
	              }
	            });
	          }
        	}
        if (current == 3) {
          // Check if existing mapping present
          var jsServerType = $(".btn-server-type.active").attr("btn-radio");
          var jsTargetServerType = $(".btn-target-server-type.active").attr("btn-radio");
	       
	       if (jsPlumb.getConnections().length == 0) {
            if (jsServerType == "'Hive'") {
              FormWizard.loadHiveTree("#tree_source");
            } else if (jsServerType == "'HDFS'") {
              FormWizard.loadHDFSTree();
            } else if (jsServerType == "'Local'") {
              FormWizard.loadLocalTree();
            }

            if (jsTargetServerType == "'Hive'") {
              FormWizard.loadHiveTree("#tree_destination");
            } else if (jsTargetServerType == "'Redshift'") {
              FormWizard.loadRedshiftTree();
            }
          }
        } else if (current == 4) {
          // Iterate selected mappings and format the migration information to display it to the user
          // just as an information to the end user, Read-only !!

          var connections = jsPlumb.getConnections();

          var strMappings = "";

          if (connections.length == 0) {
            strMappings = "<b>No Mappings created</b>";
            $('#form_wizard_1').find('.button-submit').addClass("disabled");
          } else {
            var jsTreeSource = $('#tree_source').jstree(true);
            var jsTreeTarget = $('#tree_destination').jstree(true);

            for (var conn in connections) {
              var source_node = jsTreeSource.get_node(connections[conn].sourceId);
              var target_node = jsTreeTarget.get_node(connections[conn].targetId);

              if (target_node.type == "table") {
                var sourceDB = jsTreeSource.get_node(source_node.parent);
                var targetDB = jsTreeTarget.get_node(target_node.parent);

                var sourceTableName = source_node.li_attr["data-table-name"];
                var targetTableName = target_node.li_attr["data-table-name"];

                strMappings += "[" + sourceDB.id.replace("source_", "") + "] " + sourceTableName + " ==> " + "[" + targetDB.id.replace("target_", "") + "] " + targetTableName + "<p/>";

                /* strMappings += connections[conn].sourceId.replace("source_","").replace("-",".").replace("_anchor","")
                		+ " ==> " + connections[conn].targetId.replace("target_","").replace("-",".").replace("_anchor","") + "<p/>"; */

              } else if (target_node.type == "column") {
                var sourceTable = jsTreeSource.get_node(source_node.parent);
                var targetTable = jsTreeTarget.get_node(target_node.parent);

                var sourceDB = jsTreeSource.get_node(sourceTable.parent);
                var targetDB = jsTreeTarget.get_node(targetTable.parent);

                var sourceTableName = sourceTable.li_attr["data-table-name"];
                var targetTableName = targetTable.li_attr["data-table-name"];

                var sourceColumn = source_node.li_attr["data-column-name"];
                var targetColumn = target_node.li_attr["data-column-name"];

                strMappings += "[" + sourceDB.id.replace("source_", "") + "] " + sourceTableName + "." + sourceColumn + " ==> " + "[" + targetDB.id.replace("target_", "") + "] " + targetTableName + "." + targetColumn + "<p/>";
              }
            }
            $('#form_wizard_1').find('.button-submit').show();
            $('#form_wizard_1').find('.button-savemappings').show();
          }
          $("#divMappings").html(strMappings);
        }

        if (current == 1) {
          $('#form_wizard_1').find('.button-previous').hide();// Add the validation of tab click to confirm source and target selected

          setTimeout(function() {
            // Hide / Show Continue button if Source is not selected
            if ($("a.button-changesource:hidden").size() > 0) {
              $('#form_wizard_1').find('.button-next').hide();
            } else {
              $('#form_wizard_1').find('.button-next').show();
            }
          }, 10);
        } else if (current == 2) {
          $('#form_wizard_1').find('.button-previous').show();

          setTimeout(function() {
            // Hide / Show  Continue button if Target is not selected
            if ($("a.button-changetarget:hidden").size() > 0) {
              $('#form_wizard_1').find('.button-next').hide();
            } else {
              $('#form_wizard_1').find('.button-next').show();
            }
          }, 10);
        } else if (current == 3) {
            setTimeout(function() {
          $('#form_wizard_1').find('.button-next').show();
          $('#form_wizard_1').find('.button-previous').show();
            },10);
        } else {
          $('#form_wizard_1').find('.button-previous').show();
        }

        if (current >= total) {
          $('#form_wizard_1').find('.button-next').hide();
          $('#form_wizard_1').find('.button-submit').show();
          $("#migration-messages").html("");
          if (connections.length > 0) {
            $('#form_wizard_1').find('.button-submit').removeClass("disabled");
            $('#form_wizard_1').find('.button-savemappings').removeClass("disabled");
            $('#form_wizard_1').find('.button-savemappings').show();
          }

          // TODO - required?
          displayConfirm();
        } else {
          $('#form_wizard_1').find('.button-submit').hide();
          $('#form_wizard_1').find('.button-savemappings').hide();
        }
        Metronic.scrollTo($('.page-title'));
      }

      // default form wizard
      $('#form_wizard_1').bootstrapWizard({
        'nextSelector': '.button-next',
        'previousSelector': '.button-previous',
        onTabClick: function(tab, navigation, index, clickedIndex) {
          // return false;
        	
        	var connections = jsPlumb.getConnections();

        	if ((index < clickedIndex && clickedIndex == "1") && ($(".button-next:visible").size()==0 && $("#submit_form").valid())) {
        		   toastr["error"]("Please select the Source before continue...");
        		   return false;
             } else if ((index < clickedIndex && clickedIndex == "2") && ($(".button-next:visible").size()==0 && $("#submit_form").valid())) {
            		if(index==0){
            			   toastr["error"]("Please select the Source before continue...");
             		}
            		else if(index==1){
            			   toastr["error"]("Please select the Target before continue...");
            		}
            	    return false;
              }
             	else if ((index < clickedIndex && clickedIndex == "3") && connections.length == 0) {
             		toastr["error"]("Please create the Mappings before continue...");
             		return false;
               }
          
          success.hide();
          error.hide();
          if (form.valid() == false) {
            return false;
          }
          handleTitle(tab, navigation, clickedIndex);

        },
        onNext: function(tab, navigation, index) {

        	var connections = jsPlumb.getConnections();
        	if(index=='3' && connections.length==0){
        		toastr["error"]("Please create the Mappings before continue...");
        		return false;
        	}
          success.hide();
          error.hide();

          if (form.valid() == false) {
            return false;
          }

          handleTitle(tab, navigation, index);
        },
        onPrevious: function(tab, navigation, index) {
          success.hide();
          error.hide();

          handleTitle(tab, navigation, index);
        },
        onTabShow: function(tab, navigation, index) {
          var total = navigation.find('li').length;
          var current = index + 1;
          var $percent = (current / total) * 100;
          $('#form_wizard_1').find('.progress-bar').css({
            width: $percent + '%'
          });
        }
      });

      $('#form_wizard_1').find('.button-previous').hide();
      $('#form_wizard_1').find('.button-savemappings').hide();

      $('#form_wizard_1 .button-submit').click(function() {
        FormWizard.migrate(true);
      }).hide();

      //apply validation on select2 dropdown value change, this only needed for chosen dropdown integration.
      $('#country_list', form).change(function() {
        form.validate().element($(this)); //revalidate the chosen dropdown value and show error or success message for the input
      });

      $('.reload-source').click(function() {
        var jsServerType = $(".btn-server-type.active").attr("btn-radio");

        if (jsPlumb.getConnections().length > 0) {
          bootbox.confirm("Are you sure you want to reset all existing mappings?", function(result) {
            if (result) {
              jsPlumb.detachEveryConnection();

              if (jsServerType == "'Hive'") {
                FormWizard.loadHiveTree("#tree_source");
              } else if (jsServerType == "'HDFS'") {
                FormWizard.loadHDFSTree();
              }
            }
          });
        } else {
          if (jsServerType == "'Hive'") {
            FormWizard.loadHiveTree("#tree_source");
          } else if (jsServerType == "'HDFS'") {
            FormWizard.loadHDFSTree();
          }
        }
      });

      $('.reload-target').click(function() {
        var jsTargetServerType = $(".btn-target-server-type.active").attr("btn-radio");

        if (jsPlumb.getConnections().length > 0) {
          bootbox.confirm("Are you sure you want to reset all existing mappings?", function(result) {
            if (result) {
              jsPlumb.detachEveryConnection();

              if (jsTargetServerType == "'Hive'") {
                FormWizard.loadHiveTree("#tree_destination");
              } else if (jsTargetServerType == "'Redshift'") {
                FormWizard.loadRedshiftTree();
              }
            }
          });
        } else {
          if (jsTargetServerType == "'Hive'") {
            FormWizard.loadHiveTree("#tree_destination");
          } else if (jsTargetServerType == "'Redshift'") {
            FormWizard.loadRedshiftTree();
          }
        }
      });

      // Create newly created Redshift table..
      // Save button on Migrate wizard

      $('#btnSaveTree').click(function() {
        var jsTreeTarget = $('#tree_destination').jstree(true);

        var tables = jsTreeTarget.get_node("ul > li:first").children;

        for (var childName in tables) {
          var target_node = jsTreeTarget.get_node(tables[childName]);

          // Check if it's a new table OR continue !!
          if (typeof target_node.li_attr["data-new-object"] == "undefined") {
            continue;
          }
          var jsServerType = $(".btn-server-type.active").attr("btn-radio");
          var jsTargetServerType = $(".btn-target-server-type.active").attr("btn-radio");

          var tableName = target_node.li_attr["data-table-name"];
          var tableSchema = "create table " + tableName;
          var tableColumns = ""

          for (var child in target_node.children_d) {
            var column = jsTreeTarget.get_node(target_node.children_d[child]);

            if (child > 0) {
              tableColumns += ",";
            }
            tableColumns += column.li_attr["data-column-name"];

            if (jsTargetServerType == "'Redshift'") {

              tableColumns += " " + column.li_attr["data-column-type"];

            } else if (jsTargetServerType == "'Hive'") {

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

          tableSchema = tableSchema + "(" + tableColumns + ")";

          toastr["info"]("Creating table " + tableName + " on Redshift", "Table creation in progress..");

          if (jsTargetServerType == "'Redshift'") {

            var createRedshiftTable = $.postJSON("/Syra-1.0.0-BUILD-SNAPSHOT/QueryOnRedshift", {
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
              "redShiftQuery": tableSchema
            }, function(data) {
              $("#btnSaveTree").addClass("hide");
              toastr["success"]("<b>A new Table <b>" + tableName + "</b> successfully created on Redshift !!</b><br />",
                "New table created successfully!!");

              setTimeout(FormWizard.loadRedshiftTree(), 500);
            });

          } else if (jsTargetServerType == "'Hive'") {

            var hiveQuery = $.postJSON("/Syra-1.0.0-BUILD-SNAPSHOT/QueryOnHive", {
              "srcConnectionStr": "",
              "destConnectionStr": $("input[name=hiveThriftServer2]").val(),
              "srcUserName": "",
              "destUserName": "",
              "srcInputPath": "",
              "srcTableName": "",
              "destTableName": "",
              "srcSchema": "",
              // TODO - Drop column syntax Not working on Hive
              "destSchema": tableSchema,
              "srcSeperator": "",
              "destSeperator": "",
              "s3AccessKey": $("input[name=s3AccessKey]").val(),
              "s3SecreteKey": $("input[name=s3SecreteKey]").val(),
              "tmpDir": "",
              "srcDataLocation": "",
              "destDataLocation": ""
            }, function(data) {
              $("#btnSaveTree").addClass("hide");
              toastr["success"]("<b>A new Table <b>" + tableName + "</b> successfully created on Hive !!</b><br />",
                "New table created successfully!!");

              setTimeout(FormWizard.loadHiveTree("#tree_destination"), 500);
            });

          }

        }
      });

    },
    loadHiveTree: function(treeId) {
      // Calling Hive JSON
    // var hiveCall = $.postJSON("/Syra-1.0.0-BUILD-SNAPSHOT/HiveMeta", {
       var hiveCall = $.get( "demo/hive.json",{
        "hiveThriftServer": $("input[name=hiveThriftServer]").val(),
        "s3AccessKey": $("input[name=s3AccessKey]").val(),
        "s3SecreteKey": $("input[name=s3SecreteKey]").val(),
        "hiveTableName": "",
        "hiveTableSchema": "",
        "hiveTableDataLocation": "",
        "redshiftDBURL": "",
        "redshiftUser": "",
        "redshiftPassword": "",
        "seperator": "",
        "tmpDir": ""
      }, function(data) {
        if (data.length <= 0) {
          // Refresh Source/Target Tree with the output
          $(treeId).jstree(true).settings.core.data = ["No Tables or Metadata did not load properly"];
          $(treeId).jstree(true).refresh();

          return false;
        }
        // Build Database object
        var treePrefix = "source_";

        if (treeId == "#tree_destination") {
          treePrefix = "target_";
        }

        var hiveDatabase = new Object();
        hiveDatabase.id = treePrefix + data[0].database;
        hiveDatabase.text = data[0].database;
        hiveDatabase.type = "database";
        hiveDatabase.state = {
          "opened": true,
          "disabled": false,
          "selected": false
        };

        // Database Node attributes
        hiveDatabase.li_attr = {
          "class": "database"
        };

        // Database Anchor attributes
        hiveDatabase.a_attr = {
          "id": hiveDatabase.id + "_anchor"
        };

        // Iterate Tables and build Table array
        var hiveTables = [];
        $.each(data, function(index, table) {
          // Build current Table
          var hiveTable = new Object();

          hiveTable.id = hiveDatabase.id + "-" + table.tableName;
          hiveTable.text = table.tableName;
          hiveTable.state = {
            "opened": false,
            "disabled": false,
            "selected": false
          };
          hiveTable.type = "table";

          // Table attributes
          hiveTable.li_attr = {
            "data-table-id": hiveTable.id,
            "data-table-name": table.tableName,
            "data-output-format": table.outputFormat,
            "data-table-type": table.tableType,
            "data-input-format": table.inputFormat,
            "data-field-delim": table.fieldDelim,
            "data-data-location": table.dataLocation,
            "data-create-time": table.createTime,
            "data-owner": table.owner
          };

          // Table Anchor attributes
          hiveTable.a_attr = {
            "id": hiveTable.id + "_anchor"
          };

          // Iterate Table columns and build columns array
          var hiveColumns = [];
          $.each(table.schema, function(index2, col) {
            // Build current Column
            var hiveColumn = new Object();

            hiveColumn.id = hiveTable.id + "-" + col.column;
            hiveColumn.text = col.column;
            hiveColumn.type = "column";
            hiveColumn.state = {
              "opened": false,
              "disabled": false,
              "selected": false
            };
            hiveColumn.li_attr = {
              "data-column-id": hiveColumn.id,
              "data-column-name": col.column,
              "data-column-type": col.datatype
            };

            // Column Anchor attributes
            hiveColumn.a_attr = {
              "id": hiveColumn.id + "_anchor"
            };

            // Add current Column to the Columns array
            hiveColumns[index2] = hiveColumn;
          });

          // Set Table Children object (columns)
          hiveTable.children = hiveColumns;

          // Add current Table to the Tables array
          hiveTables[index] = hiveTable;
        });

        // Set Database Children object (tables)
        hiveDatabase.children = hiveTables;

        // Refresh Source/Target Tree with the output
        $(treeId).jstree(true).settings.core.data = hiveDatabase;
        $(treeId).jstree(true).refresh();

      });
    },
    loadHDFSTree: function() {
      // Build Database object
      var hdfsDatabase = new Object();
      hdfsDatabase.id = "HDFS";
      hdfsDatabase.text = "HDFS";
      hdfsDatabase.type = "database";
      hdfsDatabase.state = {
        "opened": true,
        "disabled": false,
        "selected": false
      };

      // Database Node attributes
      hdfsDatabase.li_attr = {
        "class": "database"
      };

      // Database Anchor attributes
      hdfsDatabase.a_attr = {
        "id": hdfsDatabase.id + "_anchor"
      };

      // Iterate Tables and build Table array
      var hdfsFiles = [];
      // Build current Table
      var hdfsFile = new Object();

      var hdfsFileName = $("input[name='hdfsConnectionString']").val();
      var hdfsFieldDelim = $("input[name='hdfsFieldDelim']").val();

      hdfsFile.id = hdfsDatabase.id + "-" + "File";
      hdfsFile.text = hdfsFileName;
      hdfsFile.state = {
        "opened": true,
        "disabled": false,
        "selected": false
      };
      hdfsFile.type = "table";

      // Table attributes
      hdfsFile.li_attr = {
        "data-table-id": hdfsFile.id,
        "data-table-name": hdfsFileName,
        "data-field-delim": hdfsFieldDelim,
      };

      // Table Anchor attributes
      hdfsFile.a_attr = {
        "id": hdfsFile.id + "_anchor"
      };

      // TODO - tmp static cols for demo
      /* var hdfsColumns = [FormWizard.tc("eventid"), FormWizard.tc("venueid"), FormWizard.tc("catid"),
      						FormWizard.tc("dateid"), FormWizard.tc("eventname"), FormWizard.tc("starttime")];
      hdfsFile.children = hdfsColumns;*/

      // Add current Table to the Tables array
      hdfsFiles[0] = hdfsFile;

      // Set Database Children object (tables)
      hdfsDatabase.children = hdfsFiles;

      // Refresh Source Tree with the output
      $('#tree_source').jstree(true).settings.core.data = hdfsDatabase;
      $('#tree_source').jstree(true).refresh();
    },
    loadLocalTree: function() {
      // Build Database object
      var localDatabase = new Object();
      localDatabase.id = "Local";
      localDatabase.text = "Local";
      localDatabase.type = "database";
      localDatabase.state = {
        "opened": true,
        "disabled": false,
        "selected": false
      };

      // Database Node attributes
      localDatabase.li_attr = {
        "class": "database"
      };

      // Database Anchor attributes
      localDatabase.a_attr = {
        "id": localDatabase.id + "_anchor"
      };

      // Iterate Tables and build Table array
      var localFiles = [];
      // Build current Table
      var localFile = new Object();

      var localFileName = $("input[name='s3FileName']").val();
      var localFieldDelim = $("input[name='s3FieldDelim']").val();

      localFile.id = localDatabase.id + "-" + "File";
      localFile.text = localFileName;
      localFile.state = {
        "opened": true,
        "disabled": false,
        "selected": false
      };
      localFile.type = "table";

      // Table attributes
      localFile.li_attr = {
        "data-table-id": localFile.id,
        "data-table-name": localFileName,
        "data-field-delim": localFieldDelim,
      };

      // Table Anchor attributes
      localFile.a_attr = {
        "id": localFile.id + "_anchor"
      };

      // TODO - tmp static cols for demo
      /*var localColumns = [FormWizard.tc("eventid"), FormWizard.tc("venueid"), FormWizard.tc("catid"),
      						FormWizard.tc("dateid"), FormWizard.tc("eventname"), FormWizard.tc("starttime")];
      localFile.children = localColumns;*/

      // Add current Table to the Tables array
      localFiles[0] = localFile;

      // Set Database Children object (tables)
      localDatabase.children = localFiles;

      // Refresh Source Tree with the output
      $('#tree_source').jstree(true).settings.core.data = localDatabase;
      $('#tree_source').jstree(true).refresh();
    },
    loadRedshiftTree: function() {

      $("#btnSaveTree").addClass("hide");

      // Calling Redshift JSON
    // var redshiftCall = $.postJSON("/Syra-1.0.0-BUILD-SNAPSHOT/RedShiftMeta", {
          var redshiftCall = $.get( "demo/redshift2.json",{
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
          "tmpDir": ""
        },
        function(data) {
          var redshiftDatabase = new Object();

          if (data.length == 0) {
            // Build Default Database object
            redshiftDatabase.id = "Redshift";
            redshiftDatabase.text = "Redshift";
            redshiftDatabase.type = "database";
            redshiftDatabase.state = {
              "opened": false,
              "disabled": false,
              "selected": false
            };

            // Database Node attributes
            redshiftDatabase.li_attr = {
              "class": "database"
            };

            // Database Anchor attributes
            redshiftDatabase.a_attr = {
              "id": redshiftDatabase.id + "_anchor"
            };
          } else {
            // Build Database object from the data
            // Redshift don't have a database id
            redshiftDatabase.id = "Redshift";
            redshiftDatabase.text = "Redshift";
            //redshiftDatabase.id = data[0].database;
            //redshiftDatabase.text = data[0].database;
            redshiftDatabase.type = "database";
            redshiftDatabase.state = {
              "opened": true,
              "disabled": false,
              "selected": false
            };

            // Database Node attributes
            redshiftDatabase.li_attr = {
              "class": "database"
            };

            // Database Anchor attributes
            redshiftDatabase.a_attr = {
              "id": redshiftDatabase.id + "_anchor"
            };

            // Iterate Tables and build Table array
            var redshiftTables = [];
            $.each(data, function(index, table) {
              // Build current Table
              var redshiftTable = new Object();

              redshiftTable.id = redshiftDatabase.id + "-" + table.tableName;
              redshiftTable.text = table.tableName;
              redshiftTable.state = {
                "opened": false,
                "disabled": false,
                "selected": false
              };
              redshiftTable.type = "table";

              // Table attributes
              redshiftTable.li_attr = {
                "data-table-id": redshiftTable.id,
                "data-table-name": table.tableName,
                "data-output-format": table.outputFormat,
                "data-table-type": table.tableType,
                "data-input-format": table.inputFormat,
                "data-field-delim": table.fieldDelim,
                "data-data-location": table.dataLocation,
                "data-create-time": table.createTime,
                "data-owner": table.owner
              };

              // Table Anchor attributes
              redshiftTable.a_attr = {
                "id": redshiftTable.id + "_anchor"
              };

              // Iterate Table columns and build columns array
              var redshiftColumns = [];
              $.each(table.schema, function(index2, col) {
                // Build current Column
                var redshiftColumn = new Object();

                redshiftColumn.id = redshiftTable.id + "-" + col.column;
                //redshiftColumn.text = col.column + " [" + col.datatype + "]";
                redshiftColumn.text = col.column;
                redshiftColumn.type = "column";
                redshiftColumn.state = {
                  "opened": true,
                  "disabled": false,
                  "selected": false
                };
                redshiftColumn.li_attr = {
                  "data-column-id": redshiftColumn.id,
                  "data-column-name": col.column,
                  "data-column-type": col.datatype
                };

                // Column Anchor attributes
                redshiftColumn.a_attr = {
                  "id": redshiftColumn.id + "_anchor"
                };

                // Add current Column to the Columns array
                redshiftColumns[index2] = redshiftColumn;
              });

              // Set Table Children object (columns)
              redshiftTable.children = redshiftColumns;

              // Add current Table to the Tables array
              redshiftTables[index] = redshiftTable;
            });

            // Set Database Children object (tables)
            redshiftDatabase.children = redshiftTables;
          }

          // Refresh Destination Tree with the output
          $('#tree_destination').jstree(true).settings.core.data = redshiftDatabase;
          $('#tree_destination').jstree(true).refresh();

        });

    },
    migrate: function(migrateFlag) {

      // Run Migrate or Save mapping (with migrateFlag = false

      var connections = jsPlumb.getConnections();
      var jsonArray = [];

      $("#migration-messages").html("");

      var jsTreeSource = $('#tree_source').jstree(true);
      var jsTreeTarget = $('#tree_destination').jstree(true);

      for (var conn in connections) {
        var source_node = jsTreeSource.get_node(connections[conn].sourceId);
        var target_node = jsTreeTarget.get_node(connections[conn].targetId);

        // Handle whole table migration
        if (target_node.type == "table") {
          var sourceTableName = source_node.li_attr["data-table-name"];
          var tableName = target_node.li_attr["data-table-name"];
          var sourceDataLocation = source_node.li_attr["data-data-location"];
          var sourceFieldDelim = source_node.li_attr["data-field-delim"];
          var fieldDelim = target_node.li_attr["data-field-delim"];
          var tableSchema = "create table " + tableName;
          var tableColumns = ""

          var jsServerType = $(".btn-server-type.active").attr("btn-radio");
          var jsTargetServerType = $(".btn-target-server-type.active").attr("btn-radio");

          for (var child in target_node.children_d) {
            var column = jsTreeTarget.get_node(target_node.children_d[child]);

            if (child > 0) {
              tableColumns += ",";
            }
            tableColumns += column.li_attr["data-column-name"];

            if (jsTargetServerType == "'Redshift'") {

              tableColumns += " " + column.li_attr["data-column-type"];

            } else if (jsTargetServerType == "'Hive'") {

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


          if (jsServerType == "'Hive'" && jsTargetServerType == "'Redshift'") {
            tableSchema = "" + "(" + tableColumns + ")";

            var jsonData = {
              "hiveThriftServer": $("input[name=hiveThriftServer]").val(),
              //TODO - remove hardwiring of HDFS URL replacing
              "hiveTableDataLocation": sourceDataLocation.replace("hdfs://syra-instace.c.syra-io.internal:8020", ""),
              "hiveTableName": tableName,
              "hiveTableSchema": tableSchema,
              "seperator": fieldDelim,
              // "seperator": "\t",
              "s3AccessKey": $("input[name=s3AccessKey]").val(),
              "s3SecreteKey": $("input[name=s3SecreteKey]").val(),
              "redshiftDBURL": $("input[name=redshiftDBURL]").val(),
              "redshiftUser": $("input[name=redshiftUser]").val(),
              "redshiftPassword": $("input[name=redshiftPassword]").val(),
              "tmpDir": $("input[name=hdfsTmpDir]").val()
            };

            // Just return the JSON if save mappings is clicked !!
            if (migrateFlag == false) {
              jsonArray.push(jsonData);
              continue;
            }

            $("#migration-messages").append("<b>Migrating " + jsServerType + "." + tableName + " to Redshift</b><br />");
            Metronic.scrollTo($('#migration-messages-header'));
            toastr["info"]("<b>Migrating " + jsServerType + "." + tableName + " to Redshift</b>", "Migrating to Redshift..");
            $('#form_wizard_1').find('.button-submit').addClass("disabled");

            var hiveToRedshiftCall = $.postJSON("/Syra-1.0.0-BUILD-SNAPSHOT/HiveToRedshift", jsonData, function(data) {
              $("#migration-messages").append("<b>Table " + jsServerType + "." + tableName + " successfully migrated to Redshift !!</b><br />");
              Metronic.scrollTo($('#migration-messages-header'));
              toastr["success"]("<b>Table " + jsServerType + "." + tableName + " successfully migrated to Redshift !!</b>", "Migration Successful !!");
            });
          } else if (jsServerType == "'Hive'" && jsTargetServerType == "'Hive'") {
            tableSchema = tableName + "(" + tableColumns + ")";

            var jsonData = {
              "srcConnectionStr": $("input[name=hiveThriftServer]").val(),
              "destConnectionStr": $("input[name=hiveThriftServer2]").val(),
              "srcUserName": "",
              "destUserName": "",
              "srcInputPath": "",
              "destOutputpath": "",
              "srcTableName": sourceTableName,
              "destTableName": tableName,
              "srcSchema": "",
              "destSchema": tableSchema,
              "srcSeperator": sourceFieldDelim,
              "destSeperator": fieldDelim,
              "s3AccessKey": $("input[name=s3AccessKey]").val(),
              "s3SecreteKey": $("input[name=s3SecreteKey]").val(),
              "tmpDir": "",
              "srcDataLocation": sourceDataLocation.replace("hdfs://syra-instace.c.syra-io.internal:8020", ""),
              "destDataLocation": ""

              //TODO - remove hardwiring of HDFS URL replacing
              //TODO - destDataLocation needed?? "hdfs://ip-10-0-0-224.ec2.internal:8020/data"
            };

            // Just return the JSON if save mappings is clicked !!
            if (migrateFlag == false) {
              jsonArray.push(jsonData);
              continue;
            }

            $("#migration-messages").append("<b>Migrating " + jsServerType + "." + tableName + " to " + jsTargetServerType + "</b><br />");
            Metronic.scrollTo($('#migration-messages-header'));
            toastr["info"]("<b>Migrating " + jsServerType + "." + tableName + " to " + jsTargetServerType + "</b>", "Migrating to " + jsTargetServerType + "..");
            $('#form_wizard_1').find('.button-submit').addClass("disabled");

            var hiveToHiveCall = $.postJSON("/Syra-1.0.0-BUILD-SNAPSHOT/HiveToHive", jsonData, function(data) {
              $("#migration-messages").append("<b>Table " + jsServerType + "." + tableName + " successfully migrated to " + jsTargetServerType + " !!</b><br />");
              Metronic.scrollTo($('#migration-messages-header'));
              toastr["success"]("<b>Table " + jsServerType + "." + tableName + " successfully migrated to " + jsTargetServerType + " !!</b>", "Migration Successful !!");
            });
          } else if (jsServerType == "'HDFS'" && jsTargetServerType == "'Redshift'") {
            tableSchema = tableSchema + "(" + tableColumns + ")";

            var jsonData = {
              "hdfs": $("input[name=hdfsPath]").val(),
              "hdfsFileName": $("input[name=hdfsConnectionString]").val(),
              "hdfsAccessUser": $("input[name=hdfsAccessUser]").val(),
              "seperator": $("input[name=hdfsFieldDelim]").val(),
              "tableName": tableName,
              "tableSchema": tableSchema,
              "s3AccessKey": $("input[name=s3AccessKey]").val(),
              "s3SecreteKey": $("input[name=s3SecreteKey]").val(),
              "redshiftDBURL": $("input[name=redshiftDBURL]").val(),
              "redshiftUser": $("input[name=redshiftUser]").val(),
              "redshiftPassword": $("input[name=redshiftPassword]").val(),
              "tmpDir": $("input[name=hdfsTmpDir]").val()
            };

            // Just return the JSON if save mappings is clicked !!
            if (migrateFlag == false) {
              jsonArray.push(jsonData);
              continue;
            }

            $("#migration-messages").append("<b>Migrating " + jsServerType + "." + tableName + " to Redshift</b><br />");
            Metronic.scrollTo($('#migration-messages-header'));
            toastr["info"]("<b>Migrating " + jsServerType + "." + tableName + " to Redshift</b>", "Migrating to Redshift..");
            $('#form_wizard_1').find('.button-submit').addClass("disabled");

            var hdfsToRedshiftCall = $.postJSON("/Syra-1.0.0-BUILD-SNAPSHOT/HdfsToRedshift", jsonData, function(data) {
              $("#migration-messages").append("<b>Table " + jsServerType + "." + tableName + " successfully migrated to Redshift !!</b><br />");
              Metronic.scrollTo($('#migration-messages-header'));
              toastr["success"]("<b>Table " + jsServerType + "." + tableName + " successfully migrated to Redshift !!</b>", "Migration Successful !!");
            });
          } else if (jsServerType == "'Local'" && jsTargetServerType == "'Redshift'") {
            tableSchema = tableSchema + "(" + tableColumns + ")";

            // Get S3 File name from URL
            var s3FileUrl = $("input[name=s3FileUrl]").val();
            var s3FileName = s3FileUrl.substring(s3FileUrl.lastIndexOf("/") + 1);

            var jsonData = {
              "hdfs": $("input[name=hdfsPath]").val(),
              "localS3FilePath": "s3://syra-usa-standard/" + s3FileName, // $("input[name=s3FileUrl]").val(), // TODO bucket name hard-wired??
              "hdfsAccessUser": $("input[name=hdfsAccessUser]").val(),
              "seperator": $("input[name=s3FieldDelim]").val(),
              "tableName": tableName,
              "tableSchema": tableSchema,
              "s3AccessKey": $("input[name=s3AccessKey]").val(),
              "s3SecreteKey": $("input[name=s3SecreteKey]").val(),
              "redshiftDBURL": $("input[name=redshiftDBURL]").val(),
              "redshiftUser": $("input[name=redshiftUser]").val(),
              "redshiftPassword": $("input[name=redshiftPassword]").val(),
              "tmpDir": $("input[name=hdfsTmpDir]").val()
            };

            // Just return the JSON if save mappings is clicked !!
            if (migrateFlag == false) {
              jsonArray.push(jsonData);
              continue;
            }

            $("#migration-messages").append("<b>Migrating " + jsServerType + "." + tableName + " to Redshift</b><br />");
            Metronic.scrollTo($('#migration-messages-header'));
            toastr["info"]("<b>Migrating " + jsServerType + "." + tableName + " to Redshift</b>", "Migrating to Redshift..");
            $('#form_wizard_1').find('.button-submit').addClass("disabled");

            var localToRedshiftCall = $.postJSON("/Syra-1.0.0-BUILD-SNAPSHOT/LocalToRedshift", jsonData, function(data) {
              $("#migration-messages").append("<b>Table " + jsServerType + "." + tableName + " successfully migrated to Redshift !!</b><br />");
              Metronic.scrollTo($('#migration-messages-header'));
              toastr["success"]("<b>Table " + jsServerType + "." + tableName + " successfully migrated to Redshift !!</b>", "Migration Successful !!");
            });
          }
        } else if (target_node.type == "column") {
          var $targetTable = $("#" + target_node.parent);

          // Check if the target table is already processed
          // Save Mapping should be allowed after Submit/Migrate or vice versa !!

          if ((migrateFlag == true && $targetTable.attr("data-table-processed") == "true") ||
            (migrateFlag == false && $targetTable.attr("data-table-processed-nomigrate") == "true")) {
            continue;
          }

          var sourceTable = jsTreeSource.get_node(source_node.parent);
          var targetTable = jsTreeTarget.get_node(target_node.parent);
          var tableName = sourceTable.li_attr["data-table-name"];
          var dataLocation = sourceTable.li_attr["data-data-location"];
          var fieldDelim = sourceTable.li_attr["data-field-delim"];

          //TODO - disable mapping from multiple tables in to single table??
          var destTableName = targetTable.li_attr["data-table-name"];;

          var sourceColumns = "",
            targetColumns = "";

          for (var child in targetTable.children_d) {
            var connections2 = jsPlumb.getConnections({
              target: targetTable.children_d[child] + '_anchor',
            });

            if (connections2.length > 0) {
              var sourceColumnName = $("#" + connections2[0].sourceId).parent().attr("data-column-name");
              var targetColumnName = $("#" + connections2[0].targetId).parent().attr("data-column-name");

              if (sourceColumns != "") {
                sourceColumns = sourceColumns + ",";
                targetColumns = targetColumns + ",";
              }

              sourceColumns = sourceColumns + sourceColumnName;
              targetColumns = targetColumns + targetColumnName;
            } else {
              continue;
            }
          }

          var columnMappings = (sourceColumns + "-" + targetColumns);

          var jsServerType = $(".btn-server-type.active").attr("btn-radio");
          var jsTargetServerType = $(".btn-target-server-type.active").attr("btn-radio");

          if (jsServerType == "'Hive'" && jsTargetServerType == "'Redshift'") {

            var jsonData = {
              "hiveThriftServer": $("input[name=hiveThriftServer]").val(),
              "hiveTableDataLocation": dataLocation,
              "hiveTableName": tableName,
              "hiveTableSchema": "",
              "seperator": fieldDelim,
              "s3AccessKey": $("input[name=s3AccessKey]").val(),
              "s3SecreteKey": $("input[name=s3SecreteKey]").val(),
              "redshiftDBURL": $("input[name=redshiftDBURL]").val(),
              "redshiftUser": $("input[name=redshiftUser]").val(),
              "redshiftPassword": $("input[name=redshiftPassword]").val(),
              "tmpDir": $("input[name=hdfsTmpDir]").val(),
              "destTableName": destTableName,
              "mappingrules": columnMappings
            };

            // Just return the JSON if save mappings is clicked !!
            if (migrateFlag == false) {
              jsonArray.push(jsonData);

              // Set Table processed attribute (migrageFlag = false)
              $targetTable.attr("data-table-processed-nomigrate", "true");

              continue;
            }

            $("#migration-messages").append("<b>Migrating " + jsServerType + " columns to Redshift</b><br />");
            Metronic.scrollTo($('#migration-messages-header'));
            toastr["info"]("<b>Migrating " + jsServerType + " columns to Redshift</b>", "Migrating to Redshift..");
            $('#form_wizard_1').find('.button-submit').addClass("disabled");

            var hiveToRedshiftCall = $.postJSON("/Syra-1.0.0-BUILD-SNAPSHOT/HiveToRedshiftMapping", jsonData, function(data) {
              $("#migration-messages").append("<b>Selected columns from " + jsServerType + "." + tableName + " successfully migrated to Redshift !!</b><br />");
              Metronic.scrollTo($('#migration-messages-header'));
              toastr["success"]("<b>Selected columns from " + jsServerType + "." + tableName + " successfully migrated to Redshift !!</b>", "Migration Successful !!");
            });
          } else if (jsServerType == "'HDFS'" && jsTargetServerType == "'Redshift'") {}


          // Set Table processed attribute (migrageFlag = true)
          $targetTable.attr("data-table-processed", "true");

        } // End Individual column mapping
      }

      // Return the constructed jsonArray if migrageFlag = false (Save Mapping!)
      if (migrateFlag == false) {
        return jsonArray;
      }

    },
    notify: function(message, type) {
      $.bootstrapGrowl(message, {
        ele: 'body', // which element to append to
        type: type, // (null, 'info', 'danger', 'success', 'warning')
        icon: "glyphicon glyphicon-" + type + "-sign",
        offset: {
          from: "bottom",
          amount: 0
        }, // 'top', or 'bottom'
        align: "right", // ('left', 'right', or 'center')
        width: 'auto', // (integer, or 'auto')
        delay: "5000", // Time while the message will be displayed. It's not equivalent to the *demo* timeOut!
        allow_dismiss: true, // If true then will display a cross to close the popup.
        stackup_spacing: 10 // spacing between consecutively stacked growls.
      });
    },
    tc: function(name) {
      // Build current Column
      var hdfsColumn = new Object();

      hdfsColumn.id = "HDFS-event" + "-" + name;
      hdfsColumn.text = name;
      hdfsColumn.type = "column";
      hdfsColumn.state = {
        "opened": false,
        "disabled": false,
        "selected": false
      };
      hdfsColumn.li_attr = {
        "data-column-id": hdfsColumn.id,
        "data-column-name": name,
        "data-column-type": "varchar"
      };

      // Column Anchor attributes
      hdfsColumn.a_attr = {
        "id": hdfsColumn.id + "_anchor"
      };

      return hdfsColumn;
    }
  };
}();
