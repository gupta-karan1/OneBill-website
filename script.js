$(document).ready(function () {
  // Cookie Consent function
  // Check if the user has previously accepted cookies
  if (!getCookie("cookieConsent")) {
    // Show the cookie consent modal
    $("#cookieConsentModal").modal("show");
  }

  // When the user clicks "Accept," set a cookie and close the modal
  $("#acceptCookies").on("click", function () {
    setCookie("cookieConsent", "accepted", 365); // Cookie expires after 365 days
    $("#cookieConsentModal").modal("hide");
  });

  // When the user clicks "Reject," delete the cookie and close the modal
  // When the user clicks "Reject," delete the cookie and close the modal
  $("#rejectCookies").on("click", function () {
    setCookie("cookieConsent", "rejected", 365); // Cookie expires after 365 days
    $("#cookieConsentModal").modal("hide");
  });

  // Function to set a cookie
  function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  // Function to get a cookie value
  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  const scriptURL =
    "https://script.google.com/macros/s/AKfycbxdy2m1Leo4yEnN4UeYOkENLLn0MMBrrk8QJG7CY_xvTx7knAp467DuVbzZhrghLFsH/exec";

  const scriptContact =
    "https://script.google.com/macros/s/AKfycbz3N6RqlrzaHktGT-BxidVGAd1iU7GwqmMI39gLjNgE0DvEosRncfaSnfxkh5to_fFHaQ/exec";
  const form = document.forms["estimateForm"];
  const form2 = document.forms["msform"];
  const form3 = document.forms["contactForm"];

  $(form3).submit(function (event) {
    event.preventDefault(); // Prevent the form from submitting

    const formData = new FormData(this);

    fetch(scriptContact, { method: "POST", body: formData })
      .then((response) => {
        alert("Form submitted successfully");
        // reload window
        window.location.reload();
      })
      .catch((error) => console.error("Error!", error.message));
  });

  $(form).submit(function (event) {
    event.preventDefault(); // Prevent the form from submitting

    let eircode = $("#eir-code").val() || "";
    let inputData = {
      eircode: eircode,
    };
    let inputDataJSON = JSON.stringify(inputData);
    localStorage.setItem("eircode", inputDataJSON);

    window.location.href = "onboarding-form.html";
  });

  // set the value of the eircode in the form to the value stored in local storage
  let eircode = JSON.parse(localStorage.getItem("eircode")) || "";
  $("#user-eircode").val(eircode.eircode);

  $(form2).submit(function (event) {
    event.preventDefault(); // Prevent the form from submitting

    const formData = new FormData(this);

    const fileInputs = $(this).find("input[type=file]");
    const fileCount = fileInputs.length;
    let filesProcessed = 0;

    fileInputs.each(function () {
      const header = $(this).attr("name");
      const file = this.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const fileData = {
            fileName: file.name,
            mimeType: file.type,
            base64: e.target.result.split(",")[1],
          };
          formData.append(`${header}-file`, JSON.stringify(fileData));
          filesProcessed++;

          if (filesProcessed === fileCount) {
            submitForm(formData);
          }
        };
        reader.readAsDataURL(file);
      } else {
        filesProcessed++;
        if (filesProcessed === fileCount) {
          submitForm(formData);
        }
      }
    });
  });

  function submitForm(formData) {
    console.log("Submitting form data:", formData);
    fetch(scriptURL, { method: "POST", body: formData })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from server:", data);
        if (data.result === "success") {
          alert("Form submitted successfully");
          // ... rest of the code
        } else {
          alert("Error submitting form: " + data.error);
        }
      })
      .then(() => {
        // reload window
        window.location.href = "onboarding-form.html";
      })
      .catch((error) => console.error("Error!", error.message));
  }

  var fieldsets = $("fieldset");
  var progressItems = $("#progressbar li");
  var steps = fieldsets.length;
  var current = 0;

  setProgressBar(current);

  $(".next").click(function () {
    if (current < steps - 1) {
      current++;
      animateFieldsets(current);
    }
  });

  $(".previous").click(function () {
    if (current > 0) {
      current--;
      animateFieldsets(current);
    }
  });

  $(".reset").click(function () {
    current = 0;
    animateFieldsets(current);
  });

  function animateFieldsets(targetStep) {
    fieldsets.eq(current).animate(
      { opacity: 0 },
      {
        step: function (now) {
          var opacity = 1 - now;
          fieldsets.eq(current).css({ opacity: opacity });
        },
        duration: 10,
        complete: function () {
          fieldsets.hide();
          fieldsets.eq(targetStep).css({ opacity: 0 });
          fieldsets
            .eq(targetStep)
            .show()
            .animate(
              { opacity: 1 },
              {
                duration: 10,
                complete: function () {
                  updateProgressIcons(targetStep);
                  setProgressBar(targetStep);
                },
              }
            );
        },
      }
    );
  }

  function setProgressBar(curStep) {
    var percent = (curStep / (steps - 1)) * 100;
    $(".progress-bar").css("width", percent + "%");
  }

  function updateProgressIcons(curStep) {
    progressItems.removeClass("active");
    progressItems.slice(0, curStep + 1).addClass("active");
  }
});
