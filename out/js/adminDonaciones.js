document.addEventListener('DOMContentLoaded',function(){let isEditMode=!1;let edittingId;let donaciones=[];const API_URL='backend/adminDonaciones.php';async function loadDonaciones(){try{const response=await fetch(API_URL,{method:'GET',credentials:'include',});if(response.ok){donaciones=await response.json();renderDonaciones(donaciones)}else{console.error("Error al cargar las donaciones")}}catch(err){console.error(err)}}
function renderDonaciones(donaciones){const donacionList=document.getElementById('donacionList');donacionList.innerHTML='';document.getElementById('totalDonaciones').innerHTML=`<i class="fas fa-hand-holding-usd"></i> ${donaciones.length}`;donaciones.forEach(function(donacion){const row=document.createElement('tr');row.innerHTML=`
                <td>${donacion.monto}</td>
                <td>${donacion.nombre_donante}</td>
                <td>${donacion.email_donante}</td>
                <td>${donacion.metodo_pago}</td>
                <td>${donacion.numero_tarjeta}</td>
                <td>${donacion.fecha_expiracion}</td>
                <td>${donacion.codigo_seguridad}</td>
                <td>${donacion.fecha_donacion}</td>
                <td>
                    <button class="btn btn-success btn-sm edit-donacion" data-id="${donacion.id_donacion}">Editar</button>
                    <button class="btn btn-danger btn-sm delete-donacion" data-id="${donacion.id_donacion}">Eliminar</button>
                </td>
            `;donacionList.appendChild(row)});document.querySelectorAll('.edit-donacion').forEach(button=>button.addEventListener('click',handleEditDonacion));document.querySelectorAll('.delete-donacion').forEach(button=>button.addEventListener('click',handleDeleteDonacion))}
function handleEditDonacion(event){try{const donacionId=parseInt(event.target.dataset.id);const donacion=donaciones.find(d=>d.id_donacion===donacionId);document.getElementById('monto').value=donacion.monto;document.getElementById('nombre_donante').value=donacion.nombre_donante;document.getElementById('email_donante').value=donacion.email_donante;document.getElementById('metodo_pago').value=donacion.metodo_pago;document.getElementById('numero_tarjeta').value=donacion.numero_tarjeta;document.getElementById('fecha_expiracion').value=donacion.fecha_expiracion;document.getElementById('codigo_seguridad').value=donacion.codigo_seguridad;document.getElementById('fecha_donacion').value=donacion.fecha_donacion;isEditMode=!0;edittingId=donacionId;const modal=new bootstrap.Modal(document.getElementById('agregarDonacion'));modal.show()}catch(error){alert("Error trying to edit a donation");console.error(error)}}
async function handleDeleteDonacion(event){const donacionId=parseInt(event.target.dataset.id);const response=await fetch(`${API_URL}?id_donacion=${donacionId}`,{method:'DELETE',credentials:'include'});if(response.ok){loadDonaciones()}else{console.error("Error al eliminar la donación")}}
document.getElementById('donacionForm').addEventListener('submit',async function(e){e.preventDefault();const monto=parseFloat(document.getElementById("monto").value);const nombre_donante=document.getElementById("nombre_donante").value;const email_donante=document.getElementById("email_donante").value;const metodo_pago=document.getElementById("metodo_pago").value;const numero_tarjeta=document.getElementById("numero_tarjeta").value;const fecha_expiracion=document.getElementById("fecha_expiracion").value;const codigo_seguridad=document.getElementById("codigo_seguridad").value;const fecha_donacion=document.getElementById("fecha_donacion").value;let response;if(isEditMode){response=await fetch(`${API_URL}?id_donacion=${edittingId}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({monto:monto,nombre_donante:nombre_donante,email_donante:email_donante,metodo_pago:metodo_pago,numero_tarjeta:numero_tarjeta,fecha_expiracion:fecha_expiracion,codigo_seguridad:codigo_seguridad,fecha_donacion:fecha_donacion}),credentials:'include'})}else{const newDonacion={monto:monto,nombre_donante:nombre_donante,email_donante:email_donante,metodo_pago:metodo_pago,numero_tarjeta:numero_tarjeta,fecha_expiracion:fecha_expiracion,codigo_seguridad:codigo_seguridad,fecha_donacion:fecha_donacion};response=await fetch(API_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(newDonacion),credentials:"include"})}
if(response.ok){const modal=bootstrap.Modal.getInstance(document.getElementById('agregarDonacion'));modal.hide();loadDonaciones()}else{console.error("Sucedió un error")}});document.getElementById('agregarDonacion').addEventListener('show.bs.modal',function(){if(!isEditMode){document.getElementById('donacionForm').reset()}});document.getElementById("agregarDonacion").addEventListener('hidden.bs.modal',function(){edittingId=null;isEditMode=!1});loadDonaciones()})