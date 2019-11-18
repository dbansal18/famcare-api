const userLocations = [];

// const generateMessage = (username, text) => {
//     return {
//         username,
//         text,
//         createdAt: new Date().getTime()
//     }
// }

const generateLocationMessage = (username, coords) => {
    coords.createdAt = new Date()
    return {
        username,
        coords,
    }
}

const addUserLocation = (userLoc) => {
    if(!userLoc) return;
    var userLoca = {
        username: userLoc.username,
        coords: {
            lat: userLoc.lat,
            lon: userLoc.lon,
            createdAt: userLoc.createdAt,
        }
    }
    const user = userLocations.find(location => userLoc.username == location.username ? 
      location.coords = userLoca.coords : '');
    if(!user) userLocations.push(userLoca);
}

const getUserLocations = () => {
    return userLocations;
}

module.exports = {
    getUserLocations,
    addUserLocation,
    generateLocationMessage
}