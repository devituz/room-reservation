$(document).ready(function () {
    var calendarEl = document.getElementById('kt_calendar_app');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [
            {
                title: 'Meeting',
                start: '2024-11-25T10:30:00',
                end: '2024-11-25T12:30:00',
                description: 'Project meeting with the team.',
                location: 'Conference Room A',
            },
            {
                title: 'Team Lunch',
                start: '2024-11-26T13:00:00',
                end: '2024-11-30T15:00:00',
                description: 'Team lunch at the local restaurant.',
                location: 'Restaurant X',
            }
        ],
        eventClick: function (info) {
            // Modalni ochish
            const modal = new bootstrap.Modal(document.getElementById('kt_modal_view_event'));
            modal.show();

            // Modalga ma'lumotlarni o'rnatish
            document.querySelector('[data-kt-calendar="event_name"]').textContent = info.event.title;
            document.querySelector('[data-kt-calendar="event_description"]').textContent = info.event.extendedProps.description || 'No description';
            document.querySelector('[data-kt-calendar="event_location"]').textContent = info.event.extendedProps.location || 'No location';
            document.querySelector('[data-kt-calendar="event_start_date"]').textContent = formatDate(info.event.start);
            document.querySelector('[data-kt-calendar="event_end_date"]').textContent = info.event.end
                ? formatDate(info.event.end)
                : 'Not specified';
            document.querySelector('[data-kt-calendar="all_day"]').textContent = info.event.allDay ? 'All Day' : '';
        },
        dateClick: function (info) {
            // Sana ustiga bosilganda yangi tadbir yaratish formasi modalini ochish
            const modal = new bootstrap.Modal(document.getElementById('kt_modal_create_event'));
            modal.show();

            // Formdagi input maydonlarni tozalash va sana ma'lumotini qo'shish
            $('#event-date').val(info.dateStr); // Bosilgan sanani formga joylashtirish
        }
    });

    // Kalendarni render qilish
    calendar.render();

    // Sana formatlash funktsiyasi (Uzbekiston vaqtida)
    function formatDate(date) {
        return new Intl.DateTimeFormat('en-GB', { // 'en-GB' formatda, 24 soatlik format
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // 24 soatlik format
            timeZone: 'Asia/Tashkent' // O'zbekiston vaqti (UZT)
        }).format(date);
    }

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
        calendar.addEvent({
            title: title,
            start: date,
            allDay: false
        });

        // Modalni yopish
        $('#kt_modal_create_event').modal('hide');

        // Formani tozalash
        $('#add-event')[0].reset();
    });
});



document.addEventListener("DOMContentLoaded", function () {
    // Modal 1dagi inputlar
    const eventDateInput = document.getElementById("event-date");
    const eventStartTimeInput = document.getElementById("event-start-time");
    const eventEndTimeInput = document.getElementById("event-end-time");
    const eventTypeInput = document.getElementById("event-type"); // Event type dropdown
    const nextButton = document.getElementById("next-to-modal-2");

    // Inputlarni tekshiruvchi funksiya
    function checkInputs() {
        // Agar barcha inputlar va event turi tanlangan bo'lsa, Next tugmasi ko'rinadi
        if (
            eventDateInput.value &&
            eventStartTimeInput.value &&
            eventEndTimeInput.value &&
            eventTypeInput.value // Event type selected
        ) {
            nextButton.style.display = "block"; // Tugma ko'rinadi
        } else {
            nextButton.style.display = "none"; // Tugma yashirin bo'ladi
        }
    }

    // Inputlarni har doim tekshirish (real time)
    eventDateInput.addEventListener("input", checkInputs);
    eventStartTimeInput.addEventListener("input", checkInputs);
    eventEndTimeInput.addEventListener("input", checkInputs);
    eventTypeInput.addEventListener("change", checkInputs); // Checking event type selection

    // Modal 1: Next tugmasi bosilganda
    document.getElementById("next-to-modal-2").addEventListener("click", function () {
        // Modal 1dagi formdagi inputlarni tekshirish
        var form = document.getElementById("add-event");
        if (form.checkValidity()) {
            $('#kt_modal_create_event').modal('hide'); // Modal 1 yopiladi
            $('#modal-view-event-details').modal('show'); // Modal 2 ochiladi
        } else {
            form.reportValidity(); // Foydalanuvchiga to'ldirishni eslatish
        }
    });

    // Modal 2: Back tugmasi bosilganda
    document.getElementById("back-to-modal-1").addEventListener("click", function () {
        $('#modal-view-event-details').modal('hide'); // Modal 2 yopiladi
        $('#kt_modal_create_event').modal('show'); // Modal 1 ochiladi
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
        // alert("Event successfully added!");
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

function selectRoom(button) {
    // Remove 'selected' class from all buttons
    const buttons = document.querySelectorAll('.room-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));

    // Add 'selected' class to the clicked button
    button.classList.add('selected');

    // Show the 'Next' button
    document.getElementById('next-to-modal-3').style.display = 'inline-block';
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

        // Holatni qayta tekshirish uchun
        checkInputs(); // Ensures that Next button visibility is updated

        // Refresh the browser
        window.location.reload(); // This will reload the page
    });
});

// Event listeners
document.querySelectorAll('#modal-view-event-final .form-control:not(#captcha-input)').forEach(input => {
    input.addEventListener('input', checkInputs);
});

document.getElementById('captcha-input').addEventListener('input', checkCaptcha);

// Initialize state
checkInputs();
