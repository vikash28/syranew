 jQuery(document).ready(function() {

            $('#deliver_message').hide();
 
            update_all_value(allpos_master_order,allpos_table_status,allpos_take_away_order,most_recent_item_order,allpos_bill_information)
            var url = window.location;
            var base_url = url.protocol + "//" + url.host + "/" + url.pathname.split('/')[1];
            // Form Toggles
            jQuery('.toggle').toggles({off: true});
            $('.toggles').toggles();
            $(document).on('click', '.reset_token', function(){
            swal({
            title: "Reset Token",
            text: "This will Reset Token Number to 1",
            type: "info",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
            }, function () {
            
            setTimeout(function () {

            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
               swal(xmlhttp.responseText);
            }};

            xmlhttp.open("GET", base_url+"/posdashboard/update_token_reset", true);
            xmlhttp.send();
              }, 2000);

            });

            
            });

            $(document).on('click', '.toggle', function(){
            var pos_kot=$(this).attr('id');
            $.ajax({
             url:  base_url+"/posdashboard/update_kot",
             dataType: 'json',
             type: "POST",
             data: { pos_kot:pos_kot,pos_kot_delivered_status:'1'},
             success: function (data) { 
            update_all_value(data.allpos_master_order,data.allpos_table_status,data.allpos_take_away_order,data.most_recent_item_order,data.allpos_bill_information); 
            var message='<div class="alert alert-success" style="text-align:center;"> KOT # '+pos_kot+' has been marked as delivered. <a href="javascript:void(0)" id="'+pos_kot+'"  class="undo_kot" style="margin-left:5px;font-weight:bold;">Undo</a><button type="button" class="close" data-dismiss="alert" >×</button></div>';
             $('.toggle').toggles();
            $('#deliver_message').html(message);
            $('#deliver_message').show();
//window.location.reload();//salert(data);///window.location.reload(); //alert(data); $("html").html(data);  
             },error: function (xhr, ajaxOptions, thrownError) {alert("ERROR:" + xhr.responseText+" - "+thrownError);}
             });
             
             }); 

             $(document).on('click', '.show-kot', function(){
              var pos_id=$(this).attr('id');
             $.ajax({
             url:  base_url+"/posdashboard/get_kot_information",
             dataType: 'json',
             type: "POST",
             data: { pos_id:pos_id},
             success: function (data) {
            $("#item_add_body").html('');
             $.each(data, function (index, valueobj) 
             {
            var date = valueobj['pos_entry_time'];
            var dateSplit = date.split(" ");
            //var dateSplit2 = dateSplit[0].split("-");
            //dateSplit2.reverse().join('-');
            var formattedDate = dateSplit[0].split("-").reverse().join("/");

            var formattedtime = tConvert(dateSplit[1]);       
            $('#kot_order_date').html(formattedDate);
            $('#kot_order_time').html(formattedtime);
            $('#kot_room_number').html(valueobj['pos_room_no']);
            $('#kot_steward').html((valueobj['steward_name'] != null?valueobj['steward_name']:'N/A'  ));
            $('#kot_table_no').html((valueobj['pos_table_number']!=null?valueobj['pos_table_number']:'N/A'));
            $('#special_instruction_comment').html((valueobj['pos_special_instruction']!=null?valueobj['pos_special_instruction']:'N/A'));
            $('#print_kot').attr('href',base_url+'/pos_pos/kot_design/'+valueobj['pos_id']);
            var newRowContent='<tr><td>'+(valueobj['menu_name'])+'</td><td>'+(valueobj['pos_order_quantity'])+'</td></tr>';
            $("#item_add_body").append(newRowContent); 
             });  
             
             },error: function (xhr, ajaxOptions, thrownError) {alert("ERROR:" + xhr.responseText+" - "+thrownError);}
             }); 
             $('#show-kot-modal').modal('show');
             
             });
            

   
            var refreshId = setInterval(function() {
            $.ajax({
            url:  base_url+"/posdashboard/update_session",
            dataType: 'json',
            type: "POST",
            success: function (data) {  
            if(data!="no") { 
            $('#deliver_message').html();
            $('#deliver_message').hide();

               update_all_value(data.allpos_master_order,data.allpos_table_status,data.allpos_take_away_order,data.most_recent_item_order,data.allpos_bill_information); 
               $('.toggle').toggles();
              } 
            }
            });
            }, 1000);
            $.ajaxSetup({ cache: false });

            $(document).on('click', '#print_kot', function(){
            $('#show-kot-modal').modal('hide');   
            });


            $(document).on('click', '.undo_kot', function(){
            var pos_kot=$(this).attr('id');
            $.ajax({
             url:  base_url+"/posdashboard/update_kot",
             dataType: 'json',
             type: "POST",
             data: { pos_kot:pos_kot,pos_kot_delivered_status:'0'},
             success: function (data) { 
            update_all_value(data.allpos_master_order,data.allpos_table_status,data.allpos_take_away_order,data.most_recent_item_order,data.allpos_bill_information); 
            $('.toggle').toggles();
            $('#deliver_message').html();
            $('#deliver_message').hide();
//window.location.reload();//salert(data);///window.location.reload(); //alert(data); $("html").html(data);  
             },error: function (xhr, ajaxOptions, thrownError) {alert("ERROR:" + xhr.responseText+" - "+thrownError);}
             });
             
             }); 
})
function tConvert (time) {
  // Check correct time format and split into components
  time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice (1);  // Remove full string match value
    time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join (''); // return adjusted time or original string
}

function update_all_value(allpos_master_order,allpos_table_status,allpos_take_away_order,most_recent_item_order,allpos_bill_information)
{
$("#responsecontainer").html('');
$("#pos_table_status").html('');
$("#recent_takeaway").html('');
$("#most_item_order").html('');
$("#recent_bills").html('');

var url = window.location;
var base_url = url.protocol + "//" + url.host + "/" + url.pathname.split('/')[1];
if(allpos_master_order !="")
{
$.each(allpos_master_order, function (index, valueobj) {

         var kot_pending_div='<tr><td>'+valueobj['pos_id']+'</td><td><span class="highlight">'+(valueobj['pos_room_no'] !='0'?valueobj['pos_room_no']+'</span>':'<span class="not_applicable">N/A</span>'  )+'</td><td><span class="highlight">'+(valueobj['pos_table_number'] !=null && valueobj['pos_table_number'] !='0'?valueobj['pos_table_number']+'</span>':'<span class="not_applicable">N/A</span>'  )+'</td><td><span class="highlight">'+(valueobj['token_number'] !='0'?valueobj['token_number']+'</span>':'<span class="not_applicable">N/A</span>'  )+'</td><td><span class="highlight">'+(valueobj['steward_name'] != null && valueobj['steward_name'] !='0'?valueobj['steward_name']+'</span>':'<span class="not_applicable">N/A</span>'  )+'</td><td><div class="form-group" align="center"><div class="col-sm-12 control-label"> <div class="toggle toggle-success" id="'+valueobj['pos_id']+'"></div></div></div></td><td><a href="#" data-toggle="modal" id="'+valueobj['pos_id']+'" class="show-kot">View</a></td></tr>';   
         $("#responsecontainer").append(kot_pending_div);
}); 
}
else
{
        $("#responsecontainer").append('<tr><td  colspan="7" align="center" style="font-weight:bold;color:#ef5350;  ">No KOT Orders in Process. Please go to POS and make an order first</td></tr>'); 
}

if(allpos_table_status !="")
{
$.each(allpos_table_status, function (index, valueobj) {

        var pos_table_status_div='<tr><td>'+index+'</td><td style="'+(valueobj=='Vacant'?'color: #33b86c;font-weight:bold;':'')+'">'+valueobj+'</td></tr>';   
         $("#pos_table_status").append(pos_table_status_div);
 });  
}

if(allpos_take_away_order !="")
{
$.each(allpos_take_away_order, function (index_new, valueobj_new) {
        var cnt=0;
        $.each(valueobj_new, function (index, valueobj) 
        {
         var pos_allpos_take_away_order_div='<tr><td>'+(cnt==0?index_new:'')+'</td><td>'+valueobj['menu_name']+'</td></tr>';   
         $("#recent_takeaway").append(pos_allpos_take_away_order_div);
        cnt=1;
    });   
        
 }); 

$('.reset_token_div').html('');
$('.reset_token_div').html('<button type="button" class="btn btn-default btn-rounded m-b-5 reset_token" style="float:right;">Reset Token Number</button>');
}

if(most_recent_item_order !="")
{ 
$.each(most_recent_item_order, function (index, valueobj) {

        var most_recent_item_order_div='<div class="col-md-2"><span class="order_number">'+valueobj['item_order_today']+'</span><br><span class="dish_name">'+valueobj['menu_name']+'</span></div>';   
        $("#most_item_order").append(most_recent_item_order_div);
 }); 
}
else
{
        var d = new Date();
        $("#most_item_order").append("<p style='font-weight:bold;color:#ef5350 '>You have not ordered anything from POS for "+ d.toDateString() +". Once you make an order, you will be able to see statistics here.</p>");
}

if(allpos_bill_information !="")
{ 
$.each(allpos_bill_information, function (index, valueobj) {

        var allpos_bill_information_div='<tr><td>'+valueobj['pos_bill_no']+'</td><td><span class="highlight">'+(valueobj['pos_room_no'] !='0'?valueobj['pos_room_no']+'</span>':'<span class="not_applicable">N/A</span>'  )+'</td><td><span class="highlight">'+(valueobj['pos_table_number'] !=null && valueobj['pos_table_number'] !='0'?valueobj['pos_table_number']+'</span>':'<span class="not_applicable">N/A</span>'  )+'</td><td><span class="highlight">'+(valueobj['token_number'] !='0'?valueobj['token_number']+'</span>':'<span class="not_applicable">N/A</span>'  )+'</td><td><span class="highlight">'+(valueobj['steward_name'] != null && valueobj['steward_name'] !='0'?valueobj['steward_name']+'</span>':'<span class="not_applicable">N/A</span>'  )+'</td><td><span class="highlight" >'+(valueobj['pos_payment_status'] != null && valueobj['pos_payment_status'] =='pending'?'<p style="color: red;">Pending</p>': valueobj['pos_payment_status'] != null && valueobj['pos_payment_status'] =='settle'?'Settled':'Posted To Room '+valueobj['pos_room_no']+'')+'</span></td><td><a href="'+base_url+'/pos_bill/pos_print_bill/'+valueobj['pos_bill_no']+'" data-toggle="modal" id="'+valueobj['pos_bill_no']+'" target="_blank" class="show-bill">Print Bill</a></td></tr>';   

         $("#recent_bills").append(allpos_bill_information_div);
 }); 
}
else
{
        $("#recent_bills").append('<tr><td  colspan="7" align="center" style="color:red;">No Bill has been raised yet, please go to Bill and raise a bill first</td></tr>'); 
}
}