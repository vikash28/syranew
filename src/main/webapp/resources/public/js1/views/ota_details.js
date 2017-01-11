
var base_url;

$(function(){
$("#otaList").hide(); 
$("#resultMessage").hide();  
 $("#resultErrorMessage").hide();
setValidationChecks(); // calling the validation checks function to set the validations for respective OTAS
base_url = $.cookie("base_url");
            }); //end of ready



function setValidationChecks(){
 // this function will set the validation checks for the preloaded ota panels items   

$("table").each(function(){
  $(this).children("tbody").find("tr").each(function(){
   var sel_obj = $(this).find("select");
   setValidationforOtaKeyOnly(sel_obj); 
  });
}); // end of each    


}





function addOtaPanel(s)
{
  
var count_ = $("#tr_element_counter").val();
var totalota_panel_count = parseInt(count_)+1;
$("#tr_element_counter").val(totalota_panel_count);

var hotel_id = $(s).parent().parent().closest("tr").children("td").eq(1).find("input:hidden").val();

$("#otaList select").attr("name","ota"+totalota_panel_count); 
$("#otaList select").attr("data-rule-required","true"); 
panel = "<tr><td>"+$("#otaList").html()+'</td><td><input type="hidden" class="form-control" value="'+hotel_id+'"><input type="text" class="form-control" name="otausername'+totalota_panel_count+'">'
                            +'</td>'
                            +'<td>'
                            +'	            	<input type="text" class="form-control" id="" name="otapassword'+totalota_panel_count+'">'
                            +'	            </td>'
                            +'	            <td>'
			    +      	'<input type="text" class="form-control" id="" name="otakey'+totalota_panel_count+'">'
                            +	            '</td>'
                            +       '<td>'
                            +'<button type="button" class="btn btn-icon btn-success m-b-5" onclick="addOtaPanel(this)">+</button>'
                            +'&nbsp;<button type="button" class="btn btn-icon btn-danger m-b-5" onclick="removeOtaPanel(this)" onmouseover="addremoveOtaPanelInformation(this)" onmouseout="addremoveOtaPanelInformation(this)">-</button>'
                            + '</td></tr>';
                  
$(s).parent().parent().parent().append(panel);
$(s).parent().parent().parent().find("tr:last").effect("highlight",{color: '#ccedda'},1500);
}

function removeOtaPanel(s)
{
// remove all ota panels one by one except keeping the last ota panel    
var total_tr = $(s).parent().parent().parent().find("tr").length;

if (parseInt(total_tr)>1){
$(s).parent().parent().closest("tr").remove();
                         }
                         else {
$(s).parent().parent().closest("tr").effect("highlight",{color: '#ebccd1'});
                         }
                             
                       
}

function addremoveOtaPanelInformation(s){
 // show the warning title message for the last left ota panel    
var total_tr = $(s).parent().parent().parent().find("tr").length;

if (parseInt(total_tr)>1){

$(s).removeAttr("title"); 
                        }
          else{
            $(s).attr("title","At least one OTA is needed for using channel manager.");  
              }       
    
}



function setValidationforOtaKeyOnly(s){  // set the validation rules for different OTAS
ota_id = $(s).val(); // 15 is for goIbibo fixed 
$(s).attr("disabled","true");

   switch(ota_id)
   {
       case "15":  // goIbibo is set for otaKey validation only
       $(s).parent().parent().parent().find("td").eq(1).find("input:text").removeAttr("data-rule-required");
       $(s).parent().parent().parent().find("td").eq(2).find("input:text").removeAttr("data-rule-required");
       $(s).parent().parent().parent().find("td").eq(3).find("input:text").attr("data-rule-required","true");
       break;
       
        default:
       $(s).parent().parent().parent().find("td").eq(1).find("input:text").attr("data-rule-required","true");
       $(s).parent().parent().parent().find("td").eq(2).find("input:text").attr("data-rule-required","true");
       $(s).parent().parent().parent().find("td").eq(3).find("input:text").removeAttr("data-rule-required");
       break;    
                
   }
}








function collectJsonDataForSubmit(){
var json_string="[";
$("table").each(function(){
  $(this).children("tbody").find("tr").each(function(){
   
   var ota_id = $(this).find("td").eq(0).find("select").val(); 
   if(ota_id==""){
       
   swal({
  title: "Information",
  text: "Some OTA's are not selected. Unselected OTA settings will be removed automatically during saving.",
  type: "info",
        });    
  
      }
      else {
   var hotel_id=$(this).find("td").eq(1).find("input:hidden").val();  
   var ota_username = $(this).find("td").eq(1).find("input:text").val();
   var ota_password = $(this).find("td").eq(2).find("input:text").val();
   var ota_key = $(this).find("td").eq(3).find("input:text").val();
  
      json_string += '{"ota_id":'+ota_id
                       +',"hotel_id":'+hotel_id
                       +',"ota_username":"'+ota_username+'"'
                       +',"ota_password":"'+ota_password+'"'
                       +',"ota_key":"'+ota_key+'"'
                       +'},';
           }   
    
  });
}); // end of each    
json_string = json_string.substring(0,(json_string.length-1));

json_string += "]";

return json_string;

}

function submitForm(s){
  $("#resultMessage").hide();  
  $("#resultErrorMessage").hide();  

    
    
$("#ota_panel_form").validate({
   submitHandler: function(form) {
    // do other things for a valid form
   $(s).attr("disabled","true");
   $(s).html('<i class="fa fa-cog fa-spin fa-1x fa-fw margin-bottom"></i>Saving..'); 
   var json_res = collectJsonDataForSubmit();
   //alert(json_res);
   $.post(base_url+"index.php/channel_manager/saveOtaDetails",{"json_string":json_res},function(data){
    
  
   if(data==1){
  $(s).removeAttr("disabled");
  $("#resultMessage").fadeIn(400); 
                } else {
   $(s).removeAttr("disabled");
  $("#resultErrorMessage").effect("pulsate",700);                   
                }
   $(s).html("Save OTA Details");             
   });   
   
  }

});    
    
}






