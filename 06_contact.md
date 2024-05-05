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
<li>Reach out to [My LinkedIn Profile](https://www.linkedin.com/in/sebastiancoles/)</li>
<li>Drop me an email at [seb_coles@outlook.com](mailto:seb_coles@outlook.com)</li>
</ul>

Or you can complete the below form to send me a message!
<form id="my-form" action="https://formspree.io/f/mnqellgp" method="POST">
  <label>Your Email:</label>
  <input type="email" name="email" />
  <label>Your Message:</label>
  <input type="text" name="message" />
  <button id="my-form-button">Submit</button>
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

<div id="mc_embed_shell">  
  <div id="mc_embed_signup">
		<form action="https://github.us17.list-manage.com/subscribe/post?u=80b0f43ee17c66803c91437ca&amp;id=b88b46a818&amp;f_id=003e28e1f0" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_self" novalidate="">
						<h2>Get notified when I post new content!</h2>
						<div class="mc-field-group"><label for="mce-EMAIL">Email Address <span class="asterisk">*</span></label><input type="email" name="EMAIL" class="required email" id="mce-EMAIL" required="" value=""></div>
						<div id="mce-responses" class="clear foot">
							<div class="response" id="mce-error-response" style="display: none;"></div>
							<div class="response" id="mce-success-response" style="display: none;"></div>
						</div>
					<div aria-hidden="true" style="position: absolute; left: -5000px;">
						/* real people should not fill this in and expect good things - do not remove this or risk form bot signups */
						<input type="text" name="b_80b0f43ee17c66803c91437ca_b88b46a818" tabindex="-1" value="">
					</div>
						<div class="optionalParent">
							<div class="clear foot">
								<input type="submit" name="subscribe" id="mc-embedded-subscribe" class="button" value="Subscribe">
							</div>
						</div>
					</div>
				</form>
				</div>
				</div>	