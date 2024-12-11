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
                url: '/notifications',
                method: 'GET',
                success: function (response) {
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
            const modal = new bootstrap.Modal(document.getElementById('kt_modal_view_event'));
            modal.show();

            document.querySelector('[data-kt-calendar="event_name"]').textContent = info.event.title;
            document.querySelector('[data-kt-calendar="event_description"]').textContent = info.event.extendedProps.description || 'No description';
            document.querySelector('[data-kt-calendar="event_location"]').textContent = info.event.extendedProps.location || 'No location';
            document.querySelector('[data-kt-calendar="event_start_date"]').textContent = formatDate(info.event.start);
            document.querySelector('[data-kt-calendar="event_end_date"]').textContent = info.event.end
                ? formatDate(info.event.end)
                : 'Not specified';
            document.querySelector('[data-kt-calendar="all_day"]').textContent = info.event.allDay ? 'All Day' : '';
            document.querySelector('[data-kt-calendar="fullname"]').textContent = info.event.extendedProps.name || 'No name provided';
            document.querySelector('[data-kt-calendar="phone_number"]').textContent = info.event.extendedProps.phone_number || 'No phone number provided';
            document.querySelector('[data-kt-calendar="email"]').textContent = info.event.extendedProps.email || 'No email provided';
        },
        dateClick: function (info) {
            console.log('Clicked date:', info.dateStr);

            const modal = new bootstrap.Modal(document.getElementById('kt_modal_create_event'));
            modal.show();

            $('#event-date').val(info.dateStr);

            $.ajax({
                url: '/notifications-by-date',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    _token: $('meta[name="csrf-token"]').attr('content'),
                    date: info.dateStr,
                }),
                success: function (data) {
                    buildingData = data;
                    populateBuildings();
                },
                error: function (xhr, status, error) {
                    console.error('AJAX request failed:', error);
                }
            });
        }
    });

    calendar.render();

    function formatDate(date) {
        return new Intl.DateTimeFormat('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Asia/Tashkent'
        }).format(date);
    }

    $('.datetimepicker').datepicker({
        timepicker: true,
        language: 'en',
        range: true,
        multipleDates: true,
        multipleDatesSeparator: " - "
    });

    $("#add-event").submit(function (e) {
        e.preventDefault();

        var title = $('#event-title').val();
        var date = $('#event-date').val();

        calendar.addEvent({
            title: title,
            start: date,
            allDay: false,
        });

        $('#kt_modal_create_event').modal('hide');
        $('#add-event')[0].reset();
    });
});

// Global variable for building data
let buildingData = [];

// Function to populate the building dropdown
function populateBuildings() {
    const buildingSelect = document.getElementById("building-select");
    buildingSelect.innerHTML = '';

    buildingData.forEach(building => {
        const option = document.createElement("option");
        option.value = building.id;
        option.textContent = building.name;
        buildingSelect.appendChild(option);
    });

    if (buildingData.length > 0) {
        updateRoomTable(buildingData[0].id);
    }
}

// Function to update the room table
function updateRoomTable(buildingId) {
    const building = buildingData.find(b => b.id === parseInt(buildingId));
    const rooms = building ? building.rooms : [];
    const tableBody = document.querySelector("#room-table tbody");
    tableBody.innerHTML = '';

    rooms.forEach(room => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td class="room-cell">Select</td>
                <td>${room.room}</td>
                <td>${room.available}</td>
                <td>${room.unavailable}</td>
            `;
        row.querySelector(".room-cell").addEventListener("click", function () {
            console.log("Building Select ID:", document.getElementById("building-select").value); // Logs the building-select value
            console.log("Room Select ID:", room.id); // Logs the Room ID from the room data

            openModal(building, room);
        });
        tableBody.appendChild(row);
    });
}

// Function to open the modal with room details
function openModal(building, room) {
    const modal = new bootstrap.Modal(document.getElementById('modal-view-event-final'));
    document.querySelector('#modal-building-name').value = building.name;
    const roomNumberElement = document.querySelector('#modal-room-number');
    roomNumberElement.value = room.room;
    roomNumberElement.setAttribute('data-room-id', room.id); // Store the room ID
    modal.show();
}

// Event listener for building selection change
document.getElementById("building-select").addEventListener("change", function () {
    const selectedBuilding = this.value;
    updateRoomTable(selectedBuilding);
});

// Populate buildings on page load
window.onload = populateBuildings;

// Submit button functionality
document.getElementById("finish-modal").addEventListener("click", function () {
    const eventDate = document.getElementById("event-date").value;
    const buildingId = document.getElementById("building-select").value;
    const roomId = document.getElementById("modal-room-number").getAttribute('data-room-id');
    const eventStartTime = document.getElementById("event-start-time").value;
    const eventEndTime = document.getElementById("event-end-time").value;
    const fullname = document.getElementById("fullname").value;
    const phoneNumber = document.getElementById("phone-number").value;
    const email = document.getElementById("email").value;
    const eventName = document.getElementById("event-name").value;
    const eventDesc = document.getElementById("event-desc").value;
    const buildingName = document.getElementById("building-select").options[document.getElementById("building-select").selectedIndex].text;

    const roomName = document.getElementById("modal-room-number").value;

    const submitButton = document.getElementById('finish-modal');
    const closeButton = document.getElementById('close-modal');
    const modalFooter = document.querySelector('.modal-footer');

    submitButton.style.display = 'none';
    closeButton.style.display = 'none';

    const waitingMessage = document.createElement('span');
    waitingMessage.id = 'waiting-message';
    waitingMessage.textContent = 'Please wait...';
    waitingMessage.style.fontSize = '16px';
    waitingMessage.style.color = 'gray';
    modalFooter.appendChild(waitingMessage);

    const eventData = {
        _token: $('meta[name="csrf-token"]').attr('content'),
        event_date: eventDate,
        event_start_time: eventStartTime,
        event_end_time: eventEndTime,
        building_id: buildingId,
        room_id: roomId,
        fullname: fullname,
        phone_number: phoneNumber,
        email: email,
        event_name: eventName,
        event_description: eventDesc
    };

    $.ajax({
        url: '/notifications',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(eventData),
        success: function (response) {
            console.log("Event created successfully:", response);

            waitingMessage.remove();
            document.getElementById('modal-view-event-final').style.display = 'none';
            $("#modal-view-event-final").modal('hide');

            Swal.fire({
                title: 'Success!',
                text: 'Your data has been submitted.',
                icon: 'success'
            }).then(() => {
                location.reload();
            });

            submitButton.style.display = 'inline-block';
            closeButton.style.display = 'inline-block';

            // sendEmail({
            //     to: email,
            //     title: "Event Created Successfully",
            //     body: `Dear ${fullname},\n\nYour event "${eventName}" has been successfully created and scheduled for ${eventDate} from ${eventStartTime} to ${eventEndTime}.\n\nEvent Details:\n- Building: ${buildingName}\n- Room: ${roomName}\n- Full Name: ${fullname}\n- Phone Number: ${phoneNumber}\n- Event Name: ${eventName}\n- Event Description: ${eventDesc}\n\nCurrently, the event is pending approval from the administrators. You will be notified via email once it is confirmed.\n\nThank you!`
            // });
        },
        error: function (xhr, status, error) {
            waitingMessage.remove();

            let errorMessage = 'There was an error adding the event!';

            try {
                const response = JSON.parse(xhr.responseText);
                errorMessage = response.error || errorMessage;
            } catch (e) {
                console.error("Failed to parse error response:", e);
            }

            // If error occurs, send detailed information about the input fields that caused the error
            // const errorDetails = `
            //     Event Date: ${eventDate}
            //     Building: ${buildingName}
            //     Room: ${roomName}
            //     Start Time: ${eventStartTime}
            //     End Time: ${eventEndTime}
            //     Full Name: ${fullname}
            //     Phone Number: ${phoneNumber}
            //     Email: ${email}
            //     Event Name: ${eventName}
            //     Event Description: ${eventDesc}
            // `;

            Swal.fire({
                title: 'Error!',
                text: `${errorMessage}`,
                icon: 'error'
            }).then(() => {
                location.reload();
            });

            submitButton.style.display = 'inline-block';
            closeButton.style.display = 'inline-block';

            // sendEmail({
            //     to: email,
            //     title: "Error in Event Submission",
            //     body: `An error occurred while submitting the event "${eventName}". Error details: ${errorMessage}\n\nEvent Data:\n${errorDetails}`
            // });
        }
    });

    // function sendEmail(data) {
    //     $.ajax({
    //         url: '/send-email',
    //         method: 'POST',
    //         contentType: 'application/json',
    //         data: JSON.stringify({
    //             _token: $('meta[name="csrf-token"]').attr('content'),
    //             to: data.to,
    //             title: data.title,
    //             body: data.body
    //         }),
    //         success: function(response) {
    //             console.log("Email sent successfully:", response);
    //         },
    //         error: function(xhr, status, error) {
    //             console.error("Error sending email:", error);
    //         }
    //     });
    // }
});

