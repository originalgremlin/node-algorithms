/*
    A represents the coefficients of the linear system.
    It is an n by (n + 1) matrix (i.e. 2D array of row * column) with
    n = number of basic variables + number of non-basic variables
    The extra column (A[row][0]) is for the constant term.

    z represents the objective function.
    It is a (n + 1) column vector (i.e. 1D array).
    The extra column (z[0]) is for the objective value.
*/

var EPSILON = 1e-6;

var chooseEntering = function (z) {
    // choose first possible entering variable
    for (var col = 1, N = z.length; col < N; col++)
        if (z[col] > 0)
            return col;
    // no valid entering variable? we're final.
    return -1;
};

var chooseLeaving = function (A, entering) {
    // no leaving variable for a valid entering variable? we're unbounded.
    var leaving = -1,
        restriction = Number.POSITIVE_INFINITY;
    // choose most restrictive leaving variable
    for (var row = 0, N = A.length; row < N; row++) {
        var tmp = -A[row][0] / A[row][entering];
        if ((A[row][entering] < 0) && (tmp < restriction)) {
            restriction = tmp;
            leaving = row + 1;
        }
    }
    return leaving;
};

// rearrange dictionary to enact the pivot
// i.e. swap the entering and leaving variables
var rearrange = function (A, z, entering, leaving) {
    var lrow = leaving - 1,
        lcol = leaving,
        erow = entering - 1,
        ecol = entering,
        divisor;
    // prepare A array for swap
    divisor = -A[lrow][ecol];
    A[lrow][ecol] = 0;
    A[lrow][lcol] = -1;
    // swap entering and leaving
    for (var col = 0, N = z.length; col < N; col++) {
        // set entering coefficients
        A[erow][col] = A[lrow][col] / divisor;
        // clear leaving coefficients
        A[lrow][col] = 0;
    }
    // replace leaving variable with entering variable in all rows
    for (var row = 0, M = A.length; row < M; row++) {
        for (var col = 0, N = z.length; col < N; col++) {
            // copy new entering coefficients to A[row]
            A[row][col] += A[row][ecol] * A[erow][col];
        }
        A[row][ecol] = 0;
    }
    // replace leaving variable with entering variable in z
    for (var col = 0, N = z.length; col < N; col++) {
        // copy new entering coefficients to z
        z[col] += z[ecol] * A[erow][col];
    }
    z[ecol] = 0;
};

module.exports = function (A, z) {
    var rv = [], entering, leaving;
    while (true) {
        // check for finality
        entering = chooseEntering(z);
        if (entering < 0)
            break;
        // check for boundedness
        leaving = chooseLeaving(A, entering);
        if (leaving < 0) {
            rv.push([null, null, Number.POSITIVE_INFINITY]);
            break;
        } else {
            rearrange(A, z, entering, leaving);
            rv.push([entering, leaving, z[0]]);
        }
    }
    return rv;
};
