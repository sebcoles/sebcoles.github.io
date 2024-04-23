---
layout: post
title:  "About LRQA"
date:   2024-04-23
categories: supporting-me
image: assets/images/lrqa_logo.jpeg
---
![lrqa](../assets/images/lrqa_logo.jpeg)

<b>LRQA</b> is a leading global assurance partner. They bring together unrivalled expertise in certification, brand assurance, cybersecurity, inspection and training.

LRQA has a rich heritage in assurance, having previously been part of Lloyds Register, and by combining strong values, decades of experience in risk management and mitigation and a keen focus on the future, LRQA's mission is to support clients in building a safer, more secure, more sustainable businesses.

From independent auditing, certification and training; to technical advisory services; to real-time assurance technology; to data-driven supply chain transformation, our innovative end-to-end solutions help our clients negotiate a rapidly changing risk landscape – making sure they’re shaping their own future, rather than letting it shape them.

Services you might be interested in could be ISO assessment such as Quality Management ISO9001, Information Security such as ISO27001 or Privacy ISO27701. LRQA also provide a suite of offensive and defensive cybersecurity services such as penetration testing, CISO consultancy and managed SOC services.

You can read about the full suite of LRQA services at [www.lrqa.com](www.lrqa.com). LRQA operate an internal employee referral scheme so if your interested in LRQA services (and want to support my work) I would appreciate it if you would let me connect you with the right people by dropping me a note below or emailing me at [seb_coles:outlook.com](mailto:seb_coles@outlook.com)!

<form id="my-form" action="https://formspree.io/f/mnqellgp" method="POST">
  <label>Your Email:</label>
  <input type="email" name="email" />
  <label>What LRQA services are you interested in?:</label>
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

