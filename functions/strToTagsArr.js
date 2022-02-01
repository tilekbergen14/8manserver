function strToTagsArr(tags) {
  const tagsArr = [];
  let start = 0;
  for (let i = 0; i < tags.length; i++) {
    if (
      (tags[i] === "#" || tags[i] === " ") &&
      tags[i + 1] !== "#" &&
      tags[i + 1] !== " "
    ) {
      tagsArr.push(tags.slice(start, i));
      start = i + 1;
    }
  }
  return tagsArr;
}

module.exports = strToTagsArr;
