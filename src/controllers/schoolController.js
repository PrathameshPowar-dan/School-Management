import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Haversine Formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// POST Add School
export const addSchool = async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Name is required and must be a string.' });
    }
    if (!address || typeof address !== 'string' || address.trim() === '') {
        return res.status(400).json({ error: 'Address is required and must be a string.' });
    }
    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
        return res.status(400).json({ error: 'Latitude must be a valid number between -90 and 90.' });
    }
    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
        return res.status(400).json({ error: 'Longitude must be a valid number between -180 and 180.' });
    }

    try {
        const newSchool = await prisma.school.create({
            data: { name, address, latitude, longitude },
        });

        res.status(201).json({ message: 'School added successfully', school: newSchool });
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: 'Internal server error while adding the school.' });
    }
};

// GET List Schools
export const listSchools = async (req, res) => {
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    // Validation
    if (isNaN(userLat) || userLat < -90 || userLat > 90) {
        return res.status(400).json({ error: 'Please provide a valid user latitude in the query.' });
    }
    if (isNaN(userLon) || userLon < -180 || userLon > 180) {
        return res.status(400).json({ error: 'Please provide a valid user longitude in the query.' });
    }

    try {
        const schools = await prisma.school.findMany();

        const schoolsWithDistance = schools.map(school => {
            const distance = calculateDistance(userLat, userLon, school.latitude, school.longitude);
            return {
                ...school,
                distance_km: parseFloat(distance.toFixed(2))
            };
        });

        schoolsWithDistance.sort((a, b) => a.distance_km - b.distance_km);

        res.status(200).json(schoolsWithDistance);
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: 'Internal server error while fetching schools.' });
    }
};