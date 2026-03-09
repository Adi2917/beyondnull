import React, { useState } from "react";
import "./ContactForm.css";
import Swal from "sweetalert2";

const ContactForm = () => {

const [form,setForm] = useState({
name:"",
phone:"",
email:"",
message:""
});

const [loading,setLoading] = useState(false);

const handleChange = (e)=>{
setForm({...form,[e.target.name]:e.target.value});
};

const handleSubmit = async (e)=>{
e.preventDefault();

/* phone validation */

if(!/^[0-9]{10}$/.test(form.phone)){
Swal.fire({
icon:"error",
title:"Invalid Phone Number",
text:"Please enter a valid 10 digit phone number"
});
return;
}

/* email validation */

if(form.email !== "" && !/\S+@\S+\.\S+/.test(form.email)){
Swal.fire({
icon:"error",
title:"Invalid Email",
text:"Please enter a valid email address"
});
return;
}

setLoading(true);

const data = new FormData();
data.append("name",form.name);
data.append("phone",form.phone);
data.append("email",form.email);
data.append("message",form.message);

try{

await fetch("https://script.google.com/macros/s/AKfycbyoFTbbPRaFVBe41FLmQAadNFCE0JvkMNK0PmmsyqB7NguqVhJdEUHBMfKhsSPt4hzQ/exec",{
method:"POST",
body:data,
mode:"no-cors"
});

/* reset form fast */

setForm({
name:"",
phone:"",
email:"",
message:""
});

setLoading(false);

Swal.fire({
icon:"success",
title:"Message Sent Successfully",
text:"Our team will contact you soon",
confirmButtonColor:"#00bcd4"
});

}catch(err){

setLoading(false);

Swal.fire({
icon:"error",
title:"Submission Failed",
text:"Please try again"
});

}

};

return(

<section className="contact">

<div className="contact-heading">

<h2>Let's Build Something Amazing Together</h2>

<p>
Have a project idea or business requirement?  
Send us a message and our team will connect with you shortly.
</p>

</div>

<div className="contact-container">

<div className="contact-info">

<h3>Grow With BeyondNull</h3>

<p>
We build powerful digital solutions and scalable
software to help businesses grow faster in the
modern digital world.
</p>

<ul>

<li>✔ Custom Software Development</li>
<li>✔ Digital Marketing</li>
<li>✔ Web Applications</li>
<li>✔ Business Growth Strategies</li>

</ul>

</div>

<div className="contact-form">

<form onSubmit={handleSubmit}>

<input
type="text"
name="name"
placeholder="Your Name"
required
value={form.name}
onChange={handleChange}
/>

<input
type="text"
name="phone"
placeholder="Phone Number"
required
value={form.phone}
onChange={handleChange}
/>

<input
type="email"
name="email"
placeholder="Email (optional)"
value={form.email}
onChange={handleChange}
/>

<textarea
name="message"
placeholder="Tell us about your project..."
required
value={form.message}
onChange={handleChange}
/>

<button type="submit" disabled={loading}>
{loading ? "Sending Message..." : "Send Message"}
</button>

</form>

</div>

</div>

</section>

);

};

export default ContactForm;