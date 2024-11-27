$(document).ready(function () {
    // FullCalendar'ni ishga tushirish
    $('#calendar').fullCalendar({
        themeSystem: 'bootstrap4',
        businessHours: false,
        defaultView: 'month',
        editable: true,
        header: {
            left: 'title',
            center: 'month,agendaWeek,agendaDay',
            right: 'today prev,next'
        },
        dayClick: function (date) {
            // Tanlangan sanani input maydoniga o'rnatish
            $('#event-date').val(moment(date).format('YYYY-MM-DD'));

            // Modalni ko'rsatish
            $('#modal-view-event-add').modal('show');
        },
        events: [
            {
                title: "Umumiy Tadbir",
                description: "Kengash yig'ilishi",
                startTime: "10:00",
                endTime: "12:00",
                roomNumber: "101",
                date: "2024-11-22"
            },
            {
                title: "Seminar",
                description: "Muvaffaqiyatga erishish sirlarini o'rganish",
                startTime: "13:00",
                endTime: "15:00",
                roomNumber: "202",
                date: "2024-11-22"
            },
            {
                title: "Konsultatsiya",
                description: "O'qituvchilar bilan suhbat",
                startTime: "15:00",
                endTime: "16:00",
                roomNumber: "303",
                date: "2024-11-23"
            }
        ],
        eventRender: function (event, element) {
            // Faqat roomNumber'ni ko'rsatish va title'ni yashirish
            if (event.roomNumber) {
                element.find('.fc-title').html('<small>Room: ' + event.roomNumber + '</small>');

                // Room number ustiga bosganda modalni ochish
                element.on('click', function() {
                    $('#modal-date-event-id-details').modal('show');
                    $('#modal-event-title').text('Title: ' + event.title);
                    $('#modal-event-description').text('Description: ' + event.description);
                    $('#modal-event-room').text('Room: ' + event.roomNumber);
                    $('#modal-event-time').text('Date: ' + event.date);
                    $('#modal-event-starttime').text('Start time: ' + event.startTime);
                    $('#modal-event-endtime').text('End time:: ' + event.endTime);
                });
            }
        }
    });

    // Sana tanlash uchun Datepicker'ni sozlash
    $('.datetimepicker').datepicker({
        timepicker: true,
        language: 'en',
        range: true,
        multipleDates: true,
        multipleDatesSeparator: " - "
    });

    // Forma topshirilganda yangi tadbirni qo'shish
    $("#add-event").submit(function (e) {
        e.preventDefault(); // Standart forma yuborishni to'xtatish

        // Input maydonlardan ma'lumotlarni olish
        var title = $('#event-title').val(); // Tadbir nomi
        var date = $('#event-date').val(); // Tadbir sanasi va vaqti

        // FullCalendar'ga yangi tadbirni qo'shish
        $('#calendar').fullCalendar('renderEvent', {
            title: title,
            start: date,
            allDay: false
        }, true); // true - qabul qilishni majburiy qiladi

        // Modalni yopish
        $('#modal-view-event-add').modal('hide');

        // Formani tozalash
        $('#add-event')[0].reset();
    });
});





document.addEventListener("DOMContentLoaded", function () {
        // Modal 1dagi inputlar
        const eventDateInput = document.getElementById("event-date");
        const eventStartTimeInput = document.getElementById("event-start-time");
        const eventEndTimeInput = document.getElementById("event-end-time");
        const nextButton = document.getElementById("next-to-modal-2");

        // Inputlarni tekshiruvchi funksiya
        function checkInputs() {
            // Agar barcha inputlar to'ldirilgan bo'lsa, Next tugmasi ko'rinadi
            if (eventDateInput.value && eventStartTimeInput.value && eventEndTimeInput.value) {
                nextButton.style.display = "block"; // Tugma ko'rinadi
            } else {
                nextButton.style.display = "none"; // Tugma yashirin bo'ladi
            }
        }

        // Inputlarni har doim tekshirish (real time)
        eventDateInput.addEventListener("input", checkInputs);
        eventStartTimeInput.addEventListener("input", checkInputs);
        eventEndTimeInput.addEventListener("input", checkInputs);

        // Modal 1: Next tugmasi bosilganda
        document.getElementById("next-to-modal-2").addEventListener("click", function () {
            // Modal 1dagi formdagi inputlarni tekshirish
            var form = document.getElementById("add-event");
            if (form.checkValidity()) {
                $('#modal-view-event-add').modal('hide'); // Modal 1 yopiladi
                $('#modal-view-event-details').modal('show'); // Modal 2 ochiladi
            } else {
                form.reportValidity(); // Foydalanuvchiga to'ldirishni eslatish
            }
        });

        // Modal 2: Back tugmasi bosilganda
        document.getElementById("back-to-modal-1").addEventListener("click", function () {
            $('#modal-view-event-details').modal('hide'); // Modal 2 yopiladi
            $('#modal-view-event-add').modal('show'); // Modal 1 ochiladi
        });

        // Modal 2: Next tugmasi bosilganda
        document.getElementById("next-to-modal-3").addEventListener("click", function () {
            $('#modal-view-event-details').modal('hide'); // Modal 2 yopiladi
            $('#modal-view-event-final').modal('show'); // Modal 3 ochiladi
        });

        // Modal 3: Back tugmasi bosilganda
        document.getElementById("back-to-modal-2").addEventListener("click", function () {
            $('#modal-view-event-final').modal('hide'); // Modal 3 yopiladi
            $('#modal-view-event-details').modal('show'); // Modal 2 ochiladi
        });

        // Modal 3: Submit tugmasi bosilganda
        document.getElementById("finish-modal").addEventListener("click", function () {
            $('#modal-view-event-final').modal('hide'); // Modal 3 yopiladi
            alert("Event successfully added!");
        });
    });

    document.addEventListener('DOMContentLoaded', function () {
        // Start time input
        var startTimeInput = document.getElementById('event-start-time');
        // End time input
        var endTimeInput = document.getElementById('event-end-time');

        // 24 soatli formatni tekshirish va sozlash
        function validateTime(input) {
            var time = input.value;
            var regex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;

            // Agar noto'g'ri format kiritilsa
            if (!regex.test(time)) {
                input.setCustomValidity('Iltimos, 24 soat formatida vaqt kiriting (HH:mm).');
            } else {
                input.setCustomValidity(''); // Xatolikni olib tashlash
            }
        }

        // Start time uchun event listener
        startTimeInput.addEventListener('input', function () {
            validateTime(startTimeInput);
        });

        // End time uchun event listener
        endTimeInput.addEventListener('input', function () {
            validateTime(endTimeInput);
        });
    });



    // Define currentSelectedRoom variable
    let currentSelectedRoom = null;

    // This function is triggered when a room button is clicked
    function selectRoom(button) {
        // Remove "active" class from previous selection (if any)
        if (currentSelectedRoom) {
            currentSelectedRoom.classList.remove("active-room");
        }

        // Add "active" class to the selected room
        button.classList.add("active-room");
        currentSelectedRoom = button;

        // Show the "Next" button when a room is selected
        document.getElementById("next-to-modal-3").style.display = "block"; // Make the Next button visible
    }

    // Initially, the "Next" button is hidden
    document.getElementById("next-to-modal-3").style.display = "none";







    // Function to check if all inputs are filled
    function checkInputs() {
        const inputs = document.querySelectorAll('#modal-view-event-final .form-control:not(#captcha-input)');
        let allFilled = true;

        inputs.forEach(input => {
            if (input.value.trim() === '') {
                allFilled = false;
            }
        });

        const captchaContainer = document.getElementById('captcha-container');
        const submitButton = document.getElementById('finish-modal');

        if (allFilled) {
            captchaContainer.style.display = 'block';
            generateCaptcha(); // Generate the CAPTCHA
        } else {
            captchaContainer.style.display = 'none';
            submitButton.style.display = 'none';
            document.getElementById('captcha-input').value = ''; // Clear captcha input
        }
    }

    // Generate random math CAPTCHA
    let correctAnswer;
    function generateCaptcha() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;

        document.getElementById('captcha-question').textContent = `${num1} + ${num2}`;
        correctAnswer = num1 + num2;
    }

    // Check if CAPTCHA answer is correct
    function checkCaptcha() {
        const userAnswer = document.getElementById('captcha-input').value.trim();
        const submitButton = document.getElementById('finish-modal');

        if (parseInt(userAnswer) === correctAnswer) {
            document.getElementById('captcha-error').style.display = 'none';
            submitButton.style.display = 'block';
        } else {
            document.getElementById('captcha-error').style.display = 'block';
            submitButton.style.display = 'none';
        }
    }

    // SweetAlert for Submit button
    document.getElementById('finish-modal').addEventListener('click', () => {
        Swal.fire({
            title: 'Success!',
            text: 'Your data has been submitted.',
            icon: 'success'
        }).then(() => {
            // Modalni yopish
            document.getElementById('modal-view-event-final').style.display = 'none';
            // Formani tozalash
            document.querySelectorAll('#modal-view-event-final .form-control').forEach(input => input.value = '');
            checkInputs(); // Holatni qayta tekshirish uchun
        });
    });

    // Event listeners
    document.querySelectorAll('#modal-view-event-final .form-control:not(#captcha-input)').forEach(input => {
        input.addEventListener('input', checkInputs);
    });

    document.getElementById('captcha-input').addEventListener('input', checkCaptcha);

    // Initialize state
    checkInputs();
