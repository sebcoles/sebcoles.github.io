---
layout: post
title: Contact
permalink: /contact/
image: assets/images/pic01.jpg
nav-menu: true
show_tile: false
---

Hello!

There are a few ways to get in touch with me

<ul>
<li>Reach out to me on <a href="https://www.linkedin.com/in/sebastiancoles">LinkedIn</a></li>
<li>Drop me an email at <a href="mailto:seb_coles@outlook.com">seb_coles@outlook.com</a></li>
</ul>

Or you can complete the below form to send me a message!
<form id="my-form" action="https://formspree.io/f/mnqellgp" method="POST">
  <label>Your Email:</label>
  <input type="email" name="email" />
  <label>Your Message:</label>
  <textarea name="message"></textarea>
  <button style="margin-top:15px" id="my-form-button">Submit</button>
  <p id="my-form-status"></p>
</form>
<!-- Place this script at the end of the body tag -->
<script>
    var form = document.getElementById("my-form");
    
    async function handleSubmit(event) {
      event.preventDefault();
      var status = document.getElementById("my-form-status");
      var data = new FormData(event.target);
      fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          status.innerHTML = "Thanks for your submission!";
          form.reset()
        } else {
          response.json().then(data => {
            if (Object.hasOwn(data, 'errors')) {
              status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
            } else {
              status.innerHTML = "Oops! There was a problem submitting your form"
            }
          })
        }
      }).catch(error => {
        status.innerHTML = "Oops! There was a problem submitting your form"
      });
    }
    form.addEventListener("submit", handleSubmit)
</script>

Please do <b>not</b> get in touch with me if your a security vendor or a recruitment person who has no role to discuss, sorry!
