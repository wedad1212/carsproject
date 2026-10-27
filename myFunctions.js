
$(document).ready(function () {
$(".details-row").hide();

$(".details-toggle").change(function () {
    var id = $(this).attr("data-target");

   
    if ($(this).is(":checked")) {
        $("#" + id).slideDown();
    } else {
        $("#" + id).slideUp();
    }
});
   
  
    $(".car-select").change(function () {
        var count = $(".car-select:checked").length;

        if (count == 0) {
            $("#selection-message").text("لم يتم اختيار أي سيارة بعد.");
        } else {
            $("#selection-message").text("تم اختيار " + count + " سيارة.");
        }
    });


    $("#continue-button").click(function () {
        if ($(".car-select:checked").length == 0) {
            alert("يرجى اختيار سيارة واحدة على الأقل.");
        } else {
            $("#booking-section").slideDown();
        }
    });

    
    $("#booking-form").submit(function (event) {
        event.preventDefault();

        $("#form-error").hide();
        $("#booking-result").hide();

        var name = $.trim($("#full-name").val());
        var id = $.trim($("#national-id").val());
        var mobile = $.trim($("#mobile").val());
        var email = $.trim($("#email").val());
        var start = $("#start-date").val();
        var end = $("#end-date").val();
        

if (name != "" && !/^[\u0621-\u064A\s]+$/.test(name)) {
    showError("الاسم يجب أن يحتوي على أحرف عربية فقط.");
    return;
}

      
        if (!/^\d{11}$/.test(id)) {
            showError("الرقم الوطني يجب أن يتكون من 11 رقماً.");
            return;
        }

        var province = parseInt(id.substring(0, 2), 10);

        if (province < 1 || province > 14) {
            showError("أول خانتين من الرقم الوطني يجب أن تكونا بين 01 و14.");
            return;
        }

       
        if (!isValidDate(start) || !isValidDate(end)) {
            showError("أدخل التاريخين بصيغة yyyy-mm-dd.");
            return;
        }

        var startDate = new Date(start);
        var endDate = new Date(end);

        if (endDate <= startDate) {
            showError("تاريخ النهاية يجب أن يكون بعد تاريخ البداية.");
            return;
        }

if (mobile != "" && !/^09(3|4|5|6|8|9)\d{7}$/.test(mobile)) {
  showError("أدخل رقم موبايل سوري صحيح من شبكتي Syriatel أو MTN.");
  return;
}

     
        if (email != "" &&
            !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
            showError("أدخل بريداً إلكترونياً صحيحاً.");
            return;
        }


        // حساب مدة التأجير
        var days = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
        var total = 0;

        var result = "<h3>تم التحقق بنجاح!</h3>";
        result += "<p>عدد أيام التأجير لكل سيارة: " + days + " يوم</p>";
        result += "<h4>السيارات المختارة:</h4><ul>";

       // حساب تكلفة كل سيارة
$(".car-select:checked").each(function () {
  var carName = $(this).attr("data-name");
  var price = parseInt($(this).attr("data-price"), 10);
  var carTotal = price * days;

  total += carTotal;

  result += "<li>" + days + " أيام - "
      + carName + " - سعر الإيجار: "
      + carTotal + " ل.ج.س</li>";
});

        result += "</ul>";

        // تطبيق خصم 10% إذا تجاوزت مدة التأجير 7 أيام
        var discount = 0;

        if (days > 7) {
            discount = total * 0.10;
        }

        var finalTotal = total - discount;

        result += "<p>قيمة الخصم: " + discount + " ل.س</p>";
        result += "<p class='final-total'>المبلغ الإجمالي بعد الخصم: "
            + finalTotal + " ل.س</p>";

        // إظهار رسالة النتيجة
        $("#booking-result").html(result).slideDown();


});
});

// التحقق من صحة التاريخ
function isValidDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    var date = new Date(value);
    var parts = value.split("-");

    return date.getFullYear() == parts[0] &&
        date.getMonth() + 1 == parts[1] &&
        date.getDate() == parts[2];
}

// عرض رسالة الخطأ
function showError(message) {
    $("#form-error").text(message).slideDown();
}
