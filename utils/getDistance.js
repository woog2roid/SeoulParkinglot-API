function getDistance(lat1, lng1, lat2, lng2) {
    if ((lat1 == lat2) && (lng1 == lng2)) return 0;

    let radLat1 = Math.PI * lat1 / 180;
    let radLat2 = Math.PI * lat2 / 180;
    let theta = lng1 - lng2;
    let radTheta = Math.PI * theta / 180;
    let dist = Math.sin(radLat1) * Math.sin(radLat2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
    if (dist > 1)
        dist = 1;

    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515 * 1.609344 * 1000;
    if (dist < 100) dist = Math.round(dist / 10) * 10;
    else dist = Math.round(dist / 100) * 100;

    return dist;
}

//console.log(getDistance(37.715133, 126.734086, 35.115078556, 129.041418419)/1000 + "km");