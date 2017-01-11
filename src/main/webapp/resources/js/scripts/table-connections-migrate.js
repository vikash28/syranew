var connSourceTable,connTargetTable;

var TableConnectionsMigrate = function () {

    var initTable = function () {

        var sourceTable = $('#tableSourceConnections');
        var targetTable = $('#tableTargetConnections');
		
		setupTable(sourceTable);
		setupTable(targetTable);
		
		connSourceTable = sourceTable.DataTable();
		connTargetTable = targetTable.DataTable();
    }
	
	var setupTable = function(table){
        /* Fixed header extension: http://datatables.net/extensions/keytable/ */
		
        oTable = table.dataTable({

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
				url: "/Syra/connection/",
				type: 'GET',
				"dataSrc": "connections"
				
			},
			columns: [
				{ data: "connectionName", className: "font-blue-chambray" },
				{ data: "connectionType", className: "font-blue-chambray" },
				{
					data: null,
					defaultContent: '',
					className: "font-blue-chambray"
				},
				{
					data: null,
					className: "center font-blue-chambray",
					defaultContent: '<a class="btn btn-primary btn-sm use" href="javascript:;"><i class="fa fa-star-o"></i>Use</a>'
				}
			],
			"fnCreatedRow": function( nRow, aData, iDataIndex ) {
				$(nRow).attr("id","conn-" + aData.id);
			},
			fnInitComplete : function() {
				if ($(this).find('tbody tr').length<=1) {
					$(this).closest(".portlet").hide();
				}
			},		
            "order": [
                [0, 'asc']
            ],
            "lengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],
            "pageLength": 5, // set the initial value,
            "columnDefs": [{  // set default column settings
                'orderable': false,
                'targets': [3]
            }, {
                "searchable": false,
                "targets": [3]
            }, {
                "width": "80px",
                "targets": [3]
            },{
                "width": "400",
                "targets": [2]
            },{
				// Dynamically setup URL column based on Server type !!

                // The `data` parameter refers to the data for the cell (defined by the
                // `data` option, which defaults to the column being worked with, in
                // this case `data: 0`.
                "render": function ( data, type, row ) {
					if(row.connectionType == "Hive"){
						return row.hiveThriftServer;
					} else if(row.connectionType == "HDFS"){
						return row.hdfsConnectionString;
					} else if(row.connectionType == "Redshift"){
						return row.redshiftDbUrl;
					} else if(row.connectionType == "Local"){
						return row.s3FileUrl;
					}
					
                    return "";
                },
                "targets": 2
            }]
        });

		// No Column reordering is needed
        // var oTableColReorder = new $.fn.dataTable.ColReorder( oTable );

        var tableWrapper = $("#" + table.attr("id") + "_wrapper"); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper
        tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown	
	}

    return {

        //main function to initiate the module
        init: function () {

            if (!jQuery().dataTable) {
                return;
            }

            initTable();

        }

    };

}();