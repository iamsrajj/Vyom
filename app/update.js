$(document).ready(function () {
  var current_fs, next_fs, next_fss, previous_fs; // fieldsets
  var opacity;
  var current = 1;
  var steps = $("fieldset").length;
  var urlParams = new URLSearchParams(window.location.search);
  var diseaseId = urlParams.get("disease_id");
  console.log("Disease ID:", diseaseId);

  // Function to update the disease data
  function updateDiseaseData() {
    // Prepare the updated data here, for example:
    var updatedData = {
      summary: $("#summary").val(),
      symptoms: $("#symptoms").val(),
      life_cycle: $("#life_cycle").val(),
      crop_list: $("#crop_list").val(),
      min_atmtemp: +$("#min_atmtemp").val(),
      max_atmtemp: +$("#max_atmtemp").val(),
      dur_atmtemp: +$("#dur_atmtemp").val(),
      min_hum: +$("#min_hum").val(),
      max_hum: +$("#max_hum").val(),
      dur_hum: +$("#dur_hum").val(),
      min_lwet: +$("#min_lwet").val(),
      max_lwet: +$("#max_lwet").val(),
      dur_lwet: +$("#dur_lwet").val(),
      min_smoist: +$("#min_smoist").val(),
      max_smoist: +$("#max_smoist").val(),
      dur_smoist: +$("#dur_smoist").val(),
      min_stemp: +$("#min_stemp").val(),
      max_stemp: +$("#max_stemp").val(),
      dur_stemp: +$("#dur_stemp").val(),
      min_lux: +$("#min_lux").val(),
      max_lux: +$("#max_lux").val(),
      dur_lux: +$("#dur_lux").val(),
      min_uv: +$("#min_uv").val(),
      max_uv: +$("#max_uv").val(),
      dur_uv: +$("#dur_uv").val(),
      min_rainfall: +$("#min_rainfall").val(),
      max_rainfall: +$("#max_rainfall").val(),
      dur_rainfall: +$("#dur_rainfall").val(),
      min_windspeed: +$("#min_windspeed").val(),
      max_windspeed: +$("#max_windspeed").val(),
      dur_windspeed: +$("#dur_windspeed").val(),
      other_name1: $("#other_name1").val(),
      min_other1: +$("#min_other1").val(),
      max_other1: +$("#max_other1").val(),
      dur_other1: +$("#dur_other1").val(),
      other_name2: $("#other_name2").val(),
      min_other2: +$("#min_other2").val(),
      max_other2: +$("#max_other2").val(),
      dur_other2: +$("#dur_other2").val(),
      other_name3: $("#other_name3").val(),
      min_other3: +$("#min_other3").val(),
      max_other3: +$("#max_other3").val(),
      dur_other3: +$("#dur_other3").val(),
      basic_orgtreat: $("#basic_orgtreat").val(),
      sev_chetreat: $("#sev_chetreat").val(),
      pre_cultreat: $("#pre_cultreat").val(),
      image_urls: $("#image_urls").val(),

      disease_id: diseaseId,
    };

    // Send an AJAX request to update the disease data
    $.ajax({
     /* url: "https://api.agridoot.co.in:8443/dpm/update_dis",*/
      type: "PUT",
      data: updatedData,
      success: function (response) {
        alert("Disease data updated successfully!");
        console.log("Disease data updated successfully!", response);
        // Optionally, you can redirect the user or perform other actions upon successful update
      },
      error: function (xhr, status, error) {
        if (xhr.status === 404) {
          alert("Error updating disease data: Endpoint not found");
          console.error("Error updating disease data: Endpoint not found");
        } else {
          alert("Error updating disease data...");
          console.error("Error updating disease data:", error);
        }
        if (status.status === 404) {
          alert("Error updating disease data: Endpoint not found");
          console.error("Error updating disease data: Endpoint not found");
        } else {
          alert("Error updating disease data...");
          console.error("Error updating disease data:", error);
        }
      },
    });
  }

  $(".submit").click(function () {
    current_fs = $(this).parent();
    next_fs = $(this).parent().next();

    // Add validation logic here if needed

    // Show the next fieldset
    next_fs.show();

    // Hide the current fieldset with style
    current_fs.animate(
      { opacity: 0 },
      {
        step: function (now) {
          // for making fieldset appear animation
          opacity = 1 - now;

          current_fs.css({
            display: "none",
            position: "relative",
          });
          next_fs.css({ opacity: opacity });
        },
        duration: 600,
      }
    );
    setProgressBar(++current);
  });

  $(".previous").click(function () {
    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();

    // Show the previous fieldset
    previous_fs.show();

    // Hide the current fieldset with style
    current_fs.animate(
      { opacity: 0 },
      {
        step: function (now) {
          // for making fieldset appear animation
          opacity = 1 - now;

          current_fs.css({
            display: "none",
            position: "relative",
          });
          previous_fs.css({ opacity: opacity });
        },
        duration: 600,
      }
    );
    setProgressBar(--current);
  });

  function setProgressBar(curStep) {
    var percent = parseFloat(100 / steps) * curStep;
    percent = percent.toFixed();
    $(".progress-bar").css("width", percent + "%");
  }

  $(".submit").click(function () {
    // Call the function to update disease data
    updateDiseaseData();
    return false; // Prevent form submission
  });
});
