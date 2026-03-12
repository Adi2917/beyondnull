import { supabase } from "./supabaseClient"

/* =========================
ADMIN LOGIN
========================= */

export async function loginAdmin(phone, pin){

const { data, error } = await supabase
.from("admins")
.select("*")
.eq("phone", phone)
.eq("pin", pin)
.single()

if(error || !data){
return { success:false }
}

localStorage.setItem("adminLogged","true")

return { success:true, data }

}


/* =========================
LOGOUT
========================= */

export function logoutAdmin(){

localStorage.removeItem("adminLogged")

}


/* =========================
CHECK LOGIN SESSION
========================= */

export function checkAdminSession(){

return localStorage.getItem("adminLogged") === "true"

}


/* =========================
ADD CLIENT
========================= */

export async function addClient(clientData){

const { data, error } = await supabase
.from("clients")
.insert([clientData])
.select()

return { data, error }

}


/* =========================
GET ALL CLIENTS
========================= */

export async function getClients(){

const { data, error } = await supabase
.from("clients")
.select("*")
.order("created_at",{ ascending:false })

return { data, error }

}


/* =========================
GET SINGLE CLIENT
========================= */

export async function getClientById(id){

const { data, error } = await supabase
.from("clients")
.select("*")
.eq("id", id)
.single()

return { data, error }

}


/* =========================
UPDATE CLIENT
========================= */

export async function updateClient(id, updatedData){

const { data, error } = await supabase
.from("clients")
.update(updatedData)
.eq("id", id)
.select()

return { data, error }

}


/* =========================
DELETE CLIENT
========================= */

export async function deleteClient(id){

const { data, error } = await supabase
.from("clients")
.delete()
.eq("id", id)

return { data, error }

}