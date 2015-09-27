$(window).ready(function() {

    function hasActive(element) {
        return element.attr('class').indexOf('active') > -1 ? true : false;
    }

    var veg = $('#veg-button');
    var tiv = $('#tiv-button');
    var vegNum = $('#veg-num-group');

    function validate() {
        var adults = $('#adults-value').val();
        var kids = $('#kids-value').val();
        var name = $('#name-input').val();

        var adultsValidation = $('#adults-value + .validation');
        var nameValidation = $('#name-input').next();
        var vegNumValidation = $('#veg-num-group .validation');

        var validated = true;
        // validate name
        if (name === '' || name === ' ' || name.length < 2) {
            validated = false;
            handleValidationAlert(nameValidation, true);
        } else {
            handleValidationAlert(nameValidation, false);
        }
        // validate adults num
        if (adults < 1) {
            handleValidationAlert(adultsValidation, true);
            validated = false;
        } else {
            handleValidationAlert(adultsValidation, false);
        }
        // validate vegan
        if ($('#veg').val() !== 'false' || $('#tiv').val() !== 'false') {

            if ($('#veg-value').css('display') !== 'none' && parseInt($('#veg-value option:selected').val()) !== 0) {
                handleValidationAlert(vegNumValidation, false);

            } else if ($('#veg-value').css('display') !== 'none')  {
                handleValidationAlert(vegNumValidation, true);
                validated = false;
            }
        }

        return validated;
    }

    function handleValidationAlert(element, shouldDisplay) {
        if (shouldDisplay) {
            element.css('display', 'block');
        } else {
            element.hide();
        }
        return shouldDisplay;
    }

    function isActive(element) {
        return element.attr('class').indexOf('active') > -1;
    }

    function updateMaxNumOfVeg() {
        var kidsNum = parseInt($('#kids-value option:selected').text()) || 0;
        var adultsNum = parseInt($('#adults-value option:selected').text()) || 0;
        var maxVegVal = adultsNum + kidsNum !== 0 ? adultsNum + kidsNum : 10;
        emptyVeganNum();
        for (var i = 0; i < maxVegVal; i++) {
            $('#veg-value').append($('<option>', {
                value: i + 1,
                text: i + 1
            }));
        }
    }

    function emptyVeganNum() {
        $('#veg-value').empty();
        $('#veg-value').append($('<option>', {
            value: 0,
            text: "מספר"
        }));
    }

    function toggleActive(clickedButton, secondButton) {

        if (isActive(clickedButton)) {
            clickedButton.removeClass('active');
            vegNum.slideUp();
            emptyVeganNum();
            var sibling = clickedButton.prev();
            sibling.val(false);

        } else {
            clickedButton.addClass('active');
            vegNum.slideDown();

            var sibling = clickedButton.prev();
            sibling.val(true);

            updateMaxNumOfVeg();

            if (isActive(secondButton)) {
                secondButton.removeClass('active');
                var sibling = secondButton.prev();
                sibling.val(false);
            }
        }
        clickedButton.blur();
        secondButton.blur();
    }

    veg.click(function(event) {
        toggleActive(veg, tiv);
        event.stopPropagation();
    });

    tiv.click(function(event) {
        toggleActive(tiv, veg);
        event.stopPropagation();
    });

    // change number of available vegans
    $('#adults-value, #kids-value').change(function () {
        updateMaxNumOfVeg();
    });

    // open textarea for vegan
    $('#veg-more-comp-link').click(function(event) {
        if ($('#veg-info').is(":visible")) {
            $('#veg-info').slideUp();
        } else {
            $('#veg-info').slideDown();
        }
        event.stopPropagation();
    });

    // update textarea value on focus out
    $('#veg-info').focusout(function () {
        $('#veg-info-value').val($(this).val());
    });

    var rsvp;
    // validate before save
    $( "#save" ).click(function( event ) {
        event.preventDefault();
        if(validate()) {
            rsvp =  { name: $('#name-input').val(),
                adults: $('#adults-value').val() ,
                kids: $('#kids-value').val(),
                vegan: $('#tiv').val(),
                vegetarian: $('#veg').val(),
                vegan_num: $('#veg-value').val(),
                vegan_text: $('#veg-info-value').val(),
                action: "save"
            };

            // Fire off the request to /form.php
            var request = $.ajax({
                url: "/rsvp/php/form.php",
                type: "post",
                data: rsvp
            });

            request.done(function (response, textStatus, jqXHR){
                var result = JSON.parse(response);
                if (result.exist === true) {
                    var confirmString = "מישהו כבר נרשם עם השם " + result.name;
                    var toChange = "\r\nהאם ברצונך לשנות את אישור ההגעה הקיים?";
                    toChange = "\r\n האם ניסית לשנות אישור הגעה קיים? (אם לא אנא בחר שם אחר)"

                    var ans = confirm(confirmString + toChange);
                    // user wants to override a record
                    if (ans) {
                        rsvp.action = "overwrite";
                        request = $.ajax({
                            url: "/rsvp/php/form.php",
                            type: "post",
                            data: rsvp
                        });
                    }
                } else if (result.success) {
                    alert('הרישום בוצע בהצלחה, נתראה בחתונה!');
                }
            });
        }
    });
});
