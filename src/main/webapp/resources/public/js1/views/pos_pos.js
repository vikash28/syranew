$(document).ready(function(){ 
jQuery.fn.ForceAlphaNumericOnly =
    function()
    {
         
        return this.each(function()
        {
            $(this).keydown(function(e)
            {
                var key = e.charCode || e.keyCode || 0;
                // allow backspace, tab, delete, arrows, letters, numbers and keypad numbers ONLY
                return (
                    key == 8 || 
                    key == 9 ||
                    key == 46 ||
                    key == 32 ||
                    (key >= 37 && key <= 40) ||
                    //(key >= 48 && key <= 57) ||
                    (key >= 65 && key <= 90) ||
                    (key >= 96 && key <= 105));
            })
        })
};
$('#guest_name_id').ForceAlphaNumericOnly();

$('#delivering_time').datetimepicker({
            timeOnly: true,
            controlType: 'select',
            oneLine: true,
            timeFormat: 'HH:mm:ss',
            currentText: "Current Time"
        });

$('.category_button').click(function()
{
    var select_button_id=$(".btn.btn-inverse.btn-rounded.category_button").attr('id');
    $( "#"+select_button_id ).removeClass('btn btn-inverse btn-rounded category_button').addClass( "btn btn-danger btn-rounded category_button" ); 
    var id=$(this).attr('id');
    $( "#"+id ).removeClass('btn btn-danger btn-rounded category_button').addClass( "btn btn-inverse btn-rounded category_button" ); 
    var category_id=id.split('_');
    var allmenu_by_category_array= allmenu_by_category;
    
    var item_value_array_filter=getObjects(allmenu_by_category_array, 'category_id',category_id[1] ); 
    var allmenu_by_category_array=JSON.stringify(item_value_array_filter);
    $("#menu_item").html('');  
    $.each(item_value_array_filter, function (index, valueobj) {
        $("#menu_item").append('<button type="button" class="square" id="menu_'+valueobj['menu_item_id']+'">'+valueobj['menu_name']+'</button>');      
     }); 
});
$('.room_service').click(function()
{
    var select_button_id=$(".btn.btn-inverse.room_service").attr('id');
    $( "#"+select_button_id ).removeClass('btn btn-inverse  room_service').addClass( "btn btn-danger room_service" ); 
    var id=$(this).attr('id');
    $( "#"+id ).removeClass('btn btn-danger room_service').addClass( "btn btn-inverse  room_service" );
    if(id=="take_away")
    {
    $("#guest_name_id").val('');
    $("#mobile_id").val('');
    $("#bookingid").val('');
    $("#guest_error").html(''); 
    $('#mobile_error').html(''); 
    
    //$('#mobile').show();
    //$('#guest_name').show();
    $('#mobile').hide();
    $('#guest_name').hide();
    $('#room_number').hide();
    $('#steward').hide();
    $('#booking_id').hide();
    $('#table_no').hide();    
    }
    if(id=="room_service")
    {
    $("#guest_name_id").val('');
    $("#mobile_id").val('');
    $("#bookingid").val('');
    $('#room_number option:selected').removeAttr('selected');
    $('#steward option:selected').removeAttr('selected');
    $('#room_number').show();
    $('#guest_name').show();
    $('#mobile').show();
    $('#steward').show();
    $('#booking_id').show();
    $("#guest_error").html('');
    $("#room_number_error").html(''); 
    $('#mobile_error').html('');   
    $("#steward_error").html(''); 
    $('#table_no').hide(); 
    }
    if(id=="dine_in")
    {
    $("#guest_name_id").val('');
    $("#mobile_id").val('');
    $("#bookingid").val('');
    $('#table_no option:selected').removeAttr('selected');
    $('#steward option:selected').removeAttr('selected');
    $('#room_number').hide();
    $('#guest_name').show();
    $('#mobile').show();
    $('#steward').show();
    $('#booking_id').hide();
    $('#table_no').show(); 
    $("#guest_error").html('');
    $("#table_no_error").html('');
    $('#mobile_error').html('');   
    $("#steward_error").html('');     
    }
});     
$(document).on('click', '.square', function(){
    var menu=$(this).attr('id');
    var idsplit=menu.split('_');
    //var category_id=idsplit[1];
    var menu_id=idsplit[1];
    get_menu_div(menu_id);
});


$(document).on('click', '#cross_button', function(){
      $(this).closest( 'tr').remove();
      var item_count=1;
      $('#item_add tbody tr').each(function() { 
      $(this).find("td:eq(0)").text(item_count);
      $(this).find("td:eq(4)").attr('id','sub_total_'+item_count);
      $(this).find("td:eq(1)").find('input').attr('id','no_of_quantity_'+item_count);
      $(this).find("td:eq(3)").find('input').attr('id','rate_per_quantity_'+item_count);
      item_count++;
  });
      total();
});

$(document).on('keyup', '.item_class', function(){
    var value=$(this).val();
    var intRegex = /^\d+$/;
    if(!intRegex.test(value)) {
    $(this).val(0)
    }
    total();
});
$("#auto_complete_menu").select2();
$(document).on('change', '#auto_complete_menu', function(){
    var menu=$(this).val();
    if(menu !="")
    {
    var idsplit=menu.split('_');
    var menu_id=idsplit[1]
    get_menu_div(menu_id);
    }
   
});
$( "#submit_order" ).click(function v() {
    
    var rowCount = $('#item_add tbody tr').length; 
    var room_number=$("#room_number_id").val();
    var guest_name=$("#guest_name_id").val();
    var mobile=$("#mobile_id").val();
    var steward=$("#steward_id").val();
    var steward_text=$("#steward_id option:selected").text();
    var booking_id=$("#bookingid").val();
    var table_no=$("#table_no_id").val();
    var table_no_text=$("#table_no_id option:selected").text();
    var room_service=$(".btn.btn-inverse.room_service").attr('id');
    if( steward_text =="Select Steward" ) {steward_text="N/A"; }
    if(room_service=="take_away")
    {
        if(guest_name=="" )
        {
        guest_name="N/A";
        //$("#guest_error").html('Please enter Guest Name');
        }
        else
        {
        $("#guest_error").html('');    
        }
 
        if( mobile=='')
        {
        mobile="N/A";
        //$("#mobile_error").html('Please enter Mobile No');
        }
        else
        {
        $("#mobile_error").html('');
        }
        
        // if ( guest_name==""  ||  mobile=='' )
        // { flag=false;}
        // else
        // { flag=true;}
        flag=true;
        $("#kot_room_number").html('');
        $("#kot_room_number").html('N/A');
        $("#kot_stward").html('');
        $("#kot_stward").html('N/A');
        $("#kot_table_no").html('');
        $("#kot_table_no").html('N/A');


    } 

    if(room_service=="room_service")
    {
        if(room_number=="" )
        {
        $("#room_number_error").html('Please select Room Number');
        swal("Please select Room Number.");
        }
        else
        {
        $("#room_number_error").html('');    
        }
 
        if(guest_name=="" )
        {
        guest_name="N/A";
        }
        else
        {
        $("#guest_error").html('');    
        }
 
        if( mobile=='')
        {
        mobile="N/A";
        }
        else
        {
        $("#mobile_error").html('');
        }
    
        if(   steward=='')
        {
        //$("#steward_error").html('Please select Steward');
        steward=0;
        }
        else
        {
        $("#steward_error").html('');
        }
         // if (  room_number==""   ||  steward==''   ||  guest_name=="" ||  mobile=='' )
        if (  room_number==""  )
        { flag=false;}
        else
        { flag=true;}
        $("#kot_room_number").html('');
        $("#kot_room_number").html(room_number);
        $("#kot_stward").html('');
        $("#kot_stward").html(steward_text);
        $("#kot_table_no").html('');
        $("#kot_table_no").html('N/A');

    } 
    if(room_service=="dine_in")
    {
        if(guest_name=="" )
        {
        guest_name="N/A";
        }
        else
        {
        $("#guest_error").html('');    
        }
 
        if( mobile=='')
        {
        mobile="N/A";
        }
        else
        {
        $("#mobile_error").html('');
        }
    
        if(   steward=='')
        {
        steward=0;
        }
        else
        {
        $("#steward_error").html('');
        }

        if(  table_no=='')
        {
        $("#table_no_error").html('Please select Table No');
        swal("Please select Table No.");}
        else
        {
        $("#table_no_error").html('');
        }

        if (  table_no==""  )
        { flag=false;}
        else
        { flag=true;}

        $("#kot_room_number").html('');
        $("#kot_room_number").html('N/A');
        $("#kot_stward").html('');
        $("#kot_stward").html(steward_text);
        $("#kot_table_no").html('');
        $("#kot_table_no").html(table_no_text);

    } 



    if(rowCount != 0  && flag==true)
    {
    $("#item_add_body").html('');
 
      $('#item_add tbody tr').each(function() {

      var newRowContent="";

      var no_of_quantity=$(this).find("td:eq(1)").find('input').val();
      var item_name=$(this).find("td:eq(2)").text();
      var item_id=$(this).find("td:eq(2)").attr('id');
      item_id=item_id.split('_');
      var rate_per_quantity=$(this).find("td:eq(3)").find('input').val();
      var sub_total=$(this).find("td:eq(4)").text();
    newRowContent='<tr><td>'+(item_name)+'</td><td>'+(no_of_quantity)+'</td></tr>';
      $("#item_add_body").append(newRowContent);  
  });

   
    var special_instructions=$("#special_instructions").val();
    $("#special_instruction_comment").html(special_instructions);

    $("#show_kot").modal('show');
    }
 
});

    $( "#add_special_instruction" ).click(function() {
    $("#add_special_instruction_modal").modal('show');
});

$(document).on('click', '#submit_kot', function(){ 
    var item_array_new=[];
    var room_number=$("#room_number_id").val();
    var guest_name=$("#guest_name_id").val();
    var mobile=$("#mobile_id").val();
    var steward=$("#steward_id").val();
    var booking_id=$("#bookingid").val();
    var table_no=$("#table_no_id").val();
    var room_service=$(".btn.btn-inverse.room_service").attr('id');
    var special_instructions=$("#special_instructions").val();
    var delivering_time=$('#delivering_time').val();

    var not_chargeable_class=$('#not_chargeable').attr('class');
    if(not_chargeable_class =='btn btn-default')
    {  var not_chargeable=0; } else {var not_chargeable=1; }
    var item_total_price=$('#total_item_price_hidden').val();
    
    $('#item_add tbody tr').each(function() {
      var no_of_quantity=$(this).find("td:eq(1)").find('input').val();
      var item_name=$(this).find("td:eq(2)").text();
      var item_id=$(this).find("td:eq(2)").attr('id');
      item_id=item_id.split('_');
      var rate_per_quantity=$(this).find("td:eq(3)").find('input').val();
      var sub_total=$(this).find("td:eq(4)").text();
      var add_vat=$(this).find("td:eq(5)").find('input').val();
      var alcholoc_beverage=$(this).find("td:eq(0)").find('input').val();
      item_array_new.push({'no_of_quantity' :no_of_quantity,'item_id':item_id[3],'item_name' :item_name, 'rate_per_quantity' :rate_per_quantity,'sub_total' :sub_total,'add_vat':add_vat,'alcholoc_beverage':alcholoc_beverage,});
      //total_array_merge.push(total_array); 
  });
    var url = window.location;
    var base_url = url.protocol + "//" + url.host + "/" + url.pathname.split('/')[1];
         $.ajax({
             url:  base_url+"/pos_pos/additem",
             type: "POST",
             data: { room_number:room_number,guest_name:guest_name,mobile:mobile,steward:steward,booking_id:booking_id,table_no:table_no, item_array:item_array_new,room_service:room_service,special_instruction:special_instructions,delivering_time:delivering_time,not_chargeable:not_chargeable,item_total_price:item_total_price},
             //dataType: 'json',
             success: function (data) {  $("#add_special_instruction_modal").modal('hide'); window.location.reload();  window.open(base_url+'/pos_pos/kot_design/'+data, '_blank'); //alert(data);///window.location.reload(); //alert(data); $("html").html(data);  
             },error: function (xhr, ajaxOptions, thrownError) {alert("ERROR:" + xhr.responseText+" - "+thrownError);}
             , async: false
          });

   
});

$(document).on('keypress', '#mobile_id', function(e){  
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        $('#mobile_error').html("Digits Only").show().fadeOut("slow");
        return false;
    }    
});
      

// $("#guest_name_id").keypress(function (e){
//             var code =e.keyCode || e.which;
//             if((code<65 || code>90)&&(code<97 || code>122)&&code!=32&&code!=46){
//                // swal("", "Only alphabates are allowed.", "error");
//                $('#guest_error').html("Only alphabates are allowed").show().fadeOut("slow");
//                 return false;
//             }
//         });     
$(document).on('keydown', '#guest_name_id', function(e){ 
            if (e.which === 32 &&  e.target.selectionStart === 0){
             $('#guest_error').html("First character cannot be blank!").show().fadeOut("slow");         
                return false;             
            } 
});

$(document).on('change', '#room_number_id', function(){
    var roomno=$(this).val();
    
    if(roomno !="")
    {
    var allmenu_by_category_array= today_occupancy;
    var item_value_array_filter=getObjects(allmenu_by_category_array, 'rooms',roomno); 
    var allmenu_by_category_array=JSON.stringify(item_value_array_filter);

    $.each(item_value_array_filter, function (index, valueobj) {
    $("#guest_name_id").val(valueobj['guest_name']);
    $("#mobile_id").val(valueobj['guest_phone']);
    $("#bookingid").val(valueobj['booking_reference']);
    });  
    }
    else
    {
    $("#guest_name_id").val('');
    $("#mobile_id").val('');
    $("#bookingid").val('');    
    } 
});
$(document).on('click', '#not_chargeable', function(){
    var not_chargeable_class=$(this).attr('class');
    var item_total_price=$('#total_item_price_hidden').val();
    if(not_chargeable_class=='btn btn-default')
    { 
    $(this).removeClass('btn btn-default').addClass( "btn btn-danger btn-default" );
    $("#total_item_price").html('<input type="hidden" id="total_item_price_hidden" value="'+parseFloat(item_total_price)+'"><b>Amount:</b> '+parseFloat(0));
    }
    else
    {
    $(this).removeClass('btn btn-danger btn-default').addClass( "btn btn-default" );
    $("#total_item_price").html('<input type="hidden" id="total_item_price_hidden" value="'+parseFloat(item_total_price)+'"><b>Amount:</b> '+parseFloat(item_total_price));
    }
    var total_item_price=$("#total_item_price_hidden").val();
});
function total()
{
    var item_total=0;
    var item_total_price=0.0;
    var sub_total=0;
    var rowCount = $('#item_add tbody tr').length;
    if(rowCount  == 1  || rowCount > 0 )
    {
    $(".special_instruction_not_chargeable_div").show();
    $('#submit_order_div').show();
    }
    if( rowCount == 0)
    {
    $(".special_instruction_not_chargeable_div").hide();
    $('#submit_order_div').hide();
    }
    for( var i=1;i <= rowCount;i++ ){
    // var id=$(this).attr('id');
    // var idsplit=id.split('_');
    
    // var menu_id=idsplit[3];
    var no_of_quantity=$("#no_of_quantity_"+i).val();
    var rate_per_quantity=$("#rate_per_quantity_"+i).val();
    sub_total=(parseInt(no_of_quantity)*parseFloat(rate_per_quantity).toFixed(2));
    $("#sub_total_"+i).html(parseFloat(sub_total).toFixed(2));
    item_total=item_total+parseInt(no_of_quantity);
    item_total_price=parseFloat(item_total_price)+(parseFloat(sub_total));

     }
    var not_chargeable_class=$('#not_chargeable').attr('class');
    if(not_chargeable_class =='btn btn-default')
    {  var total=item_total_price; } else {var total=0; }

    $("#total_item").html('<b>Items:</b> '+parseInt(rowCount));
    $("#total_item_price").html('<input type="hidden" id="total_item_price_hidden" value="'+parseFloat(item_total_price)+'"><b>Amount:</b> '+parseFloat(total));
}
function get_menu_div(menu_id)
{

    if ( $('#menu_item_id_'+menu_id).length){
    var index_value=$("#menu_item_id_"+menu_id).parents("tr").find("td:first").text();
    var no_of_quantity=$("#no_of_quantity_"+index_value).val();
    $("#no_of_quantity_"+index_value).val(parseInt(no_of_quantity)+1); 
    window.setTimeout(function(){$('#no_of_quantity_'+index_value).select();}, 0);
    } 
    else {
    var allmenu_by_category_array= allmenu_by_category;
    var item_value_array_filter=getObjects(allmenu_by_category_array, 'menu_item_id',menu_id); 
    var allmenu_by_category_array=JSON.stringify(item_value_array_filter);
    var rowCount = $('#item_add tbody tr').length;
    var rowvalue=parseInt(rowCount)+1;
    $.each(item_value_array_filter, function (index, valueobj) {
    var newRowContent='<tr ><td><input type="hidden" id="alcholoc_beverage_'+rowvalue+'" value="'+valueobj['alcholoc_beverage']+'">'+(rowvalue)+'</td><td><input type="text" class="form-control item_class" id="no_of_quantity_'+rowvalue+'" value="1"></td><td id="menu_item_id_'+menu_id+'">'+valueobj['menu_name']+'</td><td><input type="text" class="form-control item_class" id="rate_per_quantity_'+rowvalue+'" value="'+valueobj['selling_price']+'"></td><td id="sub_total_'+rowvalue+'">'+valueobj['selling_price']+'</td><td><input type="hidden" id="add_vat_'+rowvalue+'" value="'+valueobj['add_vat']+'"><button class="btn btn-icon btn-danger m-b-5" id="cross_button"> <i class="fa fa-remove"></i> </button></td></tr>';
    $("#item_add tbody").append(newRowContent);
    });  window.setTimeout(function(){$('#no_of_quantity_'+rowvalue).select();}, 0); }
    total();
}

});
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}