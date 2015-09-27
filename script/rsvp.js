$(window).ready(function() {
    var vegetarian = $('#veg-button');
    var vegan = $('#tiv-button');
    var vegNum = $('#veg-num-group');

    function validate() {
        var adults = $('#adults-value').val();
        var kids = $('#kids-value').val();
        var name = $('#name-input').val();

        return isValidName(name) & isValidAdultsNum(adults) & isValidVeg()
    }

    function isValidVeg() {
        var vegNumValidation = $('#veg-num-group .validation');
        if ($('#veg').val() !== 'false' || $('#tiv').val() !== 'false') {
            // check if vegetarian select is shown and value is 0
            if ($('#veg-value').css('display') !== 'none' && parseInt($('#veg-value option:selected').val()) !== 0) {
                showOrHideValidationWarning(vegNumValidation, false);
                // value is not 0
            } else if ($('#veg-value').css('display') !== 'none')  {
                showOrHideValidationWarning(vegNumValidation, true);
                return false;
            }
        }
        return true;

    }

    function isValidAdultsNum(adults) {
        var adultsValidation = $('#adults-value + .validation');
        // validate adults num
        if (adults < 1) {
            showOrHideValidationWarning(adultsValidation, true);
            return false;
        } else {
            showOrHideValidationWarning(adultsValidation, false);
            return true;
        }
    }

    function isValidName(name) {
        var nameValidation = $('#name-input').next();
        // validate name
        if (name === '' || name === ' ' || name.length < 2) {
            showOrHideValidationWarning(nameValidation, true);
            return false;
        } else {
            showOrHideValidationWarning(nameValidation, false);
            return true;
        }
    }

    function showOrHideValidationWarning(element, shouldDisplay) {
        if (shouldDisplay) {
            element.css('display', 'block');
        } else {
            element.hide();
        }
    }

    function isActive(element) {
        return element.attr('class').indexOf('active') > -1;
    }

    // sums the total num of vegans and saves them in a hidden input.
    function updateVeganNum() {
        var kidsNum = parseInt($('#kids-value option:selected').text()) || 0;
        var adultsNum = parseInt($('#adults-value option:selected').text()) || 0;
        var maxVeg = adultsNum + kidsNum !== 0 ? adultsNum + kidsNum : 10;
        fillSelectWithVeganNum(maxVeg);
    }

    // fills the select input with options
    function fillSelectWithVeganNum(maxVeg) {
        emptyVeganNum();
        for (var i = 0; i < maxVeg; i++) {
            $('#veg-value').append($('<option>', {
                value: i + 1,
                text: i + 1
            }));
        }
    }

    // empty the select input
    function emptyVeganNum() {
        $('#veg-value').empty();
        $('#veg-value').append($('<option>', {
            value: 0,
            text: "מספר"
        }));
    }

    function showSummary(rsvp) {
        $('#rsvp').hide();
        $('#confirm').show();
        $('#confirm-name').text(rsvp.name);
        $('#confirm-adults').text(rsvp.adults);
        $('#confirm-kids').text(rsvp.kids);
        if (rsvp.vegetarian ||rsvp.vegan) {
            var tiv = rsvp.vegan ? "טבעוני" : "צמחוני";
            $('.confirm-veg').each(function() {
                $(this).css('display', 'block');
            });

            if(rsvp.vegan_text === '') {
                $('#confirm-vegan-text').hide();
            }
            $('#confirm-veg').text(tiv);
            $('#confirm-veg-num').text(rsvp.vegan_num);
            $('#confirm-veg-text').text(rsvp.vegan_text);
        } else {
            $('.confirm-veg').each(function() {
                $(this).hide();
            });
        }
    }

    // toggles the vegan and vegetarian buttons and opens more vegan selectors if needed
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

            updateVeganNum();

            if (isActive(secondButton)) {
                secondButton.removeClass('active');
                var sibling = secondButton.prev();
                sibling.val(false);
            }
        }
        clickedButton.blur();
        secondButton.blur();
    }

    vegetarian.click(function(event) {
        toggleActive(vegetarian, vegan);
        event.stopPropagation();
    });

    vegan.click(function(event) {
        toggleActive(vegan, vegetarian);
        event.stopPropagation();
    });

    // change number of available vegans
    $('#adults-value, #kids-value').change(function () {
        updateVeganNum();
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
    $( "#save" ).click(function( event ) {
        event.preventDefault();

        // validate before save
        if(validate()) {
            rsvp =  { name: $('#name-input').val(),
                adults: $('#adults-value').val() ,
                kids: $('#kids-value').val(),
                vegan: $('#tiv').val() === "true" ? 1 : 0,
                vegetarian: $('#veg').val() === "true" ? 1 : 0,
                vegan_num: $('#veg-value').val(),
                vegan_text: $('#veg-info-value').val(),
                action: "save"
            };

            showSummary(rsvp);
            //TODO show summary of record
        }
    });

    $('#confirm-btn-save').click(function() {
        // Fire off the request to /form.php
        var request = $.ajax({
            url: "/rsvp/php/form.php",
            type: "post",
            data: rsvp
        });

        request.done(function (response, textStatus, jqXHR){
            var result = JSON.parse(response);
            // handle existing name
            if (result.exist === true) {
                //TODO show overwrite warning
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
                //TODO show success message
                alert('הרישום בוצע בהצלחה, נתראה בחתונה!');
            }
        });

    });

    $('#confirm-btn-fix').click(function() {
        $('#confirm').hide();
        $('#rsvp').show();
    });
});
