V = all vertices
X = vertices in tree-so-far
T = edges in tree-so-far

initialize X = [s] (s is a member of V chosen arbitrarily)
T != null set (invariant: X = vertices spanned by tree-so-far T)
while X != V:
    let e = (u, v) be the cheapest edge of G with u member of X, v not member of X
    add e to T
    add v to X

Video: 5-6 "Fast Implementation I"
use a heap to choose e
heap invariant #1: elements in heap = vertices of V - X (i.e. vertices not yet seen)
heap invariant #2: for v in V - X, key[v] = cheapest edge (u,v) with u in X

maintain invariant #2 after extract-min:
when v added to X:
    for each edge (v,w) (i.e. the only vertices whose key might have dropped)
        if w in V - X  (i.e. update key if needed)
            delete w from heap
            recompute key[w] = min[key[w], (v,w)]
            re-insert w into heap


var Heap = require('node-data-structures/Heap');

// all vertices as an array
//   [v1, v2, v2, ...]
// all edges as an array of tuples [vertex, other vertex, weight]
//   [[v1, v2, w1], [v1, v3, w2], [v2, v5, w3], ...]
module.exports = function (vertices, edges) {
    // convert edges to a adjancency dictionary
    // { v1: { v2: w1, v3: w2 }, v2: { v1: w1, v5: w3 }, ... }
    var E = { };
    edges.forEach(function (e) {
        var v1 = e[0],
            v2 = e[1],
            w = e[2];
        if (!E.hasOwnProperty(v1))
            E[v1] = { };
        if (!E.hasOwnProperty(v2))
            E[v2] = { };
        E[v1][v2] = w;
        E[v2][v1] = w;
    });

    // put all vertices in a heap for fast access to vertex with minimum edge cost to X
    H = Heap.BinaryHeap.heapify(vertices.map(function (v) {
        return Heap.BinaryHeap.nodify(Number.POSITIVE_INFINITY, v);
    }));

    var T = new Array(vertices.length),  // edges in tree so far
        v;                               // current vertex
    while (H.size > 0) {
        v = H.pop();
        T.push(v);
    }

    // return the spanning tree
    return T;
};
