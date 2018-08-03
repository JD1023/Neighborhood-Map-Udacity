const clientId = 'A5YQW02V1ENTLEICYKHP0VSRO5HSFSRWUWQ5C5UDFT4JXBVD';
const clientSecret = '5UOEEYOVPBWLIJ3I22C50NURST4JGNY1ULG43XPIGWTW3NIF';
const clientVersion = '20180728'

export const getVenueDetails = (venue) =>
    fetch(`https://api.foursquare.com/v2/venues/${venue}?client_id=${clientId}&client_secret=${clientSecret}&v=${clientVersion}`, {
        headers: {}
    })
    .then(response => response.json())
    .then(r => r)


export const getVenueLists = (venue) =>
    fetch(`https://api.foursquare.com/v2/venues/${venue}/listed?client_id=${clientId}&client_secret=${clientSecret}&v=${clientVersion}`, {
        headers: {}
    })
    .then(response => response.json())
    .then(r => r)
