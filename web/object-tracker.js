// Object Tracker - Manages object tracking logic
class ObjectTracker {
  constructor(app) {
    this.app = app;
  }

  getObjectHistory(objectId) {
    return this.app.objects[objectId].path;
  }

  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  getTotalDistance(objectId) {
    const path = this.getObjectHistory(objectId);
    let total = 0;
    for (let i = 1; i < path.length; i++) {
      total += this.calculateDistance(
        path[i - 1].lat,
        path[i - 1].lng,
        path[i].lat,
        path[i].lng
      );
    }
    return total;
  }
}

// Initialize tracker
if (typeof window !== 'undefined') {
  // Can be used by app
}
