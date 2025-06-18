// schoolController.js
import School from "./schoolModel.js";

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export const addSchool = async (req, res) => {
    try {
        const { name, address, latitude, longitude } = req.body;

        if (!name || !address || latitude == null || longitude == null) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
            return res.status(400).json({ message: "Latitude and Longitude must be numbers" });
        }

        const school = new School({ name, address, latitude, longitude });
        await school.save();

        res.status(201).json({ message: "School added successfully", school });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

export const listSchools = async (req, res) => {
    try {
        const { lat, lng } = req.query; // Change to 'lat' and 'lng'

        const userLat = parseFloat(lat); // Use 'lat'
        const userLon = parseFloat(lng); // Use 'lng'

        if (isNaN(userLat) || isNaN(userLon)) {
            return res.status(400).json({ message: "Invalid latitude or longitude" });
        }

        const schools = await School.find();

        const schoolsWithDistance = schools.map(school => {
            const distance = getDistance(userLat, userLon, school.latitude, school.longitude);
            return { ...school.toObject(), distance };
        });

        schoolsWithDistance.sort((a, b) => a.distance - b.distance);

        res.json(schoolsWithDistance);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};