// Take an array of job objects: [{weight: 0, length: 1}, {weight: 2, length: 4}, {weight: 3, length: 7}, ...]
// Return the array sorted by descending weight/length.  This greedy algorithm will always produce the optimal ordering.
module.exports = function (jobs) {
    return jobs.sort(function (a, b) {
        return (b.weight / b.length) - (a.weight / a.length);
    });
};
