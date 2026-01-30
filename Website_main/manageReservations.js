$(document).ready(function() {
    // Anvay & Kennith: This code will fetch reservations from the server and populate the list
    function fetchReservations() {
        $.get('/reservation/findAll', function(reservations) {
            $('#reservation-list').empty();
            reservations.forEach(function(reservation) {
                $('#reservation-list').append(`
                    <li>
                        <span>${reservation.name} - ${reservation.date} at ${reservation.time} for ${reservation.guests} guests</span>
                        <div>
                            <button class="reservation-button" onclick="editReservation('${reservation._id}')">Edit</button>
                            <button class="delete-button" onclick="deleteReservation('${reservation.name}')">Delete</button>
                        </div>
                    </li>
                `);
            });
        });
    }

    // Anvay & Kennith: This code will load reservations when the page loads
    fetchReservations();

    // Anvay & Kennith: This code will populate the update form when editing
    window.editReservation = function(name) {
        const encodedName = encodeURIComponent(name); 
        $.get(`/reservation/findByName?name=${encodedName}`, function(reservation) {
            $('#reservation-id').val(reservation._id); 
            $('#name').val(reservation.name);
            $('#date').val(reservation.date);
            $('#time').val(reservation.time);
            $('#guests').val(reservation.guests);
        });
    };

    // Anvay & Kennith: This code will handle update form submission with trimming
    $('#update-reservation-form').submit(function(event) {
        event.preventDefault();

        
        const nameInput = $('#name');
        const trimmedName = nameInput.val().trim();
        nameInput.val(trimmedName);

        const encodedName = encodeURIComponent(trimmedName);
        const data = {
            name: trimmedName,
            date: $('#date').val(),
            time: $('#time').val(),
            guests: $('#guests').val(),
        };

        console.log("Updating reservation with name:", trimmedName);
        console.log("Data:", data);

        $.ajax({
            url: `/reservation/update?name=${encodedName}`,
            method: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(response) {
                console.log("Update success:", response);
                alert('Reservation updated successfully');
                fetchReservations(); 
                $('#update-reservation-form')[0].reset(); 
            },
            error: function(xhr, status, error) {
                console.error("Update failed:", status, error);
                alert('Failed to update reservation. Error: ' + error);
            }
        });
    });

    // Anvay & Kennith: This code will delete reservation by name using the delete form
    $('#delete-reservation-form').submit(function(event) {
        event.preventDefault();
        const name = $('#delete-name').val().trim();

        if (confirm(`Are you sure you want to delete the reservation for ${name}?`)) {
            $.ajax({
                url: `/reservation/cancel?name=${encodeURIComponent(name)}`,
                method: 'DELETE',
                success: function() {
                    alert(`Reservation for ${name} deleted successfully`);
                    fetchReservations();
                    $('#delete-reservation-form')[0].reset();
                },
                error: function() {
                    alert('Failed to delete reservation');
                }
            });
        }
    });

    // Anvay & Kennith: This code will delete reservation by name when clicking individual delete buttons
    window.deleteReservation = function(name) {
        const trimmedName = name.trim();

        if (confirm(`Are you sure you want to delete the reservation for ${trimmedName}?`)) {
            $.ajax({
                url: `/reservation/cancel?name=${encodeURIComponent(trimmedName)}`,
                method: 'DELETE',
                success: function() {
                    alert(`Reservation for ${trimmedName} deleted successfully`);
                    fetchReservations();
                },
                error: function() {
                    alert('Failed to delete reservation');
                }
            });
        }
    };
});
