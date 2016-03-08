function save_options() 
{

  localStorage["pitch"] = document.getElementById("pitch").value;
  localStorage["rate"] = document.getElementById("rate").value;
  localStorage["voice"] = document.getElementById("voice").value;
}



function reset_options() 
{
	document.getElementById("pitch").value = 50;
	document.getElementById("rate").value = 175;
	document.getElementById("voice").value = "m6";
	localStorage["pitch"] = document.getElementById("pitch").value;
	localStorage["rate"] = document.getElementById("rate").value;
	localStorage["voice"] = document.getElementById("voice").value;
	
	
	
}

function restore_options() 
{
  document.getElementById("pitch").value = localStorage["pitch"];
  document.getElementById("rate").value = localStorage["rate"];
  document.getElementById("voice").value = localStorage["voice"];

 

  if (!document.getElementById("pitch").value || !document.getElementById("rate").value || !document.getElementById("voice").value) 
  {
    return;
  }
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
document.querySelector('#reset').addEventListener('click', reset_options);