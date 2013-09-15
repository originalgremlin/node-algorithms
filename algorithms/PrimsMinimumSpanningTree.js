Basic Algorithm (Video 5-2)

graph G
initialize X = {s}   (s is a member of V chosen arbitrarily) (X is a set of vertices)
T = { } (null set) (invariant: X = vertices spanned by tree-so-far T) (T is a tree)
while X is not V: (while there are vertices we dont yet span)
    let edge e = (vertex u, vertex v) be the cheapest edge of G with u member of X, v not member of X   (cross the frontier)
    add e to T
    add v to X
return T

(i.e. increase the number of spanned vertices in cheapest way possible)
-------

V = all vertices
X = vertices in tree-so-far
V - X = vertices we have not yet seen
T = edges in tree-so-far

initialize X = [s] (s is a member of V chosen arbitrarily)
T != null set (invariant: X = vertices spanned by tree-so-far T)
while X != V:
    let e = (u, v) be the cheapest edge of G with u member of X, v not member of X
    add e to T
    add v to X

Video: 5-6 "Fast Implementation I"
keys = edges (is okay and easier, but can do better)
keys = vertices (better algorithm)

heap invariant #1: elements in heap = vertices of V - X (i.e. vertices not yet seen)
heap invariant #2: for v in V - X, key[v] = cheapest edge (u,v) with u in X
for vertices with no edges crossing the frontier, the key value is +Infinity

Initialize Heap:
can initialize heap with O(m + n log n) = O(m log n) preprocessing
at beginning:
    X = {s}, V - X = all other vertices
    key value for vertex: edge cost to s if one exists, infinity otherwise
    scan once through all edges to compute key values (O(m))
    insert vertices into the heap (heapify) (O(n))
now, given invariants, extract-min yields next vertex v not in X and edge(u,v) crossing (X,V-X) to add to X and T, respectively

maintain invariant #2 after extract-min:
when v added to X:
    for each edge (v,w) (i.e. the only vertices whose key might have dropped)
        if w in V - X  (i.e. update key if needed)
            delete w from heap
            recompute key[w] = min[key[w], (v,w)]
            re-insert w into heap

        or:
            recompute key[w] = min[key[w], (v,w)]
            if key[w] changed:
                update key[w]
                siftDown(w)  (always siftDown because key[w] can only decrease)

need more bookkeeping to store map from index in the heap to vertex

--------

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
