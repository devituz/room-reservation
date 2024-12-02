
<div id="kt_modal_create_event" class="modal fade" tabindex="-1" aria-labelledby="modal1Label" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <form id="add-event">
                <div class="modal-body">
                    <h4 class="text-center">Add Event Detail</h4>
                    <!-- Event Date Picker -->
                    <div class="form-group">
                        <label for="event-date">Event Date</label>
                        <input type="text" class="form-control" name="date" id="event-date" readonly required>
                    </div>

                    <!-- Event Start Time -->
                    <div class="form-group">
                        <label for="event-start-time">Event Start Time</label>
                        <input type="time" class="form-control" name="start_time" id="event-start-time" required>
                    </div>

                    <!-- Event End Time -->
                    <div class="form-group">
                        <label for="event-end-time">Event End Time</label>
                        <input type="time" class="form-control" name="end_time" id="event-end-time" required>
                    </div>
                    <!-- Event Type Selection Dropdown -->
                    <div class="form-group">
                        <label for="event-type">Select the building</label>
                        <select class="form-control" name="event_type" id="event-type" required>
                            <option value="" disabled selected>Select the building</option>
                            <!-- JavaScript orqali dynamically buildings qo'shiladi -->
                        </select>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="next-to-modal-2" style="display: none;">Next</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                </div>
            </form>
        </div>
    </div>
</div>

<div id="modal-view-event-details" class="modal fade" tabindex="-1" aria-labelledby="modal2Label" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-body">
                <h4 class="text-center">Confirm Event Details</h4>
                <p class="text-center mb-4">Please confirm the details and proceed by selecting a room.</p>

                <!-- Room buttons -->
                <div id="room-buttons-container" class="d-flex flex-wrap justify-content-center">
                    <!-- Room buttons will be populated here -->
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="back-to-modal-1">Back</button>
                <button type="button" class="btn btn-primary" id="next-to-modal-3" style="display: none;">Next</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal for final step -->
<div id="modal-view-event-final" class="modal fade" tabindex="-1" aria-labelledby="modal3Label" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-body">
                <h4 class="text-center">Add Event Detail</h4>

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

                <!-- CAPTCHA -->
                <div id="captcha-container" style="display: none;"> <!-- Initially hidden -->
                    <div class="form-group">
                        <label for="captcha">What is <span id="captcha-question"></span>?</label>
                        <input type="text" class="form-control" id="captcha-input" name="captcha">
                        <small id="captcha-error" class="text-danger" style="display:none;">Incorrect answer. Please try again.</small>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="back-to-modal-2">Back</button>
                <button type="button" class="btn btn-primary" id="finish-modal" style="display: none;">Submit</button> <!-- Initially hidden -->
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>



<div class="modal fade" id="kt_modal_view_event" tabindex="-1" data-bs-focus="false" aria-hidden="true">
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
                    <span class="bullet bullet-dot h-10px w-10px bg-success ms-2 me-7"></span>
                    <div class="fs-6"><span class="fw-bold">Starts</span> <span data-kt-calendar="event_start_date"></span></div>
                </div>

                <div class="d-flex align-items-center mb-9">
                    <span class="bullet bullet-dot h-10px w-10px bg-danger ms-2 me-7"></span>
                    <div class="fs-6"><span class="fw-bold">Ends</span> <span data-kt-calendar="event_end_date"></span></div>
                </div>

                <div class="d-flex align-items-center">
                    <div class="fs-6" data-kt-calendar="event_location"></div>
                </div>
            </div>
        </div>
    </div>
</div>
