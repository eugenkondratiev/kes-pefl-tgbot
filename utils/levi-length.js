module.exports = function(s1, s2, costs) {
    let i, j, flip, ch, chl, ii, ii2, cost, cutHalf;
    const l1 = s1.length;
    const l2 = s2.length;

    costs = costs || {};
    const cr = costs.replace || 1;
    const cri = costs.replaceCase || costs.replace || 1;
    const ci = costs.insert || 1.5;
    const cd = costs.remove || 1.5;

    cutHalf = flip = Math.max(l1, l2);

    const minCost = Math.min(cd, ci, cr);
    const minD = Math.max(minCost, (l1 - l2) * cd);
    const minI = Math.max(minCost, (l2 - l1) * ci);
    const buf = new Array((cutHalf * 2) - 1);

    for (let i = 0; i <= l2; ++i) {
        buf[i] = i * minD;
    }

    for (let i = 0; i < l1; ++i, flip = cutHalf - flip) {
        ch = s1[i];
        chl = ch.toLowerCase();

        buf[flip] = (i + 1) * minI;

        ii = flip;
        ii2 = cutHalf - flip;

        for (j = 0; j < l2; ++j, ++ii, ++ii2) {
            cost = (ch === s2[j] ? 0 : (chl === s2[j].toLowerCase()) ? cri : cr);
            buf[ii + 1] = Math.min(buf[ii2 + 1] + cd, buf[ii] + ci, buf[ii2] + cost);
        }
    }
    return buf[l2 + cutHalf - flip];
}