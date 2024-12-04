$(document).ready(function () {
    var calendarEl = document.getElementById('kt_calendar_app');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: function (info, successCallback, failureCallback) {
            $.ajax({
                url: 'http://172.24.25.252:8080/api/notifications', // Your API endpoint to get events
                method: 'GET',
                success: function (response) {
                    // Format events from the response and pass them to FullCalendar
                    var events = response.events.map(function (event) {
                        return {
                            title: event.title,
                            start: event.start,
                            end: event.end,
                            description: event.description || 'No description',
                            location: event.location || 'No location',
                            color: event.color,
                            name: event.name,
                            phone_number: event.phone_number,
                            email: event.email,
                        };
                    });
                    successCallback(events);
                },
                error: function () {
                    failureCallback('Failed to load events.');
                }
            });
        },
        eventClick: function (info) {
            // Open modal to view event details
            const modal = new bootstrap.Modal(document.getElementById('kt_modal_view_event'));
            modal.show();

            // Set the modal content with the event's details
            document.querySelector('[data-kt-calendar="event_name"]').textContent = info.event.title;
            document.querySelector('[data-kt-calendar="event_description"]').textContent = info.event.extendedProps.description || 'No description';
            document.querySelector('[data-kt-calendar="event_location"]').textContent = info.event.extendedProps.location || 'No location';
            document.querySelector('[data-kt-calendar="event_start_date"]').textContent = formatDate(info.event.start);
            document.querySelector('[data-kt-calendar="event_end_date"]').textContent = info.event.end
                ? formatDate(info.event.end)
                : 'Not specified';
            document.querySelector('[data-kt-calendar="all_day"]').textContent = info.event.allDay ? 'All Day' : '';


            // Set the dynamic fields for Fullname, Phone Number, and Email
            document.querySelector('[data-kt-calendar="fullname"]').textContent = info.event.extendedProps.name || 'No name provided';
            document.querySelector('[data-kt-calendar="phone_number"]').textContent = info.event.extendedProps.phone_number || 'No phone number provided';
            document.querySelector('[data-kt-calendar="email"]').textContent = info.event.extendedProps.email || 'No email provided';

            },
        dateClick: function (info) {
            // Open modal to create a new event on date click
            const modal = new bootstrap.Modal(document.getElementById('kt_modal_create_event'));
            modal.show();

            // Fill the form with the clicked date
            $('#event-date').val(info.dateStr);
        }
    });

    // Render the calendar
    calendar.render();

    // Format date function (in Uzbekistan time)
    function formatDate(date) {
        return new Intl.DateTimeFormat('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Asia/Tashkent' // Uzbekistan time
        }).format(date);
    }

    // Datepicker settings for creating events
    $('.datetimepicker').datepicker({
        timepicker: true,
        language: 'en',
        range: true,
        multipleDates: true,
        multipleDatesSeparator: " - "
    });

    // Handle form submission to add a new event
    $("#add-event").submit(function (e) {
        e.preventDefault(); // Prevent default form submission

        // Get form data
        var title = $('#event-title').val();
        var date = $('#event-date').val();

        // Add the new event to FullCalendar
        calendar.addEvent({
            title: title,
            start: date,
            allDay: false,
        });

        // Close the modal
        $('#kt_modal_create_event').modal('hide');

        // Reset the form
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
            nextButton.style.display = "block";
        } else {
            nextButton.style.display = "none";
        }
    }

    // Inputlarni har doim tekshirish (real time)
    eventDateInput.addEventListener("input", checkInputs);
    eventStartTimeInput.addEventListener("input", checkInputs);
    eventEndTimeInput.addEventListener("input", checkInputs);
    eventTypeInput.addEventListener("change", checkInputs); // Checking event type selection
    function loadRoomsByBuilding(buildingId) {


        fetch('http://172.24.25.252:8080/api/get-rooms-by-building', {  // POST request to fetch rooms
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: buildingId})
        })
            .then(response => response.json())
            .then(data => {

                const roomButtonsContainer = document.getElementById('room-buttons-container');
                roomButtonsContainer.innerHTML = '';  // Clear any existing room buttons
                // Populate the room buttons dynamically
                data.forEach(room => {
                    const button = document.createElement('button');
                    button.classList.add('btn', 'btn-outline-primary', 'btn-lg', 'mb-2', 'room-btn');
                    button.id = `room${room.id}`;
                    button.textContent = room.name;  // Room name
                    button.onclick = function () {
                        selectRoom(button);
                    };  // Attach room selection function
                    roomButtonsContainer.appendChild(button);
                }

                );
            })

            .catch(error => console.error('Error loading rooms:', error));
    }

    // Modal 1: Next tugmasi bosilganda
// Modal 1: Next button to proceed to Modal 2
    document.getElementById("next-to-modal-2").addEventListener("click", function () {
        const buildingSelect = document.getElementById('event-type');
        const selectedBuildingId = buildingSelect.value;  // Get selected building ID

        const eventDate = document.getElementById("event-date").value; // Sana
        const eventStartTime = document.getElementById("event-start-time").value; // Boshlanish vaqti
        const eventEndTime = document.getElementById("event-end-time").value; // Tugash vaqti
        const eventType = document.getElementById("event-type").value; // Tanlangan bino

        // Konsolga chiqarish
        console.log("Event Date:", eventDate);
        console.log("Event Start Time:", eventStartTime);
        console.log("Event End Time:", eventEndTime);
        console.log("Selected Building (Event Type):", eventType);

        if (selectedBuildingId) {
            loadRoomsByBuilding(selectedBuildingId);  // Load rooms based on the selected building
            $('#kt_modal_create_event').modal('hide');  // Close Modal 1
            $('#modal-view-event-details').modal('show');  // Open Modal 2
        } else {
            alert("Please select a building before proceeding.");
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

        // Modal 1 ma'lumotlarini olish
        const eventDate = document.getElementById("event-date").value;
        const eventStartTime = document.getElementById("event-start-time").value;
        const eventEndTime = document.getElementById("event-end-time").value;
        const buildingSelect = document.getElementById('event-type');
        const selectedBuildingId = buildingSelect.value; // Building ID
        const selectedBuildingText = buildingSelect.options[buildingSelect.selectedIndex].text; // Building Name


        document.getElementById('finish-modal').style.display = 'none';
        document.getElementById('back-to-modal-2').style.display = 'none';
        document.getElementById('close-modal').style.display = 'none';
        document.querySelector('[data-bs-dismiss="modal"]').style.display = 'none';

        document.getElementById('loading-message').style.display = 'block';

        setTimeout(function () {
            document.getElementById('loading-message').style.display = 'none';

        }, 3000); // Simulating 3 seconds loading time

        // Modal 2-dagi tanlangan xona (room.id) ni olish
        const selectedRoomButton = document.querySelector('.room-btn.selected'); // "selected" class bilan tanlangan xona
        const selectedRoomId = selectedRoomButton ? selectedRoomButton.id.replace('room', '') : null; // room.id

        //  Modal 3-dagi ni olish
        const eventFullName = document.getElementById("fullname").value;
        const eventNumber = document.getElementById("phone-number").value;
        const eventEmail = document.getElementById("email").value;
        const eventEventName = document.getElementById("event-name").value;
        const eventEventDesc = document.getElementById("event-desc").value;

        // JSON formatiga to'plash
        const eventData = {
            event_date: eventDate,
            event_start_time: eventStartTime,
            event_end_time: eventEndTime,
            building_id: selectedBuildingId,
            room_id: selectedRoomId,
            fullname: eventFullName,
            phone_number: eventNumber,
            email: eventEmail,
            event_name: eventEventName,
            event_description: eventEventDesc
        };


        console.log("Event Data (JSON):", JSON.stringify(eventData));


        fetch('http://172.24.25.252:8080/api/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData)
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 422) {
                        response.json().then(data => {
                            const errorMessage = data.error || 'There was an error adding the event!';

                            Swal.fire({
                                title: 'Error!',
                                text: errorMessage,
                                icon: 'error'
                            }).then(() => {
                                document.getElementById('modal-view-event-final').style.display = 'none';

                                document.querySelectorAll('#modal-view-event-final .form-control').forEach(input => input.value = '');
                                checkInputs(); // Revalidate inputs
                                document.getElementById("event-start-time").value = '';
                                document.getElementById("event-end-time").value = '';
                                location.reload();
                            });
                        });

                    }
                }
                if (response.status === 201) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Your data has been submitted.',
                        icon: 'success'
                    }).then(() => {
                        document.getElementById('modal-view-event-final').style.display = 'none';
                        document.querySelectorAll('#modal-view-event-final .form-control').forEach(input => input.value = '');
                        checkInputs();
                        document.getElementById("event-start-time").value = '';
                        document.getElementById("event-end-time").value = '';
                        location.reload();

                    });
                }
            }).catch(error => {
            console.error('Error:', error);
            if (error.message.includes('HTTP status')) {
                alert(`Error: ${error.message}`);
            } else {
                alert("There was an error adding the event!");
            }
        });
    });

});


document.addEventListener('DOMContentLoaded', function () {
    // Buildinglarni APIdan yuklash funksiyasi
    function loadBuildings() {
        fetch('http://172.24.25.252:8080/api/buildings')  // API URL
            .then(response => response.json())  // JSON formatida javob olish
            .then(data => {
                const eventTypeSelect = document.getElementById('event-type');

                // Bo'sh optionni olib tashlash va yangi optionslarni qo'shish
                eventTypeSelect.innerHTML = '<option value="" disabled selected>Select the building</option>';

                // Har bir building uchun option qo'shish
                data.forEach(building => {
                    const option = document.createElement('option');
                    option.value = building.id;  // Building ID
                    option.textContent = building.name;  // Building nomi
                    eventTypeSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error loading buildings:', error);
            });
    }

    // Modal ochilganida buildingsni yuklash
    const modal = document.getElementById('kt_modal_create_event');
    modal.addEventListener('show.bs.modal', function () {
        loadBuildings();
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Start time input
    var startTimeInput = document.getElementById('event-start-time');
    // End time input
    var endTimeInput = document.getElementById('event-end-time');


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

document.querySelectorAll('#modal-view-event-final .form-control:not(#captcha-input)').forEach(input => {
    input.addEventListener('input', checkInputs);
});

document.getElementById('captcha-input').addEventListener('input', checkCaptcha);

checkInputs();





