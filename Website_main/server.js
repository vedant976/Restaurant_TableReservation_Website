const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3044;

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

mongoose.connect('mongodb://127.0.0.1:27017/reservations', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', (error) => console.error("MongoDB connection error:", error));
db.once('open', () => {
    console.log("MongoDB connected successfully.");
});

const reservationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true }
});
const Reservation = mongoose.model("Reservation", reservationSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "Reservations.html"));
});

app.post('/post', async (req, res) => {
    const { name, email, phone, date, time, guests } = req.body;

    if (!name || !email || !phone || !date || !time || !guests) {
        console.error("Reservation submission failed: Missing required fields.");
        return res.status(400).send("All fields are required. <a href='/'>Go back</a>");
    }

    try {
        const reservation = new Reservation({ name, email, phone, date, time, guests });
        await reservation.save();
        console.log("Reservation saved:", reservation);
        res.redirect('/bookingconfirmation.html');
    } catch (error) {
        console.error("Error saving reservation:", error.message);
        res.status(500).send("An error occurred while saving the reservation.");
    }
});

app.get('/bookingconfirmation.html', (req, res) => {
    res.send("Reservation confirmed! Make another reservation <a href='/'>here</a>.");
});

app.put('/reservation/update', async (req, res) => {
    const { name } = req.query; 
    const { date, time, guests } = req.body; 

    if (!name) {
        console.error("Update failed: No reservation name provided.");
        return res.status(400).json({ error: 'Reservation name is required' });
    }

    const trimmedName = name.trim();
    const trimmedDate = date ? date.trim() : date;
    const trimmedTime = time ? time.trim() : time;
    
    console.log(`Received update request. Name: ${trimmedName}, Data:`, { date: trimmedDate, time: trimmedTime, guests });

    try {
        const updatedReservation = await Reservation.findOneAndUpdate(
            { name: trimmedName },
            { date: trimmedDate, time: trimmedTime, guests }, 
            { new: true, runValidators: true }
        );

        if (updatedReservation) {
            console.log("Reservation updated successfully:", updatedReservation);
            res.json({ message: 'Reservation updated successfully', reservation: updatedReservation });
        } else {
            console.warn(`Update failed: No reservation found with name: ${trimmedName}`);
            res.status(404).json({ error: 'Reservation not found' });
        }
    } catch (error) {
        console.error("Error during reservation update:", error.message);
        res.status(500).json({ error: 'An error occurred while updating the reservation' });
    }
});


app.delete('/reservation/cancel', async (req, res) => {
    console.log("Delete request received on server"); 
    
    let { name } = req.query;
    if (!name) {
        console.error("No reservation name provided");
        return res.status(400).json({ error: 'Reservation name is required' });
    }
    
    const trimmedName = name.trim();
    console.log("Trimmed name:", trimmedName); 

    try {
        const updatedReservation = await Reservation.findOneAndDelete(
            { name: trimmedName },
            { cancelled: true },
            { new: true }
        );

        if (updatedReservation) {
            console.log("Reservation cancelled:", updatedReservation);
            res.json({ message: 'Reservation cancelled successfully', reservation: updatedReservation });
        } else {
            console.error("Reservation not found");
            res.status(404).json({ error: 'Reservation not found' });
        }
    } catch (error) {
        console.error("Error during cancellation:", error);
        res.status(500).json({ error: 'An error occurred while cancelling the reservation' });
    }
});



app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});