<div id="kt_modal_create_event" class="modal fade">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <form id="add-event">
                <div class="modal-body">
                    <h4 class="text-center">Room Availability</h4>
                    <table class="table table-bordered" id="room-table">
                        <thead>
                        <tr>
                            <th>Choose</th>
                            <th>Room</th>
                            <th>Available</th>
                            <th>Unavailable</th>
                        </tr>
                        </thead>
                        <tbody>
                        <!-- Dynamic Room Data will be inserted here -->
                        </tbody>
                    </table>

                    <!-- Building Selection -->
                    <select id="building-select" class="form-select">
                        <!-- Dynamic Buildings will be inserted here -->
                    </select>

                </div>

                <!-- Modal Footer -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                </div>
            </form>
        </div>
    </div>
</div>


<div id="modal-view-event-final" class="modal fade" tabindex="-1" aria-labelledby="modal3Label" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-body">
                <h4 class="text-center">Add Event Detail</h4>
                <div class="modal-body">
                    <!-- Row 1: Labels -->
                    <div class="form-row">
                        <div class="form-group col">
                            <label for="event-date">Event Date</label>
                        </div>
                        <div class="form-group col">
                            <label for="modal-building-name">Building</label>
                        </div>
                        <div class="form-group col">
                            <label for="modal-room-number">Room Number</label>
                        </div>
                    </div>

                    <!-- Row 2: Values -->
                    <div class="form-row">
                        <div class="form-group col">
                            <input type="text" class="form-control" name="date" id="event-date" value="event-date" readonly>
                        </div>
                        <div class="form-group col">
                            <input type="text" class="form-control" id="modal-building-name" value="modal-building-name" readonly>
                        </div>
                        <div class="form-group col">
                            <input type="text" class="form-control" id="modal-room-number" value="modal-room-number" readonly>
                        </div>
                    </div>
                </div>


                <div class="form-group">
                    <label for="event-start-time">Event Start Time</label>
                    <input type="time" class="form-control" name="start_time" id="event-start-time" required>
                </div>

                <!-- Event End Time -->
                <div class="form-group">
                    <label for="event-end-time">Event End Time</label>
                    <input type="time" class="form-control" name="end_time" id="event-end-time" required>
                </div>
                <div class="form-group">
                    <label for="fullname">Fullname</label>
                    <input type="text" class="form-control" id="fullname" name="fullname">
                </div>

                <div class="form-group">
                    <label for="phone-number">Phone Number</label>
                    <input type="tel" class="form-control" id="phone-number" name="number">
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" class="form-control" id="email" name="email">
                </div>

                <div class="form-group">
                    <label for="event-name">Event name</label>
                    <input type="text" class="form-control" id="event-name" name="event_name">
                </div>

                <div class="form-group">
                    <label for="event-desc">Event Description</label>
                    <textarea class="form-control" id="event-desc" name="edesc"></textarea>
                </div>

            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="finish-modal">Submit</button>
                <button type="button" class="btn btn-primary" id="close-modal" data-bs-dismiss="modal">Close</button>

            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="kt_modal_view_event">
    <div class="modal-dialog modal-dialog-centered mw-650px">
        <div class="modal-content">
            <div class="modal-header border-0 justify-content-end">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body pt-0 pb-20 px-lg-17">
                <div class="d-flex">
                    <div class="mb-9">
                        <div class="d-flex align-items-center mb-2">
                            <span class="fs-3 fw-bold me-3" data-kt-calendar="event_name"></span>
                            <span class="badge badge-light-success" data-kt-calendar="all_day"></span>
                        </div>
                        <div class="fs-6" data-kt-calendar="event_description"></div>
                    </div>
                </div>

                <div class="d-flex align-items-center mb-2">
                    <span class="bullet bullet-dot h-10px w-10px bg-active-dark ms-2 me-7"></span>
                    <div class="fs-6"><span class="fw-bold">Starts</span> <span
                            data-kt-calendar="event_start_date"></span></div>
                </div>

                <div class="d-flex align-items-center mb-2">
                    <span class="bullet bullet-dot h-10px w-10px bg-active-dark ms-2 me-7"></span>
                    <div class="fs-6"><span class="fw-bold">Ends</span> <span data-kt-calendar="event_end_date"></span>
                    </div>
                </div>
                <div class="d-flex align-items-center mb-9">
                    <span class="bullet bullet-dot h-10px w-10px bg-active-dark ms-2 me-7"></span>
                    <div class="fs-6" data-kt-calendar="event_location"></div>
                </div>

                <div class="d-flex flex-column mb-9">
                    <div class="d-flex align-items-center mb-2">
                        <span class="fs-3 fw-bold me-3">Organized</span>
                    </div>
                    <!-- Fullname -->
                    <div class="d-flex align-items-center mb-3">
                        <span class="bullet bullet-dot h-10px w-10px bg-active-dark ms-2 me-7"></span>
                        <div class="fs-6"><span class="fw-bold">Fullname:</span> <span
                                data-kt-calendar="fullname"></span></div>
                    </div>

                    <!-- Phone Number -->
                    <div class="d-flex align-items-center mb-3">
                        <span class="bullet bullet-dot h-10px w-10px bg-active-dark ms-2 me-7"></span>
                        <div class="fs-6"><span class="fw-bold">Phone Number:</span> <span
                                data-kt-calendar="phone_number"></span></div>
                    </div>

                    <!-- Email -->
                    <div class="d-flex align-items-center">
                        <span class="bullet bullet-dot h-10px w-10px bg-active-dark ms-2 me-7"></span>
                        <div class="fs-6"><span class="fw-bold">Email:</span> <span data-kt-calendar="email"></span>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    </div>
</div>
