// Converts degrees to radians
const degreesToRadians = (degrees) => {
    return degrees * Math.PI / 180;
}

// Gets the location between two objects ...
// with latitude and longitude properties
export const getGeoPointDistance = (point1, point2) => {
    const earthRadius = 6371;

    const diffLat = degreesToRadians(point2.latitude - point1.latitude);
    const diffLong = degreesToRadians(point2.longitude - point1.longitude);

    const lat1 = degreesToRadians(point1.latitude);
    const lat2 = degreesToRadians(point2.latitude);

    const a = Math.sin(diffLat / 2) * Math.sin(diffLat / 2) +
              Math.sin(diffLong / 2) * Math.sin(diffLong / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return earthRadius * c;

}