$(document).ready(function () {
  // Store the input email and eircode on the home page in local storage
  $("#estimateForm").submit(function (event) {
    event.preventDefault(); // Prevent the form from submitting
    // Get the values from the input fields
    var address = $("#address").val();
    var email = $("#InputEmail1").val();
    var emailUpdates = $("#emailCheck").prop("checked");

    // Create an object to store the input data
    var inputData = {
      address: address,
      email: email,
      emailUpdates: emailUpdates,
    };

    // Convert the object to a JSON string
    var inputDataJSON = JSON.stringify(inputData);

    // Store the JSON string in the local storage
    localStorage.setItem("inputData", inputDataJSON);

    // Redirect the user to the next page
    window.location.href = "onboarding-form.html";
  });

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

  $(".submit").click(function () {
    window.location.href =
      "https://demo.onebill.ie/public/customer-signup?customer_count=2";
    return false;
  });
});
