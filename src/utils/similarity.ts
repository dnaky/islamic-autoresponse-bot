function findSimilarity(str: string, cmp: string) {
  var longer = str;
  var shorter = cmp;
  if (str.length < cmp.length) {
    longer = cmp;
    shorter = str;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (
    //@ts-ignore
    (longerLength - ed(longer, shorter)) / parseFloat(longerLength)
  );
}

function ed(str: string, cmp: string) {
  str = str.toLowerCase();
  cmp = cmp.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= str.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= cmp.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (str.charAt(i - 1) != cmp.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[cmp.length] = lastValue;
  }
  return costs[cmp.length];
}

export { findSimilarity };
