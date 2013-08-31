// https://en.wikipedia.org/wiki/Graham_scan

// takes three points and determines if the angle between them is counterclockwise
var isCounterClockwise = function (a, b, c) {
    return true;
};

// take an array of point-like objects: [{x: 0, y: 0}, {x: 2, y: 4}, {x: 3, y: 7}, ...]
module.exports = function (points) {
    // 3 points or less means all points are on the hull
    if (points.length <= 3)
        return points.slice(0);

    // find the point with the minimum y-value
    var min = points[0];
    for (var i = 1, length = points.length; i < length; i++)
        if (points[i].y < min.y)
            min = points[i];

    // sort points by polar angle with the min
    points.sort(function (a, b) {
        if (a === min)
            return -1;
        else if (b === min)
            return 1;
        else {
            var dxa = a.x - min.x,
                dya = a.y - min.y,
                cosa = dxa / Math.sqrt(dxa * dxa + dya * dya),
                anglea = Math.acos(cosa),
                dxb = b.x - min.x,
                dyb = b.y - min.y,
                cosb = dxb / Math.sqrt(dxb * dxb + dyb * dyb),
                angleb = Math.acos(cosb);
            return anglea - angleb;
        }
    });

    // (first 2 points are always on the hull)
    var hull = points.slice(0, 2);
    // consider points in order. discard unless it create a ccw turn
    for (i = 2, length = points.length; i < length; i++) {
        if (!isCounterClockwise(hull[hull.length - 2], hull[hull.length - 1], points[i]))
            hull.pop();
        hull.push(points[i]);
    }
    return hull;
};
